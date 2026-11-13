"use client";

import React from "react";
import type { Command } from "@/lib/timetravel/commands";
import type { TTState, View } from "@/lib/timetravel/engine";
import { seasonLength } from "@/lib/timetravel/engine";
import { CROP_LIST, CROPS, STAGE_LABEL } from "@/lib/timetravel/crops";
import { DISTRICTS, DIVISIONS, REGION_LABELS, asciiToBnDigits, getDistrict } from "@/lib/timetravel/locations";
import { HAZARD_LIST, describeSeverity } from "@/lib/timetravel/hazards";
import { AGENCIES, KRISHI_CALL_CENTER, NATIONAL_EMERGENCY } from "@/lib/timetravel/gov";
import { KIND_EXPLAIN } from "@/lib/timetravel/kind-labels";
import { localizeNote } from "@/lib/timetravel/notes-bn";
import { irrigationLabel } from "@/lib/timetravel/crops";
import type { ClimateSeries, IrrigationMode } from "@/lib/timetravel/types";
import { ClimateChart, IndexBar, StageTimeline } from "./charts";
import { CropCatalogue } from "./CropCatalogue";
import { Btn, Chip, ExtLink, KindBadge, Notice, RangeField, Section, Stat, tt } from "./primitives";

export type DataStatus = "bundled" | "loading" | "live" | "cache" | "stand-in" | "error";

