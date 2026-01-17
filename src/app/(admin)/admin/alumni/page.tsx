import { Metadata } from "next";
import Link from "next/link";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { AlumniTable } from "@/components/admin/alumni/alumni-table";
import { getAlumni } from "@/actions/alumni";

export const metadata: Metadata = {
  title: "Alumni - Admin",
};

export default async function AlumniPage() {
  const { data: alumni } = await getAlumni({ limit: 50 });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Alumni</h1>
          <p className="text-muted-foreground">
            Kelola data alumni sekolah
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/alumni/new">
            <Plus className="h-4 w-4 mr-2" />
            Tambah Alumni
          </Link>
        </Button>
      </div>

      <AlumniTable alumni={alumni} />
    </div>
  );
}
