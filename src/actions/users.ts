"use server";

import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { auth, canAccess } from "@/lib/auth";
import { userSchema, type UserInput } from "@/lib/validations";
import type { ApiResponse } from "@/types";

export async function getUsers(params?: {
  page?: number;
  limit?: number;
  search?: string;
}) {
  const session = await auth();
  if (!session?.user?.role || !canAccess(session.user.role, "ADMIN")) {
    throw new Error("Unauthorized");
  }

  const page = params?.page || 1;
  const limit = params?.limit || 10;
  const skip = (page - 1) * limit;

  const where = params?.search
    ? {
        OR: [
          { name: { contains: params.search } },
          { email: { contains: params.search } },
        ],
      }
    : {};

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      where,
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        role: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
    }),
    prisma.user.count({ where }),
  ]);

  return {
    data: users,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
}

export async function getUserById(id: string) {
  const session = await auth();
  if (!session) {
    throw new Error("Unauthorized");
  }

  const user = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      role: true,
      isActive: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return user;
}

export async function createUser(data: UserInput): Promise<ApiResponse> {
  const session = await auth();
  if (!session?.user?.role || !canAccess(session.user.role, "ADMIN")) {
    return { success: false, error: "Unauthorized" };
  }

  try {
    const validated = userSchema.parse(data);

    // Check if email already exists
    const existing = await prisma.user.findUnique({
      where: { email: validated.email },
    });

    if (existing) {
      return { success: false, error: "Email sudah terdaftar" };
    }

    // Hash password if provided
    let hashedPassword: string | undefined;
    if (validated.password) {
      hashedPassword = await bcrypt.hash(validated.password, 12);
    }

    const user = await prisma.user.create({
      data: {
        name: validated.name,
        email: validated.email,
        password: hashedPassword,
        role: validated.role,
        isActive: validated.isActive,
        image: validated.image || null,
      },
    });

    revalidatePath("/admin/users");
    return { success: true, data: user, message: "Pengguna berhasil dibuat" };
  } catch (error) {
    console.error("Create user error:", error);
    return { success: false, error: "Gagal membuat pengguna" };
  }
}

export async function updateUser(
  id: string,
  data: Partial<UserInput>
): Promise<ApiResponse> {
  const session = await auth();
  if (!session?.user?.role || !canAccess(session.user.role, "ADMIN")) {
    return { success: false, error: "Unauthorized" };
  }

  try {
    // Check if user exists
    const existing = await prisma.user.findUnique({ where: { id } });
    if (!existing) {
      return { success: false, error: "Pengguna tidak ditemukan" };
    }

    // Check if email already used by another user
    if (data.email && data.email !== existing.email) {
      const emailExists = await prisma.user.findUnique({
        where: { email: data.email },
      });
      if (emailExists) {
        return { success: false, error: "Email sudah digunakan" };
      }
    }

    // Prepare update data
    const updateData: Record<string, unknown> = {
      name: data.name,
      email: data.email,
      role: data.role,
      isActive: data.isActive,
      image: data.image || null,
    };

    // Hash password if provided
    if (data.password) {
      updateData.password = await bcrypt.hash(data.password, 12);
    }

    const user = await prisma.user.update({
      where: { id },
      data: updateData,
    });

    revalidatePath("/admin/users");
    return { success: true, data: user, message: "Pengguna berhasil diperbarui" };
  } catch (error) {
    console.error("Update user error:", error);
    return { success: false, error: "Gagal memperbarui pengguna" };
  }
}

export async function deleteUser(id: string): Promise<ApiResponse> {
  const session = await auth();
  if (!session?.user?.role || !canAccess(session.user.role, "SUPERADMIN")) {
    return { success: false, error: "Unauthorized" };
  }

  try {
    // Prevent deleting own account
    if (id === session.user.id) {
      return { success: false, error: "Tidak dapat menghapus akun sendiri" };
    }

    await prisma.user.delete({ where: { id } });

    revalidatePath("/admin/users");
    return { success: true, message: "Pengguna berhasil dihapus" };
  } catch (error) {
    console.error("Delete user error:", error);
    return { success: false, error: "Gagal menghapus pengguna" };
  }
}

export async function toggleUserStatus(id: string): Promise<ApiResponse> {
  const session = await auth();
  if (!session?.user?.role || !canAccess(session.user.role, "ADMIN")) {
    return { success: false, error: "Unauthorized" };
  }

  try {
    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) {
      return { success: false, error: "Pengguna tidak ditemukan" };
    }

    // Prevent deactivating own account
    if (id === session.user.id) {
      return { success: false, error: "Tidak dapat menonaktifkan akun sendiri" };
    }

    await prisma.user.update({
      where: { id },
      data: { isActive: !user.isActive },
    });

    revalidatePath("/admin/users");
    return {
      success: true,
      message: user.isActive
        ? "Pengguna berhasil dinonaktifkan"
        : "Pengguna berhasil diaktifkan",
    };
  } catch (error) {
    console.error("Toggle user status error:", error);
    return { success: false, error: "Gagal mengubah status pengguna" };
  }
}
