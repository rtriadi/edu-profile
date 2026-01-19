"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { programSchema, type ProgramInput } from "@/lib/validations";
import type { ApiResponse } from "@/types";

export async function getPrograms(params?: {
  page?: number;
  limit?: number;
  search?: string;
  type?: "CURRICULUM" | "EXTRACURRICULAR" | "FEATURED";
  isActive?: boolean;
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

  if (params?.type) {
    where.type = params.type;
  }

  if (params?.isActive !== undefined) {
    where.isActive = params.isActive;
  }

  const [programs, total] = await Promise.all([
    prisma.program.findMany({
      where,
      orderBy: [{ order: "asc" }, { name: "asc" }],
      skip,
      take: limit,
    }),
    prisma.program.count({ where }),
  ]);

  return {
    data: programs,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
}

export async function getProgramById(id: string) {
  const program = await prisma.program.findUnique({
    where: { id },
  });
  return program;
}

export async function getProgramBySlug(slug: string) {
  const program = await prisma.program.findUnique({
    where: { slug },
  });
  return program;
}

export async function getProgramsByType(type: "CURRICULUM" | "EXTRACURRICULAR" | "FEATURED") {
  const programs = await prisma.program.findMany({
    where: { type, isActive: true },
    orderBy: [{ order: "asc" }, { name: "asc" }],
  });
  return programs;
}

// Get all program slugs for static generation
export async function getAllProgramSlugs(): Promise<string[]> {
  try {
    const programs = await prisma.program.findMany({
      where: { isActive: true },
      select: { slug: true },
    });
    return programs.map((p) => p.slug);
  } catch {
    return [];
  }
}

export async function createProgram(data: ProgramInput): Promise<ApiResponse> {
  const session = await auth();
  if (!session) {
    return { success: false, error: "Unauthorized" };
  }

  try {
    const validated = programSchema.parse(data);

    // Check if slug exists
    const existing = await prisma.program.findUnique({
      where: { slug: validated.slug },
    });
    if (existing) {
      return { success: false, error: "Slug sudah digunakan" };
    }

    const program = await prisma.program.create({
      data: {
        name: validated.name,
        slug: validated.slug,
        type: validated.type,
        description: validated.description,
        content: validated.content,
        image: validated.image,
        icon: validated.icon,
        isActive: validated.isActive,
        order: validated.order,
      },
    });

    revalidatePath("/admin/programs");
    revalidatePath("/akademik");
    return { success: true, data: program, message: "Program berhasil dibuat" };
  } catch (error) {
    console.error("Create program error:", error);
    return { success: false, error: "Gagal membuat program" };
  }
}

export async function updateProgram(
  id: string,
  data: Partial<ProgramInput>
): Promise<ApiResponse> {
  const session = await auth();
  if (!session) {
    return { success: false, error: "Unauthorized" };
  }

  try {
    const existing = await prisma.program.findUnique({ where: { id } });
    if (!existing) {
      return { success: false, error: "Program tidak ditemukan" };
    }

    // Check if new slug conflicts
    if (data.slug && data.slug !== existing.slug) {
      const conflict = await prisma.program.findUnique({
        where: { slug: data.slug },
      });
      if (conflict) {
        return { success: false, error: "Slug sudah digunakan" };
      }
    }

    const program = await prisma.program.update({
      where: { id },
      data: {
        name: data.name,
        slug: data.slug,
        type: data.type,
        description: data.description,
        content: data.content,
        image: data.image,
        icon: data.icon,
        isActive: data.isActive,
        order: data.order,
      },
    });

    revalidatePath("/admin/programs");
    revalidatePath(`/admin/programs/${id}`);
    revalidatePath("/akademik");
    revalidatePath(`/akademik/${program.slug}`);
    return { success: true, data: program, message: "Program berhasil diperbarui" };
  } catch (error) {
    console.error("Update program error:", error);
    return { success: false, error: "Gagal memperbarui program" };
  }
}

export async function deleteProgram(id: string): Promise<ApiResponse> {
  const session = await auth();
  if (!session) {
    return { success: false, error: "Unauthorized" };
  }

  try {
    await prisma.program.delete({ where: { id } });

    revalidatePath("/admin/programs");
    revalidatePath("/akademik");
    return { success: true, message: "Program berhasil dihapus" };
  } catch (error) {
    console.error("Delete program error:", error);
    return { success: false, error: "Gagal menghapus program" };
  }
}

export async function toggleProgramStatus(id: string): Promise<ApiResponse> {
  const session = await auth();
  if (!session) {
    return { success: false, error: "Unauthorized" };
  }

  try {
    const program = await prisma.program.findUnique({ where: { id } });
    if (!program) {
      return { success: false, error: "Program tidak ditemukan" };
    }

    await prisma.program.update({
      where: { id },
      data: { isActive: !program.isActive },
    });

    revalidatePath("/admin/programs");
    revalidatePath("/akademik");
    return {
      success: true,
      message: program.isActive
        ? "Program berhasil dinonaktifkan"
        : "Program berhasil diaktifkan",
    };
  } catch (error) {
    console.error("Toggle program status error:", error);
    return { success: false, error: "Gagal mengubah status program" };
  }
}

export async function reorderPrograms(
  items: { id: string; order: number }[]
): Promise<ApiResponse> {
  const session = await auth();
  if (!session) {
    return { success: false, error: "Unauthorized" };
  }

  try {
    for (const item of items) {
      await prisma.program.update({
        where: { id: item.id },
        data: { order: item.order },
      });
    }

    revalidatePath("/admin/programs");
    revalidatePath("/akademik");
    return { success: true, message: "Urutan program berhasil diperbarui" };
  } catch (error) {
    console.error("Reorder programs error:", error);
    return { success: false, error: "Gagal mengubah urutan program" };
  }
}
