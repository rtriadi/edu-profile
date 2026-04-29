import type { Metadata } from "next";
import { Fraunces, Plus_Jakarta_Sans, Geist_Mono } from "next/font/google";
import { cache } from "react";
import "./globals.css";
import { Providers } from "@/components/providers";
import { ThemeStyles } from "@/components/theme-styles";
import { ScrollToTop } from "@/components/ui/scroll-to-top";
import { SkipLink } from "@/components/ui/skip-link";
import { GoogleAnalytics } from "@/components/google-analytics";
import { getSiteConfig } from "@/lib/site-config";
import { validateGoogleAnalyticsId } from "@/lib/security";
import { getLocale } from "@/actions/locale";

// Cache getSiteConfig per-request to avoid double DB call
// (generateMetadata + RootLayout both need it, cache deduplicates)
const getCachedConfig = cache(getSiteConfig);

const fraunces = Fraunces({
  variable: "--font-display",
  subsets: ["latin"],
  display: "swap",
});

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  display: "swap",
});

// Dynamic metadata based on site config
export async function generateMetadata(): Promise<Metadata> {
  const config = await getCachedConfig();

  return {
    title: {
      default: config.siteName,
      template: `%s | ${config.siteName}`,
    },
    description: config.siteDescription || config.siteTagline,
    keywords: config.siteKeywords
      ? config.siteKeywords.split(",").map((k) => k.trim())
      : ["sekolah", "profil sekolah", "CMS", "website sekolah"],
    openGraph: {
      title: config.siteName,
      description: config.siteDescription || config.siteTagline,
      images: config.ogImage ? [config.ogImage] : [],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: config.siteName,
      description: config.siteDescription || config.siteTagline,
    },
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Single DB call — React.cache() deduplicates across generateMetadata + here
  const [config, locale] = await Promise.all([
    getCachedConfig(),
    getLocale(),
  ]);

  // Prepare site settings for client-side context
  const siteSettings = {
    siteName: config.siteName,
    siteTagline: config.siteTagline,
    language: locale || config.language,
    timezone: config.timezone,
    maintenanceMode: config.maintenanceMode,
    primaryColor: config.primaryColor,
    secondaryColor: config.secondaryColor,
    accentColor: config.accentColor,
  };

  // Validate Google Analytics ID before rendering
  const validGaId =
    config.googleAnalyticsId &&
    validateGoogleAnalyticsId(config.googleAnalyticsId)
      ? config.googleAnalyticsId
      : null;

  return (
    <html lang={locale || config.language || "id"} suppressHydrationWarning>
      <head>
        <ThemeStyles />
      </head>
      <body
        className={`${fraunces.variable} ${plusJakartaSans.variable} ${geistMono.variable} antialiased`}
      >
        <SkipLink />
        <Providers siteSettings={siteSettings}>
          {children}
          <ScrollToTop />
        </Providers>
        {/* Defer GA loading until after hydration for better performance */}
        {validGaId && <GoogleAnalytics gaId={validGaId} />}
      </body>
    </html>
  );
}
