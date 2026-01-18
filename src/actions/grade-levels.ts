"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import type { ApiResponse } from "@/types";

// ==========================================
// PUBLIC - Get Grade Levels
// ==========================================

export async function getActiveGradeLevels() {
  const gradeLevels = await prisma.gradeLevel.findMany({
    where: { isActive: true },
    orderBy: { order: "asc" },
  });
  return gradeLevels;
}

// ==========================================
// ADMIN - CRUD Operations
// ==========================================

export async function getGradeLevels(params?: {
  page?: number;
  limit?: number;
  isActive?: boolean;
}) {
  const page = params?.page || 1;
  const limit = params?.limit || 10;
  const skip = (page - 1) * limit;

  const where: Record<string, unknown> = {};
  if (params?.isActive !== undefined) {
    where.isActive = params.isActive;
  }

  const [gradeLevels, total] = await Promise.all([
    prisma.gradeLevel.findMany({
      where,
      orderBy: { order: "asc" },
      skip,
      take: limit,
    }),
    prisma.gradeLevel.count({ where }),
  ]);

  return {
    data: gradeLevels,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
}

export async function getGradeLevelById(id: string) {
  const gradeLevel = await prisma.gradeLevel.findUnique({
    where: { id },
  });
  return gradeLevel;
}

export async function createGradeLevel(data: {
  name: string;
  slug: string;
  description?: string;
  ageRange?: string;
  minAge?: number;
  maxAge?: number;
  quota?: number;
  image?: string;
  icon?: string;
  features?: string[];
  isActive?: boolean;
  order?: number;
}): Promise<ApiResponse> {
  const session = await auth();
  if (!session) {
    return { success: false, error: "Unauthorized" };
  }

  try {
    // Check if slug already exists
    const existing = await prisma.gradeLevel.findUnique({
      where: { slug: data.slug },
    });

    if (existing) {
      return { success: false, error: "Slug sudah digunakan" };
    }

    const gradeLevel = await prisma.gradeLevel.create({
      data: {
        name: data.name,
        slug: data.slug,
        description: data.description,
        ageRange: data.ageRange,
        minAge: data.minAge,
        maxAge: data.maxAge,
        quota: data.quota,
        image: data.image,
        icon: data.icon,
        features: data.features,
        isActive: data.isActive ?? true,
        order: data.order ?? 0,
      },
    });

    revalidatePath("/admin/grade-levels");
    revalidatePath("/");
    return { success: true, data: gradeLevel, message: "Kelas berhasil dibuat" };
  } catch (error) {
    console.error("Create grade level error:", error);
    return { success: false, error: "Gagal membuat kelas" };
  }
}

export async function updateGradeLevel(
  id: string,
  data: {
    name?: string;
    slug?: string;
    description?: string;
    ageRange?: string;
    minAge?: number;
    maxAge?: number;
    quota?: number;
    image?: string;
    icon?: string;
    features?: string[];
    isActive?: boolean;
    order?: number;
  }
): Promise<ApiResponse> {
  const session = await auth();
  if (!session) {
    return { success: false, error: "Unauthorized" };
  }

  try {
    // Check if slug already exists (for other records)
    if (data.slug) {
      const existing = await prisma.gradeLevel.findFirst({
        where: { slug: data.slug, NOT: { id } },
      });

      if (existing) {
        return { success: false, error: "Slug sudah digunakan" };
      }
    }

    const gradeLevel = await prisma.gradeLevel.update({
      where: { id },
      data,
    });

    revalidatePath("/admin/grade-levels");
    revalidatePath(`/admin/grade-levels/${id}`);
    revalidatePath("/");
    return { success: true, data: gradeLevel, message: "Kelas berhasil diperbarui" };
  } catch (error) {
    console.error("Update grade level error:", error);
    return { success: false, error: "Gagal memperbarui kelas" };
  }
}

export async function deleteGradeLevel(id: string): Promise<ApiResponse> {
  const session = await auth();
  if (!session) {
    return { success: false, error: "Unauthorized" };
  }

  try {
    await prisma.gradeLevel.delete({ where: { id } });

    revalidatePath("/admin/grade-levels");
    revalidatePath("/");
    return { success: true, message: "Kelas berhasil dihapus" };
  } catch (error) {
    console.error("Delete grade level error:", error);
    return { success: false, error: "Gagal menghapus kelas" };
  }
}

export async function toggleGradeLevelActive(id: string): Promise<ApiResponse> {
  const session = await auth();
  if (!session) {
    return { success: false, error: "Unauthorized" };
  }

  try {
    const gradeLevel = await prisma.gradeLevel.findUnique({ where: { id } });
    if (!gradeLevel) {
      return { success: false, error: "Kelas tidak ditemukan" };
    }

    await prisma.gradeLevel.update({
      where: { id },
      data: { isActive: !gradeLevel.isActive },
    });

    revalidatePath("/admin/grade-levels");
    revalidatePath("/");
    return {
      success: true,
      message: gradeLevel.isActive ? "Kelas dinonaktifkan" : "Kelas diaktifkan",
    };
  } catch (error) {
    console.error("Toggle grade level active error:", error);
    return { success: false, error: "Gagal mengubah status kelas" };
  }
}
