import type { RegionPreset } from "./types";

/** Deterministic pseudo-random helpers (no Math.random so scenes are reproducible and testable). */
export function hash2(x: number, y: number): number {
  let h = Math.imul(Math.floor(x) | 0, 374761393) ^ Math.imul(Math.floor(y) | 0, 668265263);
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  h ^= h >>> 16;
  return (h >>> 0) / 4294967295;
}

export function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function smooth(t: number): number {
  return t * t * (3 - 2 * t);
}

export function valueNoise(x: number, y: number): number {
  const xi = Math.floor(x);
  const yi = Math.floor(y);
  const xf = smooth(x - xi);
  const yf = smooth(y - yi);
  const a = hash2(xi, yi);
  const b = hash2(xi + 1, yi);
  const c = hash2(xi, yi + 1);
  const d = hash2(xi + 1, yi + 1);
  return a + (b - a) * xf + (c - a) * yf + (a - b - c + d) * xf * yf;
}

export function fbm(x: number, y: number, octaves = 4): number {
  let amp = 0.5;
  let f = 1;
  let s = 0;
  let n = 0;
  for (let i = 0; i < octaves; i++) {
    s += amp * valueNoise(x * f, y * f);
    n += amp;
    amp *= 0.5;
    f *= 2;
  }
  return s / n;
}

/** The cultivated plot (metres, centred on the origin). */
export const FIELD = { halfW: 20, halfD: 14 };

/** 0 inside the field platform, rising to 1 away from it. */
export function awayFromField(x: number, z: number, margin = 6): number {
  const dx = Math.max(0, Math.abs(x) - FIELD.halfW);
  const dz = Math.max(0, Math.abs(z) - FIELD.halfD);
  const d = Math.hypot(dx, dz);
  return Math.min(1, d / margin);
}

/** Sea/lake/river level used by the scene for each region (before seasonal wetness). */
export function waterLevelFor(region: RegionPreset, wetness: number): number {
  switch (region) {
    case "haor":
      return -1.1 + 1.25 * wetness; // basin fills in the monsoon
    case "coastal":
      return -0.35 + 0.15 * wetness;
    case "char":
      return -0.9 + 0.8 * wetness;
    case "floodplain":
      return -0.8 + 0.6 * wetness;
    case "hill":
      return -1.2 + 0.3 * wetness;
    case "barind":
      return -1.6 + 0.4 * wetness;
  }
}

/** Ground height (m) for a region at world (x, z). The field platform is flattened to y = 0. */
export function terrainHeight(region: RegionPreset, x: number, z: number): number {
  const away = awayFromField(x, z, 8);
  const flat = smooth(away); // 0 on the platform
  let h = 0;
  switch (region) {
    case "floodplain":
      h = (fbm(x * 0.02, z * 0.02) - 0.5) * 1.6;
      break;
    case "haor": {
      // low basin with raised village mounds
      const mound1 = Math.max(0, 1 - Math.hypot(x + 46, z - 8) / 16);
      const mound2 = Math.max(0, 1 - Math.hypot(x - 52, z + 24) / 14);
      h = -1.4 + (fbm(x * 0.03, z * 0.03) - 0.5) * 0.6 + 2.2 * smooth(mound1) + 1.8 * smooth(mound2);
      break;
    }
    case "coastal": {
      const creek = Math.exp(-Math.pow((z - 34 - Math.sin(x * 0.05) * 6) / 5, 2));
      h = (fbm(x * 0.03, z * 0.03) - 0.5) * 0.7 - 1.6 * creek;
      break;
    }
    case "barind":
      h = (fbm(x * 0.015 + 4, z * 0.015) - 0.35) * 5 * (0.4 + 0.6 * flat);
      break;
    case "hill": {
      const ridge = Math.max(0, Math.abs(z) - 22) * 0.55;
      h = (fbm(x * 0.02, z * 0.02, 5) - 0.3) * 8 * Math.min(1, ridge / 6 + 0.1);
      break;
    }
    case "char": {
      const river = Math.exp(-Math.pow((z + 38 + Math.sin(x * 0.04) * 8) / 12, 2));
      h = (fbm(x * 0.05, z * 0.05) - 0.5) * 0.5 - 1.4 * river;
      break;
    }
  }
  return h * flat;
}

export interface RegionLook {
  ground: [number, number, number];
  groundDry: [number, number, number];
  grass: [number, number, number];
  water: [number, number, number];
  hasTrees: "palm" | "mixed" | "mangrove" | "sparse" | "tea";
}

export const REGION_LOOK: Record<RegionPreset, RegionLook> = {
  floodplain: { ground: [0.32, 0.26, 0.17], groundDry: [0.62, 0.52, 0.36], grass: [0.3, 0.55, 0.22], water: [0.35, 0.55, 0.62], hasTrees: "mixed" },
  haor: { ground: [0.3, 0.27, 0.2], groundDry: [0.6, 0.55, 0.4], grass: [0.34, 0.58, 0.28], water: [0.28, 0.5, 0.6], hasTrees: "mixed" },
  coastal: { ground: [0.3, 0.27, 0.22], groundDry: [0.66, 0.6, 0.5], grass: [0.26, 0.5, 0.25], water: [0.3, 0.45, 0.45], hasTrees: "mangrove" },
  barind: { ground: [0.45, 0.25, 0.16], groundDry: [0.7, 0.45, 0.28], grass: [0.45, 0.5, 0.2], water: [0.4, 0.55, 0.6], hasTrees: "sparse" },
  hill: { ground: [0.3, 0.24, 0.16], groundDry: [0.55, 0.42, 0.28], grass: [0.22, 0.46, 0.2], water: [0.35, 0.55, 0.6], hasTrees: "tea" },
  char: { ground: [0.6, 0.56, 0.44], groundDry: [0.82, 0.76, 0.6], grass: [0.45, 0.58, 0.28], water: [0.42, 0.52, 0.55], hasTrees: "sparse" },
};
