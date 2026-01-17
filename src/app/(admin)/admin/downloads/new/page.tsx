import { Metadata } from "next";
import { DownloadForm } from "@/components/admin/downloads/download-form";

export const metadata: Metadata = {
  title: "Tambah File - Admin",
};

export default function NewDownloadPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Tambah File Baru</h1>
        <p className="text-muted-foreground">
          Tambahkan file untuk diunduh
        </p>
      </div>

      <DownloadForm />
    </div>
  );
}
