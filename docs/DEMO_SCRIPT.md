# AgriLume Web — 90-Second Championship Demonstration Script

**Theme:** "One Field. Two Futures. One Better Decision."  
**Time Limit:** Exactly 90 Seconds  
**Demonstrator Target:** NASA Space Apps Challenge Global Judges & Agritech Panel  
**Test Location:** Rajshahi District (Barind Tract, Bangladesh)  
**Backup Mode:** Fully offline operational using bundled real NASA POWER and MODIS files in `public/data/`

---

## Chronological 90-Second Walkthrough

```
[00:00 - 00:12] THE CHALLENGE & LOCATION SELECTION
```
- **Action:** Open `http://localhost:3000` (or `https://agrilume-web.vercel.app`).
- **Narrative:**  
  *"Every season, 16 million Bangladeshi smallholders face a difficult question: 'Should I plant today, or wait?' We are taking you to Rajshahi in the water-stressed Barind Tract, where groundwater is dropping and pre-monsoon heatwaves threaten the staple Boro rice crop."*
- **Action:** Click **"Launch Decision Lab"** from the hero section or top navigation.

```
[00:12 - 00:28] AUTHENTIC NASA EVIDENCE & SATELLITE LAYERS
```
- **Action:** Navigate to `/earth-intelligence?district=rajshahi`.
- **Narrative:**  
  *"AgriLume grounds every decision in authentic NASA Earth observation. Notice the real MODIS and HLS 30-meter vegetation indices, NASA SMAP 9-kilometer volumetric root-zone soil moisture showing a critical 15% March deficit, and 45 years of continuous NASA POWER daily climate history."*
- **Visual Cue:** Toggle the layer selector from **"HLS / MODIS Greenness"** to **"SMAP Soil Moisture"**. Note the badge: `● Real Observation`.

```
[00:28 - 00:48] DUAL SCENARIO SIMULATION (THE DECISION TWIN)
```
- **Action:** Return to `/decision-lab?district=rajshahi`.
- **Narrative:**  
  *"Here is our flagship Agricultural Decision Twin: Scenario A vs Scenario B. In Scenario A—Current Practice—a farmer transplants Boro rice late, on Day 15, and applies continuous flood irrigation. The FAO-56 crop model reveals an index of only 88, consuming over 850 mm of pumped irrigation water and suffering 18% heat stress during late April flowering."*
- **Action:** Adjust Scenario B: Move Sowing Date to Day 5 (early January) and set Irrigation Strategy to **"Deficit / AWD (Alternate Wetting and Drying)"**.

```
[00:48 - 01:05] SCIENTIFIC COMPARISON & WATER SAVINGS
```
- **Action:** Point to the **Comparative Differential & Scientific Reasoning** panel.
- **Narrative:**  
  *"Instantly, the model recalculates. Scenario B rises to an index of 114—a 26-point gain! Why? First, early transplanting shifts flowering before peak 36°C temperatures, slashing heat-induced spikelet sterility. Second, AWD irrigation saves 280 mm of precious groundwater with zero yield penalty, directly lowering diesel pumping costs."*

```
[01:05 - 01:20] 3D TIME TRAVEL OBSERVATION & CLIMATE FUTURE
```
- **Action:** Click **"View in 3D"** (`/time-travel`).
- **Narrative:**  
  *"We can step right into the field in 3D Time Travel. The procedural canopy, atmospheric radiation, and water balance reflect the exact NASA POWER inputs. Moving the time slider into 2033 activates the NASA NEX-GDDP-CMIP6 downscaled climate projection under SSP2-4.5, showing how future warming will amplify dry-season water stress."*

```
[01:20 - 01:30] SCIENTIFIC INTEGRITY & SUMMARY
```
- **Action:** Click the **NASA Data** / Help button to display the Provenance Matrix.
- **Narrative:**  
  *"AgriLume never fabricates yields or invents weather forecasts. Every number is labeled with its exact NASA sensor, spatial resolution, and peer-reviewed FAO-56 equation. One field. Two futures. One better decision. Thank you."*

---

## Offline / Airplane Mode Contingency Plan

If internet connectivity or external NASA APIs become unavailable during judging:
1. All 64 district climate records (1981–2025) are pre-bundled in `public/data/power/*.json` with verified SHA-256 signatures.
2. MODIS NDVI files for 46 districts are stored locally in `public/data/ndvi/*.json`.
3. The NEX-GDDP-CMIP6 projection packs are bundled in `public/data/projections/*.json`.
4. The site loads and runs 100% offline without dropping a single frame or showing an empty state.

