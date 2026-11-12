This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Agrilume Time Travel (VR) — `/time-travel`

3D/VR farm simulator for Bangladesh: observed NASA POWER history (2001–2025) → clearly-labelled what-if futures.
Works on PC (mouse/keyboard), phone (touch, Cardboard mode with gyro), and WebXR headsets. 2D fallback if WebGL is missing.

- Also: `/nasa-data` (dataset registry with honest integration status), `/bangladesh-agriculture` (official agencies; links only),
  `/recycling` (straw/husk circular-farm estimate), assistant + voice (Bangla/English) + hand-gesture control + captions.
- Honesty rules: every number is labelled observed / what-if / simulator; yield is a relative index; hazard scenes are not forecasts.
- Commands: `npm run dev`, `npm test`, `npm run typecheck`, `npm run lint`, `npm run build` (static export to `out/`).
- NASA NEX-GDDP-CMIP6 SSP2-4.5 packs are bundled at `public/data/projections/` for district centers. The current pack covers 2033 (2031–2035 mean, relative to 2010–2014); other years use the labelled fallback. Near-zero rainfall months keep a neutral multiplier rather than inventing a ratio. Regenerate with `python -m pip install rasterio` and `python scripts/nex_gddp_cmip6_extract.py`.
- Bangla Sign Language clips: see `public/bdsl/README.md` (only expert-verified clips are shown).
- **Read `docs/NASA_SPACE_APPS_SELF_CHECK.md` — includes the Gate 0 (build-window) warning and known limitations.**

## Agrilume Farming Game — `/agrilume-farming-game.html`

Standalone farming game with all 64 Bangladesh district choices, the current AgriLume crop set plus major local crop types, and six sequential levels: prepare, plant, irrigate, fertilize, grow and harvest. Level completions award coins and stars, saved locally in the browser.

Camera hand-pose controls are an optional hands-free prototype, processed locally. They are **not BdSL recognition or translation**; use verified BdSL materials only when reviewed by Deaf signers and qualified interpreters. Crop yields, fertilizer values and game economics are illustrative, not farming advice.
