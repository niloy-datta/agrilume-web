"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { NAV_LINKS, SITE_CONFIG } from "@/lib/constants";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 24) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-out ${
        scrolled
          ? "bg-[#050A12]/80 backdrop-blur-md border-b border-[#36BFFA]/10 py-3 shadow-[0_4px_30px_rgba(0,0,0,0.5)]"
          : "bg-transparent border-b border-transparent py-5"
      }`}
    >
      <div className="max-w-[1400px] mx-auto px-6 sm:px-8 lg:px-12 flex items-center justify-between">
        {/* Brand Wordmark & Sprout Icon */}
        <Link
          href="/"
          className="group flex items-center gap-2.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#59D98E] rounded-md transition-opacity"
          aria-label={`${SITE_CONFIG.name} Home`}
        >
          <div className="relative flex items-center justify-center w-8 h-8 rounded-lg bg-[#0B1220] border border-[#59D98E]/30 group-hover:border-[#59D98E]/60 transition-colors shadow-[0_0_12px_rgba(89,217,142,0.2)]">
            <svg viewBox="0 0 24 24" className="w-5 h-5 fill-[#59D98E]" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2C6.48 2 2 6.48 2 12c0 3.73 2.06 6.98 5.11 8.68-.07-.56-.11-1.14-.11-1.73 0-5.52 4.48-10 10-10 .59 0 1.17.04 1.73.11C18.98 4.06 15.73 2 12 2zm8 8c-4.42 0-8 3.58-8 8 0 1.48.4 2.86 1.1 4.05C18.66 21.37 22 17.08 22 12c0-.68-.07-1.35-.19-2-.27.06-.54.09-.81.09z" />
            </svg>
            <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 rounded-full bg-[#59D98E] animate-pulse" />
          </div>
          <span className="font-space font-bold tracking-tight text-lg text-[#F8FAFC] group-hover:text-white transition-colors">
            AgriLume
          </span>
        </Link>

        {/* Desktop Navigation Links */}
        <nav
          className="hidden md:flex items-center gap-8 lg:gap-10"
          aria-label="Main Navigation"
        >
          {NAV_LINKS.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="text-sm font-medium text-[#94A3B8] hover:text-[#F8FAFC] transition-colors duration-200 relative py-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#59D98E] rounded"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Desktop Primary CTA: Prioritize App Download */}
        <div className="hidden md:flex items-center gap-4">
          <Link
            href="#download"
            className="group relative inline-flex items-center justify-center gap-2 px-5 py-2 text-xs font-semibold uppercase tracking-wider text-[#050A12] bg-[#59D98E] hover:bg-[#72e5a2] rounded-full transition-all duration-200 shadow-[0_0_20px_rgba(89,217,142,0.35)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#59D98E]"
          >
            <span>Download App</span>
            <span className="transition-transform duration-200 group-hover:translate-y-0.5">↓</span>
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          type="button"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden flex items-center justify-center w-10 h-10 rounded-lg text-[#F8FAFC] hover:text-[#36BFFA] bg-[#0B1220]/60 border border-white/10 hover:border-[#36BFFA]/30 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#36BFFA]"
          aria-expanded={mobileMenuOpen}
          aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Navigation Drawer */}
      <div
        className={`md:hidden fixed inset-x-0 top-[60px] h-[calc(100svh-60px)] bg-[#050A12]/95 backdrop-blur-xl border-b border-[#36BFFA]/15 transition-all duration-300 ease-in-out px-6 py-8 flex flex-col justify-between ${
          mobileMenuOpen
            ? "opacity-100 pointer-events-auto translate-y-0"
            : "opacity-0 pointer-events-none -translate-y-4"
        }`}
      >
        <div className="flex flex-col gap-6">
          <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-[#94A3B8]/60">
            Navigation
          </span>
          {NAV_LINKS.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className="text-2xl font-space font-medium text-[#F8FAFC] hover:text-[#36BFFA] transition-colors py-2 border-b border-white/5"
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="flex flex-col gap-4 pt-6 border-t border-white/10">
          <Link
            href="#download"
            onClick={() => setMobileMenuOpen(false)}
            className="w-full flex items-center justify-center gap-2 py-3.5 text-sm font-semibold uppercase tracking-wider text-[#050A12] bg-[#36BFFA] rounded-full glow-cyan-button text-center"
          >
            <span>Download App</span>
            <ArrowUpRight className="w-4 h-4" />
          </Link>
          <div className="text-center">
            <span className="text-[11px] font-mono text-[#94A3B8]/60">
              NASA Space Apps Challenge 2026
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
