"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { facilitySchema, type FacilityInput } from "@/lib/validations";
import type { ApiResponse } from "@/types";

export async function getFacilities(params?: {
  page?: number;
  limit?: number;
  search?: string;
  isPublished?: boolean;
}) {
  const page = params?.page || 1;
  const limit = params?.limit || 10;
  const skip = (page - 1) * limit;

  const where: Record<string, unknown> = {};

  if (params?.search) {
    where.OR = [
      { name: { contains: params.search } },
      { description: { contains: params.search } },
    ];
  }

  if (params?.isPublished !== undefined) {
    where.isPublished = params.isPublished;
  }

  const [facilities, total] = await Promise.all([
    prisma.facility.findMany({
      where,
      orderBy: [{ order: "asc" }, { name: "asc" }],
      skip,
      take: limit,
    }),
    prisma.facility.count({ where }),
  ]);

  return {
    data: facilities,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
}

export async function getFacilityById(id: string) {
  const facility = await prisma.facility.findUnique({
    where: { id },
  });
  return facility;
}

export async function getFacilityBySlug(slug: string) {
  const facility = await prisma.facility.findUnique({
    where: { slug },
  });
  return facility;
}

export async function getPublishedFacilities() {
  const facilities = await prisma.facility.findMany({
    where: { isPublished: true },
    orderBy: [{ order: "asc" }, { name: "asc" }],
  });
  return facilities;
}

export async function createFacility(data: FacilityInput): Promise<ApiResponse> {
  const session = await auth();
  if (!session) {
    return { success: false, error: "Unauthorized" };
  }

  try {
    const validated = facilitySchema.parse(data);

    // Check if slug exists
    const existing = await prisma.facility.findUnique({
      where: { slug: validated.slug },
    });
    if (existing) {
      return { success: false, error: "Slug sudah digunakan" };
    }

    const facility = await prisma.facility.create({
      data: {
        name: validated.name,
        slug: validated.slug,
        description: validated.description,
        images: validated.images,
        icon: validated.icon,
        features: validated.features,
        isPublished: validated.isPublished,
        order: validated.order,
      },
    });

    revalidatePath("/admin/facilities");
    revalidatePath("/profil/fasilitas");
    return { success: true, data: facility, message: "Fasilitas berhasil dibuat" };
  } catch (error) {
    console.error("Create facility error:", error);
    return { success: false, error: "Gagal membuat fasilitas" };
  }
}

export async function updateFacility(
  id: string,
  data: Partial<FacilityInput>
): Promise<ApiResponse> {
  const session = await auth();
  if (!session) {
    return { success: false, error: "Unauthorized" };
  }

  try {
    const existing = await prisma.facility.findUnique({ where: { id } });
    if (!existing) {
      return { success: false, error: "Fasilitas tidak ditemukan" };
    }

    // Check if new slug conflicts
    if (data.slug && data.slug !== existing.slug) {
      const conflict = await prisma.facility.findUnique({
        where: { slug: data.slug },
      });
      if (conflict) {
        return { success: false, error: "Slug sudah digunakan" };
      }
    }

    const facility = await prisma.facility.update({
      where: { id },
      data: {
        name: data.name,
        slug: data.slug,
        description: data.description,
        images: data.images,
        icon: data.icon,
        features: data.features,
        isPublished: data.isPublished,
        order: data.order,
      },
    });

    revalidatePath("/admin/facilities");
    revalidatePath(`/admin/facilities/${id}`);
    revalidatePath("/profil/fasilitas");
    revalidatePath(`/profil/fasilitas/${facility.slug}`);
    return { success: true, data: facility, message: "Fasilitas berhasil diperbarui" };
  } catch (error) {
    console.error("Update facility error:", error);
    return { success: false, error: "Gagal memperbarui fasilitas" };
  }
}

export async function deleteFacility(id: string): Promise<ApiResponse> {
  const session = await auth();
  if (!session) {
    return { success: false, error: "Unauthorized" };
  }

  try {
    await prisma.facility.delete({ where: { id } });

    revalidatePath("/admin/facilities");
    revalidatePath("/profil/fasilitas");
    return { success: true, message: "Fasilitas berhasil dihapus" };
  } catch (error) {
    console.error("Delete facility error:", error);
    return { success: false, error: "Gagal menghapus fasilitas" };
  }
}

export async function toggleFacilityPublish(id: string): Promise<ApiResponse> {
  const session = await auth();
  if (!session) {
    return { success: false, error: "Unauthorized" };
  }

  try {
    const facility = await prisma.facility.findUnique({ where: { id } });
    if (!facility) {
      return { success: false, error: "Fasilitas tidak ditemukan" };
    }

    await prisma.facility.update({
      where: { id },
      data: { isPublished: !facility.isPublished },
    });

    revalidatePath("/admin/facilities");
    revalidatePath("/profil/fasilitas");
    return {
      success: true,
      message: facility.isPublished
        ? "Fasilitas berhasil disembunyikan"
        : "Fasilitas berhasil dipublikasikan",
    };
  } catch (error) {
    console.error("Toggle facility publish error:", error);
    return { success: false, error: "Gagal mengubah status fasilitas" };
  }
}

export async function reorderFacilities(
  items: { id: string; order: number }[]
): Promise<ApiResponse> {
  const session = await auth();
  if (!session) {
    return { success: false, error: "Unauthorized" };
  }

  try {
    for (const item of items) {
      await prisma.facility.update({
        where: { id: item.id },
        data: { order: item.order },
      });
    }

    revalidatePath("/admin/facilities");
    revalidatePath("/profil/fasilitas");
    return { success: true, message: "Urutan fasilitas berhasil diperbarui" };
  } catch (error) {
    console.error("Reorder facilities error:", error);
    return { success: false, error: "Gagal mengubah urutan fasilitas" };
  }
}
