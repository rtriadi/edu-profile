"use client";

import { useSiteSettings } from "@/contexts/site-settings-context";
import { getTranslations, t as translate, type Language, type Translations } from "@/lib/translations";

export function useTranslation() {
  const { language } = useSiteSettings();
  const lang = (language === "en" ? "en" : "id") as Language;
  
  const translations = getTranslations(lang);
  
  // Helper function for nested key access
  const t = (key: string): string => {
    return translate(key, lang);
  };
  
  return {
    t,
    translations,
    language: lang,
  };
}

// Server-side helper to get translations
export function getServerTranslations(language: string = "id"): Translations {
  const lang = (language === "en" ? "en" : "id") as Language;
  return getTranslations(lang);
}
