import { Metadata } from "next";
import { ProgramForm } from "@/components/admin/programs/program-form";

export const metadata: Metadata = {
  title: "Tambah Program - Admin",
};

export default function NewProgramPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Tambah Program Baru</h1>
        <p className="text-muted-foreground">
          Buat program akademik baru
        </p>
      </div>

      <ProgramForm />
    </div>
  );
}
