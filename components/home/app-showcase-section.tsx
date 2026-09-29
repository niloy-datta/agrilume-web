"use client";

import React from "react";
import {
  Home,
  Layers,
  Camera,
  Lightbulb,
  CloudSun,
  Bell,
  ChevronRight,
  Map,
  BarChart3,
  SlidersHorizontal,
} from "lucide-react";
import { Reveal } from "../motion/reveal";

/* Mini phone component for the app showcase fan */
function MiniPhone({ title, children, className = "", rotation = 0, zIndex = 1 }: {
  title: string;
  children: React.ReactNode;
  className?: string;
  rotation?: number;
  zIndex?: number;
}) {
  return (
    <div
      className={`absolute w-[160px] sm:w-[180px] h-[320px] sm:h-[360px] rounded-[28px] p-2 bg-gradient-to-b from-[#1E293B] via-[#0F172A] to-[#0B1220] border-[2px] border-white/15 shadow-[0_20px_50px_rgba(0,0,0,0.8)] select-none ${className}`}
      style={{ transform: `rotate(${rotation}deg)`, zIndex }}
    >
      <div className="absolute top-2 inset-x-0 mx-auto w-12 h-2.5 rounded-full bg-black z-30" />
      <div className="w-full h-full rounded-[22px] bg-[#050A12] overflow-hidden border border-white/10 p-2 pt-5 flex flex-col">
        <div className="text-[8px] font-mono text-[#36BFFA] uppercase tracking-wider mb-1 font-bold">{title}</div>
        {children}
      </div>
    </div>
  );
}

