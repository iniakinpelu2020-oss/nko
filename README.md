# nko

Website for **IDEAL FRESH 360 CLEANING AND FACILITY SERVICE LTD** — Vite + React, Three.js hero orb, GSAP motion, read-only Sanity CMS layer.

## Cloudflare Pages build settings

- Framework preset: **None**
- Build command: `npm run build`
- Build output directory: `dist`
- Node version: 20 or newer

## Local

```bash
npm install
npm run dev     # http://localhost:3000
npm run build
```

Optional CMS: set `VITE_SANITY_PROJECT_ID` and `VITE_SANITY_DATASET` (public, read-only). Without them the bundled fallback content is used.

Security headers ship in `public/_headers` and are copied to `dist` at build time.
