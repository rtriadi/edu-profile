import { z } from "zod";

// ==========================================
// AUTH VALIDATIONS
// ==========================================

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Email diperlukan")
    .email("Format email tidak valid"),
  password: z
    .string()
    .min(1, "Password diperlukan")
    .min(6, "Password minimal 6 karakter"),
});

export const registerSchema = z.object({
  name: z
    .string()
    .min(1, "Nama diperlukan")
    .min(2, "Nama minimal 2 karakter")
    .max(100, "Nama maksimal 100 karakter"),
  email: z
    .string()
    .min(1, "Email diperlukan")
    .email("Format email tidak valid"),
  password: z
    .string()
    .min(1, "Password diperlukan")
    .min(6, "Password minimal 6 karakter")
    .max(100, "Password maksimal 100 karakter"),
  confirmPassword: z.string().min(1, "Konfirmasi password diperlukan"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Password tidak cocok",
  path: ["confirmPassword"],
});

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, "Password saat ini diperlukan"),
  newPassword: z
    .string()
    .min(1, "Password baru diperlukan")
    .min(6, "Password minimal 6 karakter"),
  confirmPassword: z.string().min(1, "Konfirmasi password diperlukan"),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Password tidak cocok",
  path: ["confirmPassword"],
});

// ==========================================
// USER VALIDATIONS
// ==========================================

export const userSchema = z.object({
  name: z
    .string()
    .min(1, "Nama diperlukan")
    .min(2, "Nama minimal 2 karakter")
    .max(100, "Nama maksimal 100 karakter"),
  email: z
    .string()
    .min(1, "Email diperlukan")
    .email("Format email tidak valid"),
  password: z
    .string()
    .min(6, "Password minimal 6 karakter")
    .optional()
    .or(z.literal("")),
  role: z.enum(["SUPERADMIN", "ADMIN", "EDITOR"]),
  isActive: z.boolean().default(true),
  image: z.string().url().optional().or(z.literal("")),
});

export const updateUserSchema = userSchema.partial();

// ==========================================
// PAGE VALIDATIONS
// ==========================================

export const pageSchema = z.object({
  title: z
    .string()
    .min(1, "Judul diperlukan")
    .max(200, "Judul maksimal 200 karakter"),
  slug: z
    .string()
    .min(1, "Slug diperlukan")
    .max(200, "Slug maksimal 200 karakter")
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug hanya boleh huruf kecil, angka, dan dash"),
  content: z.any(), // JSON content from page builder
  excerpt: z.string().max(500, "Ringkasan maksimal 500 karakter").optional(),
  featuredImg: z.string().url().optional().or(z.literal("")),
  status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]).default("DRAFT"),
  template: z.string().default("default"),
  seoTitle: z.string().max(70, "SEO Title maksimal 70 karakter").optional(),
  seoDesc: z.string().max(160, "SEO Description maksimal 160 karakter").optional(),
  seoKeywords: z.string().max(200, "Keywords maksimal 200 karakter").optional(),
  ogImage: z.string().url().optional().or(z.literal("")),
  locale: z.enum(["id", "en"]).default("id"),
  parentId: z.string().optional().or(z.literal("")),
});

// ==========================================
// POST VALIDATIONS
// ==========================================

export const postSchema = z.object({
  title: z
    .string()
    .min(1, "Judul diperlukan")
    .max(200, "Judul maksimal 200 karakter"),
  slug: z
    .string()
    .min(1, "Slug diperlukan")
    .max(200, "Slug maksimal 200 karakter")
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug hanya boleh huruf kecil, angka, dan dash"),
  content: z.any(), // JSON content from page builder
  excerpt: z.string().max(500, "Ringkasan maksimal 500 karakter").optional(),
  featuredImg: z.string().url().optional().or(z.literal("")),
  status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]).default("DRAFT"),
  categoryId: z.string().min(1, "Kategori diperlukan"),
  tags: z.array(z.string()).optional(),
  isFeatured: z.boolean().default(false),
  seoTitle: z.string().max(70, "SEO Title maksimal 70 karakter").optional(),
  seoDesc: z.string().max(160, "SEO Description maksimal 160 karakter").optional(),
  locale: z.enum(["id", "en"]).default("id"),
  publishedAt: z.date().optional(),
});

