"use client";

import { useState } from "react";
import { ToggleLeft, ToggleRight, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import type { ApiResponse } from "@/types";

interface ToggleActiveButtonProps {
  id: string;
  isActive: boolean;
  action: (id: string) => Promise<ApiResponse>;
}

export function ToggleActiveButton({
  id,
  isActive,
  action,
}: ToggleActiveButtonProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleToggle = async () => {
    setIsLoading(true);
    try {
      const result = await action(id);
      if (result.success) {
        toast.success(result.message || "Status berhasil diubah");
        router.refresh();
      } else {
        toast.error(result.error || "Gagal mengubah status");
      }
    } catch (error) {
      toast.error("Terjadi kesalahan");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={handleToggle}
      disabled={isLoading}
      title={isActive ? "Nonaktifkan" : "Aktifkan"}
    >
      {isLoading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : isActive ? (
        <ToggleRight className="h-4 w-4 text-green-600" />
      ) : (
        <ToggleLeft className="h-4 w-4 text-muted-foreground" />
      )}
    </Button>
  );
}
