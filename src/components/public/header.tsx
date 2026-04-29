"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu, GraduationCap, ChevronDown, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ThemeToggle } from "@/components/ui/theme-toggle";
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
    .filter((item) => item.isVisible)
    .map((item) => {
      let href = "/";

      if (item.type === "page" && item.pageSlug) {
        href = item.pageSlug.startsWith("/") ? item.pageSlug : `/${item.pageSlug}`;
      } else if (item.type === "route" && item.url) {
        href = item.url;
      } else if (item.type === "link" && item.url) {
        href = item.url;
      } else if (item.type === "dropdown") {
        if (item.children?.length) {
          const firstVisibleChild = item.children.find((c) => c.isVisible);
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
        if (href === "/") href = "#";
      }

      const visibleChildren = item.children?.filter((c) => c.isVisible) || [];

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
  currentLocale = "id",
}: PublicHeaderProps) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { t } = useTranslation();

  const transformedItems = menuItems.length > 0 ? transformMenuItems(menuItems) : [];
  const navItems: NavItem[] =
    transformedItems.length > 0 ? transformedItems : getDefaultNavItems(t);

  // Handle scroll effect for glassmorphism
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  const isActiveLink = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname === href || pathname.startsWith(href + "/");
  };

  return (
    <>
      {/* Skip to main content for accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground focus:rounded-lg focus:outline-none"
      >
        Langsung ke konten utama
      </a>

      <header
        className={cn(
          "sticky top-0 z-50 w-full transition-all duration-300",
          isScrolled ? "glass-header shadow-sm shadow-black/5" : "bg-transparent"
        )}
      >
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between gap-4">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 flex-shrink-0 group">
              {logo ? (
                <div className="relative h-10 w-auto min-w-[40px]">
                  <Image
                    src={logo}
                    alt={siteName}
                    width={40}
                    height={40}
                    className="object-contain h-10 w-auto transition-opacity group-hover:opacity-85"
                    style={{ maxHeight: "40px" }}
                    priority
                  />
                </div>
              ) : (
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-md shadow-primary/30 group-hover:shadow-primary/50 transition-all group-hover:scale-105">
                  <GraduationCap className="h-5 w-5" />
                </div>
              )}
              <div className="hidden sm:block">
                <span className="font-display font-bold text-lg text-foreground leading-tight tracking-tight">
                  {siteName}
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-0.5 flex-1 justify-center">
              {navItems.map((item) =>
                item.children ? (
                  <DropdownMenu key={`dropdown-${item.label}`}>
                    <DropdownMenuTrigger asChild>
                      <button
                        className={cn(
                          "inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-medium transition-all duration-150",
                          "hover:bg-primary/8 hover:text-primary",
                          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                          isActiveLink(item.href)
                            ? "text-primary bg-primary/8"
                            : "text-foreground/80"
                        )}
                      >
                        {item.label}
                        <ChevronDown className="h-3.5 w-3.5 opacity-60 transition-transform duration-200 group-data-[state=open]:rotate-180" />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      align="center"
                      className="w-52 p-1.5 shadow-xl shadow-black/10 border-border/60"
                    >
                      {item.children.map((child) => (
                        <DropdownMenuItem key={child.href} asChild>
                          <Link
                            href={child.href}
                            className={cn(
                              "w-full cursor-pointer rounded-md px-3 py-2 text-sm transition-colors",
                              isActiveLink(child.href)
                                ? "bg-primary/10 text-primary font-medium"
                                : "hover:bg-muted"
                            )}
                          >
                            {child.label}
                          </Link>
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : (
                  <Link
                    key={item.href}
                    href={item.href}
                    target={item.openNew ? "_blank" : undefined}
                    rel={item.openNew ? "noopener noreferrer" : undefined}
                    className={cn(
                      "inline-flex items-center px-3.5 py-2 rounded-lg text-sm font-medium transition-all duration-150",
                      "hover:bg-primary/8 hover:text-primary",
                      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                      isActiveLink(item.href)
                        ? "text-primary bg-primary/8"
                        : "text-foreground/80"
                    )}
                  >
                    {item.label}
                  </Link>
                )
              )}
            </nav>

            {/* Right side controls */}
            <div className="flex items-center gap-2 flex-shrink-0">
              {/* Language + Theme toggle (desktop) */}
              <div className="hidden lg:flex items-center gap-2">
                <LanguageSwitcher currentLocale={currentLocale} />
                <ThemeToggle />
                <Button
                  asChild
                  size="sm"
                  className="ml-1 shadow-md shadow-primary/20 hover:shadow-primary/35 transition-shadow font-medium"
                >
                  <Link href="/ppdb">{t("nav.register")}</Link>
                </Button>
              </div>

              {/* Mobile: language + theme + hamburger */}
              <div className="flex items-center gap-1 lg:hidden">
                <LanguageSwitcher currentLocale={currentLocale} />
                <ThemeToggle />
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9"
                  onClick={() => setIsOpen(!isOpen)}
                  aria-label={isOpen ? "Tutup menu" : "Buka menu"}
                  aria-expanded={isOpen}
                >
                  {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Menu — Slide-down panel */}
        <div
          className={cn(
            "lg:hidden overflow-hidden transition-all duration-300 ease-in-out",
            isOpen ? "max-h-screen opacity-100" : "max-h-0 opacity-0"
          )}
        >
          <div className="border-t border-border/50 bg-background/98 backdrop-blur-xl">
            {/* Logo row in mobile menu */}
            <div className="flex items-center gap-3 px-4 py-4 border-b border-border/40">
              {logo ? (
                <Image
                  src={logo}
                  alt={siteName}
                  width={32}
                  height={32}
                  className="object-contain h-8 w-auto"
                />
              ) : (
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  <GraduationCap className="h-4 w-4" />
                </div>
              )}
              <span className="font-display font-bold text-base">{siteName}</span>
            </div>

            {/* Navigation links */}
            <nav className="flex flex-col px-3 py-3 gap-0.5">
              {navItems.map((item) => (
                <div key={item.href}>
                  <Link
                    href={item.href}
                    className={cn(
                      "flex items-center py-3 px-4 rounded-xl text-sm font-medium transition-colors",
                      "hover:bg-primary/8 hover:text-primary",
                      isActiveLink(item.href)
                        ? "bg-primary/10 text-primary"
                        : "text-foreground/80"
                    )}
                    onClick={() => !item.children && setIsOpen(false)}
                  >
                    {item.label}
                    {item.children && (
                      <ChevronDown className="ml-auto h-4 w-4 opacity-50" />
                    )}
                  </Link>
                  {item.children && (
                    <div className="ml-4 mt-0.5 mb-1 pl-4 border-l-2 border-primary/20 space-y-0.5">
                      {item.children.map((child) => (
                        <Link
                          key={child.href}
                          href={child.href}
                          className={cn(
                            "block py-2 px-3 rounded-lg text-sm transition-colors",
                            "hover:bg-primary/8 hover:text-primary",
                            isActiveLink(child.href)
                              ? "text-primary font-medium"
                              : "text-muted-foreground"
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

            {/* Mobile CTA */}
            <div className="px-4 pb-5 pt-2 border-t border-border/40">
              <Button className="w-full font-medium" asChild onClick={() => setIsOpen(false)}>
                <Link href="/ppdb">{t("nav.register")}</Link>
              </Button>
            </div>
          </div>
        </div>
      </header>
    </>
  );
}
