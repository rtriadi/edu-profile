"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, GraduationCap, ChevronDown } from "lucide-react";

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

export function PublicHeader() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <GraduationCap className="h-5 w-5" />
            </div>
            <span className="font-bold text-lg hidden sm:block">EduProfile</span>
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
                        "gap-1",
                        pathname.startsWith(item.href) && "bg-accent"
                      )}
                    >
                      {item.label}
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start">
                    {item.children.map((child) => (
                      <DropdownMenuItem key={child.href} asChild>
                        <Link href={child.href}>{child.label}</Link>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Button
                  key={item.href}
                  variant="ghost"
                  asChild
                  className={cn(pathname === item.href && "bg-accent")}
                >
                  <Link href={item.href}>{item.label}</Link>
                </Button>
              )
            )}
          </nav>

          {/* CTA Button & Theme Toggle */}
          <div className="hidden lg:flex items-center gap-2">
            <ThemeToggle />
            <Button asChild>
              <Link href="/ppdb">Daftar PPDB</Link>
            </Button>
          </div>

          {/* Mobile Menu */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild className="lg:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <nav className="flex flex-col gap-4 mt-8">
                {navItems.map((item) => (
                  <div key={item.href}>
                    <Link
                      href={item.href}
                      className={cn(
                        "block py-2 text-lg font-medium transition-colors hover:text-primary",
                        pathname === item.href && "text-primary"
                      )}
                      onClick={() => !item.children && setIsOpen(false)}
                    >
                      {item.label}
                    </Link>
                    {item.children && (
                      <div className="ml-4 mt-2 space-y-2">
                        {item.children.map((child) => (
                          <Link
                            key={child.href}
                            href={child.href}
                            className={cn(
                              "block py-1 text-muted-foreground transition-colors hover:text-primary",
                              pathname === child.href && "text-primary"
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
                <div className="mt-4 pt-4 border-t space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Tema</span>
                    <ThemeToggle />
                  </div>
                  <Button className="w-full" asChild onClick={() => setIsOpen(false)}>
                    <Link href="/ppdb">Daftar PPDB</Link>
                  </Button>
                </div>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
