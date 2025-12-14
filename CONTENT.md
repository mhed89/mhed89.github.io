# Content Management

## Lägg till nya blogginlägg

1. **Skriv innehållet** - Skapa en HTML-fil i `blog/` eller `projects/` mappen
2. **Uppdatera index** - Redigera `content/posts.json` och lägg till:

```json
{
  "title": "Din titel här",
  "date": "YYYY-MM-DD",
  "tags": ["tag1", "tag2", "tag3"],
  "excerpt": "Kort beskrivning som visas på startsidan",
  "url": "blog/din-fil.html"
}
```

3. **Klart!** - Postern visas automatiskt på startsidan

## Lägg till nya projekt

1. **Skapa projektsida** - Lägg HTML-fil i `projects/` mappen
2. **Uppdatera index** - Redigera `content/projects.json`:

```json
{
  "title": "Projektnamn",
  "tags": ["tag1", "tag2"],
  "excerpt": "Kort beskrivning",
  "url": "projects/projekt.html"
}
```

3. **Klart!** - Projektet visas automatiskt på projektsidan

## Innehållsfiler

- `content/posts.json` - Lista över alla blogginlägg (nyast först)
- `content/projects.json` - Lista över alla projekt
- `content/knowledge.md` - Kunskapsbank (markdown)
- `blog/*.md` - Markdown-filer för blogginlägg

## Fördelar

- **Inget HTML-kladd** - Lägg bara till en rad i JSON-filen
- **Konsistent formatering** - JavaScript renderar alla kort på samma sätt
- **Lätt att underhålla** - All metadata på ett ställe
- **Snabbt** - Inga build steps, bara ren JSON

## Tips

- Håll `posts.json` sorterad med nyaste inlägget först
- Använd konsekventa tag-namn för enklare filtrering senare
- Datum-format: `YYYY-MM-DD` för enkel sortering
