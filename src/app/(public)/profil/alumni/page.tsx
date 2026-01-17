import { Metadata } from "next";
import Image from "next/image";
import { GraduationCap, Briefcase, Award, User } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getPublishedAlumni, getGraduationYears } from "@/actions/alumni";

export const metadata: Metadata = {
  title: "Alumni",
  description: "Daftar alumni sekolah yang berprestasi",
};

export default async function AlumniPage() {
  const alumni = await getPublishedAlumni();
  const graduationYears = await getGraduationYears();

  // Group alumni by graduation year
  const groupedAlumni = alumni.reduce((acc, alum) => {
    const year = alum.graduationYear;
    if (!acc[year]) {
      acc[year] = [];
    }
    acc[year].push(alum);
    return acc;
  }, {} as Record<number, typeof alumni>);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Alumni</h1>
        <p className="text-muted-foreground">
          Daftar alumni yang telah berkontribusi di berbagai bidang
        </p>
      </div>

      {alumni.length > 0 ? (
        <div className="space-y-12">
          {Object.entries(groupedAlumni)
            .sort(([a], [b]) => Number(b) - Number(a))
            .map(([year, alumniList]) => (
              <section key={year}>
                <div className="flex items-center gap-2 mb-6">
                  <GraduationCap className="h-6 w-6 text-primary" />
                  <h2 className="text-2xl font-semibold">Angkatan {year}</h2>
                  <Badge variant="secondary">{alumniList.length} alumni</Badge>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {alumniList.map((alum) => (
                    <Card key={alum.id} className="overflow-hidden">
                      <CardContent className="p-6">
                        <div className="flex items-start gap-4">
                          {alum.photo ? (
                            <div className="relative w-16 h-16 rounded-full overflow-hidden flex-shrink-0">
                              <Image
                                src={alum.photo}
                                alt={alum.name}
                                fill
                                className="object-cover"
                              />
                            </div>
                          ) : (
                            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                              <User className="h-8 w-8 text-muted-foreground" />
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-lg">{alum.name}</h3>
                            {alum.currentStatus && (
                              <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                                <Briefcase className="h-3 w-3" />
                                {alum.currentStatus}
                              </div>
                            )}
                            {alum.company && (
                              <p className="text-sm text-muted-foreground">
                                {alum.company}
                              </p>
                            )}
                          </div>
                        </div>

                        {alum.achievement && (
                          <div className="mt-4 p-3 bg-amber-50 dark:bg-amber-950/30 rounded-lg">
                            <div className="flex items-start gap-2">
                              <Award className="h-4 w-4 text-amber-500 mt-0.5 flex-shrink-0" />
                              <p className="text-sm">{alum.achievement}</p>
                            </div>
                          </div>
                        )}

                        {alum.testimonial && (
                          <blockquote className="mt-4 text-sm text-muted-foreground italic border-l-2 pl-3">
                            "{alum.testimonial}"
                          </blockquote>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </section>
            ))}
        </div>
      ) : (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            <GraduationCap className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Belum ada data alumni</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
