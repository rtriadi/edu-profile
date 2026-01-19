"use server";

import { revalidatePath } from "next/cache";
import { put, del } from "@vercel/blob";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { validateFile } from "@/lib/security";
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
    // Auto-detect environment: use Vercel Blob in production, local storage in development
    if (!process.env.BLOB_READ_WRITE_TOKEN) {
      // Fall back to local upload for development
      return uploadMediaLocal(formData);
    }

    const file = formData.get("file") as File;
    const folder = (formData.get("folder") as string) || "general";

    if (!file) {
      return { success: false, error: "File tidak ditemukan" };
    }

    // Validate file (size, MIME type, and extension)
    const validation = validateFile(file, {
      maxSizeMB: 10,
      allowedTypes: ["image", "video", "audio", "document"],
    });

    if (!validation.valid) {
      return { success: false, error: validation.error || "File tidak valid" };
    }

    const type = validation.fileType || "other";

    // Sanitize filename - remove special characters
    const sanitizedName = file.name
      .replace(/[^a-zA-Z0-9._-]/g, "_")
      .replace(/_{2,}/g, "_");

    // Upload to Vercel Blob
    const blob = await put(`${folder}/${sanitizedName}`, file, {
      access: "public",
    });

    // Get image dimensions if it's an image
    let width: number | undefined;
    let height: number | undefined;

    // Save to database
    const media = await prisma.media.create({
      data: {
        name: sanitizedName,
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

    // Delete file based on URL type
    if (media.url.startsWith("/uploads/")) {
      // Local file - delete from filesystem
      try {
        const fs = await import("fs/promises");
        const path = await import("path");
        const filePath = path.join(process.cwd(), "public", media.url);
        await fs.unlink(filePath);
      } catch (e) {
        console.error("Failed to delete local file:", e);
      }
    } else if (media.url.startsWith("https://")) {
      // Vercel Blob - delete from blob storage
      try {
        await del(media.url);
      } catch (e) {
        console.error("Failed to delete from blob:", e);
      }
    }
    // Skip deletion for data: URLs (legacy base64)

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
/**
 * Local file upload for development (without Vercel Blob)
 * Stores files in public/uploads directory for local development.
 * For production, use uploadMedia with Vercel Blob instead.
 */
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

    // Validate file (size, MIME type, and extension)
    const validation = validateFile(file, {
      maxSizeMB: 10, // Same limit as Vercel Blob
      allowedTypes: ["image", "video", "audio", "document"],
    });

    if (!validation.valid) {
      return { success: false, error: validation.error || "File tidak valid" };
    }

    const type = validation.fileType || "other";

    // Sanitize filename and add timestamp to prevent collisions
    const timestamp = Date.now();
    const sanitizedName = file.name
      .replace(/[^a-zA-Z0-9._-]/g, "_")
      .replace(/_{2,}/g, "_");
    const uniqueName = `${timestamp}-${sanitizedName}`;

    // Write file to public/uploads directory
    const fs = await import("fs/promises");
    const path = await import("path");
    
    const uploadsDir = path.join(process.cwd(), "public", "uploads", folder);
    
    // Create folder if it doesn't exist
    await fs.mkdir(uploadsDir, { recursive: true });
    
    const filePath = path.join(uploadsDir, uniqueName);
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    await fs.writeFile(filePath, buffer);
    
    // URL path for accessing the file
    const url = `/uploads/${folder}/${uniqueName}`;

    const media = await prisma.media.create({
      data: {
        name: sanitizedName,
        url,
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
