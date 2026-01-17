"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { Loader2, Plus, X } from "lucide-react";
import { toast } from "sonner";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { createFacility, updateFacility } from "@/actions/facilities";

interface Facility {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  images: unknown;
  icon: string | null;
  features: unknown;
  isPublished: boolean;
  order: number;
}

interface FacilityFormProps {
  facility?: Facility;
}

function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

export function FacilityForm({ facility }: FacilityFormProps) {
  const router = useRouter();
  const isEditing = !!facility;

  const existingImages = (facility?.images as string[]) || [];
  const existingFeatures = (facility?.features as string[]) || [];

  const [images, setImages] = useState<string[]>(existingImages);
  const [features, setFeatures] = useState<string[]>(existingFeatures);
  const [newImageUrl, setNewImageUrl] = useState("");
  const [newFeature, setNewFeature] = useState("");

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      name: facility?.name || "",
      slug: facility?.slug || "",
      description: facility?.description || "",
      icon: facility?.icon || "",
      isPublished: facility?.isPublished ?? true,
      order: facility?.order || 0,
    },
  });

  const watchIsPublished = watch("isPublished");

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    setValue("name", name);
    if (!isEditing || !facility?.slug) {
      setValue("slug", generateSlug(name));
    }
  };

  const addImage = () => {
    if (newImageUrl.trim()) {
      setImages([...images, newImageUrl.trim()]);
      setNewImageUrl("");
    }
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
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

  const onSubmit = async (data: Record<string, unknown>) => {
    try {
      const formData = {
        name: data.name as string,
        slug: data.slug as string,
        description: data.description as string || undefined,
        images: images.length > 0 ? images : undefined,
        icon: data.icon as string || undefined,
        features: features.length > 0 ? features : undefined,
        isPublished: data.isPublished as boolean,
        order: data.order as number,
      };

      let result;
      if (isEditing) {
        result = await updateFacility(facility.id, formData);
      } else {
        result = await createFacility(formData);
      }

      if (result.success) {
        toast.success(result.message);
        router.push("/admin/facilities");
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
              <CardTitle>Informasi Fasilitas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="name">Nama Fasilitas *</Label>
                <Input
                  id="name"
                  {...register("name", { required: "Nama diperlukan" })}
                  onChange={handleNameChange}
                  placeholder="Contoh: Laboratorium Komputer"
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
                  placeholder="laboratorium-komputer"
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
                  placeholder="Deskripsi fasilitas..."
                  rows={4}
                />
              </div>

              <div>
                <Label htmlFor="icon">Icon (Lucide icon name)</Label>
                <Input
                  id="icon"
                  {...register("icon")}
                  placeholder="Contoh: monitor, flask, book"
                />
              </div>
            </CardContent>
          </Card>

          {/* Images */}
          <Card>
            <CardHeader>
              <CardTitle>Gambar Fasilitas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  value={newImageUrl}
                  onChange={(e) => setNewImageUrl(e.target.value)}
                  placeholder="URL gambar..."
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addImage();
                    }
                  }}
                />
                <Button type="button" variant="outline" onClick={addImage}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>

              {images.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {images.map((url, index) => (
                    <div key={index} className="relative group">
                      <div className="aspect-video relative rounded overflow-hidden">
                        <Image
                          src={url}
                          alt={`Image ${index + 1}`}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-1 right-1 p-1 bg-destructive text-destructive-foreground rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Features */}
          <Card>
            <CardHeader>
              <CardTitle>Fitur Fasilitas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  value={newFeature}
                  onChange={(e) => setNewFeature(e.target.value)}
                  placeholder="Tambah fitur..."
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
                    <Badge key={index} variant="secondary" className="gap-1">
                      {feature}
                      <button
                        type="button"
                        onClick={() => removeFeature(index)}
                        className="ml-1 hover:text-destructive"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
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
                {isEditing ? "Simpan Perubahan" : "Buat Fasilitas"}
              </Button>
              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={() => router.push("/admin/facilities")}
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
