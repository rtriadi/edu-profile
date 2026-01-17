import { Metadata } from "next";
import { StaffForm } from "@/components/admin/staff/staff-form";

export const metadata: Metadata = {
  title: "Tambah Staff",
  description: "Tambah guru atau staff baru",
};

export default function NewStaffPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Tambah Staff</h1>
        <p className="text-muted-foreground">
          Tambahkan data guru atau staff baru ke sistem
        </p>
      </div>

      <StaffForm />
    </div>
  );
}
