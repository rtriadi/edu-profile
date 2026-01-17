import { PublicHeader } from "@/components/public/header";
import { PublicFooter } from "@/components/public/footer";
import { prisma } from "@/lib/prisma";
import { getSiteConfig } from "@/lib/site-config";
import { unstable_cache } from "next/cache";

// Cache the layout data to avoid connection pool issues during build
const getLayoutData = unstable_cache(
  async () => {
    try {
      const [schoolProfile, siteConfig] = await Promise.all([
        prisma.schoolProfile.findFirst({
          select: {
            name: true,
            logo: true,
          },
        }),
        getSiteConfig(),
      ]);
      
      return {
        siteName: siteConfig.siteName || schoolProfile?.name || "EduProfile",
        logo: schoolProfile?.logo || null,
      };
    } catch (error) {
      console.error("Error fetching layout data:", error);
      // Return default values if database is unavailable
      return {
        siteName: "EduProfile",
        logo: null,
      };
    }
  },
  ["public-layout-data"],
  { revalidate: 60, tags: ["layout", "school-profile"] }
);

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { siteName, logo } = await getLayoutData();

  return (
    <div className="min-h-screen flex flex-col">
      <PublicHeader siteName={siteName} logo={logo} />
      {children}
      <PublicFooter />
    </div>
  );
}
