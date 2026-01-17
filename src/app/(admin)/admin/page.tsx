import { Metadata } from "next";
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
} from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Dashboard | EduProfile CMS",
  description: "Panel admin EduProfile CMS",
};

async function getDashboardStats() {
  const [
    totalPosts,
    totalPages,
    totalStaff,
    totalGalleries,
    totalDownloads,
    totalMessages,
    unreadMessages,
    totalEvents,
    totalTestimonials,
    totalAlumni,
    recentPosts,
  ] = await Promise.all([
    prisma.post.count({ where: { status: "PUBLISHED" } }),
    prisma.page.count({ where: { status: "PUBLISHED" } }),
    prisma.staff.count({ where: { isActive: true } }),
    prisma.gallery.count({ where: { isPublished: true } }),
    prisma.download.count({ where: { isPublished: true } }),
    prisma.contactMessage.count(),
    prisma.contactMessage.count({ where: { isRead: false } }),
    prisma.event.count({ where: { isPublished: true } }),
    prisma.testimonial.count({ where: { isPublished: true } }),
    prisma.alumni.count({ where: { isPublished: true } }),
    prisma.post.findMany({
      where: { status: "PUBLISHED" },
      orderBy: { createdAt: "desc" },
      take: 5,
      select: {
        id: true,
        title: true,
        slug: true,
        views: true,
        createdAt: true,
        category: {
          select: { name: true, color: true },
        },
      },
    }),
  ]);

  return {
    totalPosts,
    totalPages,
    totalStaff,
    totalGalleries,
    totalDownloads,
    totalMessages,
    unreadMessages,
    totalEvents,
    totalTestimonials,
    totalAlumni,
    recentPosts,
  };
}

export default async function AdminDashboardPage() {
  const stats = await getDashboardStats();

  const statCards = [
    {
      title: "Total Berita",
      value: stats.totalPosts,
      description: "Berita dipublikasikan",
      icon: Newspaper,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      title: "Halaman",
      value: stats.totalPages,
      description: "Halaman aktif",
      icon: FileText,
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      title: "Guru & Staff",
      value: stats.totalStaff,
      description: "Staff aktif",
      icon: Users,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
    },
    {
      title: "Galeri",
      value: stats.totalGalleries,
      description: "Album galeri",
      icon: Image,
      color: "text-pink-600",
      bgColor: "bg-pink-100",
    },
    {
      title: "Event",
      value: stats.totalEvents,
      description: "Event & agenda",
      icon: Calendar,
      color: "text-orange-600",
      bgColor: "bg-orange-100",
    },
    {
      title: "Download",
      value: stats.totalDownloads,
      description: "File tersedia",
      icon: Download,
      color: "text-cyan-600",
      bgColor: "bg-cyan-100",
    },
    {
      title: "Pesan",
      value: stats.totalMessages,
      description: `${stats.unreadMessages} belum dibaca`,
      icon: MessageSquare,
      color: "text-yellow-600",
      bgColor: "bg-yellow-100",
    },
    {
      title: "Alumni",
      value: stats.totalAlumni,
      description: "Alumni terdaftar",
      icon: UserCheck,
      color: "text-indigo-600",
      bgColor: "bg-indigo-100",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Selamat datang di panel admin EduProfile CMS
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">{stat.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Posts & Quick Actions */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Recent Posts */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Berita Terbaru
            </CardTitle>
            <CardDescription>5 berita terakhir yang dipublikasikan</CardDescription>
          </CardHeader>
          <CardContent>
            {stats.recentPosts.length > 0 ? (
              <div className="space-y-4">
                {stats.recentPosts.map((post) => (
                  <div
                    key={post.id}
                    className="flex items-center justify-between border-b pb-3 last:border-0 last:pb-0"
                  >
                    <div className="space-y-1 flex-1 min-w-0">
                      <p className="text-sm font-medium leading-none truncate">
                        {post.title}
                      </p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span
                          className="px-2 py-0.5 rounded-full text-white"
                          style={{ backgroundColor: post.category.color || "#3B82F6" }}
                        >
                          {post.category.name}
                        </span>
                        <span>•</span>
                        <span>
                          {new Date(post.createdAt).toLocaleDateString("id-ID", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Eye className="h-4 w-4" />
                      {post.views}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-8">
                Belum ada berita yang dipublikasikan
              </p>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Aksi Cepat</CardTitle>
            <CardDescription>Pintasan untuk tugas umum</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              <QuickActionButton
                href="/admin/posts/new"
                icon={Newspaper}
                label="Tulis Berita"
                color="bg-blue-500"
              />
              <QuickActionButton
                href="/admin/pages/new"
                icon={FileText}
                label="Buat Halaman"
                color="bg-green-500"
              />
              <QuickActionButton
                href="/admin/gallery/new"
                icon={Image}
                label="Upload Galeri"
                color="bg-pink-500"
              />
              <QuickActionButton
                href="/admin/events/new"
                icon={Calendar}
                label="Tambah Event"
                color="bg-orange-500"
              />
              <QuickActionButton
                href="/admin/staff/new"
                icon={Users}
                label="Tambah Staff"
                color="bg-purple-500"
              />
              <QuickActionButton
                href="/admin/messages"
                icon={MessageSquare}
                label="Lihat Pesan"
                color="bg-yellow-500"
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function QuickActionButton({
  href,
  icon: Icon,
  label,
  color,
}: {
  href: string;
  icon: React.ElementType;
  label: string;
  color: string;
}) {
  return (
    <a
      href={href}
      className="flex items-center gap-3 p-3 rounded-lg border hover:bg-accent transition-colors"
    >
      <div className={`p-2 rounded-lg ${color} text-white`}>
        <Icon className="h-4 w-4" />
      </div>
      <span className="text-sm font-medium">{label}</span>
    </a>
  );
}
