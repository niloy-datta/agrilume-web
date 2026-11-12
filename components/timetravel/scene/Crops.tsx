"use client";

import React, { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { useLatest } from "../hooks/useLatest";
import { FIELD, mulberry32 } from "@/lib/timetravel/terrain";
import type { SceneParams } from "@/lib/timetravel/engine";

/**
 * Crops are drawn as GPU-instanced tufts. Growth, ripening, wilting, wind sway and lodging are all done in the
 * vertex/fragment shader from a handful of uniforms, so the 3D field updates every frame without rebuilding meshes.
 */

type Shape = "tuft" | "maize";

interface CropLook {
  shape: Shape;
  height: number; // metres at full growth
  width: number; // tuft radius scale
  base: [number, number, number];
  tip: [number, number, number];
  ripe: [number, number, number];
  spacing: number; // metres between plants (jittered grid)
}

const LOOK: Record<string, CropLook> = {
  aman: { shape: "tuft", height: 1.05, width: 0.9, base: [0.1, 0.34, 0.1], tip: [0.35, 0.65, 0.22], ripe: [0.9, 0.74, 0.28], spacing: 0.5 },
  boro: { shape: "tuft", height: 0.95, width: 0.9, base: [0.1, 0.36, 0.1], tip: [0.38, 0.68, 0.24], ripe: [0.92, 0.76, 0.3], spacing: 0.5 },
  aus: { shape: "tuft", height: 0.9, width: 0.9, base: [0.12, 0.35, 0.12], tip: [0.4, 0.66, 0.24], ripe: [0.9, 0.74, 0.3], spacing: 0.5 },
  wheat: { shape: "tuft", height: 0.85, width: 0.7, base: [0.14, 0.4, 0.14], tip: [0.55, 0.72, 0.28], ripe: [0.92, 0.8, 0.4], spacing: 0.4 },
  maize: { shape: "maize", height: 2.3, width: 1, base: [0.12, 0.38, 0.1], tip: [0.3, 0.62, 0.2], ripe: [0.82, 0.68, 0.3], spacing: 0.75 },
};

function lookFor(id: string): CropLook {
  return LOOK[id] ?? LOOK.boro;
}

/** A grass-like tuft: several curved tapered blades, normalised to height 1. `aTip` is 0 at the base and 1 at the tip. */
export function buildTuftGeometry(blades: number, segs: number): THREE.BufferGeometry {
  const pos: number[] = [];
  const tip: number[] = [];
  const idx: number[] = [];
  const rnd = mulberry32(7);
  for (let b = 0; b < blades; b++) {
    const ang = (b / blades) * Math.PI * 2 + rnd() * 0.5;
    const lean = 0.12 + rnd() * 0.3;
    const h = 0.75 + rnd() * 0.25;
    const w = 0.035 + rnd() * 0.015;
    const dx = Math.cos(ang);
    const dz = Math.sin(ang);
    const px = -dz;
    const pz = dx;
    const start = pos.length / 3;
    for (let s = 0; s <= segs; s++) {
      const t = s / segs;
      const out = lean * t * t * 1.4; // blade arches outward
      const y = t * h;
      const half = w * (1 - t * 0.92);
      const cx = dx * out * 0.5;
      const cz = dz * out * 0.5;
      pos.push(cx - px * half, y, cz - pz * half, cx + px * half, y, cz + pz * half);
      tip.push(t, t);
    }
    for (let s = 0; s < segs; s++) {
      const a = start + s * 2;
      idx.push(a, a + 1, a + 2, a + 1, a + 3, a + 2);
    }
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
  g.setAttribute("aTip", new THREE.Float32BufferAttribute(tip, 1));
  g.setIndex(idx);
  g.computeVertexNormals();
  return g;
}

/** Maize: a stalk (two crossed strips) plus alternating broad arching leaves and a small cob. Normalised to height 1. */
export function buildMaizeGeometry(leaves: number, segs: number): THREE.BufferGeometry {
  const pos: number[] = [];
  const tip: number[] = [];
  const idx: number[] = [];
  const addStrip = (points: { x: number; y: number; z: number; w: number; t: number }[], px: number, pz: number) => {
    const start = pos.length / 3;
    for (const p of points) {
      pos.push(p.x - px * p.w, p.y, p.z - pz * p.w, p.x + px * p.w, p.y, p.z + pz * p.w);
      tip.push(p.t, p.t);
    }
    for (let i = 0; i < points.length - 1; i++) {
      const a = start + i * 2;
      idx.push(a, a + 1, a + 2, a + 1, a + 3, a + 2);
    }
  };
  // stalk
  for (const [px, pz] of [
    [1, 0],
    [0, 1],
  ]) {
    const pts = [];
    for (let s = 0; s <= 4; s++) {
      const t = s / 4;
      pts.push({ x: 0, y: t * 0.92, z: 0, w: 0.012 * (1 - t * 0.5), t: t * 0.6 });
    }
    addStrip(pts, px, pz);
  }
  const rnd = mulberry32(11);
  for (let l = 0; l < leaves; l++) {
    const ang = l * 2.399 + rnd() * 0.4; // golden angle -> alternating leaves
    const dx = Math.cos(ang);
    const dz = Math.sin(ang);
    const attach = 0.18 + (l / leaves) * 0.62;
    const len = 0.36 - (l / leaves) * 0.12;
    const pts = [];
    for (let s = 0; s <= segs; s++) {
      const u = s / segs;
      const out = len * u;
      const y = attach + len * 0.55 * Math.sin(u * 1.5) - u * u * len * 0.35;
      const w = 0.045 * Math.sin(Math.PI * Math.min(1, u * 0.9 + 0.1)) * (1 - u * 0.3);
      pts.push({ x: dx * out, y, z: dz * out, w, t: Math.min(1, attach + u * 0.25) });
    }
    addStrip(pts, -dz, dx);
  }
  // cob
  {
    const y0 = 0.5;
    const pts = [];
    for (let s = 0; s <= 3; s++) {
      const u = s / 3;
      pts.push({ x: 0.03, y: y0 + u * 0.12, z: 0, w: 0.02 * Math.sin(Math.PI * (0.15 + u * 0.7)), t: 0.7 + u * 0.1 });
    }
    addStrip(pts, 0, 1);
    addStrip(pts, 1, 0);
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
  g.setAttribute("aTip", new THREE.Float32BufferAttribute(tip, 1));
  g.setIndex(idx);
  g.computeVertexNormals();
  return g;
}

interface Uniforms {
  uTime: { value: number };
  uGrowth: { value: number };
  uWind: { value: number };
  uLodge: { value: number };
  uRipe: { value: number };
  uWilt: { value: number };
  uDroop: { value: number };
  uHeat: { value: number };
  uBase: { value: THREE.Color };
  uTipC: { value: THREE.Color };
  uRipeC: { value: THREE.Color };
}

function makeMaterial(): { material: THREE.MeshStandardMaterial; uniforms: Uniforms } {
  const uniforms: Uniforms = {
    uTime: { value: 0 },
    uGrowth: { value: 0.5 },
    uWind: { value: 0.2 },
    uLodge: { value: 0 },
    uRipe: { value: 0 },
    uWilt: { value: 0 },
    uDroop: { value: 0 },
    uHeat: { value: 0 },
    uBase: { value: new THREE.Color() },
    uTipC: { value: new THREE.Color() },
    uRipeC: { value: new THREE.Color() },
  };
  const material = new THREE.MeshStandardMaterial({ side: THREE.DoubleSide, roughness: 0.85, metalness: 0 });
  material.onBeforeCompile = (shader) => {
    Object.assign(shader.uniforms, uniforms);
    shader.vertexShader = shader.vertexShader
      .replace(
        "#include <common>",
        `#include <common>
attribute float aTip;
uniform float uTime;
uniform float uGrowth;
uniform float uWind;
uniform float uLodge;
uniform float uDroop;
varying float vTip;
varying float vRnd;`,
      )
      .replace(
        "#include <begin_vertex>",
        `vec3 transformed = vec3(position);
vTip = aTip;
#ifdef USE_INSTANCING
  vec4 ip = instanceMatrix * vec4(0.0, 0.0, 0.0, 1.0);
#else
  vec4 ip = vec4(0.0);
#endif
vRnd = fract(sin(dot(ip.xz, vec2(12.9898, 78.233))) * 43758.5453);
float ph = ip.x * 0.31 + ip.z * 0.23;
float h = aTip;
float g = max(uGrowth, 0.04);
transformed.xz *= mix(0.45, 1.0, g);
transformed.y *= g;
float gust = sin(uTime * (1.1 + uWind * 2.4) + ph) * (0.03 + 0.2 * uWind) + sin(uTime * 2.7 + ph * 1.9) * 0.025 * uWind;
transformed.x += gust * h * h * g;
transformed.z += cos(uTime * 1.3 + ph * 1.3) * (0.02 + 0.08 * uWind) * h * h * g;
transformed.x += uLodge * h * h * 0.75 * g * (0.6 + vRnd * 0.8);
transformed.y -= uLodge * h * h * 0.28 * g;
transformed.x += uDroop * h * h * h * 0.3 * g;
transformed.y -= uDroop * h * h * h * 0.1 * g;`,
      );
    shader.fragmentShader = shader.fragmentShader
      .replace(
        "#include <common>",
        `#include <common>
uniform float uRipe;
uniform float uWilt;
uniform float uHeat;
uniform vec3 uBase;
uniform vec3 uTipC;
uniform vec3 uRipeC;
varying float vTip;
varying float vRnd;`,
      )
      .replace(
        "#include <color_fragment>",
        `#include <color_fragment>
vec3 leaf = mix(uBase, uTipC, smoothstep(0.0, 1.0, vTip));
leaf *= 0.9 + 0.2 * vRnd;
float ripeMix = uRipe * smoothstep(0.1, 0.85, vTip + 0.25 * uRipe);
leaf = mix(leaf, uRipeC * (0.9 + 0.2 * vRnd), ripeMix);
vec3 wiltC = vec3(0.56, 0.5, 0.24);
leaf = mix(leaf, wiltC, clamp(uWilt, 0.0, 1.0) * 0.85);
leaf = mix(leaf, leaf * vec3(1.12, 1.0, 0.82), uHeat * 0.5);
diffuseColor.rgb = leaf;`,
      );
  };
  material.customProgramCacheKey = () => "agrilume-crop-v1";
  return { material, uniforms };
}

export function Crops({ p, quality }: { p: SceneParams; quality: "low" | "high" }) {
  const look = lookFor(p.cropId);
  const hi = quality === "high";

  const positions = useMemo(() => {
    const out: { x: number; z: number; r: number; s: number }[] = [];
    const rnd = mulberry32(1234 + (look.shape === "maize" ? 1 : 0));
    const sp = look.spacing * (hi ? 1 : 1.35);
    const halfW = FIELD.halfW - 0.8;
    const halfD = FIELD.halfD - 0.8;
    for (let x = -halfW; x <= halfW; x += sp) {
      for (let z = -halfD; z <= halfD; z += sp) {
        const jx = x + (rnd() - 0.5) * sp * 0.9;
        const jz = z + (rnd() - 0.5) * sp * 0.9;
        // keep the two cross bunds free
        if (Math.abs(jx) < 0.6 || Math.abs(jz) < 0.6) continue;
        out.push({ x: jx, z: jz, r: rnd() * Math.PI * 2, s: 0.8 + rnd() * 0.4 });
      }
    }
    return out;
  }, [look.shape, look.spacing, hi]);

  const geometry = useMemo(
    () => (look.shape === "maize" ? buildMaizeGeometry(hi ? 8 : 5, hi ? 5 : 3) : buildTuftGeometry(hi ? 9 : 5, hi ? 5 : 3)),
    [look.shape, hi],
  );
  const { material, uniforms } = useMemo(() => makeMaterial(), []);
  const mesh = useRef<THREE.InstancedMesh>(null);

  useEffect(() => () => geometry.dispose(), [geometry]);
  useEffect(() => () => material.dispose(), [material]);

  useEffect(() => {
    const m = mesh.current;
    if (!m) return;
    const d = new THREE.Object3D();
    positions.forEach((q, i) => {
      d.position.set(q.x, 0.05, q.z);
      d.rotation.set(0, q.r, 0);
      const hs = look.height * q.s;
      d.scale.set(look.width * q.s, hs, look.width * q.s);
      d.updateMatrix();
      m.setMatrixAt(i, d.matrix);
    });
    m.count = positions.length;
    m.instanceMatrix.needsUpdate = true;
    m.computeBoundingSphere();
  }, [positions, look]);

  useEffect(() => {
    uniforms.uBase.value.setRGB(...look.base);
    uniforms.uTipC.value.setRGB(...look.tip);
    uniforms.uRipeC.value.setRGB(...look.ripe);
  }, [look, uniforms]);

  const target = useLatest({ growth: p.growth, wind: p.wind, lodge: p.lodging, ripe: p.ripeness, wilt: p.wilt, heat: p.heat });

  useFrame((_, dt) => {
    const u = uniforms;
    const k = Math.min(1, dt * 3);
    const t = target.current;
    u.uTime.value += dt;
    u.uGrowth.value += (t.growth - u.uGrowth.value) * k;
    u.uWind.value += (t.wind - u.uWind.value) * k;
    u.uLodge.value += (t.lodge - u.uLodge.value) * k;
    u.uRipe.value += (t.ripe - u.uRipe.value) * k;
    u.uWilt.value += (t.wilt - u.uWilt.value) * k;
    u.uHeat.value += (t.heat - u.uHeat.value) * k;
    u.uDroop.value = look.shape === "tuft" ? u.uRipe.value * 0.9 : 0;
  });

  // key forces a fresh instanced mesh when the instance count changes
  return (
    <instancedMesh
      key={`${look.shape}-${positions.length}`}
      ref={mesh}
      args={[geometry, material, positions.length]}
      castShadow={hi}
      receiveShadow
      frustumCulled={false}
      raycast={() => null}
    />
  );
}
