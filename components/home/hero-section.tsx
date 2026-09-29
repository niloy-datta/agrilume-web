"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import {
  ArrowDown,
  ArrowRight,
  ChevronDown,
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
  Smartphone,
} from "lucide-react";
import { HERO_CONTENT } from "@/lib/constants";
import { HeroVisual } from "./hero-visual";
import { Reveal, StaggerContainer, StaggerItem } from "../motion/reveal";

// Dynamic client import for 3D WebGL scene with seamless SVG/vector fallback
const OrbitalFieldCanvas = dynamic(
  () => import("@/components/3d/orbital-field-canvas").then((mod) => mod.OrbitalFieldCanvas),
  {
    ssr: false,
    loading: () => <HeroVisual />,
  }
);

export function HeroSection() {
  const [activeVisual, setActiveVisual] = useState<"app" | "3d">("app");

  return (
    <section className="relative min-h-[100svh] w-full flex flex-col justify-between pt-24 pb-8 sm:pt-28 md:pt-32 bg-[#050A12] overflow-hidden">
      
      {/* 1. Cinematic Panoramic Background */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/agrilume-hero-bg.jpg"
          alt="Planet Earth in space over golden sunrise and rice terrace fields"
          fill
          priority
          className="object-cover object-center opacity-60"
        />
        {/* Layered Vignette Gradients for Text Legibility */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#050A12] via-[#050A12]/80 to-[#050A12]/40" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#050A12] via-transparent to-[#050A12]/70" />
        <div className="absolute inset-0 bg-telemetry-grid opacity-20 pointer-events-none" />
      </div>

      {/* Atmospheric Glow Highlights */}
      <div className="absolute top-0 right-0 w-[500px] lg:w-[800px] h-[500px] lg:h-[800px] bg-[#36BFFA]/8 rounded-full blur-[160px] pointer-events-none z-0" />
      <div className="absolute -bottom-24 left-0 w-[400px] h-[400px] bg-[#59D98E]/8 rounded-full blur-[140px] pointer-events-none z-0" />

      {/* Floating Scientific Annotation Callouts (Desktop) */}
      <div className="hidden xl:block absolute top-[18%] left-[45%] z-10 pointer-events-none">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#050A12]/85 backdrop-blur-md border border-[#36BFFA]/30 shadow-lg text-[10px] font-mono">
          <span className="w-1.5 h-1.5 rounded-full bg-[#36BFFA] animate-ping" />
          <span className="text-[#36BFFA] font-medium">EARTH OBSERVATION</span>
          <span className="text-[#94A3B8]">• Satellite Data</span>
        </div>
        <div className="w-px h-12 bg-gradient-to-b from-[#36BFFA] to-transparent ml-6 mt-1" />
      </div>

      <div className="hidden xl:block absolute top-[28%] right-[22%] z-10 pointer-events-none">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#050A12]/85 backdrop-blur-md border border-[#36BFFA]/30 shadow-lg text-[10px] font-mono">
          <span className="w-1.5 h-1.5 rounded-full bg-[#36BFFA]" />
          <span className="text-[#36BFFA] font-medium">CLIMATE CONTEXT</span>
          <span className="text-[#94A3B8]">• Environmental Patterns</span>
        </div>
      </div>

      <div className="hidden xl:block absolute top-[45%] right-[28%] z-10 pointer-events-none">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#050A12]/85 backdrop-blur-md border border-[#59D98E]/30 shadow-lg text-[10px] font-mono">
          <span className="w-1.5 h-1.5 rounded-full bg-[#59D98E] animate-pulse" />
          <span className="text-[#59D98E] font-medium">FIELD CONTEXT</span>
          <span className="text-[#94A3B8]">• Agricultural Intel</span>
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

            {/* Trust Badges */}
            <Reveal delay={0.8} yOffset={16}>
              <div className="mt-8 pt-6 border-t border-white/10 flex flex-wrap items-center gap-6 text-xs font-mono text-[#94A3B8]">
                <div className="flex items-center gap-2">
                  <span className="text-[#36BFFA]">🌐</span>
                  <span>Earth context</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[#59D98E]">📊</span>
                  <span>Evidence</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[#D7A86E]">🌱</span>
                  <span>Farmer action</span>
                </div>
              </div>
            </Reveal>
          </div>

          {/* RIGHT COLUMN: Interactive 3D Phone Mockup & 3D Orbital Field (Columns 8-12) */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center w-full mt-4 lg:mt-0 relative">
            
            {/* View Mode Toggle Pill */}
            <div className="mb-4 z-20 flex items-center p-1 rounded-full bg-[#0B1220]/90 border border-white/10 backdrop-blur-md shadow-lg">
              <button
                type="button"
                onClick={() => setActiveVisual("app")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-mono font-medium transition-all ${
                  activeVisual === "app"
                    ? "bg-[#59D98E] text-[#050A12] shadow"
                    : "text-[#94A3B8] hover:text-[#F8FAFC]"
                }`}
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span>APP PREVIEW</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveVisual("3d")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-mono font-medium transition-all ${
                  activeVisual === "3d"
                    ? "bg-[#36BFFA] text-[#050A12] shadow"
                    : "text-[#94A3B8] hover:text-[#F8FAFC]"
                }`}
              >
                <Globe className="w-3.5 h-3.5" />
                <span>3D ORBITAL</span>
              </button>
            </div>

            {/* Visual 1: Mobile App Phone Mockup */}
            {activeVisual === "app" ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.35 }}
                className="relative w-[300px] sm:w-[330px] h-[610px] sm:h-[650px] rounded-[48px] p-3.5 bg-gradient-to-b from-[#1E293B] via-[#0F172A] to-[#0B1220] shadow-[0_25px_70px_rgba(0,0,0,0.9),0_0_40px_rgba(89,217,142,0.15)] border-[3px] border-white/20 select-none"
              >
                {/* Speaker Notch */}
                <div className="absolute top-5 inset-x-0 mx-auto w-24 h-4 rounded-full bg-black z-30 flex items-center justify-center">
                  <span className="w-2 h-2 rounded-full bg-white/20" />
                </div>

                {/* Inner Screen */}
                <div className="w-full h-full rounded-[38px] bg-[#050A12] overflow-hidden flex flex-col justify-between relative border border-white/10 p-4 pt-9">
                  
                  {/* App Header */}
                  <div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-md bg-[#59D98E]/20 flex items-center justify-center">
                          <span className="text-[#59D98E] text-xs">🌱</span>
                        </div>
                        <span className="font-space font-bold text-sm text-[#F8FAFC]">AgriLume</span>
                      </div>
                      <div className="w-7 h-7 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
                        <Bell className="w-3.5 h-3.5 text-[#94A3B8]" />
                      </div>
                    </div>

                    {/* Greeting */}
                    <div className="mt-4">
                      <div className="text-sm font-space font-semibold text-[#F8FAFC]">
                        Good morning, Farmer
                      </div>
                      <div className="text-[11px] text-[#94A3B8]">
                        Healthier fields. Brighter tomorrows.
                      </div>
                    </div>
                  </div>

                  {/* Your Fields Card */}
                  <div className="p-3 rounded-2xl bg-[#0B1220] border border-white/10 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#123024] to-[#1D4A36] border border-[#59D98E]/30 flex items-center justify-center text-base">
                        🌾
                      </div>
                      <div>
                        <div className="text-[9px] font-mono text-[#94A3B8] uppercase">YOUR FIELDS</div>
                        <div className="text-xs font-semibold text-[#F8FAFC]">Rajshahi Field</div>
                        <div className="text-[10px] text-[#59D98E] flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#59D98E]" />
                          <span>Rice • Growing</span>
                        </div>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-[#94A3B8]" />
                  </div>

                  {/* 4 Quick Tiles Grid */}
                  <div className="grid grid-cols-2 gap-2.5">
                    <div className="p-2.5 rounded-xl bg-white/5 border border-white/5 flex flex-col justify-between">
                      <CloudSun className="w-4 h-4 text-[#36BFFA]" />
                      <div className="mt-2 text-xs font-semibold text-[#F8FAFC]">Weather</div>
                      <div className="text-[9px] text-[#94A3B8]">Upcoming conditions</div>
                    </div>

                    <div className="p-2.5 rounded-xl bg-white/5 border border-white/5 flex flex-col justify-between">
                      <Camera className="w-4 h-4 text-[#59D98E]" />
                      <div className="mt-2 text-xs font-semibold text-[#F8FAFC]">Scan Crop</div>
                      <div className="text-[9px] text-[#94A3B8]">Instant insights</div>
                    </div>

                    <div className="p-2.5 rounded-xl bg-white/5 border border-white/5 flex flex-col justify-between">
                      <Layers className="w-4 h-4 text-[#36BFFA]" />
                      <div className="mt-2 text-xs font-semibold text-[#F8FAFC]">My Fields</div>
                      <div className="text-[9px] text-[#94A3B8]">Your farmland</div>
                    </div>

                    <div className="p-2.5 rounded-xl bg-white/5 border border-white/5 flex flex-col justify-between">
                      <Lightbulb className="w-4 h-4 text-[#D7A86E]" />
                      <div className="mt-2 text-xs font-semibold text-[#F8FAFC]">Advice</div>
                      <div className="text-[9px] text-[#94A3B8]">Practical guidance</div>
                    </div>
                  </div>

                  {/* Bottom Navigation */}
                  <div className="pt-2 border-t border-white/10 flex items-center justify-around text-[9px] font-mono text-[#94A3B8]">
                    <div className="flex flex-col items-center gap-1 text-[#59D98E]">
                      <Home className="w-3.5 h-3.5" />
                      <span>Home</span>
                    </div>
                    <div className="flex flex-col items-center gap-1">
                      <Layers className="w-3.5 h-3.5" />
                      <span>Fields</span>
                    </div>
                    <div className="flex flex-col items-center gap-1">
                      <Camera className="w-3.5 h-3.5" />
                      <span>Scan</span>
                    </div>
                    <div className="flex flex-col items-center gap-1">
                      <Lightbulb className="w-3.5 h-3.5" />
                      <span>Advice</span>
                    </div>
                    <div className="flex flex-col items-center gap-1">
                      <SlidersHorizontal className="w-3.5 h-3.5" />
                      <span>More</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ) : (
              /* Visual 2: 3D Orbital Field Canvas */
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.35 }}
                className="w-full flex items-center justify-center"
              >
                <OrbitalFieldCanvas />
              </motion.div>
            )}
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
          <ChevronDown className="w-4 h-4 text-[#59D98E] animate-bounce" />
        </Link>
      </div>
    </section>
  );
}
