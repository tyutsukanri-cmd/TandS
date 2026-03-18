'use client'

import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import type { I18nKey, Locale } from '@/lib/i18n'
import { DEFAULT_LOCALE, t as translate } from '@/lib/i18n'

type I18nContextValue = {
  locale: Locale
  setLocale: (l: Locale) => void
  t: (key: I18nKey, vars?: Record<string, string | number>) => string
}

const I18nContext = createContext<I18nContextValue | null>(null)

const STORAGE_KEY = 'tands_locale_v1'

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(DEFAULT_LOCALE)

  useEffect(() => {
    if (typeof window === 'undefined') return
    const raw = window.localStorage.getItem(STORAGE_KEY) as Locale | null
    if (raw === 'ja' || raw === 'zh-CN') setLocaleState(raw)
  }, [])

  useEffect(() => {
    if (typeof window === 'undefined') return
    window.localStorage.setItem(STORAGE_KEY, locale)
    document.documentElement.lang = locale === 'ja' ? 'ja' : 'zh-CN'
  }, [locale])

  const setLocale = (l: Locale) => setLocaleState(l)

  const value = useMemo<I18nContextValue>(
    () => ({
      locale,
      setLocale,
      t: (key, vars) => translate(locale, key, vars),
    }),
    [locale]
  )

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
}

export function useI18n() {
  const ctx = useContext(I18nContext)
  if (!ctx) throw new Error('useI18n must be used within I18nProvider')
  return ctx
}

