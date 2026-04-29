import { Metadata } from "next";
import Link from "next/link";
import {
  FileText,
  Newspaper,
  Users,
  Image,
  Calendar,
  MessageSquare,
  Download,
  UserCheck,
  Eye,
  TrendingUp,
  ArrowUpRight,
  Bell,
  BookOpen,
  Plus,
  ClipboardList,
  Inbox,
} from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getDashboardStats } from "@/actions/dashboard";
import { RecentRegistrations } from "@/components/admin/dashboard/recent-registrations";

export const metadata: Metadata = {
  title: "Dashboard | EduProfile CMS",
  description: "Panel admin EduProfile CMS",
};

const STAT_CONFIGS = [
  {
    key: "posts" as const,
    title: "Berita & Artikel",
    description: "Konten terpublikasi",
    icon: Newspaper,
    gradient: "from-blue-500 to-blue-600",
    lightBg: "bg-blue-50",
    lightText: "text-blue-600",
    darkClass: "dark:bg-blue-500/10 dark:text-blue-400",
  },
  {
    key: "pages" as const,
    title: "Halaman Aktif",
    description: "CMS pages",
    icon: FileText,
    gradient: "from-emerald-500 to-emerald-600",
    lightBg: "bg-emerald-50",
    lightText: "text-emerald-600",
    darkClass: "dark:bg-emerald-500/10 dark:text-emerald-400",
  },
  {
    key: "registrations" as const,
    title: "Pendaftar PPDB",
    description: "Total registrasi",
    icon: Users,
    gradient: "from-violet-500 to-violet-600",
    lightBg: "bg-violet-50",
    lightText: "text-violet-600",
    darkClass: "dark:bg-violet-500/10 dark:text-violet-400",
  },
  {
    key: "messages" as const,
    title: "Pesan Masuk",
    description: "Dari formulir kontak",
    icon: MessageSquare,
    gradient: "from-amber-500 to-amber-600",
    lightBg: "bg-amber-50",
    lightText: "text-amber-600",
    darkClass: "dark:bg-amber-500/10 dark:text-amber-400",
  },
];

const QUICK_ACTIONS = [
  {
    href: "/admin/posts/new",
    icon: Newspaper,
    label: "Tulis Berita",
    color: "text-blue-600",
    bg: "bg-blue-50 hover:bg-blue-100 dark:bg-blue-500/10 dark:hover:bg-blue-500/20",
  },
  {
    href: "/admin/pages/new",
    icon: FileText,
    label: "Buat Halaman",
    color: "text-emerald-600",
    bg: "bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-500/10 dark:hover:bg-emerald-500/20",
  },
  {
    href: "/admin/galleries/new",
    icon: Image,
    label: "Upload Galeri",
    color: "text-pink-600",
    bg: "bg-pink-50 hover:bg-pink-100 dark:bg-pink-500/10 dark:hover:bg-pink-500/20",
  },
  {
    href: "/admin/events/new",
    icon: Calendar,
    label: "Tambah Event",
    color: "text-orange-600",
    bg: "bg-orange-50 hover:bg-orange-100 dark:bg-orange-500/10 dark:hover:bg-orange-500/20",
  },
  {
    href: "/admin/ppdb/registrations",
    icon: ClipboardList,
    label: "Data PPDB",
    color: "text-violet-600",
    bg: "bg-violet-50 hover:bg-violet-100 dark:bg-violet-500/10 dark:hover:bg-violet-500/20",
  },
  {
    href: "/admin/messages",
    icon: Inbox,
    label: "Kotak Pesan",
    color: "text-amber-600",
    bg: "bg-amber-50 hover:bg-amber-100 dark:bg-amber-500/10 dark:hover:bg-amber-500/20",
  },
  {
    href: "/admin/announcements/new",
    icon: Bell,
    label: "Pengumuman",
    color: "text-red-600",
    bg: "bg-red-50 hover:bg-red-100 dark:bg-red-500/10 dark:hover:bg-red-500/20",
  },
  {
    href: "/admin/downloads",
    icon: Download,
    label: "File Unduhan",
    color: "text-teal-600",
    bg: "bg-teal-50 hover:bg-teal-100 dark:bg-teal-500/10 dark:hover:bg-teal-500/20",
  },
];

