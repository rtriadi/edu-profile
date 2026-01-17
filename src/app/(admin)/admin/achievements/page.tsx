"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Pencil, Trash2, Eye, EyeOff, Loader2, Trophy } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  getAchievements,
  deleteAchievement,
  toggleAchievementPublish,
} from "@/actions/achievements";

interface Achievement {
  id: string;
  title: string;
  description: string | null;
  category: string | null;
  level: string | null;
  date: Date | null;
  image: string | null;
  participants: string | null;
  isPublished: boolean;
  createdAt: Date;
}

export default function AchievementsPage() {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const loadAchievements = async () => {
    setIsLoading(true);
    try {
      const result = await getAchievements();
      setAchievements(result.data);
    } catch (error) {
      console.error("Error loading achievements:", error);
      toast.error("Gagal memuat data prestasi");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadAchievements();
  }, []);

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    const result = await deleteAchievement(id);
    if (result.success) {
      toast.success(result.message);
      loadAchievements();
    } else {
      toast.error(result.error);
    }
    setDeletingId(null);
  };

  const handleTogglePublish = async (id: string) => {
    const result = await toggleAchievementPublish(id);
    if (result.success) {
      toast.success(result.message);
      loadAchievements();
    } else {
      toast.error(result.error);
    }
  };

  const formatDate = (date: Date | null) => {
    if (!date) return "-";
    return new Date(date).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Prestasi</h1>
          <p className="text-muted-foreground">
            Kelola prestasi sekolah dan siswa
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/achievements/new">
            <Plus className="mr-2 h-4 w-4" />
            Tambah Prestasi
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Daftar Prestasi</CardTitle>
          <CardDescription>
            Prestasi akademik, olahraga, dan seni siswa maupun sekolah
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : achievements.length === 0 ? (
            <div className="text-center py-8">
              <Trophy className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">
                Belum ada data prestasi. Klik tombol &quot;Tambah Prestasi&quot; untuk menambahkan.
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Judul</TableHead>
                  <TableHead>Kategori</TableHead>
                  <TableHead>Tingkat</TableHead>
                  <TableHead>Tanggal</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {achievements.map((achievement) => (
                  <TableRow key={achievement.id}>
                    <TableCell>
                      <div className="font-medium">{achievement.title}</div>
                      {achievement.participants && (
                        <div className="text-sm text-muted-foreground">
                          {achievement.participants}
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      {achievement.category ? (
                        <Badge variant="outline">{achievement.category}</Badge>
                      ) : (
                        "-"
                      )}
                    </TableCell>
                    <TableCell>
                      {achievement.level ? (
                        <Badge variant="secondary">{achievement.level}</Badge>
                      ) : (
                        "-"
                      )}
                    </TableCell>
                    <TableCell>{formatDate(achievement.date)}</TableCell>
                    <TableCell>
                      <Badge
                        variant={achievement.isPublished ? "default" : "secondary"}
                      >
                        {achievement.isPublished ? "Dipublikasikan" : "Draft"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleTogglePublish(achievement.id)}
                          title={achievement.isPublished ? "Sembunyikan" : "Publikasikan"}
                        >
                          {achievement.isPublished ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </Button>
                        <Button variant="ghost" size="icon" asChild>
                          <Link href={`/admin/achievements/${achievement.id}`}>
                            <Pencil className="h-4 w-4" />
                          </Link>
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-destructive hover:text-destructive"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Hapus Prestasi</AlertDialogTitle>
                              <AlertDialogDescription>
                                Apakah Anda yakin ingin menghapus prestasi &quot;{achievement.title}&quot;? 
                                Tindakan ini tidak dapat dibatalkan.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Batal</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDelete(achievement.id)}
                                disabled={deletingId === achievement.id}
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                              >
                                {deletingId === achievement.id ? (
                                  <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Menghapus...
                                  </>
                                ) : (
                                  "Hapus"
                                )}
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
