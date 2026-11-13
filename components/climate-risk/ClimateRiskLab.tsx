"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Waves,
  Droplets,
  Sun,
  ShieldAlert,
  AlertTriangle,
  Calendar,
  Compass,
  ArrowRight,
  TrendingDown,
  TrendingUp,
  MapPin,
  Info,
  CheckCircle,
} from "lucide-react";
import type { Lang } from "@/lib/timetravel/types";
import { tt } from "@/components/timetravel/ui/primitives";

type RiskCategory = "flood" | "drought" | "salinity";
type EvidenceNature = "OBSERVED_EVENT" | "HISTORICAL_RECONSTRUCTION" | "WHAT_IF_SCENARIO" | "FUTURE_PROJECTION";

interface RiskCaseStudy {
  id: string;
  category: RiskCategory;
  nature: EvidenceNature;
  titleEn: string;
  titleBn: string;
  year: number;
  region: string;
  satelliteSensor: string;
  spatialResolution: string;
  impactMetric: string;
  scientificContextEn: string;
  scientificContextBn: string;
  adaptationStrategyEn: string;
  adaptationStrategyBn: string;
}

const HISTORIC_STUDIES: RiskCaseStudy[] = [
  {
    id: "sylhet-2022",
    category: "flood",
    nature: "OBSERVED_EVENT",
    titleEn: "2022 Mega Flash Flood in Surma-Kushiyara Basin",
    titleBn: "২০২২ সুরমা-কুশিয়ারা অববাহিকায় আকস্মিক মহাপ্লাবন",
    year: 2022,
    region: "Sylhet & Sunamganj Haor Basin",
    satelliteSensor: "NASA OPERA DSWx-HLS (30m) & GPM IMERG (10km)",
    spatialResolution: "30-meter optical surface water + 0.1° precipitation",
    impactMetric: "68.4% surface water extent, 852 mm rainfall in 5 days",
    scientificContextEn:
      "Extreme orographic precipitation triggered over Meghalaya plateau (>1000 mm/3 days) inundated standing Boro paddy fields prior to harvest. OPERA DSWx-HLS recorded rapid open water conversion of 420,000 hectares within 72 hours.",
    scientificContextBn:
      "মেঘালয় মালভূমিতে সৃষ্ট অতিভারী বৃষ্টিপাত (৩ দিনে ১০০০ মিমি+) ফসল কাটার মুখে হাওরের বোরো ধান নিমজ্জিত করে। নাসা OPERA তথ্যে ৭২ ঘণ্টার মধ্যে ৪ লাখ ২০ হাজার হেক্টর জমিতে উন্মুক্ত পানির বিস্তার ধরা পড়ে।",
    adaptationStrategyEn:
      "Deploy short-duration Boro cultivars (e.g. BRRI dhan88, BRRI dhan96) and monitor GPM IMERG 7-day upstream watershed accumulation.",
    adaptationStrategyBn:
      "স্বল্পমেয়াদী জাতের ধান (যেমন ব্রি ধান৮৮, ব্রি ধান৯৬) চাষ এবং GPM IMERG স্যাটেলাইট ট্র্যাকিং অনুসরণ করা।",
  },
  {
    id: "feni-2024",
    category: "flood",
    nature: "OBSERVED_EVENT",
    titleEn: "August 2024 Eastern Flash Flood (Muhuri River)",
    titleBn: "আগস্ট ২০২৪ পূর্বাঞ্চলীয় আকস্মিক বন্যা (মুহুরী নদী)",
    year: 2024,
    region: "Feni, Cumilla & Noakhali",
    satelliteSensor: "NASA OPERA DSWx-HLS & Sentinel-1 SAR",
    spatialResolution: "30-meter combined optical & radar extent",
    impactMetric: "48.6% district inundation, 496.5 mm rainfall anomaly",
    scientificContextEn:
      "Synoptic low pressure system combined with upstream catchment runoff caused catastrophic breach of embankments. OPERA 30m mapping distinguished open floodwater from vegetated wetland mixes across coastal plains.",
    scientificContextBn:
      "মৌসুমি নিম্নচাপ ও উজানের পানির ঢলে মুহুরী নদীর বাঁধ ভেঙে বিস্তীর্ণ এলাকা প্লাবিত হয়। নাসা OPERA ৩০ মিটার উপাত্তে উন্মুক্ত পানি ও ফসলি জমির জলাবদ্ধতা নিখুঁতভাবে চিহ্নিত হয়।",
    adaptationStrategyEn:
      "Construct community seedbeds on elevated platforms and plant submergence-tolerant Aman rice (e.g. BRRI dhan51, BRRI dhan52).",
    adaptationStrategyBn:
      "উঁচু প্ল্যাটফর্মে ভাসমান বা যৌথ বীজতলা তৈরি এবং জলমগ্নতা সহনশীল আমন জাত (যেমন ব্রি ধান৫১, ব্রি ধান৫২) রোপণ।",
  },
  {
    id: "barind-drought-2023",
    category: "drought",
    nature: "OBSERVED_EVENT",
    titleEn: "2023 Pre-Kharif Prolonged Drought in Barind Tract",
    titleBn: "২০২৩ বরেন্দ্র অঞ্চলে খরিপ-পূর্ব দীর্ঘমেয়াদী খরা",
    year: 2023,
    region: "Rajshahi, Naogaon & Chapainawabganj",
    satelliteSensor: "NASA SMAP L4 (9km) & NASA POWER",
    spatialResolution: "9 km root-zone soil moisture + 50 km meteorology",
    impactMetric: "Root-zone moisture 0.14 m³/m³ (15.4% deficit), 24 days >38°C",
    scientificContextEn:
      "Pre-monsoon failure coincided with severe heatwave (>40°C in Rajshahi). SMAP recorded depletion of soil moisture beneath the wilting point for shallow-rooted crops, forcing heavy deep-tubewell groundwater pumping.",
    scientificContextBn:
      "বর্ষা-পূর্ব বৃষ্টির তীব্র ঘাটতি এবং রাজশাহীতে টানা দাবদাহে (>৪০°সে) মাটির আর্দ্রতা আশঙ্কাজনক নিচে নেমে যায়, যার ফলে গভীর নলকূপের ওপর তীব্র চাপ তৈরি হয়।",
    adaptationStrategyEn:
      "Transition from groundwater-intensive Boro to low-water crops (mustard, lentil, wheat) and implement Alternate Wetting and Drying (AWD).",
    adaptationStrategyBn:
      "অতিরিক্ত সেচ-নির্ভর বোরো ধানের বিকল্প হিসেবে ডাল, তেলবীজ ও গম চাষ এবং এডব্লিউডি (AWD) সেচ প্রযুক্তি প্রয়োগ।",
  },
  {
    id: "historic-1998",
    category: "flood",
    nature: "HISTORICAL_RECONSTRUCTION",
    titleEn: "1998 Historic Deluge (National Inundation Benchmark)",
    titleBn: "১৯৯৮ ঐতিহাসিক বন্যা (জাতীয় প্লাবনের বেঞ্চমার্ক)",
    year: 1998,
    region: "Brahmaputra, Ganges & Meghna Basins",
    satelliteSensor: "Landsat-5 TM (30m) & BWDB River Gauges",
    spatialResolution: "30-meter optical reconstruction",
    impactMetric: "68% of national land area flooded for >65 days",
    scientificContextEn:
      "Simultaneous peak discharges in all three major river basins created an unprecedented backwater effect. Historical reconstruction calibrated against BWDB water level records serves as the scientific upper bound for flood resilience planning.",
    scientificContextBn:
      "পদ্মা, ব্রহ্মপুত্র ও মেঘনা—তিনটি প্রধান নদীর যুগপৎ পানি বৃদ্ধি ও সাগরের জোয়ারের কারণে দেশের ৬৮% এলাকা দুই মাসেরও বেশি সময় নিমজ্জিত ছিল।",
    adaptationStrategyEn:
      "Post-flood agricultural rehabilitation: fast-growing Rabi crops (maize, mustard) and post-flood pulse cultivation.",
    adaptationStrategyBn:
      "বন্যা-পরবর্তী কৃষি পুনর্বাসন: দ্রুত বর্ধনশীল রবি ফসল (ভুট্টা, সরিষা) ও ডাল চাষের নিবিড় বাস্তবায়ন।",
  },
  {
    id: "future-salinity-2035",
    category: "salinity",
    nature: "FUTURE_PROJECTION",
    titleEn: "2031–2035 Coastal Salinity Ingress & Dry Spell Shift",
    titleBn: "২০৩১–২০৩৫ উপকূলীয় লবণাক্ততা বৃদ্ধি ও জলবায়ু প্রক্ষেপণ",
    year: 2035,
    region: "Satkhira, Khulna & Bagerhat",
    satelliteSensor: "NASA NEX-GDDP-CMIP6 & SRTM DEM (30m)",
    spatialResolution: "0.25° (~28 km) downscaled climate + 30m elevation",
    impactMetric: "+1.4°C dry season warming, river salinity >8 dS/m extended 25 km inland",
    scientificContextEn:
      "Upstream freshwater diversion during lean dry season (March–May) coupled with sea-level rise accelerates saline wedge penetration into agricultural aquifers and canal irrigation networks.",
    scientificContextBn:
      "শুকনো মৌসুমে নদীতে মিঠা পানির প্রবাহ হ্রাস এবং সমুদ্রপৃষ্ঠের উচ্চতা বৃদ্ধির ফলে উপকূলীয় ফসলি জমিতে লবণাক্ততার মাত্রা (৮ ডিএস/মি+) বৃদ্ধি পাবে।",
    adaptationStrategyEn:
      "Saline-tolerant rice cultivars (BRRI dhan67, BRRI dhan97, BINA dhan-10) and farm pond rainwater harvesting.",
    adaptationStrategyBn:
      "লবণাক্ততা সহনশীল জাত (যেমন ব্রি ধান৬৭, ব্রি ধান৯৭) চাষ এবং বৃষ্টির পানি সংরক্ষণে খামার পুকুর নির্মাণ।",
  },
];

