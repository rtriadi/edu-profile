import { Metadata } from "next";
import { FacilityForm } from "@/components/admin/facilities/facility-form";

export const metadata: Metadata = {
  title: "Tambah Fasilitas - Admin",
};

export default function NewFacilityPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Tambah Fasilitas Baru</h1>
        <p className="text-muted-foreground">
          Tambahkan fasilitas sekolah baru
        </p>
      </div>

      <FacilityForm />
    </div>
  );
}