export default async function AdminDashboardPage() {
  const stats = await getDashboardStats();

  const now = new Date();
  const greeting =
    now.getHours() < 11
      ? "Selamat pagi"
      : now.getHours() < 15
        ? "Selamat siang"
        : now.getHours() < 18
          ? "Selamat sore"
          : "Selamat malam";

  const dateStr = now.toLocaleDateString("id-ID", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold tracking-tight text-foreground">
            {greeting}! 👋
          </h1>
          <p className="text-muted-foreground mt-1" suppressHydrationWarning>
            {dateStr} · Panel Admin EduProfile CMS
          </p>
        </div>
        <Link
          href="/admin/posts/new"
          className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-medium shadow-md shadow-primary/20 hover:opacity-90 transition-opacity"
        >
          <Plus className="h-4 w-4" />
          Tulis Berita
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {STAT_CONFIGS.map((cfg) => {
          const value = stats.counts[cfg.key];
          const Icon = cfg.icon;
          return (
            <Card
              key={cfg.key}
              className="relative overflow-hidden border-border/60 card-glow cursor-default"
            >
              {/* Decorative gradient bar on top */}
              <div
                className={`absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r ${cfg.gradient}`}
              />
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 pt-4">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {cfg.title}
                </CardTitle>
                <div className={`p-2 rounded-lg ${cfg.lightBg} ${cfg.darkClass}`}>
                  <Icon className={`h-4 w-4 ${cfg.lightText}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="font-display text-3xl font-bold tabular-nums">
                  {value.toLocaleString("id-ID")}
                </div>
                <p className="text-xs text-muted-foreground mt-1">{cfg.description}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-5">
        {/* Recent Registrations — wider */}
        <div className="lg:col-span-3">
          <RecentRegistrations registrations={stats.recentRegistrations} />
        </div>

        {/* Quick Actions */}
        <div className="lg:col-span-2">
          <Card className="border-border/60 h-full">
            <CardHeader>
              <CardTitle className="text-base font-semibold">Aksi Cepat</CardTitle>
              <CardDescription className="text-xs">Pintasan untuk tugas umum</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-2">
                {QUICK_ACTIONS.map((action) => {
                  const Icon = action.icon;
                  return (
                    <Link
                      key={action.href}
                      href={action.href}
                      className={`flex items-center gap-2.5 p-3 rounded-xl transition-all duration-150 ${action.bg}`}
                    >
                      <Icon className={`h-4 w-4 flex-shrink-0 ${action.color}`} />
                      <span className="text-xs font-medium leading-tight">{action.label}</span>
                    </Link>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Recent Posts */}
      <Card className="border-border/60">
        <CardHeader className="flex flex-row items-center justify-between pb-3">
          <div>
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-primary" />
              Berita Terbaru
            </CardTitle>
            <CardDescription className="text-xs mt-0.5">
              5 berita terakhir yang dipublikasikan
            </CardDescription>
          </div>
          <Link
            href="/admin/posts"
            className="flex items-center gap-1 text-xs text-primary hover:underline font-medium"
          >
            Lihat semua
            <ArrowUpRight className="h-3 w-3" />
          </Link>
        </CardHeader>
        <CardContent>
          {stats.recentPosts.length > 0 ? (
            <div className="space-y-1">
              {stats.recentPosts.map((post) => (
                <Link
                  key={post.id}
                  href={`/admin/posts/${post.id}/edit`}
                  className="group flex items-center justify-between py-3 px-3 -mx-3 rounded-xl hover:bg-muted/60 transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <BookOpen className="h-3.5 w-3.5 text-primary" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium leading-snug truncate group-hover:text-primary transition-colors">
                        {post.title}
                      </p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <Badge
                          variant="secondary"
                          className="text-[10px] px-1.5 py-0 h-4 font-medium"
                          style={{ backgroundColor: `${post.category.color}22`, color: post.category.color || undefined }}
                        >
                          {post.category.name}
                        </Badge>
                        <span className="text-[11px] text-muted-foreground" suppressHydrationWarning>
                          {new Date(post.createdAt).toLocaleDateString("id-ID", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground ml-3 flex-shrink-0">
                    <Eye className="h-3.5 w-3.5" />
                    <span className="tabular-nums">{post.views}</span>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center py-12 text-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-muted flex items-center justify-center">
                <Newspaper className="h-5 w-5 text-muted-foreground" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Belum ada berita
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Mulai tulis berita pertama Anda
                </p>
              </div>
              <Link
                href="/admin/posts/new"
                className="flex items-center gap-1.5 text-xs text-primary hover:underline font-medium"
              >
                <Plus className="h-3.5 w-3.5" />
                Tulis berita baru
              </Link>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
