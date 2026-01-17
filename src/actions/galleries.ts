"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { gallerySchema, galleryItemSchema, type GalleryInput } from "@/lib/validations";
import type { ApiResponse } from "@/types";

// ==========================================
// GALLERY ACTIONS
// ==========================================

export async function getGalleries(params?: {
  page?: number;
  limit?: number;
  search?: string;
  type?: "PHOTO" | "VIDEO" | "MIXED";
  isPublished?: boolean;
}) {
  const page = params?.page || 1;
  const limit = params?.limit || 10;
  const skip = (page - 1) * limit;

  const where: Record<string, unknown> = {};

  if (params?.search) {
    where.OR = [
      { title: { contains: params.search } },
      { description: { contains: params.search } },
    ];
  }

  if (params?.type) {
    where.type = params.type;
  }

  if (params?.isPublished !== undefined) {
    where.isPublished = params.isPublished;
  }

  const [galleries, total] = await Promise.all([
    prisma.gallery.findMany({
      where,
      include: {
        _count: { select: { items: true } },
      },
      orderBy: [{ order: "asc" }, { createdAt: "desc" }],
      skip,
      take: limit,
    }),
    prisma.gallery.count({ where }),
  ]);

  return {
    data: galleries,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
}

export async function getGalleryById(id: string) {
  const gallery = await prisma.gallery.findUnique({
    where: { id },
    include: {
      items: {
        orderBy: { order: "asc" },
      },
    },
  });
  return gallery;
}

export async function getGalleryBySlug(slug: string) {
  const gallery = await prisma.gallery.findUnique({
    where: { slug },
    include: {
      items: {
        orderBy: { order: "asc" },
      },
    },
  });
  return gallery;
}

export async function createGallery(data: GalleryInput): Promise<ApiResponse> {
  const session = await auth();
  if (!session) {
    return { success: false, error: "Unauthorized" };
  }

  try {
    const validated = gallerySchema.parse(data);

    // Check if slug exists
    const existing = await prisma.gallery.findUnique({
      where: { slug: validated.slug },
    });
    if (existing) {
      return { success: false, error: "Slug sudah digunakan" };
    }

    const gallery = await prisma.gallery.create({
      data: {
        title: validated.title,
        slug: validated.slug,
        description: validated.description,
        coverImage: validated.coverImage,
        type: validated.type,
        isPublished: validated.isPublished,
        eventDate: validated.eventDate,
      },
    });

    revalidatePath("/admin/galleries");
    revalidatePath("/galeri");
    return { success: true, data: gallery, message: "Galeri berhasil dibuat" };
  } catch (error) {
    console.error("Create gallery error:", error);
    return { success: false, error: "Gagal membuat galeri" };
  }
}

export async function updateGallery(
  id: string,
  data: Partial<GalleryInput>
): Promise<ApiResponse> {
  const session = await auth();
  if (!session) {
    return { success: false, error: "Unauthorized" };
  }

  try {
    const existing = await prisma.gallery.findUnique({ where: { id } });
    if (!existing) {
      return { success: false, error: "Galeri tidak ditemukan" };
    }

    // Check if new slug conflicts
    if (data.slug && data.slug !== existing.slug) {
      const conflict = await prisma.gallery.findUnique({
        where: { slug: data.slug },
      });
      if (conflict) {
        return { success: false, error: "Slug sudah digunakan" };
      }
    }

    const gallery = await prisma.gallery.update({
      where: { id },
      data: {
        title: data.title,
        slug: data.slug,
        description: data.description,
        coverImage: data.coverImage,
        type: data.type,
        isPublished: data.isPublished,
        eventDate: data.eventDate,
      },
    });

    revalidatePath("/admin/galleries");
    revalidatePath(`/admin/galleries/${id}`);
    revalidatePath("/galeri");
    revalidatePath(`/galeri/${gallery.slug}`);
    return { success: true, data: gallery, message: "Galeri berhasil diperbarui" };
  } catch (error) {
    console.error("Update gallery error:", error);
    return { success: false, error: "Gagal memperbarui galeri" };
  }
}

export async function deleteGallery(id: string): Promise<ApiResponse> {
  const session = await auth();
  if (!session) {
    return { success: false, error: "Unauthorized" };
  }

  try {
    await prisma.gallery.delete({ where: { id } });

    revalidatePath("/admin/galleries");
    revalidatePath("/galeri");
    return { success: true, message: "Galeri berhasil dihapus" };
  } catch (error) {
    console.error("Delete gallery error:", error);
    return { success: false, error: "Gagal menghapus galeri" };
  }
}

export async function toggleGalleryPublish(id: string): Promise<ApiResponse> {
  const session = await auth();
  if (!session) {
    return { success: false, error: "Unauthorized" };
  }

  try {
    const gallery = await prisma.gallery.findUnique({ where: { id } });
    if (!gallery) {
      return { success: false, error: "Galeri tidak ditemukan" };
    }

    await prisma.gallery.update({
      where: { id },
      data: { isPublished: !gallery.isPublished },
    });

    revalidatePath("/admin/galleries");
    revalidatePath("/galeri");
    return {
      success: true,
      message: gallery.isPublished
        ? "Galeri berhasil disembunyikan"
        : "Galeri berhasil dipublikasikan",
    };
  } catch (error) {
    console.error("Toggle gallery publish error:", error);
    return { success: false, error: "Gagal mengubah status galeri" };
  }
}

// ==========================================
// GALLERY ITEM ACTIONS
// ==========================================

export async function addGalleryItems(
  galleryId: string,
  items: { url: string; thumbnail?: string; caption?: string; type?: string }[]
): Promise<ApiResponse> {
  const session = await auth();
  if (!session) {
    return { success: false, error: "Unauthorized" };
  }

  try {
    // Get max order
    const maxOrder = await prisma.galleryItem.aggregate({
      where: { galleryId },
      _max: { order: true },
    });

    const startOrder = (maxOrder._max.order ?? -1) + 1;

    // Validate and prepare all items
    const validatedItems = items.map((item, index) => {
      const validated = galleryItemSchema.parse({
        ...item,
        order: startOrder + index,
      });
      return {
        galleryId,
        url: validated.url,
        thumbnail: validated.thumbnail,
        caption: validated.caption,
        type: validated.type,
        order: validated.order,
      };
    });

    // Batch insert using createMany
    await prisma.galleryItem.createMany({
      data: validatedItems,
    });

    // Update cover image if not set
    const gallery = await prisma.gallery.findUnique({ where: { id: galleryId } });
    if (gallery && !gallery.coverImage && items.length > 0) {
      await prisma.gallery.update({
        where: { id: galleryId },
        data: { coverImage: items[0].url },
      });
    }

    revalidatePath("/admin/galleries");
    revalidatePath(`/admin/galleries/${galleryId}`);
    revalidatePath("/galeri");
    return { success: true, message: `${items.length} item berhasil ditambahkan` };
  } catch (error) {
    console.error("Add gallery items error:", error);
    return { success: false, error: "Gagal menambahkan item galeri" };
  }
}

export async function updateGalleryItem(
  id: string,
  data: { caption?: string; order?: number }
): Promise<ApiResponse> {
  const session = await auth();
  if (!session) {
    return { success: false, error: "Unauthorized" };
  }

  try {
    const item = await prisma.galleryItem.update({
      where: { id },
      data: {
        caption: data.caption,
        order: data.order,
      },
    });

    revalidatePath("/admin/galleries");
    revalidatePath(`/admin/galleries/${item.galleryId}`);
    revalidatePath("/galeri");
    return { success: true, message: "Item berhasil diperbarui" };
  } catch (error) {
    console.error("Update gallery item error:", error);
    return { success: false, error: "Gagal memperbarui item" };
  }
}

export async function deleteGalleryItem(id: string): Promise<ApiResponse> {
  const session = await auth();
  if (!session) {
    return { success: false, error: "Unauthorized" };
  }

  try {
    const item = await prisma.galleryItem.findUnique({ where: { id } });
    if (!item) {
      return { success: false, error: "Item tidak ditemukan" };
    }

    await prisma.galleryItem.delete({ where: { id } });

    revalidatePath("/admin/galleries");
    revalidatePath(`/admin/galleries/${item.galleryId}`);
    revalidatePath("/galeri");
    return { success: true, message: "Item berhasil dihapus" };
  } catch (error) {
    console.error("Delete gallery item error:", error);
    return { success: false, error: "Gagal menghapus item" };
  }
}

export async function reorderGalleryItems(
  items: { id: string; order: number }[]
): Promise<ApiResponse> {
  const session = await auth();
  if (!session) {
    return { success: false, error: "Unauthorized" };
  }

  try {
    // Use transaction for batch updates to avoid N+1 queries
    await prisma.$transaction(
      items.map((item) =>
        prisma.galleryItem.update({
          where: { id: item.id },
          data: { order: item.order },
        })
      )
    );

    revalidatePath("/admin/galleries");
    revalidatePath("/galeri");
    return { success: true, message: "Urutan berhasil diperbarui" };
  } catch (error) {
    console.error("Reorder gallery items error:", error);
    return { success: false, error: "Gagal mengubah urutan" };
  }
}
