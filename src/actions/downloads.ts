"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { downloadSchema, type DownloadInput } from "@/lib/validations";
import type { ApiResponse } from "@/types";

export async function getDownloads(params?: {
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

  const [downloads, total] = await Promise.all([
    prisma.download.findMany({
      where,
      orderBy: [{ order: "asc" }, { createdAt: "desc" }],
      skip,
      take: limit,
    }),
    prisma.download.count({ where }),
  ]);

  return {
    data: downloads,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
}

export async function getDownloadById(id: string) {
  const download = await prisma.download.findUnique({
    where: { id },
  });
  return download;
}

export async function getDownloadCategories() {
  const categories = await prisma.download.findMany({
    where: { isPublished: true },
    select: { category: true },
    distinct: ["category"],
  });
  return categories.map((c) => c.category).filter(Boolean) as string[];
}

export async function getPublishedDownloads(category?: string) {
  const where: Record<string, unknown> = { isPublished: true };
  if (category) {
    where.category = category;
  }

  const downloads = await prisma.download.findMany({
    where,
    orderBy: [{ order: "asc" }, { createdAt: "desc" }],
  });
  return downloads;
}

export async function createDownload(data: DownloadInput): Promise<ApiResponse> {
  const session = await auth();
  if (!session) {
    return { success: false, error: "Unauthorized" };
  }

  try {
    const validated = downloadSchema.parse(data);

    const download = await prisma.download.create({
      data: {
        title: validated.title,
        description: validated.description,
        file: validated.file,
        fileName: validated.fileName,
        fileSize: validated.fileSize,
        fileType: validated.fileType,
        category: validated.category,
        isPublished: validated.isPublished,
        order: validated.order,
      },
    });

    revalidatePath("/admin/downloads");
    revalidatePath("/unduhan");
    return { success: true, data: download, message: "File berhasil ditambahkan" };
  } catch (error) {
    console.error("Create download error:", error);
    return { success: false, error: "Gagal menambahkan file" };
  }
}

export async function updateDownload(
  id: string,
  data: Partial<DownloadInput>
): Promise<ApiResponse> {
  const session = await auth();
  if (!session) {
    return { success: false, error: "Unauthorized" };
  }

  try {
    const existing = await prisma.download.findUnique({ where: { id } });
    if (!existing) {
      return { success: false, error: "File tidak ditemukan" };
    }

    const download = await prisma.download.update({
      where: { id },
      data: {
        title: data.title,
        description: data.description,
        file: data.file,
        fileName: data.fileName,
        fileSize: data.fileSize,
        fileType: data.fileType,
        category: data.category,
        isPublished: data.isPublished,
        order: data.order,
      },
    });

    revalidatePath("/admin/downloads");
    revalidatePath(`/admin/downloads/${id}`);
    revalidatePath("/unduhan");
    return { success: true, data: download, message: "File berhasil diperbarui" };
  } catch (error) {
    console.error("Update download error:", error);
    return { success: false, error: "Gagal memperbarui file" };
  }
}

export async function deleteDownload(id: string): Promise<ApiResponse> {
  const session = await auth();
  if (!session) {
    return { success: false, error: "Unauthorized" };
  }

  try {
    await prisma.download.delete({ where: { id } });

    revalidatePath("/admin/downloads");
    revalidatePath("/unduhan");
    return { success: true, message: "File berhasil dihapus" };
  } catch (error) {
    console.error("Delete download error:", error);
    return { success: false, error: "Gagal menghapus file" };
  }
}

export async function toggleDownloadPublish(id: string): Promise<ApiResponse> {
  const session = await auth();
  if (!session) {
    return { success: false, error: "Unauthorized" };
  }

  try {
    const download = await prisma.download.findUnique({ where: { id } });
    if (!download) {
      return { success: false, error: "File tidak ditemukan" };
    }

    await prisma.download.update({
      where: { id },
      data: { isPublished: !download.isPublished },
    });

    revalidatePath("/admin/downloads");
    revalidatePath("/unduhan");
    return {
      success: true,
      message: download.isPublished
        ? "File berhasil disembunyikan"
        : "File berhasil dipublikasikan",
    };
  } catch (error) {
    console.error("Toggle download publish error:", error);
    return { success: false, error: "Gagal mengubah status file" };
  }
}

export async function incrementDownloadCount(id: string): Promise<ApiResponse> {
  try {
    await prisma.download.update({
      where: { id },
      data: { downloads: { increment: 1 } },
    });
    return { success: true };
  } catch (error) {
    console.error("Increment download count error:", error);
    return { success: false, error: "Gagal memperbarui jumlah unduhan" };
  }
}

export async function reorderDownloads(
  items: { id: string; order: number }[]
): Promise<ApiResponse> {
  const session = await auth();
  if (!session) {
    return { success: false, error: "Unauthorized" };
  }

  try {
    for (const item of items) {
      await prisma.download.update({
        where: { id: item.id },
        data: { order: item.order },
      });
    }

    revalidatePath("/admin/downloads");
    revalidatePath("/unduhan");
    return { success: true, message: "Urutan berhasil diperbarui" };
  } catch (error) {
    console.error("Reorder downloads error:", error);
    return { success: false, error: "Gagal mengubah urutan" };
  }
}
