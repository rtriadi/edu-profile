import { Metadata } from "next";
import Image from "next/image";
import { Trophy, Medal, Award, Calendar } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Prestasi",
  description: "Prestasi dan pencapaian siswa dan sekolah kami",
};

async function getPrestasiData() {
  try {
    const achievements = await prisma.achievement.findMany({
      where: { isPublished: true },
      orderBy: { date: "desc" },
      take: 20,
    });
    return achievements;
  } catch (error) {
    console.error("Error fetching prestasi data:", error);
    return [];
  }
}

function getLevelBadgeColor(level: string) {
  switch (level?.toLowerCase()) {
    case "internasional":
      return "bg-purple-500";
    case "nasional":
      return "bg-red-500";
    case "provinsi":
      return "bg-blue-500";
    case "kabupaten":
    case "kota":
      return "bg-green-500";
    default:
      return "bg-gray-500";
  }
}

function getLevelIcon(level: string | null) {
  if (!level) return Trophy;
  const levelLower = level.toLowerCase();
  if (levelLower.includes("internasional") || levelLower.includes("nasional")) {
    return Trophy;
  }
  if (levelLower.includes("provinsi")) {
    return Medal;
  }
  return Award;
}

export default async function PrestasiPage() {
  const achievements = await getPrestasiData();

  return (
    <main className="flex-1">
      {/* Hero */}
      <section className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-5xl font-bold mb-4">Prestasi</h1>
          <p className="text-xl text-primary-foreground/90 max-w-2xl mx-auto">
            Pencapaian membanggakan dari siswa dan sekolah kami
          </p>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            <Card>
              <CardContent className="pt-6 text-center">
                <Trophy className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
                <div className="text-3xl font-bold text-primary">
                  {achievements.length}
                </div>
                <div className="text-sm text-muted-foreground">Total Prestasi</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6 text-center">
                <Medal className="h-8 w-8 text-purple-500 mx-auto mb-2" />
                <div className="text-3xl font-bold text-primary">
                  {achievements.filter(a => a.level === "INTERNASIONAL").length}
                </div>
                <div className="text-sm text-muted-foreground">Internasional</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6 text-center">
                <Award className="h-8 w-8 text-red-500 mx-auto mb-2" />
                <div className="text-3xl font-bold text-primary">
                  {achievements.filter(a => a.level === "NASIONAL").length}
                </div>
                <div className="text-sm text-muted-foreground">Nasional</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6 text-center">
                <Trophy className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                <div className="text-3xl font-bold text-primary">
                  {achievements.filter(a => a.level === "PROVINSI").length}
                </div>
                <div className="text-sm text-muted-foreground">Provinsi</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Achievements List */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          {achievements.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {achievements.map((achievement) => {
                const LevelIcon = getLevelIcon(achievement.level);
                return (
                  <Card key={achievement.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                    {achievement.image && (
                      <div className="relative h-48 overflow-hidden">
                        <Image
                          src={achievement.image}
                          alt={achievement.title}
                          fill
                          className="object-cover"
                        />
                        {achievement.level && (
                          <div className="absolute top-3 right-3">
                            <Badge className={getLevelBadgeColor(achievement.level)}>
                              {achievement.level}
                            </Badge>
                          </div>
                        )}
                      </div>
                    )}
                    <CardContent className="pt-6">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <LevelIcon className="h-5 w-5 text-primary" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold mb-1">{achievement.title}</h3>
                          {achievement.category && (
                            <p className="text-sm text-primary font-medium">{achievement.category}</p>
                          )}
                          {achievement.participants && (
                            <p className="text-sm text-muted-foreground">{achievement.participants}</p>
                          )}
                          {achievement.date && (
                            <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {new Date(achievement.date).toLocaleDateString("id-ID", {
                                year: "numeric",
                                month: "long",
                              })}
                            </p>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12">
              <Trophy className="h-16 w-16 text-muted-foreground/30 mx-auto mb-4" />
              <p className="text-muted-foreground">
                Data prestasi belum tersedia. Silakan tambahkan melalui panel admin.
              </p>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
