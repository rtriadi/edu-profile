import { Metadata } from "next";
import { Eye, Target, CheckCircle } from "lucide-react";


import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { prisma } from "@/lib/prisma";

// Dynamic rendering - prevents build-time database errors on Vercel
export const revalidate = 60;

export const metadata: Metadata = {
  title: "Visi & Misi",
  description: "Visi dan Misi Sekolah Kami",
};

async function getVisiMisiData() {
  try {
    const schoolProfile = await prisma.schoolProfile.findFirst({
      select: {
        name: true,
        vision: true,
        mission: true,
        tagline: true,
      },
    });
    return schoolProfile;
  } catch (error) {
    console.error("Error fetching visi-misi data:", error);
    return null;
  }
}

export default async function VisiMisiPage() {
  const schoolProfile = await getVisiMisiData();

  // Parse mission into array if it contains numbered list
  const missionItems = schoolProfile?.mission
    ?.split(/\n/)
    .filter((item) => item.trim())
    .map((item) => item.replace(/^\d+\.\s*/, "").trim()) || [];

  return (
    <main className="flex-1">
      {/* Hero */}
      <section className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-5xl font-bold mb-4">Visi & Misi</h1>
          <p className="text-xl text-primary-foreground/90 max-w-2xl mx-auto">
            Arah dan tujuan pendidikan {schoolProfile?.name || "kami"}
          </p>
        </div>
      </section>

      {/* Vision */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <Card className="border-l-4 border-l-primary">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-2xl">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <Eye className="h-6 w-6 text-primary" />
                  </div>
                  Visi
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  {schoolProfile?.vision ||
                    "Menjadi sekolah unggulan yang menghasilkan lulusan berkarakter, cerdas, dan berwawasan global."}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <Card className="border-l-4 border-l-secondary">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-2xl">
                  <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center">
                    <Target className="h-6 w-6 text-secondary" />
                  </div>
                  Misi
                </CardTitle>
              </CardHeader>
              <CardContent>
                {missionItems.length > 0 ? (
                  <ul className="space-y-4">
                    {missionItems.map((item, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <CheckCircle className="h-5 w-5 text-secondary mt-0.5 flex-shrink-0" />
                        <span className="text-muted-foreground">{item}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <ul className="space-y-4">
                    <li className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-secondary mt-0.5 flex-shrink-0" />
                      <span className="text-muted-foreground">
                        Menyelenggarakan pendidikan berkualitas
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-secondary mt-0.5 flex-shrink-0" />
                      <span className="text-muted-foreground">
                        Mengembangkan karakter siswa
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-secondary mt-0.5 flex-shrink-0" />
                      <span className="text-muted-foreground">
                        Memfasilitasi pengembangan bakat dan minat
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-secondary mt-0.5 flex-shrink-0" />
                      <span className="text-muted-foreground">
                        Menjalin kerjasama dengan masyarakat
                      </span>
                    </li>
                  </ul>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </main>
  );
}
