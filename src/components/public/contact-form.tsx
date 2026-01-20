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

interface ContactFormTranslations {
  fullName: string;
  namePlaceholder: string;
  email: string;
  phoneNumber: string;
  subject: string;
  subjectPlaceholder: string;
  message: string;
  messagePlaceholder: string;
  thankYou: string;
  messageReceived: string;
  messageSent: string;
  messageFailed: string;
  sendMessage: string;
  sending: string;
}

interface ContactFormProps {
  translations?: ContactFormTranslations;
}

const defaultTranslations: ContactFormTranslations = {
  fullName: "Nama Lengkap",
  namePlaceholder: "Masukkan nama lengkap",
  email: "Email",
  phoneNumber: "No. Telepon",
  subject: "Subjek",
  subjectPlaceholder: "Perihal pesan",
  message: "Pesan",
  messagePlaceholder: "Tulis pesan Anda di sini...",
  thankYou: "Terima Kasih!",
  messageReceived: "Pesan Anda telah kami terima. Kami akan segera menghubungi Anda.",
  messageSent: "Pesan berhasil dikirim!",
  messageFailed: "Gagal mengirim pesan",
  sendMessage: "Kirim Pesan",
  sending: "Mengirim...",
};

export function ContactForm({ translations = defaultTranslations }: ContactFormProps) {
  const t = translations;
  const [isSubmitted, setIsSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactMessageInput>({
    resolver: zodResolver(contactMessageSchema),
    mode: "onBlur",
  });

  const onSubmit = async (data: ContactMessageInput) => {
    const result = await submitContactMessage(data);

    if (result.success) {
      setIsSubmitted(true);
      toast.success(t.messageSent);
      reset();
      setTimeout(() => setIsSubmitted(false), 5000);
    } else {
      toast.error(result.error || t.messageFailed);
    }
  };

  if (isSubmitted) {
    return (
      <div className="text-center py-12">
        <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
        <h3 className="text-xl font-semibold mb-2">{t.thankYou}</h3>
        <p className="text-muted-foreground">
          {t.messageReceived}
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">{t.fullName} *</Label>
          <Input
            id="name"
            placeholder={t.namePlaceholder}
            autoComplete="name"
            {...register("name")}
            disabled={isSubmitting}
          />
          {errors.name && (
            <p className="text-sm text-destructive">{errors.name.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">{t.email} *</Label>
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
          <Label htmlFor="phone">{t.phoneNumber}</Label>
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
          <Label htmlFor="subject">{t.subject}</Label>
          <Input
            id="subject"
            placeholder={t.subjectPlaceholder}
            {...register("subject")}
            disabled={isSubmitting}
          />
          {errors.subject && (
            <p className="text-sm text-destructive">{errors.subject.message}</p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="message">{t.message} *</Label>
        <Textarea
          id="message"
          placeholder={t.messagePlaceholder}
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
            {t.sending}
          </>
        ) : (
          <>
            <Send className="mr-2 h-4 w-4" />
            {t.sendMessage}
          </>
        )}
      </Button>
    </form>
  );
}
