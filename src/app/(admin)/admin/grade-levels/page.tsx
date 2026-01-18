import { Metadata } from "next";
import Link from "next/link";
import { Plus, GraduationCap, ToggleLeft, ToggleRight, Pencil, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { getGradeLevels, deleteGradeLevel, toggleGradeLevelActive } from "@/actions/grade-levels";
import { DeleteButton } from "@/components/admin/delete-button";
import { ToggleActiveButton } from "@/components/admin/toggle-active-button";

export const metadata: Metadata = {
  title: "Kelola Kelas",
  description: "Kelola daftar kelas yang dibuka",
};

export default async function GradeLevelsPage() {
  const { data: gradeLevels } = await getGradeLevels();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Kelas</h1>
          <p className="text-muted-foreground">
            Kelola daftar kelas yang dibuka untuk pendaftaran
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/grade-levels/new">
            <Plus className="mr-2 h-4 w-4" />
            Tambah Kelas
          </Link>
        </Button>
      </div>

      {gradeLevels.length === 0 ? (
        <div className="text-center py-12 border rounded-lg">
          <GraduationCap className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Belum ada kelas</h3>
          <p className="text-muted-foreground mb-4">
            Tambahkan kelas yang dibuka untuk pendaftaran siswa baru.
          </p>
          <Button asChild>
            <Link href="/admin/grade-levels/new">
              <Plus className="mr-2 h-4 w-4" />
              Tambah Kelas Pertama
            </Link>
          </Button>
        </div>
      ) : (
        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Urutan</TableHead>
                <TableHead>Nama Kelas</TableHead>
                <TableHead>Rentang Usia</TableHead>
                <TableHead>Kuota</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {gradeLevels.map((gradeLevel) => (
                <TableRow key={gradeLevel.id}>
                  <TableCell className="font-medium">{gradeLevel.order}</TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">{gradeLevel.name}</p>
                      {gradeLevel.description && (
                        <p className="text-sm text-muted-foreground line-clamp-1">
                          {gradeLevel.description}
                        </p>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>{gradeLevel.ageRange || "-"}</TableCell>
                  <TableCell>{gradeLevel.quota || "-"}</TableCell>
                  <TableCell>
                    <Badge variant={gradeLevel.isActive ? "default" : "secondary"}>
                      {gradeLevel.isActive ? "Aktif" : "Nonaktif"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <ToggleActiveButton
                        id={gradeLevel.id}
                        isActive={gradeLevel.isActive}
                        action={toggleGradeLevelActive}
                      />
                      <Button variant="outline" size="icon" asChild>
                        <Link href={`/admin/grade-levels/${gradeLevel.id}`}>
                          <Pencil className="h-4 w-4" />
                        </Link>
                      </Button>
                      <DeleteButton
                        id={gradeLevel.id}
                        action={deleteGradeLevel}
                        title="Hapus Kelas"
                        description="Apakah Anda yakin ingin menghapus kelas ini?"
                      />
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
