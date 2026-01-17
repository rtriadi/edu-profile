"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { Loader2, Save } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { type SchoolProfileInput } from "@/lib/validations";
import { updateSchoolProfile } from "@/actions/school-profile";
import type { SchoolLevel } from "@/types";

interface SchoolProfileFormProps {
  profile: {
    id: string;
    name: string;
    tagline: string | null;
    logo: string | null;
    favicon: string | null;
    email: string | null;
    phone: string | null;
    whatsapp: string | null;
    address: string | null;
    latitude: number | null;
    longitude: number | null;
    vision: string | null;
    mission: string | null;
    history: string | null;
    accreditation: string | null;
    npsn: string | null;
    foundedYear: number | null;
    schoolLevel: SchoolLevel;
    socialMedia: unknown;
  } | null;
}

const schoolLevels: { value: SchoolLevel; label: string }[] = [
  { value: "PAUD", label: "PAUD" },
  { value: "TK", label: "TK" },
  { value: "SD", label: "SD" },
  { value: "SMP", label: "SMP" },
  { value: "SMA", label: "SMA" },
  { value: "SMK", label: "SMK" },
];

export function SchoolProfileForm({ profile }: SchoolProfileFormProps) {
  const router = useRouter();
  const socialMedia = profile?.socialMedia as Record<string, string> | null;

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<SchoolProfileInput>({
    defaultValues: {
      name: profile?.name || "",
      tagline: profile?.tagline || "",
      logo: profile?.logo || "",
      favicon: profile?.favicon || "",
      email: profile?.email || "",
      phone: profile?.phone || "",
      whatsapp: profile?.whatsapp || "",
      address: profile?.address || "",
      latitude: profile?.latitude || undefined,
      longitude: profile?.longitude || undefined,
      vision: profile?.vision || "",
      mission: profile?.mission || "",
      history: profile?.history || "",
      accreditation: profile?.accreditation || "",
      npsn: profile?.npsn || "",
      foundedYear: profile?.foundedYear || undefined,
      schoolLevel: profile?.schoolLevel || "SD",
      socialMedia: {
        facebook: socialMedia?.facebook || "",
        instagram: socialMedia?.instagram || "",
        youtube: socialMedia?.youtube || "",
        twitter: socialMedia?.twitter || "",
        tiktok: socialMedia?.tiktok || "",
      },
    },
  });

  const schoolLevel = watch("schoolLevel");

  const onSubmit = async (data: SchoolProfileInput) => {
    const result = await updateSchoolProfile(data);

    if (result.success) {
      toast.success(result.message);
      router.refresh();
    } else {
      toast.error(result.error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Tabs defaultValue="general" className="space-y-6">
        <TabsList>
          <TabsTrigger value="general">Informasi Umum</TabsTrigger>
          <TabsTrigger value="visi-misi">Visi & Misi</TabsTrigger>
          <TabsTrigger value="contact">Kontak</TabsTrigger>
          <TabsTrigger value="social">Media Sosial</TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle>Informasi Umum</CardTitle>
              <CardDescription>
                Informasi dasar tentang sekolah
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Nama Sekolah *</Label>
                  <Input
                    id="name"
                    placeholder="SD Negeri 1 Jakarta"
                    {...register("name")}
                    disabled={isSubmitting}
                  />
                  {errors.name && (
                    <p className="text-sm text-destructive">{errors.name.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="schoolLevel">Jenjang Sekolah</Label>
                  <Select
                    value={schoolLevel}
                    onValueChange={(value) => setValue("schoolLevel", value as SchoolLevel)}
                    disabled={isSubmitting}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih jenjang" />
                    </SelectTrigger>
                    <SelectContent>
                      {schoolLevels.map((level) => (
                        <SelectItem key={level.value} value={level.value}>
                          {level.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="tagline">Tagline / Motto</Label>
                <Input
                  id="tagline"
                  placeholder="Mendidik Generasi Unggul dan Berkarakter"
                  {...register("tagline")}
                  disabled={isSubmitting}
                />
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="npsn">NPSN</Label>
                  <Input
                    id="npsn"
                    placeholder="12345678"
                    {...register("npsn")}
                    disabled={isSubmitting}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="accreditation">Akreditasi</Label>
                  <Input
                    id="accreditation"
                    placeholder="A"
                    {...register("accreditation")}
                    disabled={isSubmitting}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="foundedYear">Tahun Berdiri</Label>
                  <Input
                    id="foundedYear"
                    type="number"
                    placeholder="2000"
                    {...register("foundedYear", { valueAsNumber: true })}
                    disabled={isSubmitting}
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="logo">URL Logo</Label>
                  <Input
                    id="logo"
                    type="url"
                    placeholder="https://..."
                    {...register("logo")}
                    disabled={isSubmitting}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="favicon">URL Favicon</Label>
                  <Input
                    id="favicon"
                    type="url"
                    placeholder="https://..."
                    {...register("favicon")}
                    disabled={isSubmitting}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="visi-misi">
          <Card>
            <CardHeader>
              <CardTitle>Visi, Misi & Sejarah</CardTitle>
              <CardDescription>
                Visi, misi, dan sejarah sekolah
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="vision">Visi</Label>
                <Textarea
                  id="vision"
                  placeholder="Visi sekolah..."
                  rows={4}
                  {...register("vision")}
                  disabled={isSubmitting}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="mission">Misi</Label>
                <Textarea
                  id="mission"
                  placeholder="Misi sekolah (pisahkan dengan baris baru untuk setiap poin)"
                  rows={6}
                  {...register("mission")}
                  disabled={isSubmitting}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="history">Sejarah</Label>
                <Textarea
                  id="history"
                  placeholder="Sejarah berdirinya sekolah..."
                  rows={8}
                  {...register("history")}
                  disabled={isSubmitting}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="contact">
          <Card>
            <CardHeader>
              <CardTitle>Informasi Kontak</CardTitle>
              <CardDescription>
                Alamat dan informasi kontak sekolah
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="address">Alamat Lengkap</Label>
                <Textarea
                  id="address"
                  placeholder="Jl. Pendidikan No. 1, Kelurahan, Kecamatan, Kota"
                  rows={3}
                  {...register("address")}
                  disabled={isSubmitting}
                />
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="phone">Telepon</Label>
                  <Input
                    id="phone"
                    placeholder="(021) 1234567"
                    {...register("phone")}
                    disabled={isSubmitting}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="whatsapp">WhatsApp</Label>
                  <Input
                    id="whatsapp"
                    placeholder="6281234567890"
                    {...register("whatsapp")}
                    disabled={isSubmitting}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="info@sekolah.sch.id"
                    {...register("email")}
                    disabled={isSubmitting}
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="latitude">Latitude (Google Maps)</Label>
                  <Input
                    id="latitude"
                    type="number"
                    step="any"
                    placeholder="-6.2088"
                    {...register("latitude", { valueAsNumber: true })}
                    disabled={isSubmitting}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="longitude">Longitude (Google Maps)</Label>
                  <Input
                    id="longitude"
                    type="number"
                    step="any"
                    placeholder="106.8456"
                    {...register("longitude", { valueAsNumber: true })}
                    disabled={isSubmitting}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="social">
          <Card>
            <CardHeader>
              <CardTitle>Media Sosial</CardTitle>
              <CardDescription>
                Link media sosial sekolah
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="facebook">Facebook</Label>
                  <Input
                    id="facebook"
                    type="url"
                    placeholder="https://facebook.com/sekolah"
                    {...register("socialMedia.facebook")}
                    disabled={isSubmitting}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="instagram">Instagram</Label>
                  <Input
                    id="instagram"
                    type="url"
                    placeholder="https://instagram.com/sekolah"
                    {...register("socialMedia.instagram")}
                    disabled={isSubmitting}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="youtube">YouTube</Label>
                  <Input
                    id="youtube"
                    type="url"
                    placeholder="https://youtube.com/@sekolah"
                    {...register("socialMedia.youtube")}
                    disabled={isSubmitting}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="twitter">Twitter / X</Label>
                  <Input
                    id="twitter"
                    type="url"
                    placeholder="https://twitter.com/sekolah"
                    {...register("socialMedia.twitter")}
                    disabled={isSubmitting}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tiktok">TikTok</Label>
                  <Input
                    id="tiktok"
                    type="url"
                    placeholder="https://tiktok.com/@sekolah"
                    {...register("socialMedia.tiktok")}
                    disabled={isSubmitting}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="mt-6">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Menyimpan...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Simpan Perubahan
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
