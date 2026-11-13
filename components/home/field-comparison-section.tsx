"use client";

import React, { useState, useRef, useCallback } from "react";
import Image from "next/image";
import { Eye, Layers, ArrowLeftRight, CheckCircle2 } from "lucide-react";
import { FIELD_COMPARISON_CONTENT } from "@/lib/constants";
import { Reveal } from "../motion/reveal";

export function FieldComparisonSection() {
  const [sliderPos, setSliderPos] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handlePointerMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (!isDragging || !containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const newPos = Math.max(5, Math.min(95, ((e.clientX - rect.left) / rect.width) * 100));
      setSliderPos(Math.round(newPos));
    },
    [isDragging]
  );

  return (
    <section
      id="science"
      className="relative w-full py-24 sm:py-32 bg-[#050A12] border-t border-[#36BFFA]/10 overflow-hidden select-none"
      aria-labelledby="comparison-heading"
    >
      <div className="max-w-[1400px] mx-auto px-6 sm:px-8 lg:px-12 relative z-10">
        
        {/* Section 03 Index Marker */}
        <div className="flex items-center gap-2 mb-6 text-xs font-mono text-[#94A3B8]/70">
          <span className="text-[#59D98E] font-bold">03</span>
          <span className="text-white/80 font-medium">Same Field More Context</span>
          <span>•</span>
          <span>One field. Two perspectives.</span>
        </div>

        {/* Section Header — Centered */}
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto mb-14">
          <Reveal delay={0.1} yOffset={16}>
            <h2
              id="comparison-heading"
              className="font-space font-extrabold tracking-tight text-3xl sm:text-4xl lg:text-5xl text-[#F8FAFC]"
            >
              SAME FIELD. <span className="text-[#59D98E]">MORE CONTEXT.</span>
            </h2>
          </Reveal>
          <Reveal delay={0.2} yOffset={14}>
            <p className="mt-4 text-base text-[#94A3B8] font-normal leading-relaxed">
              AgriLume combines what farmers already know with <span className="text-[#59D98E]">environmental evidence</span> that can be difficult to see from the ground alone.
            </p>
          </Reveal>
        </div>

        {/* Split Screen Comparison Container */}
        <div className="relative max-w-5xl mx-auto rounded-3xl overflow-hidden border border-white/15 bg-[#0B1220] shadow-[0_20px_60px_rgba(0,0,0,0.8)]">
          
          <div
            ref={containerRef}
            onPointerDown={() => setIsDragging(true)}
            onPointerUp={() => setIsDragging(false)}
            onPointerMove={handlePointerMove}
            className="relative w-full aspect-[16/10] sm:aspect-[16/9] cursor-ew-resize overflow-hidden"
          >
            {/* UNDER LAYER: What AgriLume Sees (Full width under) */}
            <div className="absolute inset-0">
              <Image
                src="/images/agrilume-satellite-overlay.jpg"
                alt="AgriLume satellite false color spectral overlay of agricultural field"
                fill
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-[#050A12]/30" />

              {/* Top Right Label: WHAT AGRILUME SEES */}
              <div className="absolute top-4 right-4 z-10 px-4 py-2 rounded-full bg-[#050A12]/85 backdrop-blur-md border border-[#59D98E]/50 flex items-center gap-2 text-xs font-mono text-[#59D98E] font-bold shadow-lg">
                <Layers className="w-4 h-4" />
                <span>WHAT AGRILUME SEES</span>
              </div>

              {/* Scientific Annotation Badges (Right side) */}
              <div className="absolute top-[22%] right-[12%] px-3 py-1.5 rounded-lg bg-[#050A12]/90 backdrop-blur-md border border-[#36BFFA]/40 text-[10px] font-mono shadow-md">
                <span className="text-[#36BFFA] font-bold block">Rainfall context</span>
                <span className="text-[#94A3B8]">Regional patterns</span>
              </div>

              <div className="absolute top-[35%] right-[25%] px-3 py-1.5 rounded-lg bg-[#050A12]/90 backdrop-blur-md border border-[#D7A86E]/40 text-[10px] font-mono shadow-md">
                <span className="text-[#D7A86E] font-bold block">Temperature trend</span>
                <span className="text-[#94A3B8]">Climate context</span>
              </div>

              <div className="absolute top-[52%] right-[8%] px-3 py-1.5 rounded-lg bg-[#050A12]/90 backdrop-blur-md border border-[#59D98E]/40 text-[10px] font-mono shadow-md">
                <span className="text-[#59D98E] font-bold block">Seasonal pattern</span>
                <span className="text-[#94A3B8]">Crop calendar context</span>
              </div>

              <div className="absolute bottom-[24%] right-[22%] px-3 py-1.5 rounded-lg bg-[#050A12]/90 backdrop-blur-md border border-[#36BFFA]/40 text-[10px] font-mono shadow-md">
                <span className="text-[#36BFFA] font-bold block">Field history</span>
                <span className="text-[#94A3B8]">Past conditions</span>
              </div>

              <div className="absolute bottom-[8%] right-[6%] px-3 py-1.5 rounded-lg bg-[#050A12]/90 backdrop-blur-md border border-white/20 text-[10px] font-mono shadow-md">
                <span className="text-white font-bold block">Limitations</span>
                <span className="text-[#94A3B8]">Uncertainty and assumptions</span>
              </div>
            </div>

            {/* TOP LAYER: What The Farmer Sees (Clipped by slider position) */}
            <div
              className="absolute inset-0 overflow-hidden"
              style={{ clipPath: `inset(0 ${100 - sliderPos}% 0 0)` }}
            >
              <Image
                src="/images/farmer-field-sunset.jpg"
                alt="Natural ground eye-level perspective of green rice crop"
                fill
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-[#050A12]/20" />

              {/* Top Left Label: WHAT THE FARMER SEES */}
              <div className="absolute top-4 left-4 z-10 px-4 py-2 rounded-full bg-[#050A12]/85 backdrop-blur-md border border-[#36BFFA]/50 flex items-center gap-2 text-xs font-mono text-[#36BFFA] font-bold shadow-lg">
                <Eye className="w-4 h-4" />
                <span>WHAT THE FARMER SEES</span>
              </div>

              {/* Farmer Observation Badges (Left side) */}
              <div className="absolute top-[28%] left-[16%] px-3 py-1.5 rounded-lg bg-[#050A12]/90 backdrop-blur-md border border-white/20 text-[10px] font-mono shadow-md">
                <span className="text-white font-bold block">Sky</span>
                <span className="text-[#94A3B8]">Weather conditions</span>
              </div>

              <div className="absolute top-[48%] left-[10%] px-3 py-1.5 rounded-lg bg-[#050A12]/90 backdrop-blur-md border border-white/20 text-[10px] font-mono shadow-md">
                <span className="text-white font-bold block">Field condition</span>
                <span className="text-[#94A3B8]">What I can see</span>
              </div>

              <div className="absolute bottom-[16%] left-[22%] px-3 py-1.5 rounded-lg bg-[#050A12]/90 backdrop-blur-md border border-white/20 text-[10px] font-mono shadow-md">
                <span className="text-[#59D98E] font-bold block">Visible crop signals</span>
                <span className="text-[#94A3B8]">Plant health and growth</span>
              </div>
            </div>

            {/* Slider Divider Line & Draggable Handle */}
            <div
              className="absolute top-0 bottom-0 w-0.5 bg-white z-30 pointer-events-none"
              style={{ left: `${sliderPos}%` }}
            >
              <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-9 h-9 rounded-full bg-[#050A12] border-2 border-white shadow-[0_0_16px_rgba(255,255,255,0.7)] flex items-center justify-center pointer-events-auto">
                <ArrowLeftRight className="w-4 h-4 text-white" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
