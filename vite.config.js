import { defineConfig } from "vite";
import { resolve } from "path";
import { fileURLToPath } from "url";

const __dirname = fileURLToPath(new URL(".", import.meta.url));

export default defineConfig({
  root: ".",
  base: "/",
  publicDir: "public",
  build: {
    outDir: "dist",
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
        blog: resolve(__dirname, "blog.html"),
        projects: resolve(__dirname, "projects.html"),
        knowledge: resolve(__dirname, "knowledge.html"),
        "example-post": resolve(__dirname, "blog/example-markdown-post.html"),
      },
      output: {
        manualChunks: {
          vendor: ["marked", "mermaid"],
        },
      },
    },
    minify: "esbuild",
    sourcemap: false,
    copyPublicDir: true,
  },
  server: {
    port: 8686,
    open: true,
  },
  optimizeDeps: {
    include: ["marked", "mermaid"],
  },
});
