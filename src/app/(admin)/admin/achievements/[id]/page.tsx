import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAchievementById } from "@/actions/achievements";
import { AchievementEditForm } from "./achievement-edit-form";

export const metadata: Metadata = {
  title: "Edit Prestasi",
  description: "Edit data prestasi",
};

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditAchievementPage({ params }: PageProps) {
  const { id } = await params;
  const achievement = await getAchievementById(id);

  if (!achievement) {
    notFound();
  }

  return <AchievementEditForm achievement={achievement} />;
}
