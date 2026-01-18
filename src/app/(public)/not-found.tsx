import Link from "next/link";
import { Home } from "lucide-react";

import { Button } from "@/components/ui/button";

export default function PublicNotFound() {
  return (
    <main className="flex-1 flex items-center justify-center py-16">
      <div className="container mx-auto px-4 text-center">
        <div className="max-w-md mx-auto">
          {/* 404 Illustration */}
          <div className="mb-8">
            <div className="text-9xl font-bold text-primary/20">404</div>
          </div>

          {/* Title and Description */}
          <h1 className="text-3xl font-bold mb-4">Halaman Tidak Ditemukan</h1>
          <p className="text-muted-foreground mb-8">
            Maaf, halaman yang Anda cari tidak dapat ditemukan.
          </p>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button asChild>
              <Link href="/">
                <Home className="mr-2 h-4 w-4" />
                Kembali ke Beranda
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/kontak">
                Hubungi Kami
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
}
