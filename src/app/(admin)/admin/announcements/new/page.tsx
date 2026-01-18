import { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";
import { AnnouncementForm } from "@/components/admin/announcements/announcement-form";

export const metadata: Metadata = {
  title: "Tambah Pengumuman",
  description: "Buat pengumuman baru",
};

export default function NewAnnouncementPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/admin/announcements">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Tambah Pengumuman</h1>
          <p className="text-muted-foreground">
            Buat pengumuman atau banner baru
          </p>
        </div>
      </div>

      <AnnouncementForm />
    </div>
  );
}
