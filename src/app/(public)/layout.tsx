import { PublicHeader } from "@/components/public/header";
import { PublicFooter } from "@/components/public/footer";
import { prisma } from "@/lib/prisma";
import { getSiteConfig } from "@/lib/site-config";

async function getLayoutData() {
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
}

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
