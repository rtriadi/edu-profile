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
import { getPosts, getCategories } from "@/actions/posts";
import { getLocale } from "@/actions/locale";

// Dynamic rendering - prevents build-time database errors on Vercel
export const revalidate = 60;

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

export default async function BeritaPage({ searchParams }: BeritaPageProps) {
  const params = await searchParams;
  const page = Number(params.page) || 1;
  const locale = await getLocale();
  
  const [postsData, categories, siteConfig] = await Promise.all([
    getPosts({ 
      page, 
      limit: 9, 
      categorySlug: params.category,
      status: "PUBLISHED",
      locale
    }),
    getCategories(),
    getSiteConfig(),
  ]);

  const { data: posts, pagination } = postsData;
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
                    <article key={post.id}>
                    <Card className="overflow-hidden hover:shadow-lg transition-shadow h-full">
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
                          {post.publishedAt && (
                            <time dateTime={post.publishedAt.toISOString()}>
                              {formatDate(post.publishedAt)}
                            </time>
                          )}
                          <span className="flex items-center gap-1">
                            <Eye className="h-3 w-3" />
                            {post.views} {t.pages.news.views}
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                    </article>
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
