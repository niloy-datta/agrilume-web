import { Navbar } from "@/components/layout/navbar";
import { HeroSection } from "@/components/home/hero-section";
import { ScrollTransitionSection } from "@/components/home/scroll-transition-section";
import { FarmerProblemSection } from "@/components/home/farmer-problem-section";
import { FieldComparisonSection } from "@/components/home/field-comparison-section";
import { HowItWorksSection } from "@/components/home/how-it-works-section";
import { AppShowcaseSection } from "@/components/home/app-showcase-section";
import { DownloadSection } from "@/components/home/download-section";
import { ScienceTrustSection } from "@/components/home/science-trust-section";
import { TeamSection } from "@/components/home/team-section";

export default function Home() {
  return (
    <div className="relative min-h-screen bg-[#050A12] text-[#F8FAFC] flex flex-col selection:bg-[#36BFFA]/20 selection:text-[#36BFFA]">
      {/* 1. Global Navigation */}
      <Navbar />

      {/* 2. Main Landmark */}
      <main className="flex-1 w-full flex flex-col">
        {/* Full-Screen Cinematic 3D Hero */}
        <HeroSection />

        {/* Scroll Transition into Human Problem */}
        <ScrollTransitionSection />

        {/* Human Problem: The Decision on the Ground */}
        <FarmerProblemSection />

        {/* Same Field. More Context: Interactive Split Comparison */}
        <FieldComparisonSection />

        {/* How AgriLume Works: 4-Step Pipeline Journey */}
        <HowItWorksSection />

        {/* Mobile App Showcase: Interactive Phone Mockup */}
        <AppShowcaseSection />

        {/* Download AgriLume: Android APK Preview + Notification Form */}
        <DownloadSection />

        {/* Science / Trust: Evidence Before Advice */}
        <ScienceTrustSection />

        {/* Small Team / Project Context: Built by the AgriLume Team */}
        <TeamSection />
      </main>

      {/* 3. Minimal Product Footer */}
      <footer className="w-full bg-[#050A12] border-t border-white/5 py-10 text-xs font-mono text-[#94A3B8]/60">
        <div className="max-w-[1400px] mx-auto px-6 sm:px-8 lg:px-12 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <span className="font-semibold tracking-wider text-slate-300">AGRILUME</span>
            <span className="hidden sm:inline text-white/20">•</span>
            <span>NASA SPACE APPS CHALLENGE 2026 PREPARATION</span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 text-[11px]">
            <span>SPACE → EARTH → FIELD → ACTION</span>
            <span className="hidden sm:inline text-white/20">•</span>
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#59D98E]" />
              <span>CONCEPTUAL PRODUCT SPECIFICATION</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
