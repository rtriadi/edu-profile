# Panduan Deployment EduProfile CMS

## 📋 Daftar Isi
1. [Persiapan](#persiapan)
2. [Setup Supabase (Database)](#setup-supabase-database)
3. [Setup Vercel (Hosting)](#setup-vercel-hosting)
4. [Konfigurasi Environment Variables](#konfigurasi-environment-variables)
5. [Deploy Aplikasi](#deploy-aplikasi)
6. [Post-Deployment](#post-deployment)
7. [Troubleshooting](#troubleshooting)

---

## 🔧 Persiapan

### Prasyarat
- Akun [GitHub](https://github.com)
- Akun [Supabase](https://supabase.com) (gratis)
- Akun [Vercel](https://vercel.com) (gratis)
- Repository sudah di-push ke GitHub

### Struktur File yang Diperlukan
```
├── prisma/
│   ├── schema.prisma              # Schema untuk MySQL (development)
│   └── schema.postgresql.prisma   # Schema untuk PostgreSQL (production)
├── .env.production.example        # Template environment variables
└── package.json
```

---

## 🗄️ Setup Supabase (Database)

### Langkah 1: Buat Project Baru

1. Buka [Supabase Dashboard](https://supabase.com/dashboard)
2. Klik **"New Project"**
3. Isi informasi project:
   - **Name**: `eduprofile-cms` (atau nama lain)
   - **Database Password**: Buat password yang kuat (SIMPAN INI!)
   - **Region**: Pilih yang terdekat (contoh: `Southeast Asia (Singapore)`)
4. Klik **"Create new project"**
5. Tunggu hingga project selesai dibuat (± 2 menit)

### Langkah 2: Dapatkan Connection String

1. Buka project yang baru dibuat
2. Pergi ke **Project Settings** (ikon gear di sidebar)
3. Klik **Database** di menu kiri
4. Scroll ke bagian **Connection string**
5. Pilih tab **URI**
6. Salin connection string, contoh:
   ```
   postgresql://postgres.[PROJECT-REF]:[YOUR-PASSWORD]@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres
   ```

### Langkah 3: Siapkan Connection String

Anda memerlukan 2 connection string:

#### a. DATABASE_URL (dengan pgbouncer untuk pooling)
```
postgresql://postgres.[PROJECT-REF]:[YOUR-PASSWORD]@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres?pgbouncer=true
```

#### b. DIRECT_URL (untuk migrations)
```
postgresql://postgres.[PROJECT-REF]:[YOUR-PASSWORD]@aws-0-ap-southeast-1.pooler.supabase.com:5432/postgres
```

> ⚠️ **Perbedaan penting:**
> - `DATABASE_URL`: Port `6543` + `?pgbouncer=true` (untuk connection pooling)
> - `DIRECT_URL`: Port `5432` tanpa pgbouncer (untuk migrations)

---

## 🚀 Setup Vercel (Hosting)

### Langkah 1: Import Repository

1. Buka [Vercel Dashboard](https://vercel.com/dashboard)
2. Klik **"Add New..."** → **"Project"**
3. Pilih **"Import Git Repository"**
4. Hubungkan dengan GitHub jika belum
5. Pilih repository `edu-profile`
6. Klik **"Import"**

### Langkah 2: Konfigurasi Project

1. **Framework Preset**: Pilih `Next.js`
2. **Root Directory**: Biarkan default (`./`)
3. **Build Command**: Biarkan default (`next build`)
4. **Output Directory**: Biarkan default (`.next`)

### Langkah 3: Environment Variables

Klik **"Environment Variables"** dan tambahkan:

| Key | Value | Environment |
|-----|-------|-------------|
| `DATABASE_URL` | `postgresql://postgres.[REF]:[PASS]@...pooler.supabase.com:6543/postgres?pgbouncer=true` | Production |
| `DIRECT_URL` | `postgresql://postgres.[REF]:[PASS]@...pooler.supabase.com:5432/postgres` | Production |
| `AUTH_SECRET` | `[generate dengan: openssl rand -base64 32]` | Production |
| `AUTH_URL` | `https://your-domain.vercel.app` | Production |
| `NEXT_PUBLIC_APP_URL` | `https://your-domain.vercel.app` | Production |
| `NEXT_PUBLIC_APP_NAME` | `EduProfile CMS` | Production |

> 💡 **Tip**: Generate `AUTH_SECRET` dengan command:
> ```bash
> openssl rand -base64 32
> ```

### Langkah 4: Deploy

1. Klik **"Deploy"**
2. Tunggu proses build selesai (± 3-5 menit)

---

## ⚙️ Konfigurasi Environment Variables

### Generate AUTH_SECRET

```bash
# Di terminal/command prompt
openssl rand -base64 32
```

Atau gunakan online generator: https://generate-secret.vercel.app/32

### Contoh .env.production

```env
# Database - Supabase PostgreSQL
DATABASE_URL="postgresql://postgres.xxxxxxxxxxxx:YourPassword123@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres.xxxxxxxxxxxx:YourPassword123@aws-0-ap-southeast-1.pooler.supabase.com:5432/postgres"

# NextAuth.js
AUTH_SECRET="xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
AUTH_URL="https://eduprofile-cms.vercel.app"

# App
NEXT_PUBLIC_APP_URL="https://eduprofile-cms.vercel.app"
NEXT_PUBLIC_APP_NAME="EduProfile CMS"

# Optional - Vercel Blob Storage
BLOB_READ_WRITE_TOKEN=""

# Optional - Email (Resend)
RESEND_API_KEY=""
EMAIL_FROM="noreply@yourschool.com"
```

---

## 📦 Deploy Aplikasi

### Langkah 1: Ganti Schema Prisma

Sebelum deploy ke production, ganti schema Prisma ke PostgreSQL:

```bash
# Backup schema MySQL
cp prisma/schema.prisma prisma/schema.mysql.prisma

# Gunakan schema PostgreSQL
cp prisma/schema.postgresql.prisma prisma/schema.prisma
```

### Langkah 2: Generate Prisma Client

```bash
npx prisma generate
```

### Langkah 3: Push ke GitHub

```bash
git add .
git commit -m "chore: Switch to PostgreSQL for production"
git push origin main
```

### Langkah 4: Vercel Auto Deploy

Vercel akan otomatis mendeteksi push baru dan melakukan redeploy.

### Langkah 5: Jalankan Migrations

Setelah deploy berhasil, jalankan migration untuk membuat tabel di Supabase:

```bash
# Set environment variable lokal ke production
export DATABASE_URL="your-production-database-url"
export DIRECT_URL="your-production-direct-url"

# Jalankan migration
npx prisma db push
```

Atau gunakan Vercel CLI:

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Link project
vercel link

# Jalankan migration via Vercel
vercel env pull .env.production.local
npx prisma db push
```

---

## 🔄 Post-Deployment

### 1. Seed Data Awal

```bash
# Dengan environment production
npx prisma db seed
```

### 2. Buat Admin User

Akses aplikasi dan buat user admin pertama melalui:
- URL: `https://your-domain.vercel.app/login`
- Default credentials (dari seed): 
  - Email: `admin@eduprofile.com`
  - Password: `admin123`

> ⚠️ **PENTING**: Segera ganti password setelah login pertama!

### 3. Verifikasi Deployment

Checklist verifikasi:
- [ ] Homepage loading dengan benar
- [ ] Login berfungsi
- [ ] Dashboard admin accessible
- [ ] Database terkoneksi (coba tambah data)
- [ ] Pengaturan tersimpan ke database

### 4. Setup Custom Domain (Opsional)

1. Buka project di Vercel Dashboard
2. Pergi ke **Settings** → **Domains**
3. Tambahkan domain Anda
4. Update DNS records sesuai instruksi Vercel
5. Update `AUTH_URL` dan `NEXT_PUBLIC_APP_URL` dengan domain baru

---

## 🐛 Troubleshooting

### Error: "prisma: command not found"

```bash
npm install prisma --save-dev
npx prisma generate
```

### Error: "Can't reach database server"

1. Periksa connection string
2. Pastikan IP tidak di-block (Supabase: Database → Connection Pooling → Allowed IPs)
3. Gunakan port yang benar (6543 untuk pooler, 5432 untuk direct)

### Error: "Authentication failed"

1. Periksa password database (tidak ada karakter khusus yang perlu di-escape?)
2. Reset password di Supabase jika perlu

### Error: "Prisma schema validation error"

Pastikan menggunakan schema yang benar:
```bash
cp prisma/schema.postgresql.prisma prisma/schema.prisma
npx prisma generate
```

### Build Error di Vercel

1. Periksa build logs di Vercel Dashboard
2. Pastikan semua environment variables sudah diset
3. Coba clear cache: **Settings** → **General** → **"Clear Build Cache"**

### Database Migration Error

```bash
# Reset dan push ulang schema
npx prisma db push --force-reset

# Atau reset dengan data
npx prisma migrate reset
```

---

## 📊 Monitoring & Maintenance

### Vercel Analytics

1. Buka project di Vercel
2. Pergi ke **Analytics** tab
3. Enable Web Analytics (gratis untuk hobby plan)

### Supabase Dashboard

1. Buka Supabase Dashboard
2. Pergi ke **Table Editor** untuk melihat data
3. Pergi ke **Database** → **Backups** untuk backup

### Update Dependencies

```bash
# Check outdated packages
npm outdated

# Update packages
npm update

# Test locally
npm run build

# Push to deploy
git add . && git commit -m "chore: Update dependencies" && git push
```

---

## 📞 Bantuan

- **Vercel Documentation**: https://vercel.com/docs
- **Supabase Documentation**: https://supabase.com/docs
- **Prisma Documentation**: https://www.prisma.io/docs
- **Next.js Documentation**: https://nextjs.org/docs

---

## ✅ Checklist Deployment

- [ ] Supabase project dibuat
- [ ] Connection string disalin
- [ ] Vercel project di-import dari GitHub
- [ ] Environment variables diset di Vercel
- [ ] Schema Prisma diganti ke PostgreSQL
- [ ] Push ke GitHub
- [ ] Build berhasil di Vercel
- [ ] Database migration dijalankan
- [ ] Seed data awal
- [ ] Login test berhasil
- [ ] Password admin diganti
- [ ] Custom domain (opsional)

---

*Dokumentasi ini dibuat untuk EduProfile CMS v1.0*
