import { prisma } from "@/lib/prisma";
import { unstable_cache } from "next/cache";

// Site configuration interface
export interface SiteConfig {
  siteName: string;
  siteTagline: string;
  language: string;
  timezone: string;
  maintenanceMode: boolean;
  // SEO
  siteTitle: string;
  siteDescription: string;
  siteKeywords: string;
  ogImage: string;
  googleAnalyticsId: string;
  // Theme
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  // School Profile
  schoolName: string;
  schoolEmail: string;
  schoolPhone: string;
  schoolAddress: string;
  schoolLogo: string;
  schoolAccreditation: string;
}

// Default configuration
const defaultConfig: SiteConfig = {
  siteName: "EduProfile CMS",
  siteTagline: "Sistem Manajemen Konten Profil Sekolah",
  language: "id",
  timezone: "Asia/Jakarta",
  maintenanceMode: false,
  siteTitle: "",
  siteDescription: "",
  siteKeywords: "",
  ogImage: "",
  googleAnalyticsId: "",
  primaryColor: "#3B82F6",
  secondaryColor: "#10B981",
  accentColor: "#8B5CF6",
  schoolName: "",
  schoolEmail: "",
  schoolPhone: "",
  schoolAddress: "",
  schoolLogo: "",
  schoolAccreditation: "",
};

// Cache the site config to avoid repeated database calls
export const getSiteConfig = unstable_cache(
  async (): Promise<SiteConfig> => {
    try {
      const [settings, schoolProfile] = await Promise.all([
        prisma.setting.findMany({
          where: {
            group: { in: ["general", "seo", "theme"] },
          },
        }),
        prisma.schoolProfile.findFirst(),
      ]);

      // Convert settings array to object
      // Settings are stored as JSON objects like { value: "..." } or direct values
      const settingsMap: Record<string, unknown> = {};
      for (const setting of settings) {
        const val = setting.value;
        // Handle both { value: "..." } format and direct values
        if (val && typeof val === 'object' && 'value' in (val as Record<string, unknown>)) {
          settingsMap[setting.key] = (val as Record<string, unknown>).value;
        } else {
          settingsMap[setting.key] = val;
        }
      }

      return {
        // General settings
        siteName: (settingsMap.siteName as string) || schoolProfile?.name || defaultConfig.siteName,
        siteTagline: (settingsMap.siteTagline as string) || schoolProfile?.tagline || defaultConfig.siteTagline,
        language: (settingsMap.language as string) || defaultConfig.language,
        timezone: (settingsMap.timezone as string) || defaultConfig.timezone,
        maintenanceMode: (settingsMap.maintenanceMode as boolean) || defaultConfig.maintenanceMode,
        // SEO settings
        siteTitle: (settingsMap.siteTitle as string) || defaultConfig.siteTitle,
        siteDescription: (settingsMap.siteDescription as string) || defaultConfig.siteDescription,
        siteKeywords: (settingsMap.siteKeywords as string) || defaultConfig.siteKeywords,
        ogImage: (settingsMap.ogImage as string) || defaultConfig.ogImage,
        googleAnalyticsId: (settingsMap.googleAnalyticsId as string) || defaultConfig.googleAnalyticsId,
        // Theme settings
        primaryColor: (settingsMap.primaryColor as string) || defaultConfig.primaryColor,
        secondaryColor: (settingsMap.secondaryColor as string) || defaultConfig.secondaryColor,
        accentColor: (settingsMap.accentColor as string) || defaultConfig.accentColor,
        // School profile
        schoolName: schoolProfile?.name || defaultConfig.schoolName,
        schoolEmail: schoolProfile?.email || defaultConfig.schoolEmail,
        schoolPhone: schoolProfile?.phone || defaultConfig.schoolPhone,
        schoolAddress: schoolProfile?.address || defaultConfig.schoolAddress,
        schoolLogo: schoolProfile?.logo || defaultConfig.schoolLogo,
        schoolAccreditation: schoolProfile?.accreditation || defaultConfig.schoolAccreditation,
      };
    } catch (error) {
      console.error("Error loading site config:", error);
      return defaultConfig;
    }
  },
  ["site-config"],
  { revalidate: 60, tags: ["site-config", "settings", "school-profile"] }
);

// Get just the site name (for quick access)
export const getSiteName = unstable_cache(
  async (): Promise<string> => {
    try {
      const siteName = await prisma.setting.findUnique({
        where: { key: "siteName" },
      });
      if (siteName?.value) {
        return siteName.value as string;
      }
      const schoolProfile = await prisma.schoolProfile.findFirst({
        select: { name: true },
      });
      return schoolProfile?.name || defaultConfig.siteName;
    } catch {
      return defaultConfig.siteName;
    }
  },
  ["site-name"],
  { revalidate: 60, tags: ["site-config", "settings", "school-profile"] }
);
