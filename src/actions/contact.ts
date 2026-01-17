"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { contactMessageSchema, type ContactMessageInput } from "@/lib/validations";
import type { ApiResponse } from "@/types";

export async function submitContactMessage(
  data: ContactMessageInput
): Promise<ApiResponse> {
  try {
    const validated = contactMessageSchema.parse(data);

    await prisma.contactMessage.create({
      data: {
        name: validated.name,
        email: validated.email,
        phone: validated.phone,
        subject: validated.subject,
        message: validated.message,
      },
    });

    // TODO: Send email notification to admin

    return { success: true, message: "Pesan berhasil dikirim" };
  } catch (error) {
    console.error("Submit contact message error:", error);
    return { success: false, error: "Gagal mengirim pesan" };
  }
}

export async function getContactMessages(params?: {
  page?: number;
  limit?: number;
  isRead?: boolean;
}) {
  const session = await auth();
  if (!session) {
    throw new Error("Unauthorized");
  }

  const page = params?.page || 1;
  const limit = params?.limit || 10;
  const skip = (page - 1) * limit;

  const where: Record<string, unknown> = {};
  if (params?.isRead !== undefined) {
    where.isRead = params.isRead;
  }

  const [messages, total] = await Promise.all([
    prisma.contactMessage.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
    }),
    prisma.contactMessage.count({ where }),
  ]);

  return {
    data: messages,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
}

export async function markMessageAsRead(id: string): Promise<ApiResponse> {
  const session = await auth();
  if (!session) {
    return { success: false, error: "Unauthorized" };
  }

  try {
    await prisma.contactMessage.update({
      where: { id },
      data: { isRead: true },
    });

    revalidatePath("/admin/messages");
    return { success: true, message: "Pesan ditandai sudah dibaca" };
  } catch (error) {
    console.error("Mark message as read error:", error);
    return { success: false, error: "Gagal memperbarui status pesan" };
  }
}

export async function deleteContactMessage(id: string): Promise<ApiResponse> {
  const session = await auth();
  if (!session) {
    return { success: false, error: "Unauthorized" };
  }

  try {
    await prisma.contactMessage.delete({ where: { id } });

    revalidatePath("/admin/messages");
    return { success: true, message: "Pesan berhasil dihapus" };
  } catch (error) {
    console.error("Delete contact message error:", error);
    return { success: false, error: "Gagal menghapus pesan" };
  }
}
