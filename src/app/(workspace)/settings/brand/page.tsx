"use client";

import React, { useState, useEffect } from "react";
import { useI18n } from "@/lib/i18n/context";
import { companyApi } from "@/lib/api/company.api";
import { BrandSettings, CommunicationTone, ContentLanguage, ApiErrorShape } from "@/types/domain";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import {
  Sparkles,
  Save,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Clock,
} from "lucide-react";
import { formatDate } from "@/lib/utils";

/**
 * A question answered by tapping ready-made options instead of writing
 * prose — the way Predis-style onboarding does it. "Other" opens a
 * free-text box for anything the options miss. The stored value stays a
 * plain string: the chosen options joined together, plus the free text
 * when present, so saving and syncing work exactly as before.
 */
function ChoiceField({
  label,
  options,
  value,
  onChange,
  multi = false,
  otherLabel,
  otherPlaceholder,
  locale,
}: {
  label: string;
  options: string[];
  value: string;
  onChange: (next: string) => void;
  multi?: boolean;
  otherLabel: string;
  otherPlaceholder: string;
  locale: string;
}) {
  const sep = locale === "ar" ? "، " : ", ";
  const parts = value ? value.split(/[,،]\s*/).filter(Boolean) : [];
  const selected = options.filter((o) => parts.includes(o));
  const otherText = parts.filter((pt) => !options.includes(pt)).join(sep);
  const [otherOpen, setOtherOpen] = useState(false);
  const showOther = otherOpen || otherText.length > 0;

  const compose = (sel: string[], other: string) =>
    [...sel, ...(other.trim() ? [other.trim()] : [])].join(sep);

  const toggle = (opt: string) => {
    if (!multi) {
      onChange(
        selected.includes(opt)
          ? compose([], otherText)
          : compose([opt], otherText)
      );
      return;
    }
    const next = selected.includes(opt)
      ? selected.filter((o) => o !== opt)
      : [...selected, opt];
    onChange(compose(next, otherText));
  };

  return (
    <div className="space-y-2">
      <span className="block text-xs font-medium text-txt-secondary">
        {label}
      </span>
      <div className="flex flex-wrap gap-2">
        {options.map((opt) => {
          const isActive = selected.includes(opt);
          return (
            <button
              key={opt}
              type="button"
              onClick={() => toggle(opt)}
              aria-pressed={isActive}
              className={`px-3 py-1.5 rounded-full border text-xs transition-all ${
                isActive
                  ? "bg-accent-violet/20 border-accent-violet text-white font-semibold"
                  : "bg-white/5 border-white/10 text-txt-secondary hover:text-white"
              }`}
            >
              {opt}
            </button>
          );
        })}
        <button
          type="button"
          onClick={() => setOtherOpen((open) => !open)}
          aria-pressed={showOther}
          className={`px-3 py-1.5 rounded-full border border-dashed text-xs transition-all ${
            showOther
              ? "bg-accent-violet/10 border-accent-violet text-white font-semibold"
              : "border-white/20 text-txt-secondary hover:text-white"
          }`}
        >
          {otherLabel}
        </button>
      </div>
      {showOther && (
        <Textarea
          value={otherText}
          onChange={(e) => onChange(compose(selected, e.target.value))}
          placeholder={otherPlaceholder}
          rows={2}
        />
      )}
    </div>
  );
}

