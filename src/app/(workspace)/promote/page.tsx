"use client";

import React, { useEffect, useRef, useState } from "react";
import { useI18n } from "@/lib/i18n/context";
import { campaignsApi } from "@/lib/api/campaigns.api";
import { productsApi } from "@/lib/api/products.api";
import { Campaign, Product, SocialPlatform } from "@/types/domain";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import {
  Rocket,
  Sparkles,
  Instagram,
  Facebook,
  CheckCircle2,
  Clock,
  Users,
} from "lucide-react";

// Numbered step title — same visual style as the Content Studio steps.
function StepTitle({ n, children }: { n: number; children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2.5 pt-1">
      <span className="w-6 h-6 rounded-full bg-accent-violet text-white text-[11px] font-bold flex items-center justify-center shrink-0">
        {n}
      </span>
      <h3 className="text-xs font-bold text-white">{children}</h3>
    </div>
  );
}

// A label above a native dropdown — the app's standard single-choice
// control: compact, and it shows only the chosen value.
function LabeledSelect({
  label,
  value,
  onChange,
  children,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-xs font-medium text-txt-secondary mb-1.5">
        {label}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="field-input w-full h-11 px-3 text-xs text-white bg-navy-900 focus:outline-none"
      >
        {children}
      </select>
    </div>
  );
}

// Fixed option codes; the visible labels come from the locale by index,
// so switching language keeps the same choice.
const RADIUS_CODES = ["5", "10", "20", "50", "ALL"];
const AGES = Array.from({ length: 48 }, (_, i) => 18 + i); // 18..65

// Social-media audience per country, in the same order as the locale's
// countries list — the base of the reach estimate below.
const COUNTRY_AUDIENCE = [
  52_000_000, 38_000_000, 9_000_000, 3_500_000, 3_000_000, 3_200_000,
];
const RADIUS_FACTORS = [0.02, 0.05, 0.12, 0.3, 1]; // same order as RADIUS_CODES

// Expected-result rate per goal (same order as the locale's
// objectiveOptions): impressions per reached person for awareness,
// then clicks, engagement, chats and orders as a share of the reach.
const RESULT_RATES: [number, number][] = [
  [2.2, 3],
  [0.01, 0.025],
  [0.02, 0.045],
  [0.005, 0.012],
  [0.003, 0.008],
];

// Round an estimate the way ad platforms do: two significant digits.
function roundNice(n: number): number {
  if (n <= 0) return 0;
  const step = Math.pow(10, Math.max(0, Math.floor(Math.log10(n)) - 1));
  return Math.round(n / step) * step;
}

function fmtDate(iso: string): string {
  const d = new Date(`${iso}T00:00:00`);
  return Number.isNaN(d.getTime()) ? iso : d.toLocaleDateString("en-GB");
}

