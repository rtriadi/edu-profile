import { Metadata } from "next";
import Link from "next/link";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ProgramTable } from "@/components/admin/programs/program-table";
import { getPrograms } from "@/actions/programs";

export const metadata: Metadata = {
  title: "Program Akademik - Admin",
};

export default async function ProgramsPage() {
  const { data: programs } = await getPrograms({ limit: 50 });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Program Akademik</h1>
          <p className="text-muted-foreground">
            Kelola kurikulum, ekstrakurikuler, dan program unggulan
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/programs/new">
            <Plus className="h-4 w-4 mr-2" />
            Tambah Program
          </Link>
        </Button>
      </div>

      <ProgramTable programs={programs} />
    </div>
  );
}
