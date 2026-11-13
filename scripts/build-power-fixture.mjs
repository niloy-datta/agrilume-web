// Derives a compact MONTHLY summary from the committed REAL NASA POWER daily fixture
// (Rajshahi, 2001-2025). Nothing is invented: every number is an aggregate of the source file.
//
//   node scripts/build-power-fixture.mjs
//
// Output: lib/timetravel/data/rajshahi-power-monthly.json  (imported by the app, works offline)
import { readFileSync, writeFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const srcDir = join(root, "data/source/nasa_power");
const manifest = JSON.parse(readFileSync(join(srcDir, "manifest.json"), "utf8"));
const entry = manifest.files[0];
const raw = readFileSync(join(srcDir, entry.file));
const sha256 = createHash("sha256").update(raw).digest("hex");
const doc = JSON.parse(raw.toString("utf8"));
const fill = doc.header.fill_value; // -999
const P = doc.properties.parameter;

const START = Number(doc.header.start.slice(0, 4));
const END = Number(doc.header.end.slice(0, 4));
const years = [];
for (let y = START; y <= END; y++) years.push(y);

function blank() {
  return years.map(() => Array.from({ length: 12 }, () => ({ sum: 0, n: 0 })));
}
const acc = { tmax: blank(), tmin: blank(), rain: blank() };
const map = { tmax: "T2M_MAX", tmin: "T2M_MIN", rain: "PRECTOTCORR" };
const dailyTmaxByMonth = Array.from({ length: 12 }, () => []); // for day-to-day SD

for (const [k, name] of Object.entries(map)) {
  for (const [date, v] of Object.entries(P[name])) {
    if (v === fill || v == null) continue;
    const y = Number(date.slice(0, 4));
    const m = Number(date.slice(4, 6)) - 1;
    const cell = acc[k][y - START][m];
    cell.sum += v;
    cell.n += 1;
  }
}
const round = (x) => Math.round(x * 1000) / 1000;
const out = {};
for (const k of Object.keys(acc)) {
  out[k] = acc[k].map((row) => row.map((c) => (c.n >= 20 ? round(c.sum / c.n) : null)));
}

// Day-to-day deviation of Tmax around each (year, month) mean => regional default variability
for (const [date, v] of Object.entries(P.T2M_MAX)) {
  if (v === fill) continue;
  const y = Number(date.slice(0, 4));
  const m = Number(date.slice(4, 6)) - 1;
  const mean = out.tmax[y - START][m];
  if (mean == null) continue;
  dailyTmaxByMonth[m].push(v - mean);
}
const sd = dailyTmaxByMonth.map((a) => {
  if (a.length < 30) return null;
  const mu = a.reduce((s, x) => s + x, 0) / a.length;
  return round(Math.sqrt(a.reduce((s, x) => s + (x - mu) ** 2, 0) / (a.length - 1)));
});

const result = {
  schema: "agrilume.climate.monthly.v1",
  synthetic: false,
  location: { name: "Rajshahi", lat: entry.request.latitude, lon: entry.request.longitude },
  startYear: START,
  endYear: END,
  // 12 values per year (Jan..Dec); mm/day for rain; degC for temperatures; null = not enough daily values
  tmax: out.tmax,
  tmin: out.tmin,
  rain: out.rain,
  tmaxDailySd: sd,
  provenance: {
    provider: "NASA POWER",
    dataset: entry.dataset_id,
    endpoint: entry.endpoint,
    sourceUrl: entry.source_url,
    community: entry.request.community,
    retrievedAt: entry.retrieved_at,
    parameters: entry.request.parameters,
    units: entry.units,
    sourceFileSha256: sha256,
    manifestSha256: entry.sha256,
    derived: "Monthly means of daily values (>=20 valid days per month); Tmax day-to-day SD around the monthly mean.",
    spatial: "NASA POWER meteorology grid (about 0.5 x 0.625 deg) - not a farm-level measurement",
    temporal: "daily -> aggregated to monthly",
  },
};
writeFileSync(join(root, "lib/timetravel/data/rajshahi-power-monthly.json"), JSON.stringify(result));
console.log("wrote rajshahi-power-monthly.json", years.length, "years; sha256", sha256.slice(0, 12));
console.log("manifest sha256 field:", entry.sha256.slice(0, 12), "(computed above is the file sha256)");
