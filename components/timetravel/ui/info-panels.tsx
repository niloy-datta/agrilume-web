"use client";

import React, { useMemo, useState } from "react";
import type { Lang } from "@/lib/timetravel/types";
import { ACCESS_LABEL, INTEGRATION_LABEL, NASA_DATASETS, STAGE_LABELS, pipelineStages, usedCount } from "@/lib/timetravel/nasa-datasets";
import { AGENCIES, KRISHI_CALL_CENTER, NATIONAL_EMERGENCY, ROLE_LABEL } from "@/lib/timetravel/gov";
import type { AgencyRole } from "@/lib/timetravel/gov";
import { CIRCULAR_LOOPS, DEFAULT_SHARES, PATHWAYS, RESIDUE_COEFFS, computeRecycling, fromHectares, irrigationVolumeM3, pondAreaM2, toHectares } from "@/lib/timetravel/recycling";
import type { AreaUnit, PathwayId, Shares } from "@/lib/timetravel/recycling";
import { CROPS, CROP_LIST } from "@/lib/timetravel/crops";
import type { CropId } from "@/lib/timetravel/crops";
import { asciiToBnDigits } from "@/lib/timetravel/locations";
import { localizeNote } from "@/lib/timetravel/notes-bn";
import { ExtLink, Notice, RangeField, Section, Stat, tt } from "./primitives";

const num = (lang: Lang, n: number, d = 1) => {
  const s = n.toLocaleString("en-US", { maximumFractionDigits: d, minimumFractionDigits: 0 });
  return lang === "bn" ? asciiToBnDigits(s) : s;
};

/* ------------------------------ NASA data registry ------------------------------ */

