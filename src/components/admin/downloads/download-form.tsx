"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

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
import { createDownload, updateDownload } from "@/actions/downloads";

interface Download {
  id: string;
  title: string;
  description: string | null;
  file: string;
  fileName: string | null;
  fileSize: number | null;
  fileType: string | null;
  category: string | null;
  isPublished: boolean;
  order: number;
}

interface DownloadFormProps {
  download?: Download;
}

export function DownloadForm({ download }: DownloadFormProps) {
  const router = useRouter();
  const isEditing = !!download;

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      title: download?.title || "",
      description: download?.description || "",
      file: download?.file || "",
      fileName: download?.fileName || "",
      fileSize: download?.fileSize || 0,
      fileType: download?.fileType || "",
      category: download?.category || "",
      isPublished: download?.isPublished ?? true,
      order: download?.order || 0,
    },
  });

  const watchIsPublished = watch("isPublished");

  const onSubmit = async (data: Record<string, unknown>) => {
    try {
      const formData = {
        title: data.title as string,
        description: data.description as string || undefined,
        file: data.file as string,
        fileName: data.fileName as string || undefined,
        fileSize: data.fileSize ? Number(data.fileSize) : undefined,
        fileType: data.fileType as string || undefined,
        category: data.category as string || undefined,
        isPublished: data.isPublished as boolean,
        order: data.order as number,
      };

      let result;
      if (isEditing) {
        result = await updateDownload(download.id, formData);
      } else {
        result = await createDownload(formData);
      }

      if (result.success) {
        toast.success(result.message);
        router.push("/admin/downloads");
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
              <CardTitle>Informasi File</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="title">Judul *</Label>
                <Input
                  id="title"
                  {...register("title", { required: "Judul diperlukan" })}
                  placeholder="Contoh: Formulir Pendaftaran PPDB"
                />
                {errors.title && (
                  <p className="text-sm text-destructive mt-1">
                    {errors.title.message as string}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="description">Deskripsi</Label>
                <Textarea
                  id="description"
                  {...register("description")}
                  placeholder="Deskripsi file..."
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="file">URL File *</Label>
                <Input
                  id="file"
                  {...register("file", { required: "URL file diperlukan" })}
                  placeholder="https://..."
                />
                {errors.file && (
                  <p className="text-sm text-destructive mt-1">
                    {errors.file.message as string}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="fileName">Nama File</Label>
                  <Input
                    id="fileName"
                    {...register("fileName")}
                    placeholder="formulir-ppdb.pdf"
                  />
                </div>
                <div>
                  <Label htmlFor="fileType">Tipe File</Label>
                  <Input
                    id="fileType"
                    {...register("fileType")}
                    placeholder="application/pdf"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="fileSize">Ukuran File (bytes)</Label>
                <Input
                  id="fileSize"
                  type="number"
                  {...register("fileSize", { valueAsNumber: true })}
                  placeholder="1024000"
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
                <Label htmlFor="category">Kategori</Label>
                <Input
                  id="category"
                  {...register("category")}
                  placeholder="Contoh: Formulir, Laporan"
                />
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
                <Label>Publikasikan</Label>
                <Switch
                  checked={watchIsPublished}
                  onCheckedChange={(v) => setValue("isPublished", v)}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6 space-y-2">
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                {isEditing ? "Simpan Perubahan" : "Tambah File"}
              </Button>
              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={() => router.push("/admin/downloads")}
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
