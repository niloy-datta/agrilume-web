"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowDown,
  ArrowRight,
  Compass,
  Bell,
  ChevronRight,
  CloudSun,
  Camera,
  Layers,
  Lightbulb,
  Home,
  SlidersHorizontal,
  Globe,
  BarChart3,
  Sprout,
} from "lucide-react";
import { HERO_CONTENT } from "@/lib/constants";
import { Reveal, StaggerContainer, StaggerItem } from "../motion/reveal";

export function HeroSection() {
  return (
    <section className="relative min-h-[100svh] w-full flex flex-col justify-between pt-24 pb-8 sm:pt-28 md:pt-32 bg-[#050A12] overflow-hidden">
      
      {/* 1. Cinematic Panoramic Background */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/hero-cinematic-bg.jpg"
          alt="Planet Earth in space over golden sunrise and rice terrace fields"
          fill
          priority
          className="object-cover object-center opacity-60"
        />
        {/* Layered Vignette Gradients for Text Legibility */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#050A12] via-[#050A12]/80 to-[#050A12]/30" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#050A12] via-transparent to-[#050A12]/60" />
      </div>

      {/* Atmospheric Glow Highlights */}
      <div className="absolute top-0 right-0 w-[500px] lg:w-[800px] h-[500px] lg:h-[800px] bg-[#36BFFA]/8 rounded-full blur-[160px] pointer-events-none z-0" />
      <div className="absolute -bottom-24 left-0 w-[400px] h-[400px] bg-[#59D98E]/8 rounded-full blur-[140px] pointer-events-none z-0" />

      {/* Floating Scientific Annotation Callouts (Desktop) */}
      <div className="hidden xl:block absolute top-[18%] left-[42%] z-10 pointer-events-none">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#050A12]/85 backdrop-blur-md border border-[#36BFFA]/30 shadow-lg text-[10px] font-mono">
          <span className="w-1.5 h-1.5 rounded-full bg-[#36BFFA] animate-ping" />
          <span className="text-[#36BFFA] font-medium">EARTH OBSERVATION</span>
          <span className="text-[#94A3B8]">• Satellite data and climate signals</span>
        </div>
        <div className="w-px h-16 bg-gradient-to-b from-[#36BFFA] to-transparent ml-6 mt-1" />
      </div>

      <div className="hidden xl:block absolute top-[30%] right-[18%] z-10 pointer-events-none">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#050A12]/85 backdrop-blur-md border border-[#36BFFA]/30 shadow-lg text-[10px] font-mono">
          <span className="w-1.5 h-1.5 rounded-full bg-[#36BFFA]" />
          <span className="text-[#36BFFA] font-medium">CLIMATE CONTEXT</span>
          <span className="text-[#94A3B8]">• Environmental patterns</span>
        </div>
      </div>

      <div className="hidden xl:block absolute top-[48%] right-[25%] z-10 pointer-events-none">
        <div className="w-px h-10 bg-gradient-to-b from-transparent to-[#59D98E] ml-6 mb-1" />
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#050A12]/85 backdrop-blur-md border border-[#59D98E]/30 shadow-lg text-[10px] font-mono">
          <span className="w-1.5 h-1.5 rounded-full bg-[#59D98E] animate-pulse" />
          <span className="text-[#59D98E] font-medium">FIELD CONTEXT</span>
          <span className="text-[#94A3B8]">• Agricultural intelligence</span>
        </div>
      </div>

      {/* Main Content Container */}
      <div className="max-w-[1400px] w-full mx-auto px-6 sm:px-8 lg:px-12 flex-1 flex flex-col justify-center relative z-10 my-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
          
          {/* LEFT COLUMN: Editorial Storytelling (Columns 1-7) */}
          <div className="lg:col-span-7 flex flex-col justify-center z-20">
            
            {/* Section Index Marker */}
            <div className="flex items-center gap-2 mb-4 text-xs font-mono text-[#94A3B8]/70">
              <span className="text-[#59D98E] font-semibold">01</span>
              <span>Hero</span>
              <span>•</span>
              <span>Space to Field to Action</span>
            </div>

            {/* Eyebrow */}
            <Reveal delay={0.1} yOffset={16}>
              <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-[#0B1220]/90 border border-[#36BFFA]/20 mb-6 self-start shadow-[0_2px_12px_rgba(54,191,250,0.08)]">
                <span className="w-2 h-2 rounded-full bg-[#36BFFA] shadow-[0_0_8px_#36BFFA]" />
                <span className="text-[11px] sm:text-xs font-mono font-medium tracking-[0.18em] text-[#94A3B8] uppercase">
                  {HERO_CONTENT.eyebrow}
                </span>
              </div>
            </Reveal>

            {/* Headline: FROM SPACE. TO SOIL. TO ACTION. */}
            <StaggerContainer
              staggerDelay={0.12}
              delayChildren={0.2}
              className="flex flex-col"
            >
              <StaggerItem yOffset={24} duration={0.8} className="overflow-hidden">
                <h1 className="font-space font-bold tracking-[-0.035em] leading-[0.94] text-[42px] xs:text-[48px] sm:text-[62px] md:text-[76px] lg:text-[84px] xl:text-[96px] text-[#F8FAFC]">
                  FROM SPACE.
                </h1>
              </StaggerItem>
              <StaggerItem yOffset={24} duration={0.8} className="overflow-hidden">
                <h1 className="font-space font-bold tracking-[-0.035em] leading-[0.94] text-[42px] xs:text-[48px] sm:text-[62px] md:text-[76px] lg:text-[84px] xl:text-[96px] text-[#36BFFA]">
                  TO SOIL.
                </h1>
              </StaggerItem>
              <StaggerItem yOffset={24} duration={0.8} className="overflow-hidden">
                <h1 className="font-space font-bold tracking-[-0.035em] leading-[0.94] text-[42px] xs:text-[48px] sm:text-[62px] md:text-[76px] lg:text-[84px] xl:text-[96px] text-[#59D98E]">
                  TO ACTION.
                </h1>
              </StaggerItem>
            </StaggerContainer>

            {/* Supporting Copy */}
            <Reveal delay={0.5} yOffset={18}>
              <p className="mt-6 sm:mt-8 text-base sm:text-lg lg:text-xl text-[#94A3B8] font-light leading-relaxed max-w-2xl">
                {HERO_CONTENT.supporting}
              </p>
            </Reveal>

            {/* CTAs */}
            <Reveal delay={0.65} yOffset={20}>
              <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                {/* Primary CTA (Vibrant Green Pill) */}
                <Link
                  href="#download"
                  className="group relative inline-flex items-center justify-center gap-2.5 px-8 py-4 text-sm font-semibold tracking-wider text-[#050A12] bg-[#59D98E] hover:bg-[#72e5a2] rounded-full transition-all duration-300 shadow-[0_0_24px_rgba(89,217,142,0.4)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#59D98E]"
                >
                  <span>Download AgriLume</span>
                  <ArrowDown className="w-4 h-4 transition-transform duration-200 group-hover:translate-y-0.5" />
                </Link>

                {/* Secondary CTA (Dark Glass Pill) */}
                <Link
                  href="#how-it-works"
                  className="group inline-flex items-center justify-center gap-2.5 px-7 py-4 text-sm font-medium tracking-wide text-[#F8FAFC] hover:text-[#36BFFA] bg-[#0B1220]/80 hover:bg-[#0B1220] border border-white/15 hover:border-[#36BFFA]/40 rounded-full transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#36BFFA]"
                >
                  <Compass className="w-4 h-4 text-[#94A3B8] group-hover:text-[#36BFFA] transition-colors" />
                  <span>Explore How It Works</span>
                  <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
                </Link>
              </div>
            </Reveal>

            {/* Trust Badges — matching blueprint exactly */}
            <Reveal delay={0.8} yOffset={16}>
              <div className="mt-8 pt-6 border-t border-white/10 flex flex-wrap items-center gap-6 text-xs font-mono text-[#94A3B8]">
                <div className="flex items-center gap-2">
                  <Globe className="w-4 h-4 text-[#36BFFA]" />
                  <span>Earth context</span>
                </div>
                <div className="flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-[#59D98E]" />
                  <span>Evidence</span>
                </div>
                <div className="flex items-center gap-2">
                  <Sprout className="w-4 h-4 text-[#D7A86E]" />
                  <span>Farmer action</span>
                </div>
              </div>
            </Reveal>
          </div>

          {/* RIGHT COLUMN: Phone Mockup (Columns 8-12) — Blueprint-accurate app preview */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center w-full mt-4 lg:mt-0 relative">
            
            {/* Glow behind phone */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-[320px] h-[500px] bg-[#59D98E]/10 rounded-full blur-[80px]" />
            </div>

            {/* Phone Mockup */}
            <div className="relative w-[280px] sm:w-[310px] h-[580px] sm:h-[620px] rounded-[44px] p-3 bg-gradient-to-b from-[#1E293B] via-[#0F172A] to-[#0B1220] shadow-[0_25px_70px_rgba(0,0,0,0.9),0_0_40px_rgba(89,217,142,0.15)] border-[3px] border-white/20 select-none z-10">
              
              {/* Speaker Notch */}
              <div className="absolute top-4 inset-x-0 mx-auto w-20 h-3.5 rounded-full bg-black z-30 flex items-center justify-center">
                <span className="w-1.5 h-1.5 rounded-full bg-white/20" />
              </div>

              {/* Inner Screen */}
              <div className="w-full h-full rounded-[36px] bg-[#050A12] overflow-hidden flex flex-col relative border border-white/10 p-3.5 pt-8">
                
                {/* App Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-md bg-[#59D98E]/20 flex items-center justify-center">
                      <span className="text-[10px]">🌱</span>
                    </div>
                    <span className="font-space font-bold text-xs text-[#F8FAFC]">AgriLume</span>
                  </div>
                  <div className="w-6 h-6 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
                    <Bell className="w-3 h-3 text-[#94A3B8]" />
                  </div>
                </div>

                {/* Greeting */}
                <div className="mt-3">
                  <div className="text-sm font-space font-semibold text-[#F8FAFC]">
                    Good morning, Farmer
                  </div>
                  <div className="text-[10px] text-[#94A3B8]">
                    Healthier fields. Brighter tomorrows.
                  </div>
                </div>

                {/* Your Fields Card */}
                <div className="mt-3 p-2.5 rounded-xl bg-[#0B1220] border border-white/10 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#123024] to-[#1D4A36] border border-[#59D98E]/30 flex items-center justify-center text-sm">
                      🌾
                    </div>
                    <div>
                      <div className="text-[8px] font-mono text-[#94A3B8] uppercase">YOUR FIELD</div>
                      <div className="text-[11px] font-semibold text-[#F8FAFC]">Rajshahi Field</div>
                      <div className="text-[9px] text-[#59D98E] flex items-center gap-1">
                        <span className="w-1 h-1 rounded-full bg-[#59D98E]" />
                        <span>Rice • Growing</span>
                      </div>
                    </div>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-[#94A3B8]" />
                </div>

                {/* Today Weather Card */}
                <div className="mt-2.5 p-2.5 rounded-xl bg-white/5 border border-white/5 flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-[#36BFFA]/10 border border-[#36BFFA]/20 flex items-center justify-center text-sm">
                    ☀️
                  </div>
                  <div>
                    <div className="text-[11px] font-semibold text-[#F8FAFC]">Today</div>
                    <div className="text-[9px] text-[#94A3B8]">Clear with light clouds</div>
                  </div>
                </div>

                {/* Quick Action Grid */}
                <div className="mt-auto grid grid-cols-2 gap-2">
                  <div className="p-2 rounded-lg bg-white/5 border border-white/5">
                    <Camera className="w-3.5 h-3.5 text-[#59D98E]" />
                    <div className="mt-1.5 text-[10px] font-semibold text-[#F8FAFC]">Scan Crop</div>
                    <div className="text-[8px] text-[#94A3B8]">Check crop health</div>
                  </div>
                  <div className="p-2 rounded-lg bg-white/5 border border-white/5">
                    <Layers className="w-3.5 h-3.5 text-[#36BFFA]" />
                    <div className="mt-1.5 text-[10px] font-semibold text-[#F8FAFC]">My Fields</div>
                    <div className="text-[8px] text-[#94A3B8]">View and manage</div>
                  </div>
                </div>

                {/* Advisory Card */}
                <div className="mt-2 p-2.5 rounded-xl bg-[#0B1220] border border-[#D7A86E]/20">
                  <div className="flex items-center gap-1.5">
                    <Lightbulb className="w-3 h-3 text-[#D7A86E]" />
                    <span className="text-[10px] font-semibold text-[#F8FAFC]">Advisory</span>
                  </div>
                  <div className="text-[8px] text-[#94A3B8] mt-0.5">Personalized recommendations</div>
                  <ChevronRight className="w-3 h-3 text-[#94A3B8] ml-auto -mt-3" />
                </div>

                {/* Bottom Navigation */}
                <div className="mt-2 pt-2 border-t border-white/10 flex items-center justify-around text-[8px] font-mono text-[#94A3B8]">
                  <div className="flex flex-col items-center gap-0.5 text-[#59D98E]">
                    <Home className="w-3 h-3" />
                    <span>Home</span>
                  </div>
                  <div className="flex flex-col items-center gap-0.5">
                    <Layers className="w-3 h-3" />
                    <span>Fields</span>
                  </div>
                  <div className="flex flex-col items-center gap-0.5">
                    <Camera className="w-3 h-3" />
                    <span>Scan</span>
                  </div>
                  <div className="flex flex-col items-center gap-0.5">
                    <Lightbulb className="w-3 h-3" />
                    <span>Advice</span>
                  </div>
                  <div className="flex flex-col items-center gap-0.5">
                    <SlidersHorizontal className="w-3 h-3" />
                    <span>More</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* BOTTOM: Scroll Indicator */}
      <div className="relative z-20 flex flex-col items-center justify-center pt-4">
        <Link
          href="#mission"
          className="group flex flex-col items-center gap-1 text-xs font-mono tracking-widest text-[#94A3B8]/70 hover:text-[#59D98E] transition-colors"
          aria-label="Scroll down to explore"
        >
          <span className="uppercase text-[10px]">Explore Decision Context</span>
          <ArrowDown className="w-4 h-4 text-[#59D98E] animate-bounce" />
        </Link>
      </div>
    </section>
  );
}
