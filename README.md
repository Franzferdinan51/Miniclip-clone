# VibeClip — play the browser-game revival

A modern Miniclip-style arcade for the browser-game revival: classic games ported to the web by fans, and brand-new originals built with AI. Every game is free, runs in a browser tab, and is credited to its creator with links to their site and to the game.

**No official hosted version.** This is a personal project, built for family and friends. The maintainer does not host a public copy — a link catalog of other people's games is not something to serve to the whole internet. If you want it online, fork this repo and host your own copy (enable GitHub Pages on your fork, or serve the folder with any static server, e.g. `python3 -m http.server`). All games belong to their respective creators; this catalog only links to them.

## How it works

Plain static site — no build step. `games.json` is the whole catalog; `app.js` renders it.

## Add a game

1. Add one entry to `games.json`:
   - `slug`, `title`, `blurb` (1–2 sentences), `description` (2–4 sentences, shown in the detail popup)
   - `category` (Shooters, Open World, Racing, Strategy, Adventure, Simulation, Puzzle, Arcade, Sports)
   - `tags` (lowercase; use `multiplayer` / `co-op` / `online` where true)
   - `playUrl` — must be the actual game, playable in a browser. Verify it loads before adding.
   - `developer` + `developerUrl` — the creator's name and their main website. Credit is the whole point; don't ship a listing without it.
   - `madeWith` — tools/engine ("Cursor, Claude · Three.js", "WASM port", …)
   - `originalBy` (optional) — the original game's creator for ports/remakes
   - `type` — `ai` (built with AI), `port` (browser port), or `remake`
   - `badge` (optional) — awards, "Classic Port", etc.
   - `thumb` — path to a thumbnail in `assets/thumbs/`, or `null` to use a generated cover (`assets/thumbs/<slug>-cover.jpg`)
   - `featured: true` on at most one game (the hero slot)
2. Thumbnail: save the game's official share image (og:image) as `assets/thumbs/<slug>.jpg`, ~800px wide. No thumbnail? Generate a cover card instead — see the pattern of any existing `*-cover.jpg`.
3. Commit and push; GitHub Pages redeploys automatically.

## Rules of the shelf

- **Browser-playable only.** If it needs a download, launcher or supplied ROM files, it doesn't go up without a loud note in its description.
- **Prefer Three.js.** When there's a choice of what to add or feature, Three.js games go first (Duckets' standing preference, 2026-11-08).
- **Verify before listing.** Open the link; if it's dead, parked or taken down, it doesn't ship.
- **Credit everyone.** Developer, original creator where relevant, and a working link to both the game and the developer's site.
