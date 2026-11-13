"use client";

import React from "react";
import Image from "next/image";
import { ArrowRight, Globe, Layers, Sprout, Smartphone } from "lucide-react";
import { Reveal, StaggerContainer, StaggerItem } from "../motion/reveal";

export function HowItWorksSection() {
  const steps = [
    {
      num: "01",
      title: "Observe",
      subtitle: "Satellite and climate data provide the big picture.",
      badge: "Earth Observation",
      badgeColor: "#36BFFA",
      graphic: (
        <div className="relative w-20 h-20 rounded-2xl bg-gradient-to-br from-[#0B1528] to-[#050A12] border border-[#36BFFA]/40 flex items-center justify-center shadow-[0_0_25px_rgba(54,191,250,0.25)]">
          <Globe className="w-10 h-10 text-[#36BFFA] animate-pulse" />
          <div className="absolute -top-1.5 -right-1.5 w-3 h-3 rounded-full bg-[#36BFFA] shadow-[0_0_8px_#36BFFA]" />
        </div>
      ),
    },
    {
      num: "02",
      title: "Understand",
      subtitle: "Environmental context is analyzed into clear signals.",
      badge: "AI Calibration",
      badgeColor: "#59D98E",
      graphic: (
        <div className="relative w-20 h-20 rounded-2xl bg-gradient-to-br from-[#0B2018] to-[#050A12] border border-[#59D98E]/40 flex items-center justify-center shadow-[0_0_25px_rgba(89,217,142,0.25)]">
          <Layers className="w-10 h-10 text-[#59D98E]" />
          <div className="absolute -top-1.5 -right-1.5 w-3 h-3 rounded-full bg-[#59D98E] shadow-[0_0_8px_#59D98E]" />
        </div>
      ),
    },
    {
      num: "03",
      title: "Decide",
      subtitle: "Evidence and limitations help make better choices.",
      badge: "Local Decision",
      badgeColor: "#D7A86E",
      graphic: (
        <div className="relative w-20 h-20 rounded-2xl bg-gradient-to-br from-[#241A0B] to-[#050A12] border border-[#D7A86E]/40 flex items-center justify-center shadow-[0_0_25px_rgba(215,168,110,0.25)]">
          <Sprout className="w-10 h-10 text-[#D7A86E]" />
          <div className="absolute -top-1.5 -right-1.5 w-3 h-3 rounded-full bg-[#D7A86E] shadow-[0_0_8px_#D7A86E]" />
        </div>
      ),
    },
    {
      num: "04",
      title: "Act",
      subtitle: "Voice-first guidance in 100+ languages & local dialects — no reading required.",
      badge: "Voice & Field Action",
      badgeColor: "#59D98E",
      graphic: (
        <div className="relative w-20 h-20 rounded-2xl bg-gradient-to-br from-[#0B2018] to-[#050A12] border border-[#59D98E]/50 flex items-center justify-center shadow-[0_0_25px_rgba(89,217,142,0.35)]">
          <Smartphone className="w-10 h-10 text-[#59D98E]" />
          <div className="absolute -top-1.5 -right-1.5 w-3 h-3 rounded-full bg-[#59D98E] shadow-[0_0_8px_#59D98E]" />
        </div>
      ),
    },
  ];

  return (
    <section
      id="how-it-works"
      className="relative w-full py-24 sm:py-32 bg-[#050A12] border-t border-white/5 overflow-hidden"
      aria-labelledby="how-it-works-title"
    >
      <div className="max-w-[1400px] mx-auto px-6 sm:px-8 lg:px-12 relative z-10">
        
        {/* Section Index Marker (Left) */}
        <div className="flex items-center gap-2 mb-6 text-xs font-mono text-[#94A3B8]/70">
          <span className="text-[#36BFFA] font-bold">04</span>
          <span className="text-white/80 font-medium">How It Works</span>
          <span>•</span>
          <span>From data to decision</span>
        </div>

        {/* Header */}
        <div className="max-w-3xl mb-16">
          <Reveal delay={0.1} yOffset={16}>
            <span className="text-[11px] font-mono tracking-[0.2em] text-[#36BFFA] uppercase block mb-3 font-semibold">
              A SIMPLE AND TRANSPARENT JOURNEY
            </span>
            <h2
              id="how-it-works-title"
              className="font-space font-extrabold tracking-tight text-3xl sm:text-4xl lg:text-5xl text-[#F8FAFC]"
            >
              HOW AGRILUME WORKS
            </h2>
          </Reveal>

          <Reveal delay={0.2} yOffset={14}>
            <p className="mt-4 text-base text-[#94A3B8] font-normal leading-relaxed">
              From <span className="text-[#36BFFA]">Earth data to practical guidance</span> — a clear, verifiable journey for real field decisions.
            </p>
          </Reveal>
        </div>

        {/* 4 Cards Grid with horizontal connectors */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          {steps.map((step, idx) => (
            <Reveal key={step.num} delay={0.15 * idx} yOffset={20}>
              <div className="relative flex flex-col h-full bg-[#0B1220]/70 backdrop-blur-md border border-white/10 hover:border-white/25 rounded-2xl p-6 transition-all duration-300 hover:shadow-[0_10px_30px_rgba(0,0,0,0.6)] group">
                
                {/* Visual Graphic Header */}
                <div className="flex items-center justify-between mb-6">
                  {step.graphic}
                  <span className="font-space font-bold text-3xl text-white/20 group-hover:text-white/40 transition-colors">
                    {step.num}
                  </span>
                </div>

                {/* Step Title */}
                <h3 className="font-space font-bold text-xl text-[#F8FAFC] mb-2 flex items-center gap-2">
                  {step.title}
                </h3>

                {/* Step Subtitle */}
                <p className="text-sm text-[#94A3B8] leading-relaxed flex-1">
                  {step.subtitle}
                </p>

                {/* Tag pill */}
                <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between text-xs font-mono">
                  <span style={{ color: step.badgeColor }} className="font-medium">
                    {step.badge}
                  </span>
                  {idx < steps.length - 1 && (
                    <ArrowRight className="w-4 h-4 text-white/30 hidden lg:block" />
                  )}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
