import { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageForm } from "@/components/admin/pages/page-form";
import { getPageById, getPagesForSelect } from "@/actions/pages";

interface EditPagePageProps {
  params: Promise<{
    id: string;
  }>;
}

export const metadata: Metadata = {
  title: "Edit Halaman",
  description: "Edit halaman",
};

export default async function EditPagePage({ params }: EditPagePageProps) {
  const { id } = await params;
  
  const [page, pages] = await Promise.all([
    getPageById(id),
    getPagesForSelect(),
  ]);

  if (!page) {
    notFound();
  }

  // Filter out current page from parent options
  const parentOptions = pages.filter(p => p.id !== id);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Edit Halaman</h1>
        <p className="text-muted-foreground">
          Perbarui halaman
        </p>
      </div>

      <PageForm page={page} pages={parentOptions} />
    </div>
  );
}
