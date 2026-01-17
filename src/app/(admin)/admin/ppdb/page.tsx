import { Metadata } from "next";
import Link from "next/link";
import { Plus, Calendar } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const metadata: Metadata = {
  title: "PPDB Online",
  description: "Kelola Penerimaan Peserta Didik Baru",
};

export default function PPDBPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">PPDB Online</h1>
          <p className="text-muted-foreground">
            Kelola Penerimaan Peserta Didik Baru
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/ppdb/new">
            <Plus className="mr-2 h-4 w-4" />
            Buat Periode PPDB
          </Link>
        </Button>
      </div>

      <Tabs defaultValue="periods" className="space-y-6">
        <TabsList>
          <TabsTrigger value="periods" className="gap-2">
            <Calendar className="h-4 w-4" />
            Periode PPDB
          </TabsTrigger>
          <TabsTrigger value="registrations" className="gap-2">
            Pendaftaran
          </TabsTrigger>
        </TabsList>

        <TabsContent value="periods">
          <Card>
            <CardHeader>
              <CardTitle>Periode PPDB</CardTitle>
              <CardDescription>
                Kelola periode penerimaan peserta didik baru
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-center py-8">
                Belum ada periode PPDB. Klik tombol "Buat Periode PPDB" untuk memulai.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="registrations">
          <Card>
            <CardHeader>
              <CardTitle>Data Pendaftaran</CardTitle>
              <CardDescription>
                Daftar calon peserta didik yang telah mendaftar
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-center py-8">
                Belum ada data pendaftaran.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
