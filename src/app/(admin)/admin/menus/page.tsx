import { Metadata } from "next";
import { MenuManager } from "@/components/admin/menus/menu-manager";
import { getMenus } from "@/actions/menus";
import { prisma } from "@/lib/prisma";
import { Info, BookOpen, MousePointer, Layers } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

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

      {/* Help Section */}
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="help" className="border rounded-lg px-4">
          <AccordionTrigger className="hover:no-underline">
            <div className="flex items-center gap-2 text-sm">
              <Info className="h-4 w-4 text-blue-500" />
              <span>Panduan Penggunaan Menu Manager</span>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div className="grid gap-4 md:grid-cols-3 py-2">
              <div className="space-y-2">
                <div className="flex items-center gap-2 font-medium">
                  <BookOpen className="h-4 w-4 text-primary" />
                  <span>Tipe Menu Item</span>
                </div>
                <ul className="text-sm text-muted-foreground space-y-1 ml-6">
                  <li><strong>Rute Sistem</strong> - Halaman bawaan seperti Beranda, Profil, Berita</li>
                  <li><strong>Halaman CMS</strong> - Halaman yang dibuat di menu Pages</li>
                  <li><strong>Link External</strong> - URL eksternal (bisa buka tab baru)</li>
                  <li><strong>Dropdown</strong> - Menu dengan sub-item di dalamnya</li>
                </ul>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2 font-medium">
                  <MousePointer className="h-4 w-4 text-primary" />
                  <span>Cara Membuat Dropdown</span>
                </div>
                <ol className="text-sm text-muted-foreground space-y-1 ml-6 list-decimal">
                  <li>Buat item baru dengan tipe "Dropdown"</li>
                  <li>Buat item lain (Rute/Link/Page)</li>
                  <li>Pilih dropdown sebagai "Parent" item tersebut</li>
                  <li>Item akan menjadi sub-menu dari dropdown</li>
                </ol>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2 font-medium">
                  <Layers className="h-4 w-4 text-primary" />
                  <span>Lokasi Menu</span>
                </div>
                <ul className="text-sm text-muted-foreground space-y-1 ml-6">
                  <li><strong>Header</strong> - Navigasi utama di bagian atas website</li>
                  <li><strong>Footer</strong> - Navigasi di bagian bawah website</li>
                  <li><strong>Mobile</strong> - Menu khusus untuk tampilan mobile</li>
                  <li><strong>Sidebar</strong> - Menu di sidebar (jika ada)</li>
                </ul>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <MenuManager menus={menus} pages={pages} />
    </div>
  );
}
