"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu, GraduationCap, ChevronDown } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { DateTimeDisplay } from "@/components/ui/datetime-display";
import { cn } from "@/lib/utils";
import { useTranslation } from "@/hooks/use-translation";
import { LanguageSwitcher } from "./language-switcher";

// Menu item from database
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

// Navigation item for internal use (transformed from MenuItem or default)
interface NavItem {
  label: string;
  href: string;
  openNew?: boolean;
  children?: NavItem[];
}

// Default navigation items with translation keys (fallback when no menu in database)
const getDefaultNavItems = (t: (key: string) => string): NavItem[] => [
  { label: t("nav.home"), href: "/" },
  {
    label: t("nav.profile"),
    href: "/profil",
    children: [
      { label: t("nav.aboutUs"), href: "/profil" },
      { label: t("nav.visionMission"), href: "/profil/visi-misi" },
      { label: t("nav.history"), href: "/profil/sejarah" },
      { label: t("nav.structure"), href: "/profil/struktur" },
      { label: t("nav.teachersStaff"), href: "/profil/guru-staff" },
      { label: t("nav.facilities"), href: "/profil/fasilitas" },
    ],
  },
  {
    label: t("nav.academic"),
    href: "/akademik",
    children: [
      { label: t("nav.curriculum"), href: "/akademik/kurikulum" },
      { label: t("nav.extracurricular"), href: "/akademik/ekstrakurikuler" },
      { label: t("nav.featuredPrograms"), href: "/akademik/program-unggulan" },
      { label: t("nav.achievements"), href: "/akademik/prestasi" },
    ],
  },
  { label: t("nav.news"), href: "/berita" },
  { label: t("nav.gallery"), href: "/galeri" },
  { label: t("nav.ppdb"), href: "/ppdb" },
  { label: t("nav.contact"), href: "/kontak" },
];

// Transform database menu items to NavItem format
function transformMenuItems(items: MenuItem[]): NavItem[] {
  return items
    .filter(item => item.isVisible) // Only process visible items
    .map((item) => {
      // Determine href based on type
      let href = "/";
      
      if (item.type === "page" && item.pageSlug) {
        // CMS page - use pageSlug as href
        href = item.pageSlug.startsWith("/") ? item.pageSlug : `/${item.pageSlug}`;
      } else if (item.type === "route" && item.url) {
        // System route - use url directly (e.g., /profil, /akademik)
        href = item.url;
      } else if (item.type === "link" && item.url) {
        // External link - use url
        href = item.url;
      } else if (item.type === "dropdown") {
        // Dropdown parent - use first child's href or #
        if (item.children?.length) {
          const firstVisibleChild = item.children.find(c => c.isVisible);
          if (firstVisibleChild) {
            if (firstVisibleChild.type === "route" && firstVisibleChild.url) {
              href = firstVisibleChild.url;
            } else if (firstVisibleChild.type === "page" && firstVisibleChild.pageSlug) {
              href = firstVisibleChild.pageSlug.startsWith("/") 
                ? firstVisibleChild.pageSlug 
                : `/${firstVisibleChild.pageSlug}`;
            } else if (firstVisibleChild.url) {
              href = firstVisibleChild.url;
            }
          }
        }
        // If no children or no valid href found, use #
        if (href === "/") href = "#";
      }

      // Get visible children
      const visibleChildren = item.children?.filter(c => c.isVisible) || [];

      return {
        label: item.label,
        href,
        openNew: item.openNew,
        children: visibleChildren.length > 0 ? transformMenuItems(visibleChildren) : undefined,
      };
    });
}

interface PublicHeaderProps {
  siteName?: string;
  logo?: string | null;
  menuItems?: MenuItem[];
  currentLocale?: "id" | "en";
}

