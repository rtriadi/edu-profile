import { Metadata } from "next";
import { History, Calendar, Award } from "lucide-react";
import { unstable_cache } from "next/cache";

import { Card, CardContent } from "@/components/ui/card";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Sejarah Sekolah",
  description: "Sejarah dan perjalanan sekolah kami",
};

const getSejarahData = unstable_cache(
  async () => {
    try {
      const schoolProfile = await prisma.schoolProfile.findFirst({
        select: {
          name: true,
          history: true,
          foundedYear: true,
          accreditation: true,
        },
      });
      return schoolProfile;
    } catch (error) {
      console.error("Error fetching sejarah data:", error);
      return null;
    }
  },
  ["sejarah-page-data"],
  { revalidate: 60, tags: ["school-profile"] }
);

export default async function SejarahPage() {
  const schoolProfile = await getSejarahData();
  const currentYear = new Date().getFullYear();
  const yearsEstablished = schoolProfile?.foundedYear 
    ? currentYear - schoolProfile.foundedYear 
    : 0;

  return (
    <main className="flex-1">
        {/* Hero */}
        <section className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground py-16">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-3xl md:text-5xl font-bold mb-4">Sejarah Sekolah</h1>
            <p className="text-xl text-primary-foreground/90 max-w-2xl mx-auto">
              Perjalanan dan perkembangan {schoolProfile?.name || "sekolah kami"}
            </p>
          </div>
        </section>

        {/* Stats */}
        {schoolProfile?.foundedYear && (
          <section className="py-12 bg-muted/50">
            <div className="container mx-auto px-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
                <Card>
                  <CardContent className="pt-6 text-center">
                    <Calendar className="h-8 w-8 text-primary mx-auto mb-2" />
                    <div className="text-3xl font-bold text-primary">
                      {schoolProfile.foundedYear}
                    </div>
                    <div className="text-sm text-muted-foreground">Tahun Berdiri</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6 text-center">
                    <History className="h-8 w-8 text-primary mx-auto mb-2" />
                    <div className="text-3xl font-bold text-primary">
                      {yearsEstablished}+
                    </div>
                    <div className="text-sm text-muted-foreground">Tahun Pengalaman</div>
                  </CardContent>
                </Card>
                {schoolProfile?.accreditation && (
                  <Card>
                    <CardContent className="pt-6 text-center">
                      <Award className="h-8 w-8 text-primary mx-auto mb-2" />
                      <div className="text-3xl font-bold text-primary">
                        {schoolProfile.accreditation}
                      </div>
                      <div className="text-sm text-muted-foreground">Akreditasi</div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </section>
        )}

        {/* History Content */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <History className="h-6 w-6 text-primary" />
                </div>
                <h2 className="text-2xl md:text-3xl font-bold">Perjalanan Kami</h2>
              </div>
              
              <div className="prose prose-lg max-w-none">
                {schoolProfile?.history ? (
                  <div className="text-muted-foreground leading-relaxed whitespace-pre-line">
                    {schoolProfile.history}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <History className="h-16 w-16 text-muted-foreground/30 mx-auto mb-4" />
                    <p className="text-muted-foreground">
                      Sejarah sekolah belum tersedia. Silakan tambahkan melalui panel admin.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>
  );
}
