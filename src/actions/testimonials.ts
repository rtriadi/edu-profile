"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { testimonialSchema, type TestimonialInput } from "@/lib/validations";
import type { ApiResponse } from "@/types";

export async function getTestimonials(params?: {
  page?: number;
  limit?: number;
  search?: string;
  isPublished?: boolean;
}) {
  const page = params?.page || 1;
  const limit = params?.limit || 10;
  const skip = (page - 1) * limit;

  const where: Record<string, unknown> = {};

  if (params?.search) {
    where.OR = [
      { name: { contains: params.search } },
      { role: { contains: params.search } },
      { content: { contains: params.search } },
    ];
  }

  if (params?.isPublished !== undefined) {
    where.isPublished = params.isPublished;
  }

  const [testimonials, total] = await Promise.all([
    prisma.testimonial.findMany({
      where,
      orderBy: [{ order: "asc" }, { createdAt: "desc" }],
      skip,
      take: limit,
    }),
    prisma.testimonial.count({ where }),
  ]);

  return {
    data: testimonials,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
}

export async function getTestimonialById(id: string) {
  const testimonial = await prisma.testimonial.findUnique({
    where: { id },
  });
  return testimonial;
}

export async function getPublishedTestimonials(limit?: number) {
  const testimonials = await prisma.testimonial.findMany({
    where: { isPublished: true },
    orderBy: [{ order: "asc" }, { createdAt: "desc" }],
    take: limit,
  });
  return testimonials;
}

export async function createTestimonial(data: TestimonialInput): Promise<ApiResponse> {
  const session = await auth();
  if (!session) {
    return { success: false, error: "Unauthorized" };
  }

  try {
    const validated = testimonialSchema.parse(data);

    const testimonial = await prisma.testimonial.create({
      data: {
        name: validated.name,
        role: validated.role,
        content: validated.content,
        photo: validated.photo,
        rating: validated.rating,
        isPublished: validated.isPublished,
        order: validated.order,
      },
    });

    revalidatePath("/admin/testimonials");
    revalidatePath("/");
    return { success: true, data: testimonial, message: "Testimoni berhasil ditambahkan" };
  } catch (error) {
    console.error("Create testimonial error:", error);
    return { success: false, error: "Gagal menambahkan testimoni" };
  }
}

export async function updateTestimonial(
  id: string,
  data: Partial<TestimonialInput>
): Promise<ApiResponse> {
  const session = await auth();
  if (!session) {
    return { success: false, error: "Unauthorized" };
  }

  try {
    const existing = await prisma.testimonial.findUnique({ where: { id } });
    if (!existing) {
      return { success: false, error: "Testimoni tidak ditemukan" };
    }

    const testimonial = await prisma.testimonial.update({
      where: { id },
      data: {
        name: data.name,
        role: data.role,
        content: data.content,
        photo: data.photo,
        rating: data.rating,
        isPublished: data.isPublished,
        order: data.order,
      },
    });

    revalidatePath("/admin/testimonials");
    revalidatePath(`/admin/testimonials/${id}`);
    revalidatePath("/");
    return { success: true, data: testimonial, message: "Testimoni berhasil diperbarui" };
  } catch (error) {
    console.error("Update testimonial error:", error);
    return { success: false, error: "Gagal memperbarui testimoni" };
  }
}

export async function deleteTestimonial(id: string): Promise<ApiResponse> {
  const session = await auth();
  if (!session) {
    return { success: false, error: "Unauthorized" };
  }

  try {
    await prisma.testimonial.delete({ where: { id } });

    revalidatePath("/admin/testimonials");
    revalidatePath("/");
    return { success: true, message: "Testimoni berhasil dihapus" };
  } catch (error) {
    console.error("Delete testimonial error:", error);
    return { success: false, error: "Gagal menghapus testimoni" };
  }
}

export async function toggleTestimonialPublish(id: string): Promise<ApiResponse> {
  const session = await auth();
  if (!session) {
    return { success: false, error: "Unauthorized" };
  }

  try {
    const testimonial = await prisma.testimonial.findUnique({ where: { id } });
    if (!testimonial) {
      return { success: false, error: "Testimoni tidak ditemukan" };
    }

    await prisma.testimonial.update({
      where: { id },
      data: { isPublished: !testimonial.isPublished },
    });

    revalidatePath("/admin/testimonials");
    revalidatePath("/");
    return {
      success: true,
      message: testimonial.isPublished
        ? "Testimoni berhasil disembunyikan"
        : "Testimoni berhasil dipublikasikan",
    };
  } catch (error) {
    console.error("Toggle testimonial publish error:", error);
    return { success: false, error: "Gagal mengubah status testimoni" };
  }
}

export async function reorderTestimonials(
  items: { id: string; order: number }[]
): Promise<ApiResponse> {
  const session = await auth();
  if (!session) {
    return { success: false, error: "Unauthorized" };
  }

  try {
    for (const item of items) {
      await prisma.testimonial.update({
        where: { id: item.id },
        data: { order: item.order },
      });
    }

    revalidatePath("/admin/testimonials");
    revalidatePath("/");
    return { success: true, message: "Urutan berhasil diperbarui" };
  } catch (error) {
    console.error("Reorder testimonials error:", error);
    return { success: false, error: "Gagal mengubah urutan" };
  }
}
