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
  Award,
  Target,
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
    <div className="min-h-screen flex flex-col bg-background">
      <PublicHeader siteName={siteName} logo={schoolProfile?.logo} />
      
      <main className="flex-1">
        {/* Hero Section - Works in both light and dark mode */}
        <section className="relative min-h-[90vh] flex items-center overflow-hidden">
          {/* Background - adapts to theme */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary/90 to-primary/80" />
          
          {/* Decorative elements */}
          <div className="absolute inset-0">
            <div className="absolute top-20 left-10 w-72 h-72 bg-white/10 rounded-full blur-3xl" />
            <div className="absolute bottom-20 right-10 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-white/5 rounded-full blur-3xl" />
          </div>
          
          {/* Grid pattern overlay */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:60px_60px]" />
          
          <div className="container mx-auto px-4 relative z-10 py-20">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-8 text-white">
                {/* Welcome badge */}
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/15 backdrop-blur-sm border border-white/20">
                  <Sparkles className="h-4 w-4 text-yellow-300" />
                  <span className="text-sm font-medium text-white">Selamat Datang di {siteName}</span>
                </div>
                
                {/* Main heading */}
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-white">
                  {schoolProfile?.name || siteName}
                </h1>
                
                {/* Tagline */}
                <p className="text-lg md:text-xl text-white/90 max-w-xl leading-relaxed">
                  {schoolProfile?.tagline || siteConfig.siteTagline || "Mendidik Generasi Unggul dan Berkarakter untuk Masa Depan yang Gemilang"}
                </p>
                
                {/* CTA Buttons */}
                <div className="flex flex-wrap gap-4">
                  <Button size="lg" className="bg-white text-primary hover:bg-white/90 shadow-xl shadow-black/20 font-semibold group" asChild>
                    <Link href="/ppdb">
                      Daftar Sekarang
                      <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </Button>
                  <Button size="lg" className="border-2 border-white bg-transparent text-white hover:bg-white/20 hover:text-white font-semibold backdrop-blur-sm" asChild>
                    <Link href="/profil">Tentang Kami</Link>
                  </Button>
                </div>
                
                {/* Quick stats in hero */}
                <div className="flex flex-wrap gap-8 pt-8 border-t border-white/20">
                  {schoolProfile?.accreditation && (
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-yellow-400/20 flex items-center justify-center">
                        <Award className="h-6 w-6 text-yellow-300" />
                      </div>
                      <div>
                        <p className="text-sm text-white/70">Akreditasi</p>
                        <p className="font-bold text-white text-lg">{schoolProfile.accreditation}</p>
                      </div>
                    </div>
                  )}
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-white/15 flex items-center justify-center">
                      <Users className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <p className="text-sm text-white/70">Total Guru</p>
                      <p className="font-bold text-white text-lg">{data.stats.staff}+ Pengajar</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-white/15 flex items-center justify-center">
                      <Trophy className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <p className="text-sm text-white/70">Prestasi</p>
                      <p className="font-bold text-white text-lg">{data.stats.achievements}+ Penghargaan</p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Hero visual - right side */}
              <div className="hidden lg:block relative">
                <div className="relative aspect-square max-w-lg mx-auto">
                  {/* Main visual container */}
                  <div className="absolute inset-0 bg-white/10 backdrop-blur-sm rounded-3xl border border-white/20 shadow-2xl" />
                  <div className="absolute inset-6 bg-white/5 rounded-2xl flex items-center justify-center">
                    <GraduationCap className="h-40 w-40 text-white/30" />
                  </div>
                  
                  {/* Floating cards */}
                  <div className="absolute -left-6 top-1/4 p-4 bg-white/15 backdrop-blur-lg rounded-2xl border border-white/20 shadow-xl animate-float">
                    <BookOpen className="h-8 w-8 text-white" />
                  </div>
                  <div className="absolute -right-6 top-1/2 p-4 bg-white/15 backdrop-blur-lg rounded-2xl border border-white/20 shadow-xl animate-float delay-500">
                    <Target className="h-8 w-8 text-white" />
                  </div>
                  <div className="absolute left-1/4 -bottom-4 p-4 bg-yellow-400/20 backdrop-blur-lg rounded-2xl border border-yellow-400/30 shadow-xl animate-float delay-300">
                    <Trophy className="h-8 w-8 text-yellow-300" />
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Wave divider - uses CSS variable for background */}
          <div className="absolute bottom-0 left-0 right-0">
            <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
              <path d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0V120Z" className="fill-background"/>
            </svg>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16 -mt-8 relative z-10">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              <StatCard icon={Users} value={data.stats.staff} label="Guru & Staff" />
              <StatCard icon={GraduationCap} value={data.stats.alumni} label="Alumni" suffix="+" />
              <StatCard icon={Trophy} value={data.stats.achievements} label="Prestasi" />
              <StatCard icon={Calendar} value={data.stats.extracurriculars} label="Ekstrakurikuler" />
            </div>
          </div>
        </section>

        {/* About Section */}
        <section className="py-20 md:py-28">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div className="order-2 lg:order-1">
                <Badge className="mb-4 bg-primary/10 text-primary hover:bg-primary/10 border-0">Tentang Kami</Badge>
                <h2 className="text-3xl md:text-4xl font-bold mb-6 leading-tight text-foreground">
                  Membangun Generasi{" "}
                  <span className="text-primary">Unggul</span> dan{" "}
                  <span className="text-primary">Berkarakter</span>
                </h2>
                <div className="space-y-4 text-muted-foreground">
                  <p className="leading-relaxed text-base">
                    {schoolProfile?.vision || "Menjadi sekolah unggulan yang menghasilkan lulusan berkarakter, cerdas, dan berwawasan global."}
                  </p>
                  <div className="p-6 rounded-2xl bg-muted border border-border">
                    <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-primary" />
                      Misi Kami
                    </h3>
                    <p className="whitespace-pre-line text-sm leading-relaxed text-muted-foreground">
                      {schoolProfile?.mission || "Menyelenggarakan pendidikan berkualitas untuk mengembangkan potensi peserta didik."}
                    </p>
                  </div>
                </div>
                <div className="mt-8 flex flex-wrap items-center gap-4">
                  {schoolProfile?.accreditation && (
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium shadow-md">
                      <Award className="h-4 w-4" />
                      <span className="text-sm">Akreditasi <strong>{schoolProfile.accreditation}</strong></span>
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
              <div className="order-1 lg:order-2 relative pb-8 lg:pb-0">
                <div className="relative aspect-[4/3] rounded-3xl overflow-hidden bg-muted border border-border">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-primary/10 flex items-center justify-center">
                    <GraduationCap className="h-32 w-32 text-muted-foreground/30" />
                  </div>
                </div>
                {/* Floating badge - responsive positioning */}
                <div className="mt-4 lg:mt-0 lg:absolute lg:-bottom-6 lg:-left-6 p-4 sm:p-6 bg-primary rounded-2xl shadow-2xl">
                  <div className="flex items-center gap-3 sm:gap-4">
                    <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-white/20 flex items-center justify-center text-white flex-shrink-0">
                      <Clock className="h-6 w-6 sm:h-7 sm:w-7" />
                    </div>
                    <div>
                      <p className="text-xs sm:text-sm text-white/80">Berdiri Sejak</p>
                      <p className="text-xl sm:text-2xl font-bold text-white">{schoolProfile?.foundedYear || "1990"}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Programs Section */}
        {data.programs.length > 0 && (
          <section className="py-20 md:py-28 bg-muted/50">
            <div className="container mx-auto px-4">
              <div className="text-center mb-16">
                <Badge className="mb-4 bg-primary/10 text-primary hover:bg-primary/10 border-0">Program Kami</Badge>
                <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">Program Unggulan</h2>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                  Program-program unggulan yang kami tawarkan untuk mengembangkan potensi siswa
                </p>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {data.programs.map((program, index) => (
                  <Card key={program.id} className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-card border-border">
                    <CardHeader className="pb-4">
                      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110 ${
                        index % 4 === 0 ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400' :
                        index % 4 === 1 ? 'bg-green-500/10 text-green-600 dark:text-green-400' :
                        index % 4 === 2 ? 'bg-purple-500/10 text-purple-600 dark:text-purple-400' :
                        'bg-orange-500/10 text-orange-600 dark:text-orange-400'
                      }`}>
                        <GraduationCap className="h-7 w-7" />
                      </div>
                      <CardTitle className="text-lg text-card-foreground">{program.name}</CardTitle>
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
                  <Badge className="mb-4 bg-primary/10 text-primary hover:bg-primary/10 border-0">Berita Terbaru</Badge>
                  <h2 className="text-3xl md:text-4xl font-bold text-foreground">Kabar &amp; Informasi</h2>
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
                  <Card key={post.id} className="group overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-card border-border">
                    <div className="aspect-video relative bg-muted overflow-hidden">
                      {post.featuredImg ? (
                        <Image
                          src={post.featuredImg}
                          alt={post.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center bg-muted">
                          <Calendar className="h-12 w-12 text-muted-foreground/40" />
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
                      <CardTitle className="text-lg line-clamp-2 text-card-foreground group-hover:text-primary transition-colors">
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
          <section className="py-20 md:py-28 bg-primary text-primary-foreground relative overflow-hidden">
            {/* Background decorations */}
            <div className="absolute inset-0">
              <div className="absolute top-0 left-0 w-96 h-96 bg-white/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
              <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
            </div>
            
            <div className="container mx-auto px-4 relative z-10">
              <div className="text-center mb-16">
                <Badge className="mb-4 bg-white/15 text-white hover:bg-white/20 border-white/20">Testimoni</Badge>
                <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">Apa Kata Mereka</h2>
                <p className="text-white/80 max-w-2xl mx-auto">
                  Testimoni dari alumni, orang tua, dan siswa kami
                </p>
              </div>
              <div className="grid md:grid-cols-3 gap-6">
                {data.testimonials.map((testimonial) => (
                  <Card key={testimonial.id} className="bg-white/10 border-white/20 backdrop-blur-sm hover:bg-white/15 transition-colors">
                    <CardContent className="pt-8">
                      <div className="flex gap-1 mb-4">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${i < (testimonial.rating || 5) ? 'text-yellow-400 fill-yellow-400' : 'text-white/30'}`}
                          />
                        ))}
                      </div>
                      <p className="text-white/95 italic mb-6 leading-relaxed">
                        &ldquo;{testimonial.content}&rdquo;
                      </p>
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center text-white font-bold text-lg">
                          {testimonial.name[0]}
                        </div>
                        <div>
                          <p className="font-semibold text-white">{testimonial.name}</p>
                          <p className="text-sm text-white/70">{testimonial.role}</p>
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
            <Card className="relative overflow-hidden border-0 bg-gradient-to-r from-primary to-primary/80 text-primary-foreground shadow-2xl">
              {/* Decorative elements */}
              <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:40px_40px]" />
              <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
              <div className="absolute bottom-0 left-0 w-60 h-60 bg-white/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/3" />
              
              <CardContent className="relative z-10 py-16 text-center">
                <Sparkles className="h-12 w-12 mx-auto mb-6 text-yellow-300" />
                <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
                  Bergabung Bersama Kami
                </h2>
                <p className="text-white/90 mb-10 max-w-2xl mx-auto text-lg">
                  Daftarkan putra-putri Anda untuk menjadi bagian dari keluarga besar {siteName}
                </p>
                <div className="flex flex-wrap justify-center gap-4">
                  <Button size="lg" className="bg-white text-primary hover:bg-white/90 font-semibold shadow-xl" asChild>
                    <Link href="/ppdb">
                      Daftar PPDB Online
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                  </Button>
                  <Button size="lg" className="border-2 border-white bg-transparent text-white hover:bg-white/20 hover:text-white font-semibold" asChild>
                    <Link href="/kontak">Hubungi Kami</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Contact Info */}
        <section className="py-16 bg-muted/50">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-3 gap-6">
              {[
                { icon: MapPin, title: "Alamat", value: schoolProfile?.address || "Jl. Pendidikan No. 1, Jakarta" },
                { icon: Phone, title: "Telepon", value: schoolProfile?.phone || "(021) 1234567" },
                { icon: Mail, title: "Email", value: schoolProfile?.email || "info@sekolah.sch.id" },
              ].map((item) => (
                <div key={item.title} className="flex items-start gap-4 p-6 rounded-2xl bg-card border border-border hover:shadow-lg transition-shadow">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <item.icon className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1 text-card-foreground">{item.title}</h3>
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
}: {
  icon: React.ElementType;
  value: number;
  label: string;
  suffix?: string;
}) {
  return (
    <div className="group p-6 bg-card rounded-2xl shadow-lg border border-border hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
        <Icon className="h-6 w-6 text-primary" />
      </div>
      <div className="text-3xl md:text-4xl font-bold mb-1 text-card-foreground">
        {value}{suffix}
      </div>
      <div className="text-sm text-muted-foreground">{label}</div>
    </div>
  );
}
