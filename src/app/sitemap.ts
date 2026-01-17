import { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://example.com";

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${baseUrl}/profil/visi-misi`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/profil/sejarah`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/profil/guru-staff`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/profil/fasilitas`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/akademik`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/berita`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/galeri`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/agenda`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/unduhan`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.6,
    },
    {
      url: `${baseUrl}/ppdb`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/kontak`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
  ];

  // Dynamic pages
  const pages = await prisma.page.findMany({
    where: { status: "PUBLISHED" },
    select: { slug: true, updatedAt: true },
  });

  const dynamicPages: MetadataRoute.Sitemap = pages.map((page) => ({
    url: `${baseUrl}/${page.slug}`,
    lastModified: page.updatedAt,
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  // Posts/News
  const posts = await prisma.post.findMany({
    where: { status: "PUBLISHED" },
    select: { slug: true, updatedAt: true },
  });

  const postPages: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${baseUrl}/berita/${post.slug}`,
    lastModified: post.updatedAt,
    changeFrequency: "weekly" as const,
    priority: 0.6,
  }));

  // Galleries
  const galleries = await prisma.gallery.findMany({
    where: { isPublished: true },
    select: { slug: true, updatedAt: true },
  });

  const galleryPages: MetadataRoute.Sitemap = galleries.map((gallery) => ({
    url: `${baseUrl}/galeri/${gallery.slug}`,
    lastModified: gallery.updatedAt,
    changeFrequency: "monthly" as const,
    priority: 0.5,
  }));

  // Programs
  const programs = await prisma.program.findMany({
    where: { isActive: true },
    select: { slug: true, updatedAt: true },
  });

  const programPages: MetadataRoute.Sitemap = programs.map((program) => ({
    url: `${baseUrl}/akademik/${program.slug}`,
    lastModified: program.updatedAt,
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  // Events
  const events = await prisma.event.findMany({
    where: { isPublished: true },
    select: { slug: true, updatedAt: true },
  });

  const eventPages: MetadataRoute.Sitemap = events.map((event) => ({
    url: `${baseUrl}/agenda/${event.slug}`,
    lastModified: event.updatedAt,
    changeFrequency: "weekly" as const,
    priority: 0.5,
  }));

  return [
    ...staticPages,
    ...dynamicPages,
    ...postPages,
    ...galleryPages,
    ...programPages,
    ...eventPages,
  ];
}
