import { Metadata } from "next";
import { getMedia } from "@/actions/media";
import { MediaLibrary } from "@/components/admin/media/media-library";

export const metadata: Metadata = {
  title: "Media Library",
  description: "Kelola file media",
};

interface MediaPageProps {
  searchParams: Promise<{
    page?: string;
    folder?: string;
    type?: string;
  }>;
}

export default async function MediaPage({ searchParams }: MediaPageProps) {
  const params = await searchParams;
  const page = Number(params.page) || 1;

  const { data: media, pagination } = await getMedia({
    page,
    limit: 24,
    folder: params.folder,
    type: params.type,
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Media Library</h1>
        <p className="text-muted-foreground">
          Kelola file gambar, video, dan dokumen
        </p>
      </div>

      <MediaLibrary media={media} pagination={pagination} />
    </div>
  );
}
