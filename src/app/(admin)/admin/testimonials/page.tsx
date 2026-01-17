import { Metadata } from "next";
import Link from "next/link";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { TestimonialTable } from "@/components/admin/testimonials/testimonial-table";
import { getTestimonials } from "@/actions/testimonials";

export const metadata: Metadata = {
  title: "Testimoni - Admin",
};

export default async function TestimonialsPage() {
  const { data: testimonials } = await getTestimonials({ limit: 50 });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Testimoni</h1>
          <p className="text-muted-foreground">
            Kelola testimoni dari orang tua, siswa, dan alumni
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/testimonials/new">
            <Plus className="h-4 w-4 mr-2" />
            Tambah Testimoni
          </Link>
        </Button>
      </div>

      <TestimonialTable testimonials={testimonials} />
    </div>
  );
}
