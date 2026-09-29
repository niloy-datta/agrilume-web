"use client";

import React from "react";
import Image from "next/image";
import { CloudRain, Clock, ShieldCheck } from "lucide-react";
import { FARMER_PROBLEM_CONTENT } from "@/lib/constants";
import { Reveal, StaggerContainer, StaggerItem } from "../motion/reveal";

export function FarmerProblemSection() {
  const getCueIcon = (category: string) => {
    switch (category) {
      case "WEATHER":
        return <CloudRain className="w-5 h-5 text-[#36BFFA]" />;
      case "TIMING":
        return <Clock className="w-5 h-5 text-[#D7A86E]" />;
      case "EVIDENCE":
        return <ShieldCheck className="w-5 h-5 text-[#59D98E]" />;
      default:
        return <CloudRain className="w-5 h-5 text-[#94A3B8]" />;
    }
  };

  return (
    <section
      id="mission"
      className="relative w-full py-24 sm:py-32 lg:py-40 bg-[#050A12] border-t border-[#36BFFA]/10 overflow-hidden"
      aria-labelledby="farmer-decision-title"
    >
      {/* Background Image — farmer in field at sunset */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/farmer-field-sunset.jpg"
          alt="Farmer standing in rice field at sunset"
          fill
          className="object-cover object-center opacity-25"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#050A12] via-[#050A12]/90 to-[#050A12]/60" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#050A12] via-transparent to-[#050A12]/80" />
      </div>

      {/* Background ambient glows */}
      <div className="absolute top-1/3 left-0 w-[550px] h-[550px] bg-[#D7A86E]/4 rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute bottom-10 right-0 w-[500px] h-[500px] bg-[#59D98E]/3 rounded-full blur-[150px] pointer-events-none" />

      <div className="max-w-[1400px] mx-auto px-6 sm:px-8 lg:px-12 relative z-10">
        
        {/* Section Index Marker */}
        <div className="flex items-center gap-2 mb-6 text-xs font-mono text-[#94A3B8]/60">
          <span className="text-[#D7A86E]">02</span>
          <span>The Problem</span>
          <span>•</span>
          <span>A real decision in the field</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* LEFT: Human Editorial Storytelling (Columns 1-7) */}
          <div className="lg:col-span-7 flex flex-col justify-center">
            {/* Eyebrow */}
            <Reveal delay={0.1} yOffset={16}>
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#050A12]/80 border border-[#D7A86E]/25 mb-6 self-start">
                <span className="w-1.5 h-1.5 rounded-full bg-[#D7A86E] animate-pulse" />
                <span className="text-[11px] font-mono tracking-[0.18em] text-[#D7A86E] uppercase">
                  {FARMER_PROBLEM_CONTENT.eyebrow}
                </span>
              </div>
            </Reveal>

            {/* Primary Headline */}
            <Reveal delay={0.2} yOffset={20}>
              <h2
                id="farmer-decision-title"
                className="font-space font-bold tracking-tight text-3xl sm:text-4xl lg:text-5xl xl:text-[56px] text-[#F8FAFC] leading-[1.08] max-w-2xl"
              >
                A FARMER SEES THE FIELD.{" "}
                <span className="text-[#D7A86E]">BUT NOT EVERYTHING SHAPING IT.</span>
              </h2>
            </Reveal>

            {/* Supporting Copy */}
            <Reveal delay={0.32} yOffset={18}>
              <p className="mt-5 text-base sm:text-lg text-[#94A3B8] font-light leading-relaxed max-w-xl">
                {FARMER_PROBLEM_CONTENT.supporting}
              </p>
            </Reveal>

            {/* THE HERO QUESTION */}
            <Reveal delay={0.45} yOffset={22}>
              <div className="mt-8 relative">
                <p className="text-2xl sm:text-3xl lg:text-4xl font-space font-bold tracking-tight text-[#F8FAFC] italic">
                  {FARMER_PROBLEM_CONTENT.heroQuestion}
                </p>
              </div>
            </Reveal>

            {/* 3 Uncertainty Cues — horizontal row matching blueprint */}
            <div className="mt-12">
              <StaggerContainer
                staggerDelay={0.1}
                delayChildren={0.5}
                className="grid grid-cols-1 sm:grid-cols-3 gap-6"
              >
                {FARMER_PROBLEM_CONTENT.uncertaintyCues.map((cue) => (
                  <StaggerItem
                    key={cue.category}
                    yOffset={16}
                    className="flex flex-col items-center text-center"
                  >
                    <div className="w-12 h-12 rounded-full bg-[#0B1220] border border-white/10 flex items-center justify-center mb-3">
                      {getCueIcon(cue.category)}
                    </div>
                    <span className="text-xs font-mono font-bold tracking-wider text-[#F8FAFC] uppercase">
                      {cue.category}
                    </span>
                    <span className="mt-1 text-[11px] text-[#94A3B8] leading-relaxed">
                      {cue.question}
                    </span>
                  </StaggerItem>
                ))}
              </StaggerContainer>
            </div>
          </div>

          {/* RIGHT: App Screens Preview (Columns 8-12) — matching blueprint phone fan */}
          <div className="lg:col-span-5 flex items-center justify-center w-full relative">
            {/* Decorative phone mockup showing app */}
            <div className="relative w-[240px] h-[480px] rounded-[36px] p-2.5 bg-gradient-to-b from-[#1E293B] via-[#0F172A] to-[#0B1220] shadow-[0_20px_50px_rgba(0,0,0,0.8)] border-[2.5px] border-white/15">
              <div className="absolute top-3 inset-x-0 mx-auto w-16 h-3 rounded-full bg-black z-30" />
              <div className="w-full h-full rounded-[28px] bg-[#050A12] overflow-hidden border border-white/10 p-3 pt-7 flex flex-col">
                {/* Mini App Header */}
                <div className="flex items-center gap-1.5 mb-2">
                  <div className="w-5 h-5 rounded bg-[#59D98E]/20 flex items-center justify-center text-[8px]">🌱</div>
                  <span className="font-space font-bold text-[10px] text-[#F8FAFC]">AgriLume</span>
                </div>
                
                {/* App Nav Items */}
                <div className="flex gap-1.5 mb-3">
                  {["Home", "Fields", "Scan", "Advice", "More"].map((item, i) => (
                    <div key={item} className={`px-2 py-1 rounded-full text-[7px] font-mono ${i === 0 ? 'bg-[#59D98E]/20 text-[#59D98E]' : 'bg-white/5 text-[#94A3B8]'}`}>
                      {item}
                    </div>
                  ))}
                </div>

                {/* Content cards */}
                <div className="flex-1 flex flex-col gap-2">
                  <div className="p-2 rounded-lg bg-[#0B1220] border border-white/10">
                    <div className="text-[8px] font-mono text-[#36BFFA]">MY FIELDS</div>
                    <div className="text-[9px] font-semibold text-[#F8FAFC]">Rajshahi Field</div>
                    <div className="text-[7px] text-[#59D98E]">Rice • Growing</div>
                  </div>
                  <div className="p-2 rounded-lg bg-white/5 border border-white/5">
                    <div className="text-[8px] font-mono text-[#D7A86E]">WEATHER</div>
                    <div className="text-[9px] text-[#F8FAFC]">Upcoming conditions</div>
                  </div>
                  <div className="p-2 rounded-lg bg-white/5 border border-white/5">
                    <div className="text-[8px] font-mono text-[#59D98E]">ADVISORY</div>
                    <div className="text-[9px] text-[#F8FAFC]">Practical guidance</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
