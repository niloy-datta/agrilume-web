import { describe, it, expect } from "vitest";
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { loadNdvi, ndviAnomaly, parseNdviFile } from "@/lib/timetravel/ndvi";
import { DISTRICTS } from "@/lib/timetravel/locations";

const DIR = join(__dirname, "..", "public/data/ndvi");
const files = existsSync(DIR) ? readdirSync(DIR).filter((f) => f.endsWith(".json")) : [];
const read = (f: string) => JSON.parse(readFileSync(join(DIR, f), "utf8"));

describe("MODIS NDVI files (ORNL DAAC pipeline)", () => {
  it("exist for real districts only", () => {
    expect(files.length).toBeGreaterThan(0);
    const ids = new Set(DISTRICTS.map((d) => d.id));
    for (const f of files) expect(ids.has(f.replace(".json", ""))).toBe(true);
  });
  it("parse strictly and carry provenance + quality information", () => {
    for (const f of files) {
      const n = parseNdviFile(read(f), f.replace(".json", ""));
      expect(n.provenance.service).toContain("modis.ornl.gov");
      expect(n.window.pixels).toBe(81);
      expect(n.quality.compositesUsable).toBeLessThanOrEqual(n.quality.compositesTotal);
      // a composite with too few usable pixels must be null, never a guess
      for (const c of n.composites) if (c.goodFrac < 0.25) expect(c.ndvi).toBeNull();
    }
  });
  it("show a plausible Bangladesh seasonal cycle where data exist (vegetated, below dense-forest maximum)", () => {
    for (const f of files) {
      const vals = parseNdviFile(read(f)).climatology.filter((v): v is number => v != null);
      expect(vals.length).toBeGreaterThanOrEqual(6);
      expect(Math.max(...vals)).toBeGreaterThan(0.3);
      expect(Math.max(...vals)).toBeLessThan(0.95);
    }
  });
});

describe("NDVI parsing and anomalies", () => {
  const sample = () => read(files[0]);
  it("rejects another district's file", () => expect(() => parseNdviFile(sample(), "not-this-one")).toThrow(/another district/));
  it("rejects out-of-range NDVI", () => {
    const s = sample();
    s.climatology[0] = 1.7;
    expect(() => parseNdviFile(s)).toThrow(/climatology/);
  });
  it("rejects missing provenance", () => expect(() => parseNdviFile({ ...sample(), provenance: {} })).toThrow(/provenance/));
  it("anomaly is null (not 0) when a month has no clear data", () => {
    const n = parseNdviFile(sample());
    const y = String(n.years[0]);
    n.monthlyByYear[y][6] = null;
    expect(ndviAnomaly(n, Number(y), 6)).toBeNull();
    const m = n.climatology.findIndex((v, i) => v != null && n.monthlyByYear[y][i] != null);
    expect(ndviAnomaly(n, Number(y), m)).toBeCloseTo(n.monthlyByYear[y][m]! - n.climatology[m]!, 12);
  });
  it("loader returns null instead of throwing on network failure or bad ids", async () => {
    expect(await loadNdvi("dhaka", "", (async () => { throw new Error("offline"); }) as unknown as typeof fetch)).toBeNull();
    expect(await loadNdvi("../x")).toBeNull();
  });
});
