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
import { cn } from "@/lib/utils";

const navItems = [
  { label: "Beranda", href: "/" },
  {
    label: "Profil",
    href: "/profil",
    children: [
      { label: "Tentang Kami", href: "/profil" },
      { label: "Visi & Misi", href: "/profil/visi-misi" },
      { label: "Sejarah", href: "/profil/sejarah" },
      { label: "Struktur Organisasi", href: "/profil/struktur" },
      { label: "Guru & Staff", href: "/profil/guru-staff" },
      { label: "Fasilitas", href: "/profil/fasilitas" },
    ],
  },
  {
    label: "Akademik",
    href: "/akademik",
    children: [
      { label: "Kurikulum", href: "/akademik/kurikulum" },
      { label: "Ekstrakurikuler", href: "/akademik/ekstrakurikuler" },
      { label: "Program Unggulan", href: "/akademik/program-unggulan" },
      { label: "Prestasi", href: "/akademik/prestasi" },
    ],
  },
  { label: "Berita", href: "/berita" },
  { label: "Galeri", href: "/galeri" },
  { label: "PPDB", href: "/ppdb" },
  { label: "Kontak", href: "/kontak" },
];

interface PublicHeaderProps {
  siteName?: string;
  logo?: string | null;
}

export function PublicHeader({ siteName = "EduProfile", logo }: PublicHeaderProps) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

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
            <ThemeToggle />
            <Button asChild className="shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all">
              <Link href="/ppdb">Daftar PPDB</Link>
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
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <div className="flex items-center gap-3 mb-8">
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
                <nav className="flex flex-col gap-2">
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
                  <div className="mt-6 pt-6 border-t">
                    <Button className="w-full" asChild onClick={() => setIsOpen(false)}>
                      <Link href="/ppdb">Daftar PPDB</Link>
                    </Button>
                  </div>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