export function PlacePanel({ state, view, series, dataStatus, dispatch, packLoaded }: { state: TTState; view: View; series: ClimateSeries; dataStatus: DataStatus; dispatch: (c: Command) => void; packLoaded: boolean }) {
  const lang = state.lang;
  const d = getDistrict(state.districtId);
  const region = d ? REGION_LABELS[d.region] : null;
  const divId = d?.division ?? "rajshahi";
  const inDiv = DISTRICTS.filter((x) => x.division === divId);
  const prov = series.provenance;
  return (
    <div>
      <Section title={tt(lang, "স্থান", "Place")}>
        <div className="grid grid-cols-2 gap-3">
          <label className="text-sm text-primary-text">
            {tt(lang, "বিভাগ", "Division")}
            <select
              value={divId}
              onChange={(e) => {
                const first = DISTRICTS.find((x) => x.division === e.target.value);
                if (first) dispatch({ type: "setDistrict", id: first.id });
              }}
              className="mt-1 w-full rounded-lg border border-white/15 bg-surface px-2 py-2 text-sm"
            >
              {DIVISIONS.map((x) => (
                <option key={x.id} value={x.id}>
                  {lang === "bn" ? x.name.bn : x.name.en}
                </option>
              ))}
            </select>
          </label>
          <label className="text-sm text-primary-text">
            {tt(lang, "জেলা", "District")}
            <select value={state.districtId} onChange={(e) => dispatch({ type: "setDistrict", id: e.target.value })} className="mt-1 w-full rounded-lg border border-white/15 bg-surface px-2 py-2 text-sm">
              {inDiv.map((x) => (
                <option key={x.id} value={x.id}>
                  {lang === "bn" ? x.nameBn : x.nameEn}
                </option>
              ))}
            </select>
          </label>
        </div>
        {region && (
          <p className="text-xs text-muted-text">
            <strong className="text-primary-text">{lang === "bn" ? region.bn : region.en}.</strong> {lang === "bn" ? region.blurb.bn : region.blurb.en}{" "}
            {tt(lang, "(দৃশ্যের ধরন ইঙ্গিতমূলক, সরকারি কৃষি-পরিবেশ অঞ্চল নয়)", "(scene style is indicative, not an official agro-ecological zone)")}
          </p>
        )}
      </Section>

      <Section title={tt(lang, "তথ্যের অবস্থা", "Data status")}>
        <div className="flex flex-wrap items-center gap-2">
          <KindBadge kind={view.dataKind} lang={lang} />
          <span className="text-xs text-muted-text">
            {dataStatus === "loading" && tt(lang, "NASA POWER থেকে লোড হচ্ছে…", "Loading from NASA POWER…")}
            {dataStatus === "bundled" &&
              (series.provenance.origin === "nasa-power-bundled"
                ? tt(
                    lang,
                    `অ্যাপের সঙ্গে আসা আসল NASA POWER মাসিক তথ্য (${asciiToBnDigits(`${series.startYear}–${series.endYear}`)}, সংগ্রহ ${asciiToBnDigits(series.provenance.retrievedAt?.slice(0, 10) ?? "")})`,
                    `Real NASA POWER monthly data bundled at build time (${series.startYear}–${series.endYear}, retrieved ${series.provenance.retrievedAt?.slice(0, 10)})`,
                  )
                : tt(lang, `অ্যাপের সঙ্গে আসা আসল NASA POWER ফাইল (${series.name}, ${series.startYear}–${series.endYear})`, `Real NASA POWER file shipped with the app (${series.name}, ${series.startYear}–${series.endYear})`))}
            {dataStatus === "live" && tt(lang, "NASA POWER থেকে এইমাত্র আনা", "Just fetched from NASA POWER")}
            {dataStatus === "cache" && tt(lang, "NASA POWER (ব্রাউজারে ১৪ দিনের ক্যাশ)", "NASA POWER (14-day browser cache)")}
          </span>
        </div>
        {(dataStatus === "stand-in" || dataStatus === "error") && (
          <Notice tone="warn">
            {tt(
              lang,
              "এই জেলার জন্য NASA POWER থেকে তথ্য আনা যায়নি (ইন্টারনেট/ব্লক হতে পারে)। রাজশাহীর আসল তথ্য ‘বদলি’ হিসেবে দেখানো হচ্ছে — এটি আপনার জেলার তথ্য নয়।",
              "Could not load NASA POWER data for this district (you may be offline or blocked). Real Rajshahi data is shown as a stand-in — it is NOT this district's data.",
            )}
          </Notice>
        )}
        <p className="text-xs text-muted-text">{lang === "bn" ? KIND_EXPLAIN[view.dataKind].bn : KIND_EXPLAIN[view.dataKind].en}</p>
        {view.notes.length > 0 && (
          <details className="text-xs text-muted-text">
            <summary className="cursor-pointer text-earth-cyan">{tt(lang, "এই বছরের তথ্য কীভাবে তৈরি", "How this year's data was built")}</summary>
            <ul className="mt-1 list-disc space-y-1 pl-5">
              {view.notes.map((n, i) => (
                <li key={i}>{localizeNote(n, lang)}</li>
              ))}
            </ul>
          </details>
        )}
        <p className="text-[11px] text-muted-text">
          {lang === "bn"
            ? `উৎস: NASA POWER (নাসা ল্যাংলি রিসার্চ সেন্টার) · দৈনিক সর্বোচ্চ ও সর্বনিম্ন তাপমাত্রা এবং বৃষ্টি · ${asciiToBnDigits(`${series.startYear}–${series.endYear}`)}`
            : `${prov.provider} · ${prov.dataset} · ${prov.parameters.join(", ")} · ${series.startYear}–${series.endYear}`}
        </p>
      </Section>

      <Section title={tt(lang, "‘ধরে-নিই’ পরিস্থিতি", "What-if scenario")} hint={tt(lang, "এগুলো আপনার বেছে নেওয়া ধারণা — পূর্বাভাস নয়। ০ মানে কোনো পরিবর্তন নয়।", "These are your own assumptions — not forecasts. 0 means no change.")}>
        <div className="flex flex-wrap gap-2">
          <Chip active={state.scenario.mode === "trend"} onClick={() => dispatch({ type: "setScenario", patch: { mode: "trend" } })}>
            {tt(lang, "পর্যবেক্ষিত প্রবণতা", "Observed trend")}
          </Chip>
          <Chip
            active={state.scenario.mode === "pack"}
            disabled={!packLoaded}
            title={packLoaded ? undefined : tt(lang, "এই নির্বাচিত বছরের জন্য NEX-GDDP-CMIP6 প্যাক নেই", "No NEX-GDDP-CMIP6 pack for the selected year")}
            onClick={() => dispatch({ type: "setScenario", patch: { mode: "pack" } })}
          >
            NASA NEX-GDDP-CMIP6 · SSP2-4.5 ({tt(lang, "২০৩৩", "2033")}) {packLoaded ? "" : tt(lang, "(এই বছরের প্যাক নেই)", "(no pack for this year)")}
          </Chip>
        </div>
        <RangeField id="dt" label={tt(lang, "অতিরিক্ত উষ্ণতা (°C)", "Extra warming (°C)")} value={state.scenario.dT} min={0} max={4} step={0.5} onChange={(v) => dispatch({ type: "setScenario", patch: { dT: v } })} format={(v) => `+${v.toFixed(1)}`} />
        <RangeField id="rm" label={tt(lang, "বর্ষার বৃষ্টি (জুন–সেপ্টেম্বর)", "Monsoon rain (Jun–Sep)")} value={state.scenario.rainMonsoonPct} min={-40} max={40} step={5} onChange={(v) => dispatch({ type: "setScenario", patch: { rainMonsoonPct: v } })} format={(v) => `${v > 0 ? "+" : ""}${v}%`} />
        <RangeField id="rd" label={tt(lang, "শুকনো মৌসুমের বৃষ্টি", "Dry-season rain")} value={state.scenario.rainDryPct} min={-60} max={60} step={10} onChange={(v) => dispatch({ type: "setScenario", patch: { rainDryPct: v } })} format={(v) => `${v > 0 ? "+" : ""}${v}%`} />
      </Section>

      <Section title={tt(lang, "মাটি ও সেচ", "Soil & irrigation")}>
        <RangeField id="ec" label={tt(lang, "মাটির লবণাক্ততা ECe (dS/m)", "Soil salinity ECe (dS/m)")} value={state.soilEc} min={0} max={16} step={0.5} onChange={(v) => dispatch({ type: "setSoilEc", ec: v })} />
        <div className="flex flex-wrap gap-2" role="group" aria-label={tt(lang, "সেচ পদ্ধতি", "Irrigation mode")}>
          {(["irrigated", "awd", "rainfed"] as IrrigationMode[]).map((m) => (
            <Chip key={m} active={state.irrigation === m} onClick={() => dispatch({ type: "setIrrigation", mode: m })}>
              {lang === "bn" ? irrigationLabel(m).bn : irrigationLabel(m).en}
            </Chip>
          ))}
        </div>
        <label className="flex min-h-[44px] items-center gap-2 text-sm text-primary-text">
          <input type="checkbox" checked={state.tolerant} onChange={(e) => dispatch({ type: "setTolerant", value: e.target.checked })} className="h-5 w-5 accent-[#59d98e]" />
          {tt(lang, "নিমজ্জন-সহনশীল জাত ধরা (শুধু ধান)", "Assume a submergence-tolerant variety (rice only)")}
        </label>
      </Section>
    </div>
  );
}

