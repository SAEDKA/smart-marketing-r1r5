import { describe, it, expect } from "vitest";
import { messages } from "@/i18n/messages";
import { en } from "@/i18n/locales/en";
import { tr } from "@/i18n/locales/tr";
import { ar } from "@/i18n/locales/ar";

// The app speaks next-intl now: src/i18n/messages.ts composes the
// foundation's original copy with the full product dictionary
// (src/i18n/locales/*) and the page-local copy. These tests pin the
// composition so no locale can silently lose a section.

function keyPaths(value: unknown, prefix = ""): string[] {
  if (value === null || typeof value !== "object" || Array.isArray(value)) {
    return [prefix];
  }
  return Object.entries(value as Record<string, unknown>)
    .flatMap(([key, child]) => keyPaths(child, prefix ? `${prefix}.${key}` : key))
    .sort();
}

describe("Multi-Language Support (EN, TR, AR)", () => {
  it("provides complete translations for English, Turkish, and Arabic", () => {
    expect(messages.en).toBeDefined();
    expect(messages.tr).toBeDefined();
    expect(messages.ar).toBeDefined();

    expect(messages.en.meta.direction).toBe("ltr");
    expect(messages.tr.meta.direction).toBe("ltr");
    expect(messages.ar.meta.direction).toBe("rtl");
  });

  it("has identical key structure across all three locales", () => {
    const enKeys = keyPaths(messages.en);
    expect(keyPaths(messages.tr)).toEqual(enKeys);
    expect(keyPaths(messages.ar)).toEqual(enKeys);
  });

  it("has matching navigation keys across all three languages", () => {
    const enKeys = Object.keys(messages.en.nav);
    expect(Object.keys(messages.tr.nav)).toEqual(enKeys);
    expect(Object.keys(messages.ar.nav)).toEqual(enKeys);
  });

  it("contains Arabic onboarding tone translations", () => {
    expect(messages.ar.onboarding.tones.LUXURY).toBeDefined();
    expect(messages.ar.onboarding.step1Title).toBeDefined();
  });
});

describe("next-intl message composition", () => {
  it("keeps the foundation layer (brand line, language names, shell, home)", () => {
    expect(messages.en.brandName).toBe("Smart Marketing");
    expect(messages.ar.brandName).toBe("سوق بذكاء");
    expect(messages.en.language.label).toBe("Language");
    expect(messages.en.shell.overview).toBe("Overview");
    expect(messages.en.home.title).toBeDefined();
  });

  it("merges foundation nav/auth keys with the product dictionary", () => {
    // Foundation-only keys survive…
    expect(messages.en.nav.home).toBe("Home");
    expect(messages.en.nav.login).toBe("Sign in");
    // …alongside the product's workspace navigation.
    expect(messages.en.nav.contentStudio).toBe(en.nav.contentStudio);
    expect(messages.en.nav.dashboard).toBe(en.nav.dashboard);
  });

  it("carries the page-local copy for landing, dashboard, admin and auth", () => {
    for (const locale of ["en", "tr", "ar"] as const) {
      expect(messages[locale].landing.navProduct).toBeDefined();
      expect(messages[locale].dashboardCopy.assistantPlaceholder).toBeDefined();
      expect(messages[locale].adminCopy.pageTitle).toBeDefined();
      expect(messages[locale].authShowcase.headline).toBeDefined();
    }
  });

  it("exposes the typed product dictionaries the composition is built from", () => {
    expect(en.meta.appName).toBeDefined();
    expect(tr.meta.direction).toBe("ltr");
    expect(ar.meta.direction).toBe("rtl");
  });
});
