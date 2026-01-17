import { Metadata } from "next";
import { MapPin, Phone, Mail, Clock, Send } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { prisma } from "@/lib/prisma";
import { PublicHeader } from "@/components/public/header";
import { PublicFooter } from "@/components/public/footer";
import { ContactForm } from "@/components/public/contact-form";

export const metadata: Metadata = {
  title: "Hubungi Kami",
  description: "Hubungi kami untuk informasi lebih lanjut",
};

async function getContactData() {
  const schoolProfile = await prisma.schoolProfile.findFirst();
  return schoolProfile;
}

export default async function KontakPage() {
  const schoolProfile = await getContactData();

  return (
    <>
      <PublicHeader />

      <main className="flex-1">
        {/* Hero */}
        <section className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground py-12">
          <div className="container mx-auto px-4">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">Hubungi Kami</h1>
            <p className="text-primary-foreground/80">
              Kami siap membantu menjawab pertanyaan Anda
            </p>
          </div>
        </section>

        <div className="container mx-auto px-4 py-12">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Contact Info */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-primary" />
                    Alamat
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    {schoolProfile?.address || "Jl. Pendidikan No. 1, Jakarta"}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Phone className="h-5 w-5 text-primary" />
                    Telepon
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <p className="text-muted-foreground">
                    {schoolProfile?.phone || "(021) 1234567"}
                  </p>
                  {schoolProfile?.whatsapp && (
                    <p className="text-muted-foreground">
                      WhatsApp: {schoolProfile.whatsapp}
                    </p>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Mail className="h-5 w-5 text-primary" />
                    Email
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    {schoolProfile?.email || "info@sekolah.sch.id"}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-primary" />
                    Jam Operasional
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-1 text-muted-foreground text-sm">
                    <p>Senin - Jumat: 07:00 - 15:00</p>
                    <p>Sabtu: 07:00 - 12:00</p>
                    <p>Minggu: Tutup</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Kirim Pesan</CardTitle>
                  <CardDescription>
                    Isi formulir di bawah ini dan kami akan segera menghubungi Anda
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ContactForm />
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Map */}
          {schoolProfile?.latitude && schoolProfile?.longitude && (
            <div className="mt-12">
              <Card>
                <CardHeader>
                  <CardTitle>Lokasi Kami</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="aspect-video w-full">
                    <iframe
                      src={`https://www.google.com/maps/embed/v1/place?key=YOUR_API_KEY&q=${schoolProfile.latitude},${schoolProfile.longitude}`}
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      allowFullScreen
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </main>

      <PublicFooter />
    </>
  );
}
