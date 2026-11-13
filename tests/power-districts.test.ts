import { describe, it, expect } from "vitest";
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { createHash } from "node:crypto";
import { join } from "node:path";
import { parseDistrictFile, loadBundledDistrict, rajshahiFixture } from "@/lib/timetravel/power";
import { DISTRICTS } from "@/lib/timetravel/locations";
import { defaultBaseline, WMO_NORMAL } from "@/lib/timetravel/climate";

const ROOT = join(__dirname, "..");
const read = (id: string) => JSON.parse(readFileSync(join(ROOT, "public/data/power", `${id}.json`), "utf8"));
const manifest = JSON.parse(readFileSync(join(ROOT, "data/source/nasa_power/districts/manifest.json"), "utf8"));

describe("bundled NASA POWER district files (build-time pipeline)", () => {
  it("exist for every one of the 64 districts and parse strictly", () => {
    expect(DISTRICTS).toHaveLength(64);
    expect(readdirSync(join(ROOT, "public/data/power")).filter((f) => f.endsWith(".json"))).toHaveLength(64);
    for (const d of DISTRICTS) {
      const s = parseDistrictFile(read(d.id), d.id);
      expect(s.startYear).toBe(1981);
      expect(s.endYear).toBe(2025);
      expect(s.lat).toBeCloseTo(d.lat, 6);
      expect(s.lon).toBeCloseTo(d.lon, 6);
      expect(s.provenance.origin).toBe("nasa-power-bundled");
      expect(s.provenance.synthetic).toBe(false);
      expect(s.tmaxDailySd.every((v) => v != null && v > 0.5 && v < 5)).toBe(true);
    }
  });

  it("trace back to the raw NASA POWER daily responses recorded in the manifest", () => {
    for (const d of DISTRICTS) {
      const meta = manifest.files[d.id];
      expect(meta.synthetic).toBe(false);
      expect(meta.sourceUrl).toContain("/api/temporal/daily/point?");
      expect(read(d.id).provenance.sourceFileSha256).toBe(meta.sha256);
      expect(read(d.id).provenance.sourceUrl).toBe(meta.sourceUrl);
      // The raw cache is git-ignored (~50 MB). When present (after running the pipeline) verify bytes and values too.
      const rawPath = join(ROOT, "data/source/nasa_power/districts/raw", `${d.id}.json`);
      if (!existsSync(rawPath)) continue;
      const raw = readFileSync(rawPath);
      expect(createHash("sha256").update(raw).digest("hex")).toBe(meta.sha256);
      const july = Object.entries(JSON.parse(raw.toString("utf8")).properties.parameter.T2M_MAX as Record<string, number>)
        .filter(([k, v]) => k.startsWith("202007") && v !== -999)
        .map(([, v]) => v);
      expect(read(d.id).tmax[2020 - 1981][6]).toBeCloseTo(july.reduce((s, v) => s + v, 0) / july.length, 3);
    }
  });

  it("are physically plausible for Bangladesh (wettest NE/SE, driest NW)", () => {
    const annualRain = (id: string) => {
      const s = parseDistrictFile(read(id));
      const dm = [31, 28.25, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
      return s.rain.reduce((acc, row) => acc + row.reduce<number>((a, v, i) => a + (v ?? 0) * dm[i], 0), 0) / s.rain.length;
    };
    expect(annualRain("sylhet")).toBeGreaterThan(annualRain("rajshahi") * 2);
    expect(annualRain("coxsbazar")).toBeGreaterThan(annualRain("dhaka"));
    expect(annualRain("rajshahi")).toBeGreaterThan(900);
    expect(annualRain("rajshahi")).toBeLessThan(1800);
  });

  it("use the WMO 1991-2020 normal as the default baseline", () => {
    expect(defaultBaseline(parseDistrictFile(read("dhaka")))).toEqual(WMO_NORMAL);
    // the 2001-2025 daily fixture cannot cover it and keeps all its years
    expect(defaultBaseline(rajshahiFixture())).toEqual({ from: 2001, to: 2025 });
  });

  it("reproduce the separately built 2001-2025 Rajshahi fixture exactly (reproducibility check, NOT ground truth)", () => {
    const monthly = parseDistrictFile(read("rajshahi"));
    const daily = rajshahiFixture();
    const diffs: number[] = [];
    for (let y = 2001; y <= 2025; y++)
      for (let m = 0; m < 12; m++) {
        const a = monthly.tmax[y - 1981][m];
        const b = daily.tmax[y - 2001][m];
        if (a != null && b != null) diffs.push(a - b);
      }
    const mae = diffs.reduce((s, d) => s + Math.abs(d), 0) / diffs.length;
    expect(diffs.length).toBeGreaterThan(280);
    expect(mae).toBeLessThan(0.001);
  });
});

describe("parseDistrictFile rejects bad input", () => {
  const good = () => read("dhaka");
  it("wrong district", () => expect(() => parseDistrictFile(good(), "sylhet")).toThrow(/expected sylhet/));
  it("wrong schema", () => expect(() => parseDistrictFile({ ...good(), schema: "x" })).toThrow(/schema/));
  it("non-object", () => expect(() => parseDistrictFile(null)).toThrow());
  it("location outside Bangladesh", () =>
    expect(() => parseDistrictFile({ ...good(), location: { ...good().location, lat: 40 } })).toThrow(/outside/));
  it("implausible temperature", () => {
    const g = good();
    g.tmax[3][3] = 80;
    expect(() => parseDistrictFile(g)).toThrow(/Tmax/);
  });
  it("negative rainfall", () => {
    const g = good();
    g.rain[3][3] = -1;
    expect(() => parseDistrictFile(g)).toThrow(/rainfall/);
  });
  it("ragged grid", () => {
    const g = good();
    g.tmin[0] = [1, 2];
    expect(() => parseDistrictFile(g)).toThrow(/grids/);
  });
  it("wrong rainfall units", () => {
    const g = good();
    g.provenance.units.PRECTOTCORR = "inches";
    expect(() => parseDistrictFile(g)).toThrow(/units/);
  });
  it("missing provenance", () => expect(() => parseDistrictFile({ ...good(), provenance: undefined })).toThrow(/provenance/));
});

describe("loadBundledDistrict", () => {
  it("returns an error object (never made-up numbers) on HTTP failure", async () => {
    const r = await loadBundledDistrict("dhaka", "", (async () => new Response("no", { status: 404 })) as typeof fetch);
    expect(r.ok).toBe(false);
  });
  it("rejects path-like ids before fetching", async () => {
    let called = false;
    const r = await loadBundledDistrict("../secret", "", (async () => {
      called = true;
      return new Response("{}");
    }) as typeof fetch);
    expect(r.ok).toBe(false);
    expect(called).toBe(false);
  });
  it("loads and validates through fetch", async () => {
    const r = await loadBundledDistrict("sylhet", "/base", (async (url: string) => {
      expect(url).toBe("/base/data/power/sylhet.json");
      return new Response(JSON.stringify(read("sylhet")));
    }) as unknown as typeof fetch);
    expect(r.ok && r.series.name).toBe("Sylhet");
  });
});

describe("NASA dataset registry keeps integration stages separate", () => {
  it("nothing merely registered is reported as fetched, processed or displayed", async () => {
    const { NASA_DATASETS, pipelineStages } = await import("@/lib/timetravel/nasa-datasets");
    for (const d of NASA_DATASETS) {
      const st = pipelineStages(d);
      expect(st.registered).toBe(true);
      if (d.integration === "registered" || d.integration === "backend-client") {
        expect(st.fetched || st.processed || st.displayed, d.id).toBe(false);
      }
      // stages are monotone: you cannot display what you have not fetched
      if (st.displayed) expect(st.fetched && st.processed && st.adapter).toBe(true);
    }
  });
});
