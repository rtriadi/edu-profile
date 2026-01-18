"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Plus, X } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createGradeLevel, updateGradeLevel } from "@/actions/grade-levels";

interface GradeLevelFormProps {
  gradeLevel?: {
    id: string;
    name: string;
    slug: string;
    description: string | null;
    ageRange: string | null;
    minAge: number | null;
    maxAge: number | null;
    quota: number | null;
    image: string | null;
    icon: string | null;
    features: unknown;
    isActive: boolean;
    order: number;
  };
}

export function GradeLevelForm({ gradeLevel }: GradeLevelFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [features, setFeatures] = useState<string[]>(
    (gradeLevel?.features as string[]) || []
  );
  const [newFeature, setNewFeature] = useState("");

  // Form state
  const [form, setForm] = useState({
    name: gradeLevel?.name || "",
    slug: gradeLevel?.slug || "",
    description: gradeLevel?.description || "",
    ageRange: gradeLevel?.ageRange || "",
    minAge: gradeLevel?.minAge?.toString() || "",
    maxAge: gradeLevel?.maxAge?.toString() || "",
    quota: gradeLevel?.quota?.toString() || "",
    image: gradeLevel?.image || "",
    icon: gradeLevel?.icon || "",
    isActive: gradeLevel?.isActive ?? true,
    order: gradeLevel?.order?.toString() || "0",
  });

  const generateSlug = (text: string) => {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");
  };

  const handleNameChange = (value: string) => {
    setForm({
      ...form,
      name: value,
      slug: gradeLevel ? form.slug : generateSlug(value),
    });
  };

  const addFeature = () => {
    if (newFeature.trim()) {
      setFeatures([...features, newFeature.trim()]);
      setNewFeature("");
    }
  };

  const removeFeature = (index: number) => {
    setFeatures(features.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.name.trim()) {
      toast.error("Nama kelas wajib diisi");
      return;
    }

    if (!form.slug.trim()) {
      toast.error("Slug wajib diisi");
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        name: form.name,
        slug: form.slug,
        description: form.description || undefined,
        ageRange: form.ageRange || undefined,
        minAge: form.minAge ? parseInt(form.minAge) : undefined,
        maxAge: form.maxAge ? parseInt(form.maxAge) : undefined,
        quota: form.quota ? parseInt(form.quota) : undefined,
        image: form.image || undefined,
        icon: form.icon || undefined,
        features: features.length > 0 ? features : undefined,
        isActive: form.isActive,
        order: parseInt(form.order) || 0,
      };

      const result = gradeLevel
        ? await updateGradeLevel(gradeLevel.id, payload)
        : await createGradeLevel(payload);

      if (result.success) {
        toast.success(result.message);
        router.push("/admin/grade-levels");
        router.refresh();
      } else {
        toast.error(result.error || "Gagal menyimpan data");
      }
    } catch (error) {
      console.error("Submit error:", error);
      toast.error("Terjadi kesalahan");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="grid gap-8 md:grid-cols-2">
        {/* Main Info */}
        <Card>
          <CardHeader>
            <CardTitle>Informasi Kelas</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="name">Nama Kelas *</Label>
              <Input
                id="name"
                value={form.name}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="Contoh: TK A"
              />
            </div>

            <div>
              <Label htmlFor="slug">Slug *</Label>
              <Input
                id="slug"
                value={form.slug}
                onChange={(e) => setForm({ ...form, slug: e.target.value })}
                placeholder="tk-a"
              />
              <p className="text-xs text-muted-foreground mt-1">
                URL: /kelas/{form.slug || "slug"}
              </p>
            </div>

            <div>
              <Label htmlFor="description">Deskripsi</Label>
              <Textarea
                id="description"
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
                placeholder="Deskripsi singkat tentang kelas ini"
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="ageRange">Rentang Usia</Label>
              <Input
                id="ageRange"
                value={form.ageRange}
                onChange={(e) => setForm({ ...form, ageRange: e.target.value })}
                placeholder="Contoh: 4-5 Tahun"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="minAge">Usia Min (bulan)</Label>
                <Input
                  id="minAge"
                  type="number"
                  value={form.minAge}
                  onChange={(e) => setForm({ ...form, minAge: e.target.value })}
                  placeholder="48"
                />
              </div>
              <div>
                <Label htmlFor="maxAge">Usia Max (bulan)</Label>
                <Input
                  id="maxAge"
                  type="number"
                  value={form.maxAge}
                  onChange={(e) => setForm({ ...form, maxAge: e.target.value })}
                  placeholder="60"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Pengaturan</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="quota">Kuota Siswa</Label>
              <Input
                id="quota"
                type="number"
                value={form.quota}
                onChange={(e) => setForm({ ...form, quota: e.target.value })}
                placeholder="20"
              />
            </div>

            <div>
              <Label htmlFor="order">Urutan</Label>
              <Input
                id="order"
                type="number"
                value={form.order}
                onChange={(e) => setForm({ ...form, order: e.target.value })}
                placeholder="0"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Urutan tampil di halaman depan
              </p>
            </div>

            <div>
              <Label htmlFor="image">URL Gambar</Label>
              <Input
                id="image"
                value={form.image}
                onChange={(e) => setForm({ ...form, image: e.target.value })}
                placeholder="https://..."
              />
            </div>

            <div>
              <Label htmlFor="icon">Icon (nama icon)</Label>
              <Input
                id="icon"
                value={form.icon}
                onChange={(e) => setForm({ ...form, icon: e.target.value })}
                placeholder="baby, school, book-open"
              />
            </div>

            <div className="flex items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <Label className="text-base">Aktif</Label>
                <p className="text-sm text-muted-foreground">
                  Tampilkan kelas ini di halaman depan
                </p>
              </div>
              <Switch
                checked={form.isActive}
                onCheckedChange={(checked) =>
                  setForm({ ...form, isActive: checked })
                }
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Features */}
      <Card>
        <CardHeader>
          <CardTitle>Fitur/Keunggulan</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="Tambah fitur kelas..."
              value={newFeature}
              onChange={(e) => setNewFeature(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addFeature();
                }
              }}
            />
            <Button type="button" variant="outline" onClick={addFeature}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          {features.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="flex items-center gap-1 bg-muted px-3 py-1 rounded-full text-sm"
                >
                  {feature}
                  <button
                    type="button"
                    onClick={() => removeFeature(index)}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex justify-end gap-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push("/admin/grade-levels")}
        >
          Batal
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {gradeLevel ? "Simpan Perubahan" : "Buat Kelas"}
        </Button>
      </div>
    </form>
  );
}
