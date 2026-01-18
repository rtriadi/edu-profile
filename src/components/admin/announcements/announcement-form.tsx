"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { Loader2, Save } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { createAnnouncement, updateAnnouncement } from "@/actions/announcements";

interface AnnouncementFormProps {
  announcement?: {
    id: string;
    title: string;
    content: string;
    type: string;
    link: string | null;
    linkText: string | null;
    isActive: boolean;
    order: number;
  };
}

const announcementTypes = [
  { value: "info", label: "Info", color: "bg-blue-500" },
  { value: "warning", label: "Peringatan", color: "bg-yellow-500" },
  { value: "success", label: "Sukses", color: "bg-green-500" },
  { value: "error", label: "Error", color: "bg-red-500" },
];

interface FormData {
  title: string;
  content: string;
  type: "info" | "warning" | "success" | "error";
  link?: string;
  linkText?: string;
  isActive: boolean;
  order: number;
}

export function AnnouncementForm({ announcement }: AnnouncementFormProps) {
  const router = useRouter();
  const isEditing = !!announcement;

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    defaultValues: {
      title: announcement?.title || "",
      content: announcement?.content || "",
      type: (announcement?.type as FormData["type"]) || "info",
      link: announcement?.link || "",
      linkText: announcement?.linkText || "",
      isActive: announcement?.isActive ?? true,
      order: announcement?.order || 0,
    },
  });

  const selectedType = watch("type");
  const isActive = watch("isActive");

  const onSubmit = async (data: FormData) => {
    const result = isEditing
      ? await updateAnnouncement(announcement.id, data)
      : await createAnnouncement(data);

    if (result.success) {
      toast.success(result.message);
      router.push("/admin/announcements");
      router.refresh();
    } else {
      toast.error(result.error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Informasi Pengumuman</CardTitle>
          <CardDescription>
            Detail pengumuman yang akan ditampilkan di website
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Judul *</Label>
            <Input
              id="title"
              placeholder="Judul pengumuman"
              {...register("title", { required: "Judul diperlukan" })}
              disabled={isSubmitting}
            />
            {errors.title && (
              <p className="text-sm text-destructive">{errors.title.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">Konten *</Label>
            <Textarea
              id="content"
              placeholder="Isi pengumuman..."
              rows={4}
              {...register("content", { required: "Konten diperlukan" })}
              disabled={isSubmitting}
            />
            {errors.content && (
              <p className="text-sm text-destructive">{errors.content.message}</p>
            )}
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="type">Tipe</Label>
              <Select
                value={selectedType}
                onValueChange={(value) => setValue("type", value as FormData["type"])}
                disabled={isSubmitting}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pilih tipe" />
                </SelectTrigger>
                <SelectContent>
                  {announcementTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      <div className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full ${type.color}`} />
                        {type.label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="order">Urutan</Label>
              <Input
                id="order"
                type="number"
                min={0}
                {...register("order", { valueAsNumber: true })}
                disabled={isSubmitting}
              />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="link">Link (opsional)</Label>
              <Input
                id="link"
                type="url"
                placeholder="https://..."
                {...register("link")}
                disabled={isSubmitting}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="linkText">Teks Link</Label>
              <Input
                id="linkText"
                placeholder="Selengkapnya"
                {...register("linkText")}
                disabled={isSubmitting}
              />
            </div>
          </div>

          <div className="flex items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
              <Label>Status Aktif</Label>
              <p className="text-sm text-muted-foreground">
                Pengumuman akan ditampilkan di website jika aktif
              </p>
            </div>
            <Switch
              checked={isActive}
              onCheckedChange={(checked) => setValue("isActive", checked)}
              disabled={isSubmitting}
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-4">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Menyimpan...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              {isEditing ? "Simpan Perubahan" : "Buat Pengumuman"}
            </>
          )}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          disabled={isSubmitting}
        >
          Batal
        </Button>
      </div>
    </form>
  );
}
