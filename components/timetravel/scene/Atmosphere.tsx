"use client";

import React, { useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame, useThree } from "@react-three/fiber";
import { Sky, Stars } from "@react-three/drei";
import { mulberry32 } from "@/lib/timetravel/terrain";
import type { SceneParams } from "@/lib/timetravel/engine";

export type TimeOfDay = "dawn" | "day" | "dusk" | "night";

export const TOD_HOURS: Record<TimeOfDay, number> = { dawn: 6.2, day: 11, dusk: 17.6, night: 22 };

/** Sun elevation/azimuth for an hour of the day (a simple educational sun path, not an ephemeris). */
export function sunVector(hour: number, month0: number): THREE.Vector3 {
  const decl = 23.44 * Math.sin(((month0 - 2.8) / 12) * Math.PI * 2) * (Math.PI / 180);
  const lat = 24 * (Math.PI / 180);
  const ha = ((hour - 12) / 12) * Math.PI;
  const sinAlt = Math.sin(lat) * Math.sin(decl) + Math.cos(lat) * Math.cos(decl) * Math.cos(ha);
  const alt = Math.asin(Math.max(-1, Math.min(1, sinAlt)));
  const az = Math.atan2(Math.sin(ha), Math.cos(ha) * Math.sin(lat) - Math.tan(decl) * Math.cos(lat));
  const r = 400;
  return new THREE.Vector3(r * Math.cos(alt) * Math.sin(az), r * Math.sin(alt), -r * Math.cos(alt) * Math.cos(az));
}

export function Atmosphere({ p, tod, quality }: { p: SceneParams; tod: TimeOfDay; quality: "low" | "high" }) {
  const hour = TOD_HOURS[tod];
  const sun = useMemo(() => sunVector(hour, p.month), [hour, p.month]);
  const elev = Math.max(-1, Math.min(1, sun.y / 400));
  const daylight = Math.max(0, Math.min(1, (elev + 0.08) / 0.35));
  const storm = Math.max(p.cloud, p.rain * 0.8);

  const fogColor = useMemo(() => {
    const day = new THREE.Color("#91c9df");
    const night = new THREE.Color("#0a1224");
    const dusk = new THREE.Color("#efa47f");
    const c = night.clone().lerp(day, daylight);
    if (tod === "dusk" || tod === "dawn") c.lerp(dusk, 0.45);
    c.lerp(new THREE.Color("#7c8794"), storm * 0.6 * daylight);
    if (p.heat > 0.2) c.lerp(new THREE.Color("#e9d2a0"), p.heat * 0.35 * daylight);
    return c;
  }, [daylight, storm, tod, p.heat]);

  const { scene } = useThree();
  useFrame((_, dt) => {
    if (!scene.fog) scene.fog = new THREE.FogExp2(fogColor, 0.004);
    const f = scene.fog as THREE.FogExp2;
    f.color.lerp(fogColor, Math.min(1, dt * 2));
    const target = 0.0035 + storm * 0.006 + p.heat * 0.002 + p.rain * 0.003;
    f.density += (target - f.density) * Math.min(1, dt * 2);
    if (scene.background instanceof THREE.Color) scene.background.copy(f.color);
  });

  return (
    <>
      <Sky
        sunPosition={sun.toArray() as [number, number, number]}
        turbidity={3.5 + storm * 10 + p.heat * 6}
        rayleigh={daylight > 0.05 ? 2.2 - storm * 1.2 : 0.2}
        mieCoefficient={0.005 + storm * 0.014}
        mieDirectionalG={0.8}
        distance={4000}
      />
      {daylight < 0.45 && <Stars radius={900} depth={60} count={quality === "high" ? 2500 : 900} factor={5} fade speed={0.3} />}
      <ambientLight intensity={(0.12 + daylight * 0.45) * (1 - storm * 0.4)} />
      <hemisphereLight args={[0xbcd8ff, 0x4a3a28, 0.25 + daylight * 0.55 * (1 - storm * 0.45)]} />
      <directionalLight
        position={sun.toArray() as [number, number, number]}
        intensity={(0.1 + daylight * 2.3) * (1 - storm * 0.65)}
        color={tod === "dawn" || tod === "dusk" ? "#ffcf9a" : "#fff6e6"}
        castShadow={quality === "high"}
        shadow-mapSize={[2048, 2048]}
        shadow-camera-left={-45}
        shadow-camera-right={45}
        shadow-camera-top={45}
        shadow-camera-bottom={-45}
        shadow-camera-near={50}
        shadow-camera-far={900}
        shadow-bias={-0.0004}
      />
      <Clouds p={p} daylight={daylight} />
      <Rain p={p} quality={quality} />
    </>
  );
}

