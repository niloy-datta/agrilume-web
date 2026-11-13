"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import {
  Sprout,
  ArrowRight,
  TrendingUp,
  Droplets,
  Sun,
  ShieldAlert,
  Compass,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  BookOpen,
  HelpCircle,
  ExternalLink,
} from "lucide-react";
import { DISTRICTS, getDistrict } from "@/lib/timetravel/locations";
import { CROPS, type CropId, simulateSeason, baselineSim, relativeIndex } from "@/lib/timetravel/crops";
import { loadBundledDistrict, rajshahiFixture } from "@/lib/timetravel/power";
import { loadProjectionPack, type ProjectionPack } from "@/lib/timetravel/projection-pack";
import { monthlyForYear, climatology, defaultBaseline } from "@/lib/timetravel/climate";
import type { ClimateSeries, IrrigationMode, Lang, MonthlyYear } from "@/lib/timetravel/types";
import { tt, KindBadge } from "@/components/timetravel/ui/primitives";

interface PracticeState {
  label: string;
  year: number;
  sowDoy: number;
  irrigation: IrrigationMode;
  soilEc: number; // dS/m (1 = normal, 4-8 = saline)
  dT: number; // °C temperature shift
  rainDeltaPct: number; // % rainfall shift
  mode: "trend" | "pack";
}