export function ClimateRiskLab() {
  const [lang, setLang] = useState<Lang>("en");
  const [selectedFilter, setSelectedFilter] = useState<RiskCategory | "all">("all");
  const [selectedCase, setSelectedCase] = useState<RiskCaseStudy>(HISTORIC_STUDIES[0]);

  const filteredStudies = HISTORIC_STUDIES.filter(
    (s) => selectedFilter === "all" || s.category === selectedFilter,
  );

  const getNatureBadge = (nature: EvidenceNature) => {
    switch (nature) {
      case "OBSERVED_EVENT":
        return {
          label: tt(lang, "বাস্তব পর্যবেক্ষণ (স্যাটেলাইট)", "Observed Event (Satellite)"),
          color: "border-[#59D98E]/50 bg-[#59D98E]/10 text-[#59D98E]",
          sym: "●",
        };
      case "HISTORICAL_RECONSTRUCTION":
        return {
          label: tt(lang, "ঐতিহাসিক পুনর্গঠন", "Historical Reconstruction"),
          color: "border-[#36BFFA]/50 bg-[#36BFFA]/10 text-[#36BFFA]",
          sym: "◐",
        };
      case "WHAT_IF_SCENARIO":
        return {
          label: tt(lang, "ধরে-নিই সিমুলেশন", "What-If Scenario"),
          color: "border-amber-400/50 bg-amber-400/10 text-amber-400",
          sym: "◇",
        };
      case "FUTURE_PROJECTION":
        return {
          label: tt(lang, "ভবিষ্যৎ প্রক্ষেপণ (CMIP6)", "Future Climate Projection"),
          color: "border-purple-400/50 bg-purple-400/10 text-purple-400",
          sym: "▲",
        };
    }
  };

  return (
    <div className="min-h-screen bg-[#050A12] text-[#F8FAFC]">
      {/* Header */}
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
              <Waves className="w-5 h-5 text-[#36BFFA]" />
              <span>{tt(lang, "বন্যা, খরা ও লবণাক্ততা প্রমাণ ল্যাব", "Flood & Drought Evidence Lab")}</span>
              <span className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-mono rounded bg-[#36BFFA]/10 text-[#36BFFA] border border-[#36BFFA]/30">
                CLIMATE HAZARDS & OPERA WATER
              </span>
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/earth-intelligence"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-white/5 hover:bg-white/10 text-white border border-white/10"
            >
              <span>{tt(lang, "আর্থ ইন্টেলিজেন্স ম্যাপ", "Earth Intelligence Map")}</span>
            </Link>
            <Link
              href="/decision-lab"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-white/5 hover:bg-white/10 text-white border border-white/10"
            >
              <Compass className="w-3.5 h-3.5 text-[#59D98E]" />
              <span>{tt(lang, "সিদ্ধান্ত ল্যাব", "Decision Lab")}</span>
            </Link>
            <button
              type="button"
              onClick={() => setLang(lang === "bn" ? "en" : "bn")}
              className="px-3 py-1.5 text-xs font-bold rounded-lg border border-white/15 bg-white/5 hover:bg-white/10 text-white cursor-pointer"
            >
              {lang === "bn" ? "English" : "বাংলা"}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-[1600px] mx-auto p-4 sm:p-6 flex flex-col gap-6">
        
        {/* Notice of Scientific Transparency */}
        <section className="p-4 rounded-2xl border border-white/10 bg-[#0B1528] flex flex-wrap items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-3">
            <Info className="w-5 h-5 text-[#36BFFA] shrink-0" />
            <p className="text-[#CBD5E1] leading-relaxed">
              {tt(
                lang,
                "এই ল্যাবটি বাস্তব নাসা উপগ্রহ ও আবহাওয়া রেকর্ডের ওপর ভিত্তি করে তৈরি। এটি কোনো সরাসরি দুর্যোগ সতর্কতা বা লাইভ অ্যালার্ম সার্ভিস নয়; কৃষির স্থিতিস্থাপকতা বাড়াতে ঐতিহাসিক ও প্রক্ষেপিত ঝুঁকি বিশ্লেষণের একটি গবেষণাধর্মী প্ল্যাটফর্ম।",
                "This Evidence Lab visualizes authentic NASA satellite observations and reanalysis data. It is NOT an operational disaster warning service; it is an educational Earth observation laboratory for understanding agricultural resilience.",
              )}
            </p>
          </div>

          <div className="flex items-center gap-2">
            {(["all", "flood", "drought", "salinity"] as const).map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedFilter(cat)}
                className={`px-3 py-1.5 rounded-lg font-semibold uppercase text-[11px] tracking-wider transition-colors cursor-pointer border ${
                  selectedFilter === cat
                    ? "bg-white/15 text-white border-white/30"
                    : "bg-white/5 text-[#94A3B8] border-transparent hover:text-white"
                }`}
              >
                {cat === "all" ? tt(lang, "সব ঝুঁকি", "All Hazards") : cat}
              </button>
            ))}
          </div>
        </section>

        {/* 2-Column Split: Case Study Selector & Deep Dive */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left: Case Studies List (5 cols) */}
          <section className="lg:col-span-5 flex flex-col gap-3">
            <h2 className="text-xs font-mono uppercase tracking-wider text-[#94A3B8]">
              {tt(lang, "ঐতিহাসিক ও প্রক্ষেপিত দুর্যোগ কেস স্টাডি", "Documented Climate Hazard Case Studies")}
            </h2>

            <div className="space-y-3">
              {filteredStudies.map((s) => {
                const active = s.id === selectedCase.id;
                const badge = getNatureBadge(s.nature);
                return (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => setSelectedCase(s)}
                    className={`w-full text-left p-4 rounded-xl border transition-all cursor-pointer ${
                      active
                        ? "bg-[#070D18] border-[#36BFFA] shadow-[0_0_20px_rgba(54,191,250,0.15)]"
                        : "bg-[#0B1220]/70 border-white/10 hover:border-white/20 hover:bg-[#070D18]"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono border ${badge.color}`}>
                        <span>{badge.sym}</span>
                        <span>{badge.label}</span>
                      </span>
                      <span className="font-mono text-xs font-bold text-white">{s.year}</span>
                    </div>

                    <h3 className="text-sm font-bold text-white">
                      {lang === "bn" ? s.titleBn : s.titleEn}
                    </h3>

                    <div className="text-xs text-[#94A3B8] mt-1 flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-[#59D98E]" />
                      <span>{s.region}</span>
                    </div>

                    <div className="mt-2 text-[11px] font-mono text-[#36BFFA] bg-black/20 p-2 rounded-lg border border-white/5">
                      {s.impactMetric}
                    </div>
                  </button>
                );
              })}
            </div>
          </section>

          {/* Right: Deep Evidence Inspection (7 cols) */}
          <section className="lg:col-span-7 flex flex-col gap-5">
            <div className="p-6 rounded-2xl border border-white/10 bg-[#070D18] space-y-6">
              
              {/* Title & Metadata Header */}
              <div className="space-y-2 pb-4 border-b border-white/10">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-mono uppercase text-[#36BFFA] font-bold">
                    {selectedCase.region} • {selectedCase.year}
                  </span>
                  <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-mono border ${getNatureBadge(selectedCase.nature).color}`}>
                    <span>{getNatureBadge(selectedCase.nature).sym}</span>
                    <span>{getNatureBadge(selectedCase.nature).label}</span>
                  </span>
                </div>

                <h2 className="text-xl sm:text-2xl font-space font-bold text-white">
                  {lang === "bn" ? selectedCase.titleBn : selectedCase.titleEn}
                </h2>
              </div>

              {/* Sensor & Spatial Specs Strip */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-xl border border-white/10 bg-white/5 space-y-1">
                  <div className="text-[#94A3B8] font-mono uppercase">{tt(lang, "ব্যবহৃত স্যাটেলাইট সেন্সর", "NASA Earth Observation Sensor")}</div>
                  <div className="font-bold text-white">{selectedCase.satelliteSensor}</div>
                </div>

                <div className="p-3 rounded-xl border border-white/10 bg-white/5 space-y-1">
                  <div className="text-[#94A3B8] font-mono uppercase">{tt(lang, "স্থানিক রেজোলিউশন ও গ্রিড", "Spatial Resolution")}</div>
                  <div className="font-bold text-[#59D98E]">{selectedCase.spatialResolution}</div>
                </div>
              </div>

              {/* Scientific Context */}
              <div className="space-y-2">
                <h3 className="text-xs font-mono uppercase tracking-wider text-[#94A3B8] flex items-center gap-1.5">
                  <Info className="w-3.5 h-3.5 text-[#36BFFA]" />
                  {tt(lang, "বৈজ্ঞানিক পটভূমি ও দূর-অনুধাবন বিশ্লেষণ", "Scientific Context & Remote Sensing Analysis")}
                </h3>
                <p className="text-sm text-[#CBD5E1] leading-relaxed p-4 rounded-xl border border-white/10 bg-[#0B1528]">
                  {lang === "bn" ? selectedCase.scientificContextBn : selectedCase.scientificContextEn}
                </p>
              </div>

              {/* Impact Metric Banner */}
              <div className="p-4 rounded-xl border border-[#36BFFA]/40 bg-[#36BFFA]/10 flex items-center justify-between gap-4">
                <div>
                  <div className="text-[11px] text-[#36BFFA] uppercase font-mono">{tt(lang, "পরিমাপিত চরম সূচক", "Observed Hazard Metric")}</div>
                  <div className="text-lg font-space font-bold text-white mt-0.5">{selectedCase.impactMetric}</div>
                </div>
                <Waves className="w-8 h-8 text-[#36BFFA] shrink-0 opacity-80" />
              </div>

              {/* Actionable Agricultural Adaptation */}
              <div className="space-y-2 pt-2">
                <h3 className="text-xs font-mono uppercase tracking-wider text-[#59D98E] flex items-center gap-1.5">
                  <CheckCircle className="w-3.5 h-3.5 text-[#59D98E]" />
                  {tt(lang, "কৃষি অভিযোজন ও বিজ্ঞানভিত্তিক সুরক্ষা", "Agronomic Adaptation & Climate Resilience")}
                </h3>
                <div className="p-4 rounded-xl border border-[#59D98E]/30 bg-[#59D98E]/5 text-sm text-[#CBD5E1] leading-relaxed">
                  {lang === "bn" ? selectedCase.adaptationStrategyBn : selectedCase.adaptationStrategyEn}
                </div>
              </div>

              {/* Action Link */}
              <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                <Link
                  href="/decision-lab"
                  className="inline-flex items-center gap-2 text-xs font-bold text-[#59D98E] hover:underline"
                >
                  <span>{tt(lang, "এই পরিস্থিতির বিকল্প সেচ ও ফসল মডেল টেস্ট করুন", "Test Adaptation Scenarios in Decision Lab")}</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  href="/earth-intelligence"
                  className="inline-flex items-center gap-1.5 text-xs text-[#36BFFA] hover:underline font-mono"
                >
                  <span>{tt(lang, "মানচিত্রে দেখুন", "Inspect on Map")}</span>
                </Link>
              </div>

            </div>
          </section>

        </div>

      </main>
    </div>
  );
}

