import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { BookOpen, Trophy, Sparkles } from "lucide-react";

import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getProgramsByType } from "@/actions/programs";

// Dynamic rendering - prevents build-time database errors on Vercel
export const revalidate = 60;

export const metadata: Metadata = {
  title: "Program Akademik",
  description: "Program kurikulum, ekstrakurikuler, dan program unggulan sekolah",
};

export default async function AkademikPage() {
  const [curriculum, extracurricular, featured] = await Promise.all([
    getProgramsByType("CURRICULUM"),
    getProgramsByType("EXTRACURRICULAR"),
    getProgramsByType("FEATURED"),
  ]);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "CURRICULUM":
        return <BookOpen className="h-5 w-5" />;
      case "EXTRACURRICULAR":
        return <Trophy className="h-5 w-5" />;
      default:
        return <Sparkles className="h-5 w-5" />;
    }
  };

  const renderProgramSection = (
    title: string,
    programs: Awaited<ReturnType<typeof getProgramsByType>>,
    type: string,
    description: string
  ) => (
    <section className="mb-12">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-primary/10 rounded-lg text-primary">
          {getTypeIcon(type)}
        </div>
        <div>
          <h2 className="text-2xl font-bold">{title}</h2>
          <p className="text-muted-foreground">{description}</p>
        </div>
      </div>

      {programs.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {programs.map((program) => (
            <Link key={program.id} href={`/akademik/${program.slug}`}>
              <Card className="h-full hover:shadow-lg transition-shadow">
                {program.image && (
                  <div className="relative h-40 overflow-hidden rounded-t-lg">
                    <Image
                      src={program.image}
                      alt={program.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
                <CardHeader>
                  <CardTitle className="text-lg">{program.name}</CardTitle>
                  {program.description && (
                    <CardDescription className="line-clamp-2">
                      {program.description}
                    </CardDescription>
                  )}
                </CardHeader>
              </Card>
            </Link>
          ))}
        </div>
      ) : (
        <p className="text-muted-foreground text-center py-8">
          Belum ada program dalam kategori ini
        </p>
      )}
    </section>
  );

  return (
    <main className="flex-1">
      {/* Hero */}
      <section className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Program Akademik</h1>
          <p className="text-primary-foreground/80">
            Jelajahi program pendidikan dan kegiatan yang kami tawarkan
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        {featured.length > 0 && renderProgramSection(
          "Program Unggulan",
          featured,
          "FEATURED",
          "Program unggulan yang menjadi kebanggaan sekolah"
        )}

        {renderProgramSection(
          "Kurikulum",
          curriculum,
          "CURRICULUM",
          "Program pembelajaran sesuai kurikulum nasional"
        )}

        {renderProgramSection(
          "Ekstrakurikuler",
          extracurricular,
          "EXTRACURRICULAR",
          "Kegiatan pengembangan bakat dan minat siswa"
        )}
      </div>
    </main>
  );
}
