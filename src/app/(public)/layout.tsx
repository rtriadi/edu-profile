import { PublicHeader } from "@/components/public/header";
import { PublicFooter } from "@/components/public/footer";
import { prisma } from "@/lib/prisma";
import { getSiteConfig } from "@/lib/site-config";
import { getMenuByLocation } from "@/actions/menus";
import { getLocale } from "@/actions/locale";

// Dynamic rendering - fetch fresh data on each request
// This prevents build-time database errors on Vercel
export const dynamic = "force-dynamic";

// Menu item type for header
interface MenuItem {
  id: string;
  label: string;
  url: string | null;
  pageSlug: string | null;
  type: string;
  order: number;
  isVisible: boolean;
  openNew: boolean;
  children?: MenuItem[];
}

// Fetch layout data
async function getLayoutData() {
  try {
    const [schoolProfile, siteConfig, headerMenu] = await Promise.all([
      prisma.schoolProfile.findFirst({
        select: {
          name: true,
          logo: true,
        },
      }),
      getSiteConfig(),
      getMenuByLocation("header"),
    ]);
    
    // Transform menu items to simpler format
    const menuItems: MenuItem[] = headerMenu?.items?.map((item) => ({
      id: item.id,
      label: item.label,
      url: item.url,
      pageSlug: item.pageSlug,
      type: item.type,
      order: item.order,
      isVisible: item.isVisible,
      openNew: item.openNew,
      children: item.children?.map((child) => ({
        id: child.id,
        label: child.label,
        url: child.url,
        pageSlug: child.pageSlug,
        type: child.type,
        order: child.order,
        isVisible: child.isVisible,
        openNew: child.openNew,
        children: child.children?.map((subChild) => ({
          id: subChild.id,
          label: subChild.label,
          url: subChild.url,
          pageSlug: subChild.pageSlug,
          type: subChild.type,
          order: subChild.order,
          isVisible: subChild.isVisible,
          openNew: subChild.openNew,
        })),
      })),
    })) || [];
    
    return {
      siteName: siteConfig.siteName || schoolProfile?.name || "EduProfile",
      logo: schoolProfile?.logo || null,
      menuItems,
    };
  } catch (error) {
    console.error("Error fetching layout data:", error);
    // Return default values if database is unavailable
    return {
      siteName: "EduProfile",
      logo: null,
      menuItems: [],
    };
  }
}

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { siteName, logo, menuItems } = await getLayoutData();
  const locale = await getLocale();

  return (
    <div className="min-h-screen flex flex-col">
      <PublicHeader 
        siteName={siteName} 
        logo={logo} 
        menuItems={menuItems} 
        currentLocale={locale}
      />
      {children}
      <PublicFooter />
    </div>
  );
}
