"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import type { ApiResponse } from "@/types";

// ==========================================
// SETTINGS ACTIONS
// ==========================================

export async function getSettings(group?: string) {
  const where = group ? { group } : {};
  const settings = await prisma.setting.findMany({
    where,
    orderBy: { key: "asc" },
  });
  
  // Convert to key-value object
  const result: Record<string, unknown> = {};
  for (const setting of settings) {
    result[setting.key] = setting.value;
  }
  return result;
}

export async function getSettingsByGroup() {
  const settings = await prisma.setting.findMany({
    orderBy: [{ group: "asc" }, { key: "asc" }],
  });
  
  // Group by group name
  const grouped: Record<string, Record<string, unknown>> = {};
  for (const setting of settings) {
    if (!grouped[setting.group]) {
      grouped[setting.group] = {};
    }
    grouped[setting.group][setting.key] = setting.value;
  }
  return grouped;
}

export async function getSetting(key: string) {
  const setting = await prisma.setting.findUnique({
    where: { key },
  });
  return setting?.value ?? null;
}

export async function setSetting(
  key: string,
  value: unknown,
  group: string = "general"
): Promise<ApiResponse> {
  const session = await auth();
  if (!session) {
    return { success: false, error: "Unauthorized" };
  }

  try {
    await prisma.setting.upsert({
      where: { key },
      create: { key, value: value as object, group },
      update: { value: value as object, group },
    });

    revalidatePath("/admin/settings");
    revalidatePath("/");
    return { success: true, message: "Pengaturan berhasil disimpan" };
  } catch (error) {
    console.error("Set setting error:", error);
    return { success: false, error: "Gagal menyimpan pengaturan" };
  }
}

export async function setSettings(
  settings: { key: string; value: unknown; group?: string }[]
): Promise<ApiResponse> {
  const session = await auth();
  if (!session) {
    return { success: false, error: "Unauthorized" };
  }

  try {
    for (const setting of settings) {
      await prisma.setting.upsert({
        where: { key: setting.key },
        create: { 
          key: setting.key, 
          value: setting.value as object, 
          group: setting.group || "general" 
        },
        update: { 
          value: setting.value as object,
          group: setting.group || "general",
        },
      });
    }

    revalidatePath("/admin/settings");
    revalidatePath("/");
    return { success: true, message: "Pengaturan berhasil disimpan" };
  } catch (error) {
    console.error("Set settings error:", error);
    return { success: false, error: "Gagal menyimpan pengaturan" };
  }
}

export async function deleteSetting(key: string): Promise<ApiResponse> {
  const session = await auth();
  if (!session) {
    return { success: false, error: "Unauthorized" };
  }

  try {
    await prisma.setting.delete({ where: { key } });

    revalidatePath("/admin/settings");
    return { success: true, message: "Pengaturan berhasil dihapus" };
  } catch (error) {
    console.error("Delete setting error:", error);
    return { success: false, error: "Gagal menghapus pengaturan" };
  }
}

// ==========================================
// SEO SETTINGS
// ==========================================

export interface SeoSettings {
  siteTitle?: string;
  siteDescription?: string;
  siteKeywords?: string;
  ogImage?: string;
  googleAnalyticsId?: string;
  googleTagManagerId?: string;
  facebookPixelId?: string;
  robotsTxt?: string;
}

export async function getSeoSettings(): Promise<SeoSettings> {
  const settings = await getSettings("seo");
  return settings as SeoSettings;
}

export async function saveSeoSettings(data: SeoSettings): Promise<ApiResponse> {
  const session = await auth();
  if (!session) {
    return { success: false, error: "Unauthorized" };
  }

  try {
    const settingsToSave = Object.entries(data).map(([key, value]) => ({
      key,
      value,
      group: "seo",
    }));

    return await setSettings(settingsToSave);
  } catch (error) {
    console.error("Save SEO settings error:", error);
    return { success: false, error: "Gagal menyimpan pengaturan SEO" };
  }
}

// ==========================================
// THEME SETTINGS
// ==========================================

export interface ThemeSettings {
  primaryColor?: string;
  secondaryColor?: string;
  accentColor?: string;
  fontFamily?: string;
  headerStyle?: string;
  footerStyle?: string;
  customCss?: string;
}

export async function getThemeSettings(): Promise<ThemeSettings> {
  const settings = await getSettings("theme");
  return settings as ThemeSettings;
}

export async function saveThemeSettings(data: ThemeSettings): Promise<ApiResponse> {
  const session = await auth();
  if (!session) {
    return { success: false, error: "Unauthorized" };
  }

  try {
    const settingsToSave = Object.entries(data).map(([key, value]) => ({
      key,
      value,
      group: "theme",
    }));

    return await setSettings(settingsToSave);
  } catch (error) {
    console.error("Save theme settings error:", error);
    return { success: false, error: "Gagal menyimpan pengaturan tema" };
  }
}

// ==========================================
// EMAIL SETTINGS
// ==========================================

export interface EmailSettings {
  smtpHost?: string;
  smtpPort?: number;
  smtpUser?: string;
  smtpPassword?: string;
  smtpSecure?: boolean;
  fromEmail?: string;
  fromName?: string;
  contactEmail?: string;
  ppdbNotifyEmail?: string;
}

export async function getEmailSettings(): Promise<EmailSettings> {
  const settings = await getSettings("email");
  return settings as EmailSettings;
}

export async function saveEmailSettings(data: EmailSettings): Promise<ApiResponse> {
  const session = await auth();
  if (!session) {
    return { success: false, error: "Unauthorized" };
  }

  try {
    const settingsToSave = Object.entries(data).map(([key, value]) => ({
      key,
      value,
      group: "email",
    }));

    return await setSettings(settingsToSave);
  } catch (error) {
    console.error("Save email settings error:", error);
    return { success: false, error: "Gagal menyimpan pengaturan email" };
  }
}

// ==========================================
// GENERAL SETTINGS
// ==========================================

export interface GeneralSettings {
  siteName?: string;
  siteTagline?: string;
  language?: string;
  timezone?: string;
  maintenanceMode?: boolean;
}

export async function getGeneralSettings(): Promise<GeneralSettings> {
  const settings = await getSettings("general");
  return settings as GeneralSettings;
}

export async function saveGeneralSettings(data: GeneralSettings): Promise<ApiResponse> {
  const session = await auth();
  if (!session) {
    return { success: false, error: "Unauthorized" };
  }

  try {
    const settingsToSave = Object.entries(data).map(([key, value]) => ({
      key,
      value,
      group: "general",
    }));

    return await setSettings(settingsToSave);
  } catch (error) {
    console.error("Save general settings error:", error);
    return { success: false, error: "Gagal menyimpan pengaturan umum" };
  }
}
