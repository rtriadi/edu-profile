import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";
import { ThemeStyles } from "@/components/theme-styles";
import { ScrollToTop } from "@/components/ui/scroll-to-top";
import { getSiteConfig } from "@/lib/site-config";
import { validateGoogleAnalyticsId } from "@/lib/security";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

// Dynamic metadata based on site config
export async function generateMetadata(): Promise<Metadata> {
  const config = await getSiteConfig();
  
  return {
    title: {
      default: config.siteName,
      template: `%s | ${config.siteName}`,
    },
    description: config.siteDescription || config.siteTagline,
    keywords: config.siteKeywords ? config.siteKeywords.split(",").map(k => k.trim()) : ["sekolah", "profil sekolah", "CMS", "website sekolah"],
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
  const config = await getSiteConfig();
  
  // Prepare site settings for client-side context
  const siteSettings = {
    siteName: config.siteName,
    siteTagline: config.siteTagline,
    language: config.language,
    timezone: config.timezone,
    maintenanceMode: config.maintenanceMode,
    primaryColor: config.primaryColor,
    secondaryColor: config.secondaryColor,
    accentColor: config.accentColor,
  };
  
  // Validate Google Analytics ID before rendering
  const validGaId = config.googleAnalyticsId && validateGoogleAnalyticsId(config.googleAnalyticsId) 
    ? config.googleAnalyticsId 
    : null;
  
  return (
    <html lang={config.language || "id"} suppressHydrationWarning>
      <head>
        <ThemeStyles />
        {validGaId && (
          <>
            <script
              async
              src={`https://www.googletagmanager.com/gtag/js?id=${validGaId}`}
            />
            <script
              dangerouslySetInnerHTML={{
                __html: `
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());
                  gtag('config', '${validGaId}');
                `,
              }}
            />
          </>
        )}
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers siteSettings={siteSettings}>
          {children}
          <ScrollToTop />
        </Providers>
      </body>
    </html>
  );
}
