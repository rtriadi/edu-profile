"use server";

import { prisma } from "@/lib/prisma";
import { auth, canAccess } from "@/lib/auth";

export async function getDashboardStats() {
  const session = await auth();
  if (!session || !canAccess(session.user.role, "EDITOR")) {
    throw new Error("Unauthorized");
  }

  const [
    postsCount,
    pagesCount,
    registrationsCount,
    messagesCount,
    usersCount,
    recentRegistrations,
    recentMessages,
    recentPosts,
  ] = await Promise.all([
    prisma.post.count(),
    prisma.page.count(),
    prisma.pPDBRegistration.count(),
    prisma.contactMessage.count(),
    prisma.user.count(),
    prisma.pPDBRegistration.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        studentName: true,
        status: true,
        createdAt: true,
      },
    }),
    prisma.contactMessage.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        subject: true,
        createdAt: true,
        isRead: true,
      },
    }),
    prisma.post.findMany({
      where: { status: "PUBLISHED" },
      orderBy: { createdAt: "desc" },
      take: 5,
      select: {
        id: true,
        title: true,
        slug: true,
        views: true,
        createdAt: true,
        category: {
          select: { name: true, color: true },
        },
      },
    }),
  ]);

  return {
    counts: {
      posts: postsCount,
      pages: pagesCount,
      registrations: registrationsCount,
      messages: messagesCount,
      users: usersCount,
    },
    recentRegistrations,
    recentMessages,
    recentPosts,
  };
}
