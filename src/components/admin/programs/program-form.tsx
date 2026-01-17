"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createProgram, updateProgram } from "@/actions/programs";

interface Program {
  id: string;
  name: string;
  slug: string;
  type: string;
  description: string | null;
  content: unknown;
  image: string | null;
  icon: string | null;
  isActive: boolean;
  order: number;
}

interface ProgramFormProps {
  program?: Program;
}

function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

export function ProgramForm({ program }: ProgramFormProps) {
  const router = useRouter();
  const isEditing = !!program;

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      name: program?.name || "",
      slug: program?.slug || "",
      type: program?.type || "CURRICULUM",
      description: program?.description || "",
      image: program?.image || "",
      icon: program?.icon || "",
      isActive: program?.isActive ?? true,
      order: program?.order || 0,
    },
  });

  const watchType = watch("type");
  const watchIsActive = watch("isActive");
  const watchImage = watch("image");

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    setValue("name", name);
    if (!isEditing || !program?.slug) {
      setValue("slug", generateSlug(name));
    }
  };

  const onSubmit = async (data: Record<string, unknown>) => {
    try {
      const formData = {
        name: data.name as string,
        slug: data.slug as string,
        type: data.type as "CURRICULUM" | "EXTRACURRICULAR" | "FEATURED",
        description: data.description as string || undefined,
        image: data.image as string || undefined,
        icon: data.icon as string || undefined,
        isActive: data.isActive as boolean,
        order: data.order as number,
      };

      let result;
      if (isEditing) {
        result = await updateProgram(program.id, formData);
      } else {
        result = await createProgram(formData);
      }

      if (result.success) {
        toast.success(result.message);
        router.push("/admin/programs");
        router.refresh();
      } else {
        toast.error(result.error);
      }
    } catch (error) {
      toast.error("Terjadi kesalahan");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Informasi Program</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="name">Nama Program *</Label>
                <Input
                  id="name"
                  {...register("name", { required: "Nama diperlukan" })}
                  onChange={handleNameChange}
                  placeholder="Contoh: Kurikulum Merdeka"
                />
                {errors.name && (
                  <p className="text-sm text-destructive mt-1">
                    {errors.name.message as string}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="slug">Slug *</Label>
                <Input
                  id="slug"
                  {...register("slug", { required: "Slug diperlukan" })}
                  placeholder="kurikulum-merdeka"
                />
                {errors.slug && (
                  <p className="text-sm text-destructive mt-1">
                    {errors.slug.message as string}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="description">Deskripsi</Label>
                <Textarea
                  id="description"
                  {...register("description")}
                  placeholder="Deskripsi program..."
                  rows={4}
                />
              </div>

              <div>
                <Label htmlFor="image">URL Gambar</Label>
                <Input
                  id="image"
                  {...register("image")}
                  placeholder="https://..."
                />
                {watchImage && (
                  <div className="mt-2 relative w-40 h-24 rounded overflow-hidden">
                    <Image
                      src={watchImage}
                      alt="Preview"
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
              </div>

              <div>
                <Label htmlFor="icon">Icon (Lucide icon name)</Label>
                <Input
                  id="icon"
                  {...register("icon")}
                  placeholder="Contoh: book-open, trophy, star"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Pengaturan</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Tipe Program</Label>
                <Select
                  value={watchType}
                  onValueChange={(v) => setValue("type", v)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="CURRICULUM">Kurikulum</SelectItem>
                    <SelectItem value="EXTRACURRICULAR">Ekstrakurikuler</SelectItem>
                    <SelectItem value="FEATURED">Program Unggulan</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="order">Urutan</Label>
                <Input
                  id="order"
                  type="number"
                  {...register("order", { valueAsNumber: true })}
                  min={0}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label>Aktif</Label>
                <Switch
                  checked={watchIsActive}
                  onCheckedChange={(v) => setValue("isActive", v)}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6 space-y-2">
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                {isEditing ? "Simpan Perubahan" : "Buat Program"}
              </Button>
              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={() => router.push("/admin/programs")}
              >
                Batal
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </form>
  );
}
