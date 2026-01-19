import { Metadata } from "next";
import { redirect } from "next/navigation";


import { prisma } from "@/lib/prisma";
import { PPDBRegistrationForm } from "@/components/public/ppdb-registration-form";

// Dynamic for PPDB form - needs real-time period check
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Formulir Pendaftaran PPDB",
  description: "Formulir Pendaftaran Peserta Didik Baru Online",
};

async function getActivePeriod() {
  try {
    const period = await prisma.pPDBPeriod.findFirst({
      where: { isActive: true },
    });
    return period;
  } catch (error) {
    console.error("Error fetching active PPDB period:", error);
    return null;
  }
}

export default async function PPDBDaftarPage() {
  const activePeriod = await getActivePeriod();

  // Redirect if no active period
  if (!activePeriod) {
    redirect("/ppdb");
  }

  // Check if registration is open
  const now = new Date();
  const isOpen = now >= activePeriod.startDate && now <= activePeriod.endDate;

  if (!isOpen) {
    redirect("/ppdb");
  }

  return (
    <main className="flex-1">
      {/* Hero */}
      <section className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground py-12">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            Formulir Pendaftaran
          </h1>
          <p className="text-primary-foreground/90">
            {activePeriod.name}
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          <PPDBRegistrationForm periodId={activePeriod.id} />
        </div>
      </div>
    </main>
  );
}
