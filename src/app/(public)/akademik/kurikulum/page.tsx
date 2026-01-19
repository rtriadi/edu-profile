import { Metadata } from "next";
import { BookOpen, Clock, Target } from "lucide-react";


import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { prisma } from "@/lib/prisma";

// Dynamic rendering - prevents build-time database errors on Vercel
export const revalidate = 60;

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
            {/* Program Kurikulum dari Database */}
            {curriculumPrograms.length > 0 ? (
              <div className="mb-12">
                <div className="grid gap-6">
                  {curriculumPrograms.map((program) => (
                    <Card key={program.id} className="overflow-hidden">
                      <CardHeader className="bg-muted/50">
                        <CardTitle className="flex items-center gap-2 text-xl">
                          <BookOpen className="h-6 w-6 text-primary" />
                          {program.name}
                        </CardTitle>
                      </CardHeader>
                      {program.description && (
                        <CardContent className="pt-6">
                          <p className="text-muted-foreground leading-relaxed text-lg">
                            {program.description}
                          </p>
                        </CardContent>
                      )}
                    </Card>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                <BookOpen className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
                <p>Belum ada informasi kurikulum yang tersedia.</p>
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
