# Validation report

Audience: judges and technical reviewers. This page states what has and has **not** been checked. No metric here is
estimated or invented; each one is produced by a test in `tests/` that anyone can re-run with `npm test`.

## What has been verified

| Check | Method | Result | Test |
|---|---|---|---|
| Pipeline reproducibility | New 64-district daily pipeline vs the separately built Rajshahi fixture (retrieved 2026-09-24), 2001–2025 overlap, 300 monthly values per variable | MAE **0.000** for Tmax, Tmin and rainfall (identical) | `power-districts.test.ts` |
| Provenance chain | Each derived file's SHA-256 matches the manifest; when the raw cache exists, raw bytes re-hash and July-2020 Tmax equals the mean of the raw daily values | pass for 64/64 | `power-districts.test.ts` |
| POWER monthly-endpoint semantics | Compared monthly `T2M_MAX`/`T2M_MIN` with daily values at Rajshahi (May 2020, Dec 2020, Jul 2015) | monthly = daily **max/min**, not mean (e.g. May 2020: 37.28 vs mean 34.05 °C) | documented in METHODOLOGY §2 |
| Physical plausibility | Annual rainfall ordering (Sylhet > 2× Rajshahi; Cox's Bazar > Dhaka; Rajshahi 900–1800 mm) | pass | `power-districts.test.ts` |
| Numerical stability | Relative index for 64 districts × 5 crops × 7 boundary years (1981, 1991, 2020, 2025, 2026, 2033, 2056) | all finite, within [0, 200] | `science-robustness.test.ts` |
| Determinism | Same inputs twice | bit-identical | `science-robustness.test.ts` |
| Response direction | Drought lowers rainfed maize; irrigation recovers it; +4 °C lowers Boro; extreme ±8 °C / +100 % rain stay bounded | pass | `science-robustness.test.ts` |
| Label honesty | Projection used only for covered years in all 64 districts; historical years always observed; stand-in never gets a projection | pass | `climate.test.ts`, `science-robustness.test.ts` |
| Input rejection | Corrupt district files, wrong units, ragged grids, invalid crop parameters, non-finite weather | rejected | several |

## What has NOT been validated

* **Crop model vs observed yields.** No comparison with BBS/DAE district yield statistics or field trials has been
  done. The index shows *direction* under the model's assumptions, not expected yield.
* **NASA POWER vs ground stations.** No comparison with BMD station records. POWER is a ~50 km grid product; town
  heat islands, sea breeze and orographic rainfall are not resolved. 64 district centres fall in 39 distinct cells,
  so some districts share identical climate data.
* **NEX-GDDP-CMIP6 pack.** Only 2 models (GFDL-CM4, GISS-E2-1-G) of the 34-model archive, one 0.25° pixel per district,
  one 5-year window. No ensemble spread is available from 2 models, so no uncertainty range is shown for it.
* **MODIS NDVI context.** No cropland mask and no ground truth; district centres are towns.
* **Farmer / agronomist review.** Not yet performed. No usability pilot has been run.
* **Devices.** Headless Chromium (desktop and Pixel 7 emulation) only. Not tested on a real Android phone, iPhone
  Safari, a VR headset or Cardboard.

## Metrics we deliberately do not report

MAE/RMSE/correlation against yields or stations are not reported because no independent reference data was used.
Reporting them would require that data first.
