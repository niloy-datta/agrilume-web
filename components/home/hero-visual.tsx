"use client";

import React, { useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform, useReducedMotion } from "framer-motion";

export function HeroVisual() {
  const containerRef = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();

  // Desktop mouse parallax coordinates
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth spring dampening for luxurious, heavy physics
  const springX = useSpring(mouseX, { stiffness: 45, damping: 20 });
  const springY = useSpring(mouseY, { stiffness: 45, damping: 20 });

  // Parallax layers (different depths)
  const starsTranslateX = useTransform(springX, [-1, 1], [-8, 8]);
  const starsTranslateY = useTransform(springY, [-1, 1], [-8, 8]);
  const globeTranslateX = useTransform(springX, [-1, 1], [-12, 12]);
  const globeTranslateY = useTransform(springY, [-1, 1], [-12, 12]);
  const orbitTranslateX = useTransform(springX, [-1, 1], [-18, 18]);
  const orbitTranslateY = useTransform(springY, [-1, 1], [-18, 18]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (shouldReduceMotion || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const y = ((e.clientY - rect.top) / rect.height) * 2 - 1;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative w-full h-[380px] sm:h-[480px] md:h-[580px] lg:h-[680px] flex items-center justify-center lg:justify-end select-none pointer-events-auto"
      aria-hidden="true"
    >
      {/* 1. Deep Space Starfield & Subtle Cosmic Noise */}
      <motion.div
        style={{
          x: shouldReduceMotion ? 0 : starsTranslateX,
          y: shouldReduceMotion ? 0 : starsTranslateY,
        }}
        className="absolute inset-0 pointer-events-none"
      >
        <svg className="w-full h-full opacity-40" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <radialGradient id="starGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#36BFFA" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#36BFFA" stopOpacity="0" />
            </radialGradient>
          </defs>
          {/* Subtle celestial telemetry points */}
          <circle cx="15%" cy="22%" r="1" fill="#F8FAFC" opacity="0.6" />
          <circle cx="38%" cy="14%" r="1.5" fill="#36BFFA" opacity="0.8" />
          <circle cx="75%" cy="18%" r="1" fill="#F8FAFC" opacity="0.4" />
          <circle cx="88%" cy="35%" r="1.2" fill="#59D98E" opacity="0.5" />
          <circle cx="92%" cy="65%" r="1" fill="#F8FAFC" opacity="0.7" />
          <circle cx="28%" cy="78%" r="1.5" fill="#F8FAFC" opacity="0.5" />
          <circle cx="65%" cy="85%" r="1.2" fill="#36BFFA" opacity="0.6" />
          <circle cx="12%" cy="60%" r="1" fill="#D7A86E" opacity="0.4" />
          <circle cx="50%" cy="40%" r="1" fill="#F8FAFC" opacity="0.3" />
        </svg>
      </motion.div>

      {/* 2. Earth Atmospheric Form Container */}
      <motion.div
        style={{
          x: shouldReduceMotion ? 0 : globeTranslateX,
          y: shouldReduceMotion ? 0 : globeTranslateY,
        }}
        initial={{ opacity: 0, scale: 0.94 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
        className="relative w-[340px] h-[340px] sm:w-[440px] sm:h-[440px] md:w-[540px] md:h-[540px] lg:w-[640px] lg:h-[640px] xl:w-[700px] xl:h-[700px] lg:mr-[-10%] xl:mr-[-8%]"
      >
        {/* Outer Atmospheric Cyan Glow Corona */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-[#36BFFA]/0 via-[#36BFFA]/10 to-[#36BFFA]/25 blur-3xl transform scale-110 pointer-events-none" />

        {/* Outer Secondary Agri-Green Biosphere Glow */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-bl from-[#59D98E]/0 via-[#59D98E]/5 to-[#59D98E]/15 blur-2xl transform scale-105 pointer-events-none" />

        {/* Main Vector Planetary Sphere System */}
        <svg
          viewBox="0 0 600 600"
          className="w-full h-full drop-shadow-[0_20px_50px_rgba(5,10,18,0.9)]"
        >
          <defs>
            {/* Dark Space Terminator Gradient */}
            <radialGradient id="globeDarkTerminator" cx="35%" cy="30%" r="65%">
              <stop offset="0%" stopColor="#0E1E36" />
              <stop offset="35%" stopColor="#0B1526" />
              <stop offset="70%" stopColor="#070E1A" />
              <stop offset="100%" stopColor="#050A12" />
            </radialGradient>

            {/* Cyan Atmospheric Horizon Rim Gradient */}
            <linearGradient id="atmosphericRim" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#70D4FF" stopOpacity="0.9" />
              <stop offset="25%" stopColor="#36BFFA" stopOpacity="0.75" />
              <stop offset="60%" stopColor="#1E659E" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#050A12" stopOpacity="0" />
            </linearGradient>

            {/* Biosphere / Land vegetation subtle NDVI gradient */}
            <linearGradient id="agriVegetationGrad" x1="20%" y1="20%" x2="80%" y2="80%">
              <stop offset="0%" stopColor="#59D98E" stopOpacity="0.45" />
              <stop offset="50%" stopColor="#2BA366" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#144B30" stopOpacity="0" />
            </linearGradient>

            {/* Warm soil / arid boundary tint */}
            <linearGradient id="warmEarthGrad" x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#D7A86E" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#8C6538" stopOpacity="0" />
            </linearGradient>

            {/* Mask to clip features to the planetary sphere */}
            <clipPath id="earthSphereClip">
              <circle cx="300" cy="300" r="280" />
            </clipPath>

            {/* Atmospheric Rim Filter for organic scatter */}
            <filter id="limbGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="8" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Base Globe Body */}
          <circle
            cx="300"
            cy="300"
            r="280"
            fill="url(#globeDarkTerminator)"
            stroke="url(#atmosphericRim)"
            strokeWidth="2.5"
            filter="url(#limbGlow)"
          />

          {/* Elements clipped within planetary sphere */}
          <g clipPath="url(#earthSphereClip)">
            {/* Atmospheric limb shading (inner edge glow) */}
            <circle
              cx="300"
              cy="300"
              r="279"
              fill="none"
              stroke="#36BFFA"
              strokeWidth="4"
              opacity="0.6"
            />
            <circle
              cx="300"
              cy="300"
              r="276"
              fill="none"
              stroke="#70D4FF"
              strokeWidth="1.5"
              opacity="0.8"
            />

            {/* Rotating planetary coordinates grid (subtle latitude & meridian arcs) */}
            <motion.g
              animate={
                shouldReduceMotion
                  ? {}
                  : {
                      rotate: [0, 360],
                    }
              }
              transition={{
                duration: 240,
                repeat: Infinity,
                ease: "linear",
              }}
              style={{ transformOrigin: "300px 300px" }}
              opacity="0.16"
            >
              {/* Latitude parallels */}
              <ellipse cx="300" cy="180" rx="230" ry="60" fill="none" stroke="#36BFFA" strokeWidth="0.8" strokeDasharray="3 6" />
              <ellipse cx="300" cy="240" rx="270" ry="70" fill="none" stroke="#36BFFA" strokeWidth="1" strokeDasharray="4 8" />
              <ellipse cx="300" cy="300" rx="280" ry="75" fill="none" stroke="#36BFFA" strokeWidth="1.2" />
              <ellipse cx="300" cy="360" rx="270" ry="70" fill="none" stroke="#36BFFA" strokeWidth="1" strokeDasharray="4 8" />
              <ellipse cx="300" cy="420" rx="230" ry="60" fill="none" stroke="#36BFFA" strokeWidth="0.8" strokeDasharray="3 6" />

              {/* Meridian lines */}
              <ellipse cx="300" cy="300" rx="90" ry="280" fill="none" stroke="#36BFFA" strokeWidth="0.8" strokeDasharray="2 6" />
              <ellipse cx="300" cy="300" rx="190" ry="280" fill="none" stroke="#36BFFA" strokeWidth="0.8" strokeDasharray="3 7" />
              <line x1="300" y1="20" x2="300" y2="580" stroke="#36BFFA" strokeWidth="1" strokeDasharray="2 4" />
            </motion.g>

            {/* Continental landmass & scientific elevation/NDVI corridors */}
            <g opacity="0.85">
              {/* North agricultural belt / Eurasian continental curve */}
              <path
                d="M 120,210 Q 180,180 250,195 T 380,170 T 470,210 Q 420,260 360,240 T 260,250 T 170,270 Z"
                fill="url(#agriVegetationGrad)"
              />
              {/* Soil / basin elevation contours */}
              <path
                d="M 190,260 Q 240,240 290,260 T 360,285 T 410,270 Q 370,330 310,320 T 220,310 Z"
                fill="url(#warmEarthGrad)"
              />
              {/* Southern agricultural fertile valley */}
              <path
                d="M 230,330 Q 290,320 330,345 T 390,380 T 420,440 Q 350,470 300,430 T 240,380 Z"
                fill="url(#agriVegetationGrad)"
                opacity="0.7"
              />

              {/* Topographic elevation contour lines for scientific precision look */}
              <path
                d="M 140,205 C 190,175 260,190 320,180 S 410,165 460,205"
                fill="none"
                stroke="#59D98E"
                strokeWidth="0.75"
                opacity="0.35"
              />
              <path
                d="M 160,225 C 210,195 270,208 340,198 S 420,190 450,225"
                fill="none"
                stroke="#59D98E"
                strokeWidth="0.75"
                opacity="0.45"
              />
              <path
                d="M 200,280 C 250,260 300,280 350,295"
                fill="none"
                stroke="#D7A86E"
                strokeWidth="0.75"
                opacity="0.4"
              />
            </g>

            {/* Earth Night Side / Deep Shadow Crescent overlay for 3D realism */}
            <path
              d="M 300,20 A 280,280 0 0,1 580,300 A 280,280 0 0,1 300,580 Q 420,440 430,300 Q 420,160 300,20 Z"
              fill="#050A12"
              opacity="0.82"
            />
            {/* Soft terminator feather blend */}
            <path
              d="M 290,20 A 280,280 0 0,1 580,300 A 280,280 0 0,1 290,580 Q 410,440 420,300 Q 410,160 290,20 Z"
              fill="#050A12"
              opacity="0.45"
            />

            {/* ACTIVE GROUND TARGET: Field beacon with concentric pulse */}
            <g transform="translate(265, 235)">
              {/* Outer pulsing ring */}
              <circle cx="0" cy="0" r="16" fill="none" stroke="#59D98E" strokeWidth="1" className="animate-beacon-pulse" />
              {/* Secondary radar ring */}
              <circle cx="0" cy="0" r="8" fill="none" stroke="#59D98E" strokeWidth="1.2" opacity="0.6" />
              {/* Center target dot */}
              <circle cx="0" cy="0" r="3" fill="#59D98E" className="drop-shadow-[0_0_8px_#59D98E]" />
              {/* High precision crosshair */}
              <line x1="-10" y1="0" x2="-5" y2="0" stroke="#59D98E" strokeWidth="1" opacity="0.8" />
              <line x1="5" y1="0" x2="10" y2="0" stroke="#59D98E" strokeWidth="1" opacity="0.8" />
              <line x1="0" y1="-10" x2="0" y2="-5" stroke="#59D98E" strokeWidth="1" opacity="0.8" />
              <line x1="0" y1="5" x2="0" y2="10" stroke="#59D98E" strokeWidth="1" opacity="0.8" />
            </g>
          </g>

          {/* 3. Tilted Elliptical Orbital Path */}
          <g>
            {/* Faint orbit trace */}
            <ellipse
              cx="290"
              cy="310"
              rx="330"
              ry="115"
              fill="none"
              stroke="#36BFFA"
              strokeWidth="1.2"
              strokeDasharray="4 8"
              opacity="0.32"
              transform="rotate(-26 290 310)"
            />

            {/* Glowing active orbital arc section */}
            <ellipse
              cx="290"
              cy="310"
              rx="330"
              ry="115"
              fill="none"
              stroke="url(#atmosphericRim)"
              strokeWidth="1.8"
              strokeDasharray="140 600"
              opacity="0.85"
              transform="rotate(-26 290 310)"
            />
          </g>
        </svg>

        {/* 4. Satellite Telemetry Marker traveling in orbit */}
        <motion.div
          style={{
            x: shouldReduceMotion ? 0 : orbitTranslateX,
            y: shouldReduceMotion ? 0 : orbitTranslateY,
          }}
          className="absolute inset-0 pointer-events-none"
        >
          {/* Scientific Satellite Position on Orbit */}
          <motion.div
            animate={
              shouldReduceMotion
                ? { x: "24%", y: "20%" }
                : {
                    x: ["18%", "26%", "38%", "26%", "18%"],
                    y: ["24%", "18%", "22%", "28%", "24%"],
                  }
            }
            transition={{
              duration: 32,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute top-0 left-0 flex items-center gap-2 pointer-events-auto group cursor-crosshair"
          >
            {/* Satellite node graphic */}
            <div className="relative flex items-center justify-center">
              <span className="w-2.5 h-2.5 rounded-full bg-[#36BFFA] shadow-[0_0_12px_#36BFFA]" />
              <span className="absolute w-5 h-5 rounded-full border border-[#36BFFA]/40 animate-ping" />
              {/* Solar array wings */}
              <div className="absolute -left-3 w-2.5 h-1 bg-[#36BFFA]/70 rounded-xs" />
              <div className="absolute -right-3 w-2.5 h-1 bg-[#36BFFA]/70 rounded-xs" />
            </div>

            {/* Satellite / Earth Observation Context Tag */}
            <div className="hidden sm:flex flex-col bg-[#050A12]/80 backdrop-blur-md px-2.5 py-1 rounded border border-[#36BFFA]/30 text-[10px] font-mono leading-tight">
              <span className="text-[#36BFFA] font-medium flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#59D98E]" />
                EARTH OBSERVATION LAYER
              </span>
              <span className="text-[#94A3B8] text-[9px]">ORBITAL + CLIMATE CONTEXT</span>
            </div>
          </motion.div>

          {/* Demonstration Field Context Card (Anchored to ground target beacon) */}
          <div className="absolute top-[38%] left-[26%] sm:top-[38%] sm:left-[30%] pointer-events-auto">
            <div className="relative">
              {/* Connecting pointer line */}
              <div className="w-8 sm:w-12 h-px bg-gradient-to-r from-[#59D98E] to-[#59D98E]/20" />
              <div className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-[#59D98E]/80" />

              {/* Minimal Field Context Tag (Explicitly non-live demonstration) */}
              <div className="ml-8 sm:ml-12 -mt-4 bg-[#0B1220]/90 backdrop-blur-md px-3 py-2 rounded-lg border border-[#59D98E]/25 shadow-[0_8px_24px_rgba(0,0,0,0.6)]">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#59D98E] animate-pulse" />
                    <span className="text-[10px] font-mono font-semibold uppercase tracking-wider text-[#59D98E]">
                      FIELD CONTEXT
                    </span>
                  </div>
                  <span className="text-[8px] font-mono uppercase px-1.5 py-0.2 rounded bg-white/5 text-[#94A3B8] border border-white/10">
                    DEMO PREVIEW
                  </span>
                </div>
                <div className="mt-1.5 flex flex-col font-mono text-[9px] text-[#94A3B8] space-y-0.5">
                  <span className="text-white/90 font-medium">RAJSHAHI • BANGLADESH</span>
                  <span className="text-[#36BFFA]/90">EARTH DATA CONTEXT</span>
                  <span className="text-[#94A3B8]/70">MISSION CONCEPT MODEL</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
