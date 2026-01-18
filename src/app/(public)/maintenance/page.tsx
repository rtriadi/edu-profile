import { Construction, Mail, Phone } from "lucide-react";

import { getSiteConfig } from "@/lib/site-config";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

async function getSchoolContact() {
  try {
    const schoolProfile = await prisma.schoolProfile.findFirst({
      select: { email: true, phone: true, name: true },
    });
    return schoolProfile;
  } catch (error) {
    console.error("Error fetching school contact:", error);
    return null;
  }
}

export default async function MaintenancePage() {
  const [siteConfig, schoolContact] = await Promise.all([
    getSiteConfig(),
    getSchoolContact(),
  ]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white p-4">
      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 text-center max-w-2xl mx-auto">
        {/* Icon */}
        <div className="mb-8 inline-flex items-center justify-center w-24 h-24 rounded-full bg-yellow-500/20 border-2 border-yellow-500/30">
          <Construction className="w-12 h-12 text-yellow-400" />
        </div>

        {/* Title */}
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          {siteConfig.language === "en" ? "Under Maintenance" : "Sedang Dalam Perbaikan"}
        </h1>

        {/* Description */}
        <p className="text-lg md:text-xl text-slate-300 mb-8 leading-relaxed">
          {siteConfig.language === "en"
            ? `We're currently performing scheduled maintenance on ${siteConfig.siteName}. We'll be back shortly. Thank you for your patience.`
            : `Kami sedang melakukan pemeliharaan terjadwal pada ${siteConfig.siteName}. Kami akan segera kembali. Terima kasih atas kesabaran Anda.`}
        </p>

        {/* Progress indicator */}
        <div className="mb-10">
          <div className="flex items-center justify-center gap-2 mb-3">
            <div className="w-3 h-3 rounded-full bg-yellow-400 animate-pulse" />
            <span className="text-sm text-slate-400">
              {siteConfig.language === "en" ? "Work in progress" : "Pekerjaan sedang berlangsung"}
            </span>
          </div>
          <div className="w-full max-w-md mx-auto h-2 bg-slate-700 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-full animate-pulse" style={{ width: "60%" }} />
          </div>
        </div>

        {/* Contact info */}
        <div className="border-t border-slate-700 pt-8">
          <p className="text-sm text-slate-400 mb-4">
            {siteConfig.language === "en"
              ? "Need immediate assistance? Contact us:"
              : "Butuh bantuan segera? Hubungi kami:"}
          </p>
          <div className="flex flex-wrap justify-center gap-6">
            {schoolContact?.email && (
              <a
                href={`mailto:${schoolContact.email}`}
                className="flex items-center gap-2 text-slate-300 hover:text-white transition-colors"
              >
                <Mail className="w-4 h-4" />
                {schoolContact.email}
              </a>
            )}
            {schoolContact?.phone && (
              <a
                href={`tel:${schoolContact.phone}`}
                className="flex items-center gap-2 text-slate-300 hover:text-white transition-colors"
              >
                <Phone className="w-4 h-4" />
                {schoolContact.phone}
              </a>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-12 text-sm text-slate-500">
          &copy; {new Date().getFullYear()} {siteConfig.siteName}
        </div>
      </div>
    </div>
  );
}
