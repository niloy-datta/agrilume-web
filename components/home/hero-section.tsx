"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Download, ArrowRight, Globe, BarChart3, Sprout } from "lucide-react";
import { HERO_CONTENT } from "@/lib/constants";
import { Reveal, StaggerContainer, StaggerItem } from "../motion/reveal";

export function HeroSection() {
  return (
    <section className="relative min-h-[100svh] w-full flex flex-col justify-between pt-24 pb-8 sm:pt-28 md:pt-32 bg-[#050A12] overflow-hidden">
      
      {/* 1. Cinematic Panoramic Background */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/hero-cinematic-bg.jpg"
          alt="Planet Earth in space overlooking golden sunrise over farming valley and rice fields"
          fill
          priority
          className="object-cover object-center opacity-70"
        />
        {/* Subtle Vignettes to maintain clean contrast while showing the Earth & farmer */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#050A12]/95 via-[#050A12]/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#050A12] via-transparent to-[#050A12]/50" />
      </div>

      {/* Atmospheric Glow Highlights */}
      <div className="absolute top-0 right-0 w-[500px] lg:w-[800px] h-[500px] lg:h-[800px] bg-[#36BFFA]/10 rounded-full blur-[170px] pointer-events-none z-0" />
      <div className="absolute bottom-10 left-10 w-[400px] h-[400px] bg-[#59D98E]/10 rounded-full blur-[160px] pointer-events-none z-0" />

      {/* Floating Scientific Annotation Callouts (matching exact blueprint) */}
      <div className="hidden lg:block absolute top-[22%] right-[40%] xl:right-[43%] z-10 pointer-events-none">
        <div className="flex flex-col items-start bg-[#050A12]/85 backdrop-blur-md border border-[#36BFFA]/40 rounded-lg px-3 py-1.5 shadow-[0_0_20px_rgba(0,0,0,0.8)]">
          <div className="flex items-center gap-1.5 text-[10px] font-mono text-[#F8FAFC] font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-[#36BFFA] animate-ping" />
            <span>Satellite observation</span>
          </div>
          <span className="text-[9px] text-[#94A3B8] font-mono">Earth data</span>
        </div>
        <div className="w-px h-12 bg-gradient-to-b from-[#36BFFA]/80 to-transparent ml-4" />
      </div>

      <div className="hidden lg:block absolute top-[28%] right-[16%] xl:right-[20%] z-10 pointer-events-none">
        <div className="flex flex-col items-start bg-[#050A12]/85 backdrop-blur-md border border-[#36BFFA]/40 rounded-lg px-3 py-1.5 shadow-[0_0_20px_rgba(0,0,0,0.8)]">
          <div className="flex items-center gap-1.5 text-[10px] font-mono text-[#F8FAFC] font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-[#36BFFA]" />
            <span>Climate context</span>
          </div>
          <span className="text-[9px] text-[#94A3B8] font-mono">Environmental patterns</span>
        </div>
      </div>

      <div className="hidden lg:block absolute top-[44%] right-[24%] xl:right-[28%] z-10 pointer-events-none">
        <div className="flex flex-col items-start bg-[#050A12]/85 backdrop-blur-md border border-[#59D98E]/40 rounded-lg px-3 py-1.5 shadow-[0_0_20px_rgba(0,0,0,0.8)]">
          <div className="flex items-center gap-1.5 text-[10px] font-mono text-[#F8FAFC] font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-[#59D98E] animate-pulse" />
            <span>Field context</span>
          </div>
          <span className="text-[9px] text-[#94A3B8] font-mono">Agricultural intelligence</span>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-[1400px] w-full mx-auto px-6 sm:px-8 lg:px-12 relative z-10 flex-1 flex flex-col justify-center">
        
        {/* Section 01 Index Marker on Left */}
        <div className="flex items-center gap-2 mb-6 text-xs font-mono text-[#94A3B8]/70">
          <span className="text-[#59D98E] font-bold">01</span>
          <span className="text-white/80 font-medium">Hero</span>
          <span>•</span>
          <span>Space to Soil to Action</span>
        </div>

        <div className="max-w-3xl">
          {/* Eyebrow Label */}
          <Reveal delay={0.1} yOffset={16}>
            <div className="text-[11px] sm:text-xs font-mono tracking-[0.22em] text-[#94A3B8] uppercase mb-4 flex items-center gap-2">
              <span>{HERO_CONTENT.eyebrow}</span>
            </div>
          </Reveal>

          {/* Headline: Exact 2-Line Split */}
          <Reveal delay={0.2} yOffset={24}>
            <h1 className="font-space font-extrabold tracking-tight text-4xl sm:text-6xl md:text-7xl lg:text-[76px] leading-[1.02] text-[#F8FAFC]">
              FROM SPACE. <br />
              <span className="text-[#59D98E] drop-shadow-[0_0_35px_rgba(89,217,142,0.4)]">
                TO SOIL. TO ACTION.
              </span>
            </h1>
          </Reveal>

          {/* Subtitle / Statement */}
          <Reveal delay={0.3} yOffset={20}>
            <p className="mt-6 text-base sm:text-lg md:text-xl text-[#CBD5E1] font-normal leading-relaxed max-w-2xl">
              {HERO_CONTENT.supporting}
            </p>
          </Reveal>

          {/* Dual Action CTAs */}
          <Reveal delay={0.4} yOffset={20}>
            <div className="mt-8 sm:mt-10 flex flex-wrap items-center gap-4">
              <Link
                href="#download"
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-[#59D98E] hover:bg-[#6ef0a4] text-[#050A12] text-sm font-bold tracking-wide transition-all shadow-[0_0_28px_rgba(89,217,142,0.5)] hover:shadow-[0_0_36px_rgba(89,217,142,0.7)] hover:scale-[1.02]"
              >
                <span>Download AgriLume</span>
                <Download className="w-4 h-4 stroke-[2.5]" />
              </Link>

              <Link
                href="#how-it-works"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-[#0B1220]/80 hover:bg-[#1E293B] border border-white/15 hover:border-white/30 text-[#F8FAFC] text-sm font-medium transition-all"
              >
                <span>Explore How It Works</span>
                <ArrowRight className="w-4 h-4 text-[#36BFFA]" />
              </Link>
            </div>
          </Reveal>
        </div>
      </div>

      {/* Bottom 3-Badge Strip (Matching exact blueprint footer in Hero) */}
      <div className="relative z-10 w-full border-t border-white/10 bg-[#050A12]/80 backdrop-blur-md mt-12 py-3.5">
        <div className="max-w-[1400px] mx-auto px-6 sm:px-8 lg:px-12 flex flex-wrap items-center gap-8 sm:gap-12 text-xs font-mono text-[#94A3B8]">
          <div className="flex items-center gap-2">
            <Globe className="w-4 h-4 text-[#36BFFA]" />
            <span className="text-[#F8FAFC]">Earth context</span>
          </div>
          <div className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-[#59D98E]" />
            <span className="text-[#F8FAFC]">Evidence</span>
          </div>
          <div className="flex items-center gap-2">
            <Sprout className="w-4 h-4 text-[#D7A86E]" />
            <span className="text-[#F8FAFC]">Farmer action</span>
          </div>
        </div>
      </div>
    </section>
  );
}
