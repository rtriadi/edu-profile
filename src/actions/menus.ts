"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { menuSchema, menuItemSchema, type MenuInput, type MenuItemInput } from "@/lib/validations";
import type { ApiResponse } from "@/types";

// ==========================================
// MENU ACTIONS
// ==========================================

export async function getMenus() {
  const menus = await prisma.menu.findMany({
    include: {
      items: {
        where: { parentId: null },
        orderBy: { order: "asc" },
        include: {
          children: {
            orderBy: { order: "asc" },
            include: {
              children: {
                orderBy: { order: "asc" },
              },
            },
          },
        },
      },
    },
    orderBy: { name: "asc" },
  });
  return menus;
}

export async function getMenuById(id: string) {
  const menu = await prisma.menu.findUnique({
    where: { id },
    include: {
      items: {
        where: { parentId: null },
        orderBy: { order: "asc" },
        include: {
          children: {
            orderBy: { order: "asc" },
            include: {
              children: {
                orderBy: { order: "asc" },
              },
            },
          },
        },
      },
    },
  });
  return menu;
}

export async function getMenuByLocation(location: string) {
  const menu = await prisma.menu.findUnique({
    where: { location },
    include: {
      items: {
        where: { parentId: null, isVisible: true },
        orderBy: { order: "asc" },
        include: {
          children: {
            where: { isVisible: true },
            orderBy: { order: "asc" },
            include: {
              children: {
                where: { isVisible: true },
                orderBy: { order: "asc" },
              },
            },
          },
        },
      },
    },
  });
  return menu;
}

export async function createMenu(data: MenuInput): Promise<ApiResponse> {
  const session = await auth();
  if (!session) {
    return { success: false, error: "Unauthorized" };
  }

  try {
    const validated = menuSchema.parse(data);

    // Check if location already exists
    const existing = await prisma.menu.findUnique({
      where: { location: validated.location },
    });
    if (existing) {
      return { success: false, error: "Menu dengan lokasi tersebut sudah ada" };
    }

    const menu = await prisma.menu.create({
      data: {
        name: validated.name,
        location: validated.location,
      },
    });

    revalidatePath("/admin/menus");
    return { success: true, data: menu, message: "Menu berhasil dibuat" };
  } catch (error) {
    console.error("Create menu error:", error);
    return { success: false, error: "Gagal membuat menu" };
  }
}

export async function updateMenu(
  id: string,
  data: Partial<MenuInput>
): Promise<ApiResponse> {
  const session = await auth();
  if (!session) {
    return { success: false, error: "Unauthorized" };
  }

  try {
    const existing = await prisma.menu.findUnique({ where: { id } });
    if (!existing) {
      return { success: false, error: "Menu tidak ditemukan" };
    }

    // Check if new location conflicts
    if (data.location && data.location !== existing.location) {
      const conflict = await prisma.menu.findUnique({
        where: { location: data.location },
      });
      if (conflict) {
        return { success: false, error: "Menu dengan lokasi tersebut sudah ada" };
      }
    }

    const menu = await prisma.menu.update({
      where: { id },
      data: {
        name: data.name,
        location: data.location,
      },
    });

    revalidatePath("/admin/menus");
    return { success: true, data: menu, message: "Menu berhasil diperbarui" };
  } catch (error) {
    console.error("Update menu error:", error);
    return { success: false, error: "Gagal memperbarui menu" };
  }
}

export async function deleteMenu(id: string): Promise<ApiResponse> {
  const session = await auth();
  if (!session) {
    return { success: false, error: "Unauthorized" };
  }

  try {
    await prisma.menu.delete({ where: { id } });

    revalidatePath("/admin/menus");
    return { success: true, message: "Menu berhasil dihapus" };
  } catch (error) {
    console.error("Delete menu error:", error);
    return { success: false, error: "Gagal menghapus menu" };
  }
}

// ==========================================
// MENU ITEM ACTIONS
// ==========================================

