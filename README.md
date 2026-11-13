# AgriLume Web

Earth-observation learning tool for Bangladeshi farming decisions: real NASA climate history for all 64 districts,
clearly labelled future scenarios, and a transparent educational crop model, in Bangla and English.

**Live:** https://agrilume-web.vercel.app · **Time Travel:** https://agrilume-web.vercel.app/time-travel

> Educational demonstration — **not** a validated forecast or advisory service. Crop results are a relative index
> (100 = average past climate), never tonnes per hectare. For farm decisions contact your Upazila Agriculture Office
> or the Krishi Call Centre (16123). Not endorsed by NASA.

## What is real today

| Feature | Data | Status |
|---|---|---|
| Climate history, 1981–2025, every district | NASA POWER daily → monthly means (bundled at build time, SHA-256 traced) | ✓ |
| Future 2033 (2031–2035) | NASA NEX-GDDP-CMIP6 SSP2-4.5, 2-model subset | ✓ one window only |
| Other future years | Observed climate + significant trend + your what-if changes | ✓ labelled "what-if" |
| Scenario A vs B comparison | Same model, two inputs, plain-language reasons | ✓ |
| Vegetation greenness | MODIS NDVI 2021–2025 via ORNL DAAC | ✓ for processed districts |
| Soil moisture, IMERG, HLS, ET, elevation | — | registered only, not used |
| Android app | — | not released (no APK exists) |

Every number carries a data-kind label: observed · observed-filled · NASA projection · what-if · simulator.

## Documentation
* [docs/METHODOLOGY.md](docs/METHODOLOGY.md) — formulas, assumptions, delta method, crop model
* [docs/DATA_PROVENANCE.md](docs/DATA_PROVENANCE.md) — NASA dataset matrix, endpoints, licences
* [docs/VALIDATION.md](docs/VALIDATION.md) — what was checked and what was **not**
* [docs/AUDIT_2026-11-13.md](docs/AUDIT_2026-11-13.md) — issues found and fixed in this upgrade
* [docs/DEMO.md](docs/DEMO.md) — 5-minute demonstration script
* [docs/NASA_SPACE_APPS_SELF_CHECK.md](docs/NASA_SPACE_APPS_SELF_CHECK.md) — competition self-check, including the build-window gate

## Run it

```bash
npm ci
npm run dev                 # http://localhost:3000
npm run typecheck && npm run lint && npm test
npm run build               # static export to out/
npm run test:e2e            # Playwright, desktop + mobile viewport (after build)
```

Requires Node 22+. On Windows, run tests from a path with an upper-case drive letter (`D:\…`); a lower-case `d:`
working directory makes Vitest load twice and every suite fails with "Cannot read properties of undefined (reading
'config')".

## Rebuild the NASA data

```bash
npm run data:power          # NASA POWER, 64 districts (~3 min)
npm run data:ndvi           # MODIS NDVI via ORNL DAAC (slow public service; resumable)
node scripts/fetch-power-districts.mjs --derive   # offline rebuild from cached raw responses
python scripts/nex_gddp_cmip6_extract.py          # CMIP6 packs (needs rasterio)
```

## Deployment

Static export (`output: "export"`): no server, secrets or API keys are needed. All NASA data are fetched at build
time; the browser calls NASA POWER directly only for custom map points. Vercel serves the site (`vercel.json`
keeps the farming-game URL). `.github/workflows/deploy.yml` is a manual GitHub Pages alternative. On plain static
hosts, Next 16 RSC prefetch files use dotted names that only Vercel maps; navigation still works (full page load).

## Other routes
`/nasa-data` dataset registry · `/bangladesh-agriculture` official agencies · `/recycling` residue estimate ·
`/agrilume-farming-game.html` standalone educational game (illustrative economics; camera hand-poses are control
gestures, **not** sign-language translation).

## Licences
Code: see repository. Data: NASA open data (see provenance). Fonts: SIL OFL. MediaPipe: Apache-2.0.
