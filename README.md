# EduProfile CMS

Sistem Manajemen Konten (CMS) untuk Website Profil Sekolah yang dapat digunakan untuk jenjang PAUD hingga SMA/SMK.

## 🎯 Fitur Utama

### CMS Features
- ✅ **Page Builder** - Drag-and-drop block-based editor
- ✅ **Menu Manager** - Pengaturan navigasi dinamis
- ✅ **Media Library** - Manajemen file dengan upload
- ✅ **Multi-language** - Dukungan bahasa Indonesia & Inggris
- ✅ **SEO Settings** - Meta tags, sitemap, og:image
- ✅ **Theme System** - Customizable colors dan layout

### School Features
- ✅ **Profil Sekolah** - Visi, misi, sejarah, fasilitas, akreditasi
- ✅ **Guru & Staff** - Direktori guru dan staff
- ✅ **Program Akademik** - Kurikulum, ekstrakurikuler, program unggulan
- ✅ **Berita & Pengumuman** - Blog dengan kategori dan tag
- ✅ **Galeri** - Album foto dan video
- ✅ **PPDB Online** - Pendaftaran peserta didik baru
- ✅ **Agenda/Kalender** - Event dan kegiatan sekolah
- ✅ **Download Center** - Dokumen yang bisa diunduh
- ✅ **Kontak** - Form kontak dengan notifikasi email
- ✅ **Testimoni & Alumni** - Tracking alumni dan testimoni

## 🛠️ Tech Stack

- **Framework**: Next.js 16+ (App Router)
- **Language**: TypeScript
- **Database**: MySQL
- **ORM**: Prisma
- **Auth**: NextAuth.js v5
- **UI Library**: shadcn/ui
- **Styling**: Tailwind CSS v4
- **Forms**: React Hook Form + Zod
- **File Upload**: Vercel Blob
- **Icons**: Lucide Icons

## 📋 Prerequisites

- Node.js 18+
- MySQL 8.0+ atau MariaDB 10.5+
- npm / pnpm / yarn

## 🚀 Getting Started

### 1. Clone & Install

```bash
git clone <repository-url>
cd edu-profile
npm install
```

### 2. Environment Setup

Copy file `.env.example` ke `.env` dan sesuaikan:

```bash
cp .env.example .env
```

Edit `.env`:

```env
# Database
DATABASE_URL="mysql://root:password@localhost:3306/edu_profile"

# NextAuth.js
AUTH_SECRET="your-secret-key-here"
AUTH_URL="http://localhost:3000"

# Vercel Blob (optional, untuk production)
BLOB_READ_WRITE_TOKEN="your-vercel-blob-token"

# Email (optional)
RESEND_API_KEY="your-resend-api-key"
EMAIL_FROM="noreply@yourschool.com"

# App
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NEXT_PUBLIC_APP_NAME="EduProfile CMS"
```

### 3. Database Setup

```bash
# Generate Prisma Client
npm run db:generate

# Push schema ke database
npm run db:push

# Seed data awal (termasuk admin user)
npm run db:seed
```

### 4. Run Development Server

```bash
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000) untuk melihat website.

### 5. Login ke Admin

Buka [http://localhost:3000/login](http://localhost:3000/login)

**Default Admin Credentials:**
- Email: `admin@sekolah.sch.id`
- Password: `admin123`

⚠️ **Penting:** Segera ganti password setelah login pertama!

## 📁 Project Structure

```
edu-profile/
├── prisma/
│   ├── schema.prisma      # Database schema
│   └── seed.ts            # Initial data seeding
├── src/
│   ├── app/
│   │   ├── (admin)/       # Admin dashboard routes
│   │   ├── (auth)/        # Authentication routes
│   │   ├── (public)/      # Public website routes
│   │   └── api/           # API routes
│   ├── actions/           # Server actions
│   ├── components/
│   │   ├── admin/         # Admin components
│   │   ├── page-builder/  # Page builder blocks
│   │   ├── public/        # Public site components
│   │   └── ui/            # shadcn/ui components
│   ├── hooks/             # Custom React hooks
│   ├── lib/               # Utilities & config
│   └── types/             # TypeScript types
├── public/                # Static files
└── package.json
```

## 🎨 Page Builder Blocks

### Content Blocks
- Heading (H1-H6)
- Paragraph
- Image
- Video (YouTube/Vimeo)
- Quote
- List (ordered/unordered)
- Divider
- Callout (info/warning/success/error)

### Layout Blocks
- Columns (2-4)
- Spacer
- Hero Section
- CTA (Call to Action)
- Stats Counter
- Timeline

### School-Specific Blocks
- Staff Grid
- News List
- Gallery Embed
- Event Calendar
- Download List
- Testimonial Slider
- Contact Form
- Google Maps
- Program Cards
- Facility Showcase
- Achievement List

## 🔐 User Roles

| Role | Permissions |
|------|-------------|
| **SUPERADMIN** | Full access, manage users, delete content |
| **ADMIN** | Manage content, settings, view analytics |
| **EDITOR** | Create and edit content only |

## 📝 Database Commands

```bash
# Generate Prisma Client
npm run db:generate

# Push schema changes (development)
npm run db:push

# Create migration (production)
npm run db:migrate

# Reset database (DANGER!)
npm run db:reset

# Open Prisma Studio
npm run db:studio

# Seed database
npm run db:seed
```

## 🚀 Deployment

### Vercel (Recommended)

1. Push code ke GitHub
2. Import project di Vercel
3. Set environment variables
4. Deploy!

### Self-hosted (Docker)

```bash
# Build
docker build -t edu-profile .

# Run
docker run -p 3000:3000 --env-file .env edu-profile
```

## 📄 License

MIT License - Silakan gunakan untuk proyek apapun.

## 🧪 Testing

```bash
# Run tests
npm run test

# Run tests once
npm run test:run

# Run tests with coverage
npm run test:coverage
```

## 🎨 UI/UX Components

### Animation Components
- `FadeIn` - Fade in animation with direction
- `ScaleIn` - Scale in animation
- `SlideIn` - Slide in from any direction
- `Stagger` - Stagger children animations

### Loading Components
- `Spinner` - Loading spinner with sizes
- `PageLoading` - Full page loading state
- `Skeleton` - Skeleton loading placeholders
- `DotsLoading` - Animated dots loading

### Empty States
- `EmptyState` - Customizable empty state
- `NoDataEmpty` - No data available
- `NoSearchResults` - No search results found
- `ErrorState` - Error occurred state

### Form Components
- `FormField` - Form field with validation
- `FormInput` - Enhanced input with states
- `FormTextarea` - Textarea with character count
- `PasswordInput` - Password with visibility toggle
- `SearchInput` - Search with clear button

### Navigation
- `Breadcrumbs` - Breadcrumb navigation
- `ScrollToTop` - Scroll to top button
- `ThemeToggle` - Dark/light mode toggle

---

Made with ❤️ for Indonesian Schools
