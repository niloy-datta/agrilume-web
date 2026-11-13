import * as THREE from "three";

/**
 * Text inside 3D (and VR) is drawn with the browser's 2D canvas, NOT with a WebGL font library.
 * Reason: the browser shapes Bangla conjuncts and vowel signs correctly; WebGL text libraries generally do not.
 */

export function fontStack(): string {
  if (typeof document === "undefined") return "sans-serif";
  const cs = getComputedStyle(document.documentElement);
  const bn = cs.getPropertyValue("--font-bengali").trim();
  const inter = cs.getPropertyValue("--font-inter").trim();
  return [inter, bn, "system-ui", "sans-serif"].filter(Boolean).join(", ");
}

export interface TextLine {
  text: string;
  size?: number;
  color?: string;
  weight?: number | string;
  align?: CanvasTextAlign;
}

export interface Button {
  id: string;
  label: string;
  x: number;
  y: number;
  w: number;
  h: number;
  active?: boolean;
  tone?: "default" | "warn" | "good";
}

export function wrapText(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[] {
  // Split on spaces; Bangla also uses spaces between words so the same rule works.
  const words = text.split(/\s+/);
  const lines: string[] = [];
  let cur = "";
  for (const w of words) {
    const test = cur ? `${cur} ${w}` : w;
    if (ctx.measureText(test).width > maxWidth && cur) {
      lines.push(cur);
      cur = w;
    } else {
      cur = test;
    }
  }
  if (cur) lines.push(cur);
  return lines;
}

export function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number): void {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

export function drawPanelBase(ctx: CanvasRenderingContext2D, w: number, h: number, accent = "#59D98E"): void {
  ctx.clearRect(0, 0, w, h);
  ctx.fillStyle = "rgba(5,10,18,0.88)";
  roundRect(ctx, 4, 4, w - 8, h - 8, 28);
  ctx.fill();
  ctx.strokeStyle = accent;
  ctx.globalAlpha = 0.55;
  ctx.lineWidth = 3;
  ctx.stroke();
  ctx.globalAlpha = 1;
}

export function drawButton(ctx: CanvasRenderingContext2D, b: Button, fonts: string): void {
  const base = b.tone === "warn" ? "#7a2e2e" : b.tone === "good" ? "#1f5d3d" : "#16233a";
  ctx.fillStyle = b.active ? "#59D98E" : base;
  roundRect(ctx, b.x, b.y, b.w, b.h, 14);
  ctx.fill();
  ctx.strokeStyle = b.active ? "#c9ffe0" : "rgba(148,163,184,0.45)";
  ctx.lineWidth = 2;
  ctx.stroke();
  ctx.fillStyle = b.active ? "#04210f" : "#F8FAFC";
  ctx.font = `600 ${Math.min(30, b.h * 0.42)}px ${fonts}`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(b.label, b.x + b.w / 2, b.y + b.h / 2 + 1, b.w - 10);
}

export function hitTest(buttons: Button[], u: number, v: number, w: number, h: number): Button | null {
  // uv origin is bottom-left; canvas origin is top-left
  const px = u * w;
  const py = (1 - v) * h;
  for (const b of buttons) {
    if (px >= b.x && px <= b.x + b.w && py >= b.y && py <= b.y + b.h) return b;
  }
  return null;
}

export function makeCanvasTexture(w: number, h: number): { canvas: HTMLCanvasElement; ctx: CanvasRenderingContext2D; texture: THREE.CanvasTexture } {
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d")!;
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 4;
  return { canvas, ctx, texture };
}
