import { Metadata } from "next";
import { BookOpen, Clock, Target } from "lucide-react";


import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { prisma } from "@/lib/prisma";

// Dynamic rendering - prevents build-time database errors on Vercel
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Kurikulum",
  description: "Kurikulum dan program pembelajaran sekolah kami",
};

// Type for operating hours
interface OperatingHours {
  monday?: string;
  tuesday?: string;
  wednesday?: string;
  thursday?: string;
  friday?: string;
  saturday?: string;
  sunday?: string;
}

async function getKurikulumData() {
  try {
    const [schoolProfile, curriculumPrograms] = await Promise.all([
      prisma.schoolProfile.findFirst({
        select: { 
          name: true, 
          schoolLevel: true,
          operatingHours: true,
        },
      }),
      prisma.program.findMany({
        where: { 
          type: "CURRICULUM",
          isActive: true,
        },
        orderBy: [{ order: "asc" }, { name: "asc" }],
      }),
    ]);
    return { schoolProfile, curriculumPrograms };
  } catch (error) {
    console.error("Error fetching kurikulum data:", error);
    return { schoolProfile: null, curriculumPrograms: [] };
  }
}

// Helper to format operating hours
function formatOperatingHours(hours: OperatingHours | null) {
  if (!hours) {
    return {
      weekdays: "07:00 - 15:00 WIB",
      friday: "07:00 - 11:30 WIB",
    };
  }
  
  return {
    weekdays: hours.monday || "07:00 - 15:00 WIB",
    friday: hours.friday || "07:00 - 11:30 WIB",
  };
}

export default async function KurikulumPage() {
  const { schoolProfile, curriculumPrograms } = await getKurikulumData();

  const operatingHours = formatOperatingHours(
    schoolProfile?.operatingHours as OperatingHours | null
  );

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

            {/* Program Kurikulum dari Database */}
            {curriculumPrograms.length > 0 && (
              <div className="mb-12">
                <h2 className="text-2xl font-bold mb-6">Program Kurikulum</h2>
                <div className="grid gap-4">
                  {curriculumPrograms.map((program) => (
                    <Card key={program.id}>
                      <CardHeader>
                        <CardTitle className="text-lg">{program.name}</CardTitle>
                      </CardHeader>
                      {program.description && (
                        <CardContent>
                          <p className="text-muted-foreground">{program.description}</p>
                        </CardContent>
                      )}
                    </Card>
                  ))}
                </div>
              </div>
            )}

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
                      <p className="text-muted-foreground">{operatingHours.weekdays}</p>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2">Jumat</h3>
                      <p className="text-muted-foreground">{operatingHours.friday}</p>
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
