"use server";

import { revalidatePath } from "next/cache";
import { put, del } from "@vercel/blob";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import type { ApiResponse } from "@/types";

export async function getMedia(params?: {
  page?: number;
  limit?: number;
  folder?: string;
  type?: string;
}) {
  const session = await auth();
  if (!session) {
    throw new Error("Unauthorized");
  }

  const page = params?.page || 1;
  const limit = params?.limit || 24;
  const skip = (page - 1) * limit;

  const where: Record<string, unknown> = {};
  if (params?.folder) where.folder = params.folder;
  if (params?.type) where.type = params.type;

  const [media, total] = await Promise.all([
    prisma.media.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
    }),
    prisma.media.count({ where }),
  ]);

  return {
    data: media,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
}

export async function uploadMedia(formData: FormData): Promise<ApiResponse> {
  const session = await auth();
  if (!session) {
    return { success: false, error: "Unauthorized" };
  }

  try {
    const file = formData.get("file") as File;
    const folder = (formData.get("folder") as string) || "general";

    if (!file) {
      return { success: false, error: "File tidak ditemukan" };
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      return { success: false, error: "Ukuran file maksimal 10MB" };
    }

    // Determine file type
    let type = "other";
    if (file.type.startsWith("image/")) type = "image";
    else if (file.type.startsWith("video/")) type = "video";
    else if (file.type.startsWith("audio/")) type = "audio";
    else if (
      file.type.includes("pdf") ||
      file.type.includes("document") ||
      file.type.includes("sheet") ||
      file.type.includes("presentation")
    ) {
      type = "document";
    }

    // Upload to Vercel Blob
    const blob = await put(`${folder}/${file.name}`, file, {
      access: "public",
    });

    // Get image dimensions if it's an image
    let width: number | undefined;
    let height: number | undefined;

    // Save to database
    const media = await prisma.media.create({
      data: {
        name: file.name,
        url: blob.url,
        type,
        mimeType: file.type,
        size: file.size,
        width,
        height,
        folder,
      },
    });

    revalidatePath("/admin/media");
    return { success: true, data: media, message: "File berhasil diupload" };
  } catch (error) {
    console.error("Upload error:", error);
    return { success: false, error: "Gagal mengupload file" };
  }
}

export async function deleteMedia(id: string): Promise<ApiResponse> {
  const session = await auth();
  if (!session) {
    return { success: false, error: "Unauthorized" };
  }

  try {
    const media = await prisma.media.findUnique({ where: { id } });
    if (!media) {
      return { success: false, error: "Media tidak ditemukan" };
    }

    // Delete from Vercel Blob
    try {
      await del(media.url);
    } catch (e) {
      console.error("Failed to delete from blob:", e);
    }

    // Delete from database
    await prisma.media.delete({ where: { id } });

    revalidatePath("/admin/media");
    return { success: true, message: "File berhasil dihapus" };
  } catch (error) {
    console.error("Delete media error:", error);
    return { success: false, error: "Gagal menghapus file" };
  }
}

export async function updateMediaAlt(
  id: string,
  alt: string
): Promise<ApiResponse> {
  const session = await auth();
  if (!session) {
    return { success: false, error: "Unauthorized" };
  }

  try {
    await prisma.media.update({
      where: { id },
      data: { alt },
    });

    revalidatePath("/admin/media");
    return { success: true, message: "Alt text berhasil diperbarui" };
  } catch (error) {
    console.error("Update media alt error:", error);
    return { success: false, error: "Gagal memperbarui alt text" };
  }
}

// Local file upload for development (without Vercel Blob)
export async function uploadMediaLocal(formData: FormData): Promise<ApiResponse> {
  const session = await auth();
  if (!session) {
    return { success: false, error: "Unauthorized" };
  }

  try {
    const file = formData.get("file") as File;
    const folder = (formData.get("folder") as string) || "general";

    if (!file) {
      return { success: false, error: "File tidak ditemukan" };
    }

    // For local development, we'll store the file info but use a placeholder URL
    // In production, use uploadMedia with Vercel Blob
    
    let type = "other";
    if (file.type.startsWith("image/")) type = "image";
    else if (file.type.startsWith("video/")) type = "video";
    else if (file.type.startsWith("audio/")) type = "audio";
    else if (
      file.type.includes("pdf") ||
      file.type.includes("document")
    ) {
      type = "document";
    }

    // Create a data URL for development
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64 = buffer.toString("base64");
    const dataUrl = `data:${file.type};base64,${base64}`;

    const media = await prisma.media.create({
      data: {
        name: file.name,
        url: dataUrl,
        type,
        mimeType: file.type,
        size: file.size,
        folder,
      },
    });

    revalidatePath("/admin/media");
    return { success: true, data: media, message: "File berhasil diupload" };
  } catch (error) {
    console.error("Upload error:", error);
    return { success: false, error: "Gagal mengupload file" };
  }
}
