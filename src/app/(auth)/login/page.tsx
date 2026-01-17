import { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import LoginForm from "@/components/auth/login-form";

export const metadata: Metadata = {
  title: "Login | EduProfile CMS",
  description: "Login ke panel admin EduProfile CMS",
};

export default async function LoginPage() {
  const session = await auth();

  if (session) {
    redirect("/admin");
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      <div className="w-full max-w-md px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-primary">EduProfile CMS</h1>
          <p className="text-muted-foreground mt-2">
            Sistem Manajemen Konten Profil Sekolah
          </p>
        </div>
        <LoginForm />
      </div>
    </div>
  );
}
