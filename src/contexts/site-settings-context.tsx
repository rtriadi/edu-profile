"use client";

import { createContext, useContext, ReactNode } from "react";

export interface SiteSettings {
  siteName: string;
  siteTagline: string;
  language: string;
  timezone: string;
  maintenanceMode: boolean;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
}

const defaultSettings: SiteSettings = {
  siteName: "EduProfile CMS",
  siteTagline: "Sistem Manajemen Konten Profil Sekolah",
  language: "id",
  timezone: "Asia/Jakarta",
  maintenanceMode: false,
  primaryColor: "#3B82F6",
  secondaryColor: "#10B981",
  accentColor: "#8B5CF6",
};

const SiteSettingsContext = createContext<SiteSettings>(defaultSettings);

export function SiteSettingsProvider({
  children,
  settings,
}: {
  children: ReactNode;
  settings: Partial<SiteSettings>;
}) {
  const mergedSettings = { ...defaultSettings, ...settings };

  return (
    <SiteSettingsContext.Provider value={mergedSettings}>
      {children}
    </SiteSettingsContext.Provider>
  );
}

export function useSiteSettings() {
  const context = useContext(SiteSettingsContext);
  if (!context) {
    throw new Error("useSiteSettings must be used within SiteSettingsProvider");
  }
  return context;
}

// Helper hooks for specific settings
export function useTimezone() {
  const { timezone } = useSiteSettings();
  return timezone;
}

export function useLanguage() {
  const { language } = useSiteSettings();
  return language;
}

export function useMaintenanceMode() {
  const { maintenanceMode } = useSiteSettings();
  return maintenanceMode;
}