export function PublicHeader({ 
  siteName = "EduProfile", 
  logo, 
  menuItems = [], 
  currentLocale = "id" 
}: PublicHeaderProps) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { t } = useTranslation();
  
  // Use menu from database if available and valid, otherwise use default
  // Transform first, then check if we got any valid items
  const transformedItems = menuItems.length > 0 ? transformMenuItems(menuItems) : [];
  const navItems: NavItem[] = transformedItems.length > 0 
    ? transformedItems 
    : getDefaultNavItems(t);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      {/* Skip to main content link for accessibility */}
      <a 
        href="#main-content" 
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground focus:rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
      >
        Langsung ke konten utama
      </a>
      <header 
        className={cn(
          "sticky top-0 z-50 w-full border-b transition-all duration-300",
          isScrolled 
            ? "bg-background/95 backdrop-blur-lg shadow-sm supports-[backdrop-filter]:bg-background/80" 
            : "bg-background/80 backdrop-blur-sm"
        )}
      >
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            {logo ? (
              <div className="relative h-10 w-auto min-w-10 group-hover:opacity-90 transition-all">
                <Image
                  src={logo}
                  alt={siteName}
                  width={40}
                  height={40}
                  className="object-contain h-10 w-auto"
                  style={{ maxHeight: '40px' }}
                  priority
                />
              </div>
            ) : (
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-primary text-white shadow-lg shadow-primary/25 group-hover:shadow-primary/40 transition-all">
                <GraduationCap className="h-5 w-5" />
              </div>
            )}
            <div className="hidden sm:block">
              <span className="font-bold text-lg bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text">
                {siteName}
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) =>
              item.children ? (
                <DropdownMenu key={`dropdown-${item.label}-${item.href}`}>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className={cn(
                        "gap-1 font-medium transition-colors",
                        pathname !== "/" && item.href !== "/" && pathname.startsWith(item.href) && "bg-accent text-accent-foreground"
                      )}
                    >
                      {item.label}
                      <ChevronDown className="h-4 w-4 opacity-50" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="w-48">
                    {item.children.map((child) => (
                      <DropdownMenuItem key={child.href} asChild>
                        <Link 
                          href={child.href}
                          className={cn(
                            "w-full cursor-pointer",
                            pathname === child.href && "bg-accent"
                          )}
                        >
                          {child.label}
                        </Link>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Button
                  key={item.href}
                  variant="ghost"
                  asChild
                  className={cn(
                    "font-medium transition-colors",
                    (pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href + "/"))) && "bg-accent text-accent-foreground"
                  )}
                >
                  <Link href={item.href}>{item.label}</Link>
                </Button>
              )
            )}
          </nav>

          {/* CTA Button & Theme Toggle */}
          <div className="hidden lg:flex items-center gap-3">
            <DateTimeDisplay 
              showIcon={true} 
              showTimezone={false} 
              format="full"
              className="text-xs text-muted-foreground"
            />
            <LanguageSwitcher currentLocale={currentLocale} />
            <ThemeToggle />
            <Button asChild className="shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all">
              <Link href="/ppdb">{t("nav.register")}</Link>
            </Button>
          </div>

          {/* Mobile Menu */}
          <div className="flex items-center gap-2 lg:hidden">
            <LanguageSwitcher currentLocale={currentLocale} />
            <ThemeToggle />
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-72 sm:w-96 p-0 overflow-y-auto">
                <div className="flex items-center gap-3 p-6 border-b">
                  {logo ? (
                    <div className="relative h-10 w-auto min-w-10">
                      <Image 
                        src={logo} 
                        alt={siteName} 
                        width={40}
                        height={40}
                        className="object-contain h-10 w-auto"
                        style={{ maxHeight: '40px' }}
                      />
                    </div>
                  ) : (
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-primary text-white">
                      <GraduationCap className="h-5 w-5" />
                    </div>
                  )}
                  <span className="font-bold text-lg">{siteName}</span>
                </div>
                <nav className="flex flex-col gap-1 p-4">
                  {navItems.map((item) => (
                    <div key={item.href}>
                      <Link
                        href={item.href}
                        className={cn(
                          "flex items-center py-3 px-4 rounded-lg text-base font-medium transition-colors hover:bg-accent",
                          pathname === item.href && "bg-accent text-accent-foreground"
                        )}
                        onClick={() => !item.children && setIsOpen(false)}
                      >
                        {item.label}
                      </Link>
                      {item.children && (
                        <div className="ml-4 mt-1 space-y-1 border-l-2 border-border pl-4">
                          {item.children.map((child) => (
                            <Link
                              key={child.href}
                              href={child.href}
                              className={cn(
                                "block py-2 px-3 rounded-md text-sm text-muted-foreground transition-colors hover:text-foreground hover:bg-accent",
                                pathname === child.href && "text-foreground bg-accent"
                              )}
                              onClick={() => setIsOpen(false)}
                            >
                              {child.label}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </nav>
                <div className="mt-auto p-4 border-t">
                  <Button className="w-full" asChild onClick={() => setIsOpen(false)}>
                    <Link href="/ppdb">{t("nav.register")}</Link>
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
    </>
  );
}
