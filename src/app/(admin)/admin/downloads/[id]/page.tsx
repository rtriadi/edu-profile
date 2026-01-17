import { Metadata } from "next";
import { notFound } from "next/navigation";
import { DownloadForm } from "@/components/admin/downloads/download-form";
import { getDownloadById } from "@/actions/downloads";

export const metadata: Metadata = {
  title: "Edit File - Admin",
};

interface EditDownloadPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditDownloadPage({ params }: EditDownloadPageProps) {
  const { id } = await params;
  const download = await getDownloadById(id);

  if (!download) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Edit File</h1>
        <p className="text-muted-foreground">
          Edit file: {download.title}
        </p>
      </div>

      <DownloadForm download={download} />
    </div>
  );
}
