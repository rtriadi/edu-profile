import { Metadata } from "next";
import { EventForm } from "@/components/admin/events/event-form";

export const metadata: Metadata = {
  title: "Tambah Kegiatan - Admin",
};

export default function NewEventPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Tambah Kegiatan Baru</h1>
        <p className="text-muted-foreground">
          Buat kegiatan atau agenda baru
        </p>
      </div>

      <EventForm />
    </div>
  );
}
