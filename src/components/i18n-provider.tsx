'use client';

import { NextIntlClientProvider } from 'next-intl';
import { createContext, useContext, useEffect, useMemo, useSyncExternalStore } from 'react';
import { messages, type Locale } from '@/i18n/messages';

type LanguageContextValue = { locale: Locale; setLocale: (locale: Locale) => void };
const LanguageContext = createContext<LanguageContextValue | null>(null);

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const locale = useSyncExternalStore(
    (onStoreChange) => {
      window.addEventListener('smart-marketing-locale-change', onStoreChange);
      return () => window.removeEventListener('smart-marketing-locale-change', onStoreChange);
    },
    () => {
      const saved = window.localStorage.getItem('smart-marketing-locale') as Locale | null;
      return saved && saved in messages ? saved : 'en';
    },
    () => 'en' as Locale,
  ) as Locale;

  const setLocale = (nextLocale: Locale) => {
    window.localStorage.setItem('smart-marketing-locale', nextLocale);
    window.dispatchEvent(new Event('smart-marketing-locale-change'));
  };

  useEffect(() => {
    document.documentElement.lang = locale;
    document.documentElement.dir = locale === 'ar' ? 'rtl' : 'ltr';
    // NOTE: the saved preference is NOT written back here. During
    // hydration the locale still holds the server snapshot ('en'),
    // and persisting it would clobber the user's saved language
    // before the store ever reads it. setLocale is the only writer.
  }, [locale]);

  const value = useMemo(() => ({ locale, setLocale }), [locale]);
  return <LanguageContext.Provider value={value}><NextIntlClientProvider locale={locale} timeZone="UTC" messages={messages[locale]}>{children}</NextIntlClientProvider></LanguageContext.Provider>;
}

export function useAppLanguage() {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useAppLanguage must be used inside I18nProvider');
  return context;
}
