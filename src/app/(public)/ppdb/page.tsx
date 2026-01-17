import { Metadata } from "next";
import Link from "next/link";
import { Calendar, CheckCircle, FileText, Clock, Users, ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { prisma } from "@/lib/prisma";
import { formatDate } from "@/lib/utils";
import { PublicHeader } from "@/components/public/header";
import { PublicFooter } from "@/components/public/footer";

export const metadata: Metadata = {
  title: "PPDB Online",
  description: "Pendaftaran Peserta Didik Baru Online",
};

async function getPPDBData() {
  const [activePeriod, schoolProfile] = await Promise.all([
    prisma.pPDBPeriod.findFirst({
      where: { isActive: true },
      orderBy: { createdAt: "desc" },
    }),
    prisma.schoolProfile.findFirst(),
  ]);

  return { activePeriod, schoolProfile };
}

export default async function PPDBPage() {
  const { activePeriod, schoolProfile } = await getPPDBData();

  const requirements = activePeriod?.requirements as string[] | null;
  const stages = activePeriod?.stages as Array<{
    name: string;
    startDate: string;
    endDate: string;
    description?: string;
  }> | null;

  const isOpen = activePeriod && 
    new Date() >= new Date(activePeriod.startDate) && 
    new Date() <= new Date(activePeriod.endDate);

  return (
    <>
      <PublicHeader />

      <main className="flex-1">
        {/* Hero */}
        <section className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground py-16">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-3xl md:text-5xl font-bold mb-4">
              Penerimaan Peserta Didik Baru
            </h1>
            <p className="text-xl text-primary-foreground/90 mb-6">
              {activePeriod?.name || `Tahun Ajaran ${new Date().getFullYear()}/${new Date().getFullYear() + 1}`}
            </p>
            {activePeriod && (
              <Badge variant="secondary" className="text-lg px-4 py-2">
                {isOpen ? (
                  <>
                    <CheckCircle className="h-5 w-5 mr-2 inline" />
                    Pendaftaran Dibuka
                  </>
                ) : new Date() < new Date(activePeriod.startDate) ? (
                  <>
                    <Clock className="h-5 w-5 mr-2 inline" />
                    Segera Dibuka
                  </>
                ) : (
                  <>
                    <Clock className="h-5 w-5 mr-2 inline" />
                    Pendaftaran Ditutup
                  </>
                )}
              </Badge>
            )}
          </div>
        </section>

        <div className="container mx-auto px-4 py-12">
          {!activePeriod ? (
            <Card className="max-w-2xl mx-auto text-center">
              <CardContent className="py-12">
                <Calendar className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h2 className="text-2xl font-bold mb-2">Belum Ada Periode Aktif</h2>
                <p className="text-muted-foreground mb-6">
                  Saat ini belum ada periode pendaftaran yang aktif. Silakan hubungi kami untuk informasi lebih lanjut.
                </p>
                <Button asChild>
                  <Link href="/kontak">Hubungi Kami</Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Main Content */}
              <div className="lg:col-span-2 space-y-8">
                {/* Info */}
                <Card>
                  <CardHeader>
                    <CardTitle>Informasi Pendaftaran</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="flex items-center gap-3 p-4 bg-muted rounded-lg">
                        <Calendar className="h-8 w-8 text-primary" />
                        <div>
                          <p className="text-sm text-muted-foreground">Periode Pendaftaran</p>
                          <p className="font-semibold">
                            {formatDate(activePeriod.startDate)} - {formatDate(activePeriod.endDate)}
                          </p>
                        </div>
                      </div>
                      {activePeriod.quota && (
                        <div className="flex items-center gap-3 p-4 bg-muted rounded-lg">
                          <Users className="h-8 w-8 text-primary" />
                          <div>
                            <p className="text-sm text-muted-foreground">Kuota Penerimaan</p>
                            <p className="font-semibold">{activePeriod.quota} Siswa</p>
                          </div>
                        </div>
                      )}
                    </div>
                    {activePeriod.description && (
                      <p className="text-muted-foreground">
                        {activePeriod.description}
                      </p>
                    )}
                  </CardContent>
                </Card>

                {/* Requirements */}
                {requirements && requirements.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <FileText className="h-5 w-5" />
                        Persyaratan Pendaftaran
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-3">
                        {requirements.map((req, index) => (
                          <li key={index} className="flex items-start gap-3">
                            <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                            <span>{req}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                )}

                {/* Stages */}
                {stages && stages.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Clock className="h-5 w-5" />
                        Tahapan Pendaftaran
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {stages.map((stage, index) => (
                          <div key={index} className="flex gap-4">
                            <div className="flex flex-col items-center">
                              <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm">
                                {index + 1}
                              </div>
                              {index < stages.length - 1 && (
                                <div className="w-0.5 h-full bg-border mt-2" />
                              )}
                            </div>
                            <div className="flex-1 pb-4">
                              <h4 className="font-semibold">{stage.name}</h4>
                              <p className="text-sm text-muted-foreground">
                                {formatDate(stage.startDate)} - {formatDate(stage.endDate)}
                              </p>
                              {stage.description && (
                                <p className="text-sm mt-1">{stage.description}</p>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* CTA */}
                <Card className="bg-primary text-primary-foreground">
                  <CardContent className="py-8 text-center">
                    <h3 className="text-xl font-bold mb-4">Daftar Sekarang</h3>
                    <p className="text-primary-foreground/90 mb-6 text-sm">
                      Bergabunglah bersama {schoolProfile?.name || "kami"} untuk masa depan yang lebih cerah
                    </p>
                    {isOpen ? (
                      <Button variant="secondary" size="lg" className="w-full" asChild>
                        <Link href="/ppdb/daftar">
                          Mulai Pendaftaran
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                      </Button>
                    ) : (
                      <Button variant="secondary" size="lg" className="w-full" disabled>
                        Pendaftaran Belum Dibuka
                      </Button>
                    )}
                  </CardContent>
                </Card>

                {/* Contact */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Butuh Bantuan?</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3 text-sm">
                    <p className="text-muted-foreground">
                      Jika Anda memiliki pertanyaan tentang proses pendaftaran, silakan hubungi kami.
                    </p>
                    <Button variant="outline" className="w-full" asChild>
                      <Link href="/kontak">Hubungi Kami</Link>
                    </Button>
                  </CardContent>
                </Card>

                {/* Download */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Download</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <Button variant="outline" className="w-full justify-start" asChild>
                      <a href="#" download>
                        <FileText className="mr-2 h-4 w-4" />
                        Brosur Sekolah
                      </a>
                    </Button>
                    <Button variant="outline" className="w-full justify-start" asChild>
                      <a href="#" download>
                        <FileText className="mr-2 h-4 w-4" />
                        Formulir Pendaftaran
                      </a>
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </div>
      </main>

      <PublicFooter />
    </>
  );
}
