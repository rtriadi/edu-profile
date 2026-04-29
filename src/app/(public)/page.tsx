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
  ArrowUpRight,
} from "lucide-react";
import { unstable_cache } from "next/cache";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollAnimation } from "@/components/ui/scroll-animation";
import { prisma } from "@/lib/prisma";
import { formatDate } from "@/lib/utils";
import { getSiteConfig } from "@/lib/site-config";
import { getTranslations, type Language } from "@/lib/translations";
import { getLocale } from "@/actions/locale";

const getHomeData = unstable_cache(
  async () => {
    try {
      const [
        schoolProfile,
        recentPosts,
        programs,
        upcomingEvents,
        facilities,
        testimonials,
        gradeLevels,
        staffCount,
        alumniCount,
        gradeLevelCount,
        extracurricularCount,
      ] = await Promise.all([
        prisma.schoolProfile.findFirst(),
        prisma.post.findMany({
          where: { status: "PUBLISHED" },
          orderBy: { publishedAt: "desc" },
          take: 3,
          include: { category: { select: { name: true, color: true } } },
        }),
        prisma.program.findMany({
          where: { isActive: true, type: "FEATURED" },
          orderBy: { order: "asc" },
          take: 4,
        }),
        prisma.event.findMany({
          where: { isPublished: true, startDate: { gte: new Date() } },
          orderBy: { startDate: "asc" },
          take: 3,
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
        prisma.gradeLevel.findMany({
          where: { isActive: true },
          orderBy: { order: "asc" },
        }).catch(() => []),
        prisma.staff.count({ where: { isActive: true } }),
        prisma.alumni.count({ where: { isPublished: true } }),
        prisma.gradeLevel.count({ where: { isActive: true } }),
        prisma.program.count({ where: { isActive: true, type: "EXTRACURRICULAR" } }),
      ]);

      return {
        schoolProfile,
        recentPosts,
        programs,
        facilities,
        testimonials,
        upcomingEvents,
        gradeLevels,
        stats: {
          staff: staffCount,
          alumni: alumniCount,
          gradeLevels: gradeLevelCount,
          extracurriculars: extracurricularCount,
        },
      };
    } catch (error) {
      console.error("Error fetching home data:", error);
      return {
        schoolProfile: null,
        recentPosts: [],
        programs: [],
        facilities: [],
        testimonials: [],
        upcomingEvents: [],
        gradeLevels: [],
        stats: {
          staff: 0,
          alumni: 0,
          gradeLevels: 0,
          extracurriculars: 0,
        },
      };
    }
  },
  ["home-data"],
  { revalidate: 60, tags: ["home", "posts", "programs", "events"] }
);

export default async function HomePage() {
  const [data, siteConfig, locale] = await Promise.all([
    getHomeData(),
    getSiteConfig(),
    getLocale(),
  ]);
  const { schoolProfile } = data;
  
  const language: Language = locale === "en" ? "en" : "id";
  const t = getTranslations(language);

  const siteName = siteConfig.siteName || schoolProfile?.name || "EduProfile";

  return (
    <main className="flex-1">
      {/* WARM ACADEMIC HERO SECTION */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden bg-mesh-warm bg-noise isolate">
        <div className="container mx-auto px-4 relative z-10 py-24 md:py-32">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            
            {/* Left Content */}
            <div className="space-y-8">
              <ScrollAnimation delay={0.1}>
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-dark border border-white/20 mb-2">
                  <Sparkles className="h-4 w-4 text-yellow-300" />
                  <span className="text-sm font-medium text-white tracking-wide">
                    {t.home.welcome} {siteName}
                  </span>
                </div>
              </ScrollAnimation>

              <ScrollAnimation delay={0.2}>
                <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.1] text-white drop-shadow-sm">
                  {schoolProfile?.name || siteName}
                </h1>
              </ScrollAnimation>

              <ScrollAnimation delay={0.3}>
                <p className="text-lg md:text-xl text-white/90 max-w-xl leading-relaxed font-light">
                  {schoolProfile?.tagline ||
                    siteConfig.siteTagline ||
                    t.home.heroSubtitle}
                </p>
              </ScrollAnimation>

              <ScrollAnimation delay={0.4}>
                <div className="flex flex-wrap gap-4 pt-2">
                  <Button
                    size="lg"
                    className="h-14 px-8 bg-white text-theme-primary hover:bg-white/90 shadow-[0_8px_30px_rgb(0,0,0,0.12)] font-semibold text-base rounded-xl group"
                    asChild
                  >
                    <Link href="/ppdb">
                      {t.home.registerNow}
                      <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </Button>
                  <Button
                    size="lg"
                    className="h-14 px-8 border-2 border-white/30 bg-white/5 text-white hover:bg-white/20 hover:border-white/50 font-semibold text-base rounded-xl backdrop-blur-md transition-all"
                    asChild
                  >
                    <Link href="/profil">{t.home.aboutUs}</Link>
                  </Button>
                </div>
              </ScrollAnimation>

              <ScrollAnimation delay={0.5}>
                <div className="flex flex-wrap gap-8 pt-10 border-t border-white/10 mt-8">
                  {schoolProfile?.accreditation && (
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl glass-dark flex items-center justify-center">
                        <Award className="h-6 w-6 text-yellow-300" />
                      </div>
                      <div>
                        <p className="text-xs text-white/70 uppercase tracking-widest mb-0.5">{t.home.accreditation}</p>
                        <p className="font-display font-bold text-white text-xl">
                          {schoolProfile.accreditation}
                        </p>
                      </div>
                    </div>
                  )}
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl glass-dark flex items-center justify-center">
                      <Users className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <p className="text-xs text-white/70 uppercase tracking-widest mb-0.5">{t.home.totalTeachers}</p>
                      <p className="font-display font-bold text-white text-xl">
                        {data.stats.staff}+ {t.home.instructors}
                      </p>
                    </div>
                  </div>
                </div>
              </ScrollAnimation>
            </div>

            {/* Right Visual (Desktop Only) */}
            <div className="hidden lg:block relative">
              <ScrollAnimation delay={0.3}>
                <div className="relative aspect-[4/3] w-full max-w-lg mx-auto">
                  {/* Glass panel */}
                  <div className="absolute inset-0 glass-dark rounded-3xl shadow-2xl rotate-3 transition-transform hover:rotate-0 duration-500 ease-out" />
                  <div className="absolute inset-0 glass-dark rounded-3xl flex items-center justify-center border-t border-l border-white/30">
                    <GraduationCap className="h-32 w-32 text-white/40" />
                  </div>
                  
                  {/* Floating elements */}
                  <div className="absolute -left-8 top-1/4 p-4 glass-dark rounded-2xl shadow-xl animate-float">
                    <BookOpen className="h-8 w-8 text-white" />
                  </div>
                  <div className="absolute -right-6 top-2/3 p-4 glass-dark border-yellow-300/30 rounded-2xl shadow-xl animate-float-slow delay-300">
                    <Trophy className="h-8 w-8 text-yellow-300" />
                  </div>
                </div>
              </ScrollAnimation>
            </div>

          </div>
        </div>
      </section>

      {/* STATS STRIP */}
      <section className="relative z-20 -mt-10 mb-16 px-4">
        <div className="container mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 md:p-6 bg-card rounded-3xl shadow-xl border border-border">
            <ScrollAnimation delay={0.1}>
              <StatItem icon={Users} value={data.stats.staff} label={t.stats.teachers} />
            </ScrollAnimation>
            <ScrollAnimation delay={0.2}>
              <StatItem icon={GraduationCap} value={data.stats.alumni} label={t.stats.alumni} suffix="+" />
            </ScrollAnimation>
            <ScrollAnimation delay={0.3}>
              <StatItem icon={BookOpen} value={data.stats.gradeLevels} label={t.stats.gradeLevels} />
            </ScrollAnimation>
            <ScrollAnimation delay={0.4}>
              <StatItem icon={Calendar} value={data.stats.extracurriculars} label={t.stats.extracurricular} />
            </ScrollAnimation>
          </div>
        </div>
      </section>

      {/* ABOUT SECTION */}
      <section className="py-20 md:py-24 overflow-hidden relative">
        <div className="absolute right-0 top-0 w-1/3 h-full bg-secondary/10 -z-10 rounded-l-[100px]" />
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="order-2 lg:order-1 relative">
              <ScrollAnimation delay={0.2}>
                <div className="relative aspect-[4/3] rounded-[2rem] overflow-hidden bg-muted border border-border shadow-2xl">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-primary/10 flex items-center justify-center">
                    <GraduationCap className="h-32 w-32 text-primary/20" />
                  </div>
                </div>
                {/* Floating founder badge */}
                <div className="absolute -bottom-6 -right-6 md:bottom-10 md:-right-10 p-6 bg-card rounded-2xl shadow-xl border border-border max-w-xs animate-float-slow">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
                      <Clock className="h-7 w-7" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground uppercase tracking-wider">{t.home.foundedSince}</p>
                      <p className="text-2xl font-display font-bold text-foreground">
                        {schoolProfile?.foundedYear || "1990"}
                      </p>
                    </div>
                  </div>
                </div>
              </ScrollAnimation>
            </div>

            <div className="order-1 lg:order-2">
              <ScrollAnimation delay={0.1}>
                <div className="inline-flex items-center badge-academic mb-6">
                  {t.home.aboutUs}
                </div>
                <h2 className="font-display text-4xl md:text-5xl font-bold mb-6 leading-[1.15] text-foreground">
                  {t.home.buildingGeneration}{" "}
                  <span className="text-primary italic pr-2">{t.home.excellentAndCharacter}</span>
                </h2>
                <div className="space-y-6 text-muted-foreground">
                  <p className="leading-relaxed text-lg">
                    {schoolProfile?.vision ||
                      "Menjadi sekolah unggulan yang menghasilkan lulusan berkarakter, cerdas, dan berwawasan global."}
                  </p>
                  <div className="p-6 rounded-2xl bg-secondary/20 border border-secondary/30 relative overflow-hidden">
                    <div className="absolute -right-4 -top-4 opacity-5">
                      <Target className="w-32 h-32" />
                    </div>
                    <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                      <Target className="w-5 h-5 text-primary" />
                      {t.home.ourMission}
                    </h3>
                    <p className="text-sm leading-relaxed text-muted-foreground relative z-10">
                      {schoolProfile?.mission ||
                        "Menyelenggarakan pendidikan berkualitas untuk mengembangkan potensi peserta didik."}
                    </p>
                  </div>
                </div>
                <div className="mt-8 flex flex-wrap items-center gap-4">
                  <Button size="lg" asChild className="group rounded-xl h-12 px-6">
                    <Link href="/profil">
                      {t.home.learnMore}
                      <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </Button>
                </div>
              </ScrollAnimation>
            </div>
          </div>
        </div>
      </section>

      {/* PROGRAMS SECTION */}
      {data.programs.length > 0 && (
        <section className="py-24 bg-muted/30 border-y border-border relative">
          <div className="container mx-auto px-4">
            <ScrollAnimation>
              <div className="text-center mb-16 max-w-2xl mx-auto">
                <div className="inline-flex items-center badge-academic mb-4">
                  {t.home.ourPrograms}
                </div>
                <h2 className="font-display text-4xl md:text-5xl font-bold mb-4 text-foreground">
                  {t.home.featuredPrograms}
                </h2>
                <p className="text-muted-foreground text-lg">
                  {siteConfig.language === "en"
                    ? "Featured programs we offer to develop student potential"
                    : "Program-program unggulan yang kami tawarkan untuk mengembangkan potensi siswa"}
                </p>
              </div>
            </ScrollAnimation>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {data.programs.map((program, index) => (
                <ScrollAnimation key={program.id} delay={0.1 * index}>
                  <Card className="card-glow h-full border-border bg-card overflow-hidden group">
                    <div className="h-1.5 w-full bg-gradient-to-r from-primary/40 to-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                    <CardHeader className="pt-6">
                      <div className="w-14 h-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-4 transition-transform group-hover:scale-110 group-hover:bg-primary group-hover:text-primary-foreground">
                        <BookOpen className="h-6 w-6" />
                      </div>
                      <CardTitle className="font-display text-xl text-foreground">
                        {program.name}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="line-clamp-3 text-base leading-relaxed">
                        {program.description}
                      </CardDescription>
                    </CardContent>
                  </Card>
                </ScrollAnimation>
              ))}
            </div>
            
            <div className="text-center mt-12">
              <Button variant="outline" size="lg" asChild className="group rounded-xl">
                <Link href="/akademik">
                  {t.common.seeAll}
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
            </div>
          </div>
        </section>
      )}

      {/* LATEST NEWS */}
      {data.recentPosts.length > 0 && (
        <section className="py-24">
          <div className="container mx-auto px-4">
            <ScrollAnimation>
              <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
                <div>
                  <div className="inline-flex items-center badge-academic mb-4">
                    {t.home.latestNews}
                  </div>
                  <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground">
                    {t.home.newsInfo}
                  </h2>
                </div>
                <Button variant="ghost" asChild className="hidden md:flex group text-primary hover:text-primary/80">
                  <Link href="/berita">
                    {t.common.seeAll}
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
              </div>
            </ScrollAnimation>

            <div className="grid md:grid-cols-3 gap-8">
              {data.recentPosts.map((post, index) => (
                <ScrollAnimation key={post.id} delay={index * 0.1}>
                  <article className="group h-full flex flex-col">
                    <div className="aspect-[4/3] rounded-3xl relative bg-muted overflow-hidden mb-6">
                      {post.featuredImg ? (
                        <Image
                          src={post.featuredImg}
                          alt={post.title}
                          fill
                          className="object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center bg-secondary/20">
                          <NewspaperIcon className="h-12 w-12 text-primary/30" />
                        </div>
                      )}
                      <div className="absolute top-4 left-4">
                        <span
                          className="text-xs px-3 py-1.5 rounded-full text-white font-semibold tracking-wide shadow-md"
                          style={{ backgroundColor: post.category.color || "var(--primary)" }}
                        >
                          {post.category.name}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                      <Clock className="h-4 w-4 text-primary/70" />
                      {post.publishedAt && (
                        <time dateTime={post.publishedAt.toISOString()}>
                          {formatDate(post.publishedAt)}
                        </time>
                      )}
                    </div>
                    
                    <h3 className="font-display text-xl font-bold line-clamp-2 text-foreground group-hover:text-primary transition-colors mb-3">
                      <Link href={`/berita/${post.slug}`}>
                        {post.title}
                      </Link>
                    </h3>
                    
                    <p className="text-muted-foreground line-clamp-2 mb-4 flex-1">
                      {post.excerpt}
                    </p>
                    
                    <Link 
                      href={`/berita/${post.slug}`}
                      className="inline-flex items-center text-sm font-semibold text-primary hover:text-primary/80 transition-colors mt-auto"
                    >
                      Baca selengkapnya
                      <ArrowUpRight className="ml-1 h-4 w-4" />
                    </Link>
                  </article>
                </ScrollAnimation>
              ))}
            </div>
            
            <div className="text-center mt-10 md:hidden">
              <Button variant="outline" className="w-full rounded-xl" asChild>
                <Link href="/berita">{t.home.allNews}</Link>
              </Button>
            </div>
          </div>
        </section>
      )}

      {/* TESTIMONIALS */}
      {data.testimonials.length > 0 && (
        <section className="py-24 bg-mesh-warm relative overflow-hidden isolate">
          <div className="absolute inset-0 bg-noise mix-blend-overlay opacity-50" />
          <div className="container mx-auto px-4 relative z-10">
            <ScrollAnimation>
              <div className="text-center mb-16 max-w-2xl mx-auto">
                <div className="inline-flex items-center badge-academic bg-white/10 text-white border-white/20 mb-4">
                  {t.home.testimonials}
                </div>
                <h2 className="font-display text-4xl md:text-5xl font-bold mb-4 text-white">
                  {t.home.whatTheySay}
                </h2>
                <p className="text-white/80 text-lg">
                  {t.home.testimonialsDesc}
                </p>
              </div>
            </ScrollAnimation>

            <div className="grid md:grid-cols-3 gap-6">
              {data.testimonials.map((testimonial, i) => (
                <ScrollAnimation key={testimonial.id} delay={i * 0.1}>
                  <Card className="glass-dark border-white/20 hover:bg-white/10 transition-colors h-full flex flex-col">
                    <CardContent className="pt-8 flex-1 flex flex-col">
                      <div className="flex gap-1 mb-6">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${i < (testimonial.rating || 5) ? "text-yellow-400 fill-yellow-400" : "text-white/30"}`}
                          />
                        ))}
                      </div>
                      <p className="text-white/95 italic mb-8 leading-relaxed flex-1">
                        &ldquo;{testimonial.content}&rdquo;
                      </p>
                      <div className="flex items-center gap-4 mt-auto">
                        <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center text-white font-bold text-lg border border-white/30">
                          {testimonial.name[0]}
                        </div>
                        <div>
                          <p className="font-semibold text-white">
                            {testimonial.name}
                          </p>
                          <p className="text-sm text-white/70">
                            {testimonial.role}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </ScrollAnimation>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA SECTION */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <ScrollAnimation>
            <div className="relative overflow-hidden rounded-[2.5rem] bg-card border border-border shadow-2xl p-8 md:p-16 text-center isolate">
              <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent -z-10" />
              
              <div className="w-20 h-20 bg-primary/10 rounded-3xl flex items-center justify-center mx-auto mb-8 rotate-12">
                <Sparkles className="h-10 w-10 text-primary" />
              </div>
              
              <h2 className="font-display text-4xl md:text-5xl font-bold mb-6 text-foreground max-w-2xl mx-auto leading-tight">
                {t.home.joinUs}
              </h2>
              <p className="text-muted-foreground mb-10 max-w-xl mx-auto text-lg leading-relaxed">
                {t.home.joinUsDesc} <span className="font-semibold text-foreground">{siteName}</span>
              </p>
              
              <div className="flex flex-wrap justify-center gap-4">
                <Button size="lg" className="h-14 px-8 text-base rounded-xl font-semibold shadow-lg" asChild>
                  <Link href="/ppdb">
                    {t.home.registerPpdb}
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" className="h-14 px-8 text-base rounded-xl font-semibold" asChild>
                  <Link href="/kontak">{t.home.contactUs}</Link>
                </Button>
              </div>
            </div>
          </ScrollAnimation>
        </div>
      </section>
    </main>
  );
}

function StatItem({ icon: Icon, value, label, suffix = "" }: any) {
  return (
    <div className="flex items-center gap-4 p-2">
      <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center flex-shrink-0">
        <Icon className="h-5 w-5 text-primary" />
      </div>
      <div>
        <div className="font-display text-2xl md:text-3xl font-bold text-foreground leading-none mb-1">
          {value}{suffix}
        </div>
        <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{label}</div>
      </div>
    </div>
  );
}

// Helper icon component since Newspaper is imported as NewspaperIcon internally
function NewspaperIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2Zm0 0a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2" />
      <path d="M18 14h-8" />
      <path d="M15 18h-5" />
      <path d="M10 6h8v4h-8V6Z" />
    </svg>
  );
}
