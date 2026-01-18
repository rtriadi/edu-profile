import { Metadata } from "next";
import { FolderOpen } from "lucide-react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { getCategories } from "@/actions/posts";
import { CategoryDialog } from "@/components/admin/posts/category-dialog";

export const metadata: Metadata = {
  title: "Kategori Berita",
  description: "Kelola kategori berita dan artikel",
};

export default async function CategoriesPage() {
  const categories = await getCategories();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Kategori Berita</h1>
          <p className="text-muted-foreground">
            Kelola kategori untuk berita dan artikel
          </p>
        </div>
        <CategoryDialog />
      </div>

      {categories.length === 0 ? (
        <div className="text-center py-12 border rounded-lg">
          <FolderOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Belum ada kategori</h3>
          <p className="text-muted-foreground mb-4">
            Tambahkan kategori untuk mengorganisir berita dan artikel.
          </p>
          <CategoryDialog />
        </div>
      ) : (
        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nama</TableHead>
                <TableHead>Slug</TableHead>
                <TableHead>Warna</TableHead>
                <TableHead>Jumlah Post</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {categories.map((category) => (
                <TableRow key={category.id}>
                  <TableCell className="font-medium">{category.name}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {category.slug}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: category.color || "#3B82F6" }}
                      />
                      <span className="text-xs text-muted-foreground">
                        {category.color || "#3B82F6"}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">{category._count.posts} post</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <CategoryDialog category={category} />
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
