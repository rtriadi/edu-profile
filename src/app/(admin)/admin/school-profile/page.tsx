import { Metadata } from "next";
import { getSchoolProfile } from "@/actions/school-profile";
import { SchoolProfileForm } from "@/components/admin/school-profile/school-profile-form";

export const metadata: Metadata = {
  title: "Profil Sekolah",
  description: "Kelola informasi profil sekolah",
};

export default async function SchoolProfilePage() {
  const profile = await getSchoolProfile();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Profil Sekolah</h1>
        <p className="text-muted-foreground">
          Kelola informasi dasar sekolah yang ditampilkan di website
        </p>
      </div>

      <SchoolProfileForm profile={profile} />
    </div>
  );
}
