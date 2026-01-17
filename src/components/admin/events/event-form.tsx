"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { format } from "date-fns";
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
import { createEvent, updateEvent } from "@/actions/events";

interface Event {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  content: unknown;
  location: string | null;
  startDate: Date;
  endDate: Date | null;
  isAllDay: boolean;
  image: string | null;
  type: string;
  color: string | null;
  isPublished: boolean;
}

interface EventFormProps {
  event?: Event;
}

function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

export function EventForm({ event }: EventFormProps) {
  const router = useRouter();
  const isEditing = !!event;

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      title: event?.title || "",
      slug: event?.slug || "",
      description: event?.description || "",
      location: event?.location || "",
      startDate: event?.startDate
        ? format(new Date(event.startDate), "yyyy-MM-dd'T'HH:mm")
        : "",
      endDate: event?.endDate
        ? format(new Date(event.endDate), "yyyy-MM-dd'T'HH:mm")
        : "",
      isAllDay: event?.isAllDay ?? false,
      image: event?.image || "",
      type: event?.type || "ACADEMIC",
      color: event?.color || "#3B82F6",
      isPublished: event?.isPublished ?? true,
    },
  });

  const watchType = watch("type");
  const watchIsAllDay = watch("isAllDay");
  const watchIsPublished = watch("isPublished");
  const watchImage = watch("image");
  const watchColor = watch("color");

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    setValue("title", title);
    if (!isEditing || !event?.slug) {
      setValue("slug", generateSlug(title));
    }
  };

  const onSubmit = async (data: Record<string, unknown>) => {
    try {
      const formData = {
        title: data.title as string,
        slug: data.slug as string,
        description: data.description as string || undefined,
        location: data.location as string || undefined,
        startDate: new Date(data.startDate as string),
        endDate: data.endDate ? new Date(data.endDate as string) : undefined,
        isAllDay: data.isAllDay as boolean,
        image: data.image as string || undefined,
        type: data.type as "ACADEMIC" | "HOLIDAY" | "EXAM" | "CEREMONY" | "COMPETITION" | "MEETING" | "OTHER",
        color: data.color as string || undefined,
        isPublished: data.isPublished as boolean,
      };

      let result;
      if (isEditing) {
        result = await updateEvent(event.id, formData);
      } else {
        result = await createEvent(formData);
      }

      if (result.success) {
        toast.success(result.message);
        router.push("/admin/events");
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
              <CardTitle>Informasi Kegiatan</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="title">Judul Kegiatan *</Label>
                <Input
                  id="title"
                  {...register("title", { required: "Judul diperlukan" })}
                  onChange={handleTitleChange}
                  placeholder="Contoh: Upacara Bendera 17 Agustus"
                />
                {errors.title && (
                  <p className="text-sm text-destructive mt-1">
                    {errors.title.message as string}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="slug">Slug *</Label>
                <Input
                  id="slug"
                  {...register("slug", { required: "Slug diperlukan" })}
                  placeholder="upacara-bendera-17-agustus"
                />
              </div>

              <div>
                <Label htmlFor="description">Deskripsi</Label>
                <Textarea
                  id="description"
                  {...register("description")}
                  placeholder="Deskripsi kegiatan..."
                  rows={4}
                />
              </div>

              <div>
                <Label htmlFor="location">Lokasi</Label>
                <Input
                  id="location"
                  {...register("location")}
                  placeholder="Contoh: Lapangan Sekolah"
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
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Waktu Kegiatan</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <Switch
                  checked={watchIsAllDay}
                  onCheckedChange={(v) => setValue("isAllDay", v)}
                />
                <Label>Sepanjang hari</Label>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="startDate">Tanggal Mulai *</Label>
                  <Input
                    id="startDate"
                    type={watchIsAllDay ? "date" : "datetime-local"}
                    {...register("startDate", { required: "Tanggal mulai diperlukan" })}
                  />
                  {errors.startDate && (
                    <p className="text-sm text-destructive mt-1">
                      {errors.startDate.message as string}
                    </p>
                  )}
                </div>
                <div>
                  <Label htmlFor="endDate">Tanggal Selesai</Label>
                  <Input
                    id="endDate"
                    type={watchIsAllDay ? "date" : "datetime-local"}
                    {...register("endDate")}
                  />
                </div>
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
                <Label>Tipe Kegiatan</Label>
                <Select
                  value={watchType}
                  onValueChange={(v) => setValue("type", v)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ACADEMIC">Akademik</SelectItem>
                    <SelectItem value="HOLIDAY">Libur</SelectItem>
                    <SelectItem value="EXAM">Ujian</SelectItem>
                    <SelectItem value="CEREMONY">Upacara</SelectItem>
                    <SelectItem value="COMPETITION">Lomba</SelectItem>
                    <SelectItem value="MEETING">Rapat</SelectItem>
                    <SelectItem value="OTHER">Lainnya</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="color">Warna</Label>
                <div className="flex gap-2">
                  <Input
                    id="color"
                    type="color"
                    {...register("color")}
                    className="w-12 h-10 p-1"
                  />
                  <Input
                    value={watchColor}
                    onChange={(e) => setValue("color", e.target.value)}
                    placeholder="#3B82F6"
                    className="flex-1"
                  />
                </div>
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
                {isEditing ? "Simpan Perubahan" : "Buat Kegiatan"}
              </Button>
              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={() => router.push("/admin/events")}
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
