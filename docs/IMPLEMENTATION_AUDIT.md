# AgriLume Web — Comprehensive Implementation and Branch Audit
**Date:** 2026-11-13  
**Auditor:** Principal Software Architect, NASA Earth Observation Scientist, Senior Full-Stack Engineer, Scientific QA  
**Feature Branch:** `feat/earth-intelligence-lab` (derived from `upgrade/scientific-integrity`)  
**Branches Compared:** `main`, `fix/live-nasa-and-android-link`, `upgrade/scientific-integrity`

---

## 1. Branch Hierarchy & Divergence Analysis

| Branch | Base Commit | Head State | Key Characteristics |
|---|---|---|---|
| `main` | `3b64616` / `9ee31be` | `560c810` | Original competition submission base; updated documentation and team profile; lacks 64-district build-time data and scientific fixes. |
| `fix/live-nasa-and-android-link` | `3b64616` | `65e0804` | Intermediate hotfix branch replacing placeholder download buttons with direct links to Android app repository. |
| `upgrade/scientific-integrity` | `3b64616` | `06b02bc` | Major scientific refactor: Daily POWER aggregation, 64-district bundled real climate data, MODIS NDVI pipeline from ORNL DAAC, Scenario A vs B compare engine, and Playwright E2E suite. |
| `feat/earth-intelligence-lab` | `upgrade/scientific-integrity` | Working branch | Comprehensive transformation into an interactive Earth Intelligence and Agricultural Decision Lab with typed NASA adapters, MapLibre Earth Intelligence map, Decision Lab, Climate Risk evidence lab, and enhanced educational game. |

---

## 2. Subsystem Audit Matrix

Legend:
- **IMPLEMENTED**: Complete, verified with unit/e2e tests, deterministic behavior, scientifically sound.
- **PARTIAL**: Basic functioning exists, but missing edge cases, additional datasets, or comprehensive multi-district coverage.
- **BROKEN**: Produces misleading, non-deterministic, or crashing results.
- **MISSING**: Not present in the repository.
- **UNVERIFIED**: Code exists but lacks automated tests or physical device validation.

