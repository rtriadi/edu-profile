"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { auth, canAccess } from "@/lib/auth";
import { rateLimitByIp, sanitizeText, sanitizeEmail, sanitizePhone } from "@/lib/security";
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
  if (!session || !canAccess(session.user.role, "ADMIN")) {
    return { success: false, error: "Unauthorized" };
  }

  try {
    // Use transaction for atomicity
    const period = await prisma.$transaction(async (tx) => {
      // If setting as active, deactivate other periods first
      if (data.isActive) {
        await tx.pPDBPeriod.updateMany({
          where: { isActive: true },
          data: { isActive: false },
        });
      }

      return tx.pPDBPeriod.create({
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
  if (!session || !canAccess(session.user.role, "ADMIN")) {
    return { success: false, error: "Unauthorized" };
  }

  try {
    // Use transaction for atomicity
    const period = await prisma.$transaction(async (tx) => {
      // If setting as active, deactivate other periods first
      if (data.isActive) {
        await tx.pPDBPeriod.updateMany({
          where: { isActive: true, NOT: { id } },
          data: { isActive: false },
        });
      }

      return tx.pPDBPeriod.update({
        where: { id },
        data,
      });
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
  if (!session || !canAccess(session.user.role, "ADMIN")) {
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
  if (!session || !canAccess(session.user.role, "ADMIN")) {
    return { success: false, error: "Unauthorized" };
  }

  try {
    const period = await prisma.pPDBPeriod.findUnique({ where: { id } });
    if (!period) {
      return { success: false, error: "Periode tidak ditemukan" };
    }

    // Use transaction for atomicity
    await prisma.$transaction(async (tx) => {
      // If activating, deactivate others first
      if (!period.isActive) {
        await tx.pPDBPeriod.updateMany({
          where: { isActive: true },
          data: { isActive: false },
        });
      }

      await tx.pPDBPeriod.update({
        where: { id },
        data: { isActive: !period.isActive },
      });
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

export async function getAllPPDBRegistrations(periodId?: string) {
  const session = await auth();
  if (!session) {
    throw new Error("Unauthorized");
  }

  const where: Record<string, unknown> = {};
  if (periodId) {
    where.periodId = periodId;
  }

  const registrations = await prisma.pPDBRegistration.findMany({
    where,
    include: {
      period: { select: { name: true, academicYear: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return registrations;
}

// ==========================================
// PUBLIC REGISTRATION ACTION
// ==========================================

export async function createPublicRegistration(data: {
  periodId: string;
  studentName: string;
  nisn?: string;
  birthPlace: string;
  birthDate: Date;
  gender: "MALE" | "FEMALE";
  religion?: string;
  address: string;
  previousSchool?: string;
  fatherName?: string;
  fatherJob?: string;
  fatherPhone?: string;
  motherName?: string;
  motherJob?: string;
  motherPhone?: string;
  guardianName?: string;
  guardianPhone?: string;
  guardianEmail?: string;
  photo?: string;
}): Promise<ApiResponse> {
  try {
    // Rate limiting: 3 registrations per 5 minutes per IP
    const rateLimitResult = await rateLimitByIp("ppdb-registration", {
      maxRequests: 3,
      windowMs: 300000, // 5 minutes
    });

    if (!rateLimitResult.success) {
      return {
        success: false,
        error: `Terlalu banyak permintaan. Coba lagi dalam ${rateLimitResult.resetIn} detik.`,
      };
    }

    // Sanitize all input data
    const sanitizedData = {
      periodId: data.periodId,
      studentName: sanitizeText(data.studentName),
      nisn: data.nisn ? sanitizeText(data.nisn) : undefined,
      birthPlace: sanitizeText(data.birthPlace),
      birthDate: data.birthDate,
      gender: data.gender,
      religion: data.religion ? sanitizeText(data.religion) : undefined,
      address: sanitizeText(data.address),
      previousSchool: data.previousSchool ? sanitizeText(data.previousSchool) : undefined,
      fatherName: data.fatherName ? sanitizeText(data.fatherName) : undefined,
      fatherJob: data.fatherJob ? sanitizeText(data.fatherJob) : undefined,
      fatherPhone: data.fatherPhone ? sanitizePhone(data.fatherPhone) : undefined,
      motherName: data.motherName ? sanitizeText(data.motherName) : undefined,
      motherJob: data.motherJob ? sanitizeText(data.motherJob) : undefined,
      motherPhone: data.motherPhone ? sanitizePhone(data.motherPhone) : undefined,
      guardianName: data.guardianName ? sanitizeText(data.guardianName) : undefined,
      guardianPhone: data.guardianPhone ? sanitizePhone(data.guardianPhone) : undefined,
      guardianEmail: data.guardianEmail ? sanitizeEmail(data.guardianEmail) : undefined,
      photo: data.photo,
    };

    // Validate period exists and is active
    const period = await prisma.pPDBPeriod.findUnique({
      where: { id: sanitizedData.periodId },
    });

    if (!period) {
      return { success: false, error: "Periode PPDB tidak ditemukan" };
    }

    if (!period.isActive) {
      return { success: false, error: "Periode PPDB tidak aktif" };
    }

    const now = new Date();
    if (now < period.startDate || now > period.endDate) {
      return { success: false, error: "Pendaftaran di luar periode yang ditentukan" };
    }

    // Check quota if set
    if (period.quota) {
      const currentCount = await prisma.pPDBRegistration.count({
        where: { periodId: sanitizedData.periodId },
      });
      if (currentCount >= period.quota) {
        return { success: false, error: "Kuota pendaftaran sudah penuh" };
      }
    }

    // Generate registration number
    const year = new Date().getFullYear();
    const count = await prisma.pPDBRegistration.count({
      where: { periodId: sanitizedData.periodId },
    });
    const registrationNo = `PPDB-${year}-${String(count + 1).padStart(4, "0")}`;

    // Create registration with sanitized data
    const registration = await prisma.pPDBRegistration.create({
      data: {
        periodId: sanitizedData.periodId,
        registrationNo,
        studentName: sanitizedData.studentName,
        nisn: sanitizedData.nisn,
        birthPlace: sanitizedData.birthPlace,
        birthDate: sanitizedData.birthDate,
        gender: sanitizedData.gender,
        religion: sanitizedData.religion,
        address: sanitizedData.address,
        previousSchool: sanitizedData.previousSchool,
        fatherName: sanitizedData.fatherName,
        fatherJob: sanitizedData.fatherJob,
        fatherPhone: sanitizedData.fatherPhone,
        motherName: sanitizedData.motherName,
        motherJob: sanitizedData.motherJob,
        motherPhone: sanitizedData.motherPhone,
        guardianName: sanitizedData.guardianName,
        guardianPhone: sanitizedData.guardianPhone,
        guardianEmail: sanitizedData.guardianEmail,
        photo: sanitizedData.photo,
        status: "PENDING",
      },
    });

    revalidatePath("/admin/ppdb/registrations");
    return { 
      success: true, 
      data: { registrationNo: registration.registrationNo }, 
      message: "Pendaftaran berhasil! Nomor registrasi Anda: " + registration.registrationNo 
    };
  } catch (error) {
    console.error("Create public registration error:", error);
    return { success: false, error: "Gagal melakukan pendaftaran. Silakan coba lagi." };
  }
}
