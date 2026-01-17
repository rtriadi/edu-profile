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

// Navigation items with translation keys
const getNavItems = (t: (key: string) => string) => [
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

interface PublicHeaderProps {
  siteName?: string;
  logo?: string | null;
}

export function PublicHeader({ siteName = "EduProfile", logo }: PublicHeaderProps) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { t } = useTranslation();
  
  const navItems = getNavItems(t);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
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
              <div className="relative h-10 w-10 rounded-xl overflow-hidden ring-2 ring-primary/20 group-hover:ring-primary/40 transition-all">
                <Image
                  src={logo}
                  alt={siteName}
                  fill
                  className="object-cover"
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
                <DropdownMenu key={item.href}>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className={cn(
                        "gap-1 font-medium transition-colors",
                        pathname.startsWith(item.href) && "bg-accent text-accent-foreground"
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
                    pathname === item.href && "bg-accent text-accent-foreground"
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
            <ThemeToggle />
            <Button asChild className="shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all">
              <Link href="/ppdb">{t("nav.register")}</Link>
            </Button>
          </div>

          {/* Mobile Menu */}
          <div className="flex items-center gap-2 lg:hidden">
            <ThemeToggle />
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px] p-0 overflow-y-auto">
                <div className="flex items-center gap-3 p-6 border-b">
                  {logo ? (
                    <div className="relative h-10 w-10 rounded-xl overflow-hidden">
                      <Image src={logo} alt={siteName} fill className="object-cover" />
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
  );
}
