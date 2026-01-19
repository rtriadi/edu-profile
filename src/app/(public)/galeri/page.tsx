import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Calendar, Image as ImageIcon } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { prisma } from "@/lib/prisma";
import { formatDate } from "@/lib/utils";
import { getSiteConfig } from "@/lib/site-config";
import { getTranslations, type Language } from "@/lib/translations";

// Dynamic rendering - prevents build-time database errors on Vercel
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Galeri",
  description: "Galeri foto dan video kegiatan sekolah",
};

interface GaleriPageProps {
  searchParams: Promise<{
    page?: string;
    type?: string;
  }>;
}

async function getGalleries(page: number, type?: string) {
  const limit = 12;
  const skip = (page - 1) * limit;

  const where: Record<string, unknown> = { isPublished: true };
  if (type && type !== "all") {
    where.type = type.toUpperCase();
  }

  try {
    const [galleries, total] = await Promise.all([
      prisma.gallery.findMany({
        where,
        include: {
          items: {
            take: 1,
            orderBy: { order: "asc" },
          },
          _count: {
            select: { items: true },
          },
        },
        orderBy: { eventDate: "desc" },
        skip,
        take: limit,
      }),
      prisma.gallery.count({ where }),
    ]);

    return {
      galleries,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  } catch (error) {
    console.error("Error fetching galleries:", error);
    return {
      galleries: [],
      pagination: { page: 1, limit: 12, total: 0, totalPages: 0 },
    };
  }
}

export default async function GaleriPage({ searchParams }: GaleriPageProps) {
  const params = await searchParams;
  const page = Number(params.page) || 1;
  const type = params.type || "all";
  
  const [data, siteConfig] = await Promise.all([
    getGalleries(page, params.type),
    getSiteConfig(),
  ]);

  const { galleries, pagination } = data;
  const t = getTranslations(siteConfig.language as Language);

  return (
    <main className="flex-1">
      {/* Hero */}
      <section className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">{t.pages.gallery.title}</h1>
          <p className="text-primary-foreground/80">
            {t.pages.gallery.description}
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        {/* Filter */}
        <div className="flex justify-center mb-8">
          <div className="flex gap-2 p-1 bg-muted rounded-lg">
            <Link
              href="/galeri"
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                type === "all"
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {t.pages.gallery.allTypes}
            </Link>
            <Link
              href="/galeri?type=photo"
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                type === "photo"
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {t.pages.gallery.photo}
            </Link>
            <Link
              href="/galeri?type=video"
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                type === "video"
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {t.pages.gallery.video}
            </Link>
          </div>
        </div>

        {/* Gallery Grid */}
        {galleries.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <p>{t.pages.gallery.noGallery}</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {galleries.map((gallery) => (
              <Link key={gallery.id} href={`/galeri/${gallery.slug}`}>
                <Card className="overflow-hidden hover:shadow-lg transition-all hover:-translate-y-1 h-full">
                  <div className="aspect-video relative bg-muted group">
                    {gallery.coverImage || (gallery.items[0]?.url) ? (
                      <Image
                        src={gallery.coverImage || gallery.items[0]?.url}
                        alt={gallery.title}
                        fill
                        className="object-cover transition-transform group-hover:scale-105"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <ImageIcon className="h-12 w-12 text-muted-foreground/50" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <Badge variant="secondary" className="pointer-events-none">
                        {gallery._count.items} {t.pages.gallery.items}
                      </Badge>
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-lg mb-1 line-clamp-1">
                      {gallery.title}
                    </h3>
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {gallery.eventDate && formatDate(gallery.eventDate)}
                      </span>
                      <Badge variant="outline" className="text-xs">
                        {gallery.type === "PHOTO" ? t.pages.gallery.photo : t.pages.gallery.video}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-8">
            {page > 1 && (
              <Button variant="outline" asChild>
                <Link href={`/galeri?page=${page - 1}${type !== "all" ? `&type=${type}` : ""}`}>
                  {t.common.previous}
                </Link>
              </Button>
            )}
            <span className="px-4 py-2 text-sm text-muted-foreground">
              Halaman {page} dari {pagination.totalPages}
            </span>
            {page < pagination.totalPages && (
              <Button variant="outline" asChild>
                <Link href={`/galeri?page=${page + 1}${type !== "all" ? `&type=${type}` : ""}`}>
                  {t.common.next}
                </Link>
              </Button>
            )}
          </div>
        )}
      </div>
    </main>
  );
}