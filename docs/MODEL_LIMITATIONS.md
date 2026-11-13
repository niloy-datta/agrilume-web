# AgriLume Web — Model Limitations & Operational Boundaries

**Classification:** Scientific Transparency & Ethical Disclosure  
**Target Audience:** Competition Judges, Agronomists, Farmers, Software Engineers  
**Date:** 2026-11-13

---

## 1. Core Principle: Educational Simulation vs Operational Forecast

> **CRITICAL DISCLAIMER:**  
> AgriLume Web is an **educational Earth intelligence laboratory and decision comparison tool**. It is **not** an operational meteorological forecast, a daily weather advisory, or a commercial crop yield guarantee.  
> 
> Real-world farming decisions in Bangladesh should always be cross-referenced with your local **Upazila Agriculture Office (DAE)** or the official **Krishi Call Centre (16123)**.

---

## 2. Spatial Scale Discrepancies

### 2.1 The "Pixel vs Plot" Problem
- **Satellite Meteorology Scale:** NASA POWER meteorological data is gridded at $0.5^\circ \times 0.625^\circ$, which translates to approximately $50\text{ km} \times 60\text{ km}$ per cell in Bangladesh.
- **District Coverage:** The 64 administrative district centers of Bangladesh fall across only 39 unique NASA POWER grid cells. Multiple adjacent districts (e.g. Dhaka, Narayanganj, Gazipur) share identical reanalysis forcing values.
- **Smallholder Plot Scale:** The average farm holding in Bangladesh is between $0.2$ and $0.5$ hectares ($2,000\text{–}5,000\text{ m}^2$).
- **Scientific Implication:** A single NASA POWER grid pixel encompasses more than $50,000$ individual agricultural holdings with divergent micro-topography, bund heights, drainage canals, and tree shade. Satellite data represents the regional climate forcing envelope, **never** an in-situ measurement of a specific farmer's plot.

---

## 3. Crop Model Assumptions & Non-Modeled Factors

AgriLume implements the FAO-56 dual crop coefficient water-balance model with Growing Degree Day (GDD) phenological stages. Users must understand what the model explicitly assumes:

1. **Non-Limiting Soil Fertility:**  
   The model assumes nitrogen, phosphorus, potassium, and zinc are supplied at optimal agronomic rates recommended by BARC. Stunting or chlorosis from nutrient deficiencies is not simulated.
2. **Pest, Disease, and Weed Pressure:**  
   Brown Plant Hopper (BPH), Rice Blast (*Magnaporthe oryzae*), bacterial blight, and weed competition are assumed to be managed or controlled. Outbreaks occurring in the field will depress real yields below model indices.
3. **Soil Stratification Uniformity:**  
   The root-zone soil water retention is approximated using effective field capacity ($FC$) and permanent wilting point ($WP$) based on regional AEZ classifications. Hardpan layers and micro-scale soil cracks are simplified into a single homogeneous soil bucket.
4. **Homogeneous Groundwater Availability:**  
   When "Full Irrigation" is selected, the model assumes irrigation pumps have unconstrained water access, abstracting from aquifer recharge. In reality, deep tubewells in the Barind Tract often suffer pump suction limits during April drought peaks.

---

## 4. Climate Projections & Uncertainty

### 4.1 NEX-GDDP-CMIP6 Downscaled Ensemble
- **Time Averaging Window:** The bundled projection pack centers on a 5-year climatological window ($2031\text{–}2035$). Individual future years are not weather predictions for that specific calendar date.
- **Multi-Model Divergence:** Global Climate Models differ significantly in their regional monsoon convective sensitivity. In winter months (December–February), when absolute precipitation is less than $15\text{ mm}$, multiplicative rainfall change ratios can be numerically unstable and are bounded to avoid distorted percentages.
- **No Direct Daily Forecasts:** Climate projections assess shift in decadal risk probabilities, not whether it will rain on a specific upcoming Tuesday.

---

## 5. Responsible Language & Honest Labeling Standards

To prevent user confusion, AgriLume enforces strict visual and textual labeling conventions across all screens:
- **Observed:** Numbers derived directly from historical NASA satellite observations or reanalysis (1981–2025).
- **Cached Observation:** Real NASA data served from the user's validated local browser cache.
- **Observed-Filled:** Real records with missing months imputed from multi-year climatological means.
- **What-If Scenario:** Deliberate user-specified hypothetical perturbations ($\Delta T$, $\Delta \text{Rain}$) for exploring sensitivity.
- **Model Projection:** Statistically downscaled deltas from CMIP6 GCM ensembles.
- **Unavailable Data:** Explicit alert shown when network connectivity or satellite coverage is unavailable; **fabricated or mock substitute numbers are strictly prohibited.**

