"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { announcementSchema, type AnnouncementInput } from "@/lib/validations";
import type { ApiResponse } from "@/types";

export async function getAnnouncements(params?: {
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

  const [announcements, total] = await Promise.all([
    prisma.announcement.findMany({
      where,
      orderBy: [{ order: "asc" }, { createdAt: "desc" }],
      skip,
      take: limit,
    }),
    prisma.announcement.count({ where }),
  ]);

  return {
    data: announcements,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
}

export async function getAnnouncementById(id: string) {
  const announcement = await prisma.announcement.findUnique({
    where: { id },
  });
  return announcement;
}

export async function getActiveAnnouncements() {
  const now = new Date();
  const announcements = await prisma.announcement.findMany({
    where: {
      isActive: true,
      OR: [
        { startDate: null, endDate: null },
        { startDate: { lte: now }, endDate: null },
        { startDate: null, endDate: { gte: now } },
        { startDate: { lte: now }, endDate: { gte: now } },
      ],
    },
    orderBy: [{ order: "asc" }, { createdAt: "desc" }],
  });
  return announcements;
}

export async function createAnnouncement(data: AnnouncementInput): Promise<ApiResponse> {
  const session = await auth();
  if (!session) {
    return { success: false, error: "Unauthorized" };
  }

  try {
    const validated = announcementSchema.parse(data);

    const announcement = await prisma.announcement.create({
      data: {
        title: validated.title,
        content: validated.content,
        type: validated.type,
        link: validated.link || null,
        linkText: validated.linkText || null,
        startDate: validated.startDate || null,
        endDate: validated.endDate || null,
        isActive: validated.isActive,
        showOnPages: validated.showOnPages || undefined,
        order: validated.order,
      },
    });

    revalidatePath("/admin/announcements");
    revalidatePath("/");
    return { success: true, data: announcement, message: "Pengumuman berhasil dibuat" };
  } catch (error) {
    console.error("Create announcement error:", error);
    return { success: false, error: "Gagal membuat pengumuman" };
  }
}

export async function updateAnnouncement(
  id: string,
  data: Partial<AnnouncementInput>
): Promise<ApiResponse> {
  const session = await auth();
  if (!session) {
    return { success: false, error: "Unauthorized" };
  }

  try {
    const existing = await prisma.announcement.findUnique({ where: { id } });
    if (!existing) {
      return { success: false, error: "Pengumuman tidak ditemukan" };
    }

    const announcement = await prisma.announcement.update({
      where: { id },
      data: {
        title: data.title,
        content: data.content,
        type: data.type,
        link: data.link || null,
        linkText: data.linkText || null,
        startDate: data.startDate || null,
        endDate: data.endDate || null,
        isActive: data.isActive,
        showOnPages: data.showOnPages || undefined,
        order: data.order,
      },
    });

    revalidatePath("/admin/announcements");
    revalidatePath(`/admin/announcements/${id}`);
    revalidatePath("/");
    return { success: true, data: announcement, message: "Pengumuman berhasil diperbarui" };
  } catch (error) {
    console.error("Update announcement error:", error);
    return { success: false, error: "Gagal memperbarui pengumuman" };
  }
}

export async function deleteAnnouncement(id: string): Promise<ApiResponse> {
  const session = await auth();
  if (!session) {
    return { success: false, error: "Unauthorized" };
  }

  try {
    await prisma.announcement.delete({ where: { id } });

    revalidatePath("/admin/announcements");
    revalidatePath("/");
    return { success: true, message: "Pengumuman berhasil dihapus" };
  } catch (error) {
    console.error("Delete announcement error:", error);
    return { success: false, error: "Gagal menghapus pengumuman" };
  }
}

export async function toggleAnnouncementStatus(id: string): Promise<ApiResponse> {
  const session = await auth();
  if (!session) {
    return { success: false, error: "Unauthorized" };
  }

  try {
    const announcement = await prisma.announcement.findUnique({ where: { id } });
    if (!announcement) {
      return { success: false, error: "Pengumuman tidak ditemukan" };
    }

    await prisma.announcement.update({
      where: { id },
      data: { isActive: !announcement.isActive },
    });

    revalidatePath("/admin/announcements");
    revalidatePath("/");
    return {
      success: true,
      message: announcement.isActive
        ? "Pengumuman berhasil dinonaktifkan"
        : "Pengumuman berhasil diaktifkan",
    };
  } catch (error) {
    console.error("Toggle announcement status error:", error);
    return { success: false, error: "Gagal mengubah status pengumuman" };
  }
}
