import { Metadata } from "next";
import { notFound } from "next/navigation";
import { TestimonialForm } from "@/components/admin/testimonials/testimonial-form";
import { getTestimonialById } from "@/actions/testimonials";

export const metadata: Metadata = {
  title: "Edit Testimoni - Admin",
};

interface EditTestimonialPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditTestimonialPage({ params }: EditTestimonialPageProps) {
  const { id } = await params;
  const testimonial = await getTestimonialById(id);

  if (!testimonial) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Edit Testimoni</h1>
        <p className="text-muted-foreground">
          Edit testimoni dari: {testimonial.name}
        </p>
      </div>

      <TestimonialForm testimonial={testimonial} />
    </div>
  );
}
