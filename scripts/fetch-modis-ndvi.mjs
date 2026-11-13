// Builds REAL MODIS NDVI seasonal context (MOD13Q1, 250 m, 16-day composites) for the centre of every district,
// using NASA's ORNL DAAC MODIS web service (open, no login): https://modis.ornl.gov/data/modis_webservice.html
//
//   node scripts/fetch-modis-ndvi.mjs          # fetch what is not cached
//   node scripts/fetch-modis-ndvi.mjs --derive # rebuild derived files from the cache only
//
// For each 16-day composite we take a 3 x 3 km window (kmAboveBelow = kmLeftRight = 1, i.e. 9 x 9 pixels) around the
// district centre, keep pixels whose VI pixel-reliability flag is 0 (good) or 1 (marginal), and record the median NDVI
// and the fraction of usable pixels. Composites with < 25 % usable pixels (mostly cloud) are kept as null.
//
// HONESTY NOTE: district centres are towns. The window mixes cropland, settlements, water and trees, so this is
// vegetation context for the area around the district centre, NOT the condition of any particular field.
//
// Raw cache: data/source/modis_ndvi/raw/<id>/<band>_<start>.json (git-ignored)
// Manifest : data/source/modis_ndvi/manifest.json
// Derived  : public/data/ndvi/<id>.json  (schema agrilume.ndvi.v1)
import { readFileSync, writeFileSync, mkdirSync, existsSync, statSync } from "node:fs";
import { createHash } from "node:crypto";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const baseDir = join(root, "data/source/modis_ndvi");
const rawDir = join(baseDir, "raw");
const outDir = join(root, "public/data/ndvi");
const API = "https://modis.ornl.gov/rst/api/v1/MOD13Q1";
const YEARS = [2021, 2022, 2023, 2024, 2025];
const KM = 1;
const MIN_GOOD = 0.25;
const NDVI_BAND = "250m_16_days_NDVI";
const REL_BAND = "250m_16_days_pixel_reliability";
const deriveOnly = process.argv.includes("--derive");

function readDistricts() {
  const src = readFileSync(join(root, "lib/timetravel/locations.ts"), "utf8");
  const re = /\[\s*"([a-z]+)",\s*"([^"]+)",\s*"[^"]+",\s*"[a-z]+",\s*(-?\d+(?:\.\d+)?),\s*(-?\d+(?:\.\d+)?),\s*"[a-z]+"\s*\]/g;
  const out = [];
  for (const m of src.matchAll(re)) out.push({ id: m[1], name: m[2], lat: Number(m[3]), lon: Number(m[4]) });
  if (out.length !== 64) throw new Error(`expected 64 districts, parsed ${out.length}`);
  return out;
}

async function getJson(url, tries = 5) {
  let last;
  for (let i = 0; i < tries; i++) {
    const ctl = new AbortController();
    const t = setTimeout(() => ctl.abort(), 90000);
    try {
      const res = await fetch(url, { signal: ctl.signal, headers: { Accept: "application/json", "User-Agent": "agrilume-data-pipeline" } });
      if (res.status === 429 || res.status >= 500) throw new Error(`HTTP ${res.status}`);
      const buf = Buffer.from(await res.arrayBuffer());
      if (!res.ok) throw Object.assign(new Error(`HTTP ${res.status}: ${buf.toString().slice(0, 120)}`), { fatal: true });
      return buf;
    } catch (e) {
      last = e;
      if (e.fatal) break;
      await new Promise((r) => setTimeout(r, 3000 * 2 ** i));
    } finally {
      clearTimeout(t);
    }
  }
  throw last;
}

/** MODIS composite dates (A{year}{doy}) actually available at a point, split into chunks of 10 (API limit). */
async function dateChunks(lat, lon) {
  const buf = await getJson(`${API}/dates?latitude=${lat}&longitude=${lon}`);
  const dates = JSON.parse(buf.toString()).dates.map((d) => d.modis_date).filter((d) => YEARS.includes(Number(d.slice(1, 5))));
  const chunks = [];
  for (let i = 0; i < dates.length; i += 10) chunks.push([dates[i], dates[Math.min(i + 9, dates.length - 1)]]);
  return chunks;
}

const median = (a) => {
  const s = [...a].sort((x, y) => x - y);
  const m = s.length >> 1;
  return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2;
};
const round = (x) => Math.round(x * 10000) / 10000;