export default function BrandSettingsPage() {
  const { t, locale } = useI18n();

  const [initialData, setInitialData] = useState<BrandSettings | null>(null);
  const [brandName, setBrandName] = useState("");
  const [brandDescription, setBrandDescription] = useState("");
  const [communicationTone, setCommunicationTone] = useState<CommunicationTone>("LUXURY");
  const [preferredLanguage, setPreferredLanguage] = useState<ContentLanguage>("en");
  const [targetAudienceSummary, setTargetAudienceSummary] = useState("");
  const [keyValueProposition, setKeyValueProposition] = useState("");
  const [brandGuidelines, setBrandGuidelines] = useState("");

  const [, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [statusMsg, setStatusMsg] = useState<{ type: "success" | "error"; text: string } | null>(
    null
  );

  const fetchBrandSettings = async () => {
    setIsLoading(true);
    setStatusMsg(null);
    try {
      const res = await companyApi.getBrandSettings();
      if (res.data) {
        setInitialData(res.data);
        setBrandName(res.data.brandName || "");
        setBrandDescription(res.data.brandDescription || "");
        setCommunicationTone(res.data.communicationTone || "LUXURY");
        setPreferredLanguage(res.data.preferredLanguage || "en");
        setTargetAudienceSummary(res.data.targetAudienceSummary || "");
        setKeyValueProposition(res.data.keyValueProposition || "");
        setBrandGuidelines(res.data.brandGuidelines || "");
      }
    } catch (err) {
      const apiErr = err as ApiErrorShape;
      setStatusMsg({
        type: "error",
        text: apiErr.message || t.common.errorOccurred,
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBrandSettings();
  }, []);

  const hasUnsavedChanges =
    initialData &&
    (brandName !== initialData.brandName ||
      brandDescription !== initialData.brandDescription ||
      communicationTone !== initialData.communicationTone ||
      preferredLanguage !== initialData.preferredLanguage ||
      targetAudienceSummary !== initialData.targetAudienceSummary ||
      keyValueProposition !== initialData.keyValueProposition ||
      brandGuidelines !== initialData.brandGuidelines);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setStatusMsg(null);

    try {
      const res = await companyApi.updateBrandSettings({
        brandName,
        brandDescription,
        communicationTone,
        preferredLanguage,
        targetAudienceSummary,
        keyValueProposition,
        brandGuidelines,
      });
      setInitialData(res.data);
      setStatusMsg({
        type: "success",
        text: t.common.savedSuccessfully,
      });
    } catch (err) {
      const apiErr = err as ApiErrorShape;
      setStatusMsg({
        type: "error",
        text: apiErr.message || t.common.errorOccurred,
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDiscard = () => {
    if (!initialData) return;
    if (confirm(t.brand.discardConfirm)) {
      setBrandName(initialData.brandName);
      setBrandDescription(initialData.brandDescription);
      setCommunicationTone(initialData.communicationTone);
      setPreferredLanguage(initialData.preferredLanguage);
      setTargetAudienceSummary(initialData.targetAudienceSummary);
      setKeyValueProposition(initialData.keyValueProposition);
      setBrandGuidelines(initialData.brandGuidelines);
      setStatusMsg(null);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            {t.brand.title}
          </h1>
          {/* Brand settings sync with /api/v1/company/brand (WEB-01-07) — traceability lives in code, not on the user's screen */}
          <p className="text-sm text-txt-secondary mt-1">{t.brand.subtitle}</p>
        </div>

        <div className="flex items-center gap-2">
          {initialData?.updatedAt && (
            <div className="flex items-center gap-1.5 text-[11px] text-txt-muted bg-white/5 px-3 py-1.5 rounded-full border border-white/5">
              <Clock className="w-3.5 h-3.5 text-accent-cyan" />
              <span>
                {t.brand.lastSynchronized}:{" "}
                {formatDate(initialData.updatedAt, locale)}
              </span>
            </div>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={fetchBrandSettings}
            title={t.brand.reloadFromServer}
            leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
          >
            Sync
          </Button>
        </div>
      </div>

      {/* Notifications */}
      {statusMsg && (
        <div
          role="alert"
          className={`p-4 rounded-2xl text-xs sm:text-sm flex items-center gap-3 animate-in fade-in ${
            statusMsg.type === "success"
              ? "bg-semantic-success/15 border border-semantic-success/40 text-semantic-success"
              : "bg-semantic-error/15 border border-semantic-error/40 text-semantic-error"
          }`}
        >
          {statusMsg.type === "success" ? (
            <CheckCircle2 className="w-5 h-5 shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 shrink-0" />
          )}
          <span>{statusMsg.text}</span>
        </div>
      )}

      {/* Main Settings Form */}
      <form onSubmit={handleSave} className="space-y-6">
        <Card className="surface-panel border-white/15 shadow-2xl p-6 sm:p-8 space-y-6">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-accent-violet" />
              <h2 className="text-base font-semibold text-white">
                {t.brand.identityTitle}
              </h2>
            </div>
            {hasUnsavedChanges && (
              <Badge variant="warning" size="sm">
                {t.common.unsavedChanges}
              </Badge>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label={t.brand.brandName}
              value={brandName}
              onChange={(e) => setBrandName(e.target.value)}
              required
            />

            <div>
              <label className="block text-xs font-medium text-txt-secondary mb-1.5">
                {t.brand.communicationTone}
              </label>
              {/* Tappable chips in the interface language — a native select
                  shows raw English enum names and a browser-blue popup
                  that clashes with the theme. */}
              <div className="flex flex-wrap gap-1 rounded-2xl border border-white/10 bg-white/5 p-1">
                {(
                  [
                    ["PROFESSIONAL", t.onboarding.tones.PROFESSIONAL],
                    ["FRIENDLY", t.onboarding.tones.FRIENDLY],
                    ["LUXURY", t.onboarding.tones.LUXURY],
                    ["BOLD", t.onboarding.tones.BOLD],
                    ["EDUCATIONAL", t.onboarding.tones.EDUCATIONAL],
                  ] as [CommunicationTone, string][]
                ).map(([value, label]) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setCommunicationTone(value)}
                    aria-pressed={communicationTone === value}
                    className={`flex-1 px-3 py-2 rounded-xl text-xs whitespace-nowrap transition-all ${
                      communicationTone === value
                        ? "bg-accent-violet text-white font-semibold"
                        : "text-txt-secondary hover:text-white"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <ChoiceField
            label={t.brand.brandDescription}
            options={t.brand.descriptionOptions}
            value={brandDescription}
            onChange={setBrandDescription}
            otherLabel={t.brand.otherLabel}
            otherPlaceholder={t.brand.otherPlaceholder}
            locale={locale}
          />

          <div className="space-y-2">
            <label className="block text-xs font-medium text-txt-secondary">
              {t.brand.preferredLanguage}
            </label>
            <div className="flex flex-wrap gap-1 rounded-2xl border border-white/10 bg-white/5 p-1">
              {[
                { code: "en", label: "English" },
                { code: "tr", label: "Türkçe" },
                { code: "ar", label: "العربية" },
              ].map((item) => (
                <button
                  key={item.code}
                  type="button"
                  onClick={() => setPreferredLanguage(item.code as ContentLanguage)}
                  aria-pressed={preferredLanguage === item.code}
                  className={`flex-1 px-4 py-2 rounded-xl text-xs whitespace-nowrap transition-all ${
                    preferredLanguage === item.code
                      ? "bg-accent-violet text-white font-semibold"
                      : "text-txt-secondary hover:text-white"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          <div className="border-t border-white/10 pt-6 space-y-4">
            <h3 className="text-sm font-semibold text-accent-cyan">
              {t.brand.audienceTitle}
            </h3>
            <p className="text-[11px] leading-relaxed text-txt-muted">
              {t.brand.optionalNote}
            </p>

            <ChoiceField
              label={t.brand.targetAudienceSummary}
              options={t.brand.audienceOptions}
              value={targetAudienceSummary}
              onChange={setTargetAudienceSummary}
              multi
              otherLabel={t.brand.otherLabel}
              otherPlaceholder={t.brand.otherPlaceholder}
              locale={locale}
            />

            <ChoiceField
              label={t.brand.keyValueProposition}
              options={t.brand.valueOptions}
              value={keyValueProposition}
              onChange={setKeyValueProposition}
              multi
              otherLabel={t.brand.otherLabel}
              otherPlaceholder={t.brand.otherPlaceholder}
              locale={locale}
            />

            <ChoiceField
              label={t.brand.brandGuidelines}
              options={t.brand.guidelinesOptions}
              value={brandGuidelines}
              onChange={setBrandGuidelines}
              multi
              otherLabel={t.brand.otherLabel}
              otherPlaceholder={t.brand.otherPlaceholder}
              locale={locale}
            />
          </div>

          {/* Action Bar */}
          <div className="flex items-center justify-between pt-6 border-t border-white/10">
            <Button
              type="button"
              variant="outline"
              onClick={handleDiscard}
              disabled={!hasUnsavedChanges}
              leftIcon={<RotateCcw className="w-4 h-4" />}
            >
              {t.common.reset}
            </Button>

            <Button
              type="submit"
              variant="primary"
              isLoading={isSaving}
              leftIcon={<Save className="w-4 h-4" />}
            >
              {isSaving ? t.common.saving : t.common.save}
            </Button>
          </div>
        </Card>
      </form>
    </div>
  );
}
