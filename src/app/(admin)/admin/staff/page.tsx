import { Metadata } from "next";
import Link from "next/link";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { getStaff } from "@/actions/staff";
import { StaffTable } from "@/components/admin/staff/staff-table";
import { SearchInput } from "@/components/admin/search-input";

export const metadata: Metadata = {
  title: "Guru & Staff",
  description: "Kelola data guru dan staff sekolah",
};

interface StaffPageProps {
  searchParams: Promise<{
    page?: string;
    search?: string;
  }>;
}

export default async function StaffPage({ searchParams }: StaffPageProps) {
  const params = await searchParams;
  const page = Number(params.page) || 1;

  const { data: staff, pagination } = await getStaff({
    page,
    limit: 10,
    search: params.search,
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Guru & Staff</h1>
          <p className="text-muted-foreground">
            Kelola data guru, staff, dan struktural sekolah
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/staff/new">
            <Plus className="mr-2 h-4 w-4" />
            Tambah Staff
          </Link>
        </Button>
      </div>

      <div className="flex items-center gap-4">
        <SearchInput placeholder="Cari guru/staff..." className="max-w-sm" />
      </div>

      <StaffTable staff={staff} pagination={pagination} />
    </div>
  );
}
