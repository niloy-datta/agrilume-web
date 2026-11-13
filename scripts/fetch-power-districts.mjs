// Builds REAL NASA POWER monthly climate files for the centre point of all 64 Bangladesh districts.
//
// WHY DAILY: the POWER *monthly* endpoint reports T2M_MAX / T2M_MIN as the month's EXTREMES (hottest day / coldest
// day), not the mean of daily maxima/minima the crop model needs (verified: monthly T2M_MAX == max of the daily
// values). So we download DAILY data and aggregate it ourselves into monthly means, plus the day-to-day SD of Tmax.
//
//   node scripts/fetch-power-districts.mjs            # fetch districts whose raw daily file is not cached yet
//   node scripts/fetch-power-districts.mjs --force    # refetch everything
//   node scripts/fetch-power-districts.mjs --derive   # rebuild derived files from cached raw files only (offline)
//
// Raw cache: data/source/nasa_power/districts/raw/<id>.json   (~0.8 MB each, git-ignored; refetchable)
// Manifest : data/source/nasa_power/districts/manifest.json   (URL, retrieval time, SHA-256 of each raw response)
// Derived  : public/data/power/<id>.json                      (schema agrilume.power.monthly.v1, loaded by the app)
//
// Nothing is invented: fill values (-999) are dropped, a month needs >= 20 valid days or it is null, units are copied
// from the response, and a district whose request fails is reported (exit 1) instead of being filled with anything.
import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { createHash } from "node:crypto";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const baseDir = join(root, "data/source/nasa_power/districts");
const rawDir = join(baseDir, "raw");
const outDir = join(root, "public/data/power");
const START = 1981;
const END = 2025; // last complete calendar year when this pack was built
const PARAMS = ["T2M_MAX", "T2M_MIN", "PRECTOTCORR"];
const MIN_DAYS = 20;
const force = process.argv.includes("--force");
const deriveOnly = process.argv.includes("--derive");

/** District rows are parsed from the single source of truth used by the app. */
function readDistricts() {
  const src = readFileSync(join(root, "lib/timetravel/locations.ts"), "utf8");
  const re = /\[\s*"([a-z]+)",\s*"([^"]+)",\s*"[^"]+",\s*"[a-z]+",\s*(-?\d+(?:\.\d+)?),\s*(-?\d+(?:\.\d+)?),\s*"[a-z]+"\s*\]/g;
  const out = [];
  for (const m of src.matchAll(re)) out.push({ id: m[1], name: m[2], lat: Number(m[3]), lon: Number(m[4]) });
  if (out.length !== 64) throw new Error(`expected 64 districts in locations.ts, parsed ${out.length}`);
  return out;
}

function dailyUrl(lat, lon) {
  const q = new URLSearchParams({
    parameters: PARAMS.join(","),
    community: "AG",
    longitude: lon.toFixed(4),
    latitude: lat.toFixed(4),
    start: `${START}0101`,
    end: `${END}1231`,
    format: "JSON",
    "time-standard": "LST",
  });
  return `https://power.larc.nasa.gov/api/temporal/daily/point?${q.toString()}`;
}

async function fetchWithRetry(url, tries = 4) {
  let lastErr;
  for (let i = 0; i < tries; i++) {
    const ctl = new AbortController();
    const timer = setTimeout(() => ctl.abort(), 120000);
    try {
      const res = await fetch(url, { signal: ctl.signal, headers: { "User-Agent": "agrilume-data-pipeline" } });
      if (res.status === 429 || res.status >= 500) throw new Error(`HTTP ${res.status}`);
      if (!res.ok) throw Object.assign(new Error(`HTTP ${res.status}`), { fatal: true });
      return Buffer.from(await res.arrayBuffer());
    } catch (e) {
      lastErr = e;
      if (e.fatal) break;
      await new Promise((r) => setTimeout(r, 2000 * 2 ** i));
    } finally {
      clearTimeout(timer);
    }
  }
  throw lastErr;
}

const round = (x) => Math.round(x * 1000) / 1000;

