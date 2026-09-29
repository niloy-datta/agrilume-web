"use client";

import React from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowDown, ChevronDown, Compass, ShieldCheck } from "lucide-react";
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
  const shouldReduceMotion = useReducedMotion();

  return (
    <section className="relative min-h-[100svh] w-full flex flex-col justify-between pt-24 pb-8 sm:pt-28 md:pt-32 bg-[#050A12] bg-telemetry-grid overflow-hidden">
      {/* 1. Subtle Space Atmosphere and Vignette */}
      <div className="absolute top-0 right-0 w-[500px] lg:w-[800px] h-[500px] lg:h-[800px] bg-[#36BFFA]/4 rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute -bottom-24 left-0 w-[400px] h-[400px] bg-[#59D98E]/3 rounded-full blur-[140px] pointer-events-none" />

      {/* Main Container */}
      <div className="max-w-[1400px] w-full mx-auto px-6 sm:px-8 lg:px-12 flex-1 flex flex-col justify-center relative z-10 my-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-6 items-center">
          
          {/* LEFT COLUMN: Editorial Mission Storytelling (Columns 1-7 on desktop) */}
          <div className="lg:col-span-7 flex flex-col justify-center z-20">
            {/* Eyebrow / Mission Badge */}
            <Reveal delay={0.1} yOffset={16}>
              <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-[#0B1220] border border-[#36BFFA]/20 mb-6 sm:mb-8 self-start shadow-[0_2px_12px_rgba(54,191,250,0.08)]">
                <span className="w-2 h-2 rounded-full bg-[#36BFFA] shadow-[0_0_8px_#36BFFA]" />
                <span className="text-[11px] sm:text-xs font-mono font-medium tracking-[0.18em] text-[#94A3B8] uppercase">
                  {HERO_CONTENT.eyebrow}
                </span>
              </div>
            </Reveal>

            {/* Huge Headline: FROM SPACE. TO SOIL. TO ACTION. */}
            <StaggerContainer
              staggerDelay={0.14}
              delayChildren={0.2}
              className="flex flex-col"
            >
              {HERO_CONTENT.headlines.map((line, index) => (
                <StaggerItem
                  key={line}
                  yOffset={28}
                  duration={0.9}
                  className="overflow-hidden"
                >
                  <h1
                    className={`font-space font-bold tracking-[-0.035em] leading-[0.94] text-[42px] xs:text-[48px] sm:text-[62px] md:text-[76px] lg:text-[86px] xl:text-[98px] 2xl:text-[106px] ${
                      index === 0
                        ? "text-[#F8FAFC]"
                        : index === 1
                        ? "text-[#D7A86E]"
                        : "text-[#36BFFA]"
                    }`}
                  >
                    {line}
                  </h1>
                </StaggerItem>
              ))}
            </StaggerContainer>

            {/* Supporting Copy */}
            <Reveal delay={0.55} yOffset={20}>
              <p className="mt-6 sm:mt-8 text-base sm:text-lg lg:text-xl text-[#94A3B8] font-light leading-relaxed max-w-2xl">
                {HERO_CONTENT.supporting}
              </p>
            </Reveal>

            {/* CTAs */}
            <Reveal delay={0.7} yOffset={22}>
              <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                {/* Primary CTA */}
                <Link
                  href={HERO_CONTENT.primaryCta.href}
                  className="group relative inline-flex items-center justify-center gap-2.5 px-7 py-4 text-sm font-semibold tracking-wider uppercase text-[#050A12] bg-[#36BFFA] hover:bg-[#70D4FF] rounded-full transition-all duration-300 glow-cyan-button focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#36BFFA] focus-visible:ring-offset-2 focus-visible:ring-offset-[#050A12]"
                >
                  <span>{HERO_CONTENT.primaryCta.label}</span>
                  <ArrowDown className="w-4 h-4 transition-transform duration-200 group-hover:translate-y-0.5" />
                </Link>

                {/* Secondary CTA */}
                <Link
                  href={HERO_CONTENT.secondaryCta.href}
                  className="group inline-flex items-center justify-center gap-2 px-6 py-4 text-sm font-medium tracking-wide text-[#F8FAFC] hover:text-[#36BFFA] bg-[#0B1220]/80 hover:bg-[#0B1220] border border-white/10 hover:border-[#36BFFA]/40 rounded-full transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#36BFFA]"
                >
                  <Compass className="w-4 h-4 text-[#94A3B8] group-hover:text-[#36BFFA] transition-colors" />
                  <span>{HERO_CONTENT.secondaryCta.label}</span>
                </Link>
              </div>
            </Reveal>

            {/* Trust / Data Line */}
            <Reveal delay={0.85} yOffset={16}>
              <div className="mt-8 pt-6 border-t border-white/5 flex items-center gap-3 text-xs font-mono text-[#94A3B8]/75">
                <ShieldCheck className="w-4 h-4 text-[#59D98E]" />
                <span>{HERO_CONTENT.trustLine}</span>
              </div>
            </Reveal>
          </div>

          {/* RIGHT COLUMN: 3D Orbital Field (with SVG fallback) */}
          <div className="lg:col-span-5 flex items-center justify-center w-full mt-6 lg:mt-0">
            <OrbitalFieldCanvas />
          </div>
        </div>
      </div>

      {/* BOTTOM OF HERO: Subtle Scroll Indicator */}
      <div className="relative z-20 flex flex-col items-center justify-center pt-4">
        <Link
          href="#mission-threshold"
          className="group flex flex-col items-center gap-2 text-xs font-mono tracking-widest text-[#94A3B8]/70 hover:text-[#36BFFA] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#36BFFA] rounded p-1"
          aria-label="Scroll down to explore mission overview"
        >
          <span className="uppercase text-[11px]">Explore</span>
          <motion.div
            animate={
              shouldReduceMotion
                ? {}
                : {
                    y: [0, 5, 0],
                  }
            }
            transition={{
              duration: 2.2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <ChevronDown className="w-4 h-4 text-[#36BFFA] group-hover:translate-y-0.5 transition-transform" />
          </motion.div>
        </Link>
      </div>
    </section>
  );
}
