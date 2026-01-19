"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { postSchema, type PostInput } from "@/lib/validations";
import { generateSlug } from "@/lib/utils";
import type { ApiResponse, Status } from "@/types";

export async function getPosts(params?: {
  page?: number;
  limit?: number;
  search?: string;
  categoryId?: string;
  categorySlug?: string;
  status?: Status;
  locale?: string;
}) {
  const page = params?.page || 1;
  const limit = params?.limit || 10;
  const skip = (page - 1) * limit;

  const where: Record<string, unknown> = {};
  
  if (params?.search) {
    where.OR = [
      { title: { contains: params.search } },
      { excerpt: { contains: params.search } },
    ];
  }
  
  if (params?.categoryId) {
    where.categoryId = params.categoryId;
  }

  if (params?.categorySlug) {
    where.category = { slug: params.categorySlug };
  }
  
  if (params?.status) {
    where.status = params.status;
  }

  if (params?.locale) {
    where.locale = params.locale;
  }

  const [posts, total] = await Promise.all([
    prisma.post.findMany({
      where,
      include: {
        category: {
          select: { id: true, name: true, slug: true, color: true },
        },
        author: {
          select: { id: true, name: true, image: true },
        },
      },
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
    }),
    prisma.post.count({ where }),
  ]);

  return {
    data: posts,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
}

export async function getPostById(id: string) {
  const post = await prisma.post.findUnique({
    where: { id },
    include: {
      category: true,
      author: {
        select: { id: true, name: true, image: true },
      },
      tags: {
        include: {
          tag: true,
        },
      },
    },
  });

  return post;
}

export async function getPostBySlug(slug: string) {
  const post = await prisma.post.findUnique({
    where: { slug, status: "PUBLISHED" },
    include: {
      category: true,
      author: {
        select: { id: true, name: true, image: true },
      },
      tags: {
        include: {
          tag: true,
        },
      },
    },
  });

  // Increment view count
  if (post) {
    await prisma.post.update({
      where: { id: post.id },
      data: { views: { increment: 1 } },
    });
  }

  return post;
}

export async function createPost(data: PostInput): Promise<ApiResponse> {
  const session = await auth();
  if (!session) {
    return { success: false, error: "Unauthorized" };
  }

  try {
    const validated = postSchema.parse(data);

    // Check if slug already exists
    const existing = await prisma.post.findUnique({
      where: { slug: validated.slug },
    });

    if (existing) {
      return { success: false, error: "Slug sudah digunakan" };
    }

    // Create post with transaction
    const post = await prisma.$transaction(async (tx) => {
      const newPost = await tx.post.create({
        data: {
          title: validated.title,
          slug: validated.slug,
          content: validated.content || [],
          excerpt: validated.excerpt,
          featuredImg: validated.featuredImg,
          status: validated.status,
          categoryId: validated.categoryId,
          authorId: session.user.id,
          isFeatured: validated.isFeatured,
          seoTitle: validated.seoTitle,
          seoDesc: validated.seoDesc,
          locale: validated.locale,
          publishedAt: validated.status === "PUBLISHED" ? new Date() : null,
        },
      });

      // Add tags if provided
      if (validated.tags && validated.tags.length > 0) {
        await tx.postToTag.createMany({
          data: validated.tags.map((tagId) => ({
            postId: newPost.id,
            tagId,
          })),
        });
      }

      return newPost;
    });

    revalidatePath("/admin/posts");
    revalidatePath("/berita");
    return { success: true, data: post, message: "Berita berhasil dibuat" };
  } catch (error) {
    console.error("Create post error:", error);
    return { success: false, error: "Gagal membuat berita" };
  }
}

export async function updatePost(
  id: string,
  data: Partial<PostInput>
): Promise<ApiResponse> {
  const session = await auth();
  if (!session) {
    return { success: false, error: "Unauthorized" };
  }

  try {
    const existing = await prisma.post.findUnique({ where: { id } });
    if (!existing) {
      return { success: false, error: "Berita tidak ditemukan" };
    }

    // Check if slug is used by another post
    if (data.slug && data.slug !== existing.slug) {
      const slugExists = await prisma.post.findUnique({
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

    // Update post with transaction
    const post = await prisma.$transaction(async (tx) => {
      const updatedPost = await tx.post.update({
        where: { id },
        data: {
          title: data.title,
          slug: data.slug,
          content: data.content,
          excerpt: data.excerpt,
          featuredImg: data.featuredImg,
          status: data.status,
          categoryId: data.categoryId,
          isFeatured: data.isFeatured,
          seoTitle: data.seoTitle,
          seoDesc: data.seoDesc,
          locale: data.locale,
          publishedAt,
        },
      });

      // Update tags if provided
      if (data.tags !== undefined) {
        // Remove existing tags
        await tx.postToTag.deleteMany({
          where: { postId: id },
        });

        // Add new tags
        if (data.tags.length > 0) {
          await tx.postToTag.createMany({
            data: data.tags.map((tagId) => ({
              postId: updatedPost.id,
              tagId,
            })),
          });
        }
      }

      return updatedPost;
    });

    revalidatePath("/admin/posts");
    revalidatePath(`/admin/posts/${id}`);
    revalidatePath("/berita");
    revalidatePath(`/berita/${post.slug}`);
    return { success: true, data: post, message: "Berita berhasil diperbarui" };
  } catch (error) {
    console.error("Update post error:", error);
    return { success: false, error: "Gagal memperbarui berita" };
  }
}

export async function deletePost(id: string): Promise<ApiResponse> {
  const session = await auth();
  if (!session) {
    return { success: false, error: "Unauthorized" };
  }

  try {
    await prisma.post.delete({ where: { id } });

    revalidatePath("/admin/posts");
    revalidatePath("/berita");
    return { success: true, message: "Berita berhasil dihapus" };
  } catch (error) {
    console.error("Delete post error:", error);
    return { success: false, error: "Gagal menghapus berita" };
  }
}

export async function togglePostFeatured(id: string): Promise<ApiResponse> {
  const session = await auth();
  if (!session) {
    return { success: false, error: "Unauthorized" };
  }

  try {
    const post = await prisma.post.findUnique({ where: { id } });
    if (!post) {
      return { success: false, error: "Berita tidak ditemukan" };
    }

    await prisma.post.update({
      where: { id },
      data: { isFeatured: !post.isFeatured },
    });

    revalidatePath("/admin/posts");
    return {
      success: true,
      message: post.isFeatured
        ? "Berita dihapus dari unggulan"
        : "Berita ditandai sebagai unggulan",
    };
  } catch (error) {
    console.error("Toggle post featured error:", error);
    return { success: false, error: "Gagal mengubah status unggulan" };
  }
}

// Categories
export async function getCategories() {
  const categories = await prisma.category.findMany({
    orderBy: { order: "asc" },
    include: {
      _count: {
        select: { posts: true },
      },
    },
  });
  return categories;
}

export async function createCategory(data: {
  name: string;
  slug?: string;
  description?: string;
  color?: string;
}): Promise<ApiResponse> {
  const session = await auth();
  if (!session) {
    return { success: false, error: "Unauthorized" };
  }

  try {
    const slug = data.slug || generateSlug(data.name);

    const existing = await prisma.category.findUnique({ where: { slug } });
    if (existing) {
      return { success: false, error: "Slug sudah digunakan" };
    }

    const category = await prisma.category.create({
      data: {
        name: data.name,
        slug,
        description: data.description,
        color: data.color,
      },
    });

    revalidatePath("/admin/posts/categories");
    return { success: true, data: category, message: "Kategori berhasil dibuat" };
  } catch (error) {
    console.error("Create category error:", error);
    return { success: false, error: "Gagal membuat kategori" };
  }
}

export async function updateCategory(
  id: string,
  data: {
    name?: string;
    slug?: string;
    description?: string;
    color?: string;
  }
): Promise<ApiResponse> {
  const session = await auth();
  if (!session) {
    return { success: false, error: "Unauthorized" };
  }

  try {
    if (data.slug) {
      const existing = await prisma.category.findFirst({
        where: { slug: data.slug, NOT: { id } },
      });
      if (existing) {
        return { success: false, error: "Slug sudah digunakan" };
      }
    }

    const category = await prisma.category.update({
      where: { id },
      data,
    });

    revalidatePath("/admin/posts/categories");
    return { success: true, data: category, message: "Kategori berhasil diperbarui" };
  } catch (error) {
    console.error("Update category error:", error);
    return { success: false, error: "Gagal memperbarui kategori" };
  }
}

export async function deleteCategory(id: string): Promise<ApiResponse> {
  const session = await auth();
  if (!session) {
    return { success: false, error: "Unauthorized" };
  }

  try {
    // Check if category has posts
    const postsCount = await prisma.post.count({
      where: { categoryId: id },
    });

    if (postsCount > 0) {
      return {
        success: false,
        error: `Kategori masih memiliki ${postsCount} berita. Pindahkan atau hapus berita terlebih dahulu.`,
      };
    }

    await prisma.category.delete({ where: { id } });

    revalidatePath("/admin/posts/categories");
    return { success: true, message: "Kategori berhasil dihapus" };
  } catch (error) {
    console.error("Delete category error:", error);
    return { success: false, error: "Gagal menghapus kategori" };
  }
}

// Tags
export async function getTags() {
  const tags = await prisma.tag.findMany({
    orderBy: { name: "asc" },
    include: {
      _count: {
        select: { posts: true },
      },
    },
  });
  return tags;
}

export async function createTag(data: {
  name: string;
  slug?: string;
}): Promise<ApiResponse> {
  const session = await auth();
  if (!session) {
    return { success: false, error: "Unauthorized" };
  }

  try {
    const slug = data.slug || generateSlug(data.name);

    const existing = await prisma.tag.findUnique({ where: { slug } });
    if (existing) {
      return { success: false, error: "Tag sudah ada" };
    }

    const tag = await prisma.tag.create({
      data: {
        name: data.name,
        slug,
      },
    });

    revalidatePath("/admin/posts/tags");
    return { success: true, data: tag, message: "Tag berhasil dibuat" };
  } catch (error) {
    console.error("Create tag error:", error);
    return { success: false, error: "Gagal membuat tag" };
  }
}

export async function deleteTag(id: string): Promise<ApiResponse> {
  const session = await auth();
  if (!session) {
    return { success: false, error: "Unauthorized" };
  }

  try {
    await prisma.tag.delete({ where: { id } });

    revalidatePath("/admin/posts/tags");
    return { success: true, message: "Tag berhasil dihapus" };
  } catch (error) {
    console.error("Delete tag error:", error);
    return { success: false, error: "Gagal menghapus tag" };
  }
}
