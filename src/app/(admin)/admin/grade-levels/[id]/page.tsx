import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getGradeLevelById } from "@/actions/grade-levels";
import { GradeLevelForm } from "@/components/admin/grade-levels/grade-level-form";

export const metadata: Metadata = {
  title: "Edit Kelas",
  description: "Edit data kelas",
};

export default async function EditGradeLevelPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const gradeLevel = await getGradeLevelById(id);

  if (!gradeLevel) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Edit Kelas</h1>
        <p className="text-muted-foreground">
          Edit data kelas {gradeLevel.name}
        </p>
      </div>
      <GradeLevelForm gradeLevel={gradeLevel} />
    </div>
  );
}
