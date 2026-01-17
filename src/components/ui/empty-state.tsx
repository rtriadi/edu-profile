"use client";

import { cn } from "@/lib/utils";
import { 
  FileX, 
  Search, 
  Inbox, 
  AlertCircle, 
  WifiOff,
  ServerOff,
  FolderOpen,
  ImageOff,
  FileQuestion,
  LucideIcon
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  secondaryAction?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

export function EmptyState({
  icon: Icon = Inbox,
  title,
  description,
  action,
  secondaryAction,
  className,
}: EmptyStateProps) {
  return (
    <div className={cn(
      "flex flex-col items-center justify-center py-12 px-4 text-center",
      className
    )}>
      <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
        <Icon className="h-8 w-8 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      {description && (
        <p className="text-sm text-muted-foreground max-w-sm mb-6">{description}</p>
      )}
      {(action || secondaryAction) && (
        <div className="flex items-center gap-3">
          {action && (
            <Button onClick={action.onClick}>
              {action.label}
            </Button>
          )}
          {secondaryAction && (
            <Button variant="outline" onClick={secondaryAction.onClick}>
              {secondaryAction.label}
            </Button>
          )}
        </div>
      )}
    </div>
  );
}

// Pre-configured empty states for common scenarios
export function NoDataEmpty({ 
  title = "Belum ada data", 
  description = "Data yang Anda cari belum tersedia.",
  action,
  className
}: Partial<EmptyStateProps>) {
  return (
    <EmptyState
      icon={FolderOpen}
      title={title}
      description={description}
      action={action}
      className={className}
    />
  );
}

export function NoSearchResults({ 
  query,
  onClear,
  className 
}: { 
  query?: string;
  onClear?: () => void;
  className?: string;
}) {
  return (
    <EmptyState
      icon={Search}
      title="Tidak ada hasil"
      description={query 
        ? `Tidak ditemukan hasil untuk "${query}". Coba kata kunci lain.`
        : "Tidak ditemukan hasil yang sesuai dengan pencarian Anda."
      }
      action={onClear ? { label: "Hapus Pencarian", onClick: onClear } : undefined}
      className={className}
    />
  );
}

export function NoImagesEmpty({ 
  onUpload,
  className 
}: { 
  onUpload?: () => void;
  className?: string;
}) {
  return (
    <EmptyState
      icon={ImageOff}
      title="Belum ada gambar"
      description="Upload gambar untuk memulai."
      action={onUpload ? { label: "Upload Gambar", onClick: onUpload } : undefined}
      className={className}
    />
  );
}

export function NoFilesEmpty({ 
  onUpload,
  className 
}: { 
  onUpload?: () => void;
  className?: string;
}) {
  return (
    <EmptyState
      icon={FileX}
      title="Belum ada file"
      description="Upload file untuk memulai."
      action={onUpload ? { label: "Upload File", onClick: onUpload } : undefined}
      className={className}
    />
  );
}

// Error States
interface ErrorStateProps {
  title?: string;
  description?: string;
  onRetry?: () => void;
  className?: string;
}

export function ErrorState({
  title = "Terjadi kesalahan",
  description = "Maaf, terjadi kesalahan saat memuat data. Silakan coba lagi.",
  onRetry,
  className,
}: ErrorStateProps) {
  return (
    <EmptyState
      icon={AlertCircle}
      title={title}
      description={description}
      action={onRetry ? { label: "Coba Lagi", onClick: onRetry } : undefined}
      className={className}
    />
  );
}

export function OfflineState({ 
  onRetry,
  className 
}: { 
  onRetry?: () => void;
  className?: string;
}) {
  return (
    <EmptyState
      icon={WifiOff}
      title="Tidak ada koneksi"
      description="Periksa koneksi internet Anda dan coba lagi."
      action={onRetry ? { label: "Coba Lagi", onClick: onRetry } : undefined}
      className={className}
    />
  );
}

export function ServerErrorState({ 
  onRetry,
  className 
}: { 
  onRetry?: () => void;
  className?: string;
}) {
  return (
    <EmptyState
      icon={ServerOff}
      title="Server tidak merespons"
      description="Server sedang mengalami gangguan. Silakan coba beberapa saat lagi."
      action={onRetry ? { label: "Coba Lagi", onClick: onRetry } : undefined}
      className={className}
    />
  );
}

export function NotFoundState({ 
  onGoBack,
  className 
}: { 
  onGoBack?: () => void;
  className?: string;
}) {
  return (
    <EmptyState
      icon={FileQuestion}
      title="Halaman tidak ditemukan"
      description="Halaman yang Anda cari tidak ada atau telah dipindahkan."
      action={onGoBack ? { label: "Kembali", onClick: onGoBack } : undefined}
      className={className}
    />
  );
}
