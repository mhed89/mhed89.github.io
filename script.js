// Minimal client-side helpers and markdown renderer.
import { marked } from "marked";
import mermaid from "mermaid";

mermaid.initialize({ startOnLoad: false, theme: "default" });

// Load common head tags (fonts, styles, scripts)
async function loadCommonHead() {
  const placeholder = document.querySelector("head-placeholder");
  if (!placeholder) return;

  try {
    const resp = await fetch("/includes/head-common.html");
    if (!resp.ok) throw new Error("Failed to fetch head-common.html");
    const html = await resp.text();

    // Create temp container and parse HTML
    const temp = document.createElement("div");
    temp.innerHTML = html;

    // Insert all elements before the placeholder, then remove it
    const elements = Array.from(temp.children);
    elements.forEach((el) => {
      placeholder.parentNode.insertBefore(el, placeholder);
    });

    // Remove placeholder after all insertions
    placeholder.remove();
  } catch (err) {
    console.error("Failed to load common head:", err);
  }
}

// Load header and footer components
async function loadComponent(selector, url) {
  const el = document.querySelector(selector);
  if (!el) return;
  try {
    const resp = await fetch(url);
    if (!resp.ok) throw new Error("Failed to fetch " + url);
    const html = await resp.text();
    el.innerHTML = html;

    // Set footer year after loading footer
    if (selector === "#footer-placeholder") {
      const y = document.getElementById("year");
      if (y) y.textContent = new Date().getFullYear();
    }
  } catch (err) {
    console.error("Failed to load component:", err);
  }
}

// Run head loading immediately (before DOMContentLoaded for FOUC prevention)
if (document.querySelector("head-placeholder")) {
  loadCommonHead();
}

// Render posts from JSON
async function renderPosts(containerSelector, jsonUrl, maxPosts = null) {
  const container = document.querySelector(containerSelector);
  if (!container) return;

  try {
    const resp = await fetch(jsonUrl);
    if (!resp.ok) throw new Error("Failed to fetch " + jsonUrl);
    const posts = await resp.json();

    const postsToRender = maxPosts ? posts.slice(0, maxPosts) : posts;

    container.innerHTML = postsToRender
      .map(
        (post) => `
      <article class="card" role="listitem">
        <a class="card-link" href="${post.url}">
          <h3 class="card-title">${post.title}</h3>
          <p class="card-meta">${
            post.date ? post.date + " • " : ""
          }${post.tags.join(" · ")}</p>
          <p class="card-excerpt">${post.excerpt}</p>
        </a>
      </article>
    `,
      )
      .join("");
  } catch (err) {
    console.error("Failed to load posts:", err);
    container.innerHTML = "<p>Kunde inte ladda inlägg.</p>";
  }
}

// Render combined posts from multiple JSON sources
async function renderCombinedPosts(
  containerSelector,
  jsonUrls,
  maxPosts = null,
) {
  const container = document.querySelector(containerSelector);
  if (!container) return;

  try {
    const responses = await Promise.all(
      jsonUrls.map((url) => fetch(url).then((r) => (r.ok ? r.json() : []))),
    );

    // Combine and sort by date (newest first)
    const allPosts = responses
      .flat()
      .sort((a, b) => new Date(b.date) - new Date(a.date));

    const postsToRender = maxPosts ? allPosts.slice(0, maxPosts) : allPosts;

    container.innerHTML = postsToRender
      .map(
        (post) => `
      <article class="card" role="listitem">
        <a class="card-link" href="${post.url}">
          <h3 class="card-title">${post.title}</h3>
          <p class="card-meta">${
            post.date ? post.date + " • " : ""
          }${post.tags.join(" · ")}</p>
          <p class="card-excerpt">${post.excerpt}</p>
        </a>
      </article>
    `,
      )
      .join("");
  } catch (err) {
    console.error("Failed to load combined posts:", err);
    container.innerHTML = "<p>Kunde inte ladda inlägg.</p>";
  }
}

