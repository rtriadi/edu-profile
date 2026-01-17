import { Metadata } from "next";
import { MenuManager } from "@/components/admin/menus/menu-manager";
import { getMenus } from "@/actions/menus";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Menu Manager - Admin",
};

export default async function MenusPage() {
  const menus = await getMenus();
  const pages = await prisma.page.findMany({
    where: { status: "PUBLISHED" },
    select: { id: true, title: true, slug: true },
    orderBy: { title: "asc" },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Menu Manager</h1>
        <p className="text-muted-foreground">
          Kelola menu navigasi website
        </p>
      </div>

      <MenuManager menus={menus} pages={pages} />
    </div>
  );
}
