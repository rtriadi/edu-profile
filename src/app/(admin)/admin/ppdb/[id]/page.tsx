import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPPDBPeriodById } from "@/actions/ppdb";
import { PPDBPeriodEditForm } from "./ppdb-edit-form";

export const metadata: Metadata = {
  title: "Edit Periode PPDB",
  description: "Edit periode PPDB",
};

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditPPDBPeriodPage({ params }: PageProps) {
  const { id } = await params;
  const period = await getPPDBPeriodById(id);

  if (!period) {
    notFound();
  }

  return <PPDBPeriodEditForm period={period} />;
}
