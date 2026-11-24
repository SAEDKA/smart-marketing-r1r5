"use client";

import Link from "next/link";

import React from "react";
import { LanguageSwitcher } from "@/components/ui/LanguageSwitcher";
import { BrandLogo } from "@/components/layout/BrandLogo";
import { useI18n } from "@/lib/i18n/context";
import {
  Sparkles,
  Instagram,
  Facebook,
  CheckCircle2,
  TrendingUp,
  Sliders,
  BarChart3,
} from "lucide-react";
import { AUTH_SHOWCASE_COPY } from "@/i18n/page-copy";


export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { t, locale } = useI18n();
  const showcase = AUTH_SHOWCASE_COPY[locale];

  return (
    <div className="workspace-calm min-h-screen flex flex-col justify-between p-4 sm:p-6 lg:p-8 relative overflow-x-hidden">
      {/* Top Header with Brand, Theme Switcher, and Language Switcher */}
      <header className="w-full max-w-7xl mx-auto flex items-center justify-between py-2 relative z-10">
        <Link href="/" className="flex items-center gap-2.5 group">
          <BrandLogo className="w-9 h-9" />
          <div>
            <span className="text-sm font-bold tracking-tight text-white block">
              {t.meta.appName}
            </span>
            <span className="text-[10px] text-txt-secondary font-medium hidden sm:block">
              {t.meta.appTagline}
            </span>
          </div>
        </Link>

        <div className="flex items-center gap-2.5">
          <LanguageSwitcher />
        </div>
      </header>

      {/* Main Split-Screen Container */}
      <main className="w-full max-w-7xl mx-auto flex-1 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center py-8 relative z-10">
        {/* Left/Start Column: Auth Form */}
        <div className="lg:col-span-5 flex justify-center">{children}</div>

        {/* Right/End Column: Live Interactive AI Marketing Showcase (Desktop) */}
        <div className="hidden lg:flex lg:col-span-7 flex-col justify-center">
          <div className="rounded-[26px] glass-panel border border-white/15 p-8 space-y-7 shadow-2xl">
            <div className="space-y-3">
              <h2 className="text-2xl xl:text-3xl font-bold tracking-tight text-white leading-tight">
                {showcase.headline}
              </h2>
              <p className="text-sm text-txt-secondary leading-relaxed">
                {showcase.subhead}
              </p>
            </div>

            {/* Pulsing Pipeline Mini-Diagram */}
            <div className="grid grid-cols-3 gap-3 items-center pt-1">
              <div className="p-3.5 rounded-2xl bg-white/[0.04] border border-white/10 flex items-center gap-2.5">
                <Sliders className="w-4 h-4 text-accent-violet shrink-0" />
                <div className="min-w-0">
                  <p className="text-xs font-bold text-white truncate">
                    Brand DNA
                  </p>
                  <p className="text-[10px] text-txt-muted truncate">
                    Luxury &bull; EN/TR/AR
                  </p>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-accent-violet/15 border border-accent-violet/35 flex items-center gap-2.5">
                <Sparkles className="w-4 h-4 text-accent-cyan shrink-0" />
                <div className="min-w-0">
                  <p className="text-xs font-bold text-white truncate">
                    AI Content Studio
                  </p>
                  <p className="text-[10px] text-accent-mint truncate">
                    3 Variations Ready
                  </p>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-white/[0.04] border border-white/10 flex items-center gap-2.5">
                <BarChart3 className="w-4 h-4 text-accent-mint shrink-0" />
                <div className="min-w-0">
                  <p className="text-xs font-bold text-white truncate">
                    SWOT Engine
                  </p>
                  <p className="text-[10px] text-txt-muted truncate">
                    Verified Performance
                  </p>
                </div>
              </div>
            </div>

            {/* Live Social Post Preview Surface */}
            <div className="p-5 rounded-2xl bg-navy-950/75 border border-white/10 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Instagram className="w-4 h-4 text-accent-violet" />
                  <Facebook className="w-4 h-4 text-accent-cyan" />
                  <span className="text-xs font-bold text-white">
                    {showcase.liveCardTitle}
                  </span>
                </div>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-accent-mint/15 text-accent-mint border border-accent-mint/30">
                  <CheckCircle2 className="w-3 h-3" />
                  {showcase.approvedBadge}
                </span>
              </div>

              <p className="text-xs text-txt-secondary leading-relaxed">
                {showcase.captionSample}
              </p>

              <div className="grid grid-cols-3 gap-4 pt-3 border-t border-white/10 tabular-nums-metric">
                <div>
                  <span className="text-[10px] text-txt-muted block">
                    {showcase.metric1Label}
                  </span>
                  <span className="text-base font-bold text-white">18,420</span>
                </div>
                <div>
                  <span className="text-[10px] text-txt-muted block">
                    {showcase.metric2Label}
                  </span>
                  <span className="text-base font-bold text-accent-cyan">
                    4.82%
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-txt-muted block">
                    {showcase.metric3Label}
                  </span>
                  <span className="text-base font-bold text-accent-mint inline-flex items-center gap-1">
                    <TrendingUp className="w-3.5 h-3.5" />
                    +31%
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer Info */}
      <footer className="w-full max-w-7xl mx-auto text-center py-4 border-t border-white/5 relative z-10">
        <p className="text-xs text-txt-muted">
          SMART MARKETING PLATFORM &copy; 2026 &bull; AI-Powered Social Media Marketing Suite
        </p>
      </footer>
    </div>
  );
}