export function CropPanel({ state, view, base, dispatch }: { state: TTState; view: View; base: View["baselineYear"]; dispatch: (c: Command) => void }) {
  const lang = state.lang;
  const crop = CROPS[state.cropId];
  const s = view.sim;
  const total = seasonLength(view);
  const lossNames: Record<string, { bn: string; en: string }> = {
    heat: { bn: "তাপ", en: "Heat" },
    cold: { bn: "ঠান্ডা", en: "Cold" },
    water: { bn: "পানির চাপ", en: "Water stress" },
    salinity: { bn: "লবণাক্ততা", en: "Salinity" },
    flood: { bn: "বন্যা", en: "Flood" },
    cyclone: { bn: "ঘূর্ণিঝড়", en: "Cyclone" },
  };
  return (
    <div>
      <Section title={tt(lang, "ফসল", "Crop")}>
        <div className="flex flex-wrap gap-2" role="group" aria-label={tt(lang, "ফসল বাছুন", "Choose crop")}>
          {CROP_LIST.map((c) => (
            <Chip key={c.id} active={state.cropId === c.id} onClick={() => dispatch({ type: "setCrop", crop: c.id })}>
              {lang === "bn" ? c.nameBn : c.nameEn}
            </Chip>
          ))}
        </div>
        <p className="text-xs text-muted-text">
          {lang === "bn" ? crop.seasonLabel.bn : crop.seasonLabel.en} · {tt(lang, "সাধারণ মেয়াদ", "typical duration")} {crop.typicalDays[0]}–{crop.typicalDays[1]} {tt(lang, "দিন", "days")}
        </p>
        <p className="text-xs text-muted-text">{lang === "bn" ? crop.note.bn : crop.note.en}</p>
      </Section>

      <CropCatalogue lang={lang} />

      <Section title={tt(lang, "আপেক্ষিক ফলন সূচক", "Relative yield index")} hint={tt(lang, "বহুবছরের গড় আবহাওয়ায় একই ফসল = ১০০। এটি শিক্ষামূলক সংখ্যা, বাস্তব ফলনের নিশ্চয়তা নয়।", "The same crop under the multi-year mean weather = 100. An educational number, not a guaranteed real yield.")}>
        <div className="flex items-end justify-between">
          <div className="font-space text-4xl font-bold tabular-nums text-agri-green">{view.index.toFixed(0)}</div>
          <KindBadge kind={view.dataKind} lang={lang} compact />
        </div>
        <IndexBar value={view.index} lang={lang} />
        <div className="grid grid-cols-3 gap-2">
          <Stat label={tt(lang, "পাকতে লাগে", "Days to mature")} value={s.maturityDay ?? "—"} sub={s.matured ? undefined : tt(lang, "পাকেনি", "did not mature")} />
          <Stat label={tt(lang, "বৃষ্টি (মিমি)", "Rain (mm)")} value={s.totals.rainMm.toFixed(0)} />
          <Stat label={tt(lang, "সেচ (মিমি)", "Irrigation (mm)")} value={s.totals.irrigationMm.toFixed(0)} />
        </div>
        <div>
          <h4 className="text-xs font-semibold uppercase tracking-wide text-muted-text">{tt(lang, "মডেলের ক্ষতির উপাদান", "Modelled loss factors")}</h4>
          <ul className="mt-1 grid grid-cols-2 gap-x-3 gap-y-1 text-xs">
            {Object.entries(s.loss).map(([k, v]) => (
              <li key={k} className="flex justify-between border-b border-white/5 py-0.5">
                <span className="text-primary-text">{lang === "bn" ? lossNames[k].bn : lossNames[k].en}</span>
                <span className="tabular-nums text-muted-text">{(v * 100).toFixed(0)}%</span>
              </li>
            ))}
          </ul>
        </div>
        {s.notes.length > 0 && (
          <ul className="list-disc space-y-0.5 pl-5 text-[11px] text-muted-text">
            {s.notes.map((n, i) => (
              <li key={i}>{localizeNote(n, lang)}</li>
            ))}
          </ul>
        )}
      </Section>

      <Section title={tt(lang, "মৌসুমের ধাপ", "Season stages")}>
        <p className="text-xs text-muted-text">
          {tt(lang, "এখন", "Now")}: <strong className="text-primary-text">{lang === "bn" ? STAGE_LABEL[view.stage].bn : STAGE_LABEL[view.stage].en}</strong> · {tt(lang, "বপনের", "day")} {state.day} {tt(lang, "দিন পরে", "after sowing")}
        </p>
        <StageTimeline sim={s} day={state.day} lang={lang} total={total} />
      </Section>

      <Section title={tt(lang, "আবহাওয়া: এই বছর বনাম গড়", "Weather: this year vs mean")}>
        <ClimateChart year={view.monthly} base={base} lang={lang} monthMarker={view.date.m0} />
      </Section>
    </div>
  );
}

