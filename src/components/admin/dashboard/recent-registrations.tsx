"use client";

import Link from "next/link";
import { Users, Eye, GraduationCap } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";
import type { PPDBStatus } from "@prisma/client";

interface Registration {
  id: string;
  studentName: string;
  status: PPDBStatus;
  createdAt: Date;
}

interface RecentRegistrationsProps {
  registrations: Registration[];
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
  WITHDRAWN: "Mundur",
};

export function RecentRegistrations({ registrations }: RecentRegistrationsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <GraduationCap className="h-5 w-5" />
          Pendaftar Terbaru
        </CardTitle>
        <CardDescription>5 pendaftar PPDB terakhir</CardDescription>
      </CardHeader>
      <CardContent>
        {registrations.length > 0 ? (
          <div className="space-y-4">
            {registrations.map((reg) => (
              <div
                key={reg.id}
                className="flex items-center justify-between border-b pb-3 last:border-0 last:pb-0"
              >
                <div className="space-y-1 flex-1 min-w-0">
                  <p className="text-sm font-medium leading-none truncate">
                    {reg.studentName}
                  </p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span>{formatDate(reg.createdAt)}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className={`text-[10px] h-5 ${statusColors[reg.status]}`}>
                    {statusLabels[reg.status]}
                  </Badge>
                  <Link href={`/admin/ppdb/registrations/${reg.id}`}>
                    <Button variant="ghost" size="icon" className="h-7 w-7">
                      <Eye className="h-4 w-4" />
                      <span className="sr-only">Lihat</span>
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground text-center py-8">
            Belum ada pendaftaran
          </p>
        )}
      </CardContent>
    </Card>
  );
}

import { Button } from "@/components/ui/button";
