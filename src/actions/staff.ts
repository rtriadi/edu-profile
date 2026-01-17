"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { staffSchema, type StaffInput } from "@/lib/validations";
import type { ApiResponse } from "@/types";

export async function getStaff(params?: {
  page?: number;
  limit?: number;
  search?: string;
  isTeacher?: boolean;
}) {
  const page = params?.page || 1;
  const limit = params?.limit || 10;
  const skip = (page - 1) * limit;

  const where: Record<string, unknown> = {};
  
  if (params?.search) {
    where.OR = [
      { name: { contains: params.search } },
      { position: { contains: params.search } },
      { department: { contains: params.search } },
    ];
  }
  
  if (params?.isTeacher !== undefined) {
    where.isTeacher = params.isTeacher;
  }

  const [staff, total] = await Promise.all([
    prisma.staff.findMany({
      where,
      orderBy: [{ order: "asc" }, { name: "asc" }],
      skip,
      take: limit,
    }),
    prisma.staff.count({ where }),
  ]);

  return {
    data: staff,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
}

export async function getStaffById(id: string) {
  const staff = await prisma.staff.findUnique({
    where: { id },
  });
  return staff;
}

export async function createStaff(data: StaffInput): Promise<ApiResponse> {
  const session = await auth();
  if (!session) {
    return { success: false, error: "Unauthorized" };
  }

  try {
    const validated = staffSchema.parse(data);

    const staff = await prisma.staff.create({
      data: {
        name: validated.name,
        nip: validated.nip,
        position: validated.position,
        department: validated.department,
        bio: validated.bio,
        photo: validated.photo,
        email: validated.email,
        phone: validated.phone,
        education: validated.education,
        isTeacher: validated.isTeacher,
        subjects: validated.subjects,
        isActive: validated.isActive,
        order: validated.order,
      },
    });

    revalidatePath("/admin/staff");
    revalidatePath("/profil/guru-staff");
    return { success: true, data: staff, message: "Staff berhasil ditambahkan" };
  } catch (error) {
    console.error("Create staff error:", error);
    return { success: false, error: "Gagal menambahkan staff" };
  }
}

export async function updateStaff(
  id: string,
  data: Partial<StaffInput>
): Promise<ApiResponse> {
  const session = await auth();
  if (!session) {
    return { success: false, error: "Unauthorized" };
  }

  try {
    const existing = await prisma.staff.findUnique({ where: { id } });
    if (!existing) {
      return { success: false, error: "Staff tidak ditemukan" };
    }

    const staff = await prisma.staff.update({
      where: { id },
      data: {
        name: data.name,
        nip: data.nip,
        position: data.position,
        department: data.department,
        bio: data.bio,
        photo: data.photo,
        email: data.email,
        phone: data.phone,
        education: data.education,
        isTeacher: data.isTeacher,
        subjects: data.subjects,
        isActive: data.isActive,
        order: data.order,
      },
    });

    revalidatePath("/admin/staff");
    revalidatePath(`/admin/staff/${id}`);
    revalidatePath("/profil/guru-staff");
    return { success: true, data: staff, message: "Staff berhasil diperbarui" };
  } catch (error) {
    console.error("Update staff error:", error);
    return { success: false, error: "Gagal memperbarui staff" };
  }
}

export async function deleteStaff(id: string): Promise<ApiResponse> {
  const session = await auth();
  if (!session) {
    return { success: false, error: "Unauthorized" };
  }

  try {
    await prisma.staff.delete({ where: { id } });

    revalidatePath("/admin/staff");
    revalidatePath("/profil/guru-staff");
    return { success: true, message: "Staff berhasil dihapus" };
  } catch (error) {
    console.error("Delete staff error:", error);
    return { success: false, error: "Gagal menghapus staff" };
  }
}

export async function toggleStaffStatus(id: string): Promise<ApiResponse> {
  const session = await auth();
  if (!session) {
    return { success: false, error: "Unauthorized" };
  }

  try {
    const staff = await prisma.staff.findUnique({ where: { id } });
    if (!staff) {
      return { success: false, error: "Staff tidak ditemukan" };
    }

    await prisma.staff.update({
      where: { id },
      data: { isActive: !staff.isActive },
    });

    revalidatePath("/admin/staff");
    return {
      success: true,
      message: staff.isActive
        ? "Staff berhasil dinonaktifkan"
        : "Staff berhasil diaktifkan",
    };
  } catch (error) {
    console.error("Toggle staff status error:", error);
    return { success: false, error: "Gagal mengubah status staff" };
  }
}

export async function reorderStaff(
  items: { id: string; order: number }[]
): Promise<ApiResponse> {
  const session = await auth();
  if (!session) {
    return { success: false, error: "Unauthorized" };
  }

  try {
    for (const item of items) {
      await prisma.staff.update({
        where: { id: item.id },
        data: { order: item.order },
      });
    }

    revalidatePath("/admin/staff");
    return { success: true, message: "Urutan staff berhasil diperbarui" };
  } catch (error) {
    console.error("Reorder staff error:", error);
    return { success: false, error: "Gagal mengubah urutan staff" };
  }
}
