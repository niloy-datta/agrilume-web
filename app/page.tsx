import Link from "next/link";
import { Navbar } from "@/components/layout/navbar";
import { HeroSection } from "@/components/home/hero-section";
import { ScrollTransitionSection } from "@/components/home/scroll-transition-section";
import { FarmerProblemSection } from "@/components/home/farmer-problem-section";
import { FieldComparisonSection } from "@/components/home/field-comparison-section";
import { HowItWorksSection } from "@/components/home/how-it-works-section";
import { AppShowcaseSection } from "@/components/home/app-showcase-section";
import { DownloadSection } from "@/components/home/download-section";
import { ScienceTrustSection } from "@/components/home/science-trust-section";
import { ImpactSection } from "@/components/home/impact-section";
import { TeamSection } from "@/components/home/team-section";

export default function Home() {
  return (
    <div className="relative min-h-screen bg-[#050A12] text-[#F8FAFC] flex flex-col selection:bg-[#59D98E]/20 selection:text-[#59D98E]">
      {/* 1. Global Navigation */}
      <Navbar />

      {/* 2. Main Landmark */}
      <main className="flex-1 w-full flex flex-col">
        {/* 01: Full-Screen Cinematic Hero */}
        <HeroSection />

        {/* Scroll Transition into Human Problem */}
        <ScrollTransitionSection />

        {/* 02: Human Problem: The Decision on the Ground */}
        <FarmerProblemSection />

        {/* 03: Same Field. More Context: Interactive Split Comparison */}
        <FieldComparisonSection />

        {/* 04: How AgriLume Works: 4-Step Pipeline Journey */}
        <HowItWorksSection />

        {/* 05: Mobile App Showcase: Interactive Phone Mockup */}
        <AppShowcaseSection />

        {/* 06: Download AgriLume: Android APK Preview + Notification Form */}
        <DownloadSection />

        {/* 07: Science / Trust: Evidence Before Advice */}
        <ScienceTrustSection />

        {/* 08: Real-World Potential: Stronger Decisions. Brighter Tomorrows */}
        <ImpactSection />

        {/* 09: Project Context: Built by a Passionate Team */}
        <TeamSection />
      </main>

      {/* 3. Section 09: Clean Editorial Footer */}
      <footer className="w-full bg-[#050A12] border-t border-white/10 py-12 text-xs font-mono text-[#94A3B8]">
        <div className="max-w-[1400px] mx-auto px-6 sm:px-8 lg:px-12 flex flex-col gap-8">
          
          {/* Section Index Marker */}
          <div className="flex items-center gap-2 text-xs font-mono text-[#94A3B8]/60">
            <span className="text-[#59D98E]">10</span>
            <span>Footer</span>
            <span>•</span>
            <span>Simple and clean</span>
          </div>

          <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-6 border-b border-white/5">
            {/* Brand */}
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-lg bg-[#0B1220] border border-[#59D98E]/30 flex items-center justify-center text-sm shadow-[0_0_12px_rgba(89,217,142,0.2)]">
                🌱
              </div>
              <div className="flex flex-col">
                <span className="font-space font-bold tracking-tight text-base text-[#F8FAFC]">
                  AgriLume
                </span>
                <span className="text-[10px] text-[#94A3B8]/70">
                  Earth intelligence for agriculture.
                </span>
              </div>
            </div>

            {/* Nav Links */}
            <div className="flex items-center gap-6 sm:gap-8 text-xs font-medium text-[#94A3B8]">
              <Link href="#mission" className="hover:text-white transition-colors">Mission</Link>
              <Link href="#how-it-works" className="hover:text-white transition-colors">How It Works</Link>
              <Link href="#science" className="hover:text-white transition-colors">Science</Link>
              <Link href="#app" className="hover:text-white transition-colors">App</Link>
            </div>

            {/* Social Icons */}
            <div className="flex items-center gap-4 text-[#94A3B8]">
              <a
                href="https://github.com/niloy-datta/agrilume-web"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center hover:text-white hover:border-white/30 transition-colors"
                aria-label="GitHub Repository"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                </svg>
              </a>
              <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center hover:text-white transition-colors cursor-pointer">
                in
              </div>
              <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center hover:text-white transition-colors cursor-pointer">
                ▶
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-[#94A3B8]/60">
            <div>
              © 2026 AgriLume. All rights reserved. • NASA Space Apps Challenge 2026
            </div>
            <div className="text-[#59D98E]">
              Made for a more resilient food future.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
