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

async function getFooterData() {
  const schoolProfile = await prisma.schoolProfile.findFirst();
  return schoolProfile;
}

export async function PublicFooter() {
  const [schoolProfile, siteConfig, footerMenu] = await Promise.all([
    getFooterData(),
    getSiteConfig(),
    getMenuByLocation("footer"),
  ]);

  const socialMedia = schoolProfile?.socialMedia as Record<string, string> | null;
  const translations = getTranslations(siteConfig.language as Language);
  const isEn = siteConfig.language === "en";

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
      hoverColor: "hover:bg-blue-600",
    },
    {
      key: "instagram",
      icon: Instagram,
      label: "Instagram",
      hoverColor: "hover:bg-gradient-to-br hover:from-purple-600 hover:to-pink-500",
    },
    {
      key: "youtube",
      icon: Youtube,
      label: "YouTube",
      hoverColor: "hover:bg-red-600",
    },
    {
      key: "twitter",
      icon: Twitter,
      label: "Twitter / X",
      hoverColor: "hover:bg-sky-500",
    },
  ];

  return (
    <footer className="relative overflow-hidden" style={{ backgroundColor: "oklch(0.13 0.025 250)" }}>
      {/* Decorative gradient blobs */}
      <div
        className="absolute top-0 left-0 w-[500px] h-[500px] rounded-full blur-3xl pointer-events-none"
        style={{ background: "oklch(0.35 0.15 250 / 12%)", transform: "translate(-30%, -30%)" }}
      />
      <div
        className="absolute bottom-0 right-0 w-[400px] h-[400px] rounded-full blur-3xl pointer-events-none"
        style={{ background: "oklch(0.55 0.10 85 / 8%)", transform: "translate(20%, 20%)" }}
      />

      {/* Top gradient border */}
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{
          background:
            "linear-gradient(to right, transparent, oklch(0.68 0.18 250 / 40%), oklch(0.72 0.12 85 / 30%), transparent)",
        }}
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
                  className="flex h-12 w-12 items-center justify-center rounded-xl text-white shadow-lg"
                  style={{ backgroundColor: "oklch(0.35 0.15 250)" }}
                >
                  <GraduationCap className="h-6 w-6" />
                </div>
              )}
              <div>
                <span
                  className="font-display font-bold text-xl block leading-tight"
                  style={{ color: "oklch(0.96 0.01 85)" }}
                >
                  {siteName}
                </span>
                {schoolProfile?.accreditation && (
                  <span
                    className="text-xs font-medium"
                    style={{ color: "oklch(0.72 0.12 85)" }}
                  >
                    {isEn ? "Accreditation" : "Akreditasi"} {schoolProfile.accreditation}
                  </span>
                )}
              </div>
            </div>

            {/* Tagline */}
            <p
              className="text-sm leading-relaxed mb-6"
              style={{ color: "oklch(0.65 0.04 250)" }}
            >
              {schoolProfile?.tagline ||
                siteConfig.siteTagline ||
                translations.home.heroSubtitle}
            </p>

            {/* Social Media Icons */}
            <div className="flex items-center gap-2">
              {socialLinks.map(({ key, icon: Icon, label, hoverColor }) => {
                const url = socialMedia?.[key];
                if (!url) return null;
                return (
                  <a
                    key={key}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-200 hover:-translate-y-0.5 hover:text-white ${hoverColor}`}
                    style={{
                      backgroundColor: "oklch(1 0 0 / 6%)",
                      color: "oklch(0.65 0.04 250)",
                      border: "1px solid oklch(1 0 0 / 8%)",
                    }}
                  >
                    <Icon className="h-4 w-4" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h3
              className="font-semibold text-sm uppercase tracking-widest mb-5"
              style={{ color: "oklch(0.75 0.08 250)" }}
            >
              {translations.footer.quickLinks}
            </h3>
            <ul className="space-y-2">
              {menuItems.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="group flex items-center gap-2 text-sm py-1 transition-colors duration-150"
                    style={{ color: "oklch(0.60 0.04 250)" }}
                  >
                    <span
                      className="w-1 h-1 rounded-full flex-shrink-0 transition-all group-hover:w-2"
                      style={{ backgroundColor: "oklch(0.68 0.18 250 / 60%)" }}
                    />
                    <span
                      className="group-hover:text-white transition-colors"
                    >
                      {link.label}
                    </span>
                    <ArrowUpRight
                      className="h-3 w-3 opacity-0 -translate-y-0.5 group-hover:opacity-60 group-hover:translate-y-0 transition-all"
                      style={{ color: "oklch(0.68 0.18 250)" }}
                    />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Contact */}
          <div>
            <h3
              className="font-semibold text-sm uppercase tracking-widest mb-5"
              style={{ color: "oklch(0.75 0.08 250)" }}
            >
              {translations.footer.contact}
            </h3>
            <ul className="space-y-4">
              {schoolProfile?.address && (
                <li className="flex items-start gap-3">
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
                    style={{ backgroundColor: "oklch(0.35 0.15 250 / 20%)" }}
                  >
                    <MapPin
                      className="h-3.5 w-3.5"
                      style={{ color: "oklch(0.68 0.18 250)" }}
                    />
                  </div>
                  <span
                    className="text-sm leading-relaxed"
                    style={{ color: "oklch(0.60 0.04 250)" }}
                  >
                    {schoolProfile.address}
                  </span>
                </li>
              )}
              {schoolProfile?.phone && (
                <li className="flex items-center gap-3">
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: "oklch(0.35 0.15 250 / 20%)" }}
                  >
                    <Phone
                      className="h-3.5 w-3.5"
                      style={{ color: "oklch(0.68 0.18 250)" }}
                    />
                  </div>
                  <a
                    href={`tel:${schoolProfile.phone}`}
                    className="text-sm hover:text-white transition-colors"
                    style={{ color: "oklch(0.60 0.04 250)" }}
                  >
                    {schoolProfile.phone}
                  </a>
                </li>
              )}
              {schoolProfile?.email && (
                <li className="flex items-center gap-3">
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: "oklch(0.35 0.15 250 / 20%)" }}
                  >
                    <Mail
                      className="h-3.5 w-3.5"
                      style={{ color: "oklch(0.68 0.18 250)" }}
                    />
                  </div>
                  <a
                    href={`mailto:${schoolProfile.email}`}
                    className="text-sm hover:text-white transition-colors"
                    style={{ color: "oklch(0.60 0.04 250)" }}
                  >
                    {schoolProfile.email}
                  </a>
                </li>
              )}
            </ul>
          </div>

          {/* Column 4: Info + CTA */}
          <div>
            <h3
              className="font-semibold text-sm uppercase tracking-widest mb-5"
              style={{ color: "oklch(0.75 0.08 250)" }}
            >
              {translations.footer.information}
            </h3>
            <div className="space-y-3">
              {schoolProfile?.npsn && (
                <div
                  className="p-4 rounded-xl"
                  style={{
                    backgroundColor: "oklch(1 0 0 / 4%)",
                    border: "1px solid oklch(1 0 0 / 8%)",
                  }}
                >
                  <span
                    className="text-xs uppercase tracking-widest font-medium"
                    style={{ color: "oklch(0.50 0.04 250)" }}
                  >
                    NPSN
                  </span>
                  <p
                    className="font-semibold mt-0.5"
                    style={{ color: "oklch(0.90 0.02 85)" }}
                  >
                    {schoolProfile.npsn}
                  </p>
                </div>
              )}
              {schoolProfile?.foundedYear && (
                <div
                  className="p-4 rounded-xl"
                  style={{
                    backgroundColor: "oklch(1 0 0 / 4%)",
                    border: "1px solid oklch(1 0 0 / 8%)",
                  }}
                >
                  <span
                    className="text-xs uppercase tracking-widest font-medium"
                    style={{ color: "oklch(0.50 0.04 250)" }}
                  >
                    {translations.footer.foundedSince}
                  </span>
                  <p
                    className="font-semibold mt-0.5"
                    style={{ color: "oklch(0.90 0.02 85)" }}
                  >
                    {schoolProfile.foundedYear}
                  </p>
                </div>
              )}

              {/* PPDB CTA */}
              <Link
                href="/ppdb"
                className="flex items-center justify-center gap-2 p-4 rounded-xl font-semibold text-sm transition-all hover:opacity-90 hover:-translate-y-0.5"
                style={{
                  backgroundColor: "oklch(0.35 0.15 250)",
                  color: "oklch(0.98 0 0)",
                  boxShadow: "0 4px 20px oklch(0.35 0.15 250 / 30%)",
                }}
              >
                {translations.home.registerPpdb}
                <ExternalLink className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div
          className="mt-14 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3"
          style={{ borderTop: "1px solid oklch(1 0 0 / 8%)" }}
        >
          <p
            className="text-sm"
            style={{ color: "oklch(0.45 0.03 250)" }}
            suppressHydrationWarning
          >
            © {currentYear} {siteName}. {translations.footer.allRightsReserved}.
          </p>
          <p
            className="text-sm flex items-center gap-1"
            style={{ color: "oklch(0.45 0.03 250)" }}
          >
            {translations.footer.poweredBy}{" "}
            <a
              href="#"
              className="transition-colors hover:underline font-medium"
              style={{ color: "oklch(0.68 0.18 250)" }}
            >
              EduProfile CMS
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
