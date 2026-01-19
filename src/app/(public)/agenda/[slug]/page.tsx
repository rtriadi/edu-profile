import { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { format } from "date-fns";
import { id as localeId } from "date-fns/locale";
import { ArrowLeft, Calendar, MapPin, Clock } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { prisma } from "@/lib/prisma";

// Dynamic rendering - prevents build-time database errors on Vercel
export const revalidate = 60;

interface EventDetailPageProps {
  params: Promise<{ slug: string }>;
}

async function getEventBySlug(slug: string) {
  try {
    return await prisma.event.findUnique({
      where: { slug },
    });
  } catch (error) {
    console.error("Error fetching event:", error);
    return null;
  }
}

export async function generateMetadata({
  params,
}: EventDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const event = await getEventBySlug(slug);

  if (!event) {
    return { title: "Kegiatan Tidak Ditemukan" };
  }

  return {
    title: event.title,
    description: event.description || `Kegiatan: ${event.title}`,
    openGraph: {
      images: event.image ? [event.image] : [],
    },
  };
}

export default async function EventDetailPage({ params }: EventDetailPageProps) {
  const { slug } = await params;
  const event = await getEventBySlug(slug);

  if (!event || !event.isPublished) {
    notFound();
  }

  const getTypeLabel = (type: string) => {
    const types: Record<string, string> = {
      ACADEMIC: "Akademik",
      HOLIDAY: "Libur",
      EXAM: "Ujian",
      CEREMONY: "Upacara",
      COMPETITION: "Lomba",
      MEETING: "Rapat",
      OTHER: "Lainnya",
    };
    return types[type] || type;
  };

  return (
    <main className="flex-1">
      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <Button variant="ghost" asChild className="mb-6">
          <Link href="/agenda">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Kembali ke Agenda
          </Link>
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {event.image && (
              <div className="relative h-64 md:h-80 rounded-lg overflow-hidden mb-6">
                <Image
                  src={event.image}
                  alt={event.title}
                  fill
                  className="object-cover"
                />
              </div>
            )}

            <Badge
              className="mb-4"
              style={{ backgroundColor: event.color || "#3B82F6" }}
            >
              {getTypeLabel(event.type)}
            </Badge>

            <h1 className="text-3xl font-bold mb-4">{event.title}</h1>

            {event.description && (
              <div className="prose prose-lg max-w-none">
                <p>{event.description}</p>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-muted/50 rounded-lg p-6 space-y-4">
              <h3 className="font-semibold">Detail Kegiatan</h3>

              <div className="flex items-start gap-3">
                <Calendar className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <p className="font-medium">Tanggal</p>
                  <p className="text-muted-foreground">
                    {format(new Date(event.startDate), "EEEE, d MMMM yyyy", {
                      locale: localeId,
                    })}
                    {event.endDate && (
                      <>
                        <br />
                        s/d{" "}
                        {format(new Date(event.endDate), "EEEE, d MMMM yyyy", {
                          locale: localeId,
                        })}
                      </>
                    )}
                  </p>
                </div>
              </div>

              {!event.isAllDay && (
                <div className="flex items-start gap-3">
                  <Clock className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <p className="font-medium">Waktu</p>
                    <p className="text-muted-foreground">
                      {format(new Date(event.startDate), "HH:mm")} WIB
                      {event.endDate && (
                        <> - {format(new Date(event.endDate), "HH:mm")} WIB</>
                      )}
                    </p>
                  </div>
                </div>
              )}

              {event.location && (
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <p className="font-medium">Lokasi</p>
                    <p className="text-muted-foreground">{event.location}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
