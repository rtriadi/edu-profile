"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { eventSchema, type EventInput } from "@/lib/validations";
import type { ApiResponse } from "@/types";

export async function getEvents(params?: {
  page?: number;
  limit?: number;
  search?: string;
  type?: string;
  startDate?: Date;
  endDate?: Date;
  isPublished?: boolean;
}) {
  const page = params?.page || 1;
  const limit = params?.limit || 10;
  const skip = (page - 1) * limit;

  const where: Record<string, unknown> = {};

  if (params?.search) {
    where.OR = [
      { title: { contains: params.search } },
      { description: { contains: params.search } },
      { location: { contains: params.search } },
    ];
  }

  if (params?.type) {
    where.type = params.type;
  }

  if (params?.startDate || params?.endDate) {
    where.startDate = {};
    if (params?.startDate) {
      (where.startDate as Record<string, Date>).gte = params.startDate;
    }
    if (params?.endDate) {
      (where.startDate as Record<string, Date>).lte = params.endDate;
    }
  }

  if (params?.isPublished !== undefined) {
    where.isPublished = params.isPublished;
  }

  const [events, total] = await Promise.all([
    prisma.event.findMany({
      where,
      orderBy: { startDate: "asc" },
      skip,
      take: limit,
    }),
    prisma.event.count({ where }),
  ]);

  return {
    data: events,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
}

export async function getEventById(id: string) {
  const event = await prisma.event.findUnique({
    where: { id },
  });
  return event;
}

export async function getEventBySlug(slug: string) {
  const event = await prisma.event.findUnique({
    where: { slug },
  });
  return event;
}

export async function getUpcomingEvents(limit: number = 5) {
  const events = await prisma.event.findMany({
    where: {
      isPublished: true,
      startDate: { gte: new Date() },
    },
    orderBy: { startDate: "asc" },
    take: limit,
  });
  return events;
}

export async function getEventsByMonth(year: number, month: number) {
  const startDate = new Date(year, month - 1, 1);
  const endDate = new Date(year, month, 0, 23, 59, 59);

  const events = await prisma.event.findMany({
    where: {
      isPublished: true,
      OR: [
        {
          startDate: { gte: startDate, lte: endDate },
        },
        {
          endDate: { gte: startDate, lte: endDate },
        },
        {
          AND: [
            { startDate: { lte: startDate } },
            { endDate: { gte: endDate } },
          ],
        },
      ],
    },
    orderBy: { startDate: "asc" },
  });
  return events;
}

export async function createEvent(data: EventInput): Promise<ApiResponse> {
  const session = await auth();
  if (!session) {
    return { success: false, error: "Unauthorized" };
  }

  try {
    const validated = eventSchema.parse(data);

    // Check if slug exists
    const existing = await prisma.event.findUnique({
      where: { slug: validated.slug },
    });
    if (existing) {
      return { success: false, error: "Slug sudah digunakan" };
    }

    const event = await prisma.event.create({
      data: {
        title: validated.title,
        slug: validated.slug,
        description: validated.description,
        content: validated.content,
        location: validated.location,
        startDate: validated.startDate,
        endDate: validated.endDate,
        isAllDay: validated.isAllDay,
        image: validated.image,
        type: validated.type,
        color: validated.color,
        isPublished: validated.isPublished,
      },
    });

    revalidatePath("/admin/events");
    revalidatePath("/agenda");
    return { success: true, data: event, message: "Kegiatan berhasil dibuat" };
  } catch (error) {
    console.error("Create event error:", error);
    return { success: false, error: "Gagal membuat kegiatan" };
  }
}

export async function updateEvent(
  id: string,
  data: Partial<EventInput>
): Promise<ApiResponse> {
  const session = await auth();
  if (!session) {
    return { success: false, error: "Unauthorized" };
  }

  try {
    const existing = await prisma.event.findUnique({ where: { id } });
    if (!existing) {
      return { success: false, error: "Kegiatan tidak ditemukan" };
    }

    // Check if new slug conflicts
    if (data.slug && data.slug !== existing.slug) {
      const conflict = await prisma.event.findUnique({
        where: { slug: data.slug },
      });
      if (conflict) {
        return { success: false, error: "Slug sudah digunakan" };
      }
    }

    const event = await prisma.event.update({
      where: { id },
      data: {
        title: data.title,
        slug: data.slug,
        description: data.description,
        content: data.content,
        location: data.location,
        startDate: data.startDate,
        endDate: data.endDate,
        isAllDay: data.isAllDay,
        image: data.image,
        type: data.type,
        color: data.color,
        isPublished: data.isPublished,
      },
    });

    revalidatePath("/admin/events");
    revalidatePath(`/admin/events/${id}`);
    revalidatePath("/agenda");
    revalidatePath(`/agenda/${event.slug}`);
    return { success: true, data: event, message: "Kegiatan berhasil diperbarui" };
  } catch (error) {
    console.error("Update event error:", error);
    return { success: false, error: "Gagal memperbarui kegiatan" };
  }
}

export async function deleteEvent(id: string): Promise<ApiResponse> {
  const session = await auth();
  if (!session) {
    return { success: false, error: "Unauthorized" };
  }

  try {
    await prisma.event.delete({ where: { id } });

    revalidatePath("/admin/events");
    revalidatePath("/agenda");
    return { success: true, message: "Kegiatan berhasil dihapus" };
  } catch (error) {
    console.error("Delete event error:", error);
    return { success: false, error: "Gagal menghapus kegiatan" };
  }
}

export async function toggleEventPublish(id: string): Promise<ApiResponse> {
  const session = await auth();
  if (!session) {
    return { success: false, error: "Unauthorized" };
  }

  try {
    const event = await prisma.event.findUnique({ where: { id } });
    if (!event) {
      return { success: false, error: "Kegiatan tidak ditemukan" };
    }

    await prisma.event.update({
      where: { id },
      data: { isPublished: !event.isPublished },
    });

    revalidatePath("/admin/events");
    revalidatePath("/agenda");
    return {
      success: true,
      message: event.isPublished
        ? "Kegiatan berhasil disembunyikan"
        : "Kegiatan berhasil dipublikasikan",
    };
  } catch (error) {
    console.error("Toggle event publish error:", error);
    return { success: false, error: "Gagal mengubah status kegiatan" };
  }
}
