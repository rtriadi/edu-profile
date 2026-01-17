import { Metadata } from "next";
import { TestimonialForm } from "@/components/admin/testimonials/testimonial-form";

export const metadata: Metadata = {
  title: "Tambah Testimoni - Admin",
};

export default function NewTestimonialPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Tambah Testimoni Baru</h1>
        <p className="text-muted-foreground">
          Tambahkan testimoni baru
        </p>
      </div>

      <TestimonialForm />
    </div>
  );
}
