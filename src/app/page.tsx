import Link from "next/link";
import Image from "next/image";
import { 
  GraduationCap, 
  Users, 
  Trophy, 
  Calendar,
  ArrowRight,
  MapPin,
  Phone,
  Mail,
  Star,
  Sparkles,
  BookOpen,
  Clock,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { prisma } from "@/lib/prisma";
import { formatDate } from "@/lib/utils";
import { PublicHeader } from "@/components/public/header";
import { PublicFooter } from "@/components/public/footer";
import { getSiteConfig } from "@/lib/site-config";

async function getHomeData() {
  const [
    schoolProfile,
    recentPosts,
    programs,
    facilities,
    testimonials,
    upcomingEvents,
    stats,
  ] = await Promise.all([
    prisma.schoolProfile.findFirst(),
    prisma.post.findMany({
      where: { status: "PUBLISHED" },
      orderBy: { publishedAt: "desc" },
      take: 3,
      include: {
        category: { select: { name: true, color: true } },
      },
    }),
    prisma.program.findMany({
      where: { isActive: true, type: "FEATURED" },
      orderBy: { order: "asc" },
      take: 4,
    }),
    prisma.facility.findMany({
      where: { isPublished: true },
      orderBy: { order: "asc" },
      take: 6,
    }),
    prisma.testimonial.findMany({
      where: { isPublished: true },
      orderBy: { order: "asc" },
      take: 3,
    }),
    prisma.event.findMany({
      where: {
        isPublished: true,
        startDate: { gte: new Date() },
      },
      orderBy: { startDate: "asc" },
      take: 3,
    }),
    Promise.all([
      prisma.staff.count({ where: { isActive: true } }),
      prisma.alumni.count({ where: { isPublished: true } }),
      prisma.achievement.count({ where: { isPublished: true } }),
      prisma.program.count({ where: { isActive: true, type: "EXTRACURRICULAR" } }),
    ]),
  ]);

  return {
    schoolProfile,
    recentPosts,
    programs,
    facilities,
    testimonials,
    upcomingEvents,
    stats: {
      staff: stats[0],
      alumni: stats[1],
      achievements: stats[2],
      extracurriculars: stats[3],
    },
  };
}

export default async function HomePage() {
  const [data, siteConfig] = await Promise.all([
    getHomeData(),
    getSiteConfig(),
  ]);
  const { schoolProfile } = data;
  
  const siteName = siteConfig.siteName || schoolProfile?.name || "EduProfile";

  return (
    <div className="min-h-screen flex flex-col">
      <PublicHeader siteName={siteName} logo={schoolProfile?.logo} />
      
      <main className="flex-1">
        {/* Hero Section - Modern Gradient */}
        <section className="relative min-h-[85vh] flex items-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white overflow-hidden">
          {/* Animated background elements */}
          <div className="absolute inset-0">
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/30 rounded-full blur-3xl animate-pulse" />
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-theme-accent/20 rounded-full blur-3xl animate-pulse delay-1000" />
            <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-theme-secondary/20 rounded-full blur-3xl animate-pulse delay-500" />
          </div>
          <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
          
          <div className="container mx-auto px-4 relative z-10 py-20">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-8">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20">
                  <Sparkles className="h-4 w-4 text-yellow-400" />
                  <span className="text-sm font-medium">Selamat Datang di {siteName}</span>
                </div>
                
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                  <span className="bg-gradient-to-r from-white via-white to-white/70 bg-clip-text text-transparent">
                    {schoolProfile?.name || siteName}
                  </span>
                </h1>
                
                <p className="text-lg md:text-xl text-white/80 max-w-xl leading-relaxed">
                  {schoolProfile?.tagline || siteConfig.siteTagline || "Mendidik Generasi Unggul dan Berkarakter untuk Masa Depan yang Gemilang"}
                </p>
                
                <div className="flex flex-wrap gap-4">
                  <Button size="lg" className="bg-white text-slate-900 hover:bg-white/90 shadow-2xl shadow-white/20 group" asChild>
                    <Link href="/ppdb">
                      Daftar Sekarang
                      <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </Button>
                  <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10 backdrop-blur-sm" asChild>
                    <Link href="/profil">Tentang Kami</Link>
                  </Button>
                </div>
                
                {/* Quick stats */}
                <div className="flex flex-wrap gap-6 pt-8 border-t border-white/10">
                  {schoolProfile?.accreditation && (
                    <div className="flex items-center gap-2">
                      <div className="w-10 h-10 rounded-xl bg-yellow-500/20 flex items-center justify-center">
                        <Star className="h-5 w-5 text-yellow-400" />
                      </div>
                      <div>
                        <p className="text-xs text-white/60">Akreditasi</p>
                        <p className="font-bold">{schoolProfile.accreditation}</p>
                      </div>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
                      <Users className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-xs text-white/60">Total Guru</p>
                      <p className="font-bold">{data.stats.staff}+ Pengajar</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-xl bg-theme-secondary/20 flex items-center justify-center">
                      <Trophy className="h-5 w-5 text-theme-secondary" />
                    </div>
                    <div>
                      <p className="text-xs text-white/60">Prestasi</p>
                      <p className="font-bold">{data.stats.achievements}+ Penghargaan</p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Hero image placeholder */}
              <div className="hidden lg:block relative">
                <div className="relative aspect-square max-w-lg mx-auto">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-theme-accent/20 rounded-3xl backdrop-blur-sm border border-white/10" />
                  <div className="absolute inset-4 bg-gradient-to-br from-white/5 to-white/10 rounded-2xl flex items-center justify-center">
                    <GraduationCap className="h-32 w-32 text-white/20" />
                  </div>
                  {/* Floating cards */}
                  <div className="absolute -left-8 top-1/4 p-4 bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 animate-float">
                    <BookOpen className="h-8 w-8 text-primary" />
                  </div>
                  <div className="absolute -right-8 bottom-1/4 p-4 bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 animate-float delay-300">
                    <Trophy className="h-8 w-8 text-yellow-400" />
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Wave divider */}
          <div className="absolute bottom-0 left-0 right-0">
            <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
              <path d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0V120Z" className="fill-background"/>
            </svg>
          </div>
        </section>

        {/* Stats Section - Floating Cards */}
        <section className="py-16 -mt-8 relative z-10">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              <StatCard icon={Users} value={data.stats.staff} label="Guru & Staff" color="primary" />
              <StatCard icon={GraduationCap} value={data.stats.alumni} label="Alumni" suffix="+" color="secondary" />
              <StatCard icon={Trophy} value={data.stats.achievements} label="Prestasi" color="accent" />
              <StatCard icon={Calendar} value={data.stats.extracurriculars} label="Ekstrakurikuler" color="primary" />
            </div>
          </div>
        </section>

        {/* About Section - Split Design */}
        <section className="py-20 md:py-28">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div className="order-2 lg:order-1">
                <Badge className="mb-4 bg-primary/10 text-primary border-0">Tentang Kami</Badge>
                <h2 className="text-3xl md:text-4xl font-bold mb-6 leading-tight">
                  Membangun Generasi <span className="text-primary">Unggul</span> dan <span className="text-theme-accent">Berkarakter</span>
                </h2>
                <div className="space-y-4 text-muted-foreground">
                  <p className="leading-relaxed">
                    {schoolProfile?.vision || "Menjadi sekolah unggulan yang menghasilkan lulusan berkarakter, cerdas, dan berwawasan global."}
                  </p>
                  <div className="p-6 rounded-2xl bg-muted/50 border border-border">
                    <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-primary" />
                      Misi Kami
                    </h3>
                    <p className="whitespace-pre-line text-sm leading-relaxed">
                      {schoolProfile?.mission || "Menyelenggarakan pendidikan berkualitas untuk mengembangkan potensi peserta didik."}
                    </p>
                  </div>
                </div>
                <div className="mt-8 flex flex-wrap items-center gap-4">
                  {schoolProfile?.accreditation && (
                    <div className="px-5 py-3 bg-gradient-primary text-white rounded-xl font-semibold shadow-lg shadow-primary/25">
                      Akreditasi {schoolProfile.accreditation}
                    </div>
                  )}
                  <Button variant="outline" asChild className="group">
                    <Link href="/profil">
                      Selengkapnya
                      <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </Button>
                </div>
              </div>
              <div className="order-1 lg:order-2 relative">
                <div className="relative aspect-[4/3] rounded-3xl overflow-hidden bg-muted">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-theme-accent/10 flex items-center justify-center">
                    <GraduationCap className="h-32 w-32 text-muted-foreground/20" />
                  </div>
                </div>
                {/* Floating badge */}
                <div className="absolute -bottom-6 -left-6 p-6 bg-background rounded-2xl shadow-2xl border">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-xl bg-gradient-primary flex items-center justify-center text-white">
                      <Clock className="h-7 w-7" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Berdiri Sejak</p>
                      <p className="text-2xl font-bold">{schoolProfile?.foundedYear || "1990"}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Programs Section */}
        {data.programs.length > 0 && (
          <section className="py-20 md:py-28 bg-muted/30">
            <div className="container mx-auto px-4">
              <div className="text-center mb-16">
                <Badge className="mb-4 bg-theme-secondary/10 text-theme-secondary border-0">Program Kami</Badge>
                <h2 className="text-3xl md:text-4xl font-bold mb-4">Program Unggulan</h2>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                  Program-program unggulan yang kami tawarkan untuk mengembangkan potensi siswa
                </p>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {data.programs.map((program, index) => (
                  <Card key={program.id} className="group hover:shadow-xl transition-all duration-300 border-0 bg-background hover:-translate-y-1">
                    <CardHeader className="pb-4">
                      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110 ${
                        index % 3 === 0 ? 'bg-primary/10 text-primary' :
                        index % 3 === 1 ? 'bg-theme-secondary/10 text-theme-secondary' :
                        'bg-theme-accent/10 text-theme-accent'
                      }`}>
                        <GraduationCap className="h-7 w-7" />
                      </div>
                      <CardTitle className="text-lg">{program.name}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="line-clamp-3">
                        {program.description}
                      </CardDescription>
                    </CardContent>
                  </Card>
                ))}
              </div>
              <div className="text-center mt-12">
                <Button variant="outline" size="lg" asChild className="group">
                  <Link href="/akademik">
                    Lihat Semua Program
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
              </div>
            </div>
          </section>
        )}

        {/* News Section */}
        {data.recentPosts.length > 0 && (
          <section className="py-20 md:py-28">
            <div className="container mx-auto px-4">
              <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
                <div>
                  <Badge className="mb-4 bg-primary/10 text-primary border-0">Berita Terbaru</Badge>
                  <h2 className="text-3xl md:text-4xl font-bold">Kabar & Informasi</h2>
                </div>
                <Button variant="outline" asChild className="hidden md:flex group">
                  <Link href="/berita">
                    Semua Berita
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
              </div>
              <div className="grid md:grid-cols-3 gap-6">
                {data.recentPosts.map((post) => (
                  <Card key={post.id} className="group overflow-hidden hover:shadow-xl transition-all duration-300 border-0 bg-background hover:-translate-y-1">
                    <div className="aspect-video relative bg-muted overflow-hidden">
                      {post.featuredImg ? (
                        <Image
                          src={post.featuredImg}
                          alt={post.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-primary/5 to-theme-accent/5">
                          <Calendar className="h-12 w-12 text-muted-foreground/30" />
                        </div>
                      )}
                      <div className="absolute top-4 left-4">
                        <span
                          className="text-xs px-3 py-1.5 rounded-full text-white font-medium shadow-lg"
                          style={{ backgroundColor: post.category.color || "#3B82F6" }}
                        >
                          {post.category.name}
                        </span>
                      </div>
                    </div>
                    <CardHeader className="pb-2">
                      <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                        <Clock className="h-3 w-3" />
                        {post.publishedAt && formatDate(post.publishedAt)}
                      </div>
                      <CardTitle className="text-lg line-clamp-2 group-hover:text-primary transition-colors">
                        <Link href={`/berita/${post.slug}`}>
                          {post.title}
                        </Link>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="line-clamp-2">
                        {post.excerpt}
                      </CardDescription>
                    </CardContent>
                  </Card>
                ))}
              </div>
              <div className="text-center mt-8 md:hidden">
                <Button variant="outline" asChild>
                  <Link href="/berita">Semua Berita</Link>
                </Button>
              </div>
            </div>
          </section>
        )}

        {/* Testimonials Section */}
        {data.testimonials.length > 0 && (
          <section className="py-20 md:py-28 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white relative overflow-hidden">
            <div className="absolute inset-0">
              <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl" />
              <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-theme-accent/10 rounded-full blur-3xl" />
            </div>
            <div className="container mx-auto px-4 relative z-10">
              <div className="text-center mb-16">
                <Badge className="mb-4 bg-white/10 text-white border-white/20">Testimoni</Badge>
                <h2 className="text-3xl md:text-4xl font-bold mb-4">Apa Kata Mereka</h2>
                <p className="text-white/70 max-w-2xl mx-auto">
                  Testimoni dari alumni, orang tua, dan siswa kami
                </p>
              </div>
              <div className="grid md:grid-cols-3 gap-6">
                {data.testimonials.map((testimonial) => (
                  <Card key={testimonial.id} className="bg-white/5 border-white/10 backdrop-blur-sm hover:bg-white/10 transition-colors">
                    <CardContent className="pt-8">
                      <div className="flex gap-1 mb-4">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${i < (testimonial.rating || 5) ? 'text-yellow-400 fill-yellow-400' : 'text-white/20'}`}
                          />
                        ))}
                      </div>
                      <p className="text-white/90 italic mb-6 leading-relaxed">
                        &ldquo;{testimonial.content}&rdquo;
                      </p>
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-gradient-primary flex items-center justify-center text-white font-bold">
                          {testimonial.name[0]}
                        </div>
                        <div>
                          <p className="font-semibold">{testimonial.name}</p>
                          <p className="text-sm text-white/60">{testimonial.role}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* CTA Section */}
        <section className="py-20 md:py-28">
          <div className="container mx-auto px-4">
            <Card className="relative overflow-hidden border-0 bg-gradient-to-r from-primary via-primary to-primary/90 text-white">
              <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
              <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
              <CardContent className="relative z-10 py-16 text-center">
                <Sparkles className="h-12 w-12 mx-auto mb-6 text-yellow-300" />
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  Bergabung Bersama Kami
                </h2>
                <p className="text-white/90 mb-10 max-w-2xl mx-auto text-lg">
                  Daftarkan putra-putri Anda untuk menjadi bagian dari keluarga besar {siteName}
                </p>
                <div className="flex flex-wrap justify-center gap-4">
                  <Button size="lg" className="bg-white text-primary hover:bg-white/90 shadow-2xl" asChild>
                    <Link href="/ppdb">
                      Daftar PPDB Online
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                  </Button>
                  <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10" asChild>
                    <Link href="/kontak">Hubungi Kami</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Contact Info */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-3 gap-8">
              {[
                { icon: MapPin, title: "Alamat", value: schoolProfile?.address || "Jl. Pendidikan No. 1, Jakarta" },
                { icon: Phone, title: "Telepon", value: schoolProfile?.phone || "(021) 1234567" },
                { icon: Mail, title: "Email", value: schoolProfile?.email || "info@sekolah.sch.id" },
              ].map((item) => (
                <div key={item.title} className="flex items-start gap-4 p-6 rounded-2xl bg-background border hover:shadow-lg transition-shadow">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <item.icon className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">{item.title}</h3>
                    <p className="text-muted-foreground text-sm">{item.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <PublicFooter />
    </div>
  );
}

function StatCard({
  icon: Icon,
  value,
  label,
  suffix = "",
  color = "primary",
}: {
  icon: React.ElementType;
  value: number;
  label: string;
  suffix?: string;
  color?: "primary" | "secondary" | "accent";
}) {
  const colorClasses = {
    primary: "bg-primary/10 text-primary",
    secondary: "bg-theme-secondary/10 text-theme-secondary",
    accent: "bg-theme-accent/10 text-theme-accent",
  };

  return (
    <div className="group p-6 bg-background rounded-2xl shadow-lg border hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
      <div className={`w-12 h-12 rounded-xl ${colorClasses[color]} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
        <Icon className="h-6 w-6" />
      </div>
      <div className="text-3xl md:text-4xl font-bold mb-1">
        {value}{suffix}
      </div>
      <div className="text-sm text-muted-foreground">{label}</div>
    </div>
  );
}
