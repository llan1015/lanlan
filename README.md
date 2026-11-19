# Lan Lan — personal site

Live at https://llan1015.github.io/lanlan/

A static site with no build step. The home page is one real-time 3D room (three.js with baked lighting); the content sits inside five records on the desk and in the top navigation.

- `index.html`, `app.js` — the page and the 3D viewer
- `room.json`, `meta.json`, `bake_*.webp` — the room model and its baked light textures
- `nyc.webp` — the view out of the window
- `vendor/` — three.js
- `classic/` — the earlier bilingual site, still served at `/lanlan/classic/`

GitHub Pages: Settings → Pages → Deploy from a branch → `main`, `/ (root)`.
