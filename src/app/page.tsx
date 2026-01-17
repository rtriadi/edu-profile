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
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { prisma } from "@/lib/prisma";
import { formatDate } from "@/lib/utils";
import { PublicHeader } from "@/components/public/header";
import { PublicFooter } from "@/components/public/footer";

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
  const data = await getHomeData();
  const { schoolProfile } = data;

  return (
    <div className="min-h-screen flex flex-col">
      <PublicHeader />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-primary via-primary/90 to-primary/80 text-white py-20 md:py-32">
          <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-3xl">
              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                {schoolProfile?.name || "Selamat Datang"}
              </h1>
              <p className="text-xl md:text-2xl text-white/90 mb-8">
                {schoolProfile?.tagline || "Mendidik Generasi Unggul dan Berkarakter"}
              </p>
              <div className="flex flex-wrap gap-4">
                <Button size="lg" variant="secondary" asChild>
                  <Link href="/ppdb">
                    Daftar Sekarang
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" className="text-white border-white hover:bg-white/10" asChild>
                  <Link href="/profil">Tentang Kami</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-12 bg-muted/50">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <StatCard icon={Users} value={data.stats.staff} label="Guru & Staff" />
              <StatCard icon={GraduationCap} value={data.stats.alumni} label="Alumni" suffix="+" />
              <StatCard icon={Trophy} value={data.stats.achievements} label="Prestasi" />
              <StatCard icon={Calendar} value={data.stats.extracurriculars} label="Ekstrakurikuler" />
            </div>
          </div>
        </section>

        {/* About Section */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold mb-6">
                  Tentang {schoolProfile?.name || "Sekolah Kami"}
                </h2>
                <div className="space-y-4 text-muted-foreground">
                  <p>
                    {schoolProfile?.vision || "Menjadi sekolah unggulan yang menghasilkan lulusan berkarakter, cerdas, dan berwawasan global."}
                  </p>
                  <div>
                    <h3 className="font-semibold text-foreground mb-2">Misi Kami:</h3>
                    <p className="whitespace-pre-line">
                      {schoolProfile?.mission || "Menyelenggarakan pendidikan berkualitas untuk mengembangkan potensi peserta didik."}
                    </p>
                  </div>
                </div>
                <div className="mt-6 flex items-center gap-4">
                  {schoolProfile?.accreditation && (
                    <div className="px-4 py-2 bg-primary text-primary-foreground rounded-lg font-semibold">
                      Akreditasi {schoolProfile.accreditation}
                    </div>
                  )}
                  <Button variant="outline" asChild>
                    <Link href="/profil">Selengkapnya</Link>
                  </Button>
                </div>
              </div>
              <div className="relative aspect-video rounded-xl overflow-hidden bg-muted">
                <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
                  <GraduationCap className="h-24 w-24" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Programs Section */}
        {data.programs.length > 0 && (
          <section className="py-16 md:py-24 bg-muted/30">
            <div className="container mx-auto px-4">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">Program Unggulan</h2>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                  Program-program unggulan yang kami tawarkan untuk mengembangkan potensi siswa
                </p>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {data.programs.map((program) => (
                  <Card key={program.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                        <GraduationCap className="h-6 w-6 text-primary" />
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
              <div className="text-center mt-8">
                <Button variant="outline" asChild>
                  <Link href="/akademik">
                    Lihat Semua Program
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </section>
        )}

        {/* News Section */}
        {data.recentPosts.length > 0 && (
          <section className="py-16 md:py-24">
            <div className="container mx-auto px-4">
              <div className="flex items-center justify-between mb-12">
                <div>
                  <h2 className="text-3xl md:text-4xl font-bold mb-2">Berita Terbaru</h2>
                  <p className="text-muted-foreground">
                    Kabar dan informasi terkini dari sekolah kami
                  </p>
                </div>
                <Button variant="outline" asChild className="hidden md:flex">
                  <Link href="/berita">
                    Semua Berita
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
              <div className="grid md:grid-cols-3 gap-6">
                {data.recentPosts.map((post) => (
                  <Card key={post.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="aspect-video relative bg-muted">
                      {post.featuredImg ? (
                        <Image
                          src={post.featuredImg}
                          alt={post.title}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <Calendar className="h-12 w-12 text-muted-foreground/50" />
                        </div>
                      )}
                    </div>
                    <CardHeader>
                      <div className="flex items-center gap-2 mb-2">
                        <span
                          className="text-xs px-2 py-1 rounded-full text-white"
                          style={{ backgroundColor: post.category.color || "#3B82F6" }}
                        >
                          {post.category.name}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {post.publishedAt && formatDate(post.publishedAt)}
                        </span>
                      </div>
                      <CardTitle className="text-lg line-clamp-2">
                        <Link href={`/berita/${post.slug}`} className="hover:text-primary">
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
          <section className="py-16 md:py-24 bg-primary text-primary-foreground">
            <div className="container mx-auto px-4">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">Apa Kata Mereka</h2>
                <p className="text-primary-foreground/80 max-w-2xl mx-auto">
                  Testimoni dari alumni, orang tua, dan siswa kami
                </p>
              </div>
              <div className="grid md:grid-cols-3 gap-6">
                {data.testimonials.map((testimonial) => (
                  <Card key={testimonial.id} className="bg-white/10 border-white/20">
                    <CardContent className="pt-6">
                      <p className="text-primary-foreground/90 italic mb-4">
                        "{testimonial.content}"
                      </p>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                          {testimonial.name[0]}
                        </div>
                        <div>
                          <p className="font-semibold">{testimonial.name}</p>
                          <p className="text-sm text-primary-foreground/70">
                            {testimonial.role}
                          </p>
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
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4">
            <Card className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground border-0">
              <CardContent className="py-12 text-center">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  Bergabung Bersama Kami
                </h2>
                <p className="text-primary-foreground/90 mb-8 max-w-2xl mx-auto">
                  Daftarkan putra-putri Anda untuk menjadi bagian dari keluarga besar sekolah kami
                </p>
                <div className="flex flex-wrap justify-center gap-4">
                  <Button size="lg" variant="secondary" asChild>
                    <Link href="/ppdb">
                      Daftar PPDB Online
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                  </Button>
                  <Button size="lg" variant="outline" className="text-white border-white hover:bg-white/10" asChild>
                    <Link href="/kontak">Hubungi Kami</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Contact Info */}
        <section className="py-12 bg-muted/50">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-3 gap-6 text-center">
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <MapPin className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">Alamat</h3>
                <p className="text-muted-foreground text-sm">
                  {schoolProfile?.address || "Jl. Pendidikan No. 1, Jakarta"}
                </p>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <Phone className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">Telepon</h3>
                <p className="text-muted-foreground text-sm">
                  {schoolProfile?.phone || "(021) 1234567"}
                </p>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <Mail className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">Email</h3>
                <p className="text-muted-foreground text-sm">
                  {schoolProfile?.email || "info@sekolah.sch.id"}
                </p>
              </div>
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
    <div className="text-center p-6 bg-background rounded-xl shadow-sm">
      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
        <Icon className="h-6 w-6 text-primary" />
      </div>
      <div className="text-3xl font-bold text-primary mb-1">
        {value}{suffix}
      </div>
      <div className="text-sm text-muted-foreground">{label}</div>
    </div>
  );
}
