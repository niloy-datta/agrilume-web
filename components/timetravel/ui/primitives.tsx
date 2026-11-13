"use client";

import React from "react";
import type { DataKind, Lang } from "@/lib/timetravel/types";
import { KIND_LABEL } from "@/lib/timetravel/kind-labels";

export const tt = (lang: Lang, bn: string, en: string) => (lang === "bn" ? bn : en);

export function Section({ title, children, hint }: { title: string; children: React.ReactNode; hint?: string }) {
  return (
    <section className="border-b border-white/10 py-4 first:pt-0 last:border-b-0">
      <h3 className="font-space text-sm font-semibold uppercase tracking-wide text-agri-green">{title}</h3>
      {hint && <p className="mt-1 text-xs leading-relaxed text-muted-text">{hint}</p>}
      <div className="mt-3 space-y-3">{children}</div>
    </section>
  );
}

export function RangeField({
  id,
  label,
  value,
  min,
  max,
  step,
  onChange,
  format,
  hint,
}: {
  id: string;
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (v: number) => void;
  format?: (v: number) => string;
  hint?: string;
}) {
  return (
    <div>
      <div className="flex items-baseline justify-between gap-3">
        <label htmlFor={id} className="text-sm text-primary-text">
          {label}
        </label>
        <output htmlFor={id} className="font-space text-sm tabular-nums text-earth-cyan">
          {format ? format(value) : value}
        </output>
      </div>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="mt-1 h-2 w-full cursor-pointer accent-[#59d98e]"
      />
      {hint && <p className="mt-1 text-xs text-muted-text">{hint}</p>}
    </div>
  );
}

export function Chip({
  active,
  onClick,
  children,
  title,
  tone = "default",
  disabled,
}: {
  active?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
  title?: string;
  tone?: "default" | "warn";
  disabled?: boolean;
}) {
  const base = "min-h-[40px] rounded-full border px-3 py-1.5 text-sm font-medium transition focus:outline-none focus-visible:ring-2 focus-visible:ring-earth-cyan disabled:opacity-40";
  const cls = active
    ? tone === "warn"
      ? "border-warning bg-warning/20 text-warning"
      : "border-agri-green bg-agri-green/20 text-agri-green"
    : "border-white/15 bg-white/5 text-primary-text hover:bg-white/10";
  return (
    <button type="button" onClick={onClick} title={title} aria-pressed={active} disabled={disabled} className={`${base} ${cls}`}>
      {children}
    </button>
  );
}

export function Btn({
  onClick,
  children,
  variant = "default",
  title,
  disabled,
  className = "",
  ariaLabel,
  pressed,
}: {
  onClick?: () => void;
  children: React.ReactNode;
  variant?: "default" | "primary" | "danger";
  title?: string;
  disabled?: boolean;
  className?: string;
  ariaLabel?: string;
  pressed?: boolean;
}) {
  const v =
    variant === "primary"
      ? "bg-agri-green text-space hover:brightness-110"
      : variant === "danger"
        ? "bg-red-500/80 text-white hover:bg-red-500"
        : "border border-white/15 bg-white/5 text-primary-text hover:bg-white/10";
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      aria-label={ariaLabel}
      aria-pressed={pressed}
      disabled={disabled}
      className={`min-h-[44px] rounded-lg px-3.5 py-2 text-sm font-semibold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-earth-cyan disabled:opacity-40 ${v} ${className}`}
    >
      {children}
    </button>
  );
}

/** Data-kind badge. The leading symbol means the kind is never conveyed by colour alone. */
export function KindBadge({ kind, lang, compact }: { kind: DataKind; lang: Lang; compact?: boolean }) {
  let sym = "●";
  let style = "border-agri-green/60 bg-agri-green/10 text-agri-green";
  let shortLabel = tt(lang, "পর্যবেক্ষিত", "Observed");

  if (kind === "observed") {
    sym = "●";
    style = "border-[#59D98E]/60 bg-[#59D98E]/10 text-[#59D98E]";
    shortLabel = tt(lang, "আসল পর্যবেক্ষণ", "Real Observation");
  } else if (kind === "cached-observation") {
    sym = "◎";
    style = "border-[#36BFFA]/60 bg-[#36BFFA]/10 text-[#36BFFA]";
    shortLabel = tt(lang, "ক্যাশ পর্যবেক্ষণ", "Cached Observation");
  } else if (kind === "observed-filled") {
    sym = "◐";
    style = "border-[#2DD4BF]/60 bg-[#2DD4BF]/10 text-[#2DD4BF]";
    shortLabel = tt(lang, "আংশিক পূরণ", "Observed-Filled");
  } else if (kind === "nasa-projection" || kind === "model-projection") {
    sym = "▲";
    style = "border-[#A78BFA]/60 bg-[#A78BFA]/10 text-[#A78BFA]";
    shortLabel = tt(lang, "মডেল প্রক্ষেপণ", "Model Projection");
  } else if (kind === "unavailable-data") {
    sym = "⊘";
    style = "border-[#F87171]/60 bg-[#F87171]/10 text-[#F87171]";
    shortLabel = tt(lang, "তথ্য অপ্রাপ্য", "Unavailable Data");
  } else {
    // trend-what-if, simulator, educational-simulation
    sym = "◇";
    style = "border-[#F59E0B]/70 bg-[#F59E0B]/10 text-[#F59E0B]";
    shortLabel = tt(lang, "শিক্ষামূলক সিমুলেশন", "Educational Simulation");
  }

  const l = KIND_LABEL[kind] || KIND_LABEL.simulator;
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold ${style}`}
      role="status"
    >
      <span aria-hidden>{sym}</span>
      <span>{compact ? shortLabel : lang === "bn" ? l.bn : l.en}</span>
    </span>
  );
}

export function Stat({ label, value, sub }: { label: string; value: React.ReactNode; sub?: string }) {
  return (
    <div className="rounded-lg border border-white/10 bg-white/5 p-3">
      <div className="text-xs text-muted-text">{label}</div>
      <div className="font-space text-xl font-semibold tabular-nums text-primary-text">{value}</div>
      {sub && <div className="mt-0.5 text-xs text-muted-text">{sub}</div>}
    </div>
  );
}

export function ExtLink({ href, children, lang }: { href: string; children: React.ReactNode; lang?: Lang }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className="text-earth-cyan underline decoration-earth-cyan/40 underline-offset-2 hover:decoration-earth-cyan focus:outline-none focus-visible:ring-2 focus-visible:ring-earth-cyan">
      {children}
      <span className="sr-only"> {lang === "bn" ? "(নতুন ট্যাবে খুলবে)" : "(opens in a new tab)"}</span>
    </a>
  );
}

export function Notice({ tone = "info", children }: { tone?: "info" | "warn"; children: React.ReactNode }) {
  return (
    <div
      role="note"
      className={`rounded-lg border p-3 text-xs leading-relaxed ${tone === "warn" ? "border-warning/50 bg-warning/10 text-warning" : "border-earth-cyan/30 bg-earth-cyan/5 text-primary-text"}`}
    >
      <span aria-hidden className="mr-1">
        {tone === "warn" ? "⚠" : "ℹ"}
      </span>
      {children}
    </div>
  );
}
