import { Metadata } from "next";
import { notFound } from "next/navigation";

import { prisma } from "@/lib/prisma";
import { BlockRenderer } from "@/components/page-builder";
import { PublicHeader } from "@/components/public/header";
import { PublicFooter } from "@/components/public/footer";
import type { Block } from "@/types";

interface DynamicPageProps {
  params: Promise<{
    slug: string[];
  }>;
}

async function getPage(slug: string) {
  const page = await prisma.page.findUnique({
    where: { slug, status: "PUBLISHED" },
    include: {
      author: { select: { name: true } },
    },
  });
  return page;
}

export async function generateMetadata({ params }: DynamicPageProps): Promise<Metadata> {
  const { slug } = await params;
  const fullSlug = slug.join("/");
  const page = await prisma.page.findUnique({
    where: { slug: fullSlug },
    select: { title: true, excerpt: true, seoTitle: true, seoDesc: true, ogImage: true },
  });

  if (!page) {
    return { title: "Halaman tidak ditemukan" };
  }

  return {
    title: page.seoTitle || page.title,
    description: page.seoDesc || page.excerpt || undefined,
    openGraph: {
      title: page.seoTitle || page.title,
      description: page.seoDesc || page.excerpt || undefined,
      images: page.ogImage ? [page.ogImage] : undefined,
    },
  };
}

export default async function DynamicPage({ params }: DynamicPageProps) {
  const { slug } = await params;
  const fullSlug = slug.join("/");
  const page = await getPage(fullSlug);

  if (!page) {
    notFound();
  }

  const content = page.content as unknown as Block[];

  return (
    <>
      <PublicHeader />

      <main className="flex-1">
        {/* Hero */}
        {page.featuredImg ? (
          <section
            className="relative py-24 bg-cover bg-center"
            style={{ backgroundImage: `url(${page.featuredImg})` }}
          >
            <div className="absolute inset-0 bg-black/50" />
            <div className="container mx-auto px-4 relative z-10 text-white text-center">
              <h1 className="text-3xl md:text-5xl font-bold">{page.title}</h1>
              {page.excerpt && (
                <p className="mt-4 text-lg text-white/90 max-w-2xl mx-auto">
                  {page.excerpt}
                </p>
              )}
            </div>
          </section>
        ) : (
          <section className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground py-12">
            <div className="container mx-auto px-4 text-center">
              <h1 className="text-3xl md:text-4xl font-bold">{page.title}</h1>
              {page.excerpt && (
                <p className="mt-4 text-primary-foreground/90 max-w-2xl mx-auto">
                  {page.excerpt}
                </p>
              )}
            </div>
          </section>
        )}

        {/* Content */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              {content && content.length > 0 ? (
                <div className="space-y-8">
                  {content.map((block) => (
                    <BlockRenderer key={block.id} block={block} />
                  ))}
                </div>
              ) : (
                <p className="text-center text-muted-foreground py-12">
                  Konten halaman ini belum tersedia
                </p>
              )}
            </div>
          </div>
        </section>
      </main>

      <PublicFooter />
    </>
  );
}
