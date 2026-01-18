import { Metadata } from "next";
import Image from "next/image";

import { 
  Music, 
  Palette, 
  Trophy, 
  Users, 
  Microscope, 
  BookOpen,
  Heart,
  Globe
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Ekstrakurikuler",
  description: "Kegiatan ekstrakurikuler sekolah kami",
};

async function getEkstrakurikulerData() {
  try {
    const programs = await prisma.program.findMany({
      where: { 
        isActive: true,
        type: "EXTRACURRICULAR",
      },
      orderBy: { order: "asc" },
    });
    return programs;
  } catch (error) {
    console.error("Error fetching ekstrakurikuler data:", error);
    return [];
  }
}

// Default ekstrakurikuler if no data in database
const defaultEkskul = [
  { name: "Pramuka", icon: Users, category: "Wajib", description: "Kegiatan kepramukaan untuk membangun karakter" },
  { name: "Paduan Suara", icon: Music, category: "Seni", description: "Latihan vokal dan penampilan musik" },
  { name: "Seni Tari", icon: Palette, category: "Seni", description: "Melestarikan budaya melalui tarian" },
  { name: "Olahraga", icon: Trophy, category: "Olahraga", description: "Basket, futsal, voli, dan badminton" },
  { name: "KIR", icon: Microscope, category: "Akademik", description: "Karya Ilmiah Remaja" },
  { name: "English Club", icon: Globe, category: "Bahasa", description: "Pengembangan kemampuan bahasa Inggris" },
  { name: "PMR", icon: Heart, category: "Sosial", description: "Palang Merah Remaja" },
  { name: "Literasi", icon: BookOpen, category: "Akademik", description: "Klub baca dan menulis" },
];

export default async function EkstrakurikulerPage() {
  const programs = await getEkstrakurikulerData();

  return (
    <main className="flex-1">
      {/* Hero */}
      <section className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-5xl font-bold mb-4">Ekstrakurikuler</h1>
          <p className="text-xl text-primary-foreground/90 max-w-2xl mx-auto">
            Kembangkan bakat dan minat melalui berbagai kegiatan ekstrakurikuler
          </p>
        </div>
      </section>

      {/* Ekstrakurikuler List */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          {programs.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {programs.map((program) => (
                <Card key={program.id} className="hover:shadow-lg transition-shadow">
                  {program.image && (
                    <div className="relative h-48 overflow-hidden rounded-t-lg">
                      <Image
                        src={program.image}
                        alt={program.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                  <CardHeader>
                    <CardTitle>{program.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      {program.description || "Kegiatan pengembangan diri siswa"}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {defaultEkskul.map((ekskul) => {
                const Icon = ekskul.icon;
                return (
                  <Card key={ekskul.name} className="hover:shadow-lg transition-shadow">
                    <CardContent className="pt-6">
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                        <Icon className="h-6 w-6 text-primary" />
                      </div>
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold">{ekskul.name}</h3>
                        <Badge variant="outline" className="text-xs">
                          {ekskul.category}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {ekskul.description}
                      </p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
