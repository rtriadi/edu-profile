import { Metadata } from "next";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Data Pendaftaran PPDB",
  description: "Kelola data pendaftaran peserta didik baru",
};

export default function PPDBRegistrationsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Data Pendaftaran</h1>
        <p className="text-muted-foreground">
          Kelola data calon peserta didik yang telah mendaftar
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Daftar Pendaftar</CardTitle>
          <CardDescription>
            Filter dan kelola data pendaftaran PPDB
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-8">
            Belum ada data pendaftaran. Pastikan periode PPDB sudah aktif.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
