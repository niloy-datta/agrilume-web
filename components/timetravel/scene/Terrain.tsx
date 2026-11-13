"use client";

import React, { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import type { ThreeEvent } from "@react-three/fiber";
import { REGION_LOOK, FIELD, terrainHeight, waterLevelFor, fbm, hash2 } from "@/lib/timetravel/terrain";
import type { SceneParams } from "@/lib/timetravel/engine";
import type { RegionPreset } from "@/lib/timetravel/types";

const SIZE = 360;

function lerp3(a: [number, number, number], b: [number, number, number], t: number): [number, number, number] {
  return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t];
}

/** Builds the displaced ground mesh with vertex colours for a region. */
export function buildTerrainGeometry(region: RegionPreset, segments: number, dryness: number): THREE.BufferGeometry {
  const g = new THREE.PlaneGeometry(SIZE, SIZE, segments, segments);
  g.rotateX(-Math.PI / 2);
  const pos = g.attributes.position as THREE.BufferAttribute;
  const colors = new Float32Array(pos.count * 3);
  const look = REGION_LOOK[region];
  const soil = lerp3(look.ground, look.groundDry, dryness);
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i);
    const z = pos.getZ(i);
    const h = terrainHeight(region, x, z);
    pos.setY(i, h);
    const n = fbm(x * 0.08, z * 0.08, 3);
    // low ground = soil/mud, higher ground = grass, variation by noise
    const grassMix = Math.min(1, Math.max(0, (h + 0.4) / 1.2)) * (0.55 + 0.45 * n);
    const c = lerp3(soil, look.grass, grassMix * (1 - dryness * 0.55));
    const v = 0.9 + 0.2 * hash2(Math.floor(x * 2), Math.floor(z * 2));
    colors[i * 3] = c[0] * v;
    colors[i * 3 + 1] = c[1] * v;
    colors[i * 3 + 2] = c[2] * v;
  }
  g.setAttribute("color", new THREE.BufferAttribute(colors, 3));
  g.computeVertexNormals();
  return g;
}

function makeRippleTexture(): THREE.CanvasTexture {
  const c = document.createElement("canvas");
  c.width = 256;
  c.height = 256;
  const ctx = c.getContext("2d")!;
  const img = ctx.createImageData(256, 256);
  for (let y = 0; y < 256; y++) {
    for (let x = 0; x < 256; x++) {
      const v = 0.5 + 0.5 * Math.sin(x * 0.18) * Math.cos(y * 0.14) + 0.25 * Math.sin((x + y) * 0.31);
      const o = (y * 256 + x) * 4;
      img.data[o] = 128 + 60 * (v - 0.5);
      img.data[o + 1] = 128 + 60 * (0.5 - v);
      img.data[o + 2] = 255;
      img.data[o + 3] = 255;
    }
  }
  ctx.putImageData(img, 0, 0);
  const t = new THREE.CanvasTexture(c);
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.repeat.set(40, 40);
  return t;
}

function makeCrackTexture(): THREE.CanvasTexture {
  const c = document.createElement("canvas");
  c.width = 512;
  c.height = 512;
  const ctx = c.getContext("2d")!;
  ctx.clearRect(0, 0, 512, 512);
  ctx.strokeStyle = "rgba(40,25,12,0.9)";
  ctx.lineCap = "round";
  // Voronoi-like crack network from deterministic seeds
  const seeds: [number, number][] = [];
  for (let i = 0; i < 70; i++) seeds.push([hash2(i, 1) * 512, hash2(i, 2) * 512]);
  for (let i = 0; i < seeds.length; i++) {
    const [x, y] = seeds[i];
    const near = seeds
      .map((s, j) => ({ j, d: Math.hypot(s[0] - x, s[1] - y) }))
      .filter((o) => o.j !== i)
      .sort((a, b) => a.d - b.d)
      .slice(0, 3);
    for (const n of near) {
      const mx = (x + seeds[n.j][0]) / 2;
      const my = (y + seeds[n.j][1]) / 2;
      const dx = seeds[n.j][0] - x;
      const dy = seeds[n.j][1] - y;
      const len = Math.hypot(dx, dy) * 0.45;
      const nx = -dy / (Math.hypot(dx, dy) || 1);
      const ny = dx / (Math.hypot(dx, dy) || 1);
      ctx.lineWidth = 1.5 + hash2(i, n.j) * 2;
      ctx.beginPath();
      ctx.moveTo(mx - nx * len, my - ny * len);
      ctx.lineTo(mx + nx * len, my + ny * len);
      ctx.stroke();
    }
  }
  const t = new THREE.CanvasTexture(c);
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.repeat.set(5, 4);
  return t;
}

function makeSaltTexture(): THREE.CanvasTexture {
  const c = document.createElement("canvas");
  c.width = 256;
  c.height = 256;
  const ctx = c.getContext("2d")!;
  const img = ctx.createImageData(256, 256);
  for (let y = 0; y < 256; y++) {
    for (let x = 0; x < 256; x++) {
      const n = fbm(x * 0.05, y * 0.05, 4);
      const a = n > 0.52 ? Math.min(255, (n - 0.52) * 900) : 0;
      const o = (y * 256 + x) * 4;
      img.data[o] = 250;
      img.data[o + 1] = 250;
      img.data[o + 2] = 245;
      img.data[o + 3] = a;
    }
  }
  ctx.putImageData(img, 0, 0);
  const t = new THREE.CanvasTexture(c);
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.repeat.set(4, 3);
  return t;
}

