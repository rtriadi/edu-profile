import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getUserById } from "@/actions/users";
import { UserForm } from "@/components/admin/users/user-form";

export const metadata: Metadata = {
  title: "Edit Pengguna",
  description: "Edit pengguna",
};

interface EditUserPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditUserPage({ params }: EditUserPageProps) {
  const { id } = await params;
  const user = await getUserById(id);

  if (!user) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Edit Pengguna</h1>
        <p className="text-muted-foreground">
          Edit informasi pengguna {user.name}
        </p>
      </div>

      <UserForm user={user} />
    </div>
  );
}
