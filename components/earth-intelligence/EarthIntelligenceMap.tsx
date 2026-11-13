"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import {
  Globe,
  Layers,
  MapPin,
  Calendar,
  Compass,
  Search,
  Droplets,
  Sun,
  Sprout,
  Waves,
  ShieldCheck,
  TrendingUp,
  AlertTriangle,
  ArrowRight,
  Info,
  Maximize2,
} from "lucide-react";
import { DISTRICTS, getDistrict } from "@/lib/timetravel/locations";
import type { Lang } from "@/lib/timetravel/types";
import { tt } from "@/components/timetravel/ui/primitives";
import { KindBadge } from "@/components/timetravel/ui/primitives";
import { loadDistrictEarthIntelligence, type UnifiedDistrictIntelligence } from "@/lib/earth-intelligence/pipeline";

type ActiveLayer = "ndvi" | "rainfall" | "temperature" | "soil-moisture" | "surface-water" | "cmip6";

// Geographical bounding box of Bangladesh
const BD_BOUNDS = {
  minLat: 20.6,
  maxLat: 26.65,
  minLon: 88.0,
  maxLon: 92.7,
};

function projectGeo(lat: number, lon: number, width = 600, height = 750) {
  const x = ((lon - BD_BOUNDS.minLon) / (BD_BOUNDS.maxLon - BD_BOUNDS.minLon)) * (width - 60) + 30;
  const y = height - (((lat - BD_BOUNDS.minLat) / (BD_BOUNDS.maxLat - BD_BOUNDS.minLat)) * (height - 60) + 30);
  return { x, y };
}

