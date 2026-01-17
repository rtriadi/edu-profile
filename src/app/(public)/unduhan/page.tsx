import { Metadata } from "next";
import Link from "next/link";
import { FileText, Download, FolderOpen } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getPublishedDownloads, getDownloadCategories } from "@/actions/downloads";

export const metadata: Metadata = {
  title: "Pusat Unduhan",
  description: "Download file dan dokumen sekolah",
};

export default async function UnduhanPage() {
  const downloads = await getPublishedDownloads();
  const categories = await getDownloadCategories();

  const formatFileSize = (bytes: number | null) => {
    if (!bytes) return "";
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const getFileIcon = (fileType: string | null) => {
    if (!fileType) return <FileText className="h-8 w-8" />;
    if (fileType.includes("pdf")) return <FileText className="h-8 w-8 text-red-500" />;
    if (fileType.includes("word") || fileType.includes("document"))
      return <FileText className="h-8 w-8 text-blue-500" />;
    if (fileType.includes("excel") || fileType.includes("spreadsheet"))
      return <FileText className="h-8 w-8 text-green-500" />;
    if (fileType.includes("image")) return <FileText className="h-8 w-8 text-purple-500" />;
    return <FileText className="h-8 w-8 text-gray-500" />;
  };

  // Group downloads by category
  const groupedDownloads = downloads.reduce((acc, download) => {
    const category = download.category || "Lainnya";
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(download);
    return acc;
  }, {} as Record<string, typeof downloads>);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Pusat Unduhan</h1>
        <p className="text-muted-foreground">
          Download file dan dokumen yang tersedia
        </p>
      </div>

      {downloads.length > 0 ? (
        <div className="space-y-8">
          {Object.entries(groupedDownloads).map(([category, files]) => (
            <section key={category}>
              <div className="flex items-center gap-2 mb-4">
                <FolderOpen className="h-5 w-5 text-primary" />
                <h2 className="text-xl font-semibold">{category}</h2>
                <Badge variant="secondary">{files.length} file</Badge>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {files.map((download) => (
                  <Card key={download.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0 p-2 bg-muted rounded-lg">
                          {getFileIcon(download.fileType)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium line-clamp-2 mb-1">
                            {download.title}
                          </h3>
                          {download.description && (
                            <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                              {download.description}
                            </p>
                          )}
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-muted-foreground">
                              {formatFileSize(download.fileSize)}
                              {download.downloads > 0 && (
                                <> • {download.downloads} unduhan</>
                              )}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="mt-4">
                        <Button asChild size="sm" className="w-full">
                          <a href={download.file} download target="_blank" rel="noopener noreferrer">
                            <Download className="h-4 w-4 mr-2" />
                            Unduh
                          </a>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Belum ada file yang tersedia untuk diunduh</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
