"use client";

import React, { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame, useThree } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import type { CameraPreset } from "@/lib/timetravel/engine";
import { FIELD } from "@/lib/timetravel/terrain";

export const PRESETS: Record<CameraPreset, { pos: [number, number, number]; target: [number, number, number] }> = {
  overview: { pos: [34, 28, 48], target: [0, 1.2, 0] },
  walk: { pos: [-6, 1.7, 17], target: [-2, 1.1, 8] },
  closeup: { pos: [4.5, 1.25, 5.5], target: [0, 0.55, 2] },
  drone: { pos: [0, 78, 62], target: [0, 0, 0] },
  station: { pos: [FIELD.halfW + 17, 8, 22], target: [FIELD.halfW + 7, 1.5, 0] },
};

/** Orbit controls (mouse, touch, trackpad) with smooth transitions between named camera presets. */
export function FlatCameraRig({ preset, enabled }: { preset: CameraPreset; enabled: boolean }) {
  const { camera } = useThree();
  const controls = useRef<React.ComponentRef<typeof OrbitControls>>(null);
  const tween = useRef<{ t: number; fromPos: THREE.Vector3; fromTarget: THREE.Vector3; toPos: THREE.Vector3; toTarget: THREE.Vector3 } | null>(null);
  const first = useRef(true);

  useEffect(() => {
    const c = controls.current as unknown as { target: THREE.Vector3 } | null;
    const P = PRESETS[preset];
    if (first.current && c) {
      first.current = false;
      camera.position.set(...P.pos);
      c.target.set(...P.target);
      return;
    }
    if (!c) return;
    tween.current = {
      t: 0,
      fromPos: camera.position.clone(),
      fromTarget: c.target.clone(),
      toPos: new THREE.Vector3(...P.pos),
      toTarget: new THREE.Vector3(...P.target),
    };
  }, [preset, camera]);

  useFrame((_, dt) => {
    const tw = tween.current;
    const c = controls.current as unknown as { target: THREE.Vector3; update: () => void } | null;
    if (!tw || !c) return;
    tw.t = Math.min(1, tw.t + dt / 1.1);
    const k = tw.t * tw.t * (3 - 2 * tw.t);
    camera.position.lerpVectors(tw.fromPos, tw.toPos, k);
    c.target.lerpVectors(tw.fromTarget, tw.toTarget, k);
    c.update();
    if (tw.t >= 1) tween.current = null;
  });

  return (
    <OrbitControls
      ref={controls}
      enabled={enabled}
      enableDamping
      dampingFactor={0.08}
      minDistance={1.2}
      maxDistance={170}
      maxPolarAngle={Math.PI * 0.495}
      makeDefault
    />
  );
}

/**
 * Cardboard / phone-in-a-viewer mode: renders the scene twice side by side (no lens distortion), and turns the phone's
 * orientation sensors into head rotation. Falls back to drag-to-look if sensors are unavailable.
 */
export function CardboardRig({ active, position, onSensor }: { active: boolean; position: [number, number, number]; onSensor?: (ok: boolean) => void }) {
  const { gl, scene, camera, size } = useThree();
  const stereo = useMemo(() => new THREE.StereoCamera(), []);
  const quat = useRef(new THREE.Quaternion());
  const alpha0 = useRef<number | null>(null);
  const got = useRef(false);
  const drag = useRef({ yaw: 0, pitch: 0, down: false, x: 0, y: 0 });

  useEffect(() => {
    if (!active) return;
    camera.position.set(...position);
    stereo.aspect = 0.5;
    const q1 = new THREE.Quaternion(-Math.sqrt(0.5), 0, 0, Math.sqrt(0.5));
    const zee = new THREE.Vector3(0, 0, 1);
    const q0 = new THREE.Quaternion();
    const euler = new THREE.Euler();
    const onOri = (e: DeviceOrientationEvent) => {
      if (e.alpha == null || e.beta == null || e.gamma == null) return;
      if (!got.current) {
        got.current = true;
        alpha0.current = e.alpha;
        onSensor?.(true);
      }
      const a = THREE.MathUtils.degToRad(e.alpha - (alpha0.current ?? 0));
      const b = THREE.MathUtils.degToRad(e.beta);
      const g = THREE.MathUtils.degToRad(e.gamma);
      const orient = THREE.MathUtils.degToRad((screen.orientation?.angle as number) || 0);
      euler.set(b, a, -g, "YXZ");
      quat.current.setFromEuler(euler);
      quat.current.multiply(q1);
      quat.current.multiply(q0.setFromAxisAngle(zee, -orient));
    };
    window.addEventListener("deviceorientation", onOri);
    const el = gl.domElement;
    const down = (e: PointerEvent) => {
      drag.current.down = true;
      drag.current.x = e.clientX;
      drag.current.y = e.clientY;
    };
    const move = (e: PointerEvent) => {
      if (!drag.current.down || got.current) return;
      drag.current.yaw -= (e.clientX - drag.current.x) * 0.004;
      drag.current.pitch = Math.max(-1.4, Math.min(1.4, drag.current.pitch - (e.clientY - drag.current.y) * 0.004));
      drag.current.x = e.clientX;
      drag.current.y = e.clientY;
    };
    const up = () => (drag.current.down = false);
    el.addEventListener("pointerdown", down);
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
    return () => {
      window.removeEventListener("deviceorientation", onOri);
      el.removeEventListener("pointerdown", down);
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
      gl.setScissorTest(false);
      gl.setViewport(0, 0, size.width, size.height);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active]);

  useFrame(() => {
    if (!active) return;
    const cam = camera as THREE.PerspectiveCamera;
    if (got.current) cam.quaternion.copy(quat.current);
    else cam.quaternion.setFromEuler(new THREE.Euler(drag.current.pitch, drag.current.yaw, 0, "YXZ"));
    cam.updateMatrixWorld();
    stereo.update(cam);
    const hw = Math.floor(size.width / 2);
    gl.setScissorTest(true);
    gl.setViewport(0, 0, hw, size.height);
    gl.setScissor(0, 0, hw, size.height);
    gl.render(scene, stereo.cameraL);
    gl.setViewport(hw, 0, hw, size.height);
    gl.setScissor(hw, 0, hw, size.height);
    gl.render(scene, stereo.cameraR);
    gl.setScissorTest(false);
  }, 1);

  return null;
}

/** Ask for motion-sensor permission (required on iOS; harmless elsewhere). Must be called from a user gesture. */
export async function requestMotionPermission(): Promise<"granted" | "denied" | "unsupported"> {
  type DOE = typeof DeviceOrientationEvent & { requestPermission?: () => Promise<"granted" | "denied"> };
  const D = (typeof DeviceOrientationEvent !== "undefined" ? DeviceOrientationEvent : undefined) as DOE | undefined;
  if (!D) return "unsupported";
  if (typeof D.requestPermission === "function") {
    try {
      return await D.requestPermission();
    } catch {
      return "denied";
    }
  }
  return "granted";
}
