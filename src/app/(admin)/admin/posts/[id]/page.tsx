import { Metadata } from "next";
import { notFound } from "next/navigation";
import { PostForm } from "@/components/admin/posts/post-form";
import { getPostById, getCategories, getTags } from "@/actions/posts";

interface EditPostPageProps {
  params: Promise<{
    id: string;
  }>;
}

export const metadata: Metadata = {
  title: "Edit Berita",
  description: "Edit berita atau artikel",
};

export default async function EditPostPage({ params }: EditPostPageProps) {
  const { id } = await params;
  
  const [post, categories, tags] = await Promise.all([
    getPostById(id),
    getCategories(),
    getTags(),
  ]);

  if (!post) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Edit Berita</h1>
        <p className="text-muted-foreground">
          Perbarui berita atau artikel
        </p>
      </div>

      <PostForm post={post} categories={categories} tags={tags} />
    </div>
  );
}
