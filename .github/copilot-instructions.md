# Copilot Instructions — Markus Hedenborn

## Project Overview

A minimalist personal maker blog built with **vanilla HTML, CSS, and JavaScript** — no frameworks. Uses Vite for bundling and optimization. Hosted on GitHub Pages (mhed89.github.io). Topics: IoT, embedded systems, 3D printing, and tooling by Markus Hedenborn.

## Architecture

### Site structure:

1. **Project pages**: Full HTML files in [projects/](../projects/) for individual hobby projects
2. **Blog posts**: Markdown files in [blog/](../blog/) with HTML wrappers, listed in [content/posts.json](../content/posts.json)
3. **Dynamic pages**: [knowledge.html](../knowledge.html) fetches markdown from [content/](../content/) and renders client-side

### Navigation:

- **Hem** (`/`) — Latest posts + intro about the blog
- **Blogg** (`/blog.html`) — All blog posts
- **Projekt** (`/projects.html`) — Project listing with links to single pages
- **Kunskapsbank** (`/knowledge.html`) — Curated links to repos, articles, tools

### Key files:

- [index.html](../index.html) — homepage with intro section and post cards
- [projects.html](../projects.html) — project overview page
- [projects/\*.html](../projects/) — individual project pages (e.g., esp32-sensor-hub.html)
- [css/main.css](../css/main.css) — imports all CSS modules (variables, components, layout)
- [script.js](../script.js) — ES module with markdown renderer + component loader
- [content/\*.md](../content/) — source for knowledge.md
- [content/\*.json](../content/) — posts.json and projects.json for dynamic listings
- [includes/](../includes/) — header.html, footer.html, head-common.html components
- [package.json](../package.json) — dependencies (marked, mermaid, vite)
- [vite.config.js](../vite.config.js) — build configuration

## DSetup:

```bash
npm install
```

### Local development:

```bash
npm run dev
```

Opens at http://localhost:8686 with hot module reload

### Build for production:

```bash
npm run build
```

Outputs optimized files to `/dist` folder

### Preview production build:

```bash
npm run preview
```

**Critical**: Always use `npm run dev` (Vite) for development — it handles ES module imports from node_modules. Plain HTTP servers won't work with npm dependencies

**Critical**: Always use `npm run dev` (Vite) for development — it handles ES module imports from node_modules. Plain HTTP servers won't work with npm dependencies.

**Critical**: Pages using markdown (knowledge) require a local server due to `fetch()` calls. Direct `file://` opening won't work.

## Code Conventions

### Content rules:

- **ES modules**: [script.js](../script.js) imports `marked` and `mermaid` from node_modules
- **Markdown renderer**: Uses `marked.js` with custom renderer for Mermaid diagrams
- **Vite bundling**: Optimizes and bundles dependencies for production
- **Progressive enhancement**: Scripts load as modules, components load dynamicall

### HTML structure:

- Semantic elements: `<header>`, `<main>`, `<article>`, `<section>`
- ARIA labels: `aria-labelledby`, `role="list"` for accessibility
- Consistent header/footer across all pages with `.site-header` and `.site-footer`

### CSS patterns:

- **CSS Variables**: All colors/fonts/sizes in `:root` ([styles.css](../styles.css#L1-L10))
- \*\*Monospace hmarkdown posts:

1. Create markdown file in [blog/](../blog/) (e.g., `my-post.md`)
2. Copy [templates/markdown-post.html](../templates/markdown-post.html) to [blog/](../blog/) (e.g., `my-post.html`)
3. Update `<title>`, `<meta name="description">`, and `data-src` attribute
4. Add entry to [content/posts.json](../content/posts.json) with title, url, date, tags, excerpt
5. Post will automatically appear on homepage

### Adding new projects:

1. Create new HTML file in [projects/](../projects/)
2. Add entry to [content/projects.json](../content/projects.json)
3. Update `.card-meta` with relevant tags
4. Follow existing structure from project examples

- **Progressive enhancement**: Script defers and fails gracefully
- **Markdown renderer** ([script.js](../script.js#L19-L58)): Handles `#`, `##`, lists (`-`/`*`), code fences (` ``` `), inline code (`` ` ``), paragraphs
- **No external libs** — custom `renderMarkdown()` function escapes HTML for security

### Projects:

- Write fully-formed HTML in `projects/` directory
- Include proper rCreate `.md` files in [blog/](../blog/), changes reflect immediately in dev mode
- **Markdown content**: Edit files in [content/](../content/) — hot reload in dev
- **Design tweaks**: Modify CSS variables in [css/variables.css](../css/variables.css)
- **Posts/Projects**: Update JSON files in [content/](../content/) to add/remove from listings

## Technical Stack

- **Vite**: Build tool and dev server with hot module reload
- **marked.js**: Full-featured markdown parser (GFM support)
- **mermaid**: Diagram and flowchart rendering in markdown
- **Alpine.js**: Minimal client-side interactivity (CDN)
- **No frameworks**: Pure HTML, CSS, JS — just bundled for optimization

## Constraints

- **No heavy frameworks**: No React, Vue, etc. Keep it vanilla
- **GitHub Pages compatible**: Static build output in `/dist`
- **Markdown features**: Full GFM support including tables, Mermaid diagrams, code blocks)

### Naming conventions:

- **Files & URLs**: English slugs (e.g., `esp32-sensor-hub.html`, `/projects`, `/knowledge`)
- **Content & UI**: Swedish text for readers
- **Code & Comments**: English (standard for programming)

## Styling Guidelines

- **Accent color**: Use `var(--accent)` for interactive states (hover, focus)
- **Muted text**: `var(--muted)` for metadata and secondary info
- **Spacing**: Generous whitespace via margins (e.g., `.wrap` has `margin: 40px auto`)
- **Border radius**: `var(--radius)` (10px) for cards and images

## Content Updates

- **Blog posts**: Edit HTML directly in `blog/` folder
- **Lists (todo/thoughts/reading)**: Edit markdown in [content/](../content/) — changes reflect immediately on page refresh
- **Design tweaks**: Modify CSS variables in [styles.css](../styles.css#L1-L10)

## Constraints

- **No build tools**: No npm, webpack, or preprocessors
- **No frameworks**: No React, Vue, etc. Keep it vanilla
- **GitHub Pages compatible**: Static files only
- **Markdown renderer limits**: Only supports basic syntax (no tables, footnotes, or GFM extensions)
