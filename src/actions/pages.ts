"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { pageSchema, type PageInput } from "@/lib/validations";
import type { ApiResponse, Status } from "@/types";

// Admin function - requires authentication
export async function getPages(params?: {
  page?: number;
  limit?: number;
  search?: string;
  status?: Status;
}) {
  // Require authentication for admin data access
  const session = await auth();
  if (!session) {
    throw new Error("Unauthorized");
  }

  const page = params?.page || 1;
  const limit = params?.limit || 10;
  const skip = (page - 1) * limit;

  const where: Record<string, unknown> = {};
  
  if (params?.search) {
    where.OR = [
      { title: { contains: params.search } },
      { slug: { contains: params.search } },
    ];
  }
  
  if (params?.status) {
    where.status = params.status;
  }

  const [pages, total] = await Promise.all([
    prisma.page.findMany({
      where,
      include: {
        author: {
          select: { id: true, name: true, image: true },
        },
      },
      orderBy: [{ order: "asc" }, { createdAt: "desc" }],
      skip,
      take: limit,
    }),
    prisma.page.count({ where }),
  ]);

  return {
    data: pages,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
}

// Admin function - requires authentication
export async function getPageById(id: string) {
  const session = await auth();
  if (!session) {
    throw new Error("Unauthorized");
  }

  const page = await prisma.page.findUnique({
    where: { id },
    include: {
      author: {
        select: { id: true, name: true, image: true },
      },
      parent: {
        select: { id: true, title: true, slug: true },
      },
      children: {
        select: { id: true, title: true, slug: true },
      },
    },
  });

  return page;
}

// Public function - only returns published pages
export async function getPageBySlug(slug: string) {
  const page = await prisma.page.findUnique({
    where: { slug, status: "PUBLISHED" },
    include: {
      author: {
        select: { id: true, name: true, image: true },
      },
    },
  });

  return page;
}

export async function createPage(data: PageInput): Promise<ApiResponse> {
  const session = await auth();
  if (!session) {
    return { success: false, error: "Unauthorized" };
  }

  try {
    const validated = pageSchema.parse(data);

    // Check if slug already exists
    const existing = await prisma.page.findUnique({
      where: { slug: validated.slug },
    });

    if (existing) {
      return { success: false, error: "Slug sudah digunakan" };
    }

    const page = await prisma.page.create({
      data: {
        title: validated.title,
        slug: validated.slug,
        content: validated.content || [],
        excerpt: validated.excerpt,
        featuredImg: validated.featuredImg,
        status: validated.status,
        template: validated.template,
        seoTitle: validated.seoTitle,
        seoDesc: validated.seoDesc,
        seoKeywords: validated.seoKeywords,
        ogImage: validated.ogImage,
        authorId: session.user.id,
        locale: validated.locale,
        parentId: validated.parentId || null,
        publishedAt: validated.status === "PUBLISHED" ? new Date() : null,
      },
    });

    revalidatePath("/admin/pages");
    revalidatePath(`/${page.slug}`);
    return { success: true, data: page, message: "Halaman berhasil dibuat" };
  } catch (error) {
    console.error("Create page error:", error);
    return { success: false, error: "Gagal membuat halaman" };
  }
}

export async function updatePage(
  id: string,
  data: Partial<PageInput>
): Promise<ApiResponse> {
  const session = await auth();
  if (!session) {
    return { success: false, error: "Unauthorized" };
  }

  try {
    const existing = await prisma.page.findUnique({ where: { id } });
    if (!existing) {
      return { success: false, error: "Halaman tidak ditemukan" };
    }

    // Check if slug is used by another page
    if (data.slug && data.slug !== existing.slug) {
      const slugExists = await prisma.page.findUnique({
        where: { slug: data.slug },
      });
      if (slugExists) {
        return { success: false, error: "Slug sudah digunakan" };
      }
    }

    // Determine publishedAt
    let publishedAt = existing.publishedAt;
    if (data.status === "PUBLISHED" && !existing.publishedAt) {
      publishedAt = new Date();
    } else if (data.status !== "PUBLISHED") {
      publishedAt = null;
    }

    const page = await prisma.page.update({
      where: { id },
      data: {
        title: data.title,
        slug: data.slug,
        content: data.content,
        excerpt: data.excerpt,
        featuredImg: data.featuredImg,
        status: data.status,
        template: data.template,
        seoTitle: data.seoTitle,
        seoDesc: data.seoDesc,
        seoKeywords: data.seoKeywords,
        ogImage: data.ogImage,
        locale: data.locale,
        parentId: data.parentId || null,
        publishedAt,
      },
    });

    revalidatePath("/admin/pages");
    revalidatePath(`/admin/pages/${id}`);
    revalidatePath(`/${existing.slug}`);
    if (data.slug && data.slug !== existing.slug) {
      revalidatePath(`/${data.slug}`);
    }
    return { success: true, data: page, message: "Halaman berhasil diperbarui" };
  } catch (error) {
    console.error("Update page error:", error);
    return { success: false, error: "Gagal memperbarui halaman" };
  }
}

export async function deletePage(id: string): Promise<ApiResponse> {
  const session = await auth();
  if (!session) {
    return { success: false, error: "Unauthorized" };
  }

  try {
    // Check if page has children
    const childrenCount = await prisma.page.count({
      where: { parentId: id },
    });

    if (childrenCount > 0) {
      return {
        success: false,
        error: `Halaman memiliki ${childrenCount} sub-halaman. Hapus atau pindahkan terlebih dahulu.`,
      };
    }

    const page = await prisma.page.delete({ where: { id } });

    revalidatePath("/admin/pages");
    revalidatePath(`/${page.slug}`);
    return { success: true, message: "Halaman berhasil dihapus" };
  } catch (error) {
    console.error("Delete page error:", error);
    return { success: false, error: "Gagal menghapus halaman" };
  }
}

export async function duplicatePage(id: string): Promise<ApiResponse> {
  const session = await auth();
  if (!session) {
    return { success: false, error: "Unauthorized" };
  }

  try {
    const original = await prisma.page.findUnique({ where: { id } });
    if (!original) {
      return { success: false, error: "Halaman tidak ditemukan" };
    }

    // Generate new unique slug
    let newSlug = `${original.slug}-copy`;
    let counter = 1;
    while (await prisma.page.findUnique({ where: { slug: newSlug } })) {
      newSlug = `${original.slug}-copy-${counter}`;
      counter++;
    }

    const page = await prisma.page.create({
      data: {
        title: `${original.title} (Copy)`,
        slug: newSlug,
        content: original.content || [],
        excerpt: original.excerpt,
        featuredImg: original.featuredImg,
        status: "DRAFT",
        template: original.template,
        seoTitle: original.seoTitle,
        seoDesc: original.seoDesc,
        seoKeywords: original.seoKeywords,
        ogImage: original.ogImage,
        authorId: session.user.id,
        locale: original.locale,
        parentId: original.parentId,
      },
    });

    revalidatePath("/admin/pages");
    return { success: true, data: page, message: "Halaman berhasil diduplikasi" };
  } catch (error) {
    console.error("Duplicate page error:", error);
    return { success: false, error: "Gagal menduplikasi halaman" };
  }
}

export async function reorderPages(
  items: { id: string; order: number }[]
): Promise<ApiResponse> {
  const session = await auth();
  if (!session) {
    return { success: false, error: "Unauthorized" };
  }

  try {
    // Use transaction for batch updates to avoid N+1 queries
    await prisma.$transaction(
      items.map((item) =>
        prisma.page.update({
          where: { id: item.id },
          data: { order: item.order },
        })
      )
    );

    revalidatePath("/admin/pages");
    return { success: true, message: "Urutan halaman berhasil diperbarui" };
  } catch (error) {
    console.error("Reorder pages error:", error);
    return { success: false, error: "Gagal mengubah urutan halaman" };
  }
}

// Get all pages for dropdown/select (minimal data)
export async function getPagesForSelect() {
  const pages = await prisma.page.findMany({
    select: {
      id: true,
      title: true,
      slug: true,
      parentId: true,
    },
    orderBy: [{ order: "asc" }, { title: "asc" }],
  });

  return pages;
}