async function processDistrict(d, manifest) {
  const dir = join(rawDir, d.id);
  mkdirSync(dir, { recursive: true });
  const entry = (manifest.files[d.id] ??= { requests: {} });
  if (!deriveOnly && !entry.chunks) entry.chunks = await dateChunks(d.lat, d.lon);
  if (!entry.chunks) throw new Error("no cached date list (run without --derive)");
  const bands = {};
  for (const band of [NDVI_BAND, REL_BAND]) {
    bands[band] = [];
    for (const [start, end] of entry.chunks) {
      const key = `${band}_${start}`;
      const path = join(dir, `${key}.json`);
      const url = `${API}/subset?latitude=${d.lat}&longitude=${d.lon}&band=${band}&startDate=${start}&endDate=${end}&kmAboveBelow=${KM}&kmLeftRight=${KM}`;
      let raw;
      if (existsSync(path)) {
        raw = readFileSync(path);
        // a response cached by an interrupted run may not be in the manifest yet: record it (file time as retrieval time)
        entry.requests[key] ??= { url, retrievedAt: statSync(path).mtime.toISOString(), sha256: createHash("sha256").update(raw).digest("hex") };
      }
      else if (deriveOnly) throw new Error(`missing cache ${key}`);
      else {
        raw = await getJson(url);
        writeFileSync(path, raw);
        entry.requests[key] = { url, retrievedAt: new Date().toISOString(), sha256: createHash("sha256").update(raw).digest("hex") };
      }
      const doc = JSON.parse(raw.toString());
      bands[band].push(...doc.subset);
      if (band === NDVI_BAND) entry.cellsizeM = Number(doc.cellsize);
    }
  }
  const relByDate = new Map(bands[REL_BAND].map((s) => [s.modis_date, s.data]));
  const composites = [];
  for (const s of bands[NDVI_BAND]) {
    const rel = relByDate.get(s.modis_date);
    if (!rel || rel.length !== s.data.length) continue;
    const good = [];
    s.data.forEach((v, i) => {
      if ((rel[i] === 0 || rel[i] === 1) && v !== -3000 && v >= -2000 && v <= 10000) good.push(v * 0.0001);
    });
    const goodFrac = good.length / s.data.length;
    composites.push({
      date: s.calendar_date,
      ndvi: goodFrac >= MIN_GOOD ? round(median(good)) : null,
      goodFrac: round(goodFrac),
      procDate: s.proc_date,
    });
  }
  composites.sort((a, b) => a.date.localeCompare(b.date));
  // Monthly mean of composite medians, per year, then a 5-year monthly mean (needs >= 3 years with data).
  const monthly = Object.fromEntries(YEARS.map((y) => [y, Array.from({ length: 12 }, () => [])]));
  for (const c of composites) if (c.ndvi != null) monthly[Number(c.date.slice(0, 4))][Number(c.date.slice(5, 7)) - 1].push(c.ndvi);
  const byYear = Object.fromEntries(YEARS.map((y) => [y, monthly[y].map((a) => (a.length ? round(a.reduce((s, v) => s + v, 0) / a.length) : null))]));
  const climatology = Array.from({ length: 12 }, (_, m) => {
    const v = YEARS.map((y) => byYear[y][m]).filter((x) => x != null);
    return v.length >= 3 ? round(v.reduce((s, x) => s + x, 0) / v.length) : null;
  });
  return {
    schema: "agrilume.ndvi.v1",
    location: { id: d.id, name: d.name, lat: d.lat, lon: d.lon },
    product: "MOD13Q1 (MODIS/Terra Vegetation Indices 16-Day L3 Global 250 m)",
    band: NDVI_BAND,
    window: { kmAboveBelow: KM, kmLeftRight: KM, pixels: bands[NDVI_BAND][0]?.data.length ?? 0, cellsizeM: entry.cellsizeM },
    years: YEARS,
    composites,
    monthlyByYear: byYear,
    climatology,
    quality: {
      rule: `pixels with VI reliability 0 (good) or 1 (marginal); composite kept only if >= ${MIN_GOOD * 100}% of window usable; median of usable pixels`,
      compositesTotal: composites.length,
      compositesUsable: composites.filter((c) => c.ndvi != null).length,
    },
    provenance: {
      provider: "NASA LP DAAC MODIS product, served by the ORNL DAAC MODIS/VIIRS Land Product Subsets web service",
      service: "https://modis.ornl.gov/rst/api/v1/",
      citation: "Didan, K. (2021). MODIS/Terra Vegetation Indices 16-Day L3 Global 250m SIN Grid. NASA LP DAAC. ORNL DAAC. 2018. MODIS and VIIRS Land Products Global Subsetting and Visualization Tool. ORNL DAAC, Oak Ridge, Tennessee, USA.",
      manifest: "data/source/modis_ndvi/manifest.json",
      spatial: `${2 * KM + 1} x ${2 * KM + 1} km window of 250 m pixels around the district centre (a town): mixed land cover, not a field measurement`,
      temporal: "16-day composites, 2021-2025",
      unit: "NDVI (dimensionless, -1..1); scale factor 0.0001 applied",
    },
  };
}

async function main() {
  mkdirSync(rawDir, { recursive: true });
  mkdirSync(outDir, { recursive: true });
  const mPath = join(baseDir, "manifest.json");
  const manifest = existsSync(mPath) ? JSON.parse(readFileSync(mPath, "utf8")) : {};
  manifest.files ??= {};
  const failures = [];
  const districts = readDistricts();
  const save = () => writeFileSync(mPath, JSON.stringify({ ...manifest, synthetic: false, note: "Raw responses cached in raw/ (git-ignored). Each request URL, retrieval time and SHA-256 recorded below." }, null, 1) + "\n");
  // small concurrency to stay polite to the public service
  let next = 0;
  async function worker() {
    while (next < districts.length) {
      const d = districts[next++];
      try {
        const out = await processDistrict(d, manifest);
        writeFileSync(join(outDir, `${d.id}.json`), JSON.stringify(out));
        console.log(`ok  ${d.id.padEnd(16)} usable ${out.quality.compositesUsable}/${out.quality.compositesTotal}`);
      } catch (e) {
        failures.push(d.id);
        console.error(`ERR ${d.id}: ${e.message}`);
      }
      save();
    }
  }
  await Promise.all(Array.from({ length: Number(process.env.NDVI_CONCURRENCY || 6) }, worker));
  save();
  if (failures.length) {
    console.error(`${failures.length} failed: ${failures.join(", ")} (re-run to resume from cache)`);
    process.exit(1);
  }
}

main();
