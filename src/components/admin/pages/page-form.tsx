"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { Loader2, Save, Eye } from "lucide-react";
import { toast } from "sonner";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
import { createPage, updatePage } from "@/actions/pages";
import { generateSlug } from "@/lib/utils";
import type { Status } from "@/types";

interface PageData {
  id: string;
  title: string;
  slug: string;
  content: unknown;
  excerpt: string | null;
  featuredImg: string | null;
  status: Status;
  template: string;
  locale: string;
  seoTitle: string | null;
  seoDesc: string | null;
  seoKeywords: string | null;
  ogImage: string | null;
  parentId: string | null;
}

interface ParentPage {
  id: string;
  title: string;
  slug: string;
  parentId: string | null;
}

interface PageFormProps {
  page?: PageData;
  pages: ParentPage[];
}

interface PageFormData {
  title: string;
  slug: string;
  excerpt?: string;
  featuredImg?: string;
  status: Status;
  template: string;
  locale: "id" | "en";
  seoTitle?: string;
  seoDesc?: string;
  seoKeywords?: string;
  ogImage?: string;
  parentId?: string;
}

export function PageForm({ page, pages }: PageFormProps) {
  const router = useRouter();
  const isEditing = !!page;

  const [imagePreview, setImagePreview] = useState<string | null>(
    page?.featuredImg || null
  );

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<PageFormData>({
    defaultValues: {
      title: page?.title || "",
      slug: page?.slug || "",
      excerpt: page?.excerpt || "",
      featuredImg: page?.featuredImg || "",
      status: page?.status || "DRAFT",
      template: page?.template || "default",
      locale: (page?.locale as "id" | "en") || "id",
      seoTitle: page?.seoTitle || "",
      seoDesc: page?.seoDesc || "",
      seoKeywords: page?.seoKeywords || "",
      ogImage: page?.ogImage || "",
      parentId: page?.parentId || "",
    },
  });

  const title = watch("title");
  const status = watch("status");
  const template = watch("template");
  const locale = watch("locale");
  const parentId = watch("parentId");

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    register("title").onChange(e);
    if (!isEditing) {
      setValue("slug", generateSlug(newTitle));
    }
  };

  const onSubmit = async (data: PageFormData) => {
    const submitData = {
      ...data,
      content: page?.content || [],
      parentId: data.parentId || undefined,
    };

    const result = isEditing
      ? await updatePage(page.id, submitData)
      : await createPage(submitData);

    if (result.success) {
      toast.success(result.message);
      router.push("/admin/pages");
      router.refresh();
    } else {
      toast.error(result.error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Informasi Halaman</CardTitle>
              <CardDescription>
                Informasi utama halaman
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">
                  Judul <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="title"
                  placeholder="Masukkan judul halaman"
                  {...register("title", { required: "Judul wajib diisi" })}
                  onChange={handleTitleChange}
                  disabled={isSubmitting}
                />
                {errors.title && (
                  <p className="text-sm text-destructive">{errors.title.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="slug">
                  Slug <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="slug"
                  placeholder="judul-halaman"
                  {...register("slug", { required: "Slug wajib diisi" })}
                  disabled={isSubmitting}
                />
                <p className="text-xs text-muted-foreground">
                  URL: /{watch("slug") || "judul-halaman"}
                </p>
                {errors.slug && (
                  <p className="text-sm text-destructive">{errors.slug.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="excerpt">Ringkasan</Label>
                <Textarea
                  id="excerpt"
                  placeholder="Tulis ringkasan singkat halaman..."
                  rows={3}
                  {...register("excerpt")}
                  disabled={isSubmitting}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="featuredImg">Gambar Utama</Label>
                <div className="flex items-start gap-4">
                  {imagePreview && (
                    <div className="relative h-20 w-32 rounded overflow-hidden flex-shrink-0">
                      <Image
                        src={imagePreview}
                        alt="Preview"
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                  <div className="flex-1">
                    <Input
                      id="featuredImg"
                      type="url"
                      placeholder="https://example.com/image.jpg"
                      {...register("featuredImg")}
                      onChange={(e) => {
                        register("featuredImg").onChange(e);
                        setImagePreview(e.target.value || null);
                      }}
                      disabled={isSubmitting}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* SEO Settings */}
          <Card>
            <CardHeader>
              <CardTitle>SEO</CardTitle>
              <CardDescription>
                Optimasi untuk mesin pencari
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="seoTitle">SEO Title</Label>
                <Input
                  id="seoTitle"
                  placeholder="Judul untuk hasil pencarian"
                  maxLength={70}
                  {...register("seoTitle")}
                  disabled={isSubmitting}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="seoDesc">SEO Description</Label>
                <Textarea
                  id="seoDesc"
                  placeholder="Deskripsi untuk hasil pencarian"
                  maxLength={160}
                  rows={2}
                  {...register("seoDesc")}
                  disabled={isSubmitting}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="seoKeywords">Keywords</Label>
                <Input
                  id="seoKeywords"
                  placeholder="kata kunci, dipisahkan, koma"
                  {...register("seoKeywords")}
                  disabled={isSubmitting}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Publish Settings */}
          <Card>
            <CardHeader>
              <CardTitle>Publikasi</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={status}
                  onValueChange={(value) => setValue("status", value as Status)}
                  disabled={isSubmitting}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="DRAFT">Draft</SelectItem>
                    <SelectItem value="PUBLISHED">Publikasikan</SelectItem>
                    <SelectItem value="ARCHIVED">Arsip</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="template">Template</Label>
                <Select
                  value={template}
                  onValueChange={(value) => setValue("template", value)}
                  disabled={isSubmitting}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="default">Default</SelectItem>
                    <SelectItem value="full-width">Full Width</SelectItem>
                    <SelectItem value="sidebar">Dengan Sidebar</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="locale">Bahasa</Label>
                <Select
                  value={locale}
                  onValueChange={(value) => setValue("locale", value as "id" | "en")}
                  disabled={isSubmitting}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="id">Bahasa Indonesia</SelectItem>
                    <SelectItem value="en">English</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Parent Page */}
          <Card>
            <CardHeader>
              <CardTitle>Halaman Induk</CardTitle>
            </CardHeader>
            <CardContent>
              <Select
                value={parentId || "none"}
                onValueChange={(value) => setValue("parentId", value === "none" ? "" : value)}
                disabled={isSubmitting}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Tidak ada (halaman utama)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Tidak ada (halaman utama)</SelectItem>
                  {pages.map((p) => (
                    <SelectItem key={p.id} value={p.id}>
                      {p.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground mt-2">
                Pilih halaman induk untuk membuat sub-halaman
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-4">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Menyimpan...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              {isEditing ? "Simpan Perubahan" : "Simpan Halaman"}
            </>
          )}
        </Button>
        {status === "PUBLISHED" && page?.slug && (
          <Button type="button" variant="outline" asChild>
            <a href={`/${page.slug}`} target="_blank" rel="noopener noreferrer">
              <Eye className="mr-2 h-4 w-4" />
              Lihat
            </a>
          </Button>
        )}
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
