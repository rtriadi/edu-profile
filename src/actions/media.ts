"use server";

import { revalidatePath } from "next/cache";
import { put, del } from "@vercel/blob";
import { prisma } from "@/lib/prisma";
import { auth, canAccess } from "@/lib/auth";
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
    // Return empty result instead of throwing to prevent Server Component crash
    return {
      data: [],
      pagination: {
        page: 1,
        limit: params?.limit || 24,
        total: 0,
        totalPages: 0,
      },
    };
  }

  const page = params?.page || 1;
  const limit = params?.limit || 24;
  const skip = (page - 1) * limit;

  const where: Record<string, unknown> = {};
  if (params?.folder) where.folder = params.folder;
  if (params?.type) where.type = params.type;

  try {
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
  } catch (error) {
    console.error("Error fetching media:", error);
    return {
      data: [],
      pagination: {
        page: 1,
        limit,
        total: 0,
        totalPages: 0,
      },
    };
  }
}

export async function uploadMedia(formData: FormData): Promise<ApiResponse> {
  const session = await auth();
  if (!session || !canAccess(session.user.role, "EDITOR")) {
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
      maxSizeMB: 10,
      allowedTypes: ["image", "video", "audio", "document"],
    });

    if (!validation.valid) {
      return { success: false, error: validation.error || "File tidak valid" };
    }

    // Check environment - use Vercel Blob in production, local in development
    const isProduction = process.env.NODE_ENV === "production";
    const hasBlobToken = !!process.env.BLOB_READ_WRITE_TOKEN;

    // In production, we MUST have the blob token
    if (isProduction && !hasBlobToken) {
      console.error("Upload failed: BLOB_READ_WRITE_TOKEN is missing in production");
      return { 
        success: false, 
        error: "Konfigurasi Server Error: Token penyimpanan tidak ditemukan. Harap hubungi administrator." 
      };
    }

    // In development without token, use local storage
    if (!hasBlobToken) {
      console.log("Using local upload (no BLOB_READ_WRITE_TOKEN)");
      return uploadMediaLocal(formData);
    }

    const type = validation.fileType || "other";

    // Sanitize filename - remove special characters and add timestamp
    const timestamp = Date.now();
    const sanitizedName = file.name
      .replace(/[^a-zA-Z0-9._-]/g, "_")
      .replace(/_{2,}/g, "_");
    const uniqueName = `${timestamp}-${sanitizedName}`;

    // Upload to Vercel Blob
    let blob;
    try {
      blob = await put(`${folder}/${uniqueName}`, file, {
        access: "public",
      });
    } catch (blobError) {
      console.error("Vercel Blob upload failed:", blobError);
      // If Blob upload fails in production, return error with details
      if (isProduction) {
        return { 
          success: false, 
          error: `Upload gagal: ${blobError instanceof Error ? blobError.message : 'Unknown error'}. Pastikan BLOB_READ_WRITE_TOKEN sudah dikonfigurasi di Vercel.` 
        };
      }
      // In development, fallback to local
      return uploadMediaLocal(formData);
    }

    // Save to database
    const media = await prisma.media.create({
      data: {
        name: sanitizedName,
        url: blob.url,
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
    return { success: false, error: `Gagal mengupload file: ${error instanceof Error ? error.message : 'Unknown error'}` };
  }
}

export async function deleteMedia(id: string): Promise<ApiResponse> {
  const session = await auth();
  if (!session || !canAccess(session.user.role, "EDITOR")) {
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
  if (!session || !canAccess(session.user.role, "EDITOR")) {
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
  if (!session || !canAccess(session.user.role, "EDITOR")) {
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
