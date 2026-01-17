import { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Calendar, User, Eye, ArrowLeft, Share2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { prisma } from "@/lib/prisma";
import { formatDate } from "@/lib/utils";
import { BlockRenderer } from "@/components/page-builder";
import { PublicHeader } from "@/components/public/header";
import { PublicFooter } from "@/components/public/footer";
import type { Block } from "@/types";

interface PostPageProps {
  params: Promise<{
    slug: string;
  }>;
}

async function getPost(slug: string) {
  const post = await prisma.post.findUnique({
    where: { slug, status: "PUBLISHED" },
    include: {
      category: true,
      author: { select: { name: true, image: true } },
      tags: { include: { tag: true } },
    },
  });

  if (post) {
    // Increment view
    await prisma.post.update({
      where: { id: post.id },
      data: { views: { increment: 1 } },
    });
  }

  return post;
}

async function getRelatedPosts(categoryId: string, currentId: string) {
  return prisma.post.findMany({
    where: {
      categoryId,
      status: "PUBLISHED",
      NOT: { id: currentId },
    },
    take: 3,
    orderBy: { publishedAt: "desc" },
    select: {
      id: true,
      title: true,
      slug: true,
      featuredImg: true,
      publishedAt: true,
    },
  });
}

export async function generateMetadata({ params }: PostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await prisma.post.findUnique({
    where: { slug },
    select: { title: true, excerpt: true, seoTitle: true, seoDesc: true, featuredImg: true },
  });

  if (!post) {
    return { title: "Berita tidak ditemukan" };
  }

  return {
    title: post.seoTitle || post.title,
    description: post.seoDesc || post.excerpt || undefined,
    openGraph: {
      title: post.seoTitle || post.title,
      description: post.seoDesc || post.excerpt || undefined,
      images: post.featuredImg ? [post.featuredImg] : undefined,
    },
  };
}

export default async function PostPage({ params }: PostPageProps) {
  const { slug } = await params;
  const post = await getPost(slug);

  if (!post) {
    notFound();
  }

  const relatedPosts = await getRelatedPosts(post.categoryId, post.id);
  const content = post.content as unknown as Block[];

  return (
    <>
      <PublicHeader />

      <main className="flex-1">
        {/* Hero Image */}
        {post.featuredImg && (
          <div className="relative h-[300px] md:h-[400px] bg-muted">
            <Image
              src={post.featuredImg}
              alt={post.title}
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          </div>
        )}

        <div className="container mx-auto px-4 py-8">
          <div className="max-w-3xl mx-auto">
            {/* Back Button */}
            <Button variant="ghost" asChild className="mb-6">
              <Link href="/berita">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Kembali ke Berita
              </Link>
            </Button>

            {/* Article Header */}
            <article>
              <header className="mb-8">
                <Badge
                  className="mb-4"
                  style={{ backgroundColor: post.category.color || "#3B82F6" }}
                >
                  {post.category.name}
                </Badge>
                
                <h1 className="text-3xl md:text-4xl font-bold mb-4">
                  {post.title}
                </h1>

                <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    <span>{post.author.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <span>{post.publishedAt && formatDate(post.publishedAt)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Eye className="h-4 w-4" />
                    <span>{post.views} views</span>
                  </div>
                </div>

                {/* Tags */}
                {post.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-4">
                    {post.tags.map(({ tag }) => (
                      <Badge key={tag.id} variant="secondary">
                        #{tag.name}
                      </Badge>
                    ))}
                  </div>
                )}
              </header>

              {/* Excerpt */}
              {post.excerpt && (
                <p className="text-lg text-muted-foreground mb-8 italic">
                  {post.excerpt}
                </p>
              )}

              {/* Content */}
              <div className="prose prose-lg max-w-none dark:prose-invert">
                {content && content.length > 0 ? (
                  <div className="space-y-6">
                    {content.map((block) => (
                      <BlockRenderer key={block.id} block={block} />
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground">Konten tidak tersedia</p>
                )}
              </div>

              {/* Share */}
              <div className="mt-8 pt-8 border-t">
                <div className="flex items-center gap-4">
                  <span className="text-sm text-muted-foreground">Bagikan:</span>
                  <Button variant="outline" size="sm">
                    <Share2 className="h-4 w-4 mr-2" />
                    Share
                  </Button>
                </div>
              </div>
            </article>

            {/* Related Posts */}
            {relatedPosts.length > 0 && (
              <section className="mt-12">
                <h2 className="text-2xl font-bold mb-6">Berita Terkait</h2>
                <div className="grid md:grid-cols-3 gap-4">
                  {relatedPosts.map((related) => (
                    <Card key={related.id} className="overflow-hidden">
                      <div className="aspect-video relative bg-muted">
                        {related.featuredImg ? (
                          <Image
                            src={related.featuredImg}
                            alt={related.title}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <Calendar className="h-8 w-8 text-muted-foreground/50" />
                          </div>
                        )}
                      </div>
                      <CardContent className="p-4">
                        <h3 className="font-medium line-clamp-2">
                          <Link href={`/berita/${related.slug}`} className="hover:text-primary">
                            {related.title}
                          </Link>
                        </h3>
                        <p className="text-xs text-muted-foreground mt-2">
                          {related.publishedAt && formatDate(related.publishedAt)}
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </section>
            )}
          </div>
        </div>
      </main>

      <PublicFooter />
    </>
  );
}
