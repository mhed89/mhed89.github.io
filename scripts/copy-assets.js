import { copyFileSync, mkdirSync, readdirSync, statSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = join(__dirname, "..");

// Recursive copy function
function copyRecursive(src, dest) {
  const stat = statSync(src);
  const filename = src.split("/").pop();

  // Skip script.js - Vite will bundle it
  if (filename === "script.js") {
    console.log(
      `Skipped: ${src.replace(rootDir, "")} (will be bundled by Vite)`,
    );
    return;
  }

  if (stat.isDirectory()) {
    mkdirSync(dest, { recursive: true });
    const entries = readdirSync(src);

    for (const entry of entries) {
      copyRecursive(join(src, entry), join(dest, entry));
    }
  } else {
    mkdirSync(dirname(dest), { recursive: true });
    copyFileSync(src, dest);
    console.log(`Copied: ${src.replace(rootDir, "")}`);
  }
}

console.log("Copying assets to public folder...\n");

// Copy directories
const copies = [
  { src: "content", dest: "public/content" },
  { src: "includes", dest: "public/includes" },
  { src: "css", dest: "public/css" },
  { src: "blog", dest: "public/blog" },
];

for (const { src, dest } of copies) {
  const srcPath = join(rootDir, src);
  const destPath = join(rootDir, dest);

  try {
    copyRecursive(srcPath, destPath);
  } catch (err) {
    console.error(`Error copying ${src}:`, err.message);
  }
}

console.log("\nAssets copied successfully!\n");
