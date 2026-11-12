"use client";

import React, { useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { FIELD, terrainHeight } from "@/lib/timetravel/terrain";
import { PATHWAYS } from "@/lib/timetravel/recycling";
import type { PathwayId } from "@/lib/timetravel/recycling";
import type { Lang } from "@/lib/timetravel/types";
import type { SceneParams } from "@/lib/timetravel/engine";
import { Label } from "./Label";

/**
 * The "circular farm" corner: what happens to straw, husk, dung and water after harvest.
 * Stations are illustrative models, not engineering drawings. Dimensions are not to scale.
 */

const STATION_X = FIELD.halfW + 7;

interface StationDef {
  id: PathwayId | "pond" | "solar";
  pos: [number, number, number];
}

const STATIONS: StationDef[] = [
  { id: "compost", pos: [STATION_X, 0, -9] },
  { id: "mushroom", pos: [STATION_X + 7, 0, -4] },
  { id: "feed", pos: [STATION_X + 7, 0, 4] },
  { id: "biogas", pos: [STATION_X, 0, 9] },
  { id: "biochar", pos: [STATION_X + 13, 0, 9] },
  { id: "pond", pos: [STATION_X + 14, 0, -9] },
  { id: "solar", pos: [STATION_X + 14, 0, 0] },
];

function pathwayName(id: string, lang: Lang): string {
  const p = PATHWAYS.find((x) => x.id === id);
  if (p) return lang === "bn" ? p.name.bn : p.name.en;
  if (id === "pond") return lang === "bn" ? "বৃষ্টির পানির পুকুর" : "Rain-fed pond";
  if (id === "solar") return lang === "bn" ? "সৌর পাম্প" : "Solar pump";
  return id;
}

function Pulse({ y = 0.1, r = 3.2, on }: { y?: number; r?: number; on: boolean }) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((st) => {
    if (!ref.current) return;
    const s = 1 + Math.sin(st.clock.elapsedTime * 3) * 0.06;
    ref.current.scale.set(s, s, s);
  });
  if (!on) return null;
  return (
    <mesh ref={ref} rotation={[-Math.PI / 2, 0, 0]} position={[0, y, 0]} raycast={() => null}>
      <ringGeometry args={[r, r + 0.35, 40]} />
      <meshBasicMaterial color="#59D98E" transparent opacity={0.85} />
    </mesh>
  );
}

function Compost() {
  return (
    <group>
      {[0, 1, 2].map((i) => (
        <mesh key={i} position={[(i - 1) * 2.1, 0.5, 0]} castShadow raycast={() => null}>
          <boxGeometry args={[1.9, 1, 2.6]} />
          <meshStandardMaterial color={["#5a4630", "#46361f", "#3a2a18"][i]} roughness={1} />
        </mesh>
      ))}
      <mesh position={[0, 0.5, 1.4]} raycast={() => null}>
        <boxGeometry args={[6.4, 1, 0.12]} />
        <meshStandardMaterial color="#8a6a3a" />
      </mesh>
    </group>
  );
}

function Mushroom() {
  const caps = useMemo(() => Array.from({ length: 16 }, (_, i) => ({ x: ((i % 4) - 1.5) * 0.7, y: 0.5 + Math.floor(i / 4) * 0.55, s: 0.12 + (i % 3) * 0.03 })), []);
  return (
    <group>
      <mesh position={[0, 1.3, 0]} castShadow raycast={() => null}>
        <boxGeometry args={[3.4, 2.6, 2.6]} />
        <meshStandardMaterial color="#d9cfae" roughness={1} transparent opacity={0.6} />
      </mesh>
      <mesh position={[0, 2.9, 0]} rotation={[0, 0, Math.PI / 4]} raycast={() => null}>
        <boxGeometry args={[2.5, 2.5, 3]} />
        <meshStandardMaterial color="#a8873f" roughness={1} />
      </mesh>
      {caps.map((c, i) => (
        <mesh key={i} position={[c.x, c.y, 0]} raycast={() => null}>
          <sphereGeometry args={[c.s, 8, 6, 0, Math.PI * 2, 0, Math.PI / 2]} />
          <meshStandardMaterial color="#f2eadb" roughness={0.9} />
        </mesh>
      ))}
    </group>
  );
}

