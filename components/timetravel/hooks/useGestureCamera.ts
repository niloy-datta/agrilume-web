"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useLatest } from "./useLatest";
import { GestureDebouncer, classifyGesture } from "@/lib/timetravel/gestures";
import type { GestureId, Landmark } from "@/lib/timetravel/gestures";

/**
 * Camera + MediaPipe Hands (self-hosted under /mediapipe/hands) → debounced gesture events.
 * Everything runs in the browser; frames are never uploaded or stored.
 */

interface HandsResults {
  multiHandLandmarks?: Landmark[][];
}
interface HandsInstance {
  setOptions(o: Record<string, unknown>): void;
  onResults(cb: (r: HandsResults) => void): void;
  send(i: { image: HTMLVideoElement }): Promise<void>;
  close(): Promise<void>;
}
type HandsCtor = new (cfg: { locateFile: (f: string) => string }) => HandsInstance;

const CAMERA_PREVIEW_SELECTOR = "[data-gesture-camera-preview]";

function getVisiblePreview(): HTMLVideoElement | null {
  return Array.from(document.querySelectorAll<HTMLVideoElement>(CAMERA_PREVIEW_SELECTOR)).find(
    (video) => video.isConnected && video.getClientRects().length > 0,
  ) ?? null;
}

function clearPreviewStreams(stream?: MediaStream) {
  document.querySelectorAll<HTMLVideoElement>(CAMERA_PREVIEW_SELECTOR).forEach((video) => {
    if (!stream || video.srcObject === stream) {
      video.pause();
      video.srcObject = null;
    }
  });
}

function loadScript(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    if (document.querySelector(`script[data-mp="${src}"]`)) return resolve();
    const s = document.createElement("script");
    s.src = src;
    s.async = true;
    s.dataset.mp = src;
    s.onload = () => resolve();
    s.onerror = () => reject(new Error("script-load-failed"));
    document.head.appendChild(s);
  });
}

export type GestureStatus = "off" | "starting" | "running" | "denied" | "unsupported" | "error";

export function useGestureCamera(basePath: string, onGesture: (g: GestureId) => void) {
  const [status, setStatus] = useState<GestureStatus>("off");
  const [current, setCurrent] = useState<GestureId | null>(null);
  const [progress, setProgress] = useState(0);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const handsRef = useRef<HandsInstance | null>(null);
  const rafRef = useRef<number | null>(null);
  const cbRef = useLatest(onGesture);
  const runningRef = useRef(false);

  const stop = useCallback(() => {
    runningRef.current = false;
    if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
    rafRef.current = null;
    const stream = streamRef.current;
    stream?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    clearPreviewStreams(stream ?? undefined);
    if (videoRef.current && !stream) videoRef.current.srcObject = null;
    void handsRef.current?.close().catch(() => undefined);
    handsRef.current = null;
    setCurrent(null);
    setProgress(0);
    setStatus("off");
  }, []);

  const start = useCallback(async () => {
    if (runningRef.current) return;
    if (typeof navigator === "undefined" || !navigator.mediaDevices?.getUserMedia) {
      setStatus("unsupported");
      return;
    }
    setStatus("starting");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "user", width: { ideal: 640 }, height: { ideal: 480 } }, audio: false });
      streamRef.current = stream;
      const video = getVisiblePreview();
      if (!video) {
        stream.getTracks().forEach((t) => t.stop());
        streamRef.current = null;
        setStatus("error");
        return;
      }
      videoRef.current = video;
      video.srcObject = stream;
      video.playsInline = true;
      video.muted = true;
      await video.play();

      const base = `${basePath}/mediapipe/hands`;
      await loadScript(`${base}/hands.js`);
      const Hands = (window as unknown as { Hands?: HandsCtor }).Hands;
      if (!Hands) throw new Error("hands-missing");
      const hands = new Hands({ locateFile: (f) => `${base}/${f}` });
      hands.setOptions({ maxNumHands: 1, modelComplexity: 0, minDetectionConfidence: 0.6, minTrackingConfidence: 0.5, selfieMode: false });
      const deb = new GestureDebouncer(8, 1400);
      hands.onResults((r) => {
        const lm = r.multiHandLandmarks?.[0];
        const g = lm ? classifyGesture(lm) : null;
        setCurrent(g);
        const fired = deb.push(g, performance.now());
        setProgress(deb.progress());
        if (fired) cbRef.current(fired);
      });
      handsRef.current = hands;
      runningRef.current = true;
      setStatus("running");

      let busy = false;
      let last = 0;
      const loop = async (t: number) => {
        if (!runningRef.current) return;
        if (!busy && t - last > 66 && video.readyState >= 2) {
          busy = true;
          last = t;
          try {
            await hands.send({ image: video });
          } catch {
            /* a dropped frame is fine */
          }
          busy = false;
        }
        rafRef.current = requestAnimationFrame(loop);
      };
      rafRef.current = requestAnimationFrame(loop);
    } catch (e) {
      const name = (e as { name?: string })?.name;
      const stream = streamRef.current;
      stream?.getTracks().forEach((t) => t.stop());
      clearPreviewStreams(stream ?? undefined);
      streamRef.current = null;
      setStatus(name === "NotAllowedError" || name === "SecurityError" ? "denied" : "error");
    }
  }, [basePath, cbRef]);

  useEffect(() => stop, [stop]);

  return { status, current, progress, videoRef, start, stop };
}