export function Terrain({
  p,
  segments,
  onGroundClick,
  groundRef,
}: {
  p: SceneParams;
  segments: number;
  onGroundClick?: (e: ThreeEvent<MouseEvent>) => void;
  groundRef?: React.Ref<THREE.Mesh>;
}) {
  const dryBucket = Math.round(p.dryness * 4) / 4;
  const geo = useMemo(() => buildTerrainGeometry(p.region, segments, dryBucket), [p.region, segments, dryBucket]);
  useEffect(() => () => geo.dispose(), [geo]);

  const ripple = useMemo(() => makeRippleTexture(), []);
  const crack = useMemo(() => makeCrackTexture(), []);
  const salt = useMemo(() => makeSaltTexture(), []);
  const waterRef = useRef<THREE.Mesh>(null);
  const look = REGION_LOOK[p.region];

  const baseWater = waterLevelFor(p.region, p.wetness);
  const floodLevel = p.floodDepth > 0 ? p.floodDepth - 0.05 : -99;
  const waterY = Math.max(baseWater, floodLevel);
  const waterColor = useMemo(() => {
    const c = new THREE.Color(look.water[0], look.water[1], look.water[2]);
    if (p.floodDepth > 0) c.lerp(new THREE.Color(0.45, 0.36, 0.22), 0.55); // muddy flood water
    return c;
  }, [look, p.floodDepth]);

  useFrame((_, dt) => {
    ripple.offset.x += dt * 0.012;
    ripple.offset.y += dt * 0.008;
    if (waterRef.current) waterRef.current.position.y += (waterY - waterRef.current.position.y) * Math.min(1, dt * 2.5);
  });

  const soilColor = useMemo(() => {
    const c = new THREE.Color(look.ground[0], look.ground[1], look.ground[2]);
    c.lerp(new THREE.Color(look.groundDry[0], look.groundDry[1], look.groundDry[2]), p.dryness);
    return c;
  }, [look, p.dryness]);

  return (
    <group>
      <mesh ref={groundRef} geometry={geo} receiveShadow onClick={onGroundClick}>
        <meshStandardMaterial vertexColors roughness={0.95} metalness={0} />
      </mesh>

      {/* regional water: lakes, rivers, creeks and floods are all one level plane intersecting the terrain */}
      <mesh ref={waterRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, waterY, 0]} raycast={() => null}>
        <planeGeometry args={[SIZE, SIZE]} />
        <meshStandardMaterial
          color={waterColor}
          transparent
          opacity={p.floodDepth > 0 ? 0.88 : 0.72}
          roughness={0.12}
          metalness={0}
          normalMap={ripple}
          normalScale={new THREE.Vector2(0.35, 0.35)}
          depthWrite={false}
        />
      </mesh>

      {/* cultivated plot: soil, cracks (drought), salt crust (salinity) */}
      <group position={[0, 0.03, 0]}>
        <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow raycast={() => null}>
          <planeGeometry args={[FIELD.halfW * 2 + 1, FIELD.halfD * 2 + 1]} />
          <meshStandardMaterial color={soilColor} roughness={1} />
        </mesh>
        {p.dryness > 0.15 && (
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.004, 0]} raycast={() => null}>
            <planeGeometry args={[FIELD.halfW * 2 + 1, FIELD.halfD * 2 + 1]} />
            <meshStandardMaterial map={crack} transparent opacity={Math.min(1, p.dryness * 1.1)} depthWrite={false} roughness={1} />
          </mesh>
        )}
        {p.salt > 0.05 && (
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.008, 0]} raycast={() => null}>
            <planeGeometry args={[FIELD.halfW * 2 + 1, FIELD.halfD * 2 + 1]} />
            <meshStandardMaterial map={salt} transparent opacity={Math.min(1, p.salt * 1.4)} depthWrite={false} roughness={0.6} />
          </mesh>
        )}
        {p.paddyWater > 0 && p.floodDepth <= 0 && (
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, p.paddyWater, 0]} raycast={() => null}>
            <planeGeometry args={[FIELD.halfW * 2 - 1, FIELD.halfD * 2 - 1]} />
            <meshStandardMaterial
              color="#8fb9c4"
              transparent
              opacity={0.5}
              roughness={0.1}
              metalness={0}
              normalMap={ripple}
              normalScale={new THREE.Vector2(0.2, 0.2)}
              depthWrite={false}
            />
          </mesh>
        )}
      </group>

      {/* bunds (small earth walls) dividing the plot into four paddies */}
      {[
        [0, 0.09, 0, FIELD.halfW * 2 + 1, 0.2, 0.9],
        [0, 0.09, 0, 0.9, 0.2, FIELD.halfD * 2 + 1],
        [0, 0.09, FIELD.halfD + 0.5, FIELD.halfW * 2 + 2, 0.24, 1],
        [0, 0.09, -FIELD.halfD - 0.5, FIELD.halfW * 2 + 2, 0.24, 1],
        [FIELD.halfW + 0.5, 0.09, 0, 1, 0.24, FIELD.halfD * 2 + 2],
        [-FIELD.halfW - 0.5, 0.09, 0, 1, 0.24, FIELD.halfD * 2 + 2],
      ].map((b, i) => (
        <mesh key={i} position={[b[0], b[1], b[2]]} castShadow receiveShadow raycast={() => null}>
          <boxGeometry args={[b[3], b[4], b[5]]} />
          <meshStandardMaterial color={soilColor} roughness={1} />
        </mesh>
      ))}
    </group>
  );
}
