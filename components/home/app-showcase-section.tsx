"use client";

import React from "react";
import Image from "next/image";
import {
  Home,
  Layers,
  Camera,
  CloudSun,
  Lightbulb,
  CheckCircle2,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import { Reveal } from "../motion/reveal";

export function AppShowcaseSection() {
  const sidebarButtons = [
    { icon: <Home className="w-4 h-4 text-[#36BFFA]" />, label: "Home", sub: "Quick overview", active: true },
    { icon: <Layers className="w-4 h-4 text-[#59D98E]" />, label: "My Fields", sub: "Your farmland" },
    { icon: <Camera className="w-4 h-4 text-[#36BFFA]" />, label: "Scan Crop", sub: "Instant insights" },
    { icon: <CloudSun className="w-4 h-4 text-[#D7A86E]" />, label: "Weather", sub: "Upcoming conditions" },
    { icon: <Lightbulb className="w-4 h-4 text-[#59D98E]" />, label: "Advisory", sub: "Practical guidance" },
  ];

  return (
    <section
      id="app"
      className="relative w-full py-24 sm:py-32 lg:py-36 bg-[#050A12] border-t border-white/5 overflow-hidden"
      aria-labelledby="app-showcase-title"
    >
      {/* Background radial glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] bg-[#36BFFA]/4 rounded-full blur-[200px] pointer-events-none" />

      <div className="max-w-[1400px] mx-auto px-6 sm:px-8 lg:px-12 relative z-10">
        
        {/* Section 05 Index Marker */}
        <div className="flex items-center gap-2 mb-6 text-xs font-mono text-[#94A3B8]/70">
          <span className="text-[#36BFFA] font-bold">05</span>
          <span className="text-white/80 font-medium">App Showcase</span>
          <span>•</span>
          <span>Complex intelligence. Simple experience.</span>
        </div>

        {/* Section Header */}
        <div className="max-w-3xl mb-16">
          <Reveal delay={0.1} yOffset={16}>
            <h2
              id="app-showcase-title"
              className="font-space font-extrabold tracking-tight text-3xl sm:text-4xl lg:text-[46px] text-[#F8FAFC] leading-[1.08]"
            >
              THE INTELLIGENCE STAYS COMPLEX. <br />
              <span className="text-[#59D98E]">THE EXPERIENCE STAYS SIMPLE.</span>
            </h2>
          </Reveal>

          <Reveal delay={0.2} yOffset={14}>
            <p className="mt-4 text-base sm:text-lg text-[#94A3B8] font-normal leading-relaxed">
              A clean and intuitive mobile app designed for farmers, backed by Earth and climate intelligence.
            </p>
          </Reveal>
        </div>

        {/* Main Grid: Left Sidebar Buttons + Right Phone Mockup Deck */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          {/* LEFT: 5 Interactive/Feature Buttons */}
          <div className="lg:col-span-4 flex flex-col gap-3.5">
            {sidebarButtons.map((btn, idx) => (
              <Reveal key={btn.label} delay={0.1 * idx} yOffset={12}>
                <div
                  className={`flex items-center gap-4 px-4 py-3.5 rounded-xl border transition-all ${
                    btn.active
                      ? "bg-[#0B1528] border-[#36BFFA]/40 shadow-[0_0_20px_rgba(54,191,250,0.15)]"
                      : "bg-[#0B1220]/60 border-white/5 hover:border-white/15"
                  }`}
                >
                  <div className="w-9 h-9 rounded-lg bg-[#050A12] border border-white/10 flex items-center justify-center">
                    {btn.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold text-[#F8FAFC]">{btn.label}</div>
                    <div className="text-xs text-[#94A3B8] truncate">{btn.sub}</div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-white/30" />
                </div>
              </Reveal>
            ))}
          </div>

          {/* RIGHT: 3-Phone Angled Deck Mockup (Matching 1:1 blueprint visual) */}
          <div className="lg:col-span-8 relative flex items-center justify-center min-h-[480px] sm:min-h-[560px]">
            
            {/* Left Phone (Angled) */}
            <div className="absolute left-[5%] sm:left-[12%] top-6 w-[200px] sm:w-[240px] h-[400px] sm:h-[480px] rounded-[36px] p-2.5 bg-gradient-to-b from-[#1E293B] to-[#0A101D] border-2 border-white/10 shadow-[0_25px_60px_rgba(0,0,0,0.8)] -rotate-6 z-10 hidden sm:block opacity-75 blur-[0.4px]">
              <div className="w-full h-full rounded-[28px] bg-[#050A12] overflow-hidden p-3.5 flex flex-col justify-between text-xs">
                <div>
                  <div className="text-[10px] font-mono text-[#36BFFA] uppercase">Scan Crop</div>
                  <div className="mt-2 text-sm font-bold text-white">Leaf Health Diagnostic</div>
                  <div className="mt-3 w-full h-32 rounded-xl bg-[#0B1622] border border-white/5 flex items-center justify-center text-3xl">
                    🌿
                  </div>
                </div>
                <div className="p-2.5 rounded-lg bg-[#59D98E]/10 border border-[#59D98E]/20 text-[11px] text-[#59D98E]">
                  ✓ Normal chlorophyll index
                </div>
              </div>
            </div>

            {/* Right Phone (Angled) */}
            <div className="absolute right-[5%] sm:right-[12%] top-6 w-[200px] sm:w-[240px] h-[400px] sm:h-[480px] rounded-[36px] p-2.5 bg-gradient-to-b from-[#1E293B] to-[#0A101D] border-2 border-white/10 shadow-[0_25px_60px_rgba(0,0,0,0.8)] rotate-6 z-10 hidden sm:block opacity-75 blur-[0.4px]">
              <div className="w-full h-full rounded-[28px] bg-[#050A12] overflow-hidden p-3.5 flex flex-col justify-between text-xs">
                <div>
                  <div className="text-[10px] font-mono text-[#D7A86E] uppercase">Weather Outlook</div>
                  <div className="mt-2 text-sm font-bold text-white">Rajshahi Basin</div>
                  <div className="mt-3 text-2xl font-bold text-white">31°C</div>
                  <div className="text-[11px] text-[#94A3B8]">Clear sky • 42% Soil Humidity</div>
                </div>
                <div className="p-2.5 rounded-lg bg-[#36BFFA]/10 border border-[#36BFFA]/20 text-[11px] text-[#36BFFA]">
                  3-Day window favorable
                </div>
              </div>
            </div>

            {/* Center Phone (Hero Phone in focus) */}
            <div className="relative w-[240px] sm:w-[280px] h-[480px] sm:h-[540px] rounded-[42px] p-3 bg-gradient-to-b from-[#334155] via-[#1E293B] to-[#0B1220] border-2 border-[#59D98E]/40 shadow-[0_30px_90px_rgba(0,0,0,0.9),0_0_35px_rgba(89,217,142,0.25)] z-20">
              {/* Dynamic Island Notch */}
              <div className="absolute top-4 inset-x-0 mx-auto w-24 h-4 rounded-full bg-black z-30 flex items-center justify-center">
                <div className="w-2.5 h-2.5 rounded-full bg-[#111] mr-3" />
                <div className="w-1.5 h-1.5 rounded-full bg-[#36BFFA]/50" />
              </div>

              {/* Phone Screen UI */}
              <div className="w-full h-full rounded-[32px] bg-[#050A12] overflow-hidden flex flex-col justify-between pt-7 pb-4 px-4 border border-white/10">
                {/* App Topbar */}
                <div className="flex items-center justify-between text-xs pb-3 border-b border-white/5">
                  <div className="flex items-center gap-1.5 font-space font-bold text-sm text-white">
                    <span className="text-[#59D98E]">Agri</span>Lume
                  </div>
                  <span className="w-2 h-2 rounded-full bg-[#59D98E]" />
                </div>

                {/* Welcome Card with Rice Terrace Graphic */}
                <div className="relative my-3 p-3.5 rounded-2xl bg-gradient-to-br from-[#0B1824] to-[#050A12] border border-white/10 overflow-hidden">
                  <div className="relative z-10">
                    <div className="text-[11px] text-[#94A3B8]">Good morning,</div>
                    <div className="text-sm font-bold text-white mt-0.5">Let’s care for your fields together.</div>
                  </div>
                  <div className="absolute -right-4 -bottom-4 w-20 h-20 rounded-full bg-[#59D98E]/10 blur-xl pointer-events-none" />
                </div>

                {/* My Fields Card (Rajshahi Field) */}
                <div className="flex-1 flex flex-col justify-center">
                  <div className="text-[11px] font-mono text-[#94A3B8] mb-1.5">My Fields</div>
                  <div className="p-3 rounded-xl bg-[#0B1220] border border-[#59D98E]/30 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-lg bg-[#0F201B] border border-[#59D98E]/40 flex items-center justify-center text-sm">
                        🌾
                      </div>
                      <div>
                        <div className="text-xs font-bold text-white">Rajshahi Field</div>
                        <div className="text-[10px] text-[#94A3B8]">Rice • Growing</div>
                      </div>
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#59D98E]/15 text-[#59D98E] font-semibold">
                      Optimal
                    </span>
                  </div>
                </div>

                {/* Bottom Navigation */}
                <div className="pt-2 border-t border-white/5 flex items-center justify-around text-[10px] text-[#94A3B8]">
                  <div className="flex flex-col items-center text-[#59D98E]">
                    <Home className="w-4 h-4" />
                    <span className="mt-0.5 font-bold">Home</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <Layers className="w-4 h-4" />
                    <span className="mt-0.5">Fields</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <Camera className="w-4 h-4" />
                    <span className="mt-0.5">Scan</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <Lightbulb className="w-4 h-4" />
                    <span className="mt-0.5">Advice</span>
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