function derive(d, raw, meta) {
  const doc = JSON.parse(raw.toString("utf8"));
  const P = doc.properties?.parameter;
  if (!P) throw new Error(`${d.id}: response has no properties.parameter`);
  const fill = doc.header?.fill_value ?? -999;
  const n = END - START + 1;
  const acc = (name) => {
    const cells = Array.from({ length: n }, () => Array.from({ length: 12 }, () => []));
    for (const [key, v] of Object.entries(P[name] ?? {})) {
      if (v === fill || v == null || !Number.isFinite(v)) continue;
      const y = Number(key.slice(0, 4));
      const m = Number(key.slice(4, 6)) - 1;
      if (y < START || y > END || m < 0 || m > 11) continue;
      cells[y - START][m].push(v);
    }
    return cells;
  };
  const mean = (cells) => cells.map((row) => row.map((a) => (a.length >= MIN_DAYS ? round(a.reduce((s, x) => s + x, 0) / a.length) : null)));
  const tmaxCells = acc("T2M_MAX");
  const grids = { tmax: mean(tmaxCells), tmin: mean(acc("T2M_MIN")), rain: mean(acc("PRECTOTCORR")) };

  // Day-to-day Tmax SD per calendar month: deviations of each day from its own (year, month) mean, pooled over years.
  const dev = Array.from({ length: 12 }, () => []);
  tmaxCells.forEach((row, yi) =>
    row.forEach((a, m) => {
      const mu = grids.tmax[yi][m];
      if (mu != null) for (const v of a) dev[m].push(v - mu);
    }),
  );
  const tmaxDailySd = dev.map((a) => {
    if (a.length < 30) return null;
    const mu = a.reduce((s, x) => s + x, 0) / a.length;
    return round(Math.sqrt(a.reduce((s, x) => s + (x - mu) ** 2, 0) / (a.length - 1)));
  });

  const units = Object.fromEntries(PARAMS.map((p) => [p, doc.parameters?.[p]?.units ?? "unknown"]));
  if (!/mm\/day/i.test(units.PRECTOTCORR)) throw new Error(`${d.id}: unexpected rain units ${units.PRECTOTCORR}`);
  let missing = 0;
  for (const g of Object.values(grids)) for (const row of g) for (const v of row) if (v == null) missing++;
  const coords = doc.geometry?.coordinates ?? null;
  return {
    schema: "agrilume.power.monthly.v1",
    location: { id: d.id, name: d.name, lat: d.lat, lon: d.lon },
    startYear: START,
    endYear: END,
    ...grids,
    tmaxDailySd,
    quality: { missingMonthValues: missing, totalMonthValues: 3 * n * 12, minValidDaysPerMonth: MIN_DAYS },
    provenance: {
      provider: "NASA POWER (NASA Langley Research Center)",
      dataset: "POWER Daily, AG community (aggregated to monthly means by AgriLume)",
      endpoint: "/api/temporal/daily/point",
      apiVersion: doc.header?.api?.version ?? null,
      sourceUrl: meta.sourceUrl,
      retrievedAt: meta.retrievedAt,
      parameters: PARAMS,
      units,
      responsePoint: coords,
      sourceFileSha256: meta.sha256,
      spatial: "NASA POWER grid cell (~0.5° x 0.625° MERRA-2 meteorology; precipitation from GPM IMERG/MERRA-2) containing the district centre; not a farm-level measurement",
      temporal: "monthly means of daily values (local solar time days)",
      derived: `Daily values averaged per calendar month (>= ${MIN_DAYS} valid days, else null); -999 fill values dropped; Tmax day-to-day SD pooled per calendar month; rounded to 0.001.`,
    },
  };
}

async function main() {
  mkdirSync(rawDir, { recursive: true });
  mkdirSync(outDir, { recursive: true });
  const manifestPath = join(baseDir, "manifest.json");
  const manifest = existsSync(manifestPath) ? JSON.parse(readFileSync(manifestPath, "utf8")) : {};
  manifest.files ??= {};
  const failures = [];
  for (const d of readDistricts()) {
    const rawPath = join(rawDir, `${d.id}.json`);
    const url = dailyUrl(d.lat, d.lon);
    try {
      let raw;
      const stale = manifest.files[d.id]?.sourceUrl !== url;
      if (!deriveOnly && (force || stale || !existsSync(rawPath))) {
        raw = await fetchWithRetry(url);
        writeFileSync(rawPath, raw);
        manifest.files[d.id] = {
          sourceUrl: url,
          retrievedAt: new Date().toISOString(),
          sha256: createHash("sha256").update(raw).digest("hex"),
          bytes: raw.length,
          synthetic: false,
        };
        await new Promise((r) => setTimeout(r, 500)); // be polite to the public API
      } else {
        if (!existsSync(rawPath)) throw new Error("raw file not cached (run without --derive)");
        raw = readFileSync(rawPath);
      }
      const meta = manifest.files[d.id];
      if (!meta || meta.sha256 !== createHash("sha256").update(raw).digest("hex")) throw new Error("raw file hash does not match manifest");
      const out = derive(d, raw, meta);
      writeFileSync(join(outDir, `${d.id}.json`), JSON.stringify(out));
      console.log(`ok  ${d.id.padEnd(16)} missing=${out.quality.missingMonthValues}`);
    } catch (e) {
      failures.push(d.id);
      console.error(`ERR ${d.id}: ${e.message}`);
    }
  }
  manifest.provider = "NASA POWER";
  manifest.synthetic = false;
  manifest.note = "Raw daily responses are cached in raw/ (git-ignored, ~50 MB). Re-run the script to refetch; compare SHA-256 to detect upstream revisions.";
  manifest.request = { start: `${START}0101`, end: `${END}1231`, parameters: PARAMS, community: "AG", endpoint: "/api/temporal/daily/point", timeStandard: "LST" };
  writeFileSync(manifestPath, JSON.stringify(manifest, null, 2) + "\n");
  if (failures.length) {
    console.error(`\n${failures.length} district(s) failed: ${failures.join(", ")}`);
    process.exit(1);
  }
}

main();
