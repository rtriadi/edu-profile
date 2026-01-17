import { Metadata } from "next";
import Link from "next/link";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { GalleryTable } from "@/components/admin/galleries/gallery-table";
import { getGalleries } from "@/actions/galleries";

export const metadata: Metadata = {
  title: "Galeri - Admin",
};

export default async function GalleriesPage() {
  const { data: galleries } = await getGalleries({ limit: 50 });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Galeri</h1>
          <p className="text-muted-foreground">
            Kelola album foto dan video
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/galleries/new">
            <Plus className="h-4 w-4 mr-2" />
            Tambah Galeri
          </Link>
        </Button>
      </div>

      <GalleryTable galleries={galleries} />
    </div>
  );
}
