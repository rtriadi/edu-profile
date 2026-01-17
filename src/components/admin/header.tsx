"use client";

import { signOut } from "next-auth/react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  Bell,
  LogOut,
  Settings,
  User,
  ExternalLink,
  Moon,
  Sun,
} from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { getInitials } from "@/lib/utils";
import { DateTimeDisplay } from "@/components/ui/datetime-display";
import type { UserSession } from "@/types";

interface AdminHeaderProps {
  user: UserSession;
}

const pathTitles: Record<string, string> = {
  "/admin": "Dashboard",
  "/admin/pages": "Halaman",
  "/admin/posts": "Berita & Artikel",
  "/admin/posts/categories": "Kategori",
  "/admin/posts/tags": "Tag",
  "/admin/gallery": "Galeri",
  "/admin/events": "Agenda & Event",
  "/admin/downloads": "Download",
  "/admin/announcements": "Pengumuman",
  "/admin/school-profile": "Profil Sekolah",
  "/admin/staff": "Guru & Staff",
  "/admin/programs": "Program",
  "/admin/facilities": "Fasilitas",
  "/admin/achievements": "Prestasi",
  "/admin/testimonials": "Testimoni",
  "/admin/alumni": "Alumni",
  "/admin/ppdb": "PPDB",
  "/admin/ppdb/registrations": "Pendaftaran PPDB",
  "/admin/media": "Media Library",
  "/admin/menus": "Menu",
  "/admin/messages": "Pesan Masuk",
  "/admin/users": "Pengguna",
  "/admin/settings": "Pengaturan",
};

export function AdminHeader({ user }: AdminHeaderProps) {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();

  const getBreadcrumbs = () => {
    const paths = pathname.split("/").filter(Boolean);
    const breadcrumbs: { label: string; href: string }[] = [];

    let currentPath = "";
    for (const path of paths) {
      currentPath += `/${path}`;
      const title = pathTitles[currentPath] || path.charAt(0).toUpperCase() + path.slice(1);
      breadcrumbs.push({ label: title, href: currentPath });
    }

    return breadcrumbs;
  };

  const breadcrumbs = getBreadcrumbs();

  return (
    <header className="flex h-14 shrink-0 items-center gap-2 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4">
      <SidebarTrigger className="-ml-1" />
      <Separator orientation="vertical" className="mr-2 h-4" />
      
      <Breadcrumb>
        <BreadcrumbList>
          {breadcrumbs.map((crumb, index) => (
            <BreadcrumbItem key={crumb.href}>
              {index < breadcrumbs.length - 1 ? (
                <>
                  <BreadcrumbLink asChild>
                    <Link href={crumb.href}>{crumb.label}</Link>
                  </BreadcrumbLink>
                  <BreadcrumbSeparator />
                </>
              ) : (
                <BreadcrumbPage>{crumb.label}</BreadcrumbPage>
              )}
            </BreadcrumbItem>
          ))}
        </BreadcrumbList>
      </Breadcrumb>

      <div className="ml-auto flex items-center gap-2">
        <DateTimeDisplay 
          showIcon={true} 
          showTimezone={true} 
          format="full"
          className="hidden md:flex text-xs text-muted-foreground"
        />
        
        <Button variant="ghost" size="icon" asChild>
          <Link href="/" target="_blank">
            <ExternalLink className="h-4 w-4" />
            <span className="sr-only">Lihat Website</span>
          </Link>
        </Button>

        <Button
          variant="ghost"
          size="icon"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        >
          <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>

        <Button variant="ghost" size="icon">
          <Bell className="h-4 w-4" />
          <span className="sr-only">Notifikasi</span>
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-8 w-8 rounded-full">
              <Avatar className="h-8 w-8">
                <AvatarImage src={user.image || undefined} alt={user.name} />
                <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">{user.name}</p>
                <p className="text-xs leading-none text-muted-foreground">
                  {user.email}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/admin/profile">
                <User className="mr-2 h-4 w-4" />
                Profil
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/admin/settings">
                <Settings className="mr-2 h-4 w-4" />
                Pengaturan
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-destructive focus:text-destructive"
              onClick={() => signOut({ callbackUrl: "/login" })}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
