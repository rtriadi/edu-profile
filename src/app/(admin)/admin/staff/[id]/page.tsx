import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getStaffById } from "@/actions/staff";
import { StaffForm } from "@/components/admin/staff/staff-form";

export const metadata: Metadata = {
  title: "Edit Staff",
  description: "Edit data guru atau staff",
};

interface EditStaffPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditStaffPage({ params }: EditStaffPageProps) {
  const { id } = await params;
  const staff = await getStaffById(id);

  if (!staff) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Edit Staff</h1>
        <p className="text-muted-foreground">
          Edit informasi {staff.name}
        </p>
      </div>

      <StaffForm staff={staff} />
    </div>
  );
}
