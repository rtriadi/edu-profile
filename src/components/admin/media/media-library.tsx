"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  Upload,
  Trash2,
  Copy,
  Check,
  Image as ImageIcon,
  FileVideo,
  FileText,
  File,
  ChevronLeft,
  ChevronRight,
  Loader2,
  X,
} from "lucide-react";
import { useDropzone } from "react-dropzone";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { uploadMediaLocal, deleteMedia, updateMediaAlt } from "@/actions/media";
import { formatFileSize } from "@/lib/utils";
import { cn } from "@/lib/utils";

interface Media {
  id: string;
  name: string;
  url: string;
  type: string;
  mimeType: string | null;
  size: number | null;
  width: number | null;
  height: number | null;
  alt: string | null;
  folder: string;
  createdAt: Date;
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

interface MediaLibraryProps {
  media: Media[];
  pagination: Pagination;
  onSelect?: (media: Media) => void;
  selectable?: boolean;
}

export function MediaLibrary({
  media,
  pagination,
  onSelect,
  selectable = false,
}: MediaLibraryProps) {
  const router = useRouter();
  const [selectedMedia, setSelectedMedia] = useState<Media | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [copied, setCopied] = useState(false);
  const [filter, setFilter] = useState<string>("all");

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    setIsUploading(true);

    for (const file of acceptedFiles) {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", "general");

      const result = await uploadMediaLocal(formData);

      if (result.success) {
        toast.success(`${file.name} berhasil diupload`);
      } else {
        toast.error(`Gagal mengupload ${file.name}: ${result.error}`);
      }
    }

    setIsUploading(false);
    router.refresh();
  }, [router]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [],
      "video/*": [],
      "application/pdf": [],
      "application/msword": [],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [],
    },
  });

  const handleDelete = async () => {
    if (!deleteId) return;

    setIsDeleting(true);
    const result = await deleteMedia(deleteId);

    if (result.success) {
      toast.success(result.message);
      setSelectedMedia(null);
    } else {
      toast.error(result.error);
    }

    setIsDeleting(false);
    setDeleteId(null);
    router.refresh();
  };

  const handleCopyUrl = async (url: string) => {
    await navigator.clipboard.writeText(url);
    setCopied(true);
    toast.success("URL disalin ke clipboard");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleUpdateAlt = async (alt: string) => {
    if (!selectedMedia) return;

    const result = await updateMediaAlt(selectedMedia.id, alt);
    if (result.success) {
      toast.success(result.message);
    } else {
      toast.error(result.error);
    }
  };

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(window.location.search);
    params.set("page", page.toString());
    router.push(`?${params.toString()}`);
  };

  const handleFilterChange = (value: string) => {
    setFilter(value);
    const params = new URLSearchParams(window.location.search);
    if (value === "all") {
      params.delete("type");
    } else {
      params.set("type", value);
    }
    params.set("page", "1");
    router.push(`?${params.toString()}`);
  };

  const getFileIcon = (type: string) => {
    switch (type) {
      case "image":
        return ImageIcon;
      case "video":
        return FileVideo;
      case "document":
        return FileText;
      default:
        return File;
    }
  };

  const filteredMedia = media;

  return (
    <div className="space-y-6">
      {/* Upload Area */}
      <div
        {...getRootProps()}
        className={cn(
          "border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors",
          isDragActive
            ? "border-primary bg-primary/5"
            : "border-muted-foreground/25 hover:border-primary/50"
        )}
      >
        <input {...getInputProps()} />
        {isUploading ? (
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
            <p className="text-muted-foreground">Mengupload...</p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2">
            <Upload className="h-10 w-10 text-muted-foreground" />
            <p className="text-muted-foreground">
              {isDragActive
                ? "Lepas file di sini..."
                : "Drag & drop file di sini, atau klik untuk memilih"}
            </p>
            <p className="text-xs text-muted-foreground">
              Gambar, video, PDF, dan dokumen (max 10MB)
            </p>
          </div>
        )}
      </div>

      {/* Filter Tabs */}
      <Tabs value={filter} onValueChange={handleFilterChange}>
        <TabsList>
          <TabsTrigger value="all">Semua</TabsTrigger>
          <TabsTrigger value="image">Gambar</TabsTrigger>
          <TabsTrigger value="video">Video</TabsTrigger>
          <TabsTrigger value="document">Dokumen</TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Media Grid */}
      {filteredMedia.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          Belum ada media. Upload file untuk memulai.
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {filteredMedia.map((item) => {
            const Icon = getFileIcon(item.type);
            return (
              <Card
                key={item.id}
                className={cn(
                  "cursor-pointer overflow-hidden transition-all hover:ring-2 hover:ring-primary",
                  selectedMedia?.id === item.id && "ring-2 ring-primary"
                )}
                onClick={() => {
                  if (selectable && onSelect) {
                    onSelect(item);
                  } else {
                    setSelectedMedia(item);
                  }
                }}
              >
                <CardContent className="p-0">
                  <div className="aspect-square relative bg-muted flex items-center justify-center">
                    {item.type === "image" ? (
                      <Image
                        src={item.url}
                        alt={item.alt || item.name}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 16vw"
                      />
                    ) : (
                      <Icon className="h-12 w-12 text-muted-foreground" />
                    )}
                  </div>
                  <div className="p-2">
                    <p className="text-xs font-medium truncate">{item.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {item.size ? formatFileSize(item.size) : "—"}
                    </p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Menampilkan {(pagination.page - 1) * pagination.limit + 1} -{" "}
            {Math.min(pagination.page * pagination.limit, pagination.total)} dari{" "}
            {pagination.total} file
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(pagination.page - 1)}
              disabled={pagination.page <= 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm">
              {pagination.page} / {pagination.totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(pagination.page + 1)}
              disabled={pagination.page >= pagination.totalPages}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Media Detail Dialog */}
      <Dialog
        open={!!selectedMedia && !selectable}
        onOpenChange={() => setSelectedMedia(null)}
      >
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{selectedMedia?.name}</DialogTitle>
            <DialogDescription>Detail dan pengaturan media</DialogDescription>
          </DialogHeader>

          {selectedMedia && (
            <div className="grid gap-4 md:grid-cols-2">
              <div className="aspect-square relative bg-muted rounded-lg overflow-hidden">
                {selectedMedia.type === "image" ? (
                  <Image
                    src={selectedMedia.url}
                    alt={selectedMedia.alt || selectedMedia.name}
                    fill
                    className="object-contain"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    {(() => {
                      const Icon = getFileIcon(selectedMedia.type);
                      return <Icon className="h-20 w-20 text-muted-foreground" />;
                    })()}
                  </div>
                )}
              </div>

              <div className="space-y-4">
                <div>
                  <Label className="text-xs text-muted-foreground">URL</Label>
                  <div className="flex items-center gap-2 mt-1">
                    <Input
                      value={selectedMedia.url}
                      readOnly
                      className="text-xs"
                    />
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleCopyUrl(selectedMedia.url)}
                    >
                      {copied ? (
                        <Check className="h-4 w-4" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>

                <div>
                  <Label className="text-xs text-muted-foreground">Alt Text</Label>
                  <Input
                    defaultValue={selectedMedia.alt || ""}
                    placeholder="Deskripsi gambar untuk SEO"
                    className="mt-1"
                    onBlur={(e) => handleUpdateAlt(e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Tipe:</span>
                    <span className="ml-2">{selectedMedia.mimeType}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Ukuran:</span>
                    <span className="ml-2">
                      {selectedMedia.size ? formatFileSize(selectedMedia.size) : "—"}
                    </span>
                  </div>
                  {selectedMedia.width && selectedMedia.height && (
                    <div>
                      <span className="text-muted-foreground">Dimensi:</span>
                      <span className="ml-2">
                        {selectedMedia.width} x {selectedMedia.height}
                      </span>
                    </div>
                  )}
                  <div>
                    <span className="text-muted-foreground">Folder:</span>
                    <span className="ml-2">{selectedMedia.folder}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button
              variant="destructive"
              onClick={() => selectedMedia && setDeleteId(selectedMedia.id)}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Hapus
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Media?</AlertDialogTitle>
            <AlertDialogDescription>
              File akan dihapus secara permanen. Pastikan file tidak digunakan di
              halaman atau postingan lain.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Batal</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? "Menghapus..." : "Hapus"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