function Feed() {
  return (
    <group>
      <mesh position={[0, 1.2, 0]} castShadow raycast={() => null}>
        <boxGeometry args={[4.5, 0.15, 3]} />
        <meshStandardMaterial color="#7b6a4a" />
      </mesh>
      {[-2, 2].map((x) => (
        <mesh key={x} position={[x, 0.6, 0]} raycast={() => null}>
          <boxGeometry args={[0.15, 1.2, 3]} />
          <meshStandardMaterial color="#5e4a2c" />
        </mesh>
      ))}
      {[0, 1].map((i) => (
        <mesh key={i} position={[-1.4 + i * 2.8, 0.55, 2.1]} rotation={[0, 0, Math.PI / 2]} castShadow raycast={() => null}>
          <cylinderGeometry args={[0.5, 0.5, 1.1, 14]} />
          <meshStandardMaterial color="#d6b865" roughness={1} />
        </mesh>
      ))}
    </group>
  );
}

function Biogas() {
  return (
    <group>
      <mesh position={[0, 0, 0]} castShadow raycast={() => null}>
        <sphereGeometry args={[2.2, 20, 12, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial color="#9bb5a5" roughness={0.8} />
      </mesh>
      <mesh position={[0, 2.35, 0]} raycast={() => null}>
        <cylinderGeometry args={[0.35, 0.35, 0.5, 10]} />
        <meshStandardMaterial color="#3a4a40" />
      </mesh>
      <mesh position={[2.9, 0.5, 0.2]} rotation={[0, 0, Math.PI / 2]} raycast={() => null}>
        <cylinderGeometry args={[0.07, 0.07, 3, 8]} />
        <meshStandardMaterial color="#c24a2a" />
      </mesh>
      <mesh position={[4.2, 0.5, 0.2]} castShadow raycast={() => null}>
        <boxGeometry args={[1.1, 1, 1.1]} />
        <meshStandardMaterial color="#b0b6bd" metalness={0} roughness={0.5} />
      </mesh>
    </group>
  );
}

function Biochar() {
  return (
    <group>
      <mesh position={[0, 1.2, 0]} castShadow raycast={() => null}>
        <coneGeometry args={[1.5, 2.4, 14]} />
        <meshStandardMaterial color="#9aa3ab" metalness={0} roughness={0.6} />
      </mesh>
      <mesh position={[0, 2.8, 0]} raycast={() => null}>
        <cylinderGeometry args={[0.18, 0.18, 1.2, 8]} />
        <meshStandardMaterial color="#6d757c" metalness={0} />
      </mesh>
      <mesh position={[2.2, 0.15, 0.4]} raycast={() => null}>
        <sphereGeometry args={[0.9, 10, 6, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial color="#1a1a1c" roughness={1} />
      </mesh>
    </group>
  );
}

function Pond({ level }: { level: number }) {
  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.05, 0]} raycast={() => null}>
        <circleGeometry args={[4.2, 28]} />
        <meshStandardMaterial color="#5b4a33" roughness={1} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.12 + level * 0.12, 0]} raycast={() => null}>
        <circleGeometry args={[3.7, 28]} />
        <meshStandardMaterial color="#3d8fae" transparent opacity={0.85} roughness={0.1} metalness={0} />
      </mesh>
    </group>
  );
}

function Solar() {
  return (
    <group>
      <mesh position={[0, 1.2, 0]} rotation={[-0.7, 0, 0]} castShadow raycast={() => null}>
        <boxGeometry args={[2.6, 0.08, 1.7]} />
        <meshStandardMaterial color="#1d3b7a" metalness={0} roughness={0.25} />
      </mesh>
      <mesh position={[0, 0.55, -0.1]} raycast={() => null}>
        <cylinderGeometry args={[0.06, 0.06, 1.1, 6]} />
        <meshStandardMaterial color="#555" />
      </mesh>
    </group>
  );
}