// Initialize page content - called on DOMContentLoaded and after navigation
async function initializePage() {
  await loadComponent("#header-placeholder", "/includes/header.html");
  await loadComponent("#footer-placeholder", "/includes/footer.html");

  // Set footer year (fallback if footer already exists in page)
  const y = document.getElementById("year");
  if (y) y.textContent = new Date().getFullYear();

  // Render dynamic post lists (combined or single source)
  const postList = document.querySelector(
    ".post-list[data-json], .post-list[data-json-multiple]",
  );
  if (postList) {
    const jsonUrl = postList.getAttribute("data-json");
    const jsonUrls = postList.getAttribute("data-json-multiple");
    const maxPosts = postList.getAttribute("data-max");

    if (jsonUrls) {
      // Multiple sources (for homepage)
      await renderCombinedPosts(
        ".post-list",
        jsonUrls.split(",").map((url) => url.trim()),
        maxPosts ? parseInt(maxPosts) : null,
      );
    } else if (jsonUrl) {
      // Single source (for blog page)
      await renderPosts(".post-list", jsonUrl, maxPosts ? parseInt(maxPosts) : null);
    }
  }

  // Render dynamic project grids
  if (document.querySelector(".projects-grid[data-json]")) {
    const grid = document.querySelector(".projects-grid[data-json]");
    const jsonUrl = grid.getAttribute("data-json");
    await renderPosts(".projects-grid[data-json]", jsonUrl);
  }

  // If this page has a container .markdown-async that specifies data-src, fetch and render it.
  const asyncElements = document.querySelectorAll(".markdown-async[data-src]");
  for (const el of asyncElements) {
    const src = el.getAttribute("data-src");
    if (!src) continue;
    try {
      const resp = await fetch(src);
      if (!resp.ok) throw new Error("Failed to fetch " + src);
      const md = await resp.text();
      el.innerHTML = await renderMarkdown(md);
    } catch (err) {
      el.textContent = "Unable to load content.";
      console.error(err);
    }
  }

  // Handle standalone markdown posts (e.g., blog/my-post.md)
  if (document.querySelector(".markdown-post[data-src]")) {
    const postContainer = document.querySelector(".markdown-post[data-src]");
    const src = postContainer.getAttribute("data-src");
    if (src) {
      try {
        const resp = await fetch(src);
        if (!resp.ok) throw new Error("Failed to fetch " + src);
        const md = await resp.text();
        postContainer.innerHTML = await renderMarkdown(md);
      } catch (err) {
        postContainer.textContent = "Unable to load post content.";
        console.error(err);
      }
    }
  }
}

document.addEventListener("DOMContentLoaded", initializePage);

// Enhanced markdown renderer using marked.js with Mermaid support
async function renderMarkdown(md) {
  // Configure marked with custom renderer for Mermaid
  const renderer = new marked.Renderer();
  const originalCode = renderer.code.bind(renderer);

  renderer.code = function (code, language) {
    if (language === "mermaid") {
      return `<div class="mermaid">${code}</div>`;
    }
    return originalCode(code, language);
  };

  marked.setOptions({
    renderer: renderer,
    breaks: true,
    gfm: true,
    headerIds: true,
    mangle: false,
  });

  // Render markdown
  const html = marked.parse(md);

  // Render Mermaid diagrams if present
  if (html.includes('class="mermaid"')) {
    setTimeout(async () => {
      await mermaid.run({
        querySelector: ".mermaid",
      });
    }, 100);
  }

  return `<div class="content">${html}</div>`;
}

// Navigation API - Enhanced page transitions with direction detection
if ("navigation" in window) {
  navigation.addEventListener("navigate", (e) => {
    // Only intercept same-origin navigations
    if (!e.canIntercept || e.hashChange || e.downloadRequest) return;

    const url = new URL(e.destination.url);

    // Skip if external link
    if (url.origin !== location.origin) return;

    // Determine navigation direction
    const navigationType = e.navigationType;
    const isBackward = navigationType === "traverse";
    const isForward = navigationType === "push";

    // Intercept navigation for smooth View Transitions
    e.intercept({
      handler: async () => {
        // Fetch new page
        const response = await fetch(url.pathname);
        const html = await response.text();

        const parser = new DOMParser();
        const newDoc = parser.parseFromString(html, "text/html");

        // Update page content with View Transition
        const updateDOM = () => {
          document.title = newDoc.title;
          document.body.innerHTML = newDoc.body.innerHTML;
        };

        if (document.startViewTransition) {
          // Apply transition type based on navigation direction
          const transitionTypes = [];
          if (isBackward) transitionTypes.push('backward');
          else if (isForward) transitionTypes.push('forward');

          const transition = document.startViewTransition({
            update: updateDOM,
            types: transitionTypes,
          });
          
          await transition.finished;
        } else {
          updateDOM();
        }
        
        // Re-initialize page after DOM update
        await initializePage();
      },
    });
  });
}

// Fallback for older browser compatibility
function escapeHtml(s) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}