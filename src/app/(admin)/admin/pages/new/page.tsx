import { Metadata } from "next";
import { PageForm } from "@/components/admin/pages/page-form";
import { getPagesForSelect } from "@/actions/pages";

export const metadata: Metadata = {
  title: "Buat Halaman",
  description: "Buat halaman baru",
};

export default async function NewPagePage() {
  const pages = await getPagesForSelect();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Buat Halaman</h1>
        <p className="text-muted-foreground">
          Buat halaman baru untuk website
        </p>
      </div>

      <PageForm pages={pages} />
    </div>
  );
}
