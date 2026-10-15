# ashesule.com

Personal site for Ashe Sule, IT Professional. Static HTML deployed on Vercel.

## Editing

- Content lives in `index.html` (404 page: `404.html`). Scroll animations and active nav live in `main.js`.
- Styles are Tailwind CSS. Source is `src/input.css`; `styles.css` is the built output and is committed.
- After changing classes in the HTML or editing `src/input.css`, rebuild the CSS:

```bash
npm install
npm run build:css
```

## Deploy

Push to `main` and Vercel deploys automatically. Security headers and redirects are in `vercel.json`.
