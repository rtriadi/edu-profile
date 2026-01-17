import Link from "next/link";
import { GraduationCap, Facebook, Instagram, Youtube, Twitter, Mail, Phone, MapPin } from "lucide-react";
import { prisma } from "@/lib/prisma";

async function getFooterData() {
  const schoolProfile = await prisma.schoolProfile.findFirst();
  return schoolProfile;
}

export async function PublicFooter() {
  const schoolProfile = await getFooterData();
  const socialMedia = schoolProfile?.socialMedia as Record<string, string> | null;

  return (
    <footer className="bg-slate-900 text-slate-300">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* About */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <GraduationCap className="h-5 w-5" />
              </div>
              <span className="font-bold text-lg text-white">
                {schoolProfile?.name || "EduProfile"}
              </span>
            </div>
            <p className="text-sm text-slate-400 mb-4">
              {schoolProfile?.tagline || "Mendidik Generasi Unggul dan Berkarakter"}
            </p>
            {schoolProfile?.accreditation && (
              <div className="inline-block px-3 py-1 bg-primary text-primary-foreground text-sm rounded-full">
                Akreditasi {schoolProfile.accreditation}
              </div>
            )}
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-white mb-4">Menu Cepat</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/profil" className="hover:text-primary transition-colors">
                  Profil Sekolah
                </Link>
              </li>
              <li>
                <Link href="/akademik" className="hover:text-primary transition-colors">
                  Program Akademik
                </Link>
              </li>
              <li>
                <Link href="/berita" className="hover:text-primary transition-colors">
                  Berita & Artikel
                </Link>
              </li>
              <li>
                <Link href="/galeri" className="hover:text-primary transition-colors">
                  Galeri
                </Link>
              </li>
              <li>
                <Link href="/ppdb" className="hover:text-primary transition-colors">
                  PPDB Online
                </Link>
              </li>
              <li>
                <Link href="/kontak" className="hover:text-primary transition-colors">
                  Hubungi Kami
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold text-white mb-4">Kontak</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-3">
                <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <span>{schoolProfile?.address || "Jl. Pendidikan No. 1, Jakarta"}</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-4 w-4 flex-shrink-0" />
                <span>{schoolProfile?.phone || "(021) 1234567"}</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-4 w-4 flex-shrink-0" />
                <span>{schoolProfile?.email || "info@sekolah.sch.id"}</span>
              </li>
            </ul>
          </div>

          {/* Social Media */}
          <div>
            <h3 className="font-semibold text-white mb-4">Media Sosial</h3>
            <div className="flex items-center gap-3">
              {socialMedia?.facebook && (
                <a
                  href={socialMedia.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-primary transition-colors"
                >
                  <Facebook className="h-5 w-5" />
                </a>
              )}
              {socialMedia?.instagram && (
                <a
                  href={socialMedia.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-primary transition-colors"
                >
                  <Instagram className="h-5 w-5" />
                </a>
              )}
              {socialMedia?.youtube && (
                <a
                  href={socialMedia.youtube}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-primary transition-colors"
                >
                  <Youtube className="h-5 w-5" />
                </a>
              )}
              {socialMedia?.twitter && (
                <a
                  href={socialMedia.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-primary transition-colors"
                >
                  <Twitter className="h-5 w-5" />
                </a>
              )}
            </div>
            {schoolProfile?.npsn && (
              <div className="mt-4 text-sm">
                <span className="text-slate-500">NPSN: </span>
                <span>{schoolProfile.npsn}</span>
              </div>
            )}
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 pt-8 border-t border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-slate-500">
            © {new Date().getFullYear()} {schoolProfile?.name || "EduProfile CMS"}. All rights reserved.
          </p>
          <p className="text-sm text-slate-500">
            Powered by{" "}
            <a href="#" className="text-primary hover:underline">
              EduProfile CMS
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
