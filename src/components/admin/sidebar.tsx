"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  Newspaper,
  Users,
  GraduationCap,
  Image,
  Calendar,
  Download,
  MessageSquare,
  Settings,
  Building2,
  Trophy,
  UserCheck,
  Menu,
  Quote,
  Bell,
  FolderOpen,
  ChevronDown,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getInitials } from "@/lib/utils";
import type { UserSession } from "@/types";

interface AdminSidebarProps {
  user: UserSession;
}

const menuItems = [
  {
    title: "Dashboard",
    url: "/admin",
    icon: LayoutDashboard,
  },
];

const contentMenuItems = [
  {
    title: "Halaman",
    url: "/admin/pages",
    icon: FileText,
  },
  {
    title: "Berita & Artikel",
    url: "/admin/posts",
    icon: Newspaper,
    submenu: [
      { title: "Semua Berita", url: "/admin/posts" },
      { title: "Kategori", url: "/admin/posts/categories" },
      { title: "Tag", url: "/admin/posts/tags" },
    ],
  },
  {
    title: "Galeri",
    url: "/admin/gallery",
    icon: Image,
  },
  {
    title: "Agenda & Event",
    url: "/admin/events",
    icon: Calendar,
  },
  {
    title: "Download",
    url: "/admin/downloads",
    icon: Download,
  },
  {
    title: "Pengumuman",
    url: "/admin/announcements",
    icon: Bell,
  },
];

const schoolMenuItems = [
  {
    title: "Profil Sekolah",
    url: "/admin/school-profile",
    icon: Building2,
  },
  {
    title: "Guru & Staff",
    url: "/admin/staff",
    icon: Users,
  },
  {
    title: "Program",
    url: "/admin/programs",
    icon: GraduationCap,
    submenu: [
      { title: "Kurikulum", url: "/admin/programs?type=CURRICULUM" },
      { title: "Ekstrakurikuler", url: "/admin/programs?type=EXTRACURRICULAR" },
      { title: "Program Unggulan", url: "/admin/programs?type=FEATURED" },
    ],
  },
  {
    title: "Fasilitas",
    url: "/admin/facilities",
    icon: Building2,
  },
  {
    title: "Prestasi",
    url: "/admin/achievements",
    icon: Trophy,
  },
  {
    title: "Testimoni",
    url: "/admin/testimonials",
    icon: Quote,
  },
  {
    title: "Alumni",
    url: "/admin/alumni",
    icon: UserCheck,
  },
];

const ppdbMenuItems = [
  {
    title: "Periode PPDB",
    url: "/admin/ppdb",
    icon: GraduationCap,
  },
  {
    title: "Pendaftaran",
    url: "/admin/ppdb/registrations",
    icon: Users,
  },
];

const systemMenuItems = [
  {
    title: "Media Library",
    url: "/admin/media",
    icon: FolderOpen,
  },
  {
    title: "Menu",
    url: "/admin/menus",
    icon: Menu,
  },
  {
    title: "Pesan Masuk",
    url: "/admin/messages",
    icon: MessageSquare,
  },
  {
    title: "Pengguna",
    url: "/admin/users",
    icon: Users,
  },
  {
    title: "Pengaturan",
    url: "/admin/settings",
    icon: Settings,
  },
];

export function AdminSidebar({ user }: AdminSidebarProps) {
  const pathname = usePathname();

  const isActive = (url: string) => {
    if (url === "/admin") {
      return pathname === "/admin";
    }
    return pathname.startsWith(url);
  };

  const renderMenuItem = (item: typeof menuItems[0] & { submenu?: { title: string; url: string }[] }) => {
    if (item.submenu) {
      return (
        <Collapsible key={item.url} className="group/collapsible">
          <SidebarMenuItem>
            <CollapsibleTrigger asChild>
              <SidebarMenuButton isActive={isActive(item.url)}>
                <item.icon className="h-4 w-4" />
                <span>{item.title}</span>
                <ChevronDown className="ml-auto h-4 w-4 transition-transform group-data-[state=open]/collapsible:rotate-180" />
              </SidebarMenuButton>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <SidebarMenuSub>
                {item.submenu.map((subitem) => (
                  <SidebarMenuSubItem key={subitem.url}>
                    <SidebarMenuSubButton asChild isActive={pathname === subitem.url}>
                      <Link href={subitem.url}>{subitem.title}</Link>
                    </SidebarMenuSubButton>
                  </SidebarMenuSubItem>
                ))}
              </SidebarMenuSub>
            </CollapsibleContent>
          </SidebarMenuItem>
        </Collapsible>
      );
    }

    return (
      <SidebarMenuItem key={item.url}>
        <SidebarMenuButton asChild isActive={isActive(item.url)}>
          <Link href={item.url}>
            <item.icon className="h-4 w-4" />
            <span>{item.title}</span>
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
    );
  };

  return (
    <Sidebar variant="inset">
      <SidebarHeader>
        <div className="flex items-center gap-2 px-2 py-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <GraduationCap className="h-5 w-5" />
          </div>
          <div className="flex flex-col">
            <span className="font-semibold text-sm">EduProfile</span>
            <span className="text-xs text-muted-foreground">CMS Admin</span>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map(renderMenuItem)}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Konten</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {contentMenuItems.map(renderMenuItem)}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Sekolah</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {schoolMenuItems.map(renderMenuItem)}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>PPDB</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {ppdbMenuItems.map(renderMenuItem)}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Sistem</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {systemMenuItems.map(renderMenuItem)}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <div className="flex items-center gap-2 px-2 py-2">
          <Avatar className="h-8 w-8">
            <AvatarImage src={user.image || undefined} alt={user.name} />
            <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col flex-1 min-w-0">
            <span className="text-sm font-medium truncate">{user.name}</span>
            <span className="text-xs text-muted-foreground truncate">{user.role}</span>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
