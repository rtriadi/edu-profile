"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { Loader2, Save, Eye } from "lucide-react";
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
import { createPost, updatePost } from "@/actions/posts";
import { generateSlug } from "@/lib/utils";
import type { Status } from "@/types";

interface Category {
  id: string;
  name: string;
  slug: string;
  color: string | null;
}

interface Tag {
  id: string;
  name: string;
  slug: string;
}

interface Post {
  id: string;
  title: string;
  slug: string;
  content: unknown;
  excerpt: string | null;
  featuredImg: string | null;
  status: Status;
  categoryId: string;
  isFeatured: boolean;
  locale: string;
  seoTitle: string | null;
  seoDesc: string | null;
  tags: { tag: Tag }[];
}

interface PostFormProps {
  post?: Post;
  categories: Category[];
  tags: Tag[];
}

interface PostFormData {
  title: string;
  slug: string;
  excerpt?: string;
  featuredImg?: string;
  status: Status;
  categoryId: string;
  isFeatured: boolean;
  locale: "id" | "en";
  seoTitle?: string;
  seoDesc?: string;
  tags?: string[];
}

export function PostForm({ post, categories, tags }: PostFormProps) {
  const router = useRouter();
  const isEditing = !!post;
  const [isPending, startTransition] = useTransition();

  const existingTagIds = post?.tags?.map((t) => t.tag.id) || [];
  const [selectedTags, setSelectedTags] = useState<string[]>(existingTagIds);
  const [imagePreview, setImagePreview] = useState<string | null>(
    post?.featuredImg || null
  );

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<PostFormData>({
    defaultValues: {
      title: post?.title || "",
      slug: post?.slug || "",
      excerpt: post?.excerpt || "",
      featuredImg: post?.featuredImg || "",
      status: post?.status || "DRAFT",
      categoryId: post?.categoryId || "",
      isFeatured: post?.isFeatured ?? false,
      locale: (post?.locale as "id" | "en") || "id",
      seoTitle: post?.seoTitle || "",
      seoDesc: post?.seoDesc || "",
      tags: existingTagIds,
    },
  });

  const title = watch("title");
  const status = watch("status");
  const categoryId = watch("categoryId");
  const isFeatured = watch("isFeatured");
  const locale = watch("locale");

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    register("title").onChange(e);
    if (!isEditing) {
      setValue("slug", generateSlug(newTitle));
    }
  };

  const toggleTag = (tagId: string) => {
    const updated = selectedTags.includes(tagId)
      ? selectedTags.filter((id) => id !== tagId)
      : [...selectedTags, tagId];
    setSelectedTags(updated);
    setValue("tags", updated);
  };

  const onSubmit = async (data: PostFormData) => {
    const submitData = {
      ...data,
      content: post?.content || [],
      tags: selectedTags,
    };

    const result = isEditing
      ? await updatePost(post.id, submitData)
      : await createPost(submitData);

    if (result.success) {
      toast.success(result.message);
      startTransition(() => {
        router.refresh();
        router.push("/admin/posts");
      });
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
              <CardTitle>Konten Berita</CardTitle>
              <CardDescription>
                Informasi utama berita atau artikel
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">
                  Judul <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="title"
                  placeholder="Masukkan judul berita"
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
                  placeholder="judul-berita"
                  {...register("slug", { required: "Slug wajib diisi" })}
                  disabled={isSubmitting}
                />
                <p className="text-xs text-muted-foreground">
                  URL: /berita/{watch("slug") || "judul-berita"}
                </p>
                {errors.slug && (
                  <p className="text-sm text-destructive">{errors.slug.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="excerpt">Ringkasan</Label>
                <Textarea
                  id="excerpt"
                  placeholder="Tulis ringkasan singkat berita..."
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
                    <p className="text-xs text-muted-foreground mt-1">
                      Masukkan URL gambar atau upload melalui Media Library
                    </p>
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
                <p className="text-xs text-muted-foreground">
                  Maksimal 70 karakter. Kosongkan untuk menggunakan judul berita.
                </p>
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
                <p className="text-xs text-muted-foreground">
                  Maksimal 160 karakter. Kosongkan untuk menggunakan ringkasan.
                </p>
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

              <div className="flex items-center justify-between rounded-lg border p-3">
                <div className="space-y-0.5">
                  <Label htmlFor="isFeatured" className="text-sm">
                    Berita Unggulan
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    Tampilkan di halaman utama
                  </p>
                </div>
                <Switch
                  id="isFeatured"
                  checked={isFeatured}
                  onCheckedChange={(checked) => setValue("isFeatured", checked)}
                  disabled={isSubmitting}
                />
              </div>
            </CardContent>
          </Card>

          {/* Category */}
          <Card>
            <CardHeader>
              <CardTitle>Kategori</CardTitle>
            </CardHeader>
            <CardContent>
              <Select
                value={categoryId}
                onValueChange={(value) => setValue("categoryId", value)}
                disabled={isSubmitting}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pilih kategori" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.categoryId && (
                <p className="text-sm text-destructive mt-2">
                  Kategori wajib dipilih
                </p>
              )}
            </CardContent>
          </Card>

          {/* Tags */}
          <Card>
            <CardHeader>
              <CardTitle>Tag</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <Badge
                    key={tag.id}
                    variant={selectedTags.includes(tag.id) ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => toggleTag(tag.id)}
                  >
                    {tag.name}
                  </Badge>
                ))}
                {tags.length === 0 && (
                  <p className="text-sm text-muted-foreground">
                    Belum ada tag. Buat tag baru di halaman Tag.
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-4">
        <Button type="submit" disabled={isSubmitting || isPending}>
          {isSubmitting || isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Menyimpan...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              {isEditing ? "Simpan Perubahan" : "Simpan Berita"}
            </>
          )}
        </Button>
        {status === "PUBLISHED" && post?.slug && (
          <Button type="button" variant="outline" asChild>
            <a href={`/berita/${post.slug}`} target="_blank" rel="noopener noreferrer">
              <Eye className="mr-2 h-4 w-4" />
              Lihat
            </a>
          </Button>
        )}
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          disabled={isSubmitting || isPending}
        >
          Batal
        </Button>
      </div>
    </form>
  );
}
