import { Metadata } from "next";
import Link from "next/link";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Prestasi",
  description: "Kelola prestasi sekolah dan siswa",
};

export default function AchievementsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Prestasi</h1>
          <p className="text-muted-foreground">
            Kelola prestasi sekolah dan siswa
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/achievements/new">
            <Plus className="mr-2 h-4 w-4" />
            Tambah Prestasi
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Daftar Prestasi</CardTitle>
          <CardDescription>
            Prestasi akademik, olahraga, dan seni siswa maupun sekolah
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-8">
            Belum ada data prestasi. Klik tombol "Tambah Prestasi" untuk menambahkan.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
