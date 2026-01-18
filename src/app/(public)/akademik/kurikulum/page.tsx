import { Metadata } from "next";
import { BookOpen, GraduationCap, Clock, Target } from "lucide-react";
import { unstable_cache } from "next/cache";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Kurikulum",
  description: "Kurikulum dan program pembelajaran sekolah kami",
};

const getKurikulumData = unstable_cache(
  async () => {
    try {
      const schoolProfile = await prisma.schoolProfile.findFirst({
        select: { name: true, schoolLevel: true },
      });
      return schoolProfile;
    } catch (error) {
      console.error("Error fetching kurikulum data:", error);
      return null;
    }
  },
  ["kurikulum-page-data"],
  { revalidate: 60, tags: ["school-profile"] }
);

export default async function KurikulumPage() {
  const schoolProfile = await getKurikulumData();

  return (
    <main className="flex-1">
      {/* Hero */}
      <section className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-5xl font-bold mb-4">Kurikulum</h1>
          <p className="text-xl text-primary-foreground/90 max-w-2xl mx-auto">
            Program pembelajaran {schoolProfile?.name || "sekolah kami"}
          </p>
        </div>
      </section>

      {/* Kurikulum Overview */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 gap-8 mb-12">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5 text-primary" />
                    Kurikulum Merdeka
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Sekolah kami menerapkan Kurikulum Merdeka yang memberikan 
                    fleksibilitas kepada guru untuk menyesuaikan pembelajaran 
                    dengan kebutuhan dan karakteristik siswa.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5 text-primary" />
                    Pembelajaran Berbasis Proyek
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Pendekatan Project-Based Learning (PBL) diterapkan untuk 
                    mengembangkan keterampilan berpikir kritis, kreativitas, 
                    dan kolaborasi siswa.
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Mata Pelajaran */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <GraduationCap className="h-6 w-6 text-primary" />
                Mata Pelajaran
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {[
                  "Pendidikan Agama",
                  "Pendidikan Pancasila",
                  "Bahasa Indonesia",
                  "Matematika",
                  "IPA (Ilmu Pengetahuan Alam)",
                  "IPS (Ilmu Pengetahuan Sosial)",
                  "Bahasa Inggris",
                  "Seni Budaya",
                  "Pendidikan Jasmani",
                  "Prakarya",
                  "Informatika",
                  "Bahasa Daerah",
                ].map((subject) => (
                  <Card key={subject} className="bg-muted/30">
                    <CardContent className="py-4 text-center">
                      <span className="text-sm font-medium">{subject}</span>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Jam Belajar */}
            <div>
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <Clock className="h-6 w-6 text-primary" />
                Jam Pembelajaran
              </h2>
              <Card>
                <CardContent className="py-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="font-semibold mb-2">Senin - Kamis</h3>
                      <p className="text-muted-foreground">07:00 - 15:00 WIB</p>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2">Jumat</h3>
                      <p className="text-muted-foreground">07:00 - 11:30 WIB</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
