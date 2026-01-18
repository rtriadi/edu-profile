import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Calendar, Eye } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { prisma } from "@/lib/prisma";
import { formatDate } from "@/lib/utils";
import { getSiteConfig } from "@/lib/site-config";
import { getTranslations, type Language } from "@/lib/translations";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Berita & Artikel",
  description: "Berita dan artikel terbaru dari sekolah",
};

interface BeritaPageProps {
  searchParams: Promise<{
    page?: string;
    category?: string;
  }>;
}

async function getPosts(page: number, categorySlug?: string) {
  const limit = 9;
  const skip = (page - 1) * limit;

  const where: Record<string, unknown> = { status: "PUBLISHED" };
  if (categorySlug) {
    where.category = { slug: categorySlug };
  }

  try {
    const [posts, total, categories] = await Promise.all([
      prisma.post.findMany({
        where,
        include: {
          category: { select: { name: true, slug: true, color: true } },
          author: { select: { name: true } },
        },
        orderBy: { publishedAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.post.count({ where }),
      prisma.category.findMany({
        include: { _count: { select: { posts: true } } },
        orderBy: { order: "asc" },
      }),
    ]);

    return {
      posts,
      categories,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  } catch (error) {
    console.error("Error fetching posts:", error);
    return {
      posts: [],
      categories: [],
      pagination: { page: 1, limit: 9, total: 0, totalPages: 0 },
    };
  }
}

export default async function BeritaPage({ searchParams }: BeritaPageProps) {
  const params = await searchParams;
  const page = Number(params.page) || 1;
  
  const [data, siteConfig] = await Promise.all([
    getPosts(page, params.category),
    getSiteConfig(),
  ]);

  const { posts, categories, pagination } = data;
  const t = getTranslations(siteConfig.language as Language);

  return (
    <main className="flex-1">
      {/* Hero */}
      <section className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">{t.pages.news.title}</h1>
          <p className="text-primary-foreground/80">
            {t.pages.news.description}
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Posts Grid */}
          <div className="flex-1">
            {posts.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <p>{t.pages.news.noNews}</p>
              </div>
            ) : (
              <>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {posts.map((post) => (
                    <Card key={post.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                      <div className="aspect-video relative bg-muted">
                        {post.featuredImg ? (
                          <Image
                            src={post.featuredImg}
                            alt={post.title}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <Calendar className="h-12 w-12 text-muted-foreground/50" />
                          </div>
                        )}
                      </div>
                      <CardHeader className="pb-2">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge
                            style={{ backgroundColor: post.category.color || "#3B82F6" }}
                          >
                            {post.category.name}
                          </Badge>
                        </div>
                        <CardTitle className="text-lg line-clamp-2">
                          <Link href={`/berita/${post.slug}`} className="hover:text-primary">
                            {post.title}
                          </Link>
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                          {post.excerpt}
                        </p>
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <span>{post.publishedAt && formatDate(post.publishedAt)}</span>
                          <span className="flex items-center gap-1">
                            <Eye className="h-3 w-3" />
                            {post.views} {t.pages.news.views}
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* Pagination */}
                {pagination.totalPages > 1 && (
                  <div className="flex items-center justify-center gap-2 mt-8">
                    {page > 1 && (
                      <Button variant="outline" asChild>
                        <Link href={`/berita?page=${page - 1}${params.category ? `&category=${params.category}` : ""}`}>
                          {t.common.previous}
                        </Link>
                      </Button>
                    )}
                    <span className="px-4 py-2 text-sm text-muted-foreground">
                      Halaman {page} dari {pagination.totalPages}
                    </span>
                    {page < pagination.totalPages && (
                      <Button variant="outline" asChild>
                        <Link href={`/berita?page=${page + 1}${params.category ? `&category=${params.category}` : ""}`}>
                          {t.common.next}
                        </Link>
                      </Button>
                    )}
                  </div>
                )}
              </>
            )}
          </div>

          {/* Sidebar */}
          <aside className="w-full lg:w-72 space-y-6">
            {/* Categories */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Kategori</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Link
                  href="/berita"
                  className={`block py-2 px-3 rounded-lg text-sm transition-colors ${
                    !params.category ? "bg-primary text-primary-foreground" : "hover:bg-muted"
                  }`}
                >
                  {t.pages.news.allCategories}
                </Link>
                {categories.map((category) => (
                  <Link
                    key={category.id}
                    href={`/berita?category=${category.slug}`}
                    className={`flex items-center justify-between py-2 px-3 rounded-lg text-sm transition-colors ${
                      params.category === category.slug
                        ? "bg-primary text-primary-foreground"
                        : "hover:bg-muted"
                    }`}
                  >
                    <span>{category.name}</span>
                    <span className="text-xs opacity-70">{category._count.posts}</span>
                  </Link>
                ))}
              </CardContent>
            </Card>
          </aside>
        </div>
      </div>
    </main>
  );
}
