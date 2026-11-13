# AgriLume Time Travel — NASA Space Apps 2026 self-check

Date of this check: 2026-11-08. This is a **self-assessment using the team's own framework, not NASA's score**.
NASA's final judging criteria/weights arrive in the Submission & Judging Guide (due 13 Nov 2026) — re-check then.

## ⚠ Gate 0 — read this first (P0, unresolved)

The framework says: **no project development before 14 Nov 2026 09:00 Local Event time (Rangpur)** unless the GO Team
gave prior written approval; earlier prototypes are reference-only unless Rangpur Local Lead + GO Team approve in
writing (approved window, reusable files/assets, old/new SHA, asset rights, contribution log).

This code was written on 2026-11-08 — **before** that window — on top of an earlier AgriLume/AgriGuardian prototype.
The team (not this document) must decide:

1. Get the written approval **or**
2. Treat this repo as *reference only* and rebuild a small fresh story inside the official window, copying no code.

Until that is resolved, the "if-conditions-met" score below must not exceed ~89 and nothing here should be submitted
as the official entry.

**Update 2026-11-13:** the team states that organizer permission for pre-event development has been obtained.
No written approval (who approved, date, approved window, reusable files, old/new SHA) is stored in this repository,
so it cannot be verified from here. Before submission, save the approval text (or a reference to it) in
`docs/AUTHORIZATION.md` and confirm it covers this branch's work (`upgrade/scientific-integrity`, started from
`3b64616`). The 13 Nov Submission & Judging Guide must also be checked against the final submission.

Also since 2026-11-08: all 64 districts now use bundled NASA POWER daily-derived data (the previous live path used
monthly *extremes* by mistake), MODIS NDVI context was added, and a Scenario A vs B comparison exists. See
`docs/AUDIT_2026-11-13.md`. The scores below were not re-scored.

## Two scores (never assume a target is met)

| Area (weight) | Now | If conditions met | Evidence / what is missing |
|---|---|---|---|
| Challenge fit & distinctiveness (15) | 9 | 13 | Official challenge Resources open 13 Nov; the NASA data source must be on that list (POWER is a candidate — verify). |
| Real data & provenance (20) | 12 | 17 | Real: bundled NASA POWER Rajshahi 2001–2025 file (sha256 in `data/power/`), labelled observed, plus NASA NEX-GDDP-CMIP6 SSP2-4.5 monthly COG delta packs for all 64 district centers. The COG product is a 2-model subset (GFDL-CM4 and GISS-E2-1-G), and the bundled pack covers only a 2031–2035 mean (keyed to 2033) against a 2010–2014 baseline; other years remain labelled trend/what-if. Live POWER fetch for other districts exists but **was not testable from the build sandbox**. |
| Science & learning validation (25) | 8 | 17 | Crop model is educational and uncalibrated; relative index only. No agronomist/farmer review and no learner pilot done. |
| Demo & reproducibility (20) | 12 | 17 | Builds, lint 0 errors, 71 unit tests pass, browser-checked headless (software GL). **Not tested** on a real headset, real phone or iPhone Safari. |
| Audience & impact (10) | 5 | 8 | EN/BN, 2D fallback, voice, gestures, captions exist; no pilot. |
| Presentation & compliance (10) | 3 | 8 | Gate 0 open; no portal receipt; video/captions not made. |
| **Total** | **49** | **80** (cap <90 until Gate 0 closes) | |

## Claim rules applied in the product

- Every number carries a kind: observed / observed-filled / what-if (trend) / NASA projection / simulator.
- Yield is a **relative index (baseline 100)**, never a guaranteed yield. Hazard scenes are **not forecasts**; no exact-date disaster claims.
- The assistant is an **offline rule-based helper, not an LLM**; safety phrases (emergency, medical distress) → 999; real warnings → BMD/FFWC/DDM.
- "Sign language": the camera feature is **8 hand-gesture control commands — not Bangla Sign Language translation**. BdSL clips are only shown if `public/bdsl/manifest.json` lists a `verifiedBy` signer/organisation; none are shipped.
- Do **not** write "every fact verified", "works offline", or "all NASA data used" in the submission.

## Known limitations (be upfront in the demo)

- WebXR headset path and Cardboard stereo (no lens distortion) are implemented but **untested on hardware**.
- Voice uses the browser Web Speech API (online service in most browsers; Bangla voices may be missing).
- MediaPipe gestures need camera permission and a WebGL/WASM-capable browser.
- Flutter additions in the companion app were **not compiled** (no Dart SDK in the build environment).
- Government links were checked against web search results on 2026-11-08, not by automated crawl.

## Provenance / contribution log (fill in before any submission)

| Item | Source | Rights / licence | Note |
|---|---|---|---|
| NASA POWER Rajshahi monthly 2001–2025 | NASA POWER API (power.larc.nasa.gov) | NASA open data — credit "NASA POWER" | `data/source/nasa_power/`, sha256 `47a2fb92…cffb713` |
| MediaPipe Hands (legacy, lite model) | Google MediaPipe | Apache-2.0 | `public/mediapipe/hands/NOTICE.txt` |
| Noto Sans Bengali | Google Fonts | OFL | self-hosted |
| three, react-three-fiber, drei, @react-three/xr, Next.js, React, Tailwind, framer-motion | npm | MIT | |
| Earlier AgriLume/AgriGuardian prototype | team | **needs written approval (Gate 0)** | old SHA: ______ new SHA: ______ |
| AI assistance in building this code | Claude (Anthropic) | — | describe SI/AI use in the submission form |

Runtime build SHA is shown in the Help dialog (`NEXT_PUBLIC_BUILD_SHA`); use the same approved SHA for demo, captions and ZIP.