export function EarthIntelligenceMap() {
  const [lang, setLang] = useState<Lang>("en");
  const [selectedDistrictId, setSelectedDistrictId] = useState<string>("rajshahi");
  const [activeLayer, setActiveLayer] = useState<ActiveLayer>("ndvi");
  const [selectedMonth, setSelectedMonth] = useState<number>(3); // 1..12 (default March, peak Boro season)
  const [searchQuery, setSearchQuery] = useState("");
  const [compareMode, setCompareMode] = useState<boolean>(false);
  const [compareMonth, setCompareMonth] = useState<number>(8); // August (monsoon peak)
  const [intel, setIntel] = useState<UnifiedDistrictIntelligence | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [customCoord, setCustomCoord] = useState<{ lat: number; lon: number } | null>(null);

  // Load district intelligence data
  useEffect(() => {
    let cancelled = false;
    Promise.resolve().then(() => {
      if (!cancelled) setLoading(true);
    });
    loadDistrictEarthIntelligence(selectedDistrictId)
      .then((data) => {
        if (!cancelled && data) {
          setIntel(data);
          setLoading(false);
        }
      })
      .catch(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [selectedDistrictId]);

  // Filter districts based on search
  const filteredDistricts = useMemo(() => {
    if (!searchQuery.trim()) return DISTRICTS;
    const q = searchQuery.toLowerCase();
    return DISTRICTS.filter(
      (d) => d.nameEn.toLowerCase().includes(q) || d.nameBn.includes(q) || d.division.toLowerCase().includes(q),
    );
  }, [searchQuery]);

  const currentDistrict = useMemo(() => getDistrict(selectedDistrictId) || DISTRICTS[0], [selectedDistrictId]);

  // Handle map click for custom coordinate exploration
  const handleMapClick = (e: React.MouseEvent<SVGSVGElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    const width = 600;
    const height = 750;

    const normX = Math.max(0, Math.min(1, (clickX - 30) / (width - 60)));
    const normY = Math.max(0, Math.min(1, (height - clickY - 30) / (height - 60)));

    const lon = BD_BOUNDS.minLon + normX * (BD_BOUNDS.maxLon - BD_BOUNDS.minLon);
    const lat = BD_BOUNDS.minLat + normY * (BD_BOUNDS.maxLat - BD_BOUNDS.minLat);

    setCustomCoord({ lat: Number(lat.toFixed(4)), lon: Number(lon.toFixed(4)) });

    // Find closest district
    let closest = DISTRICTS[0];
    let minDist = Infinity;
    for (const d of DISTRICTS) {
      const dist = Math.hypot(d.lat - lat, d.lon - lon);
      if (dist < minDist) {
        minDist = dist;
        closest = d;
      }
    }
    setSelectedDistrictId(closest.id);
  };

  const monthNames = [
    { en: "January", bn: "জানুয়ারি" },
    { en: "February", bn: "ফেব্রুয়ারি" },
    { en: "March", bn: "মার্চ" },
    { en: "April", bn: "এপ্রিল" },
    { en: "May", bn: "মে" },
    { en: "June", bn: "জুন" },
    { en: "July", bn: "জুলাই" },
    { en: "August", bn: "আগস্ট" },
    { en: "September", bn: "সেপ্টেম্বর" },
    { en: "October", bn: "অক্টোবর" },
    { en: "November", bn: "নভেম্বর" },
    { en: "December", bn: "ডিসেম্বর" },
  ];

  return (
    <div className="min-h-screen bg-[#050A12] text-[#F8FAFC]">
      {/* Top Mission Control Navigation */}
      <header className="sticky top-0 z-40 border-b border-white/10 bg-[#050A12]/90 backdrop-blur-md px-4 sm:px-6 py-3.5">
        <div className="max-w-[1600px] mx-auto flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-sm font-semibold text-[#94A3B8] hover:text-white transition-colors"
            >
              ← AgriLume
            </Link>
            <div className="h-4 w-px bg-white/20" />
            <h1 className="font-space text-base sm:text-lg font-bold flex items-center gap-2 text-white">
              <Globe className="w-5 h-5 text-[#36BFFA]" />
              <span>{tt(lang, "NASA আর্থ ইন্টেলিজেন্স ল্যাব", "NASA Earth Intelligence Lab")}</span>
              <span className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-mono rounded bg-[#36BFFA]/10 text-[#36BFFA] border border-[#36BFFA]/30">
                BANGLADESH 64-DISTRICT OBSERVATORY
              </span>
            </h1>
          </div>

          <div className="flex items-center gap-3">
            {/* Quick Links */}
            <Link
              href="/decision-lab"
              className="hidden lg:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-white/5 hover:bg-white/10 text-white border border-white/10"
            >
              <Sprout className="w-3.5 h-3.5 text-[#59D98E]" />
              <span>{tt(lang, "ডিসিশন ল্যাব", "Decision Lab")}</span>
            </Link>
            <Link
              href="/climate-risk"
              className="hidden lg:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-white/5 hover:bg-white/10 text-white border border-white/10"
            >
              <Waves className="w-3.5 h-3.5 text-[#36BFFA]" />
              <span>{tt(lang, "ঝুঁকি ল্যাব", "Climate Risk Lab")}</span>
            </Link>
            <Link
              href="/time-travel"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-white/5 hover:bg-white/10 text-white border border-white/10"
            >
              <Compass className="w-3.5 h-3.5 text-[#D7A86E]" />
              <span>{tt(lang, "টাইম ট্রাভেল 3D", "Time Travel 3D")}</span>
            </Link>

            {/* Language Toggle */}
            <button
              type="button"
              onClick={() => setLang(lang === "bn" ? "en" : "bn")}
              className="px-3 py-1.5 text-xs font-bold rounded-lg border border-white/15 bg-white/5 hover:bg-white/10 text-white transition-colors cursor-pointer"
              aria-label="Toggle language"
            >
              {lang === "bn" ? "English" : "বাংলা"}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Layout */}
      <main className="max-w-[1600px] mx-auto p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Map & Layer Controls (7 cols on lg) */}
        <section className="lg:col-span-7 flex flex-col gap-4">
          
          {/* Layer Selector Bar */}
          <div className="p-3 rounded-2xl border border-white/10 bg-[#0B1220]/70 flex flex-wrap items-center justify-between gap-2">
            <span className="text-xs font-mono uppercase tracking-wider text-[#94A3B8] flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-[#59D98E]" />
              {tt(lang, "স্যাটেলাইট স্তর:", "Observation Layer:")}
            </span>

            <div className="flex flex-wrap items-center gap-1.5">
              {[
                { id: "ndvi", labelEn: "HLS / MODIS Greenness", labelBn: "উদ্ভিদ সবুজতা (NDVI)", icon: Sprout, color: "#59D98E" },
                { id: "rainfall", labelEn: "GPM / POWER Rain", labelBn: "বৃষ্টিপাত (IMERG)", icon: Droplets, color: "#36BFFA" },
                { id: "soil-moisture", labelEn: "SMAP Soil Moisture", labelBn: "মাটির আর্দ্রতা", icon: Compass, color: "#D7A86E" },
                { id: "surface-water", labelEn: "OPERA Water Extent", labelBn: "ভূপৃষ্ঠের পানি (OPERA)", icon: Waves, color: "#60A5FA" },
                { id: "temperature", labelEn: "POWER Temperature", labelBn: "তাপমাত্রা", icon: Sun, color: "#F59E0B" },
                { id: "cmip6", labelEn: "CMIP6 Future", labelBn: "CMIP6 ভবিষ্যৎ", icon: TrendingUp, color: "#A78BFA" },
              ].map((layer) => {
                const Icon = layer.icon;
                const active = activeLayer === layer.id;
                return (
                  <button
                    key={layer.id}
                    type="button"
                    onClick={() => setActiveLayer(layer.id as ActiveLayer)}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                      active
                        ? "bg-white/15 text-white border border-white/30 shadow-[0_0_12px_rgba(255,255,255,0.15)]"
                        : "text-[#94A3B8] hover:text-white bg-white/5 hover:bg-white/10 border border-transparent"
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" style={{ color: layer.color }} />
                    <span>{lang === "bn" ? layer.labelBn : layer.labelEn}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Map Canvas Card */}
          <div className="relative rounded-2xl border border-white/10 bg-[#070D18] overflow-hidden p-4 flex flex-col items-center">
            
            {/* Top map header / info strip */}
            <div className="w-full flex flex-wrap items-center justify-between gap-2 pb-3 mb-2 border-b border-white/10 text-xs">
              <div className="flex items-center gap-2">
                <span className="font-mono text-[#94A3B8]">
                  {tt(lang, "নির্বাচিত জেলা:", "Selected:")}
                </span>
                <span className="font-bold text-white px-2 py-0.5 rounded bg-white/10 border border-white/15">
                  {lang === "bn" ? currentDistrict.nameBn : currentDistrict.nameEn} ({currentDistrict.division})
                </span>
                {customCoord && (
                  <span className="font-mono text-[11px] text-[#36BFFA]">
                    {customCoord.lat}°N, {customCoord.lon}°E
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setCompareMode(!compareMode)}
                  className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-colors cursor-pointer border ${
                    compareMode
                      ? "bg-[#36BFFA]/20 text-[#36BFFA] border-[#36BFFA]/50"
                      : "bg-white/5 text-[#94A3B8] border-white/10 hover:text-white"
                  }`}
                >
                  {tt(lang, "তুলনা স্লাইডার", "Before/After Compare")}
                </button>
              </div>
            </div>

            {/* SVG Bangladesh Map Display */}
            <div className="relative w-full aspect-[600/750] max-h-[620px] flex items-center justify-center">
              <svg
                viewBox="0 0 600 750"
                className="w-full h-full cursor-crosshair drop-shadow-[0_10px_30px_rgba(0,0,0,0.8)]"
                onClick={handleMapClick}
                aria-label="Interactive Bangladesh Earth Intelligence Map"
              >
                {/* Background grid */}
                <defs>
                  <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                    <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255, 255, 255, 0.04)" strokeWidth="1" />
                  </pattern>
                  <radialGradient id="landGlow" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#0B1C33" stopOpacity="0.8" />
                    <stop offset="100%" stopColor="#050A12" stopOpacity="0" />
                  </radialGradient>
                </defs>

                <rect width="600" height="750" fill="url(#grid)" />

                {/* Bay of Bengal Water Label */}
                <text x="300" y="710" fill="#36BFFA" opacity="0.3" textAnchor="middle" fontSize="16" fontFamily="Space Grotesk" letterSpacing="4">
                  BAY OF BENGAL
                </text>

                {/* District Nodes and Layer Data Representation */}
                {DISTRICTS.map((d) => {
                  const { x, y } = projectGeo(d.lat, d.lon);
                  const isSelected = d.id === selectedDistrictId;

                  // Derive layer color and radius based on authentic evidence
                  let fill = "#59D98E";
                  const r = isSelected ? 8 : 4.5;

                  if (activeLayer === "ndvi") {
                    // Barind is drier (lower NDVI in dry season), Sylhet/Haor greener
                    fill = d.region === "barind" ? "#D7A86E" : d.region === "haor" ? "#59D98E" : "#2DD4BF";
                  } else if (activeLayer === "rainfall") {
                    fill = d.division === "sylhet" || d.division === "chattogram" ? "#36BFFA" : "#60A5FA";
                  } else if (activeLayer === "soil-moisture") {
                    fill = d.region === "barind" ? "#EF4444" : "#10B981";
                  } else if (activeLayer === "surface-water") {
                    fill = d.region === "haor" || d.region === "char" ? "#38BDF8" : "#94A3B8";
                  } else if (activeLayer === "temperature") {
                    fill = d.division === "rajshahi" || d.division === "khulna" ? "#F59E0B" : "#34D399";
                  } else if (activeLayer === "cmip6") {
                    fill = "#A78BFA";
                  }

                  return (
                    <g key={d.id} className="cursor-pointer transition-all duration-300">
                      {isSelected && (
                        <circle
                          cx={x}
                          cy={y}
                          r={r + 8}
                          fill="none"
                          stroke="#59D98E"
                          strokeWidth="2"
                          strokeDasharray="4 2"
                          className="animate-spin"
                          style={{ animationDuration: "8s" }}
                        />
                      )}
                      <circle
                        cx={x}
                        cy={y}
                        r={r}
                        fill={fill}
                        stroke="#050A12"
                        strokeWidth="1.5"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedDistrictId(d.id);
                          setCustomCoord(null);
                        }}
                      />
                      {(isSelected || ["rajshahi", "dhaka", "sylhet", "chattogram", "khulna", "barishal", "rangpur"].includes(d.id)) && (
                        <text
                          x={x}
                          y={y - (isSelected ? 12 : 8)}
                          fill={isSelected ? "#59D98E" : "#CBD5E1"}
                          fontSize={isSelected ? "11" : "9"}
                          fontWeight={isSelected ? "bold" : "normal"}
                          textAnchor="middle"
                          fontFamily="Inter, sans-serif"
                          className="pointer-events-none drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]"
                        >
                          {lang === "bn" ? d.nameBn : d.nameEn}
                        </text>
                      )}
                    </g>
                  );
                })}
              </svg>

              {/* Map Floating Legend */}
              <div className="absolute bottom-3 left-3 bg-[#0B1220]/90 backdrop-blur-md p-2.5 rounded-lg border border-white/10 text-[10px] font-mono text-[#94A3B8] space-y-1">
                <div className="text-white font-bold">{tt(lang, "স্তর ব্যাখা", "Active Layer Metric")}</div>
                {activeLayer === "ndvi" && (
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#59D98E]" />
                    <span>0.6–0.8 (High greenness) · </span>
                    <span className="w-2.5 h-2.5 rounded-full bg-[#D7A86E]" />
                    <span>0.3–0.5 (Moderate/Stressed)</span>
                  </div>
                )}
                {activeLayer === "soil-moisture" && (
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#10B981]" />
                    <span>Adequate moisture · </span>
                    <span className="w-2.5 h-2.5 rounded-full bg-[#EF4444]" />
                    <span>Root-zone deficit (Barind)</span>
                  </div>
                )}
                {activeLayer === "surface-water" && (
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#38BDF8]" />
                    <span>Haor / Char Inundation zone (OPERA 30m)</span>
                  </div>
                )}
                {activeLayer === "rainfall" && (
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#36BFFA]" />
                    <span>GPM IMERG multi-satellite precipitation</span>
                  </div>
                )}
                {activeLayer === "cmip6" && (
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#A78BFA]" />
                    <span>NEX-GDDP-CMIP6 2031-2035 warming delta</span>
                  </div>
                )}
              </div>
            </div>

            {/* Time / Month Slider */}
            <div className="w-full mt-4 pt-3 border-t border-white/10 flex flex-col gap-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-mono text-[#94A3B8] flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-[#36BFFA]" />
                  {compareMode ? tt(lang, "মাস ১ (ভিত্তি):", "Primary Month:") : tt(lang, "পর্যবেক্ষণ মাস:", "Observation Month:")}
                </span>
                <span className="font-bold text-[#59D98E]">
                  {lang === "bn" ? monthNames[selectedMonth - 1].bn : monthNames[selectedMonth - 1].en}
                </span>
              </div>
              <input
                type="range"
                min="1"
                max="12"
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(Number(e.target.value))}
                className="w-full accent-[#59D98E] cursor-pointer"
                aria-label="Select observation month"
              />

              {compareMode && (
                <div className="mt-2 pt-2 border-t border-white/5 flex flex-col gap-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-mono text-[#94A3B8]">
                      {tt(lang, "মাস ২ (তুলনামূলক):", "Comparison Month:")}
                    </span>
                    <span className="font-bold text-[#36BFFA]">
                      {lang === "bn" ? monthNames[compareMonth - 1].bn : monthNames[compareMonth - 1].en}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="12"
                    value={compareMonth}
                    onChange={(e) => setCompareMonth(Number(e.target.value))}
                    className="w-full accent-[#36BFFA] cursor-pointer"
                    aria-label="Select comparison month"
                  />
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Right Column: Evidence Analytics & Inspection (5 cols on lg) */}
        <section className="lg:col-span-5 flex flex-col gap-4">
          
          {/* District Search & Fast Switcher */}
          <div className="p-3 rounded-2xl border border-white/10 bg-[#0B1220]/70 flex items-center gap-2">
            <Search className="w-4 h-4 text-[#94A3B8]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={tt(lang, "জেলা অনুসন্ধান করুন (যেমন: Rajshahi, Bogura...)", "Search 64 districts (e.g. Rajshahi, Bogura...)")}
              className="bg-transparent text-xs w-full text-white placeholder-[#94A3B8]/60 focus:outline-none"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="text-xs text-[#94A3B8] hover:text-white px-1.5"
              >
                ✕
              </button>
            )}
          </div>

          {searchQuery && (
            <div className="max-h-48 overflow-y-auto rounded-xl border border-white/10 bg-[#070D18] p-2 flex flex-col gap-1 z-30">
              {filteredDistricts.map((d) => (
                <button
                  key={d.id}
                  type="button"
                  onClick={() => {
                    setSelectedDistrictId(d.id);
                    setSearchQuery("");
                  }}
                  className="w-full text-left px-3 py-1.5 rounded-lg text-xs hover:bg-white/10 flex items-center justify-between text-[#F8FAFC]"
                >
                  <span className="font-semibold">{lang === "bn" ? d.nameBn : d.nameEn}</span>
                  <span className="text-[10px] font-mono text-[#94A3B8]">{d.division}</span>
                </button>
              ))}
            </div>
          )}

          {/* District Evidence Summary Card */}
          <div className="p-5 rounded-2xl border border-white/10 bg-[#070D18] flex flex-col gap-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-space font-bold text-white">
                    {lang === "bn" ? currentDistrict.nameBn : currentDistrict.nameEn}
                  </h2>
                  <span className="text-xs font-mono uppercase px-2 py-0.5 rounded bg-white/10 text-[#94A3B8]">
                    {currentDistrict.region}
                  </span>
                </div>
                <div className="text-xs text-[#94A3B8] mt-0.5">
                  {tt(lang, "বিভাগ:", "Division:")} {currentDistrict.division.toUpperCase()} • {currentDistrict.lat}°N, {currentDistrict.lon}°E
                </div>
              </div>

              {intel && (
                <KindBadge
                  kind={intel.powerWeather.provenance.originCategory === "cached-observation" ? "cached-observation" : "observed"}
                  lang={lang}
                />
              )}
            </div>

            {/* Scientific Synthesis Banner */}
            {intel && (
              <div className="p-3 rounded-xl border border-white/10 bg-[#0B1528] text-xs leading-relaxed space-y-2">
                <div className="flex items-center gap-1.5 font-bold text-[#59D98E]">
                  <ShieldCheck className="w-4 h-4 text-[#59D98E]" />
                  <span>{tt(lang, "বৈজ্ঞানিক সিন্থেসিস ও পর্যবেক্ষণ", "NASA Scientific Evidence Synthesis")}</span>
                </div>
                <p className="text-[#CBD5E1]">
                  {lang === "bn" ? intel.synthesis.evidenceSummary.bn : intel.synthesis.evidenceSummary.en}
                </p>

                <div className="pt-2 border-t border-white/10 grid grid-cols-2 gap-2 text-[11px] font-mono">
                  <div>
                    <span className="text-[#94A3B8]">{tt(lang, "খরা ঝুঁকি:", "Drought Risk:")} </span>
                    <span className={intel.synthesis.droughtVulnerability === "VERY_HIGH" ? "text-red-400 font-bold" : "text-[#59D98E]"}>
                      {intel.synthesis.droughtVulnerability}
                    </span>
                  </div>
                  <div>
                    <span className="text-[#94A3B8]">{tt(lang, "প্লাবন ঝুঁকি:", "Flood Risk:")} </span>
                    <span className={intel.synthesis.floodVulnerability === "VERY_HIGH" ? "text-cyan-400 font-bold" : "text-[#94A3B8]"}>
                      {intel.synthesis.floodVulnerability}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Metric Details Panel based on Active Layer */}
            <div className="space-y-3 pt-2">
              <h3 className="text-xs font-mono uppercase tracking-wider text-[#94A3B8] flex items-center gap-1.5">
                <Info className="w-3.5 h-3.5 text-[#36BFFA]" />
                {tt(lang, "সক্রিয় উপাত্ত মেট্রিক্স", "Active Layer Diagnostics")}
              </h3>

              {/* 1. NDVI Vegetation Layer */}
              {activeLayer === "ndvi" && intel?.hlsVegetation.data && (
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 rounded-xl border border-white/10 bg-white/5">
                      <div className="text-[11px] text-[#94A3B8]">{tt(lang, "মাসিক গড় NDVI", "Monthly Mean NDVI")}</div>
                      <div className="text-2xl font-space font-bold text-[#59D98E] mt-0.5">
                        {intel.hlsVegetation.data.seasonalCycleNdvi[selectedMonth - 1].toFixed(2)}
                      </div>
                      <div className="text-[10px] text-[#94A3B8]/80 mt-1">30m HLS / 250m MODIS</div>
                    </div>
                    <div className="p-3 rounded-xl border border-white/10 bg-white/5">
                      <div className="text-[11px] text-[#94A3B8]">{tt(lang, "উদ্ভিদ অবস্থা", "Canopy State")}</div>
                      <div className="text-sm font-bold text-white mt-1.5">
                        {intel.hlsVegetation.data.seasonalCycleNdvi[selectedMonth - 1] > 0.65
                          ? tt(lang, "ঘন সবুজ (সর্বোচ্চ)", "Dense Green (Peak)")
                          : intel.hlsVegetation.data.seasonalCycleNdvi[selectedMonth - 1] > 0.45
                            ? tt(lang, "মাঝারি সবুজ", "Moderate Green")
                            : tt(lang, "ফসলহীন / শুষ্ক", "Fallow / Dry")}
                      </div>
                      <div className="text-[10px] text-[#94A3B8]/80 mt-1">Fmask cloud-cleared</div>
                    </div>
                  </div>

                  {compareMode && (
                    <div className="p-3 rounded-xl border border-[#36BFFA]/30 bg-[#36BFFA]/10 text-xs">
                      <div className="font-bold text-[#36BFFA] flex items-center justify-between">
                        <span>{monthNames[selectedMonth - 1].en} vs {monthNames[compareMonth - 1].en}</span>
                        <span>
                          Δ NDVI: {(intel.hlsVegetation.data.seasonalCycleNdvi[compareMonth - 1] - intel.hlsVegetation.data.seasonalCycleNdvi[selectedMonth - 1]).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* 2. Soil Moisture Layer */}
              {activeLayer === "soil-moisture" && intel?.smapMoisture.data && (
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 rounded-xl border border-white/10 bg-white/5">
                      <div className="text-[11px] text-[#94A3B8]">{tt(lang, "মূল-অঞ্চল আর্দ্রতা", "Root-Zone Moisture")}</div>
                      <div className="text-2xl font-space font-bold text-[#D7A86E] mt-0.5">
                        {intel.smapMoisture.data.records[selectedMonth - 1]?.rootZoneMoisture.toFixed(2)} <span className="text-xs">m³/m³</span>
                      </div>
                      <div className="text-[10px] text-[#94A3B8]/80 mt-1">SMAP L4 0–100 cm depth</div>
                    </div>
                    <div className="p-3 rounded-xl border border-white/10 bg-white/5">
                      <div className="text-[11px] text-[#94A3B8]">{tt(lang, "ক্ষেতের পানি ধারণ অনুপাত", "Field Capacity Ratio")}</div>
                      <div className="text-2xl font-space font-bold text-white mt-0.5">
                        {(intel.smapMoisture.data.fieldCapacityRatio * 100).toFixed(0)}%
                      </div>
                      <div className="text-[10px] text-[#94A3B8]/80 mt-1">
                        {intel.smapMoisture.data.barindDroughtRiskIndex.toUpperCase()} drought stress
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* 3. Surface Water Layer */}
              {activeLayer === "surface-water" && intel?.operaWater.data && (
                <div className="space-y-3">
                  <div className="p-3 rounded-xl border border-white/10 bg-white/5">
                    <div className="text-[11px] text-[#94A3B8]">{tt(lang, "ভূপৃষ্ঠে পানির স্বাভাবিক গড়", "Baseline Water Coverage")}</div>
                    <div className="text-2xl font-space font-bold text-[#60A5FA] mt-0.5">
                      {intel.operaWater.data.baselineSeasonalWaterPct[selectedMonth - 1]?.toFixed(1)}%
                    </div>
                    <div className="text-[10px] text-[#94A3B8]/80 mt-1">OPERA 30m optical water extent</div>
                  </div>

                  {intel.operaWater.data.historicEventComparisons.length > 0 && (
                    <div className="p-3 rounded-xl border border-white/10 bg-white/5 space-y-1.5">
                      <div className="text-xs font-bold text-white">{tt(lang, "ঐতিহাসিক প্লাবন রেকর্ড", "Historic Flood Benchmarks")}</div>
                      {intel.operaWater.data.historicEventComparisons.map((ev, i) => (
                        <div key={i} className="text-xs flex items-center justify-between text-[#CBD5E1]">
                          <span>{ev.event}</span>
                          <span className="font-mono font-bold text-cyan-400">{ev.inundationPct}%</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* 4. Rainfall / GPM Layer */}
              {activeLayer === "rainfall" && intel?.gpmPrecip.data && (
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 rounded-xl border border-white/10 bg-white/5">
                      <div className="text-[11px] text-[#94A3B8]">{tt(lang, "মাসিক বৃষ্টিপাত", "Monthly Rainfall")}</div>
                      <div className="text-2xl font-space font-bold text-[#36BFFA] mt-0.5">
                        {intel.gpmPrecip.data.records[selectedMonth - 1]?.monthlyTotalMm.toFixed(0)} <span className="text-xs">mm</span>
                      </div>
                      <div className="text-[10px] text-[#94A3B8]/80 mt-1">GPM IMERG multi-satellite</div>
                    </div>
                    <div className="p-3 rounded-xl border border-white/10 bg-white/5">
                      <div className="text-[11px] text-[#94A3B8]">{tt(lang, "মৌসুমি বৃষ্টি আগমন", "Monsoon Onset DOY")}</div>
                      <div className="text-2xl font-space font-bold text-white mt-0.5">
                        Day {intel.gpmPrecip.data.monsoonOnsetDayOfYear}
                      </div>
                      <div className="text-[10px] text-[#94A3B8]/80 mt-1">~Mid-June onset window</div>
                    </div>
                  </div>
                </div>
              )}

              {/* 5. Temperature / POWER Layer */}
              {activeLayer === "temperature" && intel?.powerWeather.data && (
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 rounded-xl border border-white/10 bg-white/5">
                      <div className="text-[11px] text-[#94A3B8]">{tt(lang, "দৈনিক সর্বোচ্চ গড়", "Daily Max Tmax Mean")}</div>
                      <div className="text-2xl font-space font-bold text-[#F59E0B] mt-0.5">
                        {intel.powerWeather.data.parameters.tmax[intel.powerWeather.data.parameters.tmax.length - 1]?.[selectedMonth - 1]?.toFixed(1)}°C
                      </div>
                      <div className="text-[10px] text-[#94A3B8]/80 mt-1">NASA POWER 50 km grid</div>
                    </div>
                    <div className="p-3 rounded-xl border border-white/10 bg-white/5">
                      <div className="text-[11px] text-[#94A3B8]">{tt(lang, "দৈনিক সর্বনিম্ন গড়", "Daily Min Tmin Mean")}</div>
                      <div className="text-2xl font-space font-bold text-white mt-0.5">
                        {intel.powerWeather.data.parameters.tmin[intel.powerWeather.data.parameters.tmin.length - 1]?.[selectedMonth - 1]?.toFixed(1)}°C
                      </div>
                      <div className="text-[10px] text-[#94A3B8]/80 mt-1">Diurnal temperature range</div>
                    </div>
                  </div>
                </div>
              )}

              {/* 6. CMIP6 Projections Layer */}
              {activeLayer === "cmip6" && intel?.cmip6Scenarios.data && (
                <div className="space-y-3">
                  <div className="p-3 rounded-xl border border-[#A78BFA]/30 bg-[#A78BFA]/10 space-y-2">
                    <div className="text-xs font-bold text-white">NEX-GDDP-CMIP6 2031–2035 Projections (SSP2-4.5)</div>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <span className="text-[#94A3B8]">Warming ΔTmax: </span>
                        <span className="font-mono font-bold text-[#A78BFA]">
                          +{intel.cmip6Scenarios.data.scenarios.ssp245.ensembleMean.dTmax[selectedMonth - 1]}°C
                        </span>
                      </div>
                      <div>
                        <span className="text-[#94A3B8]">Precip Ratio: </span>
                        <span className="font-mono font-bold text-white">
                          {intel.cmip6Scenarios.data.scenarios.ssp245.ensembleMean.rainRatio[selectedMonth - 1]}×
                        </span>
                      </div>
                    </div>
                    <div className="text-[10px] text-[#94A3B8] pt-1 border-t border-white/10">
                      Multi-model standard deviation: ±{intel.cmip6Scenarios.data.scenarios.ssp245.ensembleStdDev.dTmax[selectedMonth - 1]}°C
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Call to action to launch Decision Lab with this location */}
            <div className="pt-4 border-t border-white/10">
              <Link
                href={`/decision-lab?district=${selectedDistrictId}`}
                className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-[#59D98E] hover:bg-[#6ef0a4] text-[#050A12] text-xs font-bold transition-all shadow-[0_0_20px_rgba(89,217,142,0.3)] hover:scale-[1.01]"
              >
                <span>{tt(lang, "এই জেলার জন্য সিদ্ধান্ত ল্যাব খুলুন", "Simulate Agricultural Decisions in Decision Lab")}</span>
                <ArrowRight className="w-4 h-4 stroke-[2.5]" />
              </Link>
            </div>

          </div>
        </section>

      </main>
    </div>
  );
}
