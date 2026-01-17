"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { alumniSchema, type AlumniInput } from "@/lib/validations";
import type { ApiResponse } from "@/types";

export async function getAlumni(params?: {
  page?: number;
  limit?: number;
  search?: string;
  graduationYear?: number;
  isPublished?: boolean;
}) {
  const page = params?.page || 1;
  const limit = params?.limit || 10;
  const skip = (page - 1) * limit;

  const where: Record<string, unknown> = {};

  if (params?.search) {
    where.OR = [
      { name: { contains: params.search } },
      { currentStatus: { contains: params.search } },
      { company: { contains: params.search } },
    ];
  }

  if (params?.graduationYear) {
    where.graduationYear = params.graduationYear;
  }

  if (params?.isPublished !== undefined) {
    where.isPublished = params.isPublished;
  }

  const [alumni, total] = await Promise.all([
    prisma.alumni.findMany({
      where,
      orderBy: [{ graduationYear: "desc" }, { name: "asc" }],
      skip,
      take: limit,
    }),
    prisma.alumni.count({ where }),
  ]);

  return {
    data: alumni,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
}

export async function getAlumniById(id: string) {
  const alumni = await prisma.alumni.findUnique({
    where: { id },
  });
  return alumni;
}

export async function getGraduationYears() {
  const years = await prisma.alumni.findMany({
    where: { isPublished: true },
    select: { graduationYear: true },
    distinct: ["graduationYear"],
    orderBy: { graduationYear: "desc" },
  });
  return years.map((y) => y.graduationYear);
}

export async function getPublishedAlumni(graduationYear?: number, limit?: number) {
  const where: Record<string, unknown> = { isPublished: true };
  if (graduationYear) {
    where.graduationYear = graduationYear;
  }

  const alumni = await prisma.alumni.findMany({
    where,
    orderBy: [{ graduationYear: "desc" }, { name: "asc" }],
    take: limit,
  });
  return alumni;
}

export async function getFeaturedAlumni(limit: number = 6) {
  const alumni = await prisma.alumni.findMany({
    where: { 
      isPublished: true,
      achievement: { not: null },
    },
    orderBy: [{ graduationYear: "desc" }],
    take: limit,
  });
  return alumni;
}

export async function createAlumni(data: AlumniInput): Promise<ApiResponse> {
  const session = await auth();
  if (!session) {
    return { success: false, error: "Unauthorized" };
  }

  try {
    const validated = alumniSchema.parse(data);

    const alumni = await prisma.alumni.create({
      data: {
        name: validated.name,
        graduationYear: validated.graduationYear,
        photo: validated.photo,
        currentStatus: validated.currentStatus,
        company: validated.company,
        achievement: validated.achievement,
        testimonial: validated.testimonial,
        socialMedia: validated.socialMedia,
        isPublished: validated.isPublished,
      },
    });

    revalidatePath("/admin/alumni");
    revalidatePath("/profil/alumni");
    return { success: true, data: alumni, message: "Alumni berhasil ditambahkan" };
  } catch (error) {
    console.error("Create alumni error:", error);
    return { success: false, error: "Gagal menambahkan alumni" };
  }
}

export async function updateAlumni(
  id: string,
  data: Partial<AlumniInput>
): Promise<ApiResponse> {
  const session = await auth();
  if (!session) {
    return { success: false, error: "Unauthorized" };
  }

  try {
    const existing = await prisma.alumni.findUnique({ where: { id } });
    if (!existing) {
      return { success: false, error: "Alumni tidak ditemukan" };
    }

    const alumni = await prisma.alumni.update({
      where: { id },
      data: {
        name: data.name,
        graduationYear: data.graduationYear,
        photo: data.photo,
        currentStatus: data.currentStatus,
        company: data.company,
        achievement: data.achievement,
        testimonial: data.testimonial,
        socialMedia: data.socialMedia,
        isPublished: data.isPublished,
      },
    });

    revalidatePath("/admin/alumni");
    revalidatePath(`/admin/alumni/${id}`);
    revalidatePath("/profil/alumni");
    return { success: true, data: alumni, message: "Alumni berhasil diperbarui" };
  } catch (error) {
    console.error("Update alumni error:", error);
    return { success: false, error: "Gagal memperbarui alumni" };
  }
}

export async function deleteAlumni(id: string): Promise<ApiResponse> {
  const session = await auth();
  if (!session) {
    return { success: false, error: "Unauthorized" };
  }

  try {
    await prisma.alumni.delete({ where: { id } });

    revalidatePath("/admin/alumni");
    revalidatePath("/profil/alumni");
    return { success: true, message: "Alumni berhasil dihapus" };
  } catch (error) {
    console.error("Delete alumni error:", error);
    return { success: false, error: "Gagal menghapus alumni" };
  }
}

export async function toggleAlumniPublish(id: string): Promise<ApiResponse> {
  const session = await auth();
  if (!session) {
    return { success: false, error: "Unauthorized" };
  }

  try {
    const alumni = await prisma.alumni.findUnique({ where: { id } });
    if (!alumni) {
      return { success: false, error: "Alumni tidak ditemukan" };
    }

    await prisma.alumni.update({
      where: { id },
      data: { isPublished: !alumni.isPublished },
    });

    revalidatePath("/admin/alumni");
    revalidatePath("/profil/alumni");
    return {
      success: true,
      message: alumni.isPublished
        ? "Alumni berhasil disembunyikan"
        : "Alumni berhasil dipublikasikan",
    };
  } catch (error) {
    console.error("Toggle alumni publish error:", error);
    return { success: false, error: "Gagal mengubah status alumni" };
  }
}
