"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { Loader2, Plus, X, User } from "lucide-react";
import { toast } from "sonner";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createStaff, updateStaff } from "@/actions/staff";

interface StaffFormData {
  name: string;
  nip?: string;
  position: string;
  department?: string;
  bio?: string;
  photo?: string;
  email?: string;
  phone?: string;
  education?: string;
  isTeacher: boolean;
  subjects?: string[];
  isActive: boolean;
  order: number;
}

interface Staff {
  id: string;
  name: string;
  nip: string | null;
  position: string;
  department: string | null;
  bio: string | null;
  photo: string | null;
  email: string | null;
  phone: string | null;
  education: string | null;
  isTeacher: boolean;
  subjects: unknown;
  isActive: boolean;
  order: number;
}

interface StaffFormProps {
  staff?: Staff;
}

const DEPARTMENT_OPTIONS = [
  "Pimpinan",
  "Kurikulum",
  "Kesiswaan",
  "Sarana Prasarana",
  "Humas",
  "Tata Usaha",
  "Bimbingan Konseling",
  "Perpustakaan",
  "Laboratorium",
  "Lainnya",
];

export function StaffForm({ staff }: StaffFormProps) {
  const router = useRouter();
  const isEditing = !!staff;

  // Parse existing subjects
  const existingSubjects = staff?.subjects as string[] | null;

  const [subjects, setSubjects] = useState<string[]>(existingSubjects || []);
  const [newSubject, setNewSubject] = useState("");
  const [photoPreview, setPhotoPreview] = useState<string | null>(
    staff?.photo || null
  );

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<StaffFormData>({
    defaultValues: {
      name: staff?.name || "",
      nip: staff?.nip || "",
      position: staff?.position || "",
      department: staff?.department || "",
      bio: staff?.bio || "",
      photo: staff?.photo || "",
      email: staff?.email || "",
      phone: staff?.phone || "",
      education: staff?.education || "",
      isTeacher: staff?.isTeacher ?? false,
      subjects: existingSubjects || [],
      isActive: staff?.isActive ?? true,
      order: staff?.order ?? 0,
    },
  });

  const isTeacher = watch("isTeacher");
  const isActive = watch("isActive");
  const department = watch("department");

  const handleAddSubject = () => {
    if (newSubject.trim() && !subjects.includes(newSubject.trim())) {
      const updatedSubjects = [...subjects, newSubject.trim()];
      setSubjects(updatedSubjects);
      setValue("subjects", updatedSubjects);
      setNewSubject("");
    }
  };

  const handleRemoveSubject = (subject: string) => {
    const updatedSubjects = subjects.filter((s) => s !== subject);
    setSubjects(updatedSubjects);
    setValue("subjects", updatedSubjects);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddSubject();
    }
  };

  const onSubmit = async (data: StaffFormData) => {
    // Include subjects in the data
    const submitData = {
      ...data,
      subjects: isTeacher ? subjects : [],
    };

    const result = isEditing
      ? await updateStaff(staff.id, submitData)
      : await createStaff(submitData);

    if (result.success) {
      toast.success(result.message);
      router.push("/admin/staff");
      router.refresh();
    } else {
      toast.error(result.error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Basic Information */}
      <Card>
        <CardHeader>
          <CardTitle>Informasi Dasar</CardTitle>
          <CardDescription>
            Data identitas guru atau staff sekolah
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">
                Nama Lengkap <span className="text-destructive">*</span>
              </Label>
              <Input
                id="name"
                placeholder="Masukkan nama lengkap"
                {...register("name")}
                disabled={isSubmitting}
              />
              {errors.name && (
                <p className="text-sm text-destructive">{errors.name.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="nip">NIP/NIK</Label>
              <Input
                id="nip"
                placeholder="Masukkan NIP atau NIK"
                {...register("nip")}
                disabled={isSubmitting}
              />
              {errors.nip && (
                <p className="text-sm text-destructive">{errors.nip.message}</p>
              )}
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="position">
                Jabatan <span className="text-destructive">*</span>
              </Label>
              <Input
                id="position"
                placeholder="Contoh: Guru Matematika, Kepala Sekolah"
                {...register("position")}
                disabled={isSubmitting}
              />
              {errors.position && (
                <p className="text-sm text-destructive">
                  {errors.position.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="department">Bidang/Departemen</Label>
              <Select
                value={department || ""}
                onValueChange={(value) => setValue("department", value)}
                disabled={isSubmitting}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pilih bidang" />
                </SelectTrigger>
                <SelectContent>
                  {DEPARTMENT_OPTIONS.map((dept) => (
                    <SelectItem key={dept} value={dept}>
                      {dept}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.department && (
                <p className="text-sm text-destructive">
                  {errors.department.message}
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Contact & Profile */}
      <Card>
        <CardHeader>
          <CardTitle>Kontak & Profil</CardTitle>
          <CardDescription>
            Informasi kontak dan profil singkat
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="email@sekolah.sch.id"
                {...register("email")}
                disabled={isSubmitting}
              />
              {errors.email && (
                <p className="text-sm text-destructive">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">No. Telepon</Label>
              <Input
                id="phone"
                placeholder="08xxxxxxxxxx"
                {...register("phone")}
                disabled={isSubmitting}
              />
              {errors.phone && (
                <p className="text-sm text-destructive">{errors.phone.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="education">Pendidikan Terakhir</Label>
            <Input
              id="education"
              placeholder="Contoh: S1 Pendidikan Matematika - Universitas Negeri Jakarta"
              {...register("education")}
              disabled={isSubmitting}
            />
            {errors.education && (
              <p className="text-sm text-destructive">
                {errors.education.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="bio">Bio/Deskripsi</Label>
            <Textarea
              id="bio"
              placeholder="Tulis bio singkat tentang guru/staff..."
              rows={4}
              {...register("bio")}
              disabled={isSubmitting}
            />
            {errors.bio && (
              <p className="text-sm text-destructive">{errors.bio.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="photo">Foto</Label>
            <div className="flex items-start gap-4">
              {/* Photo Preview */}
              <div className="relative h-24 w-24 rounded-lg border bg-muted overflow-hidden flex-shrink-0">
                {photoPreview ? (
                  <Image
                    src={photoPreview}
                    alt="Preview"
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <User className="h-8 w-8 text-muted-foreground" />
                  </div>
                )}
              </div>

              <div className="flex-1 space-y-2">
                <Input
                  id="photo"
                  type="url"
                  placeholder="https://example.com/photo.jpg"
                  {...register("photo")}
                  onChange={(e) => {
                    register("photo").onChange(e);
                    setPhotoPreview(e.target.value || null);
                  }}
                  disabled={isSubmitting}
                />
                <p className="text-xs text-muted-foreground">
                  Masukkan URL foto atau upload melalui Media Library
                </p>
              </div>
            </div>
            {errors.photo && (
              <p className="text-sm text-destructive">{errors.photo.message}</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Teacher Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Pengaturan</CardTitle>
          <CardDescription>
            Status dan konfigurasi guru/staff
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Is Teacher Toggle */}
          <div className="flex items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
              <Label htmlFor="isTeacher" className="text-base">
                Guru
              </Label>
              <p className="text-sm text-muted-foreground">
                Aktifkan jika ini adalah guru pengajar
              </p>
            </div>
            <Switch
              id="isTeacher"
              checked={isTeacher}
              onCheckedChange={(checked) => setValue("isTeacher", checked)}
              disabled={isSubmitting}
            />
          </div>

          {/* Subjects (only shown if isTeacher) */}
          {isTeacher && (
            <div className="space-y-3 rounded-lg border p-4">
              <Label>Mata Pelajaran yang Diampu</Label>
              <div className="flex gap-2">
                <Input
                  placeholder="Tambah mata pelajaran"
                  value={newSubject}
                  onChange={(e) => setNewSubject(e.target.value)}
                  onKeyDown={handleKeyDown}
                  disabled={isSubmitting}
                />
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={handleAddSubject}
                  disabled={isSubmitting || !newSubject.trim()}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>

              {subjects.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-2">
                  {subjects.map((subject) => (
                    <Badge
                      key={subject}
                      variant="secondary"
                      className="gap-1 pr-1"
                    >
                      {subject}
                      <button
                        type="button"
                        onClick={() => handleRemoveSubject(subject)}
                        className="ml-1 rounded-full p-0.5 hover:bg-muted-foreground/20"
                        disabled={isSubmitting}
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}

              {subjects.length === 0 && (
                <p className="text-sm text-muted-foreground">
                  Belum ada mata pelajaran. Tambahkan mata pelajaran yang diampu.
                </p>
              )}
            </div>
          )}

          {/* Is Active Toggle */}
          <div className="flex items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
              <Label htmlFor="isActive" className="text-base">
                Status Aktif
              </Label>
              <p className="text-sm text-muted-foreground">
                Staff aktif akan ditampilkan di halaman publik
              </p>
            </div>
            <Switch
              id="isActive"
              checked={isActive}
              onCheckedChange={(checked) => setValue("isActive", checked)}
              disabled={isSubmitting}
            />
          </div>

          {/* Order */}
          <div className="space-y-2">
            <Label htmlFor="order">Urutan Tampil</Label>
            <Input
              id="order"
              type="number"
              min={0}
              placeholder="0"
              className="w-32"
              {...register("order", { valueAsNumber: true })}
              disabled={isSubmitting}
            />
            <p className="text-xs text-muted-foreground">
              Angka lebih kecil akan ditampilkan lebih dulu
            </p>
            {errors.order && (
              <p className="text-sm text-destructive">{errors.order.message}</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex items-center gap-4">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Menyimpan...
            </>
          ) : isEditing ? (
            "Simpan Perubahan"
          ) : (
            "Tambah Staff"
          )}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          disabled={isSubmitting}
        >
          Batal
        </Button>
      </div>
    </form>
  );
}