export function HazardPanel({ state, dispatch }: { state: TTState; dispatch: (c: Command) => void }) {
  const lang = state.lang;
  return (
    <div>
      <ul className="mt-4 space-y-3">
        {HAZARD_LIST.map((h) => {
          const ev = state.events.find((e) => e.type === h.id);
          return (
            <li key={h.id} className={`rounded-xl border p-4 ${ev ? "border-warning/60 bg-warning/5" : "border-white/10 bg-white/5"}`}>
              <div className="flex items-center justify-between gap-2">
                <h4 className="font-space text-base font-semibold text-primary-text">
                  <span aria-hidden>{h.icon} </span>
                  {lang === "bn" ? h.name.bn : h.name.en}
                </h4>
                <Btn variant={ev ? "danger" : "default"} pressed={!!ev} onClick={() => dispatch({ type: "toggleHazard", hazard: h.id })}>
                  {ev ? tt(lang, "বন্ধ করুন", "Turn off") : tt(lang, "দৃশ্য দেখান", "Show scene")}
                </Btn>
              </div>
              <p className="mt-1 text-sm text-muted-text">{lang === "bn" ? h.what.bn : h.what.en}</p>
              {ev && (
                <div className="mt-3 space-y-2 rounded-lg bg-black/20 p-3">
                  <RangeField id={`sev-${h.id}`} label={tt(lang, "মাত্রা (শিক্ষামূলক)", "Strength (educational)")} value={ev.severity} min={0.1} max={1} step={0.05} onChange={(v) => dispatch({ type: "updateEvent", hazard: h.id, patch: { severity: v } })} format={(v) => v.toFixed(2)} hint={(lang === "bn" ? describeSeverity(h.id, ev.severity).bn : describeSeverity(h.id, ev.severity).en)} />
                  <RangeField id={`st-${h.id}`} label={tt(lang, "শুরু (বপনের দিন)", "Starts (day after sowing)")} value={ev.startDay} min={0} max={200} step={1} onChange={(v) => dispatch({ type: "updateEvent", hazard: h.id, patch: { startDay: v } })} />
                  <RangeField id={`du-${h.id}`} label={tt(lang, "স্থায়িত্ব (দিন)", "Duration (days)")} value={ev.days} min={1} max={40} step={1} onChange={(v) => dispatch({ type: "updateEvent", hazard: h.id, patch: { days: v } })} />
                  <button type="button" className="text-xs text-earth-cyan underline" onClick={() => dispatch({ type: "setDay", day: ev.startDay + Math.floor(ev.days / 2) })}>
                    {tt(lang, "সময়রেখায় এই ঘটনার মাঝখানে যান", "Jump to the middle of this event")}
                  </button>
                </div>
              )}
              <p className="mt-2 text-sm text-primary-text">
                <span className="font-semibold text-warning">{tt(lang, "ফসলে প্রভাব", "Effect on crop")}: </span>
                {lang === "bn" ? h.cropEffect.bn : h.cropEffect.en}
              </p>
              <details className="mt-2">
                <summary className="cursor-pointer text-sm text-earth-cyan">{tt(lang, "প্রস্তুতি ও করণীয়", "Preparation & what to do")}</summary>
                <ul className="mt-1 list-disc space-y-1 pl-5 text-sm text-primary-text">
                  {h.mitigation.map((m, i) => (
                    <li key={i}>{lang === "bn" ? m.bn : m.en}</li>
                  ))}
                </ul>
                <p className="mt-2 text-xs text-muted-text">
                  {tt(lang, "আসল সতর্কতা", "Real warnings")}:{" "}
                  {h.officialSources.map((id, i) => {
                    const a = AGENCIES.find((x) => x.id === id);
                    return a ? (
                      <span key={id}>
                        {i > 0 && ", "}
                        <ExtLink href={a.url}>{a.acronym}</ExtLink>
                      </span>
                    ) : null;
                  })}
                </p>
              </details>
            </li>
          );
        })}
      </ul>
      <p className="mt-4 text-xs text-muted-text">
        {tt(lang, "কৃষি পরামর্শ", "Farming advice")}: {KRISHI_CALL_CENTER} · {tt(lang, "জরুরি", "Emergency")}: {NATIONAL_EMERGENCY}
      </p>
    </div>
  );
}
