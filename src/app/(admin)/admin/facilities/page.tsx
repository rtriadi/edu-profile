import { Metadata } from "next";
import Link from "next/link";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { FacilityTable } from "@/components/admin/facilities/facility-table";
import { getFacilities } from "@/actions/facilities";

export const metadata: Metadata = {
  title: "Fasilitas - Admin",
};

export default async function FacilitiesPage() {
  const { data: facilities } = await getFacilities({ limit: 50 });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Fasilitas</h1>
          <p className="text-muted-foreground">
            Kelola fasilitas sekolah
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/facilities/new">
            <Plus className="h-4 w-4 mr-2" />
            Tambah Fasilitas
          </Link>
        </Button>
      </div>

      <FacilityTable facilities={facilities} />
    </div>
  );
}
