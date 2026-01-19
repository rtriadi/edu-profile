import { Metadata } from "next";
import { MapPin, Phone, Mail, Clock } from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { prisma } from "@/lib/prisma";
import { ContactForm } from "@/components/public/contact-form";
import { getSiteConfig } from "@/lib/site-config";
import { getTranslations, type Language } from "@/lib/translations";

// Dynamic rendering - prevents build-time database errors on Vercel
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Hubungi Kami",
  description: "Hubungi kami untuk informasi lebih lanjut",
};

// Type for operating hours
interface OperatingHours {
  monday?: string;
  tuesday?: string;
  wednesday?: string;
  thursday?: string;
  friday?: string;
  saturday?: string;
  sunday?: string;
}

// Fetch contact data
async function getContactData() {
  try {
    const schoolProfile = await prisma.schoolProfile.findFirst();
    return schoolProfile;
  } catch (error) {
    console.error("Error fetching contact data:", error);
    return null;
  }
}

// Helper to format operating hours for display
function getOperatingHoursDisplay(hours: OperatingHours | null) {
  if (!hours) {
    // Default hours if not set in database
    return [
      { day: "Senin - Jumat", hours: "07:00 - 15:00" },
      { day: "Sabtu", hours: "07:00 - 12:00" },
      { day: "Minggu", hours: "Tutup" },
    ];
  }

  const result = [];

  // Check if weekdays have the same hours
  const weekdayHours = hours.monday || "07:00 - 15:00";
  const allWeekdaysSame = 
    hours.monday === hours.tuesday &&
    hours.tuesday === hours.wednesday &&
    hours.wednesday === hours.thursday;

  if (allWeekdaysSame && hours.monday) {
    result.push({ day: "Senin - Kamis", hours: weekdayHours });
  } else {
    if (hours.monday) result.push({ day: "Senin", hours: hours.monday });
    if (hours.tuesday) result.push({ day: "Selasa", hours: hours.tuesday });
    if (hours.wednesday) result.push({ day: "Rabu", hours: hours.wednesday });
    if (hours.thursday) result.push({ day: "Kamis", hours: hours.thursday });
  }

  // Friday is usually different
  if (hours.friday) {
    result.push({ day: "Jumat", hours: hours.friday });
  } else {
    result.push({ day: "Jumat", hours: "07:00 - 11:30" });
  }

  // Weekend
  if (hours.saturday) {
    result.push({ day: "Sabtu", hours: hours.saturday });
  } else {
    result.push({ day: "Sabtu", hours: "07:00 - 12:00" });
  }

  if (hours.sunday && hours.sunday !== "Tutup") {
    result.push({ day: "Minggu", hours: hours.sunday });
  } else {
    result.push({ day: "Minggu", hours: "Tutup" });
  }

  return result;
}

export default async function KontakPage() {
  const [schoolProfile, siteConfig] = await Promise.all([
    getContactData(),
    getSiteConfig(),
  ]);

  const operatingHours = schoolProfile?.operatingHours as OperatingHours | null;
  const hoursDisplay = getOperatingHoursDisplay(operatingHours);
  const t = getTranslations(siteConfig.language as Language);

  return (
    <main className="flex-1">
      {/* Hero */}
      <section className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">{t.pages.contact.title}</h1>
          <p className="text-primary-foreground/80">
            {t.pages.contact.description}
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
          {/* Contact Info */}
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-bold mb-6">{t.pages.contact.getInTouch}</h2>
              <div className="grid gap-6">
                <Card>
                  <CardHeader className="flex flex-row items-center gap-4 space-y-0 pb-2">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                      <MapPin className="h-5 w-5" />
                    </div>
                    <CardTitle className="text-lg">{t.pages.contact.address}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      {schoolProfile?.address || "Alamat belum diatur"}
                    </p>
                  </CardContent>
                </Card>

                <div className="grid sm:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader className="flex flex-row items-center gap-4 space-y-0 pb-2">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                        <Phone className="h-5 w-5" />
                      </div>
                      <CardTitle className="text-lg">{t.pages.contact.phone}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground">
                        {schoolProfile?.phone || "-"}
                      </p>
                      {schoolProfile?.whatsapp && (
                        <p className="text-muted-foreground">
                          WA: {schoolProfile.whatsapp}
                        </p>
                      )}
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="flex flex-row items-center gap-4 space-y-0 pb-2">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                        <Mail className="h-5 w-5" />
                      </div>
                      <CardTitle className="text-lg">{t.pages.contact.email}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground text-sm break-all">
                        {schoolProfile?.email || "-"}
                      </p>
                    </CardContent>
                  </Card>
                </div>

                <Card>
                  <CardHeader className="flex flex-row items-center gap-4 space-y-0 pb-2">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                      <Clock className="h-5 w-5" />
                    </div>
                    <CardTitle className="text-lg">{t.pages.contact.operatingHours}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {hoursDisplay.map((item, index) => (
                        <div key={index} className="flex justify-between text-sm">
                          <span className="text-muted-foreground">{item.day}</span>
                          <span className="font-medium">{item.hours}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Map */}
            {schoolProfile?.latitude && schoolProfile?.longitude && (
              <div>
                <h2 className="text-2xl font-bold mb-6">{t.pages.contact.findUs}</h2>
                <div className="aspect-video bg-muted rounded-lg overflow-hidden relative">
                  {process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY ? (
                    <iframe
                      src={`https://www.google.com/maps/embed/v1/place?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY}&q=${schoolProfile.latitude},${schoolProfile.longitude}`}
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      allowFullScreen
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                    ></iframe>
                  ) : (
                    <iframe
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      loading="lazy"
                      allowFullScreen
                      src={`https://www.openstreetmap.org/export/embed.html?bbox=${schoolProfile.longitude - 0.005}%2C${schoolProfile.latitude - 0.005}%2C${schoolProfile.longitude + 0.005}%2C${schoolProfile.latitude + 0.005}&layer=mapnik&marker=${schoolProfile.latitude}%2C${schoolProfile.longitude}`}
                    ></iframe>
                  )}
                </div>
                {!process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY && (
                  <p className="text-xs text-muted-foreground mt-2 text-center">
                    <a 
                      href={`https://www.openstreetmap.org/?mlat=${schoolProfile.latitude}&mlon=${schoolProfile.longitude}#map=17/${schoolProfile.latitude}/${schoolProfile.longitude}`} 
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:underline"
                    >
                      Lihat peta lebih besar
                    </a>
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Contact Form */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>{t.pages.contact.sendMessage}</CardTitle>
                <CardDescription>
                  Silakan kirim pesan kepada kami jika ada pertanyaan atau masukan
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ContactForm />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </main>
  );
}