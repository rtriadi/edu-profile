import { Metadata } from "next";
import { UserForm } from "@/components/admin/users/user-form";

export const metadata: Metadata = {
  title: "Tambah Pengguna",
  description: "Tambah pengguna baru",
};

export default function NewUserPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Tambah Pengguna</h1>
        <p className="text-muted-foreground">
          Buat pengguna baru untuk mengakses panel admin
        </p>
      </div>

      <UserForm />
    </div>
  );
}