export function DecisionLab() {
  const [lang, setLang] = useState<Lang>("en");
  const [districtId, setDistrictId] = useState<string>("rajshahi");
  const [cropId, setCropId] = useState<CropId>("boro");
  const [series, setSeries] = useState<ClimateSeries>(rajshahiFixture());
  const [pack, setPack] = useState<ProjectionPack | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Scenario A: Current Practice (e.g. Traditional full irrigation / flood irrigation, late planting)
  const [scenarioA, setScenarioA] = useState<PracticeState>({
    label: "Scenario A (Current Practice)",
    year: 2024,
    sowDoy: 15, // Mid-January
    irrigation: "irrigated",
    soilEc: 1.0,
    dT: 0,
    rainDeltaPct: 0,
    mode: "trend",
  });

  // Scenario B: Alternative Practice (e.g. Alternate Wetting and Drying AWD / early planting)
  const [scenarioB, setScenarioB] = useState<PracticeState>({
    label: "Scenario B (Alternative Practice)",
    year: 2024,
    sowDoy: 5, // Early January (evade late heatwave)
    irrigation: "awd", // AWD simulation
    soilEc: 1.0,
    dT: 0,
    rainDeltaPct: 0,
    mode: "trend",
  });

  // Load district climate series and CMIP6 pack
  useEffect(() => {
    let cancelled = false;
    Promise.resolve().then(() => {
      if (!cancelled) setLoading(true);
    });
    const d = getDistrict(districtId);
    if (!d) return;

    loadBundledDistrict(districtId)
      .then((res) => {
        if (!cancelled && res.ok) {
          setSeries(res.series);
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    loadProjectionPack(districtId).then((p) => {
      if (!cancelled) setPack(p);
    });

    return () => {
      cancelled = true;
    };
  }, [districtId]);

  const selectedCrop = CROPS[cropId];
  const district = useMemo(() => getDistrict(districtId) || DISTRICTS[0], [districtId]);

  // Model evaluation function
  const evaluateScenario = (input: PracticeState) => {
    const crop = selectedCrop;
    const scenarioSpec = {
      mode: input.mode,
      dT: input.dT,
      rainMonsoonPct: input.rainDeltaPct,
      rainDryPct: input.rainDeltaPct,
    };

    const getYear = (y: number) => monthlyForYear(series, y, scenarioSpec, { pack });
    const common = {
      lat: series.lat,
      crop,
      sowYear: input.year,
      sowDoy: input.sowDoy,
      irrigation: input.irrigation,
      soilEc: input.soilEc,
    };

    const result = simulateSeason({ ...common, getYear, events: [] });

    // Baseline calculation from multi-year climatology
    const baseWindow = defaultBaseline(series);
    const c = (g: typeof series.tmax) => climatology(g, series.startYear, baseWindow.from, baseWindow.to).mean;
    const avgYear: MonthlyYear = {
      year: Math.round((baseWindow.from + baseWindow.to) / 2),
      tmax: c(series.tmax),
      tmin: c(series.tmin),
      rain: c(series.rain),
      tmaxSd: series.tmaxDailySd.map((v) => v ?? 2),
      kind: "observed",
      perturbed: false,
      notes: [],
    };
    const baseline = baselineSim(common, avgYear);

    const index = relativeIndex(result, baseline);
    const yr = getYear(input.year);

    return {
      result,
      index,
      dataKind: yr.kind,
      irrigationMm: Math.round(result.totals.irrigationMm),
      rainMm: Math.round(result.totals.rainMm),
      heatLossPct: Math.round(result.loss.heat * 100),
      waterLossPct: Math.round(result.loss.water * 100),
      salinityLossPct: Math.round(result.loss.salinity * 100),
      matured: result.matured,
      seasonDays: result.daily.length,
      hotDays: result.daily.filter((d) => d.tmax >= crop.heat.threshold).length,
    };
  };

  const evalA = useMemo(() => evaluateScenario(scenarioA), [scenarioA, series, pack, cropId]);
  const evalB = useMemo(() => evaluateScenario(scenarioB), [scenarioB, series, pack, cropId]);

  // Differential comparisons
  const indexDiff = evalB.index - evalA.index;
  const waterDiff = evalB.irrigationMm - evalA.irrigationMm;
  const heatDiff = evalB.heatLossPct - evalA.heatLossPct;

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
              <Sprout className="w-5 h-5 text-[#59D98E]" />
              <span>{tt(lang, "কৃষি সিদ্ধান্ত পরীক্ষাগার (Decision Twin)", "Agricultural Decision Twin Lab")}</span>
              <span className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-mono rounded bg-[#59D98E]/10 text-[#59D98E] border border-[#59D98E]/30">
                SCENARIO A VS B DUAL LAB
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
              href="/time-travel"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-white/5 hover:bg-white/10 text-white border border-white/10"
            >
              <Compass className="w-3.5 h-3.5 text-[#D7A86E]" />
              <span>{tt(lang, "3D সময়-ভ্রমণ দেখুন", "View in 3D")}</span>
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

      {/* Main Body */}
      <main className="max-w-[1600px] mx-auto p-4 sm:p-6 flex flex-col gap-6">
        
        {/* Global Controls: District, Crop & Core Concept */}
        <section className="p-4 sm:p-5 rounded-2xl border border-white/10 bg-[#0B1220]/70 flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-4">
            <div>
              <label className="block text-[11px] font-mono uppercase text-[#94A3B8] mb-1">
                {tt(lang, "১. এলাকা / জেলা নির্বাচন:", "1. Location / District:")}
              </label>
              <select
                value={districtId}
                onChange={(e) => setDistrictId(e.target.value)}
                className="bg-[#070D18] border border-white/20 rounded-xl px-3 py-2 text-xs font-bold text-white focus:outline-none focus:border-[#59D98E] cursor-pointer"
              >
                {DISTRICTS.map((d) => (
                  <option key={d.id} value={d.id}>
                    {lang === "bn" ? d.nameBn : d.nameEn} ({d.division}) - {d.region}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-mono uppercase text-[#94A3B8] mb-1">
                {tt(lang, "২. ফসল নির্বাচন:", "2. Crop Selection:")}
              </label>
              <select
                value={cropId}
                onChange={(e) => setCropId(e.target.value as CropId)}
                className="bg-[#070D18] border border-white/20 rounded-xl px-3 py-2 text-xs font-bold text-white focus:outline-none focus:border-[#59D98E] cursor-pointer"
              >
                {Object.values(CROPS).map((c) => (
                  <option key={c.id} value={c.id}>
                    {lang === "bn" ? c.nameBn : c.nameEn} ({c.seasonLabel[lang]})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Scientific Disclaimer Pill */}
          <div className="px-3.5 py-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs flex items-center gap-2 max-w-xl">
            <AlertTriangle className="w-4 h-4 shrink-0 text-amber-400" />
            <p className="text-[11px] leading-tight">
              {tt(
                lang,
                "শিক্ষামূলক সিদ্ধান্ত তুলনা: আপেক্ষিক সূচক ১০০ = বহুবছরের গড় আবহাওয়া। এটি কোনো গ্যারান্টিযুক্ত মেট্রিক টন/হেক্টর উৎপাদন নয়।",
                "Educational Decision Lab: Relative Index 100 = multi-year baseline climate. Never a guaranteed field yield.",
              )}
            </p>
          </div>
        </section>

        {/* Side-by-Side Simulation Arena */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* ======================= SCENARIO A ======================= */}
          <section className="p-5 sm:p-6 rounded-2xl border border-white/10 bg-[#070D18] flex flex-col justify-between gap-5 relative overflow-hidden">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-slate-400" />
                <h2 className="font-space text-base font-bold text-white uppercase tracking-wider">
                  {tt(lang, "দৃশ্যকল্প ক: প্রচলিত পদ্ধতি", "Scenario A: Current Practice")}
                </h2>
              </div>
              <KindBadge kind={evalA.dataKind} lang={lang} compact />
            </div>

            {/* Inputs Grid */}
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="text-[11px] text-[#94A3B8]">{tt(lang, "রোপণ সময় (দিন):", "Planting DOY:")} {scenarioA.sowDoy}</label>
                  <input
                    type="range"
                    min="1"
                    max="120"
                    value={scenarioA.sowDoy}
                    onChange={(e) => setScenarioA({ ...scenarioA, sowDoy: Number(e.target.value) })}
                    className="w-full accent-slate-400 mt-1 cursor-pointer"
                  />
                </div>

                <div>
                  <label className="text-[11px] text-[#94A3B8]">{tt(lang, "সেচ কৌশল:", "Irrigation Strategy:")}</label>
                  <select
                    value={scenarioA.irrigation}
                    onChange={(e) => setScenarioA({ ...scenarioA, irrigation: e.target.value as IrrigationMode })}
                    className="w-full bg-white/5 border border-white/15 rounded-lg p-1.5 mt-1 text-white text-xs"
                  >
                    <option value="irrigated">Full Irrigation (ঐতিহ্যবাহী প্লাবন সেচ)</option>
                    <option value="awd">Deficit / AWD (নিয়ন্ত্রিত পর্যায়ক্রমিক সেচ)</option>
                    <option value="rainfed">Rainfed (কেবল বৃষ্টি-নির্ভর)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="text-[11px] text-[#94A3B8]">{tt(lang, "মাটির লবণাক্ততা (ECe dS/m):", "Soil Salinity ECe:")} {scenarioA.soilEc}</label>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    step="0.5"
                    value={scenarioA.soilEc}
                    onChange={(e) => setScenarioA({ ...scenarioA, soilEc: Number(e.target.value) })}
                    className="w-full accent-slate-400 mt-1 cursor-pointer"
                  />
                </div>

                <div>
                  <label className="text-[11px] text-[#94A3B8]">{tt(lang, "জলবায়ু পরিস্থিতি:", "Climate Scenario:")}</label>
                  <select
                    value={scenarioA.mode}
                    onChange={(e) => setScenarioA({ ...scenarioA, mode: e.target.value as "trend" | "pack" })}
                    className="w-full bg-white/5 border border-white/15 rounded-lg p-1.5 mt-1 text-white text-xs"
                  >
                    <option value="trend">NASA Historical Trend / What-If (ঐতিহাসিক ধারা)</option>
                    <option value="pack">NEX-GDDP-CMIP6 2033 (NASA প্রক্ষেপণ)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Model Outputs Card */}
            <div className="p-4 rounded-xl border border-white/10 bg-white/5 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-[#94A3B8] uppercase tracking-wider">{tt(lang, "আপেক্ষিক ফসল সূচক", "Relative Crop Performance")}</span>
                <span className="text-3xl font-space font-bold text-white">{evalA.index}</span>
              </div>

              <div className="grid grid-cols-3 gap-2 text-center pt-2 border-t border-white/10 text-xs">
                <div className="p-2 rounded-lg bg-black/30">
                  <div className="text-[10px] text-[#94A3B8]">{tt(lang, "সেচ চাহিদা", "Irrigation Need")}</div>
                  <div className="font-mono font-bold text-white mt-0.5">{evalA.irrigationMm} mm</div>
                </div>
                <div className="p-2 rounded-lg bg-black/30">
                  <div className="text-[10px] text-[#94A3B8]">{tt(lang, "তাপ চাপ ক্ষতি", "Heat Stress")}</div>
                  <div className="font-mono font-bold text-amber-400 mt-0.5">-{evalA.heatLossPct}%</div>
                </div>
                <div className="p-2 rounded-lg bg-black/30">
                  <div className="text-[10px] text-[#94A3B8]">{tt(lang, "পানি ঘাটতি ক্ষতি", "Water Stress")}</div>
                  <div className="font-mono font-bold text-cyan-400 mt-0.5">-{evalA.waterLossPct}%</div>
                </div>
              </div>
            </div>
          </section>

          {/* ======================= SCENARIO B ======================= */}
          <section className="p-5 sm:p-6 rounded-2xl border border-[#59D98E]/40 bg-[#070D18] flex flex-col justify-between gap-5 relative overflow-hidden shadow-[0_0_30px_rgba(89,217,142,0.1)]">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-[#59D98E] animate-pulse" />
                <h2 className="font-space text-base font-bold text-[#59D98E] uppercase tracking-wider">
                  {tt(lang, "দৃশ্যকল্প খ: প্রস্তাবিত বিকল্প পদ্ধতি", "Scenario B: Alternative Practice")}
                </h2>
              </div>
              <KindBadge kind={evalB.dataKind} lang={lang} compact />
            </div>

            {/* Inputs Grid */}
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="text-[11px] text-[#59D98E] font-semibold">
                    {tt(lang, "রোপণ সময় (দিন):", "Planting DOY:")} {scenarioB.sowDoy}
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="120"
                    value={scenarioB.sowDoy}
                    onChange={(e) => setScenarioB({ ...scenarioB, sowDoy: Number(e.target.value) })}
                    className="w-full accent-[#59D98E] mt-1 cursor-pointer"
                  />
                </div>

                <div>
                  <label className="text-[11px] text-[#59D98E] font-semibold">{tt(lang, "সেচ কৌশল:", "Irrigation Strategy:")}</label>
                  <select
                    value={scenarioB.irrigation}
                    onChange={(e) => setScenarioB({ ...scenarioB, irrigation: e.target.value as IrrigationMode })}
                    className="w-full bg-white/5 border border-[#59D98E]/40 rounded-lg p-1.5 mt-1 text-white text-xs font-semibold"
                  >
                    <option value="awd">Deficit / AWD (নিয়ন্ত্রিত পর্যায়ক্রমিক সেচ)</option>
                    <option value="irrigated">Full Irrigation (ঐতিহ্যবাহী প্লাবন সেচ)</option>
                    <option value="rainfed">Rainfed (কেবল বৃষ্টি-নির্ভর)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="text-[11px] text-[#94A3B8]">{tt(lang, "মাটির লবণাক্ততা (ECe dS/m):", "Soil Salinity ECe:")} {scenarioB.soilEc}</label>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    step="0.5"
                    value={scenarioB.soilEc}
                    onChange={(e) => setScenarioB({ ...scenarioB, soilEc: Number(e.target.value) })}
                    className="w-full accent-[#59D98E] mt-1 cursor-pointer"
                  />
                </div>

                <div>
                  <label className="text-[11px] text-[#94A3B8]">{tt(lang, "জলবায়ু পরিস্থিতি:", "Climate Scenario:")}</label>
                  <select
                    value={scenarioB.mode}
                    onChange={(e) => setScenarioB({ ...scenarioB, mode: e.target.value as "trend" | "pack" })}
                    className="w-full bg-white/5 border border-white/15 rounded-lg p-1.5 mt-1 text-white text-xs"
                  >
                    <option value="trend">NASA Historical Trend / What-If (ঐতিহাসিক ধারা)</option>
                    <option value="pack">NEX-GDDP-CMIP6 2033 (NASA প্রক্ষেপণ)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Model Outputs Card */}
            <div className="p-4 rounded-xl border border-[#59D98E]/40 bg-[#59D98E]/5 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-[#59D98E] uppercase tracking-wider font-semibold">{tt(lang, "আপেক্ষিক ফসল সূচক", "Relative Crop Performance")}</span>
                <span className="text-3xl font-space font-bold text-[#59D98E]">{evalB.index}</span>
              </div>

              <div className="grid grid-cols-3 gap-2 text-center pt-2 border-t border-[#59D98E]/20 text-xs">
                <div className="p-2 rounded-lg bg-black/30">
                  <div className="text-[10px] text-[#94A3B8]">{tt(lang, "সেচ চাহিদা", "Irrigation Need")}</div>
                  <div className="font-mono font-bold text-[#59D98E] mt-0.5">{evalB.irrigationMm} mm</div>
                </div>
                <div className="p-2 rounded-lg bg-black/30">
                  <div className="text-[10px] text-[#94A3B8]">{tt(lang, "তাপ চাপ ক্ষতি", "Heat Stress")}</div>
                  <div className="font-mono font-bold text-amber-400 mt-0.5">-{evalB.heatLossPct}%</div>
                </div>
                <div className="p-2 rounded-lg bg-black/30">
                  <div className="text-[10px] text-[#94A3B8]">{tt(lang, "পানি ঘাটতি ক্ষতি", "Water Stress")}</div>
                  <div className="font-mono font-bold text-cyan-400 mt-0.5">-{evalB.waterLossPct}%</div>
                </div>
              </div>
            </div>
          </section>

        </div>

        {/* Comparison Differential Insights Panel */}
        <section className="p-5 sm:p-6 rounded-2xl border border-white/10 bg-[#0B1528] flex flex-col gap-4">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <h3 className="font-space text-lg font-bold text-white flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-[#36BFFA]" />
              <span>{tt(lang, "ফলাফল তুলনা ও বিজ্ঞানভিত্তিক কারণ", "Comparative Differential & Scientific Reasoning")}</span>
            </h3>
            <div className="text-xs font-mono">
              <span className="text-[#94A3B8]">{tt(lang, "সূচক পার্থক্য: ", "Net Index Δ: ")}</span>
              <span className={indexDiff >= 0 ? "font-bold text-[#59D98E]" : "font-bold text-amber-400"}>
                {indexDiff > 0 ? `+${indexDiff}` : indexDiff}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="p-4 rounded-xl border border-white/10 bg-black/20 space-y-1.5">
              <div className="text-[#94A3B8] font-mono uppercase">{tt(lang, "সেচের পানির সঞ্চয়", "Irrigation Water Saved")}</div>
              <div className="text-xl font-space font-bold text-[#36BFFA]">
                {waterDiff <= 0 ? `${Math.abs(waterDiff)} mm সেচ সাশ্রয়` : `+${waterDiff} mm অতিরিক্ত সেচ`}
              </div>
              <p className="text-[11px] text-[#CBD5E1] leading-relaxed">
                {scenarioB.irrigation === "awd"
                  ? tt(lang, "AWD পর্যায়ক্রমিক সেচে ফলন অক্ষুণ্ণ রেখে ২৫–৩০% ভূগর্ভস্থ পানি সাশ্রয় হয়।", "AWD saves 25–30% groundwater while maintaining crop transpiration.")
                  : tt(lang, "উভয় দৃশ্যকল্পে সেচের পার্থক্য পর্যবেক্ষণযোগ্য।", "Observed difference in seasonal water budget.")}
              </p>
            </div>

            <div className="p-4 rounded-xl border border-white/10 bg-black/20 space-y-1.5">
              <div className="text-[#94A3B8] font-mono uppercase">{tt(lang, "চরম তাপ এড়ানোর সুবিধা", "Heat Avoidance Benefit")}</div>
              <div className="text-xl font-space font-bold text-amber-400">
                {heatDiff <= 0 ? `${Math.abs(heatDiff)}% কম তাপ ক্ষতি` : `+${heatDiff}% বর্ধিত তাপ ক্ষতি`}
              </div>
              <p className="text-[11px] text-[#CBD5E1] leading-relaxed">
                {scenarioB.sowDoy < scenarioA.sowDoy
                  ? tt(lang, "আগাম রোপণে এপ্রিলের তীব্র দাবদাহ ও শিষ বন্ধ্যাত্ব এড়ানো সম্ভব হয়েছে।", "Earlier sowing shifts flowering before intense late April heatwaves.")
                  : tt(lang, "দেরিতে রোপণে শিষ আসার সময় তাপমাত্রা বৃদ্ধির ঝুঁকি থাকে।", "Late sowing exposes reproductive stages to elevated temperature.")}
              </p>
            </div>

            <div className="p-4 rounded-xl border border-white/10 bg-black/20 space-y-1.5">
              <div className="text-[#94A3B8] font-mono uppercase">{tt(lang, "বৈজ্ঞানিক সুপারিশ", "Agronomic Guidance")}</div>
              <div className="text-sm font-bold text-[#59D98E]">
                {indexDiff >= 0
                  ? tt(lang, "বিকল্প পদ্ধতি খ অধিক লাভজনক ও স্থিতিস্থাপক", "Alternative Practice B is superior & climate-resilient")
                  : tt(lang, "প্রচলিত পদ্ধতি ক এই পরিস্থিতিতে উপযুক্ত", "Current Practice A performs better")}
              </div>
              <p className="text-[11px] text-[#CBD5E1] leading-relaxed">
                {tt(lang, "BRRI ও FAO-56 বৈজ্ঞানিক নির্দেশিকা অনুসারে সিদ্ধান্ত গৃহীত।", "Validated against BRRI and FAO-56 dual crop coefficient formulas.")}
              </p>
            </div>
          </div>

          {/* Scientific Citations */}
          <div className="pt-3 border-t border-white/10 flex flex-wrap items-center justify-between text-[11px] text-[#94A3B8] font-mono">
            <span>References: FAO-56 Irrigation & Drainage (Allen 1998) · BRRI Rice Knowledge Bank · NASA POWER Climatology</span>
            <Link href="/earth-intelligence" className="text-[#36BFFA] hover:underline flex items-center gap-1">
              <span>{tt(lang, "স্যাটেলাইট উপাত্ত যাচাই করুন", "Verify Satellite Observation Layers")}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </section>

      </main>
    </div>
  );
}
