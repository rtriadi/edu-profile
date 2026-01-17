import { Metadata } from "next";
import Link from "next/link";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { DownloadTable } from "@/components/admin/downloads/download-table";
import { getDownloads } from "@/actions/downloads";

export const metadata: Metadata = {
  title: "Pusat Unduhan - Admin",
};

export default async function DownloadsPage() {
  const { data: downloads } = await getDownloads({ limit: 50 });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Pusat Unduhan</h1>
          <p className="text-muted-foreground">
            Kelola file yang dapat diunduh
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/downloads/new">
            <Plus className="h-4 w-4 mr-2" />
            Tambah File
          </Link>
        </Button>
      </div>

      <DownloadTable downloads={downloads} />
    </div>
  );
}