function todayPlus(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

type LaunchStatus = "idle" | "review" | "active";

export default function PromotePage() {
  const { t } = useI18n();

  // The company's own campaigns and products, loaded like the Campaigns page.
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Step 1 — the goal, what to promote, and where the ad sends people.
  const [objectiveIndex, setObjectiveIndex] = useState(2);
  const [campaignId, setCampaignId] = useState("");
  const [productId, setProductId] = useState("");
  const [ctaIndex, setCtaIndex] = useState(2);
  const [destination, setDestination] = useState("");

  // Step 2 — who should see it.
  const [ageFrom, setAgeFrom] = useState(24);
  const [ageTo, setAgeTo] = useState(30);
  const [gender, setGender] = useState("ALL");
  const [countryIndex, setCountryIndex] = useState(0);
  const [city, setCity] = useState("");
  const [radius, setRadius] = useState("10");
  const [interests, setInterests] = useState<string[]>([]);

  // Step 3 — budget, dates, platforms. The user picks the exact start
  // and end dates; the length in days is derived from them.
  const [budget, setBudget] = useState("500");
  const [startDate, setStartDate] = useState(() => todayPlus(0));
  const [endDate, setEndDate] = useState(() => todayPlus(7));
  const [platforms, setPlatforms] = useState<SocialPlatform[]>([
    "INSTAGRAM",
    "FACEBOOK",
  ]);
  const [placements, setPlacements] = useState<number[]>([0, 1, 2, 3]);
  const [budgetType, setBudgetType] = useState<"TOTAL" | "DAILY">("TOTAL");

  // Simulated launch: idle → in Meta review → live.
  const [status, setStatus] = useState<LaunchStatus>("idle");
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    let cancelled = false;
    Promise.all([campaignsApi.getCampaigns(), productsApi.getProducts()])
      .then(([campRes, prodRes]) => {
        if (cancelled) return;
        setCampaigns(campRes.data);
        setProducts(prodRes.data);
      })
      .catch(() => {
        // Keep empty dropdowns; the page still explains itself.
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });
    return () => {
      cancelled = true;
      if (timerRef.current) window.clearTimeout(timerRef.current);
    };
  }, []);

  const toggleInterest = (interest: string) => {
    setInterests((prev) =>
      prev.includes(interest)
        ? prev.filter((i) => i !== interest)
        : [...prev, interest]
    );
  };

  const togglePlacement = (i: number) => {
    setPlacements((prev) =>
      prev.includes(i) ? prev.filter((x) => x !== i) : [...prev, i]
    );
  };

  const togglePlatform = (p: SocialPlatform) => {
    setPlatforms((prev) =>
      prev.includes(p) ? prev.filter((x) => x !== p) : [...prev, p]
    );
  };

  // Smart assistant — two simple rules, checked in order:
  // 1) a small budget spread over a wide area → narrow the radius.
  // 2) a very wide age range → narrow it to 24–40.
  // Otherwise the settings are balanced and there is nothing to apply.
  const budgetNumber = Number(budget) || 0;
  let tipText = t.promote.tipBalanced;
  let applyTip: (() => void) | null = null;
  if (budgetNumber > 0 && budgetNumber < 500 && (radius === "50" || radius === "ALL")) {
    tipText = t.promote.tipNarrowRadius;
    applyTip = () => setRadius("10");
  } else if (ageTo - ageFrom >= 40) {
    tipText = t.promote.tipNarrowAge;
    applyTip = () => {
      setAgeFrom(24);
      setAgeTo(40);
    };
  }

  // Summary values, shown before launch and again in the live state.
  const selectedCampaign = campaigns.find((c) => c.id === campaignId);
  const selectedProduct = products.find((p) => p.id === productId);
  const adName =
    selectedCampaign?.name ||
    selectedProduct?.name ||
    t.promote.noCampaignOption;
  const genderLabel =
    gender === "MALE"
      ? t.promote.genderMale
      : gender === "FEMALE"
        ? t.promote.genderFemale
        : t.promote.genderAll;
  const audienceSummary = `${ageFrom}–${ageTo} • ${genderLabel} • ${
    city ? `${city}، ` : ""
  }${t.promote.countries[countryIndex]}`;
  const durationDays = Math.max(
    1,
    Math.round((Date.parse(endDate) - Date.parse(startDate)) / 86_400_000) + 1
  );
  const budgetSummary = `${budget} ${t.promote.currencySymbol}${
    budgetType === "DAILY" ? ` ${t.promote.perDaySuffix}` : ""
  } • ${fmtDate(startDate)} – ${fmtDate(endDate)}`;
  const placementsSummary = t.promote.placementOptions
    .filter((_, i) => placements.includes(i))
    .join(" • ");
  const ctaSummary = destination
    ? `${t.promote.ctaOptions[ctaIndex]} • ${destination}`
    : t.promote.ctaOptions[ctaIndex];

  // Live estimates, the way Meta shows them: the audience size comes from
  // the targeting alone; the reach also depends on the daily budget.
  const audienceSize = Math.max(
    1000,
    Math.round(
      COUNTRY_AUDIENCE[countryIndex] *
        ((ageTo - ageFrom + 1) / AGES.length) *
        (gender === "ALL" ? 1 : 0.5) *
        RADIUS_FACTORS[RADIUS_CODES.indexOf(radius)] *
        (interests.length === 0
          ? 1
          : Math.max(0.2, 1 - 0.18 * interests.length))
    )
  );
  const platformFactor =
    platforms.length === 2 ? 1.6 : platforms.length === 1 ? 1 : 0;
  const totalSpend =
    budgetType === "DAILY" ? budgetNumber * durationDays : budgetNumber;
  const reachTotal = Math.min(
    audienceSize * 0.9,
    totalSpend * 55 * platformFactor
  );
  const reachLow = roundNice(reachTotal * 0.7);
  const reachHigh = roundNice(reachTotal * 1.15);
  const [rateLow, rateHigh] = RESULT_RATES[objectiveIndex];
  const resultLow = roundNice(reachTotal * rateLow);
  const resultHigh = roundNice(reachTotal * rateHigh);
  const fmtNum = (n: number) => n.toLocaleString("en-US");
  const platformsSummary = platforms
    .map((p) => (p === "INSTAGRAM" ? "Instagram" : "Facebook"))
    .join(" • ");

  const handleLaunch = () => {
    setStatus("review");
    timerRef.current = window.setTimeout(() => setStatus("active"), 2500);
  };

  const handleNewPromotion = () => {
    if (timerRef.current) window.clearTimeout(timerRef.current);
    setStatus("idle");
  };

  const canLaunch =
    status === "idle" &&
    platforms.length > 0 &&
    placements.length > 0 &&
    budgetNumber > 0;

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Page header — same pattern as the Campaigns page */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
          {t.promote.title}
        </h1>
        <p className="text-sm text-txt-secondary mt-1">{t.promote.subtitle}</p>
      </div>

      <div className="max-w-3xl space-y-6">
        {/* The guided form: three numbered steps in one solid card */}
        <Card className="surface-panel border-white/15 shadow-2xl p-6 space-y-6">
          {/* Step 1: pick a campaign and/or a product */}
          <div className="space-y-4">
            <StepTitle n={1}>{t.promote.step1Title}</StepTitle>
            <LabeledSelect
              label={t.promote.objectiveLabel}
              value={String(objectiveIndex)}
              onChange={(v) => setObjectiveIndex(Number(v))}
            >
              {t.promote.objectiveOptions.map((label, i) => (
                <option key={label} value={i}>
                  {label}
                </option>
              ))}
            </LabeledSelect>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <LabeledSelect
                label={t.promote.campaignLabel}
                value={campaignId}
                onChange={setCampaignId}
              >
                <option value="">{t.promote.noCampaignOption}</option>
                {campaigns.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </LabeledSelect>

              <LabeledSelect
                label={t.promote.productLabel}
                value={productId}
                onChange={setProductId}
              >
                <option value="">{t.promote.noProductOption}</option>
                {products.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </LabeledSelect>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <LabeledSelect
                label={t.promote.ctaLabel}
                value={String(ctaIndex)}
                onChange={(v) => setCtaIndex(Number(v))}
              >
                {t.promote.ctaOptions.map((label, i) => (
                  <option key={label} value={i}>
                    {label}
                  </option>
                ))}
              </LabeledSelect>

              <Input
                label={t.promote.destinationLabel}
                placeholder={t.promote.destinationPlaceholder}
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
              />
            </div>
            {isLoading && (
              <p className="text-[11px] text-txt-muted">{t.common.loading}</p>
            )}
          </div>

          {/* Step 2: full targeting — age, gender, place, radius, interests */}
          <div className="space-y-4 pt-5 border-t border-white/10">
            <StepTitle n={2}>{t.promote.step2Title}</StepTitle>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <LabeledSelect
                label={t.promote.ageFromLabel}
                value={String(ageFrom)}
                onChange={(v) => setAgeFrom(Number(v))}
              >
                {AGES.map((age) => (
                  <option key={age} value={age}>
                    {age}
                  </option>
                ))}
              </LabeledSelect>

              <LabeledSelect
                label={t.promote.ageToLabel}
                value={String(ageTo)}
                onChange={(v) => setAgeTo(Number(v))}
              >
                {AGES.map((age) => (
                  <option key={age} value={age}>
                    {age}
                  </option>
                ))}
              </LabeledSelect>

              <LabeledSelect
                label={t.promote.genderLabel}
                value={gender}
                onChange={setGender}
              >
                <option value="ALL">{t.promote.genderAll}</option>
                <option value="MALE">{t.promote.genderMale}</option>
                <option value="FEMALE">{t.promote.genderFemale}</option>
              </LabeledSelect>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <LabeledSelect
                label={t.promote.countryLabel}
                value={String(countryIndex)}
                onChange={(v) => setCountryIndex(Number(v))}
              >
                {t.promote.countries.map((country, i) => (
                  <option key={country} value={i}>
                    {country}
                  </option>
                ))}
              </LabeledSelect>

              <Input
                label={t.promote.cityLabel}
                placeholder={t.promote.cityPlaceholder}
                value={city}
                onChange={(e) => setCity(e.target.value)}
              />
            </div>

            <LabeledSelect
              label={t.promote.radiusLabel}
              value={radius}
              onChange={setRadius}
            >
              {RADIUS_CODES.map((code, i) => (
                <option key={code} value={code}>
                  {t.promote.radiusOptions[i]}
                </option>
              ))}
            </LabeledSelect>

            <div>
              <label className="block text-xs font-medium text-txt-secondary mb-1.5">
                {t.promote.interestsLabel}
              </label>
              <div className="flex flex-wrap gap-2">
                {t.promote.interestOptions.map((interest) => (
                  <button
                    key={interest}
                    type="button"
                    onClick={() => toggleInterest(interest)}
                    aria-pressed={interests.includes(interest)}
                    className={`px-3 py-1.5 rounded-full border text-xs transition-all ${
                      interests.includes(interest)
                        ? "bg-accent-violet/20 border-accent-violet text-white font-semibold"
                        : "bg-white/5 border-white/10 text-txt-secondary hover:text-white"
                    }`}
                  >
                    {interest}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Step 3: budget, duration and platforms */}
          <div className="space-y-4 pt-5 border-t border-white/10">
            <StepTitle n={3}>{t.promote.step3Title}</StepTitle>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label={`${t.promote.budgetLabel} (${t.promote.currencySymbol})`}
                type="number"
                min="1"
                placeholder={t.promote.budgetPlaceholder}
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
              />

              <LabeledSelect
                label={t.promote.budgetTypeLabel}
                value={budgetType}
                onChange={(v) => setBudgetType(v as "TOTAL" | "DAILY")}
              >
                <option value="TOTAL">{t.promote.budgetTotal}</option>
                <option value="DAILY">{t.promote.budgetDaily}</option>
              </LabeledSelect>

              <Input
                label={t.promote.startDateLabel}
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />

              <Input
                label={t.promote.endDateLabel}
                type="date"
                min={startDate}
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-txt-secondary mb-1.5">
                {t.promote.platformsLabel}
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => togglePlatform("INSTAGRAM")}
                  aria-pressed={platforms.includes("INSTAGRAM")}
                  className={`p-3.5 rounded-2xl border flex items-center gap-3 transition-all ${
                    platforms.includes("INSTAGRAM")
                      ? "bg-pink-500/15 border-pink-500 text-white"
                      : "bg-white/5 border-white/10 text-txt-secondary hover:text-white"
                  }`}
                >
                  <Instagram className="w-5 h-5 text-pink-400" />
                  <div className="text-start">
                    <p className="text-xs font-bold text-white">Instagram</p>
                    <p className="text-[10px] text-txt-muted">
                      {t.promote.instagramDesc}
                    </p>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => togglePlatform("FACEBOOK")}
                  aria-pressed={platforms.includes("FACEBOOK")}
                  className={`p-3.5 rounded-2xl border flex items-center gap-3 transition-all ${
                    platforms.includes("FACEBOOK")
                      ? "bg-blue-500/15 border-blue-500 text-white"
                      : "bg-white/5 border-white/10 text-txt-secondary hover:text-white"
                  }`}
                >
                  <Facebook className="w-5 h-5 text-blue-400" />
                  <div className="text-start">
                    <p className="text-xs font-bold text-white">Facebook</p>
                    <p className="text-[10px] text-txt-muted">
                      {t.promote.facebookDesc}
                    </p>
                  </div>
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-txt-secondary mb-1.5">
                {t.promote.placementsLabel}
              </label>
              <div className="flex flex-wrap gap-2">
                {t.promote.placementOptions.map((label, i) => (
                  <button
                    key={label}
                    type="button"
                    onClick={() => togglePlacement(i)}
                    aria-pressed={placements.includes(i)}
                    className={`px-3 py-1.5 rounded-full border text-xs transition-all ${
                      placements.includes(i)
                        ? "bg-accent-violet/20 border-accent-violet text-white font-semibold"
                        : "bg-white/5 border-white/10 text-txt-secondary hover:text-white"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </Card>

        {/* Smart assistant: one calm tip, applied with one tap */}
        <Card className="surface-card p-5 flex items-start gap-3">
          <Sparkles className="w-5 h-5 text-accent-cyan shrink-0 mt-0.5" />
          <div className="flex-1 space-y-2">
            <p className="text-xs font-bold text-white">
              {t.promote.assistantTitle}
            </p>
            <p className="text-xs leading-relaxed text-txt-secondary">
              {tipText}
            </p>
            {applyTip && (
              <Button variant="secondary" size="sm" onClick={applyTip}>
                {t.promote.applyTipBtn}
              </Button>
            )}
          </div>
        </Card>

        {/* Live estimates — they move as the user edits the form */}
        <Card className="surface-card p-5 space-y-3">
          <p className="text-xs font-bold text-white flex items-center gap-2">
            <Users className="w-4 h-4 text-accent-cyan" />
            {t.promote.estimateTitle}
          </p>
          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between gap-4">
              <span className="text-txt-muted">
                {t.promote.estimateAudienceLabel}
              </span>
              <strong className="text-white text-end">
                {fmtNum(audienceSize)}
              </strong>
            </div>
            <div className="flex items-center justify-between gap-4">
              <span className="text-txt-muted">
                {t.promote.estimateReachLabel}
              </span>
              <strong className="text-white text-end">
                {fmtNum(reachLow)} – {fmtNum(reachHigh)}
              </strong>
            </div>
            <div className="flex items-center justify-between gap-4">
              <span className="text-txt-muted">
                {t.promote.resultLabels[objectiveIndex]}
              </span>
              <strong className="text-white text-end">
                {fmtNum(resultLow)} – {fmtNum(resultHigh)}
              </strong>
            </div>
            <div className="flex items-center justify-between gap-4">
              <span className="text-txt-muted">
                {t.promote.estimateDaysLabel}
              </span>
              <strong className="text-white text-end">
                {durationDays} {t.promote.daysLabel}
              </strong>
            </div>
          </div>
          <p className="text-[11px] leading-relaxed text-txt-muted">
            {t.promote.estimateNote}
          </p>
        </Card>

        {/* Summary + the one big launch button — or the launch result */}
        {status === "idle" ? (
          <Card className="surface-panel border-white/15 shadow-2xl p-6 space-y-4">
            <h3 className="text-sm font-bold text-white">
              {t.promote.summaryTitle}
            </h3>
            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between gap-4">
                <span className="text-txt-muted">{t.promote.summaryAdLabel}</span>
                <strong className="text-white text-end">{adName}</strong>
              </div>
              <div className="flex items-center justify-between gap-4">
                <span className="text-txt-muted">
                  {t.promote.summaryAudienceLabel}
                </span>
                <strong className="text-white text-end">
                  {audienceSummary}
                </strong>
              </div>
              <div className="flex items-center justify-between gap-4">
                <span className="text-txt-muted">
                  {t.promote.summaryBudgetLabel}
                </span>
                <strong className="text-white text-end">{budgetSummary}</strong>
              </div>
              <div className="flex items-center justify-between gap-4">
                <span className="text-txt-muted">
                  {t.promote.summaryPlatformsLabel}
                </span>
                <strong className="text-white text-end">
                  {platformsSummary}
                </strong>
              </div>
              <div className="flex items-center justify-between gap-4">
                <span className="text-txt-muted">
                  {t.promote.summaryObjectiveLabel}
                </span>
                <strong className="text-white text-end">
                  {t.promote.objectiveOptions[objectiveIndex]}
                </strong>
              </div>
              <div className="flex items-center justify-between gap-4">
                <span className="text-txt-muted">
                  {t.promote.summaryCtaLabel}
                </span>
                <strong className="text-white text-end">{ctaSummary}</strong>
              </div>
              <div className="flex items-center justify-between gap-4">
                <span className="text-txt-muted">
                  {t.promote.summaryPlacementsLabel}
                </span>
                <strong className="text-white text-end">
                  {placementsSummary}
                </strong>
              </div>
            </div>
            <Button
              variant="primary"
              size="lg"
              className="w-full"
              disabled={!canLaunch}
              onClick={handleLaunch}
              leftIcon={<Rocket className="w-4 h-4" />}
            >
              {t.promote.launchBtn}
            </Button>
          </Card>
        ) : status === "review" ? (
          <div className="p-5 rounded-2xl surface-card flex items-center gap-3 animate-in fade-in">
            <Clock className="w-5 h-5 text-accent-cyan shrink-0" />
            <div>
              <p className="text-sm font-bold text-white">
                {t.promote.reviewTitle}
              </p>
              <p className="text-xs text-txt-secondary mt-0.5">
                {t.promote.reviewDesc}
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-3 animate-in fade-in">
            <div className="p-5 rounded-2xl bg-semantic-success/15 border border-semantic-success/40 flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-semantic-success shrink-0" />
              <div>
                <p className="text-sm font-bold text-semantic-success">
                  {t.promote.activeTitle}
                </p>
                <p className="text-xs text-txt-secondary mt-0.5">
                  {t.promote.activeDesc}
                </p>
                <p className="text-xs text-txt-secondary mt-1">
                  {adName} • {audienceSummary} • {budgetSummary}
                </p>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={handleNewPromotion}>
              {t.promote.newPromotionBtn}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
