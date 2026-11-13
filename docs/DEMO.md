# 5-minute demonstration script

Audience: NASA Space Apps judges. Use the deployed site or `npm run build && node scripts/serve-out.mjs`.

**1. The problem (30 s).** A Boro rice farmer in Rajshahi must choose a sowing date and water plan without knowing
how hot the season will be. Open `/time-travel`, press **L** for English.

**2. The evidence (60 s).** Place tab → Division *Rajshahi*, District *Rajshahi*. Point at "Real NASA POWER monthly
data bundled at build time (1981–2025)". Scroll to the **satellite NDVI** card: the green bars are MODIS greenness
around the district centre; clouds blank out the monsoon months, and the card says so. Open **NASA data** tab: five
separate ✓/✗ stages per dataset — only what is really used is ticked.

**3. The simulation (60 s).** Move the year slider to 2015 (● observed), then to 2033 with mode "NASA projection"
(▲): the note states SSP2-4.5, 2 models, 2031–2035 vs 2010–2014. Move to 2045: it becomes ◇ what-if and says
"No NASA projection for 2045".

**4. The decision (90 s).** Compare tab. A = observed 2015, B = NASA projection 2033 (or what-if +1.5 °C, −10 % rain).
Read the "Why the difference?" lines: hotter season, crop matures N days earlier, more hot days, index change. Switch
B's water management to *rainfed* and show water stress rising. Shift sowing −15 days and show the effect.

**5. The impact and honesty (30 s).** Show the caveats: uncalibrated model, relative index, smoothed weather,
16123. Show `docs/VALIDATION.md`: what is verified (data pipeline reproduces exactly, 64×5×7 stability sweep) and
what is not (no yield or station validation, no farmer pilot yet). Mention the bug we found and fixed: POWER monthly
Tmax is a monthly maximum.

**Resilience demo (optional).** In DevTools block `*/data/power/khulna.json` and `power.larc.nasa.gov`, pick Khulna:
an amber alert says the data are a stand-in from Rajshahi and projections are disabled.