export function AppShowcaseSection() {
  return (
    <section
      id="app"
      className="relative w-full py-24 sm:py-32 lg:py-36 bg-gradient-to-b from-[#050A12] via-[#0B1220] to-[#050A12] border-t border-white/5 overflow-hidden"
      aria-labelledby="app-showcase-title"
    >
      {/* Background glows */}
      <div className="absolute top-1/3 right-1/4 w-[600px] h-[600px] bg-[#36BFFA]/4 rounded-full blur-[190px] pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/3 w-[500px] h-[500px] bg-[#59D98E]/3 rounded-full blur-[160px] pointer-events-none" />

      <div className="max-w-[1400px] mx-auto px-6 sm:px-8 lg:px-12 relative z-10">
        
        {/* Section Index Marker */}
        <div className="flex items-center gap-2 mb-6 text-xs font-mono text-[#94A3B8]/60">
          <span className="text-[#59D98E]">05</span>
          <span>App Showcase</span>
          <span>•</span>
          <span>Complex intelligence. Simple experience.</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* LEFT: Text Content */}
          <div className="lg:col-span-5 flex flex-col">
            <Reveal delay={0.1} yOffset={16}>
              <h2
                id="app-showcase-title"
                className="font-space font-bold tracking-tight text-3xl sm:text-4xl lg:text-[44px] text-[#F8FAFC] leading-[1.08]"
              >
                THE INTELLIGENCE STAYS COMPLEX.{" "}
                <span className="text-[#59D98E]">THE EXPERIENCE STAYS SIMPLE.</span>
              </h2>
            </Reveal>

            <Reveal delay={0.2} yOffset={18}>
              <p className="mt-5 text-base sm:text-lg text-[#94A3B8] font-light leading-relaxed">
                A clean and intuitive mobile app designed for farmers, backed by Earth and climate intelligence.
              </p>
            </Reveal>
          </div>

          {/* RIGHT: Multi-Phone Fan Display — matching blueprint */}
          <div className="lg:col-span-7 flex items-center justify-center w-full">
            <div className="relative w-full h-[420px] sm:h-[480px]">
              
              {/* Phone 1: Home Screen (leftmost, rotated left) */}
              <MiniPhone title="HOME" rotation={-12} zIndex={1} className="left-[2%] sm:left-[5%] top-[10%]">
                <div className="flex items-center gap-1 mb-2">
                  <div className="w-4 h-4 rounded bg-[#59D98E]/20 flex items-center justify-center text-[6px]">🌱</div>
                  <span className="text-[7px] font-bold text-[#F8FAFC]">AgriLume</span>
                </div>
                <div className="p-1.5 rounded-lg bg-[#0B1220] border border-white/10 mb-1.5">
                  <div className="text-[7px] font-mono text-[#59D98E]">Good morning</div>
                  <div className="text-[8px] text-[#F8FAFC] font-semibold">Farmer</div>
                </div>
                <div className="grid grid-cols-2 gap-1">
                  {[{ icon: <CloudSun className="w-2.5 h-2.5 text-[#36BFFA]" />, label: "Weather" },
                    { icon: <Camera className="w-2.5 h-2.5 text-[#59D98E]" />, label: "Scan" },
                    { icon: <Layers className="w-2.5 h-2.5 text-[#36BFFA]" />, label: "Fields" },
                    { icon: <Lightbulb className="w-2.5 h-2.5 text-[#D7A86E]" />, label: "Advice" },
                  ].map((item) => (
                    <div key={item.label} className="p-1.5 rounded bg-white/5 border border-white/5">
                      {item.icon}
                      <div className="text-[6px] text-[#F8FAFC] mt-0.5">{item.label}</div>
                    </div>
                  ))}
                </div>
              </MiniPhone>

              {/* Phone 2: My Fields (slight left rotate) */}
              <MiniPhone title="MY FIELDS" rotation={-5} zIndex={2} className="left-[18%] sm:left-[22%] top-[4%]">
                <div className="p-1.5 rounded-lg bg-[#0B1220] border border-white/10 mb-1.5">
                  <div className="text-[7px] font-bold text-[#F8FAFC]">Rajshahi Field</div>
                  <div className="text-[6px] text-[#59D98E]">Rice • Growing</div>
                </div>
                <div className="flex-1 rounded-lg bg-gradient-to-b from-[#123024] to-[#0B1220] border border-[#59D98E]/20 flex items-center justify-center">
                  <Map className="w-8 h-8 text-[#59D98E]/30" />
                </div>
              </MiniPhone>

              {/* Phone 3: Scan Crop (center, no rotation — hero phone) */}
              <MiniPhone title="SCAN CROP" rotation={0} zIndex={4} className="left-1/2 -translate-x-1/2 top-0">
                <div className="flex-1 rounded-lg bg-gradient-to-b from-[#0B1220] to-[#050A12] border border-[#59D98E]/20 flex flex-col items-center justify-center gap-2 p-2">
                  <Camera className="w-8 h-8 text-[#59D98E]/60" />
                  <div className="text-[7px] text-center text-[#94A3B8]">Point camera at crop</div>
                  <div className="w-full p-1.5 rounded bg-[#59D98E]/10 border border-[#59D98E]/20">
                    <div className="text-[7px] font-mono text-[#59D98E] text-center">SCANNING...</div>
                  </div>
                </div>
              </MiniPhone>

              {/* Phone 4: Diagnosis Results (slight right rotate) */}
              <MiniPhone title="DIAGNOSIS RESULTS" rotation={5} zIndex={3} className="right-[18%] sm:right-[22%] top-[4%]">
                <div className="p-1.5 rounded-lg bg-[#59D98E]/10 border border-[#59D98E]/20 mb-1.5">
                  <div className="text-[7px] font-bold text-[#59D98E]">✓ Healthy Crop</div>
                  <div className="text-[6px] text-[#94A3B8]">No disease detected</div>
                </div>
                <div className="space-y-1">
                  <div className="p-1 rounded bg-white/5 text-[6px] text-[#94A3B8]">Nitrogen: Normal</div>
                  <div className="p-1 rounded bg-white/5 text-[6px] text-[#94A3B8]">Moisture: Adequate</div>
                  <div className="p-1 rounded bg-white/5 text-[6px] text-[#94A3B8]">Growth: On track</div>
                </div>
              </MiniPhone>

              {/* Phone 5: Advisory (rightmost, rotated right) */}
              <MiniPhone title="ADVISORY" rotation={12} zIndex={1} className="right-[2%] sm:right-[5%] top-[10%]">
                <div className="p-1.5 rounded-lg bg-[#D7A86E]/10 border border-[#D7A86E]/20 mb-1.5">
                  <div className="text-[7px] font-bold text-[#D7A86E]">⏳ Wait 48hrs</div>
                  <div className="text-[6px] text-[#94A3B8]">Rain expected</div>
                </div>
                <div className="p-1.5 rounded-lg bg-[#0B1220] border border-white/10">
                  <div className="text-[6px] text-[#94A3B8]">
                    Evidence: High precipitation probability provides natural germination moisture.
                  </div>
                </div>
                <div className="mt-auto p-1 rounded bg-[#59D98E]/10 text-[6px] font-mono text-[#59D98E] text-center">
                  CONFIDENCE: HIGH
                </div>
              </MiniPhone>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