function Station({ def, p, lang, selected, onPick }: { def: StationDef; p: SceneParams; lang: Lang; selected: boolean; onPick?: (id: string) => void }) {
  const y = terrainHeight(p.region, def.pos[0], def.pos[2]);
  const name = pathwayName(def.id, lang);
  const body =
    def.id === "compost" ? <Compost /> : def.id === "mushroom" ? <Mushroom /> : def.id === "feed" ? <Feed /> : def.id === "biogas" ? <Biogas /> : def.id === "biochar" ? <Biochar /> : def.id === "pond" ? <Pond level={p.wetness} /> : <Solar />;
  return (
    <group position={[def.pos[0], y, def.pos[2]]} onClick={(e) => { e.stopPropagation(); onPick?.(def.id); }}>
      {body}
      <Pulse on={selected} />
      <Label text={name} position={[0, def.id === "mushroom" ? 5.2 : 4.4, 0]} width={5} active={selected} />
    </group>
  );
}

/** Straw/husk particles travelling from the field edge to the selected station. */
function Flow({ target, color }: { target: [number, number, number]; color: string }) {
  const refs = useRef<(THREE.Mesh | null)[]>([]);
  const start = useMemo(() => new THREE.Vector3(FIELD.halfW + 1, 0.8, 0), []);
  const end = useMemo(() => new THREE.Vector3(target[0], 1.2, target[2]), [target]);
  const mid = useMemo(() => new THREE.Vector3((start.x + end.x) / 2, 3.2, (start.z + end.z) / 2), [start, end]);
  const tmp = useMemo(() => new THREE.Vector3(), []);
  useFrame((st) => {
    const t0 = st.clock.elapsedTime * 0.35;
    refs.current.forEach((m, i) => {
      if (!m) return;
      const t = (t0 + i / 14) % 1;
      const a = 1 - t;
      tmp.set(0, 0, 0)
        .addScaledVector(start, a * a)
        .addScaledVector(mid, 2 * a * t)
        .addScaledVector(end, t * t);
      m.position.copy(tmp);
      m.scale.setScalar(0.6 + 0.4 * Math.sin(t * Math.PI));
    });
  });
  return (
    <group>
      {Array.from({ length: 14 }).map((_, i) => (
        <mesh key={i} ref={(m) => { refs.current[i] = m; }} raycast={() => null}>
          <sphereGeometry args={[0.2, 8, 6]} />
          <meshBasicMaterial color={color} />
        </mesh>
      ))}
    </group>
  );
}

function StrawBales({ p }: { p: SceneParams }) {
  const show = p.harvested || p.ripeness >= 1;
  if (!show) return null;
  return (
    <group position={[FIELD.halfW + 2.2, 0.35, 0]}>
      {[0, 1, 2, 3, 4].map((i) => (
        <mesh key={i} position={[(i % 3) * 1.2, Math.floor(i / 3) * 0.7, ((i * 7) % 5) * 0.3 - 0.6]} castShadow raycast={() => null}>
          <cylinderGeometry args={[0.55, 0.55, 1, 12]} />
          <meshStandardMaterial color="#d6b865" roughness={1} />
        </mesh>
      ))}
    </group>
  );
}

export function CircularFarm({ p, lang, pathway, onPick }: { p: SceneParams; lang: Lang; pathway: string | null; onPick?: (id: string) => void }) {
  const sel = STATIONS.find((s) => s.id === pathway);
  return (
    <group>
      <StrawBales p={p} />
      {STATIONS.map((s) => (
        <Station key={s.id} def={s} p={p} lang={lang} selected={pathway === s.id} onPick={onPick} />
      ))}
      {sel && sel.id !== "pond" && sel.id !== "solar" && (
        <Flow target={[sel.pos[0], terrainHeight(p.region, sel.pos[0], sel.pos[2]), sel.pos[2]]} color={sel.id === "biochar" ? "#222" : "#e6c75a"} />
      )}
      <Label
        text={lang === "bn" ? "বৃত্তাকার খামার" : "Circular farm"}
        sub={lang === "bn" ? "খড় · তুষ · গোবর · পানি" : "straw · husk · dung · water"}
        position={[STATION_X + 7, 7.5, 0]}
        width={7}
      />
    </group>
  );
}

export const STATION_IDS = STATIONS.map((s) => s.id);
export const STATION_POS: Record<string, [number, number, number]> = Object.fromEntries(STATIONS.map((s) => [s.id, s.pos]));
