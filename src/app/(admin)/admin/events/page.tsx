import { Metadata } from "next";
import Link from "next/link";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { EventTable } from "@/components/admin/events/event-table";
import { getEvents } from "@/actions/events";

export const metadata: Metadata = {
  title: "Agenda & Kegiatan - Admin",
};

export default async function EventsPage() {
  const { data: events } = await getEvents({ limit: 50 });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Agenda & Kegiatan</h1>
          <p className="text-muted-foreground">
            Kelola kalender kegiatan sekolah
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/events/new">
            <Plus className="h-4 w-4 mr-2" />
            Tambah Kegiatan
          </Link>
        </Button>
      </div>

      <EventTable events={events} />
    </div>
  );
}
