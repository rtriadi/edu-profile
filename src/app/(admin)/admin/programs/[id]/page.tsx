import { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProgramForm } from "@/components/admin/programs/program-form";
import { getProgramById } from "@/actions/programs";

export const metadata: Metadata = {
  title: "Edit Program - Admin",
};

interface EditProgramPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditProgramPage({ params }: EditProgramPageProps) {
  const { id } = await params;
  const program = await getProgramById(id);

  if (!program) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Edit Program</h1>
        <p className="text-muted-foreground">
          Edit program: {program.name}
        </p>
      </div>

      <ProgramForm program={program} />
    </div>
  );
}