| Subsystem / Feature | Status | Evaluation & Findings |
|---|---|---|
| **Next.js Architecture** | **IMPLEMENTED** | Next.js 16.4.5 with App Router, Turbopack, Tailwind CSS v4, React 19.2.8. Configured for static export (`output: "export"`). Bundled local fonts (`Inter`, `Space Grotesk`, `Noto Sans Bengali`). Zero external font telemetry. |
| **3D Time Travel Engine** | **IMPLEMENTED** | Three.js (`@react-three/fiber` v9 + `@react-three/drei` v10 + `@react-three/xr` v6). Procedural field, crop models (transplant, tillering, heading, maturity, harvest), atmospheric rendering, time slider (1981–2035). |
| **2D Fallback for Low-End / Mobile** | **PARTIAL** | `Fallback2D.tsx` exists when WebGL context creation fails. Visual fidelity is functional but lacks side-by-side scenario visualization. |
| **NASA POWER Weather Integration** | **IMPLEMENTED** | Bundled real monthly aggregations (1981–2025) for all 64 districts in `public/data/power/` derived from daily `T2M_MAX`, `T2M_MIN`, `PRECTOTCORR`. Real daily 2001–2025 fixture for Rajshahi. Live browser fallback for custom coordinates. Correct `parseDaily` aggregation logic. |
| **NASA POWER Climate Projections** | **PARTIAL** | Previously only NEX-GDDP-CMIP6 delta pack was loaded. NASA POWER Projection API endpoint `/api/temporal/projection/monthly/point` adapter was missing. |
| **NEX-GDDP-CMIP6 Scenarios** | **PARTIAL** | Bundled 2-model COG subset (ACCESS-CM2, CMCC-ESM2) for SSP2-4.5, 2031–2035 mean centered on 2033. Honest baseline window enforcement (2010–2014). Needs multi-scenario spread (SSP1-2.6, SSP5-8.5) and uncertainty intervals. |
| **Crop Growth & Water Balance Simulator** | **IMPLEMENTED** | FAO-56 dual crop coefficient model, Hargreaves ET₀ calculation, water stress factor ($K_s$), salinity stress, heat stress penalties during flowering/heading. Validated across 64 districts with bounded indices [0, 200]. |
| **Scenario A vs B Decision Twin** | **PARTIAL** | `lib/timetravel/compare.ts` and `ComparePanel.tsx` provide baseline comparison (e.g. Current vs Alternative irrigation/planting). Needs dedicated full-page laboratory route (`/decision-lab`) with interactive dual-scenario visualization. |
| **Hazard & Risk Simulations (Flood/Drought/Salinity)** | **PARTIAL** | Basic hazard modifiers in `lib/timetravel/hazards.ts`. Lacks dedicated evidence-grounded risk explorer route (`/climate-risk`) with historical anomaly overlays (1988, 1998, 2020 floods; Barind drought trends). |
| **Earth Intelligence Map** | **MISSING** | Route `/earth-intelligence` was missing. Needs interactive Bangladesh map, coordinate/district inspection, MODIS NDVI layers, rainfall/temperature charts, and satellite context. |
| **MODIS NDVI Pipeline (ORNL DAAC)** | **IMPLEMENTED** | `scripts/fetch-modis-ndvi.mjs` fetches real 250m 16-day MOD13Q1 composite data. Manifest traces URLs and SHA-256 hashes. Bundled for 46 districts in `public/data/ndvi/`. |
| **NASA HLS (Harmonized Landsat Sentinel)** | **PARTIAL** | Documented in registry; adapter with real demo samples and CMR search interface needed. |
| **NASA SMAP Soil Moisture** | **PARTIAL** | Documented in registry; adapter with root-zone volumetric moisture and Barind baseline needed. |
| **NASA GPM IMERG Precipitation** | **PARTIAL** | Documented in registry; adapter with monsoon onset and precipitation anomalies needed. |
| **NASA OPERA Surface Water (DSWx-HLS)** | **PARTIAL** | Documented in registry; adapter with water classification and historical flood masks needed. |
| **Farming Educational Game** | **PARTIAL** | Standalone `public/agrilume-farming-game.html`. Responsive canvas game, but lacked structured 5-mission curriculum, pre/post-test scoring, and save/resume state. |
| **Voice and Gesture Interaction** | **UNVERIFIED** | Web Speech API synthesis/recognition hooks and MediaPipe hand tracking code in `public/mediapipe/`. Requires physical webcam and microphone; non-critical to core decision science. |
| **Dataset Registry & Provenance** | **IMPLEMENTED** | `lib/timetravel/nasa-datasets.ts` with explicit 5-stage pipeline tracking (Registered, Adapter, Fetched, Processed, Used on screen). Zero conflation of registered vs used. |
| **Responsive UI & Design** | **IMPLEMENTED** | Tailwind CSS v4, dark aerospace palette (#050A12, #0B1220, #59D98E, #36BFFA, #D7A86E), touch targets >= 44px (`min-h-11`), no horizontal overflow. |
| **Bilingual Support (Bangla & English)** | **IMPLEMENTED** | Explicit bilingual strings across UI components, toggle buttons, and locale-aware formatting. |
| **Explainable Copilot** | **PARTIAL** | Rule-based offline helper in `lib/timetravel/assistant.ts` with 26 unit tests. Answers crop, climate, and data questions deterministically. Needs multi-language support (Bangla/English/Banglish) and explicit decision explanation modes. |
| **Automated Tests** | **IMPLEMENTED** | 144 unit tests passing in Vitest (`npm run test`). Playwright E2E suite (`npm run test:e2e`). Robustness sweeps over all 64 districts. |
| **CI / CD & Deployment** | **IMPLEMENTED** | `.github/workflows/ci.yml` runs typecheck, lint, test, build, and E2E. Vercel deployment configured in `vercel.json`. |

---

## 3. High-Priority Action Plan (Phases 1–11)

1. **Phase 1:** Eliminate silent district fallback; ensure distinct visual tags for Data Kind (Real Observation, Cached Observation, Model Projection, Educational Simulation, Unavailable Data).
2. **Phase 2:** Build typed adapters for POWER Weather, POWER Projections, HLS, SMAP, GPM IMERG, OPERA DSWx, and NEX-GDDP-CMIP6 with resilient retry/backoff, rate limiting, and authentic offline fixtures.
3. **Phase 3:** Construct the `/earth-intelligence` route with interactive Bangladesh map, layer controls, and real NASA data cards.
4. **Phase 4:** Construct the `/decision-lab` route for side-by-side agricultural decision twin modeling.
5. **Phase 5:** Construct the `/climate-risk` route for flood, drought, and salinity evidence analysis.
6. **Phase 6:** Upgrade `/time-travel` with multi-scenario comparison and model spread.
7. **Phase 7:** Enhance the Explainable Copilot with reasoning explanations in Bangla, English, and Banglish.
8. **Phase 8:** Upgrade `public/agrilume-farming-game.html` with 5 educational missions and pre/post-test scoring.
9. **Phase 9:** Polish navigation, layout responsiveness, contrast, and performance.
10. **Phase 10:** Author scientific validation docs (`SCIENTIFIC_VALIDATION.md`, `DATASET_PROVENANCE.md`, `MODEL_LIMITATIONS.md`, `DEMO_SCRIPT.md`, `IMPLEMENTATION_STATUS.md`).
11. **Phase 11:** Verify championship 90-second demo script and ensure production build passes cleanly.

