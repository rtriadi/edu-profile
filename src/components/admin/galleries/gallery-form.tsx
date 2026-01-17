"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { format } from "date-fns";
import { Loader2, Plus, X, Image as ImageIcon, Upload } from "lucide-react";
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
  CardDescription,
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
import { createGallery, updateGallery, addGalleryItems, deleteGalleryItem } from "@/actions/galleries";

interface GalleryItem {
  id: string;
  url: string;
  thumbnail: string | null;
  caption: string | null;
  type: string;
  order: number;
}

interface Gallery {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  coverImage: string | null;
  type: string;
  isPublished: boolean;
  eventDate: Date | null;
  items: GalleryItem[];
}

interface GalleryFormProps {
  gallery?: Gallery;
}

function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

export function GalleryForm({ gallery }: GalleryFormProps) {
  const router = useRouter();
  const isEditing = !!gallery;

  const [items, setItems] = useState<GalleryItem[]>(gallery?.items || []);
  const [newItemUrls, setNewItemUrls] = useState<string>("");

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      title: gallery?.title || "",
      slug: gallery?.slug || "",
      description: gallery?.description || "",
      coverImage: gallery?.coverImage || "",
      type: gallery?.type || "PHOTO",
      isPublished: gallery?.isPublished ?? true,
      eventDate: gallery?.eventDate
        ? format(new Date(gallery.eventDate), "yyyy-MM-dd")
        : "",
    },
  });

  const watchTitle = watch("title");
  const watchType = watch("type");
  const watchIsPublished = watch("isPublished");
  const watchCoverImage = watch("coverImage");

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    setValue("title", title);
    if (!isEditing || !gallery?.slug) {
      setValue("slug", generateSlug(title));
    }
  };

  const onSubmit = async (data: Record<string, unknown>) => {
    try {
      const formData = {
        title: data.title as string,
        slug: data.slug as string,
        description: data.description as string || undefined,
        coverImage: data.coverImage as string || undefined,
        type: data.type as "PHOTO" | "VIDEO" | "MIXED",
        isPublished: data.isPublished as boolean,
        eventDate: data.eventDate ? new Date(data.eventDate as string) : undefined,
      };

      let result;
      if (isEditing) {
        result = await updateGallery(gallery.id, formData);
      } else {
        result = await createGallery(formData);
      }

      if (result.success) {
        toast.success(result.message);
        if (!isEditing && result.data) {
          const newGallery = result.data as { id: string };
          router.push(`/admin/galleries/${newGallery.id}`);
        } else {
          router.refresh();
        }
      } else {
        toast.error(result.error);
      }
    } catch (error) {
      toast.error("Terjadi kesalahan");
    }
  };

  const handleAddItems = async () => {
    if (!gallery?.id || !newItemUrls.trim()) return;

    const urls = newItemUrls
      .split("\n")
      .map((url) => url.trim())
      .filter((url) => url.length > 0);

    if (urls.length === 0) return;

    const itemsToAdd = urls.map((url) => ({
      url,
      type: url.match(/\.(mp4|webm|ogg)$/i) ? "video" : "image",
    }));

    const result = await addGalleryItems(gallery.id, itemsToAdd);
    if (result.success) {
      toast.success(result.message);
      setNewItemUrls("");
      router.refresh();
    } else {
      toast.error(result.error);
    }
  };

  const handleDeleteItem = async (itemId: string) => {
    const result = await deleteGalleryItem(itemId);
    if (result.success) {
      toast.success(result.message);
      setItems(items.filter((i) => i.id !== itemId));
      router.refresh();
    } else {
      toast.error(result.error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Informasi Galeri</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="title">Judul Galeri *</Label>
                <Input
                  id="title"
                  {...register("title", { required: "Judul diperlukan" })}
                  onChange={handleTitleChange}
                  placeholder="Contoh: Peringatan HUT RI ke-79"
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
                  placeholder="peringatan-hut-ri-ke-79"
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
                  placeholder="Deskripsi singkat galeri..."
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="coverImage">Cover Image URL</Label>
                <Input
                  id="coverImage"
                  {...register("coverImage")}
                  placeholder="https://..."
                />
                {watchCoverImage && (
                  <div className="mt-2 relative w-40 h-24 rounded overflow-hidden">
                    <Image
                      src={watchCoverImage}
                      alt="Cover preview"
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Gallery Items - Only show when editing */}
          {isEditing && (
            <Card>
              <CardHeader>
                <CardTitle>Item Galeri</CardTitle>
                <CardDescription>
                  {items.length} item dalam galeri ini
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Add Items */}
                <div className="space-y-2">
                  <Label>Tambah Item (URL per baris)</Label>
                  <Textarea
                    value={newItemUrls}
                    onChange={(e) => setNewItemUrls(e.target.value)}
                    placeholder="https://example.com/image1.jpg&#10;https://example.com/image2.jpg"
                    rows={3}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleAddItems}
                    disabled={!newItemUrls.trim()}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Tambah Item
                  </Button>
                </div>

                {/* Items Grid */}
                {items.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {items.map((item) => (
                      <div
                        key={item.id}
                        className="relative group rounded-lg overflow-hidden"
                      >
                        <div className="aspect-square relative">
                          {item.type === "video" ? (
                            <video
                              src={item.url}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <Image
                              src={item.url}
                              alt={item.caption || "Gallery item"}
                              fill
                              className="object-cover"
                            />
                          )}
                        </div>
                        <button
                          type="button"
                          onClick={() => handleDeleteItem(item.id)}
                          className="absolute top-2 right-2 p-1 bg-destructive text-destructive-foreground rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="h-4 w-4" />
                        </button>
                        {item.caption && (
                          <p className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-xs p-1 truncate">
                            {item.caption}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {items.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <ImageIcon className="h-12 w-12 mx-auto mb-2 opacity-50" />
                    <p>Belum ada item dalam galeri</p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Pengaturan</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Tipe Galeri</Label>
                <Select
                  value={watchType}
                  onValueChange={(v) => setValue("type", v)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PHOTO">Foto</SelectItem>
                    <SelectItem value="VIDEO">Video</SelectItem>
                    <SelectItem value="MIXED">Campuran</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="eventDate">Tanggal Kegiatan</Label>
                <Input
                  id="eventDate"
                  type="date"
                  {...register("eventDate")}
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
                {isEditing ? "Simpan Perubahan" : "Buat Galeri"}
              </Button>
              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={() => router.push("/admin/galleries")}
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
