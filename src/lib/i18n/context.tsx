"use client";

import React from "react";
import { useLocale, useMessages } from "next-intl";
import { I18nProvider as FoundationI18nProvider, useAppLanguage } from "@/components/i18n-provider";
import type { Dictionary } from "@/i18n/dictionary";
import type { Locale } from "@/types/domain";

// Bridge over the foundation's next-intl setup.
//
// The product's components were built against this hook —
// `const { t, locale, dir, setLocale } = useI18n()` with `t` shaped
// like the typed Dictionary — and they keep working unchanged: the
// next-intl message tree (src/i18n/messages.ts) is composed so it
// contains the full dictionary for the active locale, so it is handed
// out as `t`, and locale switching delegates to Abdulrahman's
// provider (localStorage key `smart-marketing-locale`, html lang/dir
// sync, NextIntlClientProvider re-render).
export function useI18n() {
  const locale = useLocale() as Locale;
  const messages = useMessages();
  const { setLocale } = useAppLanguage();

  return {
    locale,
    dir: (locale === "ar" ? "rtl" : "ltr") as "ltr" | "rtl",
    t: messages as unknown as Dictionary,
    setLocale: (next: Locale) => setLocale(next),
  };
}

// Kept for existing imports (root layout history, tests). The real
// provider is the foundation's — this simply re-exports it so there
// is exactly one i18n provider implementation in the app.
export function I18nProvider({ children }: { children: React.ReactNode }) {
  return <FoundationI18nProvider>{children}</FoundationI18nProvider>;
}
