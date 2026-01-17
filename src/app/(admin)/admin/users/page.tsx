import { Metadata } from "next";
import Link from "next/link";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { getUsers } from "@/actions/users";
import { UsersTable } from "@/components/admin/users/users-table";
import { SearchInput } from "@/components/admin/search-input";

export const metadata: Metadata = {
  title: "Pengguna",
  description: "Kelola pengguna sistem",
};

interface UsersPageProps {
  searchParams: Promise<{
    page?: string;
    search?: string;
  }>;
}

export default async function UsersPage({ searchParams }: UsersPageProps) {
  const params = await searchParams;
  const page = Number(params.page) || 1;
  const search = params.search || "";

  const { data: users, pagination } = await getUsers({
    page,
    limit: 10,
    search,
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Pengguna</h1>
          <p className="text-muted-foreground">
            Kelola pengguna yang memiliki akses ke panel admin
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/users/new">
            <Plus className="mr-2 h-4 w-4" />
            Tambah Pengguna
          </Link>
        </Button>
      </div>

      <div className="flex items-center gap-4">
        <SearchInput placeholder="Cari pengguna..." className="max-w-sm" />
      </div>

      <UsersTable users={users} pagination={pagination} />
    </div>
  );
}
