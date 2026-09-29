"use client";

import React, { useState } from "react";
import { Download, Check, Smartphone, Info } from "lucide-react";
import { DOWNLOAD_CONTENT } from "@/lib/constants";
import { APP_DOWNLOAD_CONFIG } from "@/lib/downloads";
import { Reveal } from "../motion/reveal";

export function DownloadSection() {
  const [notified, setNotified] = useState(false);
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setNotified(true);
    }
  };

  return (
    <section
      id="download"
      className="relative w-full py-24 sm:py-32 lg:py-36 bg-[#050A12] border-t border-white/5 overflow-hidden"
      aria-labelledby="download-title"
    >
      {/* Background ambient lighting */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-[#36BFFA]/4 rounded-full blur-[180px] pointer-events-none" />

      <div className="max-w-[1400px] mx-auto px-6 sm:px-8 lg:px-12 relative z-10">
        
        {/* Section Index Marker */}
        <div className="flex items-center gap-2 mb-4 text-xs font-mono text-[#94A3B8]/60">
          <span className="text-[#59D98E]">06</span>
          <span>Download AgriLume</span>
          <span>•</span>
          <span>Take AgriLume to the field.</span>
        </div>

        {/* Main Download Card Box */}
        <div className="p-8 sm:p-12 lg:p-16 rounded-3xl bg-gradient-to-b from-[#0B1220] via-[#0D1829] to-[#0B1220] border border-white/10 shadow-[0_24px_64px_rgba(0,0,0,0.8)] relative overflow-hidden">
          
          {/* Subtle top border illumination */}
          <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[#59D98E]/40 to-transparent" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            
            {/* LEFT: Download Details & Call to Action (Columns 1-7) */}
            <div className="lg:col-span-7 flex flex-col">
              <Reveal delay={0.1} yOffset={16}>
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#050A12] border border-[#59D98E]/25 mb-6 self-start">
                  <Download className="w-3.5 h-3.5 text-[#59D98E]" />
                  <span className="text-[11px] font-mono tracking-[0.18em] text-[#59D98E] uppercase">
                    MOBILE DOWNLOAD
                  </span>
                </div>
              </Reveal>

              <Reveal delay={0.2} yOffset={20}>
                <h2
                  id="download-title"
                  className="font-space font-bold tracking-tight text-3xl sm:text-4xl lg:text-5xl text-[#F8FAFC] leading-[1.08]"
                >
                  TAKE <span className="text-[#59D98E]">AGRILUME</span> TO THE FIELD.
                </h2>
              </Reveal>

              <Reveal delay={0.32} yOffset={18}>
                <p className="mt-4 text-base sm:text-lg text-[#94A3B8] font-light leading-relaxed max-w-xl">
                  {DOWNLOAD_CONTENT.supporting}
                </p>
              </Reveal>

              {/* Technical Download Specs Banner */}
              <Reveal delay={0.42} yOffset={16}>
                <div className="mt-6 flex flex-wrap gap-4 text-xs font-mono text-[#94A3B8]">
                  <div className="flex items-center gap-1.5 bg-[#050A12]/80 px-3 py-1.5 rounded-lg border border-white/5">
                    <Smartphone className="w-3.5 h-3.5 text-[#36BFFA]" />
                    <span>{APP_DOWNLOAD_CONFIG.platform}</span>
                  </div>
                  <div className="flex items-center gap-1.5 bg-[#050A12]/80 px-3 py-1.5 rounded-lg border border-white/5">
                    <span>Target: {APP_DOWNLOAD_CONFIG.minAndroidVersion}</span>
                  </div>
                  <div className="flex items-center gap-1.5 bg-[#050A12]/80 px-3 py-1.5 rounded-lg border border-white/5">
                    <span>Size: {APP_DOWNLOAD_CONFIG.fileSize}</span>
                  </div>
                </div>
              </Reveal>

              {/* Action Buttons / Release Notification Form */}
              <Reveal delay={0.52} yOffset={20}>
                <div className="mt-8 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                  {APP_DOWNLOAD_CONFIG.apkUrl ? (
                    <a
                      href={APP_DOWNLOAD_CONFIG.apkUrl}
                      className="inline-flex items-center justify-center gap-2.5 px-8 py-4 text-sm font-semibold tracking-wider uppercase text-[#050A12] bg-[#36BFFA] hover:bg-[#70D4FF] rounded-full transition-all duration-200 glow-cyan-button"
                    >
                      <Download className="w-4 h-4" />
                      <span>Download Android APK</span>
                    </a>
                  ) : (
                    <div className="flex flex-col sm:flex-row items-stretch gap-3 w-full max-w-md">
                      {notified ? (
                        <div className="flex items-center gap-2 px-5 py-3 rounded-full bg-[#59D98E]/10 border border-[#59D98E]/30 text-xs font-mono text-[#59D98E]">
                          <Check className="w-4 h-4" />
                          <span>You will be notified as soon as the APK is released!</span>
                        </div>
                      ) : (
                        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2 w-full">
                          <input
                            type="email"
                            required
                            placeholder="Enter email for preview build APK"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="flex-1 px-4 py-3 rounded-full bg-[#050A12] border border-white/10 text-xs text-[#F8FAFC] placeholder-[#94A3B8]/60 focus:outline-none focus:border-[#36BFFA]"
                          />
                          <button
                            type="submit"
                            className="px-6 py-3 rounded-full bg-[#36BFFA] hover:bg-[#70D4FF] text-[#050A12] text-xs font-semibold uppercase tracking-wider transition-colors glow-cyan-button whitespace-nowrap"
                          >
                            Notify Me
                          </button>
                        </form>
                      )}
                    </div>
                  )}
                </div>

                <div className="mt-4 flex items-center gap-2 text-xs font-mono text-[#94A3B8]/70">
                  <Info className="w-3.5 h-3.5 text-[#D7A86E]" />
                  <span>Phase 2 Preview • Direct APK delivery for testing devices</span>
                </div>
              </Reveal>
            </div>

            {/* RIGHT: High-Precision QR Code Card for Mobile Sideloading (Columns 8-12) */}
            <div className="lg:col-span-5 flex flex-col items-center justify-center">
              <div className="p-6 sm:p-7 rounded-2xl bg-[#050A12] border border-white/10 flex flex-col items-center text-center shadow-xl">
                
                {/* Procedural Vector QR Code Mockup */}
                <div className="relative p-4 rounded-xl bg-white flex items-center justify-center">
                  <svg
                    viewBox="0 0 100 100"
                    className="w-36 h-36 sm:w-44 sm:h-44 text-[#050A12]"
                    fill="currentColor"
                  >
                    {/* Top-left position marker */}
                    <rect x="5" y="5" width="25" height="25" rx="3" fill="#050A12" />
                    <rect x="10" y="10" width="15" height="15" rx="2" fill="white" />
                    <rect x="13" y="13" width="9" height="9" rx="1" fill="#050A12" />

                    {/* Top-right position marker */}
                    <rect x="70" y="5" width="25" height="25" rx="3" fill="#050A12" />
                    <rect x="75" y="10" width="15" height="15" rx="2" fill="white" />
                    <rect x="78" y="13" width="9" height="9" rx="1" fill="#050A12" />

                    {/* Bottom-left position marker */}
                    <rect x="5" y="70" width="25" height="25" rx="3" fill="#050A12" />
                    <rect x="10" y="75" width="15" height="15" rx="2" fill="white" />
                    <rect x="13" y="78" width="9" height="9" rx="1" fill="#050A12" />

                    {/* High-density procedural data matrix dots */}
                    <rect x="35" y="10" width="6" height="6" />
                    <rect x="45" y="10" width="6" height="6" />
                    <rect x="55" y="10" width="6" height="6" />
                    <rect x="35" y="25" width="6" height="6" />
                    <rect x="45" y="20" width="6" height="6" />
                    <rect x="55" y="25" width="6" height="6" />

                    <rect x="10" y="35" width="6" height="6" />
                    <rect x="25" y="35" width="6" height="6" />
                    <rect x="40" y="35" width="6" height="6" />
                    <rect x="50" y="35" width="6" height="6" />
                    <rect x="65" y="35" width="6" height="6" />
                    <rect x="80" y="35" width="6" height="6" />

                    <rect x="10" y="50" width="6" height="6" />
                    <rect x="25" y="50" width="6" height="6" />
                    <rect x="35" y="50" width="6" height="6" />
                    <rect x="45" y="45" width="10" height="10" rx="2" fill="#36BFFA" />
                    <rect x="60" y="50" width="6" height="6" />
                    <rect x="75" y="50" width="6" height="6" />
                    <rect x="85" y="50" width="6" height="6" />

                    <rect x="35" y="65" width="6" height="6" />
                    <rect x="50" y="65" width="6" height="6" />
                    <rect x="65" y="65" width="6" height="6" />
                    <rect x="80" y="65" width="6" height="6" />

                    <rect x="35" y="80" width="6" height="6" />
                    <rect x="50" y="80" width="6" height="6" />
                    <rect x="65" y="80" width="6" height="6" />
                    <rect x="80" y="80" width="6" height="6" />
                  </svg>
                </div>

                <div className="mt-4 flex flex-col">
                  <span className="text-xs font-mono font-semibold tracking-wider text-[#F8FAFC]">
                    {DOWNLOAD_CONTENT.qrLabel}
                  </span>
                  <span className="text-[10px] font-mono text-[#94A3B8] mt-0.5">
                    Direct installation bundle for Android devices
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
