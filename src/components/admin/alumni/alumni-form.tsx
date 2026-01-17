"use client";

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
import { createAlumni, updateAlumni } from "@/actions/alumni";

interface Alumni {
  id: string;
  name: string;
  graduationYear: number;
  photo: string | null;
  currentStatus: string | null;
  company: string | null;
  achievement: string | null;
  testimonial: string | null;
  socialMedia: unknown;
  isPublished: boolean;
}

interface AlumniFormProps {
  alumni?: Alumni;
}

export function AlumniForm({ alumni }: AlumniFormProps) {
  const router = useRouter();
  const isEditing = !!alumni;

  const socialMedia = (alumni?.socialMedia as { linkedin?: string; instagram?: string }) || {};

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      name: alumni?.name || "",
      graduationYear: alumni?.graduationYear || new Date().getFullYear(),
      photo: alumni?.photo || "",
      currentStatus: alumni?.currentStatus || "",
      company: alumni?.company || "",
      achievement: alumni?.achievement || "",
      testimonial: alumni?.testimonial || "",
      linkedin: socialMedia.linkedin || "",
      instagram: socialMedia.instagram || "",
      isPublished: alumni?.isPublished ?? true,
    },
  });

  const watchIsPublished = watch("isPublished");
  const watchPhoto = watch("photo");

  const onSubmit = async (data: Record<string, unknown>) => {
    try {
      const formData = {
        name: data.name as string,
        graduationYear: data.graduationYear as number,
        photo: data.photo as string || undefined,
        currentStatus: data.currentStatus as string || undefined,
        company: data.company as string || undefined,
        achievement: data.achievement as string || undefined,
        testimonial: data.testimonial as string || undefined,
        socialMedia: {
          linkedin: data.linkedin as string || undefined,
          instagram: data.instagram as string || undefined,
        },
        isPublished: data.isPublished as boolean,
      };

      let result;
      if (isEditing) {
        result = await updateAlumni(alumni.id, formData);
      } else {
        result = await createAlumni(formData);
      }

      if (result.success) {
        toast.success(result.message);
        router.push("/admin/alumni");
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
              <CardTitle>Informasi Alumni</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Nama *</Label>
                  <Input
                    id="name"
                    {...register("name", { required: "Nama diperlukan" })}
                    placeholder="Nama lengkap"
                  />
                  {errors.name && (
                    <p className="text-sm text-destructive mt-1">
                      {errors.name.message as string}
                    </p>
                  )}
                </div>
                <div>
                  <Label htmlFor="graduationYear">Tahun Lulus *</Label>
                  <Input
                    id="graduationYear"
                    type="number"
                    {...register("graduationYear", { 
                      required: "Tahun lulus diperlukan",
                      valueAsNumber: true,
                    })}
                    min={1900}
                    max={new Date().getFullYear()}
                  />
                  {errors.graduationYear && (
                    <p className="text-sm text-destructive mt-1">
                      {errors.graduationYear.message as string}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <Label htmlFor="photo">URL Foto</Label>
                <Input
                  id="photo"
                  {...register("photo")}
                  placeholder="https://..."
                />
                {watchPhoto && (
                  <div className="mt-2 relative w-16 h-16 rounded-full overflow-hidden">
                    <Image
                      src={watchPhoto}
                      alt="Preview"
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="currentStatus">Status Saat Ini</Label>
                  <Input
                    id="currentStatus"
                    {...register("currentStatus")}
                    placeholder="Contoh: Mahasiswa UI, Dokter"
                  />
                </div>
                <div>
                  <Label htmlFor="company">Perusahaan/Institusi</Label>
                  <Input
                    id="company"
                    {...register("company")}
                    placeholder="Contoh: Google, Universitas Indonesia"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="achievement">Prestasi</Label>
                <Textarea
                  id="achievement"
                  {...register("achievement")}
                  placeholder="Prestasi yang diraih..."
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="testimonial">Testimoni</Label>
                <Textarea
                  id="testimonial"
                  {...register("testimonial")}
                  placeholder="Testimoni tentang sekolah..."
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Media Sosial</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="linkedin">LinkedIn URL</Label>
                <Input
                  id="linkedin"
                  {...register("linkedin")}
                  placeholder="https://linkedin.com/in/..."
                />
              </div>
              <div>
                <Label htmlFor="instagram">Instagram</Label>
                <Input
                  id="instagram"
                  {...register("instagram")}
                  placeholder="@username"
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
                {isEditing ? "Simpan Perubahan" : "Tambah Alumni"}
              </Button>
              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={() => router.push("/admin/alumni")}
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
