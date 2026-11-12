"use client";

import React, { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { FIELD, REGION_LOOK, awayFromField, mulberry32, terrainHeight, waterLevelFor } from "@/lib/timetravel/terrain";
import type { SceneParams } from "@/lib/timetravel/engine";
import type { RegionPreset } from "@/lib/timetravel/types";

interface Spot {
  x: number;
  z: number;
  y: number;
  s: number;
  r: number;
}

/** Deterministic scatter of positions outside the field and above the highest seasonal water line. */
function scatter(region: RegionPreset, count: number, seed: number, minAway = 12, maxR = 150): Spot[] {
  const rnd = mulberry32(seed);
  const out: Spot[] = [];
  const high = waterLevelFor(region, 1) + 0.25;
  let tries = 0;
  while (out.length < count && tries < count * 40) {
    tries++;
    const a = rnd() * Math.PI * 2;
    const r = 28 + Math.sqrt(rnd()) * maxR;
    const x = Math.cos(a) * r;
    const z = Math.sin(a) * r * 0.8;
    if (awayFromField(x, z, minAway) < 1) continue;
    const y = terrainHeight(region, x, z);
    if (y < high) continue;
    out.push({ x, z, y, s: 0.75 + rnd() * 0.7, r: rnd() * Math.PI * 2 });
  }
  return out;
}

function useInstances(spots: Spot[], scale: (s: Spot) => [number, number, number], yOffset = 0) {
  const ref = useRef<THREE.InstancedMesh>(null);
  useEffect(() => {
    const m = ref.current;
    if (!m) return;
    const d = new THREE.Object3D();
    spots.forEach((s, i) => {
      d.position.set(s.x, s.y + yOffset, s.z);
      d.rotation.set(0, s.r, 0);
      const sc = scale(s);
      d.scale.set(sc[0], sc[1], sc[2]);
      d.updateMatrix();
      m.setMatrixAt(i, d.matrix);
    });
    m.count = spots.length;
    m.instanceMatrix.needsUpdate = true;
    m.computeBoundingSphere();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [spots, yOffset]);
  return ref;
}

function TreesPositioned({ region, quality }: { region: RegionPreset; quality: "low" | "high" }) {
  const style = REGION_LOOK[region].hasTrees;
  const n = Math.round((quality === "high" ? 70 : 32) * (style === "sparse" ? 0.45 : 1));
  const spots = useMemo(() => scatter(region, n, 31), [region, n]);
  const trunkH = style === "palm" ? 7 : 3.2;
  const trunk = useInstances(spots, (s) => [s.s, s.s, s.s], (trunkH * 0.5) as number);
  const crown = useInstances(spots, (s) => [s.s, s.s * (style === "palm" ? 1 : 0.9), s.s], trunkH + (style === "palm" ? 0.4 : 1.6));
  const crown2 = useInstances(spots, (s) => [s.s, s.s, s.s], trunkH + 2.6);
  const leaf = style === "mangrove" ? "#2f6b43" : style === "tea" ? "#3a7a3b" : "#3f8a3a";

  return (
    <group>
      <instancedMesh key={`t-${spots.length}`} ref={trunk} args={[undefined, undefined, spots.length]} castShadow raycast={() => null}>
        <cylinderGeometry args={[0.18, 0.28, trunkH, 6]} />
        <meshStandardMaterial color="#6a4b30" roughness={1} />
      </instancedMesh>
      {style === "palm" ? (
        <instancedMesh key={`c-${spots.length}`} ref={crown} args={[undefined, undefined, spots.length]} castShadow raycast={() => null}>
          <coneGeometry args={[2.6, 1.4, 7]} />
          <meshStandardMaterial color={leaf} roughness={0.9} flatShading />
        </instancedMesh>
      ) : (
        <>
          <instancedMesh key={`c-${spots.length}`} ref={crown} args={[undefined, undefined, spots.length]} castShadow raycast={() => null}>
            <icosahedronGeometry args={[2.3, 1]} />
            <meshStandardMaterial color={leaf} roughness={0.95} flatShading />
          </instancedMesh>
          <instancedMesh key={`d-${spots.length}`} ref={crown2} args={[undefined, undefined, spots.length]} castShadow raycast={() => null}>
            <icosahedronGeometry args={[1.5, 1]} />
            <meshStandardMaterial color="#4c9a42" roughness={0.95} flatShading />
          </instancedMesh>
        </>
      )}
    </group>
  );
}

function TeaRows({ region }: { region: RegionPreset }) {
  const spots = useMemo(() => {
    if (region !== "hill") return [] as Spot[];
    const out: Spot[] = [];
    for (let i = 0; i < 12; i++) {
      for (let j = 0; j < 30; j++) {
        const x = -58 + j * 1.0;
        const z = 30 + i * 2.1;
        out.push({ x, z, y: terrainHeight(region, x, z), s: 0.9 + ((i * 7 + j * 3) % 5) * 0.05, r: 0 });
      }
    }
    return out;
  }, [region]);
  const ref = useInstances(spots, (s) => [s.s, s.s * 0.8, s.s], 0.35);
  if (spots.length === 0) return null;
  return (
    <instancedMesh key={spots.length} ref={ref} args={[undefined, undefined, spots.length]} raycast={() => null}>
      <icosahedronGeometry args={[0.55, 0]} />
      <meshStandardMaterial color="#2f7a33" roughness={1} flatShading />
    </instancedMesh>
  );
}

function Hut({ x, z, y, r, tin }: { x: number; z: number; y: number; r: number; tin: boolean }) {
  return (
    <group position={[x, y, z]} rotation={[0, r, 0]}>
      <mesh position={[0, 1.1, 0]} castShadow receiveShadow raycast={() => null}>
        <boxGeometry args={[4.2, 2.2, 3.2]} />
        <meshStandardMaterial color="#b89b72" roughness={1} />
      </mesh>
      <mesh position={[0, 2.8, 0]} rotation={[0, 0, Math.PI / 4]} castShadow raycast={() => null}>
        <boxGeometry args={[2.5, 2.5, 3.6]} />
        <meshStandardMaterial color={tin ? "#8aa0a8" : "#a8873f"} roughness={tin ? 0.5 : 1} metalness={0} />
      </mesh>
      <mesh position={[0, 0.8, 1.61]} raycast={() => null}>
        <boxGeometry args={[0.9, 1.6, 0.05]} />
        <meshStandardMaterial color="#4a3320" />
      </mesh>
    </group>
  );
}

function Village({ region }: { region: RegionPreset }) {
  const huts = useMemo(() => {
    const rnd = mulberry32(77);
    const out: { x: number; z: number; y: number; r: number; tin: boolean }[] = [];
    const high = waterLevelFor(region, 1) + 0.4;
    let tries = 0;
    while (out.length < 7 && tries < 300) {
      tries++;
      const base =
        region === "haor"
          ? rnd() < 0.5
            ? { x: -46, z: 8 }
            : { x: 52, z: -24 }
          : { x: (rnd() < 0.5 ? -1 : 1) * (FIELD.halfW + 24), z: (rnd() - 0.5) * 50 };
      const x = base.x + (rnd() - 0.5) * (region === "haor" ? 14 : 22);
      const z = base.z + (rnd() - 0.5) * (region === "haor" ? 10 : 30);
      const y = terrainHeight(region, x, z);
      if (y < high || awayFromField(x, z, 10) < 1) continue;
      if (out.some((h) => Math.hypot(h.x - x, h.z - z) < 7)) continue;
      out.push({ x, z, y, r: rnd() * Math.PI, tin: rnd() < 0.6 });
    }
    return out;
  }, [region]);
  return (
    <group>
      {huts.map((h, i) => (
        <Hut key={i} {...h} />
      ))}
    </group>
  );
}

/** Slow-moving birds make the scene feel alive without costing much. */
function Birds({ active }: { active: boolean }) {
  const g = useRef<THREE.Group>(null);
  useFrame((st) => {
    const t = st.clock.elapsedTime;
    if (!g.current) return;
    g.current.children.forEach((c, i) => {
      const a = t * 0.15 + i * 2.1;
      c.position.set(Math.cos(a) * (40 + i * 8), 18 + Math.sin(t + i) * 1.2, Math.sin(a) * (30 + i * 6));
      c.rotation.y = -a;
      c.rotation.z = Math.sin(t * 6 + i) * 0.35;
    });
  });
  if (!active) return null;
  return (
    <group ref={g}>
      {[0, 1, 2, 3, 4].map((i) => (
        <mesh key={i} raycast={() => null}>
          <coneGeometry args={[0.35, 1.1, 3]} />
          <meshBasicMaterial color="#1c1c1c" />
        </mesh>
      ))}
    </group>
  );
}

export function Surroundings({ p, quality }: { p: SceneParams; quality: "low" | "high" }) {
  return (
    <group>
      <TreesPositioned region={p.region} quality={quality} />
      <TeaRows region={p.region} />
      <Village region={p.region} />
      <Birds active={p.rain < 0.3 && p.wind < 0.4 && p.floodDepth <= 0} />
    </group>
  );
}

