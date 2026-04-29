import Link from "next/link";
import Image from "next/image";
import {
  GraduationCap,
  Facebook,
  Instagram,
  Youtube,
  Twitter,
  Mail,
  Phone,
  MapPin,
  ArrowUpRight,
  ExternalLink,
} from "lucide-react";
import { getMenuByLocation } from "@/actions/menus";
import { prisma } from "@/lib/prisma";
import { getSiteConfig } from "@/lib/site-config";
import { getTranslations, type Language } from "@/lib/translations";
import { getLocale } from "@/actions/locale";

async function getFooterData() {
  const schoolProfile = await prisma.schoolProfile.findFirst();
  return schoolProfile;
}

export async function PublicFooter() {
  const [schoolProfile, siteConfig, footerMenu, locale] = await Promise.all([
    getFooterData(),
    getSiteConfig(),
    getMenuByLocation("footer"),
    getLocale(),
  ]);

  const socialMedia = schoolProfile?.socialMedia as Record<string, string> | null;
  const translations = getTranslations(locale as Language);
  const isEn = locale === "en";

  const currentYear = new Date().getFullYear();
  const siteName = siteConfig.siteName || schoolProfile?.name || "EduProfile";

  const menuItems =
    footerMenu?.items && footerMenu.items.length > 0
      ? footerMenu.items.map((item) => ({
          label: item.label,
          href: item.url || (item.pageSlug ? `/${item.pageSlug}` : "#"),
        }))
      : isEn
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

  const socialLinks = [
    {
      key: "facebook",
      icon: Facebook,
      label: "Facebook",
    },
    {
      key: "instagram",
      icon: Instagram,
      label: "Instagram",
    },
    {
      key: "youtube",
      icon: Youtube,
      label: "YouTube",
    },
    {
      key: "twitter",
      icon: Twitter,
      label: "Twitter / X",
    },
  ];

  return (
    <footer className="relative overflow-hidden border-t border-white/10 text-white" style={{ backgroundColor: "var(--theme-primary-dark)" }}>
      {/* Soft Decorative gradient blobs */}
      <div
        className="absolute top-0 left-0 w-[500px] h-[500px] rounded-full blur-3xl pointer-events-none opacity-20"
        style={{ backgroundColor: "var(--theme-primary)", transform: "translate(-30%, -30%)" }}
      />
      <div
        className="absolute bottom-0 right-0 w-[400px] h-[400px] rounded-full blur-3xl pointer-events-none opacity-[0.05]"
        style={{ backgroundColor: "var(--theme-accent)", transform: "translate(20%, 20%)" }}
      />

      <div className="container mx-auto px-4 py-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12">
          {/* Column 1: School Info */}
          <div className="lg:col-span-1">
            {/* Logo + Name */}
            <div className="flex items-center gap-3 mb-5">
              {schoolProfile?.logo ? (
                <div className="relative h-12 w-auto min-w-[48px]">
                  <Image
                    src={schoolProfile.logo}
                    alt={siteName}
                    width={48}
                    height={48}
                    className="object-contain h-12 w-auto"
                    style={{ maxHeight: "48px" }}
                  />
                </div>
              ) : (
                <div
                  className="flex h-12 w-12 items-center justify-center rounded-xl text-theme-primary-foreground shadow-lg"
                  style={{ backgroundColor: "var(--theme-primary)" }}
                >
                  <GraduationCap className="h-6 w-6" />
                </div>
              )}
              <div>
                <span className="font-display font-bold text-xl block leading-tight text-white">
                  {siteName}
                </span>
                {schoolProfile?.accreditation && (
                  <span className="text-xs font-medium text-white/70">
                    {isEn ? "Accreditation" : "Akreditasi"} {schoolProfile.accreditation}
                  </span>
                )}
              </div>
            </div>

            {/* Tagline */}
            <p className="text-sm leading-relaxed mb-6 text-white/70">
              {schoolProfile?.tagline ||
                siteConfig.siteTagline ||
                translations.home.heroSubtitle}
            </p>

            {/* Social Media Icons */}
            <div className="flex items-center gap-2">
              {socialLinks.map(({ key, icon: Icon, label }) => {
                const url = socialMedia?.[key];
                if (!url) return null;
                return (
                  <a
                    key={key}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-200 hover:-translate-y-0.5 hover:bg-theme-primary/20 text-white/70 hover:text-white border border-white/10 bg-white/5"
                  >
                    <Icon className="h-4 w-4" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h3 className="font-semibold text-sm uppercase tracking-widest mb-5 text-white/90">
              {translations.footer.quickLinks}
            </h3>
            <ul className="space-y-2">
              {menuItems.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="group flex items-center gap-2 text-sm py-1 transition-colors duration-150 text-white/70 hover:text-white"
                  >
                    <span
                      className="w-1 h-1 rounded-full flex-shrink-0 transition-all group-hover:w-2"
                      style={{ backgroundColor: "var(--theme-primary)" }}
                    />
                    <span className="transition-colors">{link.label}</span>
                    <ArrowUpRight className="h-3 w-3 opacity-0 -translate-y-0.5 group-hover:opacity-60 group-hover:translate-y-0 transition-all text-theme-primary" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Contact */}
          <div>
            <h3 className="font-semibold text-sm uppercase tracking-widest mb-5 text-white/90">
              {translations.footer.contact}
            </h3>
            <ul className="space-y-4">
              {schoolProfile?.address && (
                <li className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 bg-theme-primary/20">
                    <MapPin className="h-3.5 w-3.5 text-theme-primary-light" />
                  </div>
                  <span className="text-sm leading-relaxed text-white/70">
                    {schoolProfile.address}
                  </span>
                </li>
              )}
              {schoolProfile?.phone && (
                <li className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 bg-theme-primary/20">
                    <Phone className="h-3.5 w-3.5 text-theme-primary-light" />
                  </div>
                  <a
                    href={`tel:${schoolProfile.phone}`}
                    className="text-sm hover:text-white transition-colors text-white/70"
                  >
                    {schoolProfile.phone}
                  </a>
                </li>
              )}
              {schoolProfile?.email && (
                <li className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 bg-theme-primary/20">
                    <Mail className="h-3.5 w-3.5 text-theme-primary-light" />
                  </div>
                  <a
                    href={`mailto:${schoolProfile.email}`}
                    className="text-sm hover:text-white transition-colors text-white/70"
                  >
                    {schoolProfile.email}
                  </a>
                </li>
              )}
            </ul>
          </div>

          {/* Column 4: Info + CTA */}
          <div>
            <h3 className="font-semibold text-sm uppercase tracking-widest mb-5 text-white/90">
              {translations.footer.information}
            </h3>
            <div className="space-y-3">
              {schoolProfile?.npsn && (
                <div className="p-4 rounded-xl border border-white/10 bg-white/5 shadow-sm">
                  <span className="text-xs uppercase tracking-widest font-medium text-white/50">
                    NPSN
                  </span>
                  <p className="font-semibold mt-0.5 text-white">
                    {schoolProfile.npsn}
                  </p>
                </div>
              )}
              {schoolProfile?.foundedYear && (
                <div className="p-4 rounded-xl border border-white/10 bg-white/5 shadow-sm">
                  <span className="text-xs uppercase tracking-widest font-medium text-white/50">
                    {translations.footer.foundedSince}
                  </span>
                  <p className="font-semibold mt-0.5 text-white">
                    {schoolProfile.foundedYear}
                  </p>
                </div>
              )}

              {/* PPDB CTA */}
              <Link
                href="/ppdb"
                className="flex items-center justify-center gap-2 p-4 rounded-xl font-semibold text-sm transition-all hover:opacity-90 hover:-translate-y-0.5 text-theme-primary-foreground shadow-lg"
                style={{
                  backgroundColor: "var(--theme-primary)",
                  boxShadow: "0 4px 20px color-mix(in srgb, var(--theme-primary) 30%, transparent)",
                }}
              >
                {translations.home.registerPpdb}
                <ExternalLink className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-14 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-white/10 text-white/50">
          <p className="text-sm" suppressHydrationWarning>
            © {currentYear} {siteName}. {translations.footer.allRightsReserved}.
          </p>
          <p className="text-sm flex items-center gap-1">
            {translations.footer.poweredBy}{" "}
            <a
              href="#"
              className="transition-colors hover:text-white font-medium hover:underline text-white/70"
            >
              EduProfile CMS
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
