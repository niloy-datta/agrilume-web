import { Navbar } from "@/components/layout/navbar";
import { HeroSection } from "@/components/home/hero-section";
import { ScrollTransitionSection } from "@/components/home/scroll-transition-section";
import { FarmerProblemSection } from "@/components/home/farmer-problem-section";
import { FieldComparisonSection } from "@/components/home/field-comparison-section";

export default function Home() {
  return (
    <div className="relative min-h-screen bg-[#050A12] text-[#F8FAFC] flex flex-col selection:bg-[#36BFFA]/20 selection:text-[#36BFFA]">
      {/* 1. Global Navigation */}
      <Navbar />

      {/* 2. Main Landmark */}
      <main className="flex-1 w-full flex flex-col">
        {/* Full-Screen Cinematic Hero */}
        <HeroSection />

        {/* Scroll Transition into Next Phase */}
        <ScrollTransitionSection />

        {/* Phase 2: The Decision on the Ground (Human Problem) */}
        <FarmerProblemSection />

        {/* Phase 2: What the Farmer Sees vs What AgriLume Sees (Interactive Split-Screen) */}
        <FieldComparisonSection />
      </main>

      {/* 3. Minimal Mission Footer / Status Bar */}
      <footer className="w-full bg-[#050A12] border-t border-white/5 py-8 text-center text-xs font-mono text-[#94A3B8]/60">
        <div className="max-w-[1400px] mx-auto px-6 sm:px-8 lg:px-12 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span>AGRILUME • NASA SPACE APPS CHALLENGE 2026</span>
          </div>
          <div className="flex items-center gap-6">
            <span>EARTH INTELLIGENCE PLATFORM</span>
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#59D98E]" />
              <span>DECISION STORYTELLING • PHASE 2</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
