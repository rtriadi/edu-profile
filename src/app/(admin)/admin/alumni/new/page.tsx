import { Metadata } from "next";
import { AlumniForm } from "@/components/admin/alumni/alumni-form";

export const metadata: Metadata = {
  title: "Tambah Alumni - Admin",
};

export default function NewAlumniPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Tambah Alumni Baru</h1>
        <p className="text-muted-foreground">
          Tambahkan data alumni baru
        </p>
      </div>

      <AlumniForm />
    </div>
  );
}
