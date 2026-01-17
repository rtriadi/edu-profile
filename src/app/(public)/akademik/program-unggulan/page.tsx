import { Metadata } from "next";
import Image from "next/image";
import { Star, Award, Zap, Target } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Program Unggulan",
  description: "Program unggulan sekolah kami",
};

async function getProgramUnggulanData() {
  const programs = await prisma.program.findMany({
    where: { 
      isActive: true,
      type: "FEATURED",
    },
    orderBy: { order: "asc" },
  });
  return programs;
}

export default async function ProgramUnggulanPage() {
  const programs = await getProgramUnggulanData();

  return (
    <main className="flex-1">
      {/* Hero */}
      <section className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-5xl font-bold mb-4">Program Unggulan</h1>
          <p className="text-xl text-primary-foreground/90 max-w-2xl mx-auto">
            Program-program unggulan yang menjadi kebanggaan sekolah kami
          </p>
        </div>
      </section>

      {/* Programs */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          {programs.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {programs.map((program) => (
                <Card key={program.id} className="overflow-hidden hover:shadow-xl transition-shadow">
                  {program.image && (
                    <div className="relative h-48 overflow-hidden">
                      <Image
                        src={program.image}
                        alt={program.name}
                        fill
                        className="object-cover"
                      />
                      <div className="absolute top-3 right-3">
                        <Badge className="bg-primary">
                          <Star className="h-3 w-3 mr-1" />
                          Unggulan
                        </Badge>
                      </div>
                    </div>
                  )}
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Zap className="h-5 w-5 text-primary" />
                      {program.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      {program.description || "Program unggulan sekolah"}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="max-w-4xl mx-auto">
              <div className="grid md:grid-cols-2 gap-8">
                {[
                  {
                    title: "Kelas Tahfidz",
                    description: "Program menghafal Al-Quran dengan metode modern dan menyenangkan",
                    icon: Award,
                  },
                  {
                    title: "Bilingual Program",
                    description: "Pembelajaran dengan dua bahasa (Indonesia & Inggris)",
                    icon: Target,
                  },
                  {
                    title: "STEM Education",
                    description: "Science, Technology, Engineering, and Mathematics",
                    icon: Zap,
                  },
                  {
                    title: "Character Building",
                    description: "Program pembentukan karakter dan kepemimpinan",
                    icon: Star,
                  },
                ].map((item) => {
                  const Icon = item.icon;
                  return (
                    <Card key={item.title} className="border-l-4 border-l-primary">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                            <Icon className="h-5 w-5 text-primary" />
                          </div>
                          {item.title}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-muted-foreground">{item.description}</p>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