export async function createMenuItem(
  menuId: string,
  data: MenuItemInput
): Promise<ApiResponse> {
  const session = await auth();
  if (!session) {
    return { success: false, error: "Unauthorized" };
  }

  try {
    const validated = menuItemSchema.parse(data);

    // Get max order for this parent
    const maxOrder = await prisma.menuItem.aggregate({
      where: { menuId, parentId: validated.parentId || null },
      _max: { order: true },
    });

    const menuItem = await prisma.menuItem.create({
      data: {
        menuId,
        label: validated.label,
        url: validated.url,
        pageSlug: validated.pageSlug,
        type: validated.type,
        parentId: validated.parentId || null,
        order: (maxOrder._max.order ?? -1) + 1,
        isVisible: validated.isVisible,
        openNew: validated.openNew,
        icon: validated.icon,
        cssClass: validated.cssClass,
      },
    });

    revalidatePath("/admin/menus");
    revalidatePath("/");
    return { success: true, data: menuItem, message: "Item menu berhasil ditambahkan" };
  } catch (error) {
    console.error("Create menu item error:", error);
    return { success: false, error: "Gagal menambahkan item menu" };
  }
}

export async function updateMenuItem(
  id: string,
  data: Partial<MenuItemInput>
): Promise<ApiResponse> {
  const session = await auth();
  if (!session) {
    return { success: false, error: "Unauthorized" };
  }

  try {
    const existing = await prisma.menuItem.findUnique({ where: { id } });
    if (!existing) {
      return { success: false, error: "Item menu tidak ditemukan" };
    }

    const menuItem = await prisma.menuItem.update({
      where: { id },
      data: {
        label: data.label,
        url: data.url,
        pageSlug: data.pageSlug,
        type: data.type,
        parentId: data.parentId,
        order: data.order,
        isVisible: data.isVisible,
        openNew: data.openNew,
        icon: data.icon,
        cssClass: data.cssClass,
      },
    });

    revalidatePath("/admin/menus");
    revalidatePath("/");
    return { success: true, data: menuItem, message: "Item menu berhasil diperbarui" };
  } catch (error) {
    console.error("Update menu item error:", error);
    return { success: false, error: "Gagal memperbarui item menu" };
  }
}

export async function deleteMenuItem(id: string): Promise<ApiResponse> {
  const session = await auth();
  if (!session) {
    return { success: false, error: "Unauthorized" };
  }

  try {
    // Delete will cascade to children due to Prisma schema
    await prisma.menuItem.delete({ where: { id } });

    revalidatePath("/admin/menus");
    revalidatePath("/");
    return { success: true, message: "Item menu berhasil dihapus" };
  } catch (error) {
    console.error("Delete menu item error:", error);
    return { success: false, error: "Gagal menghapus item menu" };
  }
}

export async function reorderMenuItems(
  items: { id: string; order: number; parentId?: string | null }[]
): Promise<ApiResponse> {
  const session = await auth();
  if (!session) {
    return { success: false, error: "Unauthorized" };
  }

  try {
    for (const item of items) {
      await prisma.menuItem.update({
        where: { id: item.id },
        data: { 
          order: item.order,
          parentId: item.parentId ?? null,
        },
      });
    }

    revalidatePath("/admin/menus");
    revalidatePath("/");
    return { success: true, message: "Urutan menu berhasil diperbarui" };
  } catch (error) {
    console.error("Reorder menu items error:", error);
    return { success: false, error: "Gagal mengubah urutan menu" };
  }
}

export async function toggleMenuItemVisibility(id: string): Promise<ApiResponse> {
  const session = await auth();
  if (!session) {
    return { success: false, error: "Unauthorized" };
  }

  try {
    const item = await prisma.menuItem.findUnique({ where: { id } });
    if (!item) {
      return { success: false, error: "Item menu tidak ditemukan" };
    }

    await prisma.menuItem.update({
      where: { id },
      data: { isVisible: !item.isVisible },
    });

    revalidatePath("/admin/menus");
    revalidatePath("/");
    return {
      success: true,
      message: item.isVisible
        ? "Item menu disembunyikan"
        : "Item menu ditampilkan",
    };
  } catch (error) {
    console.error("Toggle menu item visibility error:", error);
    return { success: false, error: "Gagal mengubah visibilitas menu" };
  }
}
