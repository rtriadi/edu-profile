import { Metadata } from "next";
import { PostForm } from "@/components/admin/posts/post-form";
import { getCategories, getTags } from "@/actions/posts";

export const metadata: Metadata = {
  title: "Tulis Berita",
  description: "Buat berita atau artikel baru",
};

export default async function NewPostPage() {
  const [categories, tags] = await Promise.all([
    getCategories(),
    getTags(),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Tulis Berita</h1>
        <p className="text-muted-foreground">
          Buat berita atau artikel baru untuk website
        </p>
      </div>

      <PostForm categories={categories} tags={tags} />
    </div>
  );
}
