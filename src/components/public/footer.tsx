import Link from "next/link";
import Image from "next/image";
import { GraduationCap, Facebook, Instagram, Youtube, Twitter, Mail, Phone, MapPin, ArrowUpRight } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { getSiteConfig } from "@/lib/site-config";
import { getTranslations, type Language } from "@/lib/translations";

async function getFooterData() {
  const schoolProfile = await prisma.schoolProfile.findFirst();
  return schoolProfile;
}

export async function PublicFooter() {
  const [schoolProfile, siteConfig] = await Promise.all([
    getFooterData(),
    getSiteConfig(),
  ]);
  const socialMedia = schoolProfile?.socialMedia as Record<string, string> | null;
  const translations = getTranslations(siteConfig.language as Language);

  const currentYear = new Date().getFullYear();
  const siteName = siteConfig.siteName || schoolProfile?.name || "EduProfile";
  
  // Quick links with translations
  const quickLinks = siteConfig.language === "en" 
    ? [
        { label: "School Profile", href: "/profil" },
        { label: "Academic Programs", href: "/akademik" },
        { label: "News & Articles", href: "/berita" },
        { label: "Gallery", href: "/galeri" },
        { label: "Online Registration", href: "/ppdb" },
        { label: "Contact Us", href: "/kontak" },
      ]
    : [
        { label: "Profil Sekolah", href: "/profil" },
        { label: "Program Akademik", href: "/akademik" },
        { label: "Berita & Artikel", href: "/berita" },
        { label: "Galeri", href: "/galeri" },
        { label: "PPDB Online", href: "/ppdb" },
        { label: "Hubungi Kami", href: "/kontak" },
      ];

  return (
    <footer className="relative bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 text-slate-300 overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-5" />
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-theme-accent/10 rounded-full blur-3xl" />
      
      <div className="container mx-auto px-4 py-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* About */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-6">
              {schoolProfile?.logo ? (
                <div className="relative h-12 w-12 rounded-xl overflow-hidden ring-2 ring-white/10">
                  <Image
                    src={schoolProfile.logo}
                    alt={siteName}
                    fill
                    className="object-cover"
                  />
                </div>
              ) : (
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-primary text-white shadow-lg">
                  <GraduationCap className="h-6 w-6" />
                </div>
              )}
              <div>
                <span className="font-bold text-xl text-white block">
                  {siteName}
                </span>
                {schoolProfile?.accreditation && (
                  <span className="text-xs text-primary">
                    {siteConfig.language === "en" ? "Accreditation" : "Akreditasi"} {schoolProfile.accreditation}
                  </span>
                )}
              </div>
            </div>
            <p className="text-sm text-slate-400 mb-6 leading-relaxed">
              {schoolProfile?.tagline || siteConfig.siteTagline || translations.home.heroSubtitle}
            </p>
            
            {/* Social Media */}
            <div className="flex items-center gap-2">
              {socialMedia?.facebook && (
                <a
                  href={socialMedia.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center hover:bg-primary hover:text-white transition-all duration-300 hover:scale-110"
                >
                  <Facebook className="h-4 w-4" />
                </a>
              )}
              {socialMedia?.instagram && (
                <a
                  href={socialMedia.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center hover:bg-gradient-to-br hover:from-purple-500 hover:to-pink-500 hover:text-white transition-all duration-300 hover:scale-110"
                >
                  <Instagram className="h-4 w-4" />
                </a>
              )}
              {socialMedia?.youtube && (
                <a
                  href={socialMedia.youtube}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center hover:bg-red-600 hover:text-white transition-all duration-300 hover:scale-110"
                >
                  <Youtube className="h-4 w-4" />
                </a>
              )}
              {socialMedia?.twitter && (
                <a
                  href={socialMedia.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center hover:bg-sky-500 hover:text-white transition-all duration-300 hover:scale-110"
                >
                  <Twitter className="h-4 w-4" />
                </a>
              )}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-white mb-6 flex items-center gap-2">
              <div className="w-1 h-5 bg-primary rounded-full" />
              {translations.footer.quickLinks}
            </h3>
            <ul className="space-y-3 text-sm">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link 
                    href={link.href} 
                    className="group flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-600 group-hover:bg-primary transition-colors" />
                    {link.label}
                    <ArrowUpRight className="h-3 w-3 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold text-white mb-6 flex items-center gap-2">
              <div className="w-1 h-5 bg-theme-secondary rounded-full" />
              {translations.footer.contact}
            </h3>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start gap-3 group">
                <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors">
                  <MapPin className="h-4 w-4 text-primary" />
                </div>
                <span className="text-slate-400 leading-relaxed">
                  {schoolProfile?.address || "Jl. Pendidikan No. 1, Jakarta"}
                </span>
              </li>
              <li className="flex items-center gap-3 group">
                <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors">
                  <Phone className="h-4 w-4 text-primary" />
                </div>
                <a 
                  href={`tel:${schoolProfile?.phone || "(021) 1234567"}`}
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  {schoolProfile?.phone || "(021) 1234567"}
                </a>
              </li>
              <li className="flex items-center gap-3 group">
                <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors">
                  <Mail className="h-4 w-4 text-primary" />
                </div>
                <a 
                  href={`mailto:${schoolProfile?.email || "info@sekolah.sch.id"}`}
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  {schoolProfile?.email || "info@sekolah.sch.id"}
                </a>
              </li>
            </ul>
          </div>

          {/* Info */}
          <div>
            <h3 className="font-semibold text-white mb-6 flex items-center gap-2">
              <div className="w-1 h-5 bg-theme-accent rounded-full" />
              {translations.footer.information}
            </h3>
            <div className="space-y-4">
              {schoolProfile?.npsn && (
                <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                  <span className="text-xs text-slate-500 uppercase tracking-wider">NPSN</span>
                  <p className="text-white font-semibold">{schoolProfile.npsn}</p>
                </div>
              )}
              {schoolProfile?.foundedYear && (
                <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                  <span className="text-xs text-slate-500 uppercase tracking-wider">{translations.footer.foundedSince}</span>
                  <p className="text-white font-semibold">{schoolProfile.foundedYear}</p>
                </div>
              )}
              <Link 
                href="/ppdb" 
                className="block p-4 rounded-xl bg-gradient-primary text-white text-center font-semibold hover:opacity-90 transition-opacity"
              >
                {translations.home.registerPpdb}
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-16 pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-slate-500">
            © {currentYear} {siteName}. {translations.footer.allRightsReserved}.
          </p>
          <p className="text-sm text-slate-500 flex items-center gap-1">
            {translations.footer.poweredBy}{" "}
            <a href="#" className="text-primary hover:underline font-medium">
              EduProfile CMS
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
