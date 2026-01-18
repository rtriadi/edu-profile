import { Metadata } from "next";
import Link from "next/link";
import { unstable_cache } from "next/cache";
import { 
  GraduationCap, 
  Users, 
  Building2, 
  Trophy,
  Target,
  Eye,
  History,
  Award,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Profil Sekolah",
  description: "Mengenal lebih dekat tentang sekolah kami",
};

const getProfileData = unstable_cache(
  async () => {
    try {
      const [schoolProfile, stats] = await Promise.all([
        prisma.schoolProfile.findFirst(),
        Promise.all([
          prisma.staff.count({ where: { isActive: true } }),
          prisma.staff.count({ where: { isActive: true, isTeacher: true } }),
          prisma.facility.count({ where: { isPublished: true } }),
          prisma.achievement.count({ where: { isPublished: true } }),
        ]),
      ]);

      return {
        schoolProfile,
        stats: {
          totalStaff: stats[0],
          totalTeachers: stats[1],
          totalFacilities: stats[2],
          totalAchievements: stats[3],
        },
      };
    } catch (error) {
      console.error("Error fetching profile data:", error);
      return {
        schoolProfile: null,
        stats: {
          totalStaff: 0,
          totalTeachers: 0,
          totalFacilities: 0,
          totalAchievements: 0,
        },
      };
    }
  },
  ["profil-page-data"],
  { revalidate: 60, tags: ["school-profile", "staff", "facilities", "achievements"] }
);

export default async function ProfilPage() {
  const { schoolProfile, stats } = await getProfileData();

  return (
    <main className="flex-1">
      {/* Hero */}
      <section className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-5xl font-bold mb-4">
            {schoolProfile?.name || "Profil Sekolah"}
          </h1>
          <p className="text-xl text-primary-foreground/90 max-w-2xl mx-auto">
            {schoolProfile?.tagline || "Mendidik Generasi Unggul dan Berkarakter"}
          </p>
          {schoolProfile?.accreditation && (
            <div className="mt-6 inline-flex items-center gap-2 px-4 py-2 bg-white/20 rounded-full">
              <Award className="h-5 w-5" />
              <span>Akreditasi {schoolProfile.accreditation}</span>
            </div>
          )}
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <StatCard icon={Users} value={stats.totalStaff} label="Total Staff" />
            <StatCard icon={GraduationCap} value={stats.totalTeachers} label="Guru" />
            <StatCard icon={Building2} value={stats.totalFacilities} label="Fasilitas" />
            <StatCard icon={Trophy} value={stats.totalAchievements} label="Prestasi" />
          </div>
        </div>
      </section>

      {/* Vision & Mission */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Vision */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="h-5 w-5 text-primary" />
                  Visi
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                  {schoolProfile?.vision || 
                    "Menjadi sekolah unggulan yang menghasilkan lulusan berkarakter, cerdas, dan berwawasan global."}
                </p>
              </CardContent>
            </Card>

            {/* Mission */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-primary" />
                  Misi
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-muted-foreground leading-relaxed whitespace-pre-line">
                  {schoolProfile?.mission || 
                    "1. Menyelenggarakan pendidikan berkualitas\n2. Mengembangkan karakter siswa\n3. Memfasilitasi pengembangan bakat dan minat\n4. Menjalin kerjasama dengan masyarakat"}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* History */}
      {schoolProfile?.history && (
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <div className="flex items-center gap-2 mb-6">
                <History className="h-6 w-6 text-primary" />
                <h2 className="text-2xl md:text-3xl font-bold">Sejarah Sekolah</h2>
              </div>
              <div className="prose prose-lg max-w-none text-muted-foreground">
                <p className="whitespace-pre-line">{schoolProfile.history}</p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Quick Links */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">
            Jelajahi Lebih Lanjut
          </h2>
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <QuickLinkCard
              href="/profil/guru-staff"
              icon={Users}
              title="Guru & Staff"
              description="Kenali para pendidik dan staff kami"
            />
            <QuickLinkCard
              href="/profil/fasilitas"
              icon={Building2}
              title="Fasilitas"
              description="Lihat fasilitas yang tersedia"
            />
            <QuickLinkCard
              href="/akademik/prestasi"
              icon={Trophy}
              title="Prestasi"
              description="Pencapaian siswa dan sekolah"
            />
          </div>
        </div>
      </section>
    </main>
  );
}

function StatCard({
  icon: Icon,
  value,
  label,
}: {
  icon: React.ElementType;
  value: number;
  label: string;
}) {
  return (
    <div className="text-center p-6 bg-background rounded-xl shadow-sm">
      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
        <Icon className="h-6 w-6 text-primary" />
      </div>
      <div className="text-3xl font-bold text-primary mb-1">{value}</div>
      <div className="text-sm text-muted-foreground">{label}</div>
    </div>
  );
}

function QuickLinkCard({
  href,
  icon: Icon,
  title,
  description,
}: {
  href: string;
  icon: React.ElementType;
  title: string;
  description: string;
}) {
  return (
    <Link href={href}>
      <Card className="h-full hover:shadow-lg transition-shadow hover:border-primary">
        <CardContent className="pt-6 text-center">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
            <Icon className="h-6 w-6 text-primary" />
          </div>
          <h3 className="font-semibold mb-2">{title}</h3>
          <p className="text-sm text-muted-foreground">{description}</p>
        </CardContent>
      </Card>
    </Link>
  );
}
