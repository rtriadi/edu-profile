import { Metadata } from "next";
import Link from "next/link";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { getPosts, getCategories } from "@/actions/posts";
import { PostsTable } from "@/components/admin/posts/posts-table";
import { SearchInput } from "@/components/admin/search-input";
import { PostsFilter } from "@/components/admin/posts/posts-filter";

export const metadata: Metadata = {
  title: "Berita & Artikel",
  description: "Kelola berita dan artikel",
};

interface PostsPageProps {
  searchParams: Promise<{
    page?: string;
    search?: string;
    categoryId?: string;
    status?: string;
  }>;
}

export default async function PostsPage({ searchParams }: PostsPageProps) {
  const params = await searchParams;
  const page = Number(params.page) || 1;

  const [postsData, categories] = await Promise.all([
    getPosts({
      page,
      limit: 10,
      search: params.search,
      categoryId: params.categoryId,
      status: params.status as "DRAFT" | "PUBLISHED" | "ARCHIVED" | undefined,
    }),
    getCategories(),
  ]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Berita & Artikel</h1>
          <p className="text-muted-foreground">
            Kelola berita, pengumuman, dan artikel sekolah
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/posts/new">
            <Plus className="mr-2 h-4 w-4" />
            Tulis Berita
          </Link>
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <SearchInput placeholder="Cari berita..." className="w-full sm:max-w-sm" />
        <PostsFilter categories={categories} />
      </div>

      <PostsTable posts={postsData.data} pagination={postsData.pagination} />
    </div>
  );
}
