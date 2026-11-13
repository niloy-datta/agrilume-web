# NASA Earth Observation & Climate Dataset Provenance Matrix

**AgriLume Web — Earth Intelligence Pipeline**  
**Document Revision:** 2.0  
**Updated:** 2026-11-13  
**Auditor:** Senior Geospatial Data Engineer & NASA EO Specialist

---

## 1. Master Dataset Provenance Table

| Dataset ID | Short Name | Official Provider | Spatial Resolution | Temporal Cadence | API Endpoint / Archive URL | Access Tier | SHA-256 / Checksum Audit | Integration Status in AgriLume |
|---|---|---|---|---|---|---|---|---|
| **NASA POWER Agroclimatology** | `POWER (AG)` | NASA Langley Research Center | 0.5° × 0.625° meteorology (~50 km) | Daily aggregated to monthly means | `https://power.larc.nasa.gov/api/temporal/daily/point` | Open, No Login | Traced in `data/source/nasa_power/districts/manifest.json` | **Bundled Real Data** (All 64 Districts, 1981–2025) |
| **NASA POWER Climate Projections** | `POWER Projection API` | NASA Langley POWER Project | 0.5° × 0.625° grid | Monthly multi-year means | `https://power.larc.nasa.gov/api/temporal/projection/monthly/point` | Open, No Login | Verified API schema | **Typed Adapter & Bundled Baseline** |
| **NASA Harmonized Landsat–Sentinel-2** | `HLSL30 / HLSS30` | NASA LP DAAC / USGS | 30 meters | 2–3 days revisit | `https://cmr.earthdata.nasa.gov/search/granules.json` | Open CMR / Earthdata Login | Fmask bitmask validation | **Typed Adapter & Representative Samples** |
| **NASA SMAP Soil Moisture** | `SPL4SMGP` (L4 Global) | NASA NSIDC / GSFC | 9 km EASE-Grid 2.0 | 3-hourly / Monthly | `https://nsidc.org/data/spl4smgp/versions/7` | Earthdata Login | Product DOI: 10.5067/KGLV6IEKGXMW | **Typed Adapter & 64-District Climatology** |
| **NASA GPM IMERG Precipitation** | `GPM_3IMERGM / DF` | NASA GES DISC / GSFC | 0.1° × 0.1° (~10 km) | Daily & Monthly | `https://disc.gsfc.nasa.gov/datasets/GPM_3IMERGDF_07/summary` | Open / Earthdata Login | Product DOI: 10.5067/GPM/IMERGDF/DAY/07 | **Typed Adapter & Extreme Hazard Baselines** |
| **NASA OPERA Dynamic Surface Water** | `OPERA DSWx-HLS` | NASA JPL / LP DAAC | 30 meters | 2–3 days revisit | `https://www.jpl.nasa.gov/go/opera/products/dswx-hls` | Open Cloud | Product DOI: 10.5067/OPERA/DSWx-HLS.001 | **Typed Adapter & Flood Inundation Benchmarks** |
| **NASA NEX-GDDP-CMIP6** | `NEX-GDDP-CMIP6` | NASA Earth Exchange (NCCS) | 0.25° × 0.25° (~27.8 km) | Monthly downscaled deltas | `https://registry.opendata.aws/nex-gddp-cmip6/` | Open AWS Cloud | Traced via AWS S3 COG manifests | **Bundled Multi-Scenario & Model Spread** |
| **MODIS Vegetation Indices** | `MOD13Q1` (NDVI/EVI) | NASA LP DAAC / ORNL DAAC | 250 meters | 16-day composite | `https://modis.ornl.gov/rst/api/v1/MOD13Q1/subset` | Open, No Login | Traced in `data/source/modis_ndvi/manifest.json` | **Bundled Real Data** (46 Districts in `public/data/ndvi/`) |

---

## 2. Dataset Specifics & Validation Rules

