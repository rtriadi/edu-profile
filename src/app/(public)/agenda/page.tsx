import { Metadata } from "next";
import Link from "next/link";
import { format } from "date-fns";
import { id as localeId } from "date-fns/locale";
import { Calendar, MapPin, ChevronLeft, ChevronRight } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getEvents, getUpcomingEvents } from "@/actions/events";

export const metadata: Metadata = {
  title: "Agenda & Kegiatan",
  description: "Kalender kegiatan dan agenda sekolah",
};

export default async function AgendaPage() {
  const { data: events } = await getEvents({ isPublished: true, limit: 20 });
  const upcomingEvents = await getUpcomingEvents(5);

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

  const getTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      ACADEMIC: "bg-blue-500",
      HOLIDAY: "bg-green-500",
      EXAM: "bg-red-500",
      CEREMONY: "bg-purple-500",
      COMPETITION: "bg-yellow-500",
      MEETING: "bg-gray-500",
      OTHER: "bg-slate-500",
    };
    return colors[type] || "bg-gray-500";
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Agenda & Kegiatan</h1>
        <p className="text-muted-foreground">
          Kalender kegiatan dan agenda sekolah
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Upcoming Events */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Kegiatan Mendatang</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {upcomingEvents.length > 0 ? (
                upcomingEvents.map((event) => (
                  <Link
                    key={event.id}
                    href={`/agenda/${event.slug}`}
                    className="block p-3 rounded-lg hover:bg-muted transition-colors"
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={`w-2 h-2 mt-2 rounded-full ${getTypeColor(event.type)}`}
                      />
                      <div>
                        <p className="font-medium">{event.title}</p>
                        <p className="text-sm text-muted-foreground">
                          {format(new Date(event.startDate), "d MMMM yyyy", {
                            locale: localeId,
                          })}
                        </p>
                      </div>
                    </div>
                  </Link>
                ))
              ) : (
                <p className="text-muted-foreground text-center py-4">
                  Tidak ada kegiatan mendatang
                </p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* All Events */}
        <div className="lg:col-span-2">
          <h2 className="text-xl font-semibold mb-4">Semua Kegiatan</h2>
          
          {events.length > 0 ? (
            <div className="space-y-4">
              {events.map((event) => (
                <Link key={event.id} href={`/agenda/${event.slug}`}>
                  <Card className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge className={`${getTypeColor(event.type)} text-white`}>
                              {getTypeLabel(event.type)}
                            </Badge>
                          </div>
                          <h3 className="font-semibold text-lg mb-1">
                            {event.title}
                          </h3>
                          {event.description && (
                            <p className="text-muted-foreground text-sm line-clamp-2 mb-2">
                              {event.description}
                            </p>
                          )}
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              <span>
                                {format(new Date(event.startDate), "d MMM yyyy", {
                                  locale: localeId,
                                })}
                                {event.endDate && (
                                  <>
                                    {" - "}
                                    {format(new Date(event.endDate), "d MMM yyyy", {
                                      locale: localeId,
                                    })}
                                  </>
                                )}
                              </span>
                            </div>
                            {event.location && (
                              <div className="flex items-center gap-1">
                                <MapPin className="h-4 w-4" />
                                <span>{event.location}</span>
                              </div>
                            )}
                          </div>
                        </div>
                        <div
                          className="w-3 h-16 rounded-full"
                          style={{ backgroundColor: event.color || "#3B82F6" }}
                        />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="py-12 text-center text-muted-foreground">
                <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Belum ada kegiatan</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
