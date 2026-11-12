import { describe, it, expect } from "vitest";
import { rajshahiFixture } from "@/lib/timetravel/power";
import { computeView, dateAtDay, eventEnvelope, initialState, sceneParams, MIN_YEAR, MAX_YEAR } from "@/lib/timetravel/engine";
import { defaultHazardEvent } from "@/lib/timetravel/hazards";
import { FIELD, terrainHeight, waterLevelFor, hash2, fbm, mulberry32, awayFromField } from "@/lib/timetravel/terrain";

const series = rajshahiFixture();

describe("dateAtDay", () => {
  it("rolls over years in both directions", () => {
    expect(dateAtDay(2022, 360, 10).year).toBe(2023);
    expect(dateAtDay(2022, 5, -10).year).toBe(2021);
    const d = dateAtDay(2022, 1, 0);
    expect(d.m0).toBe(0);
    expect(d.d).toBe(1);
  });
});

describe("eventEnvelope", () => {
  const ev = { type: "flood" as const, startDay: 10, days: 12, severity: 0.6 };
  it("is zero outside the window and positive inside", () => {
    expect(eventEnvelope(ev, 9)).toBe(0);
    expect(eventEnvelope(ev, 22)).toBe(0);
    expect(eventEnvelope(ev, 15)).toBeGreaterThan(0.9);
    for (let d = 10; d < 22; d++) {
      const e = eventEnvelope(ev, d);
      expect(e).toBeGreaterThanOrEqual(0);
      expect(e).toBeLessThanOrEqual(1);
    }
  });
});

describe("computeView + sceneParams", () => {
  it("produces a consistent observed view for the default state", () => {
    const st = initialState(new Date("2026-11-08"));
    expect(st.year).toBeLessThanOrEqual(2025);
    const v = computeView(st, series, null);
    expect(v.dataKind).toBe("observed");
    expect(v.index).toBeGreaterThan(30);
    expect(v.index).toBeLessThan(150);
    const p = sceneParams(v);
    expect(p.growth).toBeGreaterThanOrEqual(0);
    expect(p.growth).toBeLessThanOrEqual(1);
    expect(p.paddy).toBe(true);
  });

  it("labels future years as what-if / projection, never observed", () => {
    const st = { ...initialState(), year: 2050 };
    const v = computeView(st, series, null);
    expect(v.dataKind).not.toBe("observed");
    expect(v.isFuture).toBe(true);
  });

  it("a flood event raises scene flood depth only while active", () => {
    const st = initialState();
    const ev = defaultHazardEvent("flood", 40);
    const during = sceneParams(computeView({ ...st, events: [ev], day: ev.startDay + Math.floor(ev.days / 2) }, series, null));
    const before = sceneParams(computeView({ ...st, events: [ev], day: Math.max(0, ev.startDay - 5) }, series, null));
    expect(during.floodDepth).toBeGreaterThan(0);
    expect(before.floodDepth).toBe(0);
  });

  it("year bounds are as documented", () => {
    expect(MIN_YEAR).toBe(1981);
    expect(MAX_YEAR).toBe(2056);
  });
});

describe("terrain helpers", () => {
  it("are deterministic", () => {
    expect(hash2(3, 7)).toBe(hash2(3, 7));
    expect(fbm(1.3, 2.1)).toBe(fbm(1.3, 2.1));
    const a = mulberry32(42);
    const b = mulberry32(42);
    expect(a()).toBe(b());
  });
  it("keeps the field platform flat for every region", () => {
    for (const r of ["floodplain", "haor", "coastal", "barind", "hill", "char"] as const) {
      for (const [x, z] of [[0, 0], [FIELD.halfW - 1, 0], [0, FIELD.halfD - 1], [-10, 5]]) {
        expect(Math.abs(terrainHeight(r, x, z))).toBeLessThan(1e-9);
      }
    }
  });
  it("water level rises with wetness and awayFromField is bounded", () => {
    expect(waterLevelFor("haor", 1)).toBeGreaterThan(waterLevelFor("haor", 0));
    expect(awayFromField(0, 0)).toBe(0);
    expect(awayFromField(500, 500)).toBe(1);
  });
});