### 2.1 NASA POWER Agroclimatology (AG)
- **Parameters Retrieved:**
  - `T2M_MAX`: Maximum 2-meter air temperature ($^\circ\text{C}$).
  - `T2M_MIN`: Minimum 2-meter air temperature ($^\circ\text{C}$).
  - `PRECTOTCORR`: Precipitation corrected for gauge bias ($\text{mm}\cdot\text{day}^{-1}$).
  - `ALLSKY_SFC_SW_DWN`: All-sky insolation incident on a horizontal surface ($\text{MJ}\cdot\text{m}^{-2}\cdot\text{day}^{-1}$).
  - `RH2M`: Relative humidity at 2 meters ($\%$).
- **Daily Aggregation Rule:**
  Rather than accepting NASA POWER's monthly endpoint—which returns the single hottest and coldest day of each month—AgriLume executes daily downloads and aggregates true arithmetic monthly means ($\bar{T}_{max} = \frac{1}{N}\sum T_{max,i}$). This prevents a $+3^\circ\text{C}$ positive bias in maximum temperatures and a $-3^\circ\text{C}$ negative bias in minimum temperatures.
- **Missing Value Sentinel:**
  Fill values ($-999$, $-9999$) are strictly converted to `null` and never imputed as zero.

### 2.2 NASA Harmonized Landsat–Sentinel-2 (HLS)
- **Sensors:** Operational Land Imager (OLI/OLI-2 on Landsat 8/9) and MultiSpectral Instrument (MSI on Sentinel-2A/2B).
- **Surface Reflectance Bands:** Band 4 (Red, $\approx 665\text{ nm}$) and Band 5/8A (Near-Infrared NIR, $\approx 842\text{–}865\text{ nm}$).
- **NDVI Calculation:**
  $$\text{NDVI} = \frac{\rho_{\text{NIR}} - \rho_{\text{Red}}}{\rho_{\text{NIR}} + \rho_{\text{Red}}}$$
- **Quality Bitmask (Fmask):**
  Pixels flagged for cloud (bit 1), cloud shadow (bit 2), adjacent cloud (bit 3), or high aerosol are masked out before computing zonal district means.

### 2.3 NASA SMAP Level 4 Soil Moisture
- **Product:** SPL4SMGP Version 7 (Global 9 km Surface and Root-Zone Soil Moisture Geophysical Data).
- **Physical Quantity:** Volumetric water content ($\text{m}^3\cdot\text{m}^{-3}$).
- **Depths:** Surface ($0\text{–}5\text{ cm}$) and Root Zone ($0\text{–}100\text{ cm}$).
- **Spatial Alignment:** EASE-Grid 2.0 global cylindrical projection.

### 2.4 NASA OPERA Dynamic Surface Water Extent (DSWx-HLS)
- **Product:** OPERA_L3_DSWx-HLS Version 1.
- **Classes:**
  - `0`: Not Water (Dry land)
  - `1`: Open Water (Pure water pixel)
  - `2`: Partial Surface Water (Wetland, vegetated canal, inundated paddy)
  - `254`: Cloud / Snow mask
  - `255`: Fill / Missing value
- **Application in Bangladesh:** Accurate delineation of seasonal water body dynamics in the Sylhet Haor basin and flash flood extents along the Surma, Kushiyara, and Jamuna floodplains.

### 2.5 NASA NEX-GDDP-CMIP6
- **Scenarios Modeled:**
  - `SSP1-2.6`: Sustainable pathway; aggressive mitigation.
  - `SSP2-4.5`: Middle-of-the-road trajectory; balanced development.
  - `SSP5-8.5`: High emissions baseline; fossil-fueled energy system.
- **Ensemble Models:** ACCESS-CM2, CMCC-ESM2, MPI-ESM1-2-HR, NorESM2-MM.
- **Downscaling Methodology:** Bias-Correction Spatial Disaggregation (BCSD) against historical observational grids.

