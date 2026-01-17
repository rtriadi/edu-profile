import { Metadata } from "next";
import Link from "next/link";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Tag Berita",
  description: "Kelola tag berita dan artikel",
};

export default function TagsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Tag Berita</h1>
          <p className="text-muted-foreground">
            Kelola tag untuk berita dan artikel
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Tambah Tag
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Daftar Tag</CardTitle>
          <CardDescription>
            Tag membantu pengunjung menemukan konten terkait
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-8">
            Fitur tag sedang dalam pengembangan
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
