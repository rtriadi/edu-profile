"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, CheckCircle, User, Users, MapPin } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createPublicRegistration } from "@/actions/ppdb";
import { toast } from "sonner";

const formSchema = z.object({
  studentName: z.string().min(1, "Nama siswa wajib diisi").max(100),
  nisn: z.string().max(20).optional(),
  birthPlace: z.string().min(1, "Tempat lahir wajib diisi").max(100),
  birthDate: z.string().min(1, "Tanggal lahir wajib diisi"),
  gender: z.enum(["MALE", "FEMALE"], { error: "Jenis kelamin wajib dipilih" }),
  religion: z.string().max(50).optional(),
  address: z.string().min(1, "Alamat wajib diisi").max(500),
  previousSchool: z.string().max(200).optional(),
  fatherName: z.string().max(100).optional(),
  fatherJob: z.string().max(100).optional(),
  fatherPhone: z.string().max(20).optional(),
  motherName: z.string().max(100).optional(),
  motherJob: z.string().max(100).optional(),
  motherPhone: z.string().max(20).optional(),
  guardianName: z.string().max(100).optional(),
  guardianPhone: z.string().max(20).optional(),
  guardianEmail: z.string().email("Format email tidak valid").optional().or(z.literal("")),
});

type FormData = z.infer<typeof formSchema>;

interface PPDBRegistrationFormProps {
  periodId: string;
}

export function PPDBRegistrationForm({ periodId }: PPDBRegistrationFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [registrationNo, setRegistrationNo] = useState("");

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      studentName: "",
      nisn: "",
      birthPlace: "",
      birthDate: "",
      gender: undefined,
      religion: "",
      address: "",
      previousSchool: "",
      fatherName: "",
      fatherJob: "",
      fatherPhone: "",
      motherName: "",
      motherJob: "",
      motherPhone: "",
      guardianName: "",
      guardianPhone: "",
      guardianEmail: "",
    },
  });

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    try {
      const result = await createPublicRegistration({
        periodId,
        studentName: data.studentName,
        nisn: data.nisn || undefined,
        birthPlace: data.birthPlace,
        birthDate: new Date(data.birthDate),
        gender: data.gender,
        religion: data.religion || undefined,
        address: data.address,
        previousSchool: data.previousSchool || undefined,
        fatherName: data.fatherName || undefined,
        fatherJob: data.fatherJob || undefined,
        fatherPhone: data.fatherPhone || undefined,
        motherName: data.motherName || undefined,
        motherJob: data.motherJob || undefined,
        motherPhone: data.motherPhone || undefined,
        guardianName: data.guardianName || undefined,
        guardianPhone: data.guardianPhone || undefined,
        guardianEmail: data.guardianEmail || undefined,
      });

      if (result.success) {
        setIsSuccess(true);
        setRegistrationNo((result.data as { registrationNo?: string })?.registrationNo || "");
        toast.success(result.message);
      } else {
        toast.error(result.error || "Gagal melakukan pendaftaran");
      }
    } catch (error) {
      console.error("Registration error:", error);
      toast.error("Terjadi kesalahan. Silakan coba lagi.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <Card className="text-center">
        <CardContent className="py-12">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Pendaftaran Berhasil!</h2>
          <p className="text-muted-foreground mb-4">
            Terima kasih telah mendaftar. Simpan nomor registrasi Anda:
          </p>
          <div className="bg-primary/10 rounded-lg p-4 mb-6 inline-block">
            <p className="text-2xl font-bold text-primary">{registrationNo}</p>
          </div>
          <p className="text-sm text-muted-foreground mb-6">
            Silakan hubungi sekolah untuk informasi lebih lanjut tentang proses seleksi.
          </p>
          <Button onClick={() => router.push("/ppdb")}>
            Kembali ke Halaman PPDB
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {/* Data Siswa */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Data Calon Siswa
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="studentName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nama Lengkap *</FormLabel>
                    <FormControl>
                      <Input placeholder="Nama lengkap sesuai akta" autoComplete="name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="nisn"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>NISN</FormLabel>
                    <FormControl>
                      <Input placeholder="Nomor Induk Siswa Nasional" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="birthPlace"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tempat Lahir *</FormLabel>
                    <FormControl>
                      <Input placeholder="Kota kelahiran" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="birthDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tanggal Lahir *</FormLabel>
                    <FormControl>
                      <Input type="date" autoComplete="bday" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="gender"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Jenis Kelamin *</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih jenis kelamin" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="MALE">Laki-laki</SelectItem>
                        <SelectItem value="FEMALE">Perempuan</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="religion"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Agama</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih agama" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Islam">Islam</SelectItem>
                        <SelectItem value="Kristen">Kristen</SelectItem>
                        <SelectItem value="Katolik">Katolik</SelectItem>
                        <SelectItem value="Hindu">Hindu</SelectItem>
                        <SelectItem value="Buddha">Buddha</SelectItem>
                        <SelectItem value="Konghucu">Konghucu</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="previousSchool"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Asal Sekolah</FormLabel>
                  <FormControl>
                    <Input placeholder="Nama sekolah sebelumnya" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {/* Alamat */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Alamat
            </CardTitle>
          </CardHeader>
          <CardContent>
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Alamat Lengkap *</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Alamat lengkap tempat tinggal"
                      rows={3}
                      autoComplete="street-address"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {/* Data Orang Tua */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Data Orang Tua / Wali
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Ayah */}
            <div>
              <h4 className="font-medium mb-3">Data Ayah</h4>
              <div className="grid md:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="fatherName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nama Ayah</FormLabel>
                      <FormControl>
                        <Input placeholder="Nama lengkap ayah" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="fatherJob"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Pekerjaan</FormLabel>
                      <FormControl>
                        <Input placeholder="Pekerjaan ayah" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="fatherPhone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>No. Telepon</FormLabel>
                      <FormControl>
                        <Input placeholder="08xxxxxxxxxx" type="tel" inputMode="tel" autoComplete="tel" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Ibu */}
            <div>
              <h4 className="font-medium mb-3">Data Ibu</h4>
              <div className="grid md:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="motherName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nama Ibu</FormLabel>
                      <FormControl>
                        <Input placeholder="Nama lengkap ibu" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="motherJob"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Pekerjaan</FormLabel>
                      <FormControl>
                        <Input placeholder="Pekerjaan ibu" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="motherPhone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>No. Telepon</FormLabel>
                      <FormControl>
                        <Input placeholder="08xxxxxxxxxx" type="tel" inputMode="tel" autoComplete="tel" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Wali */}
            <div>
              <h4 className="font-medium mb-3">Data Wali (Opsional)</h4>
              <div className="grid md:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="guardianName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nama Wali</FormLabel>
                      <FormControl>
                        <Input placeholder="Nama lengkap wali" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="guardianPhone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>No. Telepon</FormLabel>
                      <FormControl>
                        <Input placeholder="08xxxxxxxxxx" type="tel" inputMode="tel" autoComplete="tel" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="guardianEmail"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="email@example.com" autoComplete="email" spellCheck={false} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Submit */}
        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/ppdb")}
          >
            Batal
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isSubmitting ? "Mengirim..." : "Kirim Pendaftaran"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
