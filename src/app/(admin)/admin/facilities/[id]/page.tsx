import { Metadata } from "next";
import { notFound } from "next/navigation";
import { FacilityForm } from "@/components/admin/facilities/facility-form";
import { getFacilityById } from "@/actions/facilities";

export const metadata: Metadata = {
  title: "Edit Fasilitas - Admin",
};

interface EditFacilityPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditFacilityPage({ params }: EditFacilityPageProps) {
  const { id } = await params;
  const facility = await getFacilityById(id);

  if (!facility) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Edit Fasilitas</h1>
        <p className="text-muted-foreground">
          Edit fasilitas: {facility.name}
        </p>
      </div>

      <FacilityForm facility={facility} />
    </div>
  );
}
