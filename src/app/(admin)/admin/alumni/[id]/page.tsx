import { Metadata } from "next";
import { notFound } from "next/navigation";
import { AlumniForm } from "@/components/admin/alumni/alumni-form";
import { getAlumniById } from "@/actions/alumni";

export const metadata: Metadata = {
  title: "Edit Alumni - Admin",
};

interface EditAlumniPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditAlumniPage({ params }: EditAlumniPageProps) {
  const { id } = await params;
  const alumni = await getAlumniById(id);

  if (!alumni) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Edit Alumni</h1>
        <p className="text-muted-foreground">
          Edit data alumni: {alumni.name}
        </p>
      </div>

      <AlumniForm alumni={alumni} />
    </div>
  );
}
