"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Save, ArrowLeft } from "lucide-react";
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
import { createPPDBPeriod } from "@/actions/ppdb";

export default function NewPPDBPeriodPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    academicYear: "",
    description: "",
    startDate: "",
    endDate: "",
    quota: "",
    requirements: "",
    isActive: false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.academicYear || !formData.startDate || !formData.endDate) {
      toast.error("Nama, tahun ajaran, tanggal mulai dan selesai harus diisi");
      return;
    }

    setIsLoading(true);
    const result = await createPPDBPeriod({
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

  // Generate current academic year
  const currentYear = new Date().getFullYear();
  const suggestedAcademicYear = `${currentYear}/${currentYear + 1}`;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/admin/ppdb">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Buat Periode PPDB</h1>
          <p className="text-muted-foreground">
            Buat periode penerimaan peserta didik baru
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>Informasi Periode</CardTitle>
            <CardDescription>
              Masukkan detail periode PPDB
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
                  placeholder={`PPDB ${suggestedAcademicYear}`}
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="academicYear">Tahun Ajaran *</Label>
                <Input
                  id="academicYear"
                  value={formData.academicYear}
                  onChange={(e) => setFormData({ ...formData, academicYear: e.target.value })}
                  placeholder={suggestedAcademicYear}
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
                placeholder="Masukkan persyaratan (satu per baris):
Fotocopy Akta Kelahiran
Fotocopy Kartu Keluarga
Pas Foto 3x4 (4 lembar)
..."
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
            <p className="text-xs text-muted-foreground">
              Hanya satu periode yang dapat aktif. Mengaktifkan periode ini akan menonaktifkan periode lainnya.
            </p>

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
                    Simpan Periode
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