function Clouds({ p, daylight }: { p: SceneParams; daylight: number }) {
  const group = useRef<THREE.Group>(null);
  const count = Math.round(5 + p.cloud * 20);
  const puffs = useMemo(() => {
    const rnd = mulberry32(99);
    return Array.from({ length: 26 }, () => ({
      x: (rnd() - 0.5) * 520,
      z: (rnd() - 0.5) * 520,
      y: 70 + rnd() * 40,
      s: 22 + rnd() * 30,
      parts: Array.from({ length: 5 }, () => ({ dx: (rnd() - 0.5) * 1.6, dy: (rnd() - 0.3) * 0.35, dz: (rnd() - 0.5) * 1.0, ds: 0.5 + rnd() * 0.6 })),
    }));
  }, []);
  const color = useMemo(() => {
    const c = new THREE.Color("#ffffff").lerp(new THREE.Color("#5b6672"), Math.min(1, p.cloud * 0.9 + p.rain * 0.5));
    return c.multiplyScalar(0.25 + 0.75 * daylight);
  }, [p.cloud, p.rain, daylight]);

  useFrame((_, dt) => {
    const g = group.current;
    if (!g) return;
    g.position.x += dt * (2 + p.wind * 14);
    if (g.position.x > 260) g.position.x -= 520;
  });

  return (
    <group ref={group}>
      {puffs.slice(0, count).map((c, i) => (
        <group key={i} position={[c.x, c.y, c.z]} scale={c.s}>
          {c.parts.map((q, j) => (
            <mesh key={j} position={[q.dx, q.dy, q.dz]} scale={[q.ds * 1.4, q.ds * 0.55, q.ds]} raycast={() => null}>
              <icosahedronGeometry args={[1, 1]} />
              <meshBasicMaterial color={color} transparent opacity={0.88} fog={false} depthWrite={false} />
            </mesh>
          ))}
        </group>
      ))}
    </group>
  );
}

const RAIN_VERT = /* glsl */ `
attribute float aEnd;
attribute float aSeed;
uniform float uTime;
uniform float uWind;
uniform float uIntensity;
varying float vA;
void main() {
  float speed = 26.0 + aSeed * 10.0;
  float H = 36.0;
  vec3 p = position;
  p.y = mod(p.y - uTime * speed, H);
  p.x += (1.0 - p.y / H) * uWind * 9.0;
  p.y += aEnd * 1.15;
  p.x += aEnd * uWind * 0.5;
  vA = step(aSeed, uIntensity) * (0.55 - aEnd * 0.3);
  gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
}`;
const RAIN_FRAG = /* glsl */ `
varying float vA;
void main() { if (vA <= 0.0) discard; gl_FragColor = vec4(0.78, 0.86, 0.95, vA); }`;

function Rain({ p, quality }: { p: SceneParams; quality: "low" | "high" }) {
  const n = quality === "high" ? 2600 : 1000;
  const matRef = useRef<THREE.ShaderMaterial>(null);
  const grp = useRef<THREE.Group>(null);
  const { camera } = useThree();
  const geo = useMemo(() => {
    const rnd = mulberry32(5);
    const pos = new Float32Array(n * 6);
    const end = new Float32Array(n * 2);
    const seed = new Float32Array(n * 2);
    for (let i = 0; i < n; i++) {
      const x = (rnd() - 0.5) * 70;
      const y = rnd() * 36;
      const z = (rnd() - 0.5) * 70;
      const s = rnd();
      pos.set([x, y, z, x, y, z], i * 6);
      end[i * 2] = 0;
      end[i * 2 + 1] = 1;
      seed[i * 2] = s;
      seed[i * 2 + 1] = s;
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    g.setAttribute("aEnd", new THREE.BufferAttribute(end, 1));
    g.setAttribute("aSeed", new THREE.BufferAttribute(seed, 1));
    return g;
  }, [n]);
  const uniforms = useMemo(() => ({ uTime: { value: 0 }, uWind: { value: 0 }, uIntensity: { value: 0 } }), []);

  useFrame((_, dt) => {
    uniforms.uTime.value += dt;
    uniforms.uWind.value += (p.wind - uniforms.uWind.value) * Math.min(1, dt * 2);
    uniforms.uIntensity.value += (p.rain - uniforms.uIntensity.value) * Math.min(1, dt * 2);
    if (grp.current) {
      grp.current.position.set(camera.position.x, Math.max(0, camera.position.y - 6), camera.position.z);
      grp.current.visible = uniforms.uIntensity.value > 0.02;
    }
  });

  return (
    <group ref={grp}>
      <lineSegments geometry={geo} frustumCulled={false} raycast={() => null}>
        <shaderMaterial ref={matRef} vertexShader={RAIN_VERT} fragmentShader={RAIN_FRAG} uniforms={uniforms} transparent depthWrite={false} />
      </lineSegments>
    </group>
  );
}
