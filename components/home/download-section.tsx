"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Download, ArrowRight, Check, Feather, MapPin, Globe2, RefreshCw } from "lucide-react";
import { DOWNLOAD_CONTENT } from "@/lib/constants";
import { APP_DOWNLOAD_CONFIG } from "@/lib/downloads";
import { Reveal } from "../motion/reveal";

export function DownloadSection() {
  const [notified, setNotified] = useState(false);
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) setNotified(true);
  };

  const features = [
    { icon: <Feather className="w-4 h-4 text-[#36BFFA]" />, label: "Lightweight", desc: "Minimal storage footprint" },
    { icon: <MapPin className="w-4 h-4 text-[#59D98E]" />, label: "Field-ready", desc: "Designed for rural use" },
    { icon: <Globe2 className="w-4 h-4 text-[#D7A86E]" />, label: "Multi-language", desc: "Supports local languages" },
    { icon: <RefreshCw className="w-4 h-4 text-[#36BFFA]" />, label: "Regular updates", desc: "Improving with feedback" },
  ];

  return (
    <section
      id="download"
      className="relative w-full py-24 sm:py-32 lg:py-36 bg-[#050A12] border-t border-white/5 overflow-hidden"
      aria-labelledby="download-title"
    >
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-[#59D98E]/4 rounded-full blur-[180px] pointer-events-none" />

      <div className="max-w-[1400px] mx-auto px-6 sm:px-8 lg:px-12 relative z-10">
        
        {/* Section Index Marker */}
        <div className="flex items-center gap-2 mb-6 text-xs font-mono text-[#94A3B8]/60">
          <span className="text-[#59D98E]">06</span>
          <span>Download AgriLume</span>
          <span>•</span>
          <span>Take AgriLume to the field.</span>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          
          {/* LEFT: Download CTA */}
          <div className="lg:col-span-7 flex flex-col">
            <Reveal delay={0.1} yOffset={20}>
              <h2
                id="download-title"
                className="font-space font-bold tracking-tight text-3xl sm:text-4xl lg:text-5xl xl:text-[56px] text-[#F8FAFC] leading-[1.08]"
              >
                TAKE <span className="text-[#59D98E]">AGRILUME</span>{" "}
                TO THE FIELD.
              </h2>
            </Reveal>

            <Reveal delay={0.2} yOffset={18}>
              <p className="mt-4 text-base sm:text-lg text-[#94A3B8] font-light leading-relaxed max-w-xl">
                {DOWNLOAD_CONTENT.supporting}
              </p>
            </Reveal>

            {/* CTA Buttons */}
            <Reveal delay={0.35} yOffset={20}>
              <div className="mt-8 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                {APP_DOWNLOAD_CONFIG.apkUrl ? (
                  <a
                    href={APP_DOWNLOAD_CONFIG.apkUrl}
                    className="inline-flex items-center justify-center gap-2.5 px-8 py-4 text-sm font-semibold tracking-wider text-[#050A12] bg-[#59D98E] hover:bg-[#72e5a2] rounded-full transition-all duration-200 shadow-[0_0_24px_rgba(89,217,142,0.4)]"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download for Android</span>
                  </a>
                ) : (
                  <>
                    {notified ? (
                      <div className="flex items-center gap-2 px-6 py-3.5 rounded-full bg-[#59D98E]/10 border border-[#59D98E]/30 text-sm font-mono text-[#59D98E]">
                        <Check className="w-4 h-4" />
                        <span>You&apos;ll be notified when the APK is ready!</span>
                      </div>
                    ) : (
                      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2 max-w-md">
                        <input
                          type="email"
                          required
                          placeholder="Enter email for early access"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="flex-1 px-4 py-3.5 rounded-full bg-[#0B1220] border border-white/10 text-sm text-[#F8FAFC] placeholder-[#94A3B8]/60 focus:outline-none focus:border-[#59D98E]/50"
                        />
                        <button
                          type="submit"
                          className="px-6 py-3.5 rounded-full bg-[#59D98E] hover:bg-[#72e5a2] text-[#050A12] text-sm font-semibold tracking-wider transition-colors whitespace-nowrap shadow-[0_0_20px_rgba(89,217,142,0.3)]"
                        >
                          <Download className="w-4 h-4 inline mr-1.5" />
                          Download for Android
                        </button>
                      </form>
                    )}
                  </>
                )}

                <Link
                  href="#app"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 text-sm font-medium text-[#F8FAFC] hover:text-[#59D98E] bg-[#0B1220]/80 border border-white/15 hover:border-[#59D98E]/40 rounded-full transition-all duration-300"
                >
                  <span>View App Experience</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </Reveal>

            {/* Feature badges row — matching blueprint */}
            <Reveal delay={0.5} yOffset={16}>
              <div className="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-4">
                {features.map((f) => (
                  <div key={f.label} className="flex items-center gap-2.5 p-3 rounded-xl bg-[#0B1220]/60 border border-white/5">
                    {f.icon}
                    <div>
                      <div className="text-xs font-semibold text-[#F8FAFC]">{f.label}</div>
                      <div className="text-[9px] text-[#94A3B8]">{f.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>

          {/* RIGHT: QR Code Card */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center">
            <Reveal delay={0.3} yOffset={20}>
              <div className="p-7 rounded-2xl bg-[#0B1220] border border-white/10 flex flex-col items-center text-center shadow-xl max-w-[320px] mx-auto">
                {/* QR Code */}
                <div className="relative p-4 rounded-xl bg-white flex items-center justify-center">
                  <svg
                    viewBox="0 0 100 100"
                    className="w-40 h-40 sm:w-48 sm:h-48 text-[#050A12]"
                    fill="currentColor"
                  >
                    {/* Position markers */}
                    <rect x="5" y="5" width="25" height="25" rx="3" fill="#050A12" />
                    <rect x="10" y="10" width="15" height="15" rx="2" fill="white" />
                    <rect x="13" y="13" width="9" height="9" rx="1" fill="#050A12" />
                    
                    <rect x="70" y="5" width="25" height="25" rx="3" fill="#050A12" />
                    <rect x="75" y="10" width="15" height="15" rx="2" fill="white" />
                    <rect x="78" y="13" width="9" height="9" rx="1" fill="#050A12" />
                    
                    <rect x="5" y="70" width="25" height="25" rx="3" fill="#050A12" />
                    <rect x="10" y="75" width="15" height="15" rx="2" fill="white" />
                    <rect x="13" y="78" width="9" height="9" rx="1" fill="#050A12" />
                    
                    {/* Data matrix */}
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
                    <rect x="45" y="45" width="10" height="10" rx="2" fill="#59D98E" />
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
                    Scan to Download
                  </span>
                  <span className="text-[10px] font-mono text-[#94A3B8] mt-0.5">
                    Android APK
                  </span>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