export const categorySchema = z.object({
  name: z
    .string()
    .min(1, "Nama kategori diperlukan")
    .max(100, "Nama maksimal 100 karakter"),
  slug: z
    .string()
    .min(1, "Slug diperlukan")
    .max(100, "Slug maksimal 100 karakter")
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug hanya boleh huruf kecil, angka, dan dash"),
  description: z.string().max(500, "Deskripsi maksimal 500 karakter").optional(),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/, "Format warna tidak valid").optional(),
});

export const tagSchema = z.object({
  name: z.string().min(1, "Nama tag diperlukan").max(50, "Nama maksimal 50 karakter"),
  slug: z.string().min(1, "Slug diperlukan").max(50, "Slug maksimal 50 karakter"),
});

// ==========================================
// STAFF VALIDATIONS
// ==========================================

export const staffSchema = z.object({
  name: z
    .string()
    .min(1, "Nama diperlukan")
    .max(100, "Nama maksimal 100 karakter"),
  nip: z.string().max(50, "NIP maksimal 50 karakter").optional().or(z.literal("")),
  position: z
    .string()
    .min(1, "Jabatan diperlukan")
    .max(100, "Jabatan maksimal 100 karakter"),
  department: z.string().max(100, "Bidang maksimal 100 karakter").optional(),
  bio: z.string().max(1000, "Bio maksimal 1000 karakter").optional(),
  photo: z.string().url().optional().or(z.literal("")),
  email: z.string().email("Format email tidak valid").optional().or(z.literal("")),
  phone: z.string().max(20, "No. telepon maksimal 20 karakter").optional(),
  education: z.string().max(200, "Pendidikan maksimal 200 karakter").optional(),
  isTeacher: z.boolean().default(false),
  subjects: z.array(z.string()).optional(),
  isActive: z.boolean().default(true),
  order: z.number().int().min(0).default(0),
});

// ==========================================
// PROGRAM VALIDATIONS
// ==========================================

export const programSchema = z.object({
  name: z
    .string()
    .min(1, "Nama program diperlukan")
    .max(200, "Nama maksimal 200 karakter"),
  slug: z
    .string()
    .min(1, "Slug diperlukan")
    .max(200, "Slug maksimal 200 karakter")
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug hanya boleh huruf kecil, angka, dan dash"),
  type: z.enum(["CURRICULUM", "EXTRACURRICULAR", "FEATURED"]),
  description: z.string().max(1000, "Deskripsi maksimal 1000 karakter").optional(),
  content: z.any().optional(), // JSON content
  image: z.string().url().optional().or(z.literal("")),
  icon: z.string().max(50, "Icon maksimal 50 karakter").optional(),
  isActive: z.boolean().default(true),
  order: z.number().int().min(0).default(0),
});

// ==========================================
// GALLERY VALIDATIONS
// ==========================================

export const gallerySchema = z.object({
  title: z
    .string()
    .min(1, "Judul diperlukan")
    .max(200, "Judul maksimal 200 karakter"),
  slug: z
    .string()
    .min(1, "Slug diperlukan")
    .max(200, "Slug maksimal 200 karakter")
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug hanya boleh huruf kecil, angka, dan dash"),
  description: z.string().max(1000, "Deskripsi maksimal 1000 karakter").optional(),
  coverImage: z.string().url().optional().or(z.literal("")),
  type: z.enum(["PHOTO", "VIDEO", "MIXED"]).default("PHOTO"),
  isPublished: z.boolean().default(true),
  eventDate: z.date().optional(),
});

export const galleryItemSchema = z.object({
  url: z.string().url("URL tidak valid").min(1, "URL diperlukan"),
  thumbnail: z.string().url().optional(),
  caption: z.string().max(500, "Caption maksimal 500 karakter").optional(),
  type: z.enum(["image", "video"]).default("image"),
  order: z.number().int().min(0).default(0),
});

// ==========================================
// EVENT VALIDATIONS
// ==========================================

export const eventSchema = z.object({
  title: z
    .string()
    .min(1, "Judul diperlukan")
    .max(200, "Judul maksimal 200 karakter"),
  slug: z
    .string()
    .min(1, "Slug diperlukan")
    .max(200, "Slug maksimal 200 karakter")
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug hanya boleh huruf kecil, angka, dan dash"),
  description: z.string().max(1000, "Deskripsi maksimal 1000 karakter").optional(),
  content: z.any().optional(), // JSON content
  location: z.string().max(200, "Lokasi maksimal 200 karakter").optional(),
  startDate: z.date({ error: "Tanggal mulai diperlukan" }),
  endDate: z.date().optional(),
  isAllDay: z.boolean().default(false),
  image: z.string().url().optional().or(z.literal("")),
  type: z.enum(["ACADEMIC", "HOLIDAY", "EXAM", "CEREMONY", "COMPETITION", "MEETING", "OTHER"]).default("ACADEMIC"),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/, "Format warna tidak valid").optional(),
  isPublished: z.boolean().default(true),
});

