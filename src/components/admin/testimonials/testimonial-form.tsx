"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { Loader2, Star } from "lucide-react";
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
import { createTestimonial, updateTestimonial } from "@/actions/testimonials";

interface Testimonial {
  id: string;
  name: string;
  role: string;
  content: string;
  photo: string | null;
  rating: number | null;
  isPublished: boolean;
  order: number;
}

interface TestimonialFormProps {
  testimonial?: Testimonial;
}

export function TestimonialForm({ testimonial }: TestimonialFormProps) {
  const router = useRouter();
  const isEditing = !!testimonial;

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      name: testimonial?.name || "",
      role: testimonial?.role || "",
      content: testimonial?.content || "",
      photo: testimonial?.photo || "",
      rating: testimonial?.rating || 5,
      isPublished: testimonial?.isPublished ?? true,
      order: testimonial?.order || 0,
    },
  });

  const watchRating = watch("rating");
  const watchIsPublished = watch("isPublished");
  const watchPhoto = watch("photo");

  const onSubmit = async (data: Record<string, unknown>) => {
    try {
      const formData = {
        name: data.name as string,
        role: data.role as string,
        content: data.content as string,
        photo: data.photo as string || undefined,
        rating: data.rating as number,
        isPublished: data.isPublished as boolean,
        order: data.order as number,
      };

      let result;
      if (isEditing) {
        result = await updateTestimonial(testimonial.id, formData);
      } else {
        result = await createTestimonial(formData);
      }

      if (result.success) {
        toast.success(result.message);
        router.push("/admin/testimonials");
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
              <CardTitle>Informasi Testimoni</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="name">Nama *</Label>
                <Input
                  id="name"
                  {...register("name", { required: "Nama diperlukan" })}
                  placeholder="Contoh: Budi Santoso"
                />
                {errors.name && (
                  <p className="text-sm text-destructive mt-1">
                    {errors.name.message as string}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="role">Peran *</Label>
                <Input
                  id="role"
                  {...register("role", { required: "Peran diperlukan" })}
                  placeholder="Contoh: Orang Tua Siswa Kelas 6"
                />
                {errors.role && (
                  <p className="text-sm text-destructive mt-1">
                    {errors.role.message as string}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="content">Testimoni *</Label>
                <Textarea
                  id="content"
                  {...register("content", { required: "Testimoni diperlukan" })}
                  placeholder="Tulis testimoni..."
                  rows={5}
                />
                {errors.content && (
                  <p className="text-sm text-destructive mt-1">
                    {errors.content.message as string}
                  </p>
                )}
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
                <Label>Rating</Label>
                <div className="flex gap-1 mt-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setValue("rating", star)}
                      className="p-1 hover:scale-110 transition-transform"
                    >
                      <Star
                        className={`h-6 w-6 ${
                          star <= watchRating
                            ? "text-yellow-500 fill-yellow-500"
                            : "text-gray-300"
                        }`}
                      />
                    </button>
                  ))}
                </div>
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
                {isEditing ? "Simpan Perubahan" : "Tambah Testimoni"}
              </Button>
              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={() => router.push("/admin/testimonials")}
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
