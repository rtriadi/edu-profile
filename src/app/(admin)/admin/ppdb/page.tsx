"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Plus,
  Pencil,
  Trash2,
  ToggleLeft,
  ToggleRight,
  Loader2,
  Calendar,
  Users,
} from "lucide-react";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  getPPDBPeriods,
  deletePPDBPeriod,
  togglePPDBPeriodActive,
  getPPDBRegistrations,
} from "@/actions/ppdb";

interface PPDBPeriod {
  id: string;
  name: string;
  academicYear: string;
  description: string | null;
  startDate: Date;
  endDate: Date;
  quota: number | null;
  isActive: boolean;
  _count: {
    registrations: number;
  };
}

interface PPDBRegistration {
  id: string;
  registrationNo: string;
  studentName: string;
  status: string;
  createdAt: Date;
  period: {
    name: string;
    academicYear: string;
  };
}

export default function PPDBPage() {
  const [periods, setPeriods] = useState<PPDBPeriod[]>([]);
  const [registrations, setRegistrations] = useState<PPDBRegistration[]>([]);
  const [isLoadingPeriods, setIsLoadingPeriods] = useState(true);
  const [isLoadingRegistrations, setIsLoadingRegistrations] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const loadPeriods = async () => {
    setIsLoadingPeriods(true);
    try {
      const result = await getPPDBPeriods();
      setPeriods(result.data);
    } catch (error) {
      console.error("Error loading PPDB periods:", error);
      toast.error("Gagal memuat data periode PPDB");
    } finally {
      setIsLoadingPeriods(false);
    }
  };

  const loadRegistrations = async () => {
    setIsLoadingRegistrations(true);
    try {
      const result = await getPPDBRegistrations();
      setRegistrations(result.data);
    } catch (error) {
      console.error("Error loading registrations:", error);
      toast.error("Gagal memuat data pendaftaran");
    } finally {
      setIsLoadingRegistrations(false);
    }
  };

  useEffect(() => {
    loadPeriods();
    loadRegistrations();
  }, []);

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    const result = await deletePPDBPeriod(id);
    if (result.success) {
      toast.success(result.message);
      loadPeriods();
    } else {
      toast.error(result.error);
    }
    setDeletingId(null);
  };

  const handleToggleActive = async (id: string) => {
    const result = await togglePPDBPeriodActive(id);
    if (result.success) {
      toast.success(result.message);
      loadPeriods();
    } else {
      toast.error(result.error);
    }
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
      PENDING: { label: "Menunggu", variant: "secondary" },
      REVIEWING: { label: "Direview", variant: "outline" },
      ACCEPTED: { label: "Diterima", variant: "default" },
      REJECTED: { label: "Ditolak", variant: "destructive" },
      ENROLLED: { label: "Terdaftar", variant: "default" },
      WITHDRAWN: { label: "Dibatalkan", variant: "secondary" },
    };
    const s = statusMap[status] || { label: status, variant: "secondary" as const };
    return <Badge variant={s.variant}>{s.label}</Badge>;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">PPDB Online</h1>
          <p className="text-muted-foreground">
            Kelola Penerimaan Peserta Didik Baru
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/ppdb/new">
            <Plus className="mr-2 h-4 w-4" />
            Buat Periode PPDB
          </Link>
        </Button>
      </div>

      <Tabs defaultValue="periods" className="space-y-6">
        <TabsList>
          <TabsTrigger value="periods" className="gap-2">
            <Calendar className="h-4 w-4" />
            Periode PPDB
          </TabsTrigger>
          <TabsTrigger value="registrations" className="gap-2">
            <Users className="h-4 w-4" />
            Pendaftaran
          </TabsTrigger>
        </TabsList>

        <TabsContent value="periods">
          <Card>
            <CardHeader>
              <CardTitle>Periode PPDB</CardTitle>
              <CardDescription>
                Kelola periode penerimaan peserta didik baru
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoadingPeriods ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
              ) : periods.length === 0 ? (
                <div className="text-center py-8">
                  <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">
                    Belum ada periode PPDB. Klik tombol &quot;Buat Periode PPDB&quot; untuk memulai.
                  </p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nama Periode</TableHead>
                      <TableHead>Tahun Ajaran</TableHead>
                      <TableHead>Tanggal</TableHead>
                      <TableHead>Kuota</TableHead>
                      <TableHead>Pendaftar</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Aksi</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {periods.map((period) => (
                      <TableRow key={period.id}>
                        <TableCell className="font-medium">
                          {period.name}
                        </TableCell>
                        <TableCell>{period.academicYear}</TableCell>
                        <TableCell>
                          <div className="text-sm">
                            {formatDate(period.startDate)} - {formatDate(period.endDate)}
                          </div>
                        </TableCell>
                        <TableCell>{period.quota || "-"}</TableCell>
                        <TableCell>{period._count.registrations}</TableCell>
                        <TableCell>
                          <Badge variant={period.isActive ? "default" : "secondary"}>
                            {period.isActive ? "Aktif" : "Nonaktif"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleToggleActive(period.id)}
                              title={period.isActive ? "Nonaktifkan" : "Aktifkan"}
                            >
                              {period.isActive ? (
                                <ToggleRight className="h-4 w-4 text-green-600" />
                              ) : (
                                <ToggleLeft className="h-4 w-4" />
                              )}
                            </Button>
                            <Button variant="ghost" size="icon" asChild>
                              <Link href={`/admin/ppdb/${period.id}`}>
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
                                  <AlertDialogTitle>Hapus Periode PPDB</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Apakah Anda yakin ingin menghapus periode &quot;{period.name}&quot;?
                                    {period._count.registrations > 0 && (
                                      <span className="block mt-2 text-destructive">
                                        Periode ini memiliki {period._count.registrations} pendaftaran.
                                        Hapus semua pendaftaran terlebih dahulu.
                                      </span>
                                    )}
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Batal</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => handleDelete(period.id)}
                                    disabled={deletingId === period.id || period._count.registrations > 0}
                                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                  >
                                    {deletingId === period.id ? (
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
        </TabsContent>

        <TabsContent value="registrations">
          <Card>
            <CardHeader>
              <CardTitle>Data Pendaftaran</CardTitle>
              <CardDescription>
                Daftar calon peserta didik yang telah mendaftar
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoadingRegistrations ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
              ) : registrations.length === 0 ? (
                <div className="text-center py-8">
                  <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">
                    Belum ada data pendaftaran.
                  </p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>No. Pendaftaran</TableHead>
                      <TableHead>Nama Siswa</TableHead>
                      <TableHead>Periode</TableHead>
                      <TableHead>Tanggal Daftar</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Aksi</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {registrations.map((reg) => (
                      <TableRow key={reg.id}>
                        <TableCell className="font-mono text-sm">
                          {reg.registrationNo}
                        </TableCell>
                        <TableCell className="font-medium">
                          {reg.studentName}
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">{reg.period.name}</div>
                          <div className="text-xs text-muted-foreground">
                            {reg.period.academicYear}
                          </div>
                        </TableCell>
                        <TableCell>{formatDate(reg.createdAt)}</TableCell>
                        <TableCell>{getStatusBadge(reg.status)}</TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="icon" asChild>
                            <Link href={`/admin/ppdb/registrations/${reg.id}`}>
                              <Pencil className="h-4 w-4" />
                            </Link>
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