// ==========================================
// PPDB VALIDATIONS
// ==========================================

export const ppdbPeriodSchema = z.object({
  name: z
    .string()
    .min(1, "Nama periode diperlukan")
    .max(100, "Nama maksimal 100 karakter"),
  academicYear: z
    .string()
    .min(1, "Tahun ajaran diperlukan")
    .regex(/^\d{4}\/\d{4}$/, "Format tahun ajaran: 2024/2025"),
  description: z.string().max(2000, "Deskripsi maksimal 2000 karakter").optional(),
  startDate: z.date({ error: "Tanggal mulai diperlukan" }),
  endDate: z.date({ error: "Tanggal selesai diperlukan" }),
  quota: z.number().int().min(1, "Kuota minimal 1").optional(),
  requirements: z.array(z.string()).optional(),
  stages: z.array(z.object({
    name: z.string(),
    startDate: z.date(),
    endDate: z.date(),
    description: z.string().optional(),
  })).optional(),
  formFields: z.array(z.object({
    name: z.string(),
    label: z.string(),
    type: z.enum(["text", "textarea", "select", "file", "date", "number"]),
    required: z.boolean().default(false),
    options: z.array(z.string()).optional(),
  })).optional(),
  isActive: z.boolean().default(false),
});

export const ppdbRegistrationSchema = z.object({
  studentName: z
    .string()
    .min(1, "Nama siswa diperlukan")
    .max(100, "Nama maksimal 100 karakter"),
  nisn: z.string().max(20, "NISN maksimal 20 karakter").optional(),
  birthPlace: z.string().min(1, "Tempat lahir diperlukan").max(100, "Maksimal 100 karakter"),
  birthDate: z.date({ error: "Tanggal lahir diperlukan" }),
  gender: z.enum(["MALE", "FEMALE"], { error: "Jenis kelamin diperlukan" }),
  religion: z.string().max(50, "Agama maksimal 50 karakter").optional(),
  address: z.string().min(1, "Alamat diperlukan").max(500, "Alamat maksimal 500 karakter"),
  previousSchool: z.string().max(200, "Nama sekolah maksimal 200 karakter").optional(),
  fatherName: z.string().max(100, "Nama maksimal 100 karakter").optional(),
  fatherJob: z.string().max(100, "Pekerjaan maksimal 100 karakter").optional(),
  fatherPhone: z.string().max(20, "No. telepon maksimal 20 karakter").optional(),
  motherName: z.string().max(100, "Nama maksimal 100 karakter").optional(),
  motherJob: z.string().max(100, "Pekerjaan maksimal 100 karakter").optional(),
  motherPhone: z.string().max(20, "No. telepon maksimal 20 karakter").optional(),
  guardianName: z.string().max(100, "Nama maksimal 100 karakter").optional(),
  guardianPhone: z.string().max(20, "No. telepon maksimal 20 karakter").optional(),
  guardianEmail: z.string().email("Format email tidak valid").optional().or(z.literal("")),
});

// ==========================================
// DOWNLOAD VALIDATIONS
// ==========================================

export const downloadSchema = z.object({
  title: z
    .string()
    .min(1, "Judul diperlukan")
    .max(200, "Judul maksimal 200 karakter"),
  description: z.string().max(500, "Deskripsi maksimal 500 karakter").optional(),
  file: z.string().url("URL file tidak valid").min(1, "File diperlukan"),
  fileName: z.string().optional(),
  fileSize: z.number().int().optional(),
  fileType: z.string().optional(),
  category: z.string().max(100, "Kategori maksimal 100 karakter").optional(),
  isPublished: z.boolean().default(true),
  order: z.number().int().min(0).default(0),
});

// ==========================================
// TESTIMONIAL & ALUMNI VALIDATIONS
// ==========================================

