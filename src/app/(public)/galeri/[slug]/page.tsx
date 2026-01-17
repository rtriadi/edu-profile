import { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { format } from "date-fns";
import { id as localeId } from "date-fns/locale";
import { ArrowLeft, Calendar, Image as ImageIcon, Video } from "lucide-react";

import { Button } from "@/components/ui/button";
import { getGalleryBySlug } from "@/actions/galleries";

interface GalleryDetailPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: GalleryDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const gallery = await getGalleryBySlug(slug);

  if (!gallery) {
    return { title: "Galeri Tidak Ditemukan" };
  }

  return {
    title: gallery.title,
    description: gallery.description || `Galeri foto dan video: ${gallery.title}`,
    openGraph: {
      images: gallery.coverImage ? [gallery.coverImage] : [],
    },
  };
}

export default async function GalleryDetailPage({ params }: GalleryDetailPageProps) {
  const { slug } = await params;
  const gallery = await getGalleryBySlug(slug);

  if (!gallery || !gallery.isPublished) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Back Button */}
      <Button variant="ghost" asChild className="mb-6">
        <Link href="/galeri">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Kembali ke Galeri
        </Link>
      </Button>

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">{gallery.title}</h1>
        {gallery.eventDate && (
          <div className="flex items-center gap-2 text-muted-foreground mb-4">
            <Calendar className="h-4 w-4" />
            <span>
              {format(new Date(gallery.eventDate), "d MMMM yyyy", {
                locale: localeId,
              })}
            </span>
          </div>
        )}
        {gallery.description && (
          <p className="text-muted-foreground">{gallery.description}</p>
        )}
      </div>

      {/* Gallery Grid */}
      {gallery.items.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {gallery.items.map((item) => (
            <div
              key={item.id}
              className="group relative aspect-square rounded-lg overflow-hidden bg-muted"
            >
              {item.type === "video" ? (
                <video
                  src={item.url}
                  className="w-full h-full object-cover"
                  controls
                />
              ) : (
                <Image
                  src={item.url}
                  alt={item.caption || gallery.title}
                  fill
                  className="object-cover transition-transform group-hover:scale-105"
                />
              )}
              
              {/* Overlay */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors">
                <div className="absolute top-2 right-2">
                  {item.type === "video" ? (
                    <Video className="h-5 w-5 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                  ) : (
                    <ImageIcon className="h-5 w-5 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                  )}
                </div>
              </div>

              {/* Caption */}
              {item.caption && (
                <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/70 to-transparent">
                  <p className="text-white text-sm truncate">{item.caption}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 text-muted-foreground">
          <ImageIcon className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>Belum ada item dalam galeri ini</p>
        </div>
      )}
    </div>
  );
}
