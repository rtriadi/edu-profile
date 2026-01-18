import { Metadata } from "next";
import { GradeLevelForm } from "@/components/admin/grade-levels/grade-level-form";

export const metadata: Metadata = {
  title: "Tambah Kelas Baru",
  description: "Tambah kelas baru untuk pendaftaran",
};

export default function NewGradeLevelPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Tambah Kelas Baru</h1>
        <p className="text-muted-foreground">
          Tambahkan kelas baru yang dibuka untuk pendaftaran siswa
        </p>
      </div>
      <GradeLevelForm />
    </div>
  );
}
