import { Metadata } from "next";
import Image from "next/image";
import { Users, GraduationCap, UserCheck, Building } from "lucide-react";


import { Card, CardContent } from "@/components/ui/card";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Struktur Organisasi",
  description: "Struktur organisasi sekolah kami",
};

async function getStrukturData() {
  try {
    const [schoolProfile, leadership] = await Promise.all([
      prisma.schoolProfile.findFirst({
        select: { name: true },
      }),
      prisma.staff.findMany({
        where: { isActive: true },
        orderBy: { order: "asc" },
        take: 10,
      }),
    ]);
    return { schoolProfile, leadership };
  } catch (error) {
    console.error("Error fetching struktur data:", error);
    return { schoolProfile: null, leadership: [] };
  }
}

export default async function StrukturPage() {
  const { schoolProfile, leadership } = await getStrukturData();

  // Group staff by position type
  const kepalaSekolah = leadership.find(
    (s) => s.position?.toLowerCase().includes("kepala sekolah")
  );
  const wakilKepala = leadership.filter(
    (s) => s.position?.toLowerCase().includes("wakil")
  );
  const otherLeadership = leadership.filter(
    (s) =>
      !s.position?.toLowerCase().includes("kepala sekolah") &&
      !s.position?.toLowerCase().includes("wakil")
  );

  return (
    <main className="flex-1">
      {/* Hero */}
      <section className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-5xl font-bold mb-4">
            Struktur Organisasi
          </h1>
          <p className="text-xl text-primary-foreground/90 max-w-2xl mx-auto">
            Struktur kepemimpinan {schoolProfile?.name || "sekolah kami"}
          </p>
        </div>
      </section>

      {/* Organization Chart */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            {/* Kepala Sekolah */}
            {kepalaSekolah && (
              <div className="flex justify-center mb-12">
                <Card className="w-72 text-center border-primary border-2">
                  <CardContent className="pt-6">
                    {kepalaSekolah.photo ? (
                      <div className="relative w-24 h-24 rounded-full overflow-hidden mx-auto mb-4 ring-4 ring-primary/20">
                        <Image
                          src={kepalaSekolah.photo}
                          alt={kepalaSekolah.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                    ) : (
                      <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                        <GraduationCap className="h-10 w-10 text-primary" />
                      </div>
                    )}
                    <h3 className="font-bold text-lg">{kepalaSekolah.name}</h3>
                    <p className="text-sm text-primary font-medium">
                      {kepalaSekolah.position}
                    </p>
                    {kepalaSekolah.nip && (
                      <p className="text-xs text-muted-foreground mt-1">
                        NIP: {kepalaSekolah.nip}
                      </p>
                    )}
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Connector Line */}
            {kepalaSekolah && wakilKepala.length > 0 && (
              <div className="flex justify-center mb-8">
                <div className="w-0.5 h-12 bg-border"></div>
              </div>
            )}

            {/* Wakil Kepala */}
            {wakilKepala.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                {wakilKepala.map((staff) => (
                  <Card key={staff.id} className="text-center">
                    <CardContent className="pt-6">
                      {staff.photo ? (
                        <div className="relative w-20 h-20 rounded-full overflow-hidden mx-auto mb-4">
                          <Image
                            src={staff.photo}
                            alt={staff.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                      ) : (
                        <div className="w-20 h-20 rounded-full bg-secondary/10 flex items-center justify-center mx-auto mb-4">
                          <UserCheck className="h-8 w-8 text-secondary" />
                        </div>
                      )}
                      <h3 className="font-semibold">{staff.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {staff.position}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {/* Other Leadership */}
            {otherLeadership.length > 0 && (
              <>
                <h2 className="text-xl font-bold text-center mb-6">
                  Pimpinan Lainnya
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {otherLeadership.map((staff) => (
                    <Card key={staff.id} className="text-center">
                      <CardContent className="pt-4 pb-4">
                        {staff.photo ? (
                          <div className="relative w-16 h-16 rounded-full overflow-hidden mx-auto mb-3">
                            <Image
                              src={staff.photo}
                              alt={staff.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                        ) : (
                          <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-3">
                            <Users className="h-6 w-6 text-muted-foreground" />
                          </div>
                        )}
                        <h3 className="font-medium text-sm">{staff.name}</h3>
                        <p className="text-xs text-muted-foreground">
                          {staff.position}
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </>
            )}

            {/* Empty State */}
            {leadership.length === 0 && (
              <div className="text-center py-12">
                <Building className="h-16 w-16 text-muted-foreground/30 mx-auto mb-4" />
                <p className="text-muted-foreground">
                  Data struktur organisasi belum tersedia.
                </p>
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
