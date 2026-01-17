import { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";
import { getProgramBySlug } from "@/actions/programs";
import { PublicHeader } from "@/components/public/header";
import { PublicFooter } from "@/components/public/footer";

interface ProgramDetailPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: ProgramDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const program = await getProgramBySlug(slug);

  if (!program) {
    return { title: "Program Tidak Ditemukan" };
  }

  return {
    title: program.name,
    description: program.description || `Program akademik: ${program.name}`,
    openGraph: {
      images: program.image ? [program.image] : [],
    },
  };
}

export default async function ProgramDetailPage({ params }: ProgramDetailPageProps) {
  const { slug } = await params;
  const program = await getProgramBySlug(slug);

  if (!program || !program.isActive) {
    notFound();
  }

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "CURRICULUM":
        return "Kurikulum";
      case "EXTRACURRICULAR":
        return "Ekstrakurikuler";
      default:
        return "Program Unggulan";
    }
  };

  return (
    <>
      <PublicHeader />

      <main className="flex-1">
        <div className="container mx-auto px-4 py-8">
          {/* Back Button */}
          <Button variant="ghost" asChild className="mb-6">
            <Link href="/akademik">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Kembali ke Program Akademik
            </Link>
          </Button>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              {program.image && (
                <div className="relative h-64 md:h-80 rounded-lg overflow-hidden mb-6">
                  <Image
                    src={program.image}
                    alt={program.name}
                    fill
                    className="object-cover"
                  />
                </div>
              )}

              <div className="mb-4">
                <span className="text-sm text-primary font-medium">
                  {getTypeLabel(program.type)}
                </span>
              </div>

              <h1 className="text-3xl font-bold mb-4">{program.name}</h1>

              {program.description && (
                <div className="prose prose-lg max-w-none">
                  <p>{program.description}</p>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-muted/50 rounded-lg p-6">
                <h3 className="font-semibold mb-4">Informasi Program</h3>
                <dl className="space-y-3">
                  <div>
                    <dt className="text-sm text-muted-foreground">Tipe</dt>
                    <dd className="font-medium">{getTypeLabel(program.type)}</dd>
                  </div>
                  <div>
                    <dt className="text-sm text-muted-foreground">Status</dt>
                    <dd className="font-medium text-green-600">Aktif</dd>
                  </div>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </main>

      <PublicFooter />
    </>
  );
}
