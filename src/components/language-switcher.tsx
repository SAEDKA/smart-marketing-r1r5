'use client';

import { useTranslations } from 'next-intl';
import { useEffect, useRef, useState } from 'react';
import { useAppLanguage } from './i18n-provider';

const languageOptions = [
  { code: 'en', label: 'en' },
  { code: 'ar', label: 'ar' },
  { code: 'tr', label: 'tr' },
] as const;

function FlagIcon({ locale }: { locale: 'en' | 'ar' | 'tr' }) {
  if (locale === 'tr') return <svg viewBox="0 0 24 16" className="h-4 w-6 overflow-hidden rounded-sm" aria-hidden="true"><rect width="24" height="16" fill="#e30a17" /><circle cx="10" cy="8" r="4" fill="white" /><circle cx="11.5" cy="8" r="3.2" fill="#e30a17" /><path d="m15 8 3 1.1-1.8-2.5v2.8L18 7.9z" fill="white" /></svg>;
  if (locale === 'ar') return <svg viewBox="0 0 24 16" className="h-4 w-6 overflow-hidden rounded-sm" aria-hidden="true"><rect width="24" height="5.34" fill="#168a45" /><rect y="5.33" width="24" height="5.34" fill="white" /><rect y="10.66" width="24" height="5.34" fill="#111827" /><path d="m7 6.3.4 1.15h1.2l-.97.7.37 1.15L7 8.6l-1 .7.37-1.15-.97-.7h1.2zM12 6.3l.4 1.15h1.2l-.97.7.37 1.15-1-.7-1 .7.37-1.15-.97-.7h1.2zM17 6.3l.4 1.15h1.2l-.97.7.37 1.15-1-.7-1 .7.37-1.15-.97-.7h1.2z" fill="#d62b3f" /></svg>;
  return <svg viewBox="0 0 24 16" className="h-4 w-6 overflow-hidden rounded-sm" aria-hidden="true"><rect width="24" height="16" fill="#1b3f8f" /><path d="M0 0 24 16M24 0 0 16" stroke="white" strokeWidth="4" /><path d="M0 0 24 16M24 0 0 16" stroke="#c8102e" strokeWidth="2" /><path d="M12 0v16M0 8h24" stroke="white" strokeWidth="6" /><path d="M12 0v16M0 8h24" stroke="#c8102e" strokeWidth="3" /></svg>;
}

export function LanguageSwitcher() {
  const t = useTranslations('language');
  const { locale, setLocale } = useAppLanguage();
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const selected = languageOptions.find((language) => language.code === locale) ?? languageOptions[0];

  useEffect(() => {
    function closeOnOutsideClick(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) setOpen(false);
    }
    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') setOpen(false);
    }
    document.addEventListener('mousedown', closeOnOutsideClick);
    document.addEventListener('keydown', closeOnEscape);
    return () => {
      document.removeEventListener('mousedown', closeOnOutsideClick);
      document.removeEventListener('keydown', closeOnEscape);
    };
  }, []);

  return <div ref={containerRef} className="relative text-sm text-white">
    <span className="sr-only">{t('label')}</span>
    <button type="button" onClick={() => setOpen((value) => !value)} aria-haspopup="listbox" aria-expanded={open} aria-label={t('label')} className="flex min-w-36 items-center justify-between gap-3 rounded-xl border border-white/15 bg-white/10 px-3 py-2.5 transition hover:border-accent-mint/60 focus:border-accent-mint focus:outline-none focus:ring-4 focus:ring-accent-mint/20">
      <span className="flex items-center gap-2"><FlagIcon locale={selected.code} /><span>{t(selected.label)}</span></span>
      <span aria-hidden="true" className={`text-xs transition-transform ${open ? 'rotate-180' : ''}`}>⌄</span>
    </button>
    {open ? <div role="listbox" aria-label={t('label')} className="absolute end-0 top-full z-50 mt-2 min-w-44 overflow-hidden rounded-xl border border-slate-200 bg-white p-1 text-slate-700 shadow-lg">
      {languageOptions.map((language) => <button type="button" role="option" aria-selected={language.code === locale} key={language.code} onClick={() => { setLocale(language.code); setOpen(false); }} className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-start transition hover:bg-teal-50 hover:text-teal-800 ${language.code === locale ? 'bg-teal-50 font-semibold text-teal-800' : ''}`}><FlagIcon locale={language.code} /><span>{t(language.label)}</span></button>)}
    </div> : null}
  </div>;
}
