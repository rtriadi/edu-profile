"use client";

import { useState, useOptimistic, useTransition } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  MoreHorizontal,
  Pencil,
  Trash2,
  Eye,
  Star,
  StarOff,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
} from "lucide-react";
import { toast } from "sonner";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { deletePost, togglePostFeatured } from "@/actions/posts";
import { formatDate, formatRelativeTime } from "@/lib/utils";
import type { Status } from "@/types";

interface Post {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  featuredImg: string | null;
  status: Status;
  views: number;
  isFeatured: boolean;
  createdAt: Date;
  publishedAt: Date | null;
  category: {
    id: string;
    name: string;
    slug: string;
    color: string | null;
  };
  author: {
    id: string;
    name: string;
    image: string | null;
  };
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

interface PostsTableProps {
  posts: Post[];
  pagination: Pagination;
}

const statusLabels: Record<Status, string> = {
  DRAFT: "Draft",
  PUBLISHED: "Dipublikasi",
  ARCHIVED: "Diarsip",
};

const statusColors: Record<Status, string> = {
  DRAFT: "bg-yellow-500",
  PUBLISHED: "bg-green-500",
  ARCHIVED: "bg-gray-500",
};

export function PostsTable({ posts, pagination }: PostsTableProps) {
  const router = useRouter();
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const [optimisticPosts, removeOptimisticPost] = useOptimistic(
    posts,
    (state, idToRemove: string) => state.filter((p) => p.id !== idToRemove)
  );

  const handleDelete = async () => {
    if (!deleteId) return;

    const id = deleteId;
    setDeleteId(null); // Close dialog immediately

    startTransition(async () => {
      // Apply optimistic update
      removeOptimisticPost(id);
      
      // Call server action
      const result = await deletePost(id);

      if (result.success) {
        toast.success(result.message);
      } else {
        toast.error(result.error);
        router.refresh(); // Revert optimistic update on error
      }
    });
  };

  const handleToggleFeatured = async (id: string) => {
    const result = await togglePostFeatured(id);

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

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[400px]">Judul</TableHead>
              <TableHead>Kategori</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Views</TableHead>
              <TableHead>Tanggal</TableHead>
              <TableHead className="w-[70px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {optimisticPosts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  Tidak ada berita ditemukan
                </TableCell>
              </TableRow>
            ) : (
              optimisticPosts.map((post) => (
                <TableRow key={post.id}>
                  <TableCell>
                    <div className="flex items-start gap-3">
                      {post.featuredImg && (
                        <div className="relative h-12 w-16 rounded overflow-hidden flex-shrink-0">
                          <Image
                            src={post.featuredImg}
                            alt={post.title}
                            fill
                            className="object-cover"
                          />
                        </div>
                      )}
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <Link
                            href={`/admin/posts/${post.id}`}
                            className="font-medium hover:underline line-clamp-1"
                          >
                            {post.title}
                          </Link>
                          {post.isFeatured && (
                            <Star className="h-4 w-4 text-yellow-500 fill-yellow-500 flex-shrink-0" />
                          )}
                        </div>
                        {post.excerpt && (
                          <p className="text-sm text-muted-foreground line-clamp-1">
                            {post.excerpt}
                          </p>
                        )}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      style={{ backgroundColor: post.category.color || "#3B82F6" }}
                    >
                      {post.category.name}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={statusColors[post.status]}>
                      {statusLabels[post.status]}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Eye className="h-4 w-4" />
                      {post.views}
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm">
                    {post.publishedAt
                      ? formatRelativeTime(post.publishedAt)
                      : formatRelativeTime(post.createdAt)}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                          <Link href={`/admin/posts/${post.id}`}>
                            <Pencil className="mr-2 h-4 w-4" />
                            Edit
                          </Link>
                        </DropdownMenuItem>
                        {post.status === "PUBLISHED" && (
                          <DropdownMenuItem asChild>
                            <Link href={`/berita/${post.slug}`} target="_blank">
                              <ExternalLink className="mr-2 h-4 w-4" />
                              Lihat
                            </Link>
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem
                          onClick={() => handleToggleFeatured(post.id)}
                        >
                          {post.isFeatured ? (
                            <>
                              <StarOff className="mr-2 h-4 w-4" />
                              Hapus dari Unggulan
                            </>
                          ) : (
                            <>
                              <Star className="mr-2 h-4 w-4" />
                              Jadikan Unggulan
                            </>
                          )}
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="text-destructive focus:text-destructive"
                          onClick={() => setDeleteId(post.id)}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Hapus
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Menampilkan {(pagination.page - 1) * pagination.limit + 1} -{" "}
            {Math.min(pagination.page * pagination.limit, pagination.total)} dari{" "}
            {pagination.total} berita
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(pagination.page - 1)}
              disabled={pagination.page <= 1}
            >
              <ChevronLeft className="h-4 w-4" />
              Sebelumnya
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(pagination.page + 1)}
              disabled={pagination.page >= pagination.totalPages}
            >
              Selanjutnya
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Berita?</AlertDialogTitle>
            <AlertDialogDescription>
              Berita <span className="font-medium text-foreground">&quot;{posts.find(p => p.id === deleteId)?.title}&quot;</span> akan dihapus secara permanen.
              {posts.find(p => p.id === deleteId)?.views ? (
                <span className="block mt-2 text-yellow-600 dark:text-yellow-500 bg-yellow-50 dark:bg-yellow-950/30 p-2 rounded border border-yellow-200 dark:border-yellow-900">
                  ⚠️ Berita ini sudah dilihat {posts.find(p => p.id === deleteId)?.views} kali.
                </span>
              ) : null}
              <span className="block mt-2">Tindakan ini tidak dapat dibatalkan.</span>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isPending}>Batal</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isPending}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isPending ? "Menghapus..." : "Hapus"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
