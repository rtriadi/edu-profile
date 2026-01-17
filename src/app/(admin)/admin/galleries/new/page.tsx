import { Metadata } from "next";
import { GalleryForm } from "@/components/admin/galleries/gallery-form";

export const metadata: Metadata = {
  title: "Tambah Galeri - Admin",
};

export default function NewGalleryPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Tambah Galeri Baru</h1>
        <p className="text-muted-foreground">
          Buat album foto atau video baru
        </p>
      </div>

      <GalleryForm />
    </div>
  );
}
