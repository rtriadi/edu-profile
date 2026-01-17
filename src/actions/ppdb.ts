"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import type { ApiResponse } from "@/types";

// ==========================================
// PPDB PERIOD ACTIONS
// ==========================================

export async function getPPDBPeriods(params?: {
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

  const [periods, total] = await Promise.all([
    prisma.pPDBPeriod.findMany({
      where,
      include: {
        _count: { select: { registrations: true } },
      },
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
    }),
    prisma.pPDBPeriod.count({ where }),
  ]);

  return {
    data: periods,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
}

export async function getPPDBPeriodById(id: string) {
  const period = await prisma.pPDBPeriod.findUnique({
    where: { id },
    include: {
      _count: { select: { registrations: true } },
    },
  });
  return period;
}

export async function getActivePPDBPeriod() {
  const period = await prisma.pPDBPeriod.findFirst({
    where: { isActive: true },
  });
  return period;
}

export async function createPPDBPeriod(data: {
  name: string;
  academicYear: string;
  description?: string;
  startDate: Date;
  endDate: Date;
  quota?: number;
  requirements?: string[];
  isActive?: boolean;
}): Promise<ApiResponse> {
  const session = await auth();
  if (!session) {
    return { success: false, error: "Unauthorized" };
  }

  try {
    // If setting as active, deactivate other periods first
    if (data.isActive) {
      await prisma.pPDBPeriod.updateMany({
        where: { isActive: true },
        data: { isActive: false },
      });
    }

    const period = await prisma.pPDBPeriod.create({
      data: {
        name: data.name,
        academicYear: data.academicYear,
        description: data.description,
        startDate: data.startDate,
        endDate: data.endDate,
        quota: data.quota,
        requirements: data.requirements,
        isActive: data.isActive ?? false,
      },
    });

    revalidatePath("/admin/ppdb");
    revalidatePath("/ppdb");
    return { success: true, data: period, message: "Periode PPDB berhasil dibuat" };
  } catch (error) {
    console.error("Create PPDB period error:", error);
    return { success: false, error: "Gagal membuat periode PPDB" };
  }
}

export async function updatePPDBPeriod(
  id: string,
  data: {
    name?: string;
    academicYear?: string;
    description?: string;
    startDate?: Date;
    endDate?: Date;
    quota?: number;
    requirements?: string[];
    isActive?: boolean;
  }
): Promise<ApiResponse> {
  const session = await auth();
  if (!session) {
    return { success: false, error: "Unauthorized" };
  }

  try {
    // If setting as active, deactivate other periods first
    if (data.isActive) {
      await prisma.pPDBPeriod.updateMany({
        where: { isActive: true, NOT: { id } },
        data: { isActive: false },
      });
    }

    const period = await prisma.pPDBPeriod.update({
      where: { id },
      data,
    });

    revalidatePath("/admin/ppdb");
    revalidatePath(`/admin/ppdb/${id}`);
    revalidatePath("/ppdb");
    return { success: true, data: period, message: "Periode PPDB berhasil diperbarui" };
  } catch (error) {
    console.error("Update PPDB period error:", error);
    return { success: false, error: "Gagal memperbarui periode PPDB" };
  }
}

export async function deletePPDBPeriod(id: string): Promise<ApiResponse> {
  const session = await auth();
  if (!session) {
    return { success: false, error: "Unauthorized" };
  }

  try {
    // Check if period has registrations
    const registrationsCount = await prisma.pPDBRegistration.count({
      where: { periodId: id },
    });

    if (registrationsCount > 0) {
      return {
        success: false,
        error: `Periode memiliki ${registrationsCount} pendaftaran. Hapus pendaftaran terlebih dahulu.`,
      };
    }

    await prisma.pPDBPeriod.delete({ where: { id } });

    revalidatePath("/admin/ppdb");
    return { success: true, message: "Periode PPDB berhasil dihapus" };
  } catch (error) {
    console.error("Delete PPDB period error:", error);
    return { success: false, error: "Gagal menghapus periode PPDB" };
  }
}

export async function togglePPDBPeriodActive(id: string): Promise<ApiResponse> {
  const session = await auth();
  if (!session) {
    return { success: false, error: "Unauthorized" };
  }

  try {
    const period = await prisma.pPDBPeriod.findUnique({ where: { id } });
    if (!period) {
      return { success: false, error: "Periode tidak ditemukan" };
    }

    // If activating, deactivate others first
    if (!period.isActive) {
      await prisma.pPDBPeriod.updateMany({
        where: { isActive: true },
        data: { isActive: false },
      });
    }

    await prisma.pPDBPeriod.update({
      where: { id },
      data: { isActive: !period.isActive },
    });

    revalidatePath("/admin/ppdb");
    revalidatePath("/ppdb");
    return {
      success: true,
      message: period.isActive
        ? "Periode PPDB dinonaktifkan"
        : "Periode PPDB diaktifkan",
    };
  } catch (error) {
    console.error("Toggle PPDB period active error:", error);
    return { success: false, error: "Gagal mengubah status periode" };
  }
}

// ==========================================
// PPDB REGISTRATION ACTIONS
// ==========================================

export async function getPPDBRegistrations(params?: {
  page?: number;
  limit?: number;
  periodId?: string;
  status?: string;
  search?: string;
}) {
  const page = params?.page || 1;
  const limit = params?.limit || 10;
  const skip = (page - 1) * limit;

  const where: Record<string, unknown> = {};

  if (params?.periodId) {
    where.periodId = params.periodId;
  }

  if (params?.status) {
    where.status = params.status;
  }

  if (params?.search) {
    where.OR = [
      { studentName: { contains: params.search } },
      { email: { contains: params.search } },
      { registrationNumber: { contains: params.search } },
    ];
  }

  const [registrations, total] = await Promise.all([
    prisma.pPDBRegistration.findMany({
      where,
      include: {
        period: { select: { name: true, academicYear: true } },
      },
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
    }),
    prisma.pPDBRegistration.count({ where }),
  ]);

  return {
    data: registrations,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
}

export async function updateRegistrationStatus(
  id: string,
  status: "PENDING" | "REVIEWING" | "ACCEPTED" | "REJECTED" | "ENROLLED" | "WITHDRAWN",
  notes?: string
): Promise<ApiResponse> {
  const session = await auth();
  if (!session) {
    return { success: false, error: "Unauthorized" };
  }

  try {
    const registration = await prisma.pPDBRegistration.update({
      where: { id },
      data: {
        status,
        notes,
      },
    });

    revalidatePath("/admin/ppdb");
    revalidatePath("/admin/ppdb/registrations");
    return { success: true, data: registration, message: "Status pendaftaran berhasil diperbarui" };
  } catch (error) {
    console.error("Update registration status error:", error);
    return { success: false, error: "Gagal memperbarui status pendaftaran" };
  }
}
