# mhed89.github.io

Personlig maker-blogg av Markus Hedenborn. Vanilla HTML/CSS/JS med Vite för optimering.

## Utveckling

### Installation

```bash
npm install
```

### Dev server

```bash
npm run dev
```

Öppnar automatiskt på http://localhost:8686 med hot reload

### Bygga för produktion

```bash
npm run build
```

Genererar optimerade filer i `/dist`

### Förhandsgranska build

```bash
npm run preview
```

## Projektstruktur

```
├── blog/              # Blogginlägg (HTML + MD)
├── content/           # Markdown-innehåll och JSON-data
│   ├── knowledge.md   # Kunskapsbank
│   ├── posts.json     # Blogginlägg metadata
│   └── projects.json  # Projekt metadata
├── css/               # Stilmallar (variabler, komponenter, layout)
├── includes/          # Header/footer komponenter
├── projects/          # Projektsidor
├── templates/         # HTML-mallar
├── index.html         # Startsida
├── blog.html          # Alla blogginlägg
├── projects.html      # Projektöversikt
├── knowledge.html     # Kunskapsbank (dynamisk MD)
└── script.js          # JavaScript (markdown, komponenter)
```

## Lägga till nytt inlägg

1. Skapa markdown-fil i `/blog/your-post.md`
2. Kopiera `/templates/markdown-post.html` till `/blog/your-post.html`
3. Uppdatera title, description och `data-src`
4. Lägg till i `content/posts.json`:
   ```json
   {
     "title": "Din titel",
     "url": "/blog/your-post.html",
     "date": "2025-12-14",
     "tags": ["tag1", "tag2"],
     "excerpt": "Kort beskrivning"
   }
   ```

## Deployment

GitHub Actions bygger och deployer automatiskt vid push till `main`.

## Tekniker

- **Vite** - Bundling och dev server
- **marked.js** - Markdown-rendering (GFM)
- **mermaid** - Diagram-support
- **Alpine.js** - Minimal interaktivitet (CDN)
- **Vanilla JS/CSS** - Inga frameworks
