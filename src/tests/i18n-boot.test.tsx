import React from "react";
import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { I18nProvider, useI18n } from "@/lib/i18n/context";

/**
 * Regression tests for the "language changes on F5" report, carried
 * onto the foundation's next-intl provider: the saved locale is read
 * from the foundation storage key (smart-marketing-locale) and the
 * provider applies language + direction to <html>, so a refresh
 * opens in the user's language. The product's useI18n bridge
 * (lib/i18n/context) reads the same provider.
 */
function Probe() {
  const { locale, dir } = useI18n();
  return <div>{`${locale}|${dir}`}</div>;
}

describe("I18nProvider boot", () => {
  beforeEach(() => {
    window.localStorage.clear();
    document.documentElement.removeAttribute("dir");
    document.documentElement.removeAttribute("lang");
  });

  afterEach(() => {
    window.localStorage.clear();
  });

  it("opens in English immediately when no preference is saved", async () => {
    render(
      <I18nProvider>
        <Probe />
      </I18nProvider>,
    );
    expect(await screen.findByText("en|ltr")).toBeTruthy();
  });

  it("boots straight into a saved Arabic preference, in RTL", async () => {
    window.localStorage.setItem("smart-marketing-locale", "ar");
    render(
      <I18nProvider>
        <Probe />
      </I18nProvider>,
    );
    expect(await screen.findByText("ar|rtl")).toBeTruthy();
    expect(document.documentElement.dir).toBe("rtl");
    expect(document.documentElement.lang).toBe("ar");
  });

  it("boots straight into a saved Turkish preference", async () => {
    window.localStorage.setItem("smart-marketing-locale", "tr");
    render(
      <I18nProvider>
        <Probe />
      </I18nProvider>,
    );
    expect(await screen.findByText("tr|ltr")).toBeTruthy();
  });
});
