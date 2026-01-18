import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Calendar, Image as ImageIcon } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { prisma } from "@/lib/prisma";
import { formatDate } from "@/lib/utils";

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
  const { galleries, pagination } = await getGalleries(page, params.type);

  return (
    <main className="flex-1">
      {/* Hero */}
      <section className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Galeri</h1>
          <p className="text-primary-foreground/80">
            Dokumentasi foto dan video kegiatan sekolah
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        {/* Filter */}
        <div className="flex items-center gap-2 mb-8">
          <Link
            href="/galeri"
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              !params.type || params.type === "all"
                ? "bg-primary text-primary-foreground"
                : "bg-muted hover:bg-muted/80"
            }`}
          >
            Semua
          </Link>
          <Link
            href="/galeri?type=photo"
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              params.type === "photo"
                ? "bg-primary text-primary-foreground"
                : "bg-muted hover:bg-muted/80"
            }`}
          >
            Foto
          </Link>
          <Link
            href="/galeri?type=video"
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              params.type === "video"
                ? "bg-primary text-primary-foreground"
                : "bg-muted hover:bg-muted/80"
            }`}
          >
            Video
          </Link>
        </div>

        {/* Gallery Grid */}
        {galleries.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <ImageIcon className="h-16 w-16 mx-auto mb-4 opacity-50" />
            <p>Belum ada galeri yang dipublikasikan</p>
          </div>
        ) : (
          <>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {galleries.map((gallery) => (
                <Card key={gallery.id} className="overflow-hidden group">
                  <Link href={`/galeri/${gallery.slug}`}>
                    <div className="aspect-video relative bg-muted">
                      {gallery.coverImage || gallery.items[0]?.url ? (
                        <Image
                          src={gallery.coverImage || gallery.items[0]?.url}
                          alt={gallery.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <ImageIcon className="h-12 w-12 text-muted-foreground/50" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <span className="text-white font-medium">
                          Lihat Album
                        </span>
                      </div>
                      <Badge className="absolute top-2 right-2" variant="secondary">
                        {gallery._count.items} item
                      </Badge>
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-semibold line-clamp-1 group-hover:text-primary transition-colors">
                        {gallery.title}
                      </h3>
                      {gallery.eventDate && (
                        <p className="text-sm text-muted-foreground mt-1 flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {formatDate(gallery.eventDate)}
                        </p>
                      )}
                    </CardContent>
                  </Link>
                </Card>
              ))}
            </div>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-8">
                {page > 1 && (
                  <Button variant="outline" asChild>
                    <Link
                      href={`/galeri?page=${page - 1}${params.type ? `&type=${params.type}` : ""}`}
                    >
                      Sebelumnya
                    </Link>
                  </Button>
                )}
                <span className="px-4 py-2 text-sm text-muted-foreground">
                  Halaman {page} dari {pagination.totalPages}
                </span>
                {page < pagination.totalPages && (
                  <Button variant="outline" asChild>
                    <Link
                      href={`/galeri?page=${page + 1}${params.type ? `&type=${params.type}` : ""}`}
                    >
                      Selanjutnya
                    </Link>
                  </Button>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </main>
  );
}
