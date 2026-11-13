"use client";

import React, { useEffect, useMemo } from "react";
import * as THREE from "three";
import type { ThreeEvent } from "@react-three/fiber";
import { useLatest } from "../hooks/useLatest";
import { MENU_H, MENU_W, buildMenu, buttonAtUV } from "@/lib/timetravel/menu";
import type { MenuButton } from "@/lib/timetravel/menu";
import type { TTState, View } from "@/lib/timetravel/engine";
import { KIND_LABEL } from "@/lib/timetravel/kind-labels";
import { STAGE_LABEL } from "@/lib/timetravel/crops";
import { drawButton, drawPanelBase, fontStack, makeCanvasTexture } from "./canvas-text";

/**
 * The control panel used inside a VR headset and in Cardboard (gaze) mode. It is a canvas texture so Bangla text is
 * shaped by the browser. `hover` (button id) is highlighted for gaze/ray feedback and `dwell` (0..1) shows progress.
 */
export function VRMenu({
  state,
  view,
  position,
  rotationY = 0,
  hover,
  dwell = 0,
  onPress,
  menuRef,
  scale = 1,
}: {
  state: TTState;
  view: View;
  position: [number, number, number];
  rotationY?: number;
  hover?: string | null;
  dwell?: number;
  onPress: (id: string) => void;
  menuRef?: React.Ref<THREE.Mesh>;
  scale?: number;
}) {
  const buttons = useMemo(() => buildMenu(state), [state]);
  const { canvas, ctx, texture } = useMemo(() => makeCanvasTexture(MENU_W, MENU_H), []);
  const buttonsRef = useLatest<MenuButton[]>(buttons);

  useEffect(() => () => texture.dispose(), [texture]);

  useEffect(() => {
    const fonts = fontStack();
    const bn = state.lang === "bn";
    drawPanelBase(ctx, MENU_W, MENU_H);
    ctx.textBaseline = "middle";
    ctx.textAlign = "left";
    ctx.fillStyle = "#F8FAFC";
    ctx.font = `700 40px ${fonts}`;
    ctx.fillText(bn ? "অ্যাগ্রিলিউম টাইম ট্রাভেল" : "Agrilume Time Travel", 40, 46, 640);
    ctx.font = `500 28px ${fonts}`;
    ctx.fillStyle = "#b7c4d6";
    const place = bn ? view.placeName.bn : view.placeName.en;
    ctx.fillText(`${place} · ${state.year} · ${bn ? "দিন" : "day"} ${state.day}`, 40, 92, 700);
    // honesty label
    const kind = KIND_LABEL[view.dataKind];
    ctx.fillStyle = view.dataKind === "observed" ? "#59D98E" : "#F5C451";
    ctx.font = `700 26px ${fonts}`;
    ctx.textAlign = "right";
    ctx.fillText(bn ? kind.bn : kind.en, MENU_W - 40, 46, 380);
    ctx.fillStyle = "#b7c4d6";
    ctx.font = `500 26px ${fonts}`;
    const stage = STAGE_LABEL[view.stage];
    ctx.fillText(`${bn ? stage.bn : stage.en} · ${bn ? "আপেক্ষিক ফলন সূচক" : "relative yield index"} ${view.index.toFixed(0)}`, MENU_W - 40, 92, 520);
    ctx.textAlign = "left";
    ctx.fillStyle = "#8da0b8";
    ctx.font = `500 22px ${fonts}`;
    ctx.fillText(bn ? "সিমুলেশন" : "Simulation", 40, 128, MENU_W - 80);
    for (const b of buttons) {
      drawButton(ctx, { ...b, active: b.active || false }, fonts);
      if (hover === b.id) {
        ctx.strokeStyle = "#FFFFFF";
        ctx.lineWidth = 5;
        ctx.strokeRect(b.x - 2, b.y - 2, b.w + 4, b.h + 4);
        if (dwell > 0) {
          ctx.fillStyle = "rgba(255,255,255,0.85)";
          ctx.fillRect(b.x, b.y + b.h - 8, b.w * Math.min(1, dwell), 8);
        }
      }
    }
    texture.needsUpdate = true;
  }, [buttons, hover, dwell, state.lang, state.year, state.day, view, ctx, texture, state]);

  const handle = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    if (!e.uv) return;
    const b = buttonAtUV(buttonsRef.current, e.uv.x, e.uv.y);
    if (b) onPress(b.id);
  };

  void canvas;
  const w = 2.2 * scale;
  const h = (w * MENU_H) / MENU_W;
  return (
    <group position={position} rotation={[0, rotationY, 0]}>
      <mesh ref={menuRef} onClick={handle} name="vr-menu">
        <planeGeometry args={[w, h]} />
        <meshBasicMaterial map={texture} transparent toneMapped={false} side={THREE.DoubleSide} depthTest={false} />
      </mesh>
    </group>
  );
}
