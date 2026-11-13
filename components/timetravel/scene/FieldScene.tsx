"use client";

import React, { useCallback, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { TeleportTarget, XR, XROrigin, useXR } from "@react-three/xr";
import type { createXRStore } from "@react-three/xr";
import type { Command } from "@/lib/timetravel/commands";
import type { SceneParams, TTState, View } from "@/lib/timetravel/engine";
import { useLatest } from "../hooks/useLatest";
import { actionForButton, buildMenu, buttonAtUV } from "@/lib/timetravel/menu";
import { Atmosphere } from "./Atmosphere";
import { CardboardRig, FlatCameraRig, PRESETS } from "./CameraRigs";
import { CircularFarm } from "./CircularFarm";
import { Crops } from "./Crops";
import { Surroundings } from "./Props";
import { Terrain } from "./Terrain";
import { VRMenu } from "./VRMenu";

export type XRStoreT = ReturnType<typeof createXRStore>;
export type Quality = "low" | "high";
export type ViewMode = "flat" | "cardboard";

interface Props {
  state: TTState;
  view: View;
  params: SceneParams;
  dispatch: (c: Command) => void;
  store: XRStoreT;
  quality: Quality;
  mode: ViewMode;
  onExitVR: () => void;
  onSensor?: (ok: boolean) => void;
}

const START_POS: [number, number, number] = [-4, 0, 17];

function Content({ state, view, params, dispatch, quality, mode, onExitVR, onSensor }: Props) {
  const xrMode = useXR((s) => s.mode);
  const inXR = xrMode === "immersive-vr" || xrMode === "immersive-ar";
  const cardboard = mode === "cardboard" && !inXR;
  const [origin, setOrigin] = useState<THREE.Vector3>(() => new THREE.Vector3(...START_POS));
  const [menuAnchor, setMenuAnchor] = useState<{ pos: [number, number, number]; rotY: number }>({ pos: [START_POS[0], 1.35, START_POS[2] - 1.6], rotY: 0 });
  const menuMesh = useRef<THREE.Mesh>(null);
  const { camera } = useThree();
  const [hover, setHover] = useState<string | null>(null);
  const [dwell, setDwell] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const stateRef = useLatest(state);

  const summon = useCallback(() => {
    const dir = new THREE.Vector3();
    camera.getWorldDirection(dir);
    dir.y = 0;
    if (dir.lengthSq() < 1e-4) dir.set(0, 0, -1);
    dir.normalize();
    const wp = new THREE.Vector3();
    camera.getWorldPosition(wp);
    const pos = wp.clone().addScaledVector(dir, 1.6);
    setMenuAnchor({ pos: [pos.x, Math.max(1.1, wp.y - 0.15), pos.z], rotY: Math.atan2(-dir.x, -dir.z) + Math.PI });
  }, [camera]);

  const press = useCallback(
    (id: string) => {
      const a = actionForButton(id, stateRef.current);
      if (!a) return;
      if (a.kind === "command") dispatch(a.command);
      else if (a.kind === "exit") onExitVR();
      else if (a.kind === "summon") summon();
    },
    [dispatch, onExitVR, summon, stateRef],
  );

  // keep the menu with the player when they teleport
  const onTeleport = useCallback((pt: THREE.Vector3) => {
    setOrigin(new THREE.Vector3(pt.x, 0, pt.z));
    setMenuAnchor((m) => ({ ...m, pos: [pt.x, 1.35, pt.z - 1.6], rotY: 0 }));
  }, []);

  // Cardboard: look down to open the menu, dwell on a button to press it
  const ray = useMemo(() => new THREE.Raycaster(), []);
  const dwellRef = useRef({ id: null as string | null, t: 0, cooldown: 0 });
  useFrame((_, dt) => {
    if (!cardboard) return;
    const fwd = new THREE.Vector3();
    camera.getWorldDirection(fwd);
    const looksDown = fwd.y < -0.55;
    if (looksDown !== menuOpen) {
      setMenuOpen(looksDown);
      if (looksDown) {
        const flat = fwd.clone();
        flat.y = 0;
        if (flat.lengthSq() < 1e-4) flat.set(0, 0, -1);
        flat.normalize();
        const wp = camera.position;
        setMenuAnchor({ pos: [wp.x + flat.x * 1.5, wp.y - 0.9, wp.z + flat.z * 1.5], rotY: Math.atan2(-flat.x, -flat.z) + Math.PI });
      }
    }
    const d = dwellRef.current;
    d.cooldown = Math.max(0, d.cooldown - dt);
    if (!looksDown || !menuMesh.current) {
      if (hover) setHover(null);
      if (dwell) setDwell(0);
      d.id = null;
      d.t = 0;
      return;
    }
    ray.setFromCamera(new THREE.Vector2(0, 0), camera);
    const hit = ray.intersectObject(menuMesh.current, false)[0];
    const b = hit?.uv ? buttonAtUV(buildMenu(stateRef.current), hit.uv.x, hit.uv.y) : null;
    const id = b?.id ?? null;
    if (id !== d.id) {
      d.id = id;
      d.t = 0;
      setHover(id);
      setDwell(0);
    } else if (id && d.cooldown <= 0) {
      d.t += dt;
      setDwell(Math.min(1, d.t / 1.4));
      if (d.t >= 1.4) {
        press(id);
        d.t = 0;
        d.cooldown = 0.8;
        setDwell(0);
      }
    }
  });

  const showMenu = inXR || (cardboard && menuOpen);

  return (
    <>
      <Atmosphere p={params} tod={state.tod} quality={quality} />
      <TeleportTarget onTeleport={onTeleport}>
        <Terrain p={params} segments={quality === "high" ? 160 : 90} />
      </TeleportTarget>
      <Crops p={params} quality={quality} />
      <Surroundings p={params} quality={quality} />
      <CircularFarm p={params} lang={state.lang} pathway={state.pathway} onPick={(id) => dispatch({ type: "setPathway", id })} />

      {!inXR && !cardboard && <FlatCameraRig preset={state.camera} enabled />}
      {/* mounted only in Cardboard mode: its priority-1 useFrame turns off r3f auto-render */}
      {cardboard && <CardboardRig active position={[PRESETS.walk.pos[0], PRESETS.walk.pos[1], PRESETS.walk.pos[2]]} onSensor={onSensor} />}
      {inXR && <XROrigin position={origin} />}

      {showMenu && (
        <VRMenu
          state={state}
          view={view}
          position={menuAnchor.pos}
          rotationY={menuAnchor.rotY}
          hover={hover}
          dwell={dwell}
          onPress={press}
          menuRef={menuMesh}
          scale={cardboard ? 1.15 : 1}
        />
      )}
    </>
  );
}

export function FieldScene(props: Props) {
  const { quality, store } = props;
  return (
    <Canvas
      shadows={quality === "high"}
      dpr={quality === "high" ? [1, 2] : [1, 1.25]}
      camera={{ fov: 55, near: 0.05, far: 2500, position: PRESETS.overview.pos }}
      gl={{ antialias: quality === "high", powerPreference: "high-performance", alpha: false, preserveDrawingBuffer: false }}
      onCreated={({ gl, scene }) => {
        gl.toneMapping = THREE.ACESFilmicToneMapping;
        gl.toneMappingExposure = 1;
        scene.background = new THREE.Color("#91c9df");
      }}
      style={{ touchAction: "none" }}
      aria-label="3D farm scene"
    >
      <XR store={store}>
        <Content {...props} />
      </XR>
    </Canvas>
  );
}
