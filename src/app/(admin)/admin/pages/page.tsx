import { Metadata } from "next";
import Link from "next/link";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { getPages } from "@/actions/pages";
import { PagesTable } from "@/components/admin/pages/pages-table";
import { SearchInput } from "@/components/admin/search-input";

export const metadata: Metadata = {
  title: "Halaman",
  description: "Kelola halaman website",
};

interface PagesPageProps {
  searchParams: Promise<{
    page?: string;
    search?: string;
    status?: string;
  }>;
}

export default async function PagesPage({ searchParams }: PagesPageProps) {
  const params = await searchParams;
  const page = Number(params.page) || 1;

  const { data: pages, pagination } = await getPages({
    page,
    limit: 10,
    search: params.search,
    status: params.status as "DRAFT" | "PUBLISHED" | "ARCHIVED" | undefined,
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Halaman</h1>
          <p className="text-muted-foreground">
            Kelola halaman statis website dengan page builder
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/pages/new">
            <Plus className="mr-2 h-4 w-4" />
            Buat Halaman
          </Link>
        </Button>
      </div>

      <div className="flex items-center gap-4">
        <SearchInput placeholder="Cari halaman..." className="max-w-sm" />
      </div>

      <PagesTable pages={pages} pagination={pagination} />
    </div>
  );
}
