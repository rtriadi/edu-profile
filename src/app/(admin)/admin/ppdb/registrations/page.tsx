import { Metadata } from "next";

import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { getPPDBRegistrations, getPPDBPeriods } from "@/actions/ppdb";
import { RegistrationsTable } from "@/components/admin/ppdb/registrations-table";
import { ExportButton } from "@/components/admin/ppdb/export-button";
import { SearchInput } from "@/components/admin/search-input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PPDBStatus } from "@prisma/client";

export const metadata: Metadata = {
  title: "Data Pendaftaran PPDB",
  description: "Kelola data pendaftaran peserta didik baru",
};

interface PPDBRegistrationsPageProps {
  searchParams: Promise<{
    page?: string;
    search?: string;
    periodId?: string;
    status?: string;
  }>;
}

export default async function PPDBRegistrationsPage({ searchParams }: PPDBRegistrationsPageProps) {
  const params = await searchParams;
  const page = Number(params.page) || 1;
  const periodId = params.periodId || "";
  const status = params.status || "";
  const search = params.search || "";

  const [registrationsData, periodsData] = await Promise.all([
    getPPDBRegistrations({ 
      page, 
      limit: 10,
      periodId: periodId || undefined,
      status: status || undefined,
      search: search || undefined
    }),
    getPPDBPeriods({ limit: 100 })
  ]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Data Pendaftaran</h1>
          <p className="text-muted-foreground">
            Kelola data calon peserta didik yang telah mendaftar
          </p>
        </div>
        <ExportButton periodId={periodId} />
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <SearchInput placeholder="Cari nama, email, atau no reg..." className="w-full md:w-64" />
        
        {/* Period Filter - We need a client component for filters to update URL */}
        {/* For now, just showing structure, filters logic similar to posts */}
      </div>

      <Card>
        <CardHeader className="px-6 py-4 border-b">
          <CardTitle className="text-base">Daftar Pendaftar</CardTitle>
        </CardHeader>
        <div className="p-0">
          <RegistrationsTable 
            registrations={registrationsData.data} 
            pagination={registrationsData.pagination} 
          />
        </div>
      </Card>
    </div>
  );
}
