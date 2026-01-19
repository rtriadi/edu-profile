"use client";

import { useState } from "react";
import { Download, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { getAllPPDBRegistrations } from "@/actions/ppdb";
import { formatDate } from "@/lib/utils";

interface ExportButtonProps {
  periodId?: string;
}

export function ExportButton({ periodId }: ExportButtonProps) {
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    setIsExporting(true);
    try {
      const data = await getAllPPDBRegistrations(periodId);
      
      if (!data || data.length === 0) {
        toast.error("Tidak ada data untuk diexport");
        return;
      }

      // Convert to CSV
      const headers = [
        "No. Registrasi",
        "Nama Siswa",
        "NISN",
        "Jenis Kelamin",
        "Tempat Lahir",
        "Tanggal Lahir",
        "Agama",
        "Alamat",
        "Asal Sekolah",
        "Nama Ayah",
        "Pekerjaan Ayah",
        "No. HP Ayah",
        "Nama Ibu",
        "Pekerjaan Ibu",
        "No. HP Ibu",
        "Status",
        "Periode",
        "Tanggal Daftar"
      ];

      const rows = data.map(item => [
        item.registrationNo,
        item.studentName,
        item.nisn || "-",
        item.gender === "MALE" ? "Laki-laki" : "Perempuan",
        item.birthPlace,
        formatDate(item.birthDate),
        item.religion || "-",
        item.address,
        item.previousSchool || "-",
        item.fatherName || "-",
        item.fatherJob || "-",
        item.fatherPhone || "-",
        item.motherName || "-",
        item.motherJob || "-",
        item.motherPhone || "-",
        item.status,
        item.period.name,
        formatDate(item.createdAt)
      ]);

      const csvContent = [
        headers.join(","),
        ...rows.map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(","))
      ].join("\n");

      // Download
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute("download", `ppdb_export_${new Date().toISOString().slice(0, 10)}.csv`);
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast.success("Data berhasil diexport");
    } catch (error) {
      console.error(error);
      toast.error("Gagal export data");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <Button variant="outline" onClick={handleExport} disabled={isExporting}>
      {isExporting ? (
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      ) : (
        <Download className="mr-2 h-4 w-4" />
      )}
      Export Excel (CSV)
    </Button>
  );
}
