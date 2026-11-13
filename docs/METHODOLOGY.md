# AgriLume Time Travel — scientific methodology

Audience: technical reviewers and judges who want to check how every number on screen is produced.
Status: **educational demonstration, not validated decision support.** See [VALIDATION.md](VALIDATION.md) and
[DATA_PROVENANCE.md](DATA_PROVENANCE.md).

## 1. Three classes of value, always kept apart

| Class | Where it comes from | UI label |
|---|---|---|
| Observation | NASA POWER daily data, aggregated to monthly means (all 64 districts, 1981–2025) | ● observed / ◐ observed-filled |
| Climate-model projection | NASA NEX-GDDP-CMIP6 SSP2-4.5 delta pack (2-model monthly COG subset) | ▲ NASA projection |
| What-if | Observed climatology + statistically supported trend + user deltas | ◇ what-if |
| Model output | AgriLume's educational crop model | ■ simulator |

`lib/timetravel/climate.ts → monthlyForYear()` decides the class for every year and attaches notes explaining it.
A year never silently changes class.

## 2. Historical climate (observations)

* **Source:** NASA POWER daily point API, AG community, parameters `T2M_MAX`, `T2M_MIN`, `PRECTOTCORR`, for the
  centre coordinate of each district (`lib/timetravel/locations.ts`).
* **Aggregation:** monthly mean of daily values; a month needs ≥ 20 valid days, otherwise it is `null`.
  Fill values (−999) are dropped, never treated as 0.
* **Why daily, not monthly:** POWER's *monthly* endpoint reports `T2M_MAX`/`T2M_MIN` as the month's **extremes**
  (verified: monthly `T2M_MAX` equals the maximum of that month's daily values). The model needs the *mean* daily
  maximum/minimum. Using the monthly endpoint biased Tmax by about +3 °C and Tmin by about −3 °C; the earlier live
  path did this and has been fixed (`parseDaily`, cache key bumped to `v2`).
* **Day-to-day variability:** standard deviation of daily Tmax around its own monthly mean, pooled per calendar
  month — used for the expected heat-exceedance calculation.
* **Baseline:** WMO 1991–2020 normal (`defaultBaseline`). The 2001–2025 Rajshahi daily fixture, used only in tests
  and for first paint, keeps all its years.
* **Missing month in an observed year:** replaced by that month's baseline mean and labelled `observed-filled`.

## 3. Future climate

### 3.1 NASA projection (delta method)

`projected = observed mean over the model's baseline window + Δ`, where Δ is from the pack:

* temperature: additive `dTmax`, `dTmin` (°C) per calendar month;
* rainfall: multiplicative `rainRatio` per month. Months where the model's historical rainfall is ~0 keep ratio 1
  (`rainRatioFallbackMonths`), because the ratio is undefined or unstable.

**The observed mean uses the same years as the model baseline (2010–2014).** Earlier code added the delta to a
different observed window (2001–2025), which mixes two reference periods and mis-states the change. A 5-year window
is short, so year-to-year noise is a stated uncertainty (especially for rainfall).

The pack exists only for the year it was built for (2033, representing the 2031–2035 mean). Any other future year is
**not** a NASA projection: it uses the what-if path and says so (“No NASA projection for 2041…”). No interpolation
between projection windows is performed.

A pack is **never** applied to stand-in observations from another district.

### 3.2 What-if (trend)

Baseline climatology + a linear temperature trend (OLS on annual means of the full record) **only if** |t| ≥ 2 for
both Tmax and Tmin, centred on the baseline mid-year. No rainfall trend is applied. User deltas (°C, % monsoon rain,
% dry-season rain) are added on top and flagged as `perturbed`.

## 4. Educational crop model (`lib/timetravel/crops.ts`)

A transparent daily model, not DSSAT/APSIM and **not calibrated**:

* **Daily weather:** linear interpolation between mid-month means. This removes month-boundary jumps but does
  **not** create realistic weather — dry spells and single hot days are under-represented.
* **Phenology:** growing degree days, `GDD += max(0, min(Tmean, tcap) − tbase)`; maturity at `gddMaturity`.
  Warming therefore shortens the season (visible in the comparison panel).
* **Reference ET:** Hargreaves–Samani (FAO-56 eq. 52) with FAO-56 extraterrestrial radiation; crop ET = Kc × ET₀.
* **Water:** paddy ponding balance (seepage 3 mm/d, puddling 8 mm/d for 12 days, bund overflow at 100 mm) or a
  single-bucket upland balance (WHC 120 mm). Irrigation modes: irrigated, AWD, rainfed.
* **Growth proxy:** Σ Rs × canopy × trapezoid temperature response × (1 − stage sensitivity × water stress).
* **Losses (multiplicative):** heat (expected exceedance of a stage-specific threshold given daily Tmax SD), cold,
  salinity (FAO-29 Maas–Hoffman threshold/slope), flood and cyclone (educational mappings of severity → depth/wind).
* **Output:** `index = 100 × yieldProxy(scenario) / yieldProxy(same crop & management under baseline climate)`.
  **The index is never converted to tonnes per hectare.**
* **Guards:** invalid crop parameters (`cropDefProblems`), negative soil EC and non-finite weather throw instead of
  producing NaN.

Fixed bug: the late-season Kc interpolation was mis-parenthesised and extrapolated beyond `kc.end`.

## 5. Scenario A vs B (`lib/timetravel/compare.ts`)

Both sides run through the same model with explicit inputs (year, weather source, what-if deltas, water management,
sowing shift). Reported: season rainfall, mean Tmax, days ≥ crop heat threshold, stage-weighted water stress, the
model's added-water requirement, crop-condition index, season length. Explanations are generated from the computed
differences with fixed *presentation* thresholds (e.g. mention temperature if |ΔT| ≥ 0.3 °C). The comparison never
outputs fertiliser, pesticide or irrigation quantities, and points to the Upazila Agriculture Office / 16123.

## 6. Satellite vegetation context (MODIS NDVI)

See [DATA_PROVENANCE.md](DATA_PROVENANCE.md). NDVI is shown as **context around the district centre** (a town, mixed
land cover). It does not enter the crop model and is not a field measurement.

## 7. Reproducing everything

```bash
npm ci
node scripts/fetch-power-districts.mjs     # NASA POWER, 64 districts (needs internet, ~3 min)
node scripts/fetch-modis-ndvi.mjs          # MODIS NDVI via ORNL DAAC (needs internet, ~30-60 min)
npm run typecheck && npm run lint && npm test && npm run build
npx playwright test                         # end-to-end, after build
```

Re-fetching produces new retrieval timestamps; compare the SHA-256 values in the manifests to detect upstream
revisions. `--derive` rebuilds the derived files offline from the cached raw responses.
