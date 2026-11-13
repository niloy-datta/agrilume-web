"use client";

import React, { Suspense, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { useReducedMotion } from "framer-motion";
import { OrbitalFieldScene } from "./orbital-field-scene";
import { HeroVisual } from "@/components/home/hero-visual";

function checkWebGLSupport(): boolean {
  if (typeof window === "undefined") return false;
  try {
    const canvas = document.createElement("canvas");
    return Boolean(canvas.getContext("webgl2") || canvas.getContext("webgl"));
  } catch {
    return false;
  }
}

export function OrbitalFieldCanvas() {
  const [hasWebGL] = useState<boolean>(() => checkWebGLSupport());
  const shouldReduceMotion = useReducedMotion();

  // Graceful fallback to refined SVG/vector visual if WebGL is unavailable
  if (!hasWebGL) {
    return <HeroVisual />;
  }

  return (
    <div className="relative w-full h-[380px] sm:h-[480px] md:h-[580px] lg:h-[680px] flex items-center justify-center lg:justify-end select-none">
      <Suspense fallback={<HeroVisual />}>
        <Canvas
          camera={{ position: [0, 0, 5], fov: 45 }}
          dpr={[1, 1.5]}
          gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
          className="w-full h-full"
        >
          <OrbitalFieldScene reducedMotion={!!shouldReduceMotion} />
        </Canvas>
      </Suspense>

      {/* Floating Orbital Telemetry Annotation Badge */}
      <div className="hidden sm:flex absolute bottom-8 right-6 bg-[#050A12]/85 backdrop-blur-md px-3.5 py-2 rounded-lg border border-[#36BFFA]/25 text-[10px] font-mono pointer-events-none shadow-lg">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-[#59D98E] animate-pulse" />
          <span className="text-[#36BFFA] font-medium">3D ORBITAL FIELD</span>
        </div>
        <div className="text-[#94A3B8] text-[9px] mt-0.5">
          RAJSHAHI • BANGLADESH DEMO
        </div>
      </div>
    </div>
  );
}