export const testimonialSchema = z.object({
  name: z
    .string()
    .min(1, "Nama diperlukan")
    .max(100, "Nama maksimal 100 karakter"),
  role: z
    .string()
    .min(1, "Peran diperlukan")
    .max(100, "Peran maksimal 100 karakter"),
  content: z
    .string()
    .min(1, "Testimoni diperlukan")
    .max(1000, "Testimoni maksimal 1000 karakter"),
  photo: z.string().url().optional().or(z.literal("")),
  rating: z.number().int().min(1).max(5).default(5),
  isPublished: z.boolean().default(true),
  order: z.number().int().min(0).default(0),
});

export const alumniSchema = z.object({
  name: z
    .string()
    .min(1, "Nama diperlukan")
    .max(100, "Nama maksimal 100 karakter"),
  graduationYear: z
    .number()
    .int()
    .min(1900, "Tahun tidak valid")
    .max(new Date().getFullYear(), "Tahun tidak boleh di masa depan"),
  photo: z.string().url().optional().or(z.literal("")),
  currentStatus: z.string().max(200, "Status maksimal 200 karakter").optional(),
  company: z.string().max(200, "Perusahaan maksimal 200 karakter").optional(),
  achievement: z.string().max(1000, "Prestasi maksimal 1000 karakter").optional(),
  testimonial: z.string().max(1000, "Testimoni maksimal 1000 karakter").optional(),
  socialMedia: z.object({
    linkedin: z.string().url().optional(),
    instagram: z.string().optional(),
  }).optional(),
  isPublished: z.boolean().default(true),
});

// ==========================================
// FACILITY VALIDATIONS
// ==========================================

export const facilitySchema = z.object({
  name: z
    .string()
    .min(1, "Nama fasilitas diperlukan")
    .max(200, "Nama maksimal 200 karakter"),
  slug: z
    .string()
    .min(1, "Slug diperlukan")
    .max(200, "Slug maksimal 200 karakter")
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug hanya boleh huruf kecil, angka, dan dash"),
  description: z.string().max(2000, "Deskripsi maksimal 2000 karakter").optional(),
  images: z.array(z.string().url()).optional(),
  icon: z.string().max(50, "Icon maksimal 50 karakter").optional(),
  features: z.array(z.string()).optional(),
  isPublished: z.boolean().default(true),
  order: z.number().int().min(0).default(0),
});

// ==========================================
// CONTACT VALIDATIONS
// ==========================================

export const contactMessageSchema = z.object({
  name: z
    .string()
    .min(1, "Nama diperlukan")
    .max(100, "Nama maksimal 100 karakter"),
  email: z
    .string()
    .min(1, "Email diperlukan")
    .email("Format email tidak valid"),
  phone: z.string().max(20, "No. telepon maksimal 20 karakter").optional(),
  subject: z.string().max(200, "Subjek maksimal 200 karakter").optional(),
  message: z
    .string()
    .min(1, "Pesan diperlukan")
    .max(2000, "Pesan maksimal 2000 karakter"),
});

// ==========================================
// MENU VALIDATIONS
// ==========================================

export const menuSchema = z.object({
  name: z.string().min(1, "Nama menu diperlukan").max(100, "Nama maksimal 100 karakter"),
  location: z.string().min(1, "Lokasi diperlukan").max(50, "Lokasi maksimal 50 karakter"),
});

export const menuItemSchema = z.object({
  label: z.string().min(1, "Label diperlukan").max(100, "Label maksimal 100 karakter"),
  url: z.string().max(500, "URL maksimal 500 karakter").optional(),
  pageSlug: z.string().optional(),
  type: z.enum(["link", "page", "dropdown", "megamenu"]).default("link"),
  parentId: z.string().optional(),
  order: z.number().int().min(0).default(0),
  isVisible: z.boolean().default(true),
  openNew: z.boolean().default(false),
  icon: z.string().max(50, "Icon maksimal 50 karakter").optional(),
  cssClass: z.string().max(100, "CSS class maksimal 100 karakter").optional(),
});

// ==========================================
// SETTINGS VALIDATIONS
// ==========================================

