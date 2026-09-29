"use client";

import React, { useState, useRef, useCallback } from "react";
import Image from "next/image";
import { Eye, Layers, ArrowLeftRight } from "lucide-react";
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

  const handlePointerDown = () => setIsDragging(true);
  const handlePointerUp = () => setIsDragging(false);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    const step = e.shiftKey ? 10 : 5;
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      setSliderPos((prev) => Math.max(5, prev - step));
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      setSliderPos((prev) => Math.min(95, prev + step));
    }
  };

  return (
    <section
      id="science"
      className="relative w-full py-24 sm:py-32 lg:py-36 bg-[#050A12] border-t border-[#36BFFA]/10 overflow-hidden select-none"
      aria-labelledby="comparison-heading"
    >
      {/* Background glows */}
      <div className="absolute top-1/4 right-0 w-[600px] h-[600px] bg-[#36BFFA]/4 rounded-full blur-[170px] pointer-events-none" />
      <div className="absolute bottom-1/4 left-0 w-[600px] h-[600px] bg-[#59D98E]/4 rounded-full blur-[170px] pointer-events-none" />

      <div className="max-w-[1400px] mx-auto px-6 sm:px-8 lg:px-12 relative z-10">
        
        {/* Section Index Marker */}
        <div className="flex items-center gap-2 mb-6 text-xs font-mono text-[#94A3B8]/60">
          <span className="text-[#59D98E]">03</span>
          <span>Compare View</span>
          <span>•</span>
          <span>Same field, more context</span>
        </div>

        {/* Section Header — Centered */}
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <Reveal delay={0.1} yOffset={16}>
            <h2
              id="comparison-heading"
              className="font-space font-bold tracking-tight text-3xl sm:text-4xl lg:text-5xl xl:text-[56px] text-[#F8FAFC] leading-[1.08]"
            >
              SAME FIELD. <span className="text-[#59D98E]">MORE CONTEXT.</span>
            </h2>
          </Reveal>
          <Reveal delay={0.2} yOffset={18}>
            <p className="mt-4 text-base sm:text-lg text-[#94A3B8] font-light leading-relaxed">
              {FIELD_COMPARISON_CONTENT.supporting}
            </p>
          </Reveal>
        </div>

        {/* Interactive Split Comparison — Blueprint accurate */}
        <Reveal delay={0.3} yOffset={20}>
          <div
            ref={containerRef}
            className="relative w-full h-[350px] sm:h-[450px] lg:h-[520px] rounded-2xl overflow-hidden border border-white/10 shadow-[0_20px_60px_rgba(0,0,0,0.6)] cursor-col-resize"
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerLeave={handlePointerUp}
            role="slider"
            aria-label="Comparison slider"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={sliderPos}
            tabIndex={0}
            onKeyDown={handleKeyDown}
          >
            {/* Full width: AgriLume satellite overlay view (RIGHT / base) */}
            <Image
              src="/images/agrilume-satellite-overlay.jpg"
              alt="AgriLume satellite intelligence overlay of rice field"
              fill
              className="object-cover"
            />

            {/* Clipped left: Farmer's natural view */}
            <div
              className="absolute inset-0 overflow-hidden"
              style={{ clipPath: `inset(0 ${100 - sliderPos}% 0 0)` }}
            >
              <Image
                src="/images/farmer-field-sunset.jpg"
                alt="Farmer's natural view of rice field"
                fill
                className="object-cover"
              />
            </div>

            {/* Left Label: WHAT THE FARMER SEES */}
            <div className="absolute top-4 sm:top-6 left-4 sm:left-6 z-20">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#050A12]/85 backdrop-blur-md border border-white/15">
                <Eye className="w-3.5 h-3.5 text-[#D7A86E]" />
                <span className="text-[10px] sm:text-xs font-mono font-bold text-[#F8FAFC] uppercase tracking-wider">
                  WHAT THE FARMER SEES
                </span>
              </div>
            </div>

            {/* Right Label: WHAT AGRILUME SEES */}
            <div className="absolute top-4 sm:top-6 right-4 sm:right-6 z-20">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#050A12]/85 backdrop-blur-md border border-[#59D98E]/30">
                <Layers className="w-3.5 h-3.5 text-[#59D98E]" />
                <span className="text-[10px] sm:text-xs font-mono font-bold text-[#F8FAFC] uppercase tracking-wider">
                  WHAT AGRILUME SEES
                </span>
              </div>
            </div>

            {/* Farmer view tags (left side) */}
            <div className="absolute bottom-6 left-4 sm:left-6 z-20 flex flex-wrap gap-1.5" style={{ maxWidth: `${sliderPos - 5}%` }}>
              {["Sky", "Field condition", "Visible crop signals"].map((tag) => (
                <span key={tag} className="px-2 py-1 rounded bg-[#050A12]/80 backdrop-blur-sm border border-white/15 text-[9px] font-mono text-[#F8FAFC]/90">
                  {tag}
                </span>
              ))}
            </div>

            {/* AgriLume view tags (right side) */}
            <div className="absolute bottom-6 right-4 sm:right-6 z-20 flex flex-wrap gap-1.5 justify-end" style={{ maxWidth: `${95 - sliderPos}%` }}>
              {["Rainfall context", "Temperature trend", "Seasonal pattern", "Field history", "Evidence source", "Limitations"].map((tag) => (
                <span key={tag} className="px-2 py-1 rounded bg-[#050A12]/80 backdrop-blur-sm border border-[#59D98E]/25 text-[9px] font-mono text-[#59D98E]">
                  {tag}
                </span>
              ))}
            </div>

            {/* Slider Divider Line */}
            <div
              className="absolute top-0 bottom-0 w-0.5 bg-white/80 z-30 pointer-events-none"
              style={{ left: `${sliderPos}%` }}
            />

            {/* Slider Handle */}
            <div
              className="absolute top-1/2 -translate-y-1/2 z-40 cursor-col-resize"
              style={{ left: `${sliderPos}%`, transform: `translateX(-50%) translateY(-50%)` }}
              onPointerDown={handlePointerDown}
            >
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[#050A12]/90 border-2 border-white/60 flex items-center justify-center shadow-[0_4px_20px_rgba(0,0,0,0.8)] backdrop-blur-md hover:border-[#59D98E] transition-colors">
                <ArrowLeftRight className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </div>
            </div>

            {/* DRAG TO REVEAL instruction */}
            <div className="absolute bottom-1/2 left-1/2 -translate-x-1/2 translate-y-8 z-20 pointer-events-none">
              <div className="px-3 py-1 rounded-full bg-[#050A12]/80 backdrop-blur-sm border border-white/10 text-[9px] font-mono text-[#94A3B8] uppercase tracking-wider animate-pulse">
                Drag to reveal
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