export function DataRegistry({ lang }: { lang: Lang }) {
  const { used, total } = usedCount();
  return (
    <div>
      <Notice tone="warn">
        {tt(
          lang,
          `${total}টি NASA ডেটাসেটের মধ্যে ${used}টি এই ওয়েব-অ্যাপে সত্যিই ব্যবহৃত হচ্ছে। বাকিগুলোর অবস্থা নিচে সৎভাবে লেখা — "নথিভুক্ত মাত্র" মানে এখনো কোনো সংখ্যা এই অ্যাপে আসে না।`,
          `Of ${total} NASA datasets, ${used} are actually used in this web app. The rest are labelled honestly below — "Registered only" means no numbers from it appear in this app yet.`,
        )}
      </Notice>
      <ul className="mt-4 space-y-3">
        {NASA_DATASETS.map((d) => {
          const live = d.integration === "live-in-browser" || d.integration === "bundled-real";
          return (
            <li key={d.id} className="rounded-xl border border-white/10 bg-white/5 p-4">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <h4 className="font-space text-base font-semibold text-primary-text">{lang === "bn" ? d.name.bn : d.name.en}</h4>
                <span className={`rounded-full border px-2.5 py-0.5 text-xs font-semibold ${live ? "border-agri-green/60 text-agri-green" : "border-white/20 text-muted-text"}`}>
                  <span aria-hidden>{live ? "● " : "○ "}</span>
                  {lang === "bn" ? INTEGRATION_LABEL[d.integration].bn : INTEGRATION_LABEL[d.integration].en}
                </span>
              </div>
              <ol className="mt-2 flex flex-wrap gap-1.5" aria-label={tt(lang, "একীকরণের ধাপ", "Integration stages")}>
                {(Object.entries(pipelineStages(d)) as [keyof typeof STAGE_LABELS, boolean][]).map(([k, done]) => (
                  <li key={k} className={`rounded-md border px-2 py-0.5 text-[11px] ${done ? "border-agri-green/50 text-agri-green" : "border-white/15 text-muted-text line-through decoration-white/30"}`}>
                    <span aria-hidden>{done ? "✓ " : "✗ "}</span>
                    <span className="sr-only">{done ? tt(lang, "হ্যাঁ: ", "yes: ") : tt(lang, "না: ", "no: ")}</span>
                    {lang === "bn" ? STAGE_LABELS[k].bn : STAGE_LABELS[k].en}
                  </li>
                ))}
              </ol>
              <dl className="mt-2 grid grid-cols-1 gap-x-4 gap-y-1 text-xs text-muted-text sm:grid-cols-2">
                <div>
                  <dt className="inline text-primary-text">{tt(lang, "ভেরিয়েবল", "Variables")}: </dt>
                  <dd className="inline">{d.variables}</dd>
                </div>
                <div>
                  <dt className="inline text-primary-text">{tt(lang, "রেজোলিউশন", "Resolution")}: </dt>
                  <dd className="inline">
                    {d.spatial}; {d.temporal}
                  </dd>
                </div>
                <div>
                  <dt className="inline text-primary-text">{tt(lang, "প্রবেশাধিকার", "Access")}: </dt>
                  <dd className="inline">{lang === "bn" ? ACCESS_LABEL[d.access].bn : ACCESS_LABEL[d.access].en}</dd>
                </div>
                <div>
                  <dt className="inline text-primary-text">{tt(lang, "প্রদানকারী", "Provider")}: </dt>
                  <dd className="inline">{d.provider}</dd>
                </div>
              </dl>
              <p className="mt-2 text-sm text-primary-text">
                <span className="font-semibold text-agri-green">{tt(lang, "কৃষিতে ব্যবহার", "Farming use")}: </span>
                {lang === "bn" ? d.farmingUse.bn : d.farmingUse.en}
              </p>
              <p className="mt-1 text-sm text-muted-text">
                <span className="font-semibold text-warning">{tt(lang, "সীমাবদ্ধতা", "Limitation")}: </span>
                {lang === "bn" ? d.limitation.bn : d.limitation.en}
              </p>
              <p className="mt-1 text-xs text-muted-text">
                {lang === "bn" ? d.integrationNote.bn : d.integrationNote.en} · <ExtLink href={d.portal}>{tt(lang, "NASA পোর্টাল", "NASA portal")}</ExtLink>
              </p>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

/* ----------------------------- Government directory ----------------------------- */

const ROLE_ORDER: AgencyRole[] = ["extension", "weather", "flood", "disaster", "research", "soil", "market", "policy"];

export function GovDirectory({ lang }: { lang: Lang }) {
  const grouped = useMemo(() => ROLE_ORDER.map((r) => ({ r, items: AGENCIES.filter((a) => a.role === r) })).filter((g) => g.items.length > 0), []);
  return (
    <div>
      <div className="grid gap-3 sm:grid-cols-2">
        <a href={`tel:${KRISHI_CALL_CENTER}`} className="rounded-xl border border-agri-green/50 bg-agri-green/10 p-4 text-primary-text focus:outline-none focus-visible:ring-2 focus-visible:ring-earth-cyan">
          <div className="text-xs text-muted-text">{tt(lang, "কৃষি কল সেন্টার", "Krishi Call Centre")}</div>
          <div className="font-space text-2xl font-bold text-agri-green">{KRISHI_CALL_CENTER}</div>
          <div className="text-xs text-muted-text">{tt(lang, "কৃষি পরামর্শ — ফোন করুন", "Farming advice — tap to call")}</div>
        </a>
        <a href={`tel:${NATIONAL_EMERGENCY}`} className="rounded-xl border border-red-400/50 bg-red-500/10 p-4 text-primary-text focus:outline-none focus-visible:ring-2 focus-visible:ring-earth-cyan">
          <div className="text-xs text-muted-text">{tt(lang, "জাতীয় জরুরি সেবা", "National emergency")}</div>
          <div className="font-space text-2xl font-bold text-red-300">{NATIONAL_EMERGENCY}</div>
          <div className="text-xs text-muted-text">{tt(lang, "বন্যা/ঘূর্ণিঝড়ে বিপদে", "Life-threatening flood / cyclone")}</div>
        </a>
      </div>
      <div className="mt-4">
        <Notice>
          {tt(
            lang,
            "অ্যাগ্রিলিউম সরকারি সেবা নয় এবং এই সংস্থাগুলোর তথ্য কপি করে না — শুধু সংযোগ দেয়। সতর্কবার্তা ও সুপারিশের জন্য সংশ্লিষ্ট সংস্থার মূল সাইট অনুসরণ করুন।",
            "AgriLume is not an official government service and does not copy these agencies' data — it only links to them. Follow each agency's own site for warnings and recommendations.",
          )}
        </Notice>
      </div>
      {grouped.map(({ r, items }) => (
        <Section key={r} title={lang === "bn" ? ROLE_LABEL[r].bn : ROLE_LABEL[r].en}>
          <ul className="space-y-3">
            {items.map((a) => (
              <li key={a.id} className="rounded-xl border border-white/10 bg-white/5 p-4">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <h4 className="font-space text-base font-semibold text-primary-text">
                    {a.acronym} — {lang === "bn" ? a.name.bn : a.name.en}
                  </h4>
                  <ExtLink href={a.url}>{a.url.replace(/^https?:\/\//, "")}</ExtLink>
                </div>
                <p className="mt-1 text-sm text-muted-text">{lang === "bn" ? a.provides.bn : a.provides.en}</p>
                <p className="mt-1 text-sm text-primary-text">
                  <span className="font-semibold text-agri-green">{tt(lang, "এখানে কীভাবে কাজে লাগে", "How it helps here")}: </span>
                  {lang === "bn" ? a.useInAgrilume.bn : a.useInAgrilume.en}
                </p>
                {a.deepLinks && a.deepLinks.length > 0 && (
                  <ul className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs">
                    {a.deepLinks.map((l) => (
                      <li key={l.url}>
                        <ExtLink href={l.url}>{lang === "bn" ? l.label.bn : l.label.en}</ExtLink>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        </Section>
      ))}
    </div>
  );
}

/* ------------------------------- Recycling tool ------------------------------- */

const UNIT_LABEL: Record<AreaUnit, { bn: string; en: string }> = { ha: { bn: "হেক্টর", en: "hectare" }, acre: { bn: "একর", en: "acre" }, decimal: { bn: "শতাংশ", en: "decimal" } };

export function RecycleCalculator({ lang, crop: cropProp, onPickPathway, activePathway, irrigationMm }: { lang: Lang; crop?: CropId; onPickPathway?: (id: string | null) => void; activePathway?: string | null; irrigationMm?: number }) {
  const [crop, setCrop] = useState<CropId>(cropProp ?? "boro");
  const [unit, setUnit] = useState<AreaUnit>("decimal");
  const [area, setArea] = useState(100);
  const [yieldT, setYieldT] = useState(4.5);
  const [shares, setShares] = useState<Shares>({ ...DEFAULT_SHARES });
  const [ratio, setRatio] = useState<number | null>(null);

  const areaHa = toHectares(area, unit);
  const res = useMemo(() => computeRecycling({ crop, areaHa, grainYieldTHa: yieldT, shares, residueToGrain: ratio ?? undefined }), [crop, areaHa, yieldT, shares, ratio]);
  const coeff = RESIDUE_COEFFS[crop];
  const sumNow = Object.values(shares).reduce((a, b) => a + b, 0);
  const vol = irrigationMm != null ? irrigationVolumeM3(irrigationMm, areaHa) : null;

  const kg = (n: number) => `${num(lang, n, 0)} kg`;
  const t = (n: number) => `${num(lang, n, n < 1 ? 2 : 1)} t`;

  return (
    <div>
      <Notice tone="warn">
        {tt(
          lang,
          "এগুলো আনুমানিক হিসাব: সহগ (খড়/দানা অনুপাত ইত্যাদি) সাহিত্য-ভিত্তিক সাধারণ পরিসর; আপনার জাত, ফলন ও আর্দ্রতা অনুযায়ী বদলাবে। নিজের সংখ্যা দিয়ে সম্পাদনা করুন।",
          "These are estimates: coefficients (straw-to-grain ratio etc.) are typical literature ranges and vary with variety, yield and moisture. Edit them with your own numbers.",
        )}
      </Notice>

      <Section title={tt(lang, "আপনার জমি", "Your field")}>
        <div className="grid grid-cols-2 gap-3">
          <label className="text-sm text-primary-text">
            {tt(lang, "ফসল", "Crop")}
            <select value={crop} onChange={(e) => setCrop(e.target.value as CropId)} className="mt-1 w-full rounded-lg border border-white/15 bg-surface px-2 py-2 text-sm">
              {CROP_LIST.map((c) => (
                <option key={c.id} value={c.id}>
                  {lang === "bn" ? c.nameBn : c.nameEn}
                </option>
              ))}
            </select>
          </label>
          <label className="text-sm text-primary-text">
            {tt(lang, "জমির পরিমাণ", "Area")}
            <div className="mt-1 flex gap-1">
              <input type="number" min={0} step="any" value={area} onChange={(e) => setArea(Math.max(0, Number(e.target.value)))} className="w-full min-w-0 rounded-lg border border-white/15 bg-surface px-2 py-2 text-sm" />
              <select value={unit} onChange={(e) => { const u = e.target.value as AreaUnit; setArea(Math.round(fromHectares(areaHa, u) * 100) / 100); setUnit(u); }} className="rounded-lg border border-white/15 bg-surface px-1 py-2 text-sm" aria-label={tt(lang, "একক", "Unit")}>
                {(Object.keys(UNIT_LABEL) as AreaUnit[]).map((u) => (
                  <option key={u} value={u}>
                    {lang === "bn" ? UNIT_LABEL[u].bn : UNIT_LABEL[u].en}
                  </option>
                ))}
              </select>
            </div>
          </label>
        </div>
        <RangeField id="rc-yield" label={tt(lang, "দানার ফলন (টন/হেক্টর)", "Grain yield (t/ha)")} value={yieldT} min={1} max={9} step={0.1} onChange={setYieldT} format={(v) => num(lang, v)} />
        <div className="grid grid-cols-3 gap-2">
          <Stat label={tt(lang, "জমি", "Field")} value={`${num(lang, areaHa, 3)} ha`} />
          <Stat label={tt(lang, "দানা/ধান", "Grain")} value={t(res.grainT)} />
          <Stat label={coeff.residueName[lang]} value={t(res.residueT.typ)} sub={`${num(lang, res.residueT.min)}–${num(lang, res.residueT.max)} t`} />
        </div>
        {res.huskT && <Stat label={tt(lang, "তুষ (ধানের)", "Rice husk")} value={t(res.huskT.typ)} sub={`${num(lang, res.huskT.min, 2)}–${num(lang, res.huskT.max, 2)} t`} />}
        <div>
          <label className="text-sm text-primary-text" htmlFor="rc-ratio">
            {tt(lang, "আপনার নিজের খড়/দানা অনুপাত (ঐচ্ছিক)", "Your own straw/grain ratio (optional)")}
          </label>
          <input id="rc-ratio" type="number" min={0.2} max={3} step={0.05} placeholder={`${coeff.residueToGrain.typ} (${coeff.residueToGrain.min}–${coeff.residueToGrain.max})`} value={ratio ?? ""} onChange={(e) => setRatio(e.target.value === "" ? null : Number(e.target.value))} className="mt-1 w-full rounded-lg border border-white/15 bg-surface px-2 py-2 text-sm" />
          <p className="mt-1 text-xs text-muted-text">{lang === "bn" ? coeff.note.bn : coeff.note.en}</p>
        </div>
      </Section>

      <Section title={tt(lang, "কোথায় যাবে? (শতকরা ভাগ)", "Where does it go? (percent)")} hint={tt(lang, `মোট ${num(lang, sumNow, 0)}% — ১০০ না হলে স্বয়ংক্রিয়ভাবে মিলিয়ে নেওয়া হয়। বায়োচার তুষ থেকে।`, `Total ${num(lang, sumNow, 0)}% — normalised to 100% if different. Biochar uses husk.`)}>
        <ul className="space-y-3">
          {PATHWAYS.map((p) => (
            <li key={p.id} className={`rounded-xl border p-3 ${activePathway === p.id ? "border-agri-green bg-agri-green/10" : "border-white/10 bg-white/5"} ${p.id === "burn" ? "border-red-400/30" : ""}`}>
              <div className="flex items-center justify-between gap-2">
                <span className="text-sm font-semibold text-primary-text">
                  <span aria-hidden>{p.icon} </span>
                  {lang === "bn" ? p.name.bn : p.name.en}
                </span>
                {onPickPathway && p.id !== "burn" && (
                  <button type="button" onClick={() => onPickPathway(activePathway === p.id ? null : p.id)} className="rounded-md border border-white/15 px-2 py-1 text-xs text-earth-cyan hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-earth-cyan">
                    {tt(lang, "3D-তে দেখুন", "See in 3D")}
                  </button>
                )}
              </div>
              <RangeField id={`rc-${p.id}`} label={tt(lang, "ভাগ", "Share")} value={shares[p.id as PathwayId]} min={0} max={100} step={5} onChange={(v) => setShares((s) => ({ ...s, [p.id]: v }))} format={(v) => `${num(lang, v, 0)}%`} />
              <p className="text-xs text-primary-text">
                ≈ {t(res.byPathway[p.id as PathwayId])} — {lang === "bn" ? p.returns.bn : p.returns.en}
              </p>
              <p className="mt-1 text-xs text-muted-text">
                {tt(lang, "সতর্কতা", "Watch out")}: {lang === "bn" ? p.watchOut.bn : p.watchOut.en}
              </p>
            </li>
          ))}
        </ul>
        {res.burnedT > 0 && (
          <Notice tone="warn">
            {tt(lang, `${t(res.burnedT)} খড় পোড়ানোর জন্য ধরা হয়েছে — ধোঁয়া, পুষ্টি ও জৈব পদার্থ নষ্ট হয়; বিকল্প ব্যবহার বিবেচনা করুন।`, `${t(res.burnedT)} of straw is set to be burned — this loses nutrients and organic matter and adds smoke; consider the alternatives.`)}
          </Notice>
        )}
      </Section>

      {coeff.huskToPaddy !== undefined && (
        <Section title={tt(lang, "মাটিতে ফেরত পুষ্টি (আনুমানিক)", "Nutrients returned to soil (approx.)")} hint={tt(lang, "মাটিতে মেশানো + কম্পোস্ট করা খড় থেকে, সাধারণ পরিসর।", "From straw incorporated + composted; typical range.")}>
          <div className="grid grid-cols-3 gap-2">
            <Stat label="N" value={kg(res.nutrientsReturnedKg.n.typ)} sub={`${num(lang, res.nutrientsReturnedKg.n.min, 0)}–${num(lang, res.nutrientsReturnedKg.n.max, 0)}`} />
            <Stat label="P" value={kg(res.nutrientsReturnedKg.p.typ)} sub={`${num(lang, res.nutrientsReturnedKg.p.min, 0)}–${num(lang, res.nutrientsReturnedKg.p.max, 0)}`} />
            <Stat label="K" value={kg(res.nutrientsReturnedKg.k.typ)} sub={`${num(lang, res.nutrientsReturnedKg.k.min, 0)}–${num(lang, res.nutrientsReturnedKg.k.max, 0)}`} />
          </div>
        </Section>
      )}

      {vol != null && (
        <Section title={tt(lang, "পানির চক্র", "Water loop")} hint={tt(lang, "১ মিমি × ১ হেক্টর = ১০ ঘনমিটার।", "1 mm over 1 ha = 10 m³.")}>
          <div className="grid grid-cols-2 gap-2">
            <Stat label={tt(lang, "এই মৌসুমের সেচ", "Season irrigation")} value={`${num(lang, vol, 0)} m³`} sub={`${num(lang, irrigationMm ?? 0, 0)} mm`} />
            <Stat label={tt(lang, "সমান পানির পুকুর (১.৫ মি গভীর)", "Pond for that water (1.5 m deep)")} value={`${num(lang, pondAreaM2(vol), 0)} m²`} sub={tt(lang, "শুধু আকারের ধারণা", "size idea only")} />
          </div>
        </Section>
      )}

      <Section title={tt(lang, "তিনটি চক্র", "Three loops")}>
        <ul className="space-y-3">
          {CIRCULAR_LOOPS.map((l) => (
            <li key={l.id} className="rounded-xl border border-white/10 bg-white/5 p-3">
              <h4 className="text-sm font-semibold text-agri-green">{lang === "bn" ? l.name.bn : l.name.en}</h4>
              <ol className="mt-1 list-decimal space-y-0.5 pl-5 text-xs text-primary-text">
                {l.steps.map((s, i) => (
                  <li key={i}>{lang === "bn" ? s.bn : s.en}</li>
                ))}
              </ol>
            </li>
          ))}
        </ul>
      </Section>
      {res.notes.length > 0 && <p className="text-xs text-muted-text">{res.notes.map((n) => localizeNote(n, lang)).join(" ")}</p>}
      <p className="mt-2 text-xs text-muted-text">{tt(lang, "প্রযুক্তি-সহায়তা: DAE, BARI, SRDI, BRRI।", "For technical help ask DAE, BARI, SRDI or BRRI.")}</p>
      <p className="mt-1 text-[11px] text-muted-text">{CROPS[crop][lang === "bn" ? "nameBn" : "nameEn"]}</p>
    </div>
  );
}
