import { Metadata } from "next";
import { notFound } from "next/navigation";
import { GalleryForm } from "@/components/admin/galleries/gallery-form";
import { getGalleryById } from "@/actions/galleries";

export const metadata: Metadata = {
  title: "Edit Galeri - Admin",
};

interface EditGalleryPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditGalleryPage({ params }: EditGalleryPageProps) {
  const { id } = await params;
  const gallery = await getGalleryById(id);

  if (!gallery) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Edit Galeri</h1>
        <p className="text-muted-foreground">
          Edit album: {gallery.title}
        </p>
      </div>

      <GalleryForm gallery={gallery} />
    </div>
  );
}
