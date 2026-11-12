"use client";

import React, { useEffect, useMemo } from "react";
import * as THREE from "three";
import { Billboard } from "@react-three/drei";
import { fontStack, makeCanvasTexture, roundRect } from "./canvas-text";

/** A billboarded text label drawn with the browser's canvas so Bangla conjuncts render correctly. */
export function Label({
  text,
  sub,
  position,
  width = 4,
  tone = "default",
  active = false,
}: {
  text: string;
  sub?: string;
  position: [number, number, number];
  width?: number;
  tone?: "default" | "warn";
  active?: boolean;
}) {
  const { texture, aspect } = useMemo(() => {
    const W = 640;
    const H = sub ? 200 : 120;
    const { ctx, texture } = makeCanvasTexture(W, H);
    const fonts = fontStack();
    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = active ? "rgba(89,217,142,0.96)" : tone === "warn" ? "rgba(122,46,46,0.92)" : "rgba(5,10,18,0.84)";
    roundRect(ctx, 4, 4, W - 8, H - 8, 26);
    ctx.fill();
    ctx.strokeStyle = active ? "#c9ffe0" : "rgba(148,163,184,0.5)";
    ctx.lineWidth = 3;
    ctx.stroke();
    ctx.fillStyle = active ? "#04210f" : "#F8FAFC";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.font = `700 46px ${fonts}`;
    ctx.fillText(text, W / 2, sub ? 64 : H / 2 + 2, W - 40);
    if (sub) {
      ctx.fillStyle = active ? "#073d20" : "#b7c4d6";
      ctx.font = `500 34px ${fonts}`;
      ctx.fillText(sub, W / 2, 140, W - 40);
    }
    texture.needsUpdate = true;
    return { texture, aspect: H / W };
  }, [text, sub, tone, active]);

  useEffect(() => () => texture.dispose(), [texture]);

  return (
    <Billboard position={position}>
      <mesh raycast={() => null}>
        <planeGeometry args={[width, width * aspect]} />
        <meshBasicMaterial map={texture} transparent toneMapped={false} depthWrite={false} side={THREE.DoubleSide} />
      </mesh>
    </Billboard>
  );
}
