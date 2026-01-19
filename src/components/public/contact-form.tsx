"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Send, CheckCircle } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { contactMessageSchema, type ContactMessageInput } from "@/lib/validations";
import { submitContactMessage } from "@/actions/contact";

export function ContactForm() {
  const [isSubmitted, setIsSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactMessageInput>({
    resolver: zodResolver(contactMessageSchema),
  });

  const onSubmit = async (data: ContactMessageInput) => {
    const result = await submitContactMessage(data);

    if (result.success) {
      setIsSubmitted(true);
      toast.success("Pesan berhasil dikirim!");
      reset();
      setTimeout(() => setIsSubmitted(false), 5000);
    } else {
      toast.error(result.error || "Gagal mengirim pesan");
    }
  };

  if (isSubmitted) {
    return (
      <div className="text-center py-12">
        <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
        <h3 className="text-xl font-semibold mb-2">Terima Kasih!</h3>
        <p className="text-muted-foreground">
          Pesan Anda telah kami terima. Kami akan segera menghubungi Anda.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Nama Lengkap *</Label>
          <Input
            id="name"
            placeholder="Masukkan nama lengkap"
            autoComplete="name"
            {...register("name")}
            disabled={isSubmitting}
          />
          {errors.name && (
            <p className="text-sm text-destructive">{errors.name.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email *</Label>
          <Input
            id="email"
            type="email"
            placeholder="email@example.com"
            autoComplete="email"
            spellCheck={false}
            {...register("email")}
            disabled={isSubmitting}
          />
          {errors.email && (
            <p className="text-sm text-destructive">{errors.email.message}</p>
          )}
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="phone">No. Telepon</Label>
          <Input
            id="phone"
            type="tel"
            inputMode="tel"
            placeholder="08xxxxxxxxxx"
            autoComplete="tel"
            {...register("phone")}
            disabled={isSubmitting}
          />
          {errors.phone && (
            <p className="text-sm text-destructive">{errors.phone.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="subject">Subjek</Label>
          <Input
            id="subject"
            placeholder="Perihal pesan"
            {...register("subject")}
            disabled={isSubmitting}
          />
          {errors.subject && (
            <p className="text-sm text-destructive">{errors.subject.message}</p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="message">Pesan *</Label>
        <Textarea
          id="message"
          placeholder="Tulis pesan Anda di sini..."
          rows={6}
          {...register("message")}
          disabled={isSubmitting}
        />
        {errors.message && (
          <p className="text-sm text-destructive">{errors.message.message}</p>
        )}
      </div>

      <Button type="submit" size="lg" disabled={isSubmitting}>
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Mengirim...
          </>
        ) : (
          <>
            <Send className="mr-2 h-4 w-4" />
            Kirim Pesan
          </>
        )}
      </Button>
    </form>
  );
}
