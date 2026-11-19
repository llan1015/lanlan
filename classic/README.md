# Lan Lan — Personal Website

Static personal website. No build step. Files:

- `index.html` — main page (GitHub Pages picks this up automatically)
- `styles.css` — all styling
- `content.js` — all text content (bilingual EN / 中文). **Edit this to update copy.**
- `app.jsx` — React/JSX, compiled in-browser by Babel
- `assets/portrait.png` — profile photo

## How to update content

Open `content.js` — every visible string is here under English (`en`) and 中文 (`zh`) keys. Edit the strings, save, and refresh.

To replace the photo: drop a new image at `assets/portrait.png` (any size — CSS will fit it).

## Deploy to GitHub Pages

1. Go to [github.com](https://github.com) and create a new repository. Name it `lanlan` (or anything you like). Make it **Public**.
2. Upload all the files in this folder to the repo:
   - Either click **"uploading an existing file"** on the new-repo page and drag everything in
   - Or use the GitHub Desktop app / `git push`
3. In the repo, click **Settings → Pages** (left sidebar).
4. Under **"Build and deployment"**, set:
   - **Source**: `Deploy from a branch`
   - **Branch**: `main`, `/ (root)`
5. Click **Save**. Wait 1–2 minutes.
6. Your site goes live at `https://<your-github-username>.github.io/<repo-name>/`

### Custom domain (optional)

If you buy a domain (e.g. `lanlan.com`):
1. Add a file named `CNAME` to the repo with just your domain inside.
2. In your domain registrar's DNS settings, add a `CNAME` record pointing to `<your-github-username>.github.io`.
3. In repo **Settings → Pages**, fill in the custom domain field.

## Local preview

Just double-click `index.html` to open it in your browser. Or run a local server:

```bash
python3 -m http.server 8000
```

Then open `http://localhost:8000`.
