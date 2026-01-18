import { Metadata } from "next";
import { MapPin, Phone, Mail, Clock } from "lucide-react";
import { unstable_cache } from "next/cache";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { prisma } from "@/lib/prisma";
import { ContactForm } from "@/components/public/contact-form";

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

// Cache the contact data to avoid connection pool issues during build
const getContactData = unstable_cache(
  async () => {
    try {
      const schoolProfile = await prisma.schoolProfile.findFirst();
      return schoolProfile;
    } catch (error) {
      console.error("Error fetching contact data:", error);
      return null;
    }
  },
  ["contact-page-data"],
  { revalidate: 60, tags: ["school-profile"] }
);

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

  if (hours.friday) result.push({ day: "Jumat", hours: hours.friday });
  if (hours.saturday) result.push({ day: "Sabtu", hours: hours.saturday });
  
  result.push({ 
    day: "Minggu", 
    hours: hours.sunday || "Tutup" 
  });

  // If no hours set, return defaults
  if (result.length === 1) {
    return [
      { day: "Senin - Jumat", hours: "07:00 - 15:00" },
      { day: "Sabtu", hours: "07:00 - 12:00" },
      { day: "Minggu", hours: "Tutup" },
    ];
  }

  return result;
}

export default async function KontakPage() {
  const schoolProfile = await getContactData();
  const operatingHours = getOperatingHoursDisplay(
    schoolProfile?.operatingHours as OperatingHours | null
  );

  return (
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
                    {operatingHours.map((item) => (
                      <p key={item.day}>
                        {item.day}: {item.hours}
                      </p>
                    ))}
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
                      src={`https://maps.google.com/maps?q=${schoolProfile.latitude},${schoolProfile.longitude}&z=19&output=embed`}
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      allowFullScreen
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      title="Lokasi Sekolah"
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </main>
  );
}
