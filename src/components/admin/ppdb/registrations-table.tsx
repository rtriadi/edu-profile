"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  MoreHorizontal,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  UserCheck,
  Ban,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { toast } from "sonner";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { updateRegistrationStatus } from "@/actions/ppdb";
import { formatDate } from "@/lib/utils";
import type { PPDBStatus } from "@prisma/client";

interface Registration {
  id: string;
  registrationNo: string;
  studentName: string;
  gender: "MALE" | "FEMALE";
  previousSchool: string | null;
  status: PPDBStatus;
  createdAt: Date;
  period: {
    name: string;
    academicYear: string;
  };
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

interface RegistrationsTableProps {
  registrations: Registration[];
  pagination: Pagination;
}

const statusColors: Record<PPDBStatus, string> = {
  PENDING: "bg-yellow-500",
  REVIEWING: "bg-blue-500",
  ACCEPTED: "bg-green-500",
  REJECTED: "bg-red-500",
  ENROLLED: "bg-purple-500",
  WITHDRAWN: "bg-gray-500",
};

const statusLabels: Record<PPDBStatus, string> = {
  PENDING: "Menunggu",
  REVIEWING: "Direview",
  ACCEPTED: "Diterima",
  REJECTED: "Ditolak",
  ENROLLED: "Daftar Ulang",
  WITHDRAWN: "Mengundurkan Diri",
};

export function RegistrationsTable({ registrations, pagination }: RegistrationsTableProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleStatusUpdate = async (id: string, status: PPDBStatus) => {
    setIsLoading(true);
    const result = await updateRegistrationStatus(id, status);
    
    if (result.success) {
      toast.success(result.message);
      router.refresh();
    } else {
      toast.error(result.error);
    }
    setIsLoading(false);
  };

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(window.location.search);
    params.set("page", page.toString());
    router.push(`?${params.toString()}`);
  };

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>No. Reg</TableHead>
              <TableHead>Nama Siswa</TableHead>
              <TableHead>Asal Sekolah</TableHead>
              <TableHead>Periode</TableHead>
              <TableHead>Tanggal</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-[70px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {registrations.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  Tidak ada data pendaftaran ditemukan
                </TableCell>
              </TableRow>
            ) : (
              registrations.map((reg) => (
                <TableRow key={reg.id}>
                  <TableCell className="font-medium">{reg.registrationNo}</TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span>{reg.studentName}</span>
                      <span className="text-xs text-muted-foreground">
                        {reg.gender === "MALE" ? "Laki-laki" : "Perempuan"}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>{reg.previousSchool || "-"}</TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="text-xs font-medium">{reg.period.name}</span>
                      <span className="text-[10px] text-muted-foreground">{reg.period.academicYear}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {formatDate(reg.createdAt)}
                  </TableCell>
                  <TableCell>
                    <Badge className={statusColors[reg.status]}>
                      {statusLabels[reg.status]}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" disabled={isLoading}>
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => router.push(`/admin/ppdb/registrations/${reg.id}`)}>
                          <Eye className="mr-2 h-4 w-4" />
                          Detail
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => handleStatusUpdate(reg.id, "REVIEWING")}>
                          <Clock className="mr-2 h-4 w-4" />
                          Tandai Direview
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleStatusUpdate(reg.id, "ACCEPTED")}>
                          <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                          Terima Siswa
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleStatusUpdate(reg.id, "REJECTED")}>
                          <XCircle className="mr-2 h-4 w-4 text-red-500" />
                          Tolak Siswa
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleStatusUpdate(reg.id, "ENROLLED")}>
                          <UserCheck className="mr-2 h-4 w-4 text-purple-500" />
                          Daftar Ulang
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleStatusUpdate(reg.id, "WITHDRAWN")}>
                          <Ban className="mr-2 h-4 w-4 text-gray-500" />
                          Mengundurkan Diri
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {pagination.totalPages > 1 && (
        <div className="flex items-center justify-between mt-4">
          <p className="text-sm text-muted-foreground">
            Menampilkan {(pagination.page - 1) * pagination.limit + 1} -{" "}
            {Math.min(pagination.page * pagination.limit, pagination.total)} dari{" "}
            {pagination.total} pendaftar
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(pagination.page - 1)}
              disabled={pagination.page <= 1}
            >
              <ChevronLeft className="h-4 w-4" />
              Sebelumnya
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(pagination.page + 1)}
              disabled={pagination.page >= pagination.totalPages}
            >
              Selanjutnya
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </>
  );
}
