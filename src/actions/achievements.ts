"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import type { ApiResponse } from "@/types";

// ==========================================
// ACHIEVEMENT ACTIONS
// ==========================================

export async function getAchievements(params?: {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
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

  if (params?.category) {
    where.category = params.category;
  }

  if (params?.isPublished !== undefined) {
    where.isPublished = params.isPublished;
  }

  const [achievements, total] = await Promise.all([
    prisma.achievement.findMany({
      where,
      orderBy: [{ date: "desc" }, { createdAt: "desc" }],
      skip,
      take: limit,
    }),
    prisma.achievement.count({ where }),
  ]);

  return {
    data: achievements,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
}

export async function getAchievementById(id: string) {
  const achievement = await prisma.achievement.findUnique({
    where: { id },
  });
  return achievement;
}

export async function createAchievement(data: {
  title: string;
  description?: string;
  category?: string;
  level?: string;
  date?: Date;
  image?: string;
  participants?: string;
  isPublished?: boolean;
}): Promise<ApiResponse> {
  const session = await auth();
  if (!session) {
    return { success: false, error: "Unauthorized" };
  }

  try {
    const achievement = await prisma.achievement.create({
      data: {
        title: data.title,
        description: data.description,
        category: data.category,
        level: data.level,
        date: data.date,
        image: data.image,
        participants: data.participants,
        isPublished: data.isPublished ?? true,
      },
    });

    revalidatePath("/admin/achievements");
    return { success: true, data: achievement, message: "Prestasi berhasil ditambahkan" };
  } catch (error) {
    console.error("Create achievement error:", error);
    return { success: false, error: "Gagal menambahkan prestasi" };
  }
}

export async function updateAchievement(
  id: string,
  data: {
    title?: string;
    description?: string;
    category?: string;
    level?: string;
    date?: Date;
    image?: string;
    participants?: string;
    isPublished?: boolean;
  }
): Promise<ApiResponse> {
  const session = await auth();
  if (!session) {
    return { success: false, error: "Unauthorized" };
  }

  try {
    const achievement = await prisma.achievement.update({
      where: { id },
      data,
    });

    revalidatePath("/admin/achievements");
    revalidatePath(`/admin/achievements/${id}`);
    return { success: true, data: achievement, message: "Prestasi berhasil diperbarui" };
  } catch (error) {
    console.error("Update achievement error:", error);
    return { success: false, error: "Gagal memperbarui prestasi" };
  }
}

export async function deleteAchievement(id: string): Promise<ApiResponse> {
  const session = await auth();
  if (!session) {
    return { success: false, error: "Unauthorized" };
  }

  try {
    await prisma.achievement.delete({ where: { id } });

    revalidatePath("/admin/achievements");
    return { success: true, message: "Prestasi berhasil dihapus" };
  } catch (error) {
    console.error("Delete achievement error:", error);
    return { success: false, error: "Gagal menghapus prestasi" };
  }
}

export async function toggleAchievementPublish(id: string): Promise<ApiResponse> {
  const session = await auth();
  if (!session) {
    return { success: false, error: "Unauthorized" };
  }

  try {
    const achievement = await prisma.achievement.findUnique({ where: { id } });
    if (!achievement) {
      return { success: false, error: "Prestasi tidak ditemukan" };
    }

    await prisma.achievement.update({
      where: { id },
      data: { isPublished: !achievement.isPublished },
    });

    revalidatePath("/admin/achievements");
    return {
      success: true,
      message: achievement.isPublished
        ? "Prestasi berhasil disembunyikan"
        : "Prestasi berhasil dipublikasikan",
    };
  } catch (error) {
    console.error("Toggle achievement publish error:", error);
    return { success: false, error: "Gagal mengubah status prestasi" };
  }
}
