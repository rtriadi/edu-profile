import { MetadataRoute } from "next";
import { getSiteConfig } from "@/lib/site-config";

export default async function robots(): Promise<MetadataRoute.Robots> {
  // Get base URL from environment or site config (if we add domain setting later)
  // For now, env var is the source of truth for base URL
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://example.com";

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/admin/",
          "/api/",
          "/auth/",
          "/_next/",
          "/static/",
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
