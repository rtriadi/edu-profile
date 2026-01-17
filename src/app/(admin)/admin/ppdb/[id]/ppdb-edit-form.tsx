"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Save, ArrowLeft, Trash2 } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { updatePPDBPeriod, deletePPDBPeriod } from "@/actions/ppdb";

interface PPDBPeriod {
  id: string;
  name: string;
  academicYear: string;
  description: string | null;
  startDate: Date;
  endDate: Date;
  quota: number | null;
  requirements: unknown;
  isActive: boolean;
}

export function PPDBPeriodEditForm({ period }: { period: PPDBPeriod }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  
  const requirementsArray = Array.isArray(period.requirements) 
    ? period.requirements as string[]
    : [];

  const [formData, setFormData] = useState({
    name: period.name,
    academicYear: period.academicYear,
    description: period.description || "",
    startDate: new Date(period.startDate).toISOString().split("T")[0],
    endDate: new Date(period.endDate).toISOString().split("T")[0],
    quota: period.quota?.toString() || "",
    requirements: requirementsArray.join("\n"),
    isActive: period.isActive,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.academicYear || !formData.startDate || !formData.endDate) {
      toast.error("Nama, tahun ajaran, tanggal mulai dan selesai harus diisi");
      return;
    }

    setIsLoading(true);
    const result = await updatePPDBPeriod(period.id, {
      name: formData.name,
      academicYear: formData.academicYear,
      description: formData.description || undefined,
      startDate: new Date(formData.startDate),
      endDate: new Date(formData.endDate),
      quota: formData.quota ? parseInt(formData.quota) : undefined,
      requirements: formData.requirements 
        ? formData.requirements.split("\n").filter(r => r.trim()) 
        : undefined,
      isActive: formData.isActive,
    });

    if (result.success) {
      toast.success(result.message);
      router.push("/admin/ppdb");
    } else {
      toast.error(result.error);
    }
    setIsLoading(false);
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    const result = await deletePPDBPeriod(period.id);
    if (result.success) {
      toast.success(result.message);
      router.push("/admin/ppdb");
    } else {
      toast.error(result.error);
    }
    setIsDeleting(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/admin/ppdb">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Edit Periode PPDB</h1>
            <p className="text-muted-foreground">
              Perbarui data periode PPDB
            </p>
          </div>
        </div>

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive" disabled={isDeleting}>
              <Trash2 className="mr-2 h-4 w-4" />
              Hapus
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Hapus Periode PPDB?</AlertDialogTitle>
              <AlertDialogDescription>
                Tindakan ini tidak dapat dibatalkan. Periode PPDB akan dihapus secara permanen.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Batal</AlertDialogCancel>
              <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground">
                Hapus
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>Informasi Periode</CardTitle>
            <CardDescription>
              Perbarui detail periode PPDB
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Nama Periode *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="academicYear">Tahun Ajaran *</Label>
                <Input
                  id="academicYear"
                  value={formData.academicYear}
                  onChange={(e) => setFormData({ ...formData, academicYear: e.target.value })}
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="startDate">Tanggal Mulai *</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="endDate">Tanggal Selesai *</Label>
                <Input
                  id="endDate"
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="quota">Kuota Penerimaan</Label>
              <Input
                id="quota"
                type="number"
                value={formData.quota}
                onChange={(e) => setFormData({ ...formData, quota: e.target.value })}
                placeholder="Contoh: 100"
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Deskripsi</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Deskripsi periode PPDB..."
                rows={3}
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="requirements">Persyaratan</Label>
              <Textarea
                id="requirements"
                value={formData.requirements}
                onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
                placeholder="Masukkan persyaratan (satu per baris)"
                rows={6}
                disabled={isLoading}
              />
              <p className="text-xs text-muted-foreground">
                Masukkan satu persyaratan per baris
              </p>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="isActive"
                checked={formData.isActive}
                onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
                disabled={isLoading}
              />
              <Label htmlFor="isActive">Aktifkan periode ini</Label>
            </div>

            <div className="flex justify-end gap-4 pt-4">
              <Button type="button" variant="outline" asChild disabled={isLoading}>
                <Link href="/admin/ppdb">Batal</Link>
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Menyimpan...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Simpan Perubahan
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}
