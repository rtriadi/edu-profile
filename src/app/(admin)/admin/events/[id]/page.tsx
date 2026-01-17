import { Metadata } from "next";
import { notFound } from "next/navigation";
import { EventForm } from "@/components/admin/events/event-form";
import { getEventById } from "@/actions/events";

export const metadata: Metadata = {
  title: "Edit Kegiatan - Admin",
};

interface EditEventPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditEventPage({ params }: EditEventPageProps) {
  const { id } = await params;
  const event = await getEventById(id);

  if (!event) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Edit Kegiatan</h1>
        <p className="text-muted-foreground">
          Edit kegiatan: {event.title}
        </p>
      </div>

      <EventForm event={event} />
    </div>
  );
}