export const schoolProfileSchema = z.object({
  name: z.string().min(1, "Nama sekolah diperlukan").max(200, "Nama maksimal 200 karakter"),
  tagline: z.string().max(200, "Tagline maksimal 200 karakter").optional(),
  logo: z.string().url().optional().or(z.literal("")),
  favicon: z.string().url().optional().or(z.literal("")),
  email: z.string().email("Format email tidak valid").optional().or(z.literal("")),
  phone: z.string().max(20, "No. telepon maksimal 20 karakter").optional(),
  whatsapp: z.string().max(20, "No. WhatsApp maksimal 20 karakter").optional(),
  address: z.string().max(500, "Alamat maksimal 500 karakter").optional(),
  latitude: z.number().min(-90).max(90).optional(),
  longitude: z.number().min(-180).max(180).optional(),
  vision: z.string().max(2000, "Visi maksimal 2000 karakter").optional(),
  mission: z.string().max(5000, "Misi maksimal 5000 karakter").optional(),
  history: z.string().max(10000, "Sejarah maksimal 10000 karakter").optional(),
  accreditation: z.string().max(50, "Akreditasi maksimal 50 karakter").optional(),
  npsn: z.string().max(20, "NPSN maksimal 20 karakter").optional(),
  foundedYear: z.number().int().min(1800).max(new Date().getFullYear()).optional(),
  schoolLevel: z.enum(["PAUD", "TK", "SD", "SMP", "SMA", "SMK"]).default("SD"),
  socialMedia: z.object({
    facebook: z.string().url().optional().or(z.literal("")),
    instagram: z.string().url().optional().or(z.literal("")),
    youtube: z.string().url().optional().or(z.literal("")),
    twitter: z.string().url().optional().or(z.literal("")),
    tiktok: z.string().url().optional().or(z.literal("")),
  }).optional(),
});

// ==========================================
// ACHIEVEMENT VALIDATIONS
// ==========================================

export const achievementSchema = z.object({
  title: z
    .string()
    .min(1, "Judul prestasi diperlukan")
    .max(200, "Judul maksimal 200 karakter"),
  description: z.string().max(1000, "Deskripsi maksimal 1000 karakter").optional(),
  category: z.string().max(100, "Kategori maksimal 100 karakter").optional(),
  level: z.string().max(100, "Level maksimal 100 karakter").optional(),
  date: z.date().optional(),
  image: z.string().url().optional().or(z.literal("")),
  participants: z.string().max(500, "Peserta maksimal 500 karakter").optional(),
  isPublished: z.boolean().default(true),
  order: z.number().int().min(0).default(0),
});

// ==========================================
// ANNOUNCEMENT VALIDATIONS
// ==========================================

export const announcementSchema = z.object({
  title: z
    .string()
    .min(1, "Judul diperlukan")
    .max(200, "Judul maksimal 200 karakter"),
  content: z
    .string()
    .min(1, "Konten diperlukan")
    .max(1000, "Konten maksimal 1000 karakter"),
  type: z.enum(["info", "warning", "success", "error"]).default("info"),
  link: z.string().url().optional().or(z.literal("")),
  linkText: z.string().max(50, "Teks link maksimal 50 karakter").optional(),
  startDate: z.date().optional(),
  endDate: z.date().optional(),
  isActive: z.boolean().default(true),
  showOnPages: z.array(z.string()).optional(),
  order: z.number().int().min(0).default(0),
});

// Export types from schemas
export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type UserInput = z.infer<typeof userSchema>;
export type PageInput = z.infer<typeof pageSchema>;
export type PostInput = z.infer<typeof postSchema>;
export type CategoryInput = z.infer<typeof categorySchema>;
export type StaffInput = z.infer<typeof staffSchema>;
export type ProgramInput = z.infer<typeof programSchema>;
export type GalleryInput = z.infer<typeof gallerySchema>;
export type EventInput = z.infer<typeof eventSchema>;
export type PPDBPeriodInput = z.infer<typeof ppdbPeriodSchema>;
export type PPDBRegistrationInput = z.infer<typeof ppdbRegistrationSchema>;
export type DownloadInput = z.infer<typeof downloadSchema>;
export type TestimonialInput = z.infer<typeof testimonialSchema>;
export type AlumniInput = z.infer<typeof alumniSchema>;
export type FacilityInput = z.infer<typeof facilitySchema>;
export type ContactMessageInput = z.infer<typeof contactMessageSchema>;
export type MenuInput = z.infer<typeof menuSchema>;
export type MenuItemInput = z.infer<typeof menuItemSchema>;
export type SchoolProfileInput = z.infer<typeof schoolProfileSchema>;
export type AchievementInput = z.infer<typeof achievementSchema>;
export type AnnouncementInput = z.infer<typeof announcementSchema>;
