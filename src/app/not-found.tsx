import Link from "next/link";
import { Home, Search } from "lucide-react";

import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-md mx-auto">
          {/* 404 Illustration */}
          <div className="mb-8">
            <div className="text-9xl font-bold text-primary/20">404</div>
          </div>

          {/* Title and Description */}
          <h1 className="text-3xl font-bold mb-4">Halaman Tidak Ditemukan</h1>
          <p className="text-muted-foreground mb-8">
            Maaf, halaman yang Anda cari tidak dapat ditemukan. Halaman mungkin telah dipindahkan, dihapus, atau alamat yang Anda masukkan salah.
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
              <Link href="/berita">
                <Search className="mr-2 h-4 w-4" />
                Cari Berita
              </Link>
            </Button>
          </div>

          {/* Quick Links */}
          <div className="mt-12 pt-8 border-t">
            <p className="text-sm text-muted-foreground mb-4">
              Atau kunjungi halaman populer lainnya:
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              <Link
                href="/profil"
                className="text-sm text-primary hover:underline"
              >
                Profil Sekolah
              </Link>
              <span className="text-muted-foreground">•</span>
              <Link
                href="/akademik"
                className="text-sm text-primary hover:underline"
              >
                Program Akademik
              </Link>
              <span className="text-muted-foreground">•</span>
              <Link
                href="/galeri"
                className="text-sm text-primary hover:underline"
              >
                Galeri
              </Link>
              <span className="text-muted-foreground">•</span>
              <Link
                href="/ppdb"
                className="text-sm text-primary hover:underline"
              >
                PPDB
              </Link>
              <span className="text-muted-foreground">•</span>
              <Link
                href="/kontak"
                className="text-sm text-primary hover:underline"
              >
                Kontak
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
