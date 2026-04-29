# Supabase Connection Pooling Guide for Vercel

## Masalah: Connection Exhaustion di Vercel Serverless

Vercel menjalankan setiap request di serverless function yang bisa spin-up banyak instance secara simultan. Setiap instance Prisma membuat koneksi database baru. Tanpa connection pooler, ini bisa menyebabkan:
- Error: `too many connections` di Supabase
- Latency tinggi pada cold start
- Connection limit exhausted

## Solusi: Supabase Supavisor (Connection Pooler)

Supabase sudah menyediakan built-in connection pooler bernama **Supavisor** yang bisa digunakan secara gratis.

### 1. Dapatkan Connection Pooler URL

Buka [Supabase Dashboard](https://supabase.com/dashboard) → Project → Settings → Database:

- Pilih tab **"Connection pooling"**
- Salin URL dengan mode **Transaction** (port 6543)

Format URL:
```
postgresql://postgres.[project-ref]:[password]@aws-0-[region].pooler.supabase.com:6543/postgres
```

### 2. Konfigurasi Environment Variables

Di file `.env` (lokal) dan Vercel Environment Variables, set:

```env
# CONNECTION POOLER (gunakan ini di Vercel — port 6543, mode transaction)
DATABASE_URL="postgresql://postgres.[ref]:[password]@aws-0-[region].pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=1&pool_timeout=20"

# DIRECT CONNECTION (gunakan untuk prisma migrate/db push — port 5432)
DIRECT_URL="postgresql://postgres.[ref]:[password]@db.[ref].supabase.co:5432/postgres"
```

### 3. Update prisma/schema.prisma

Pastikan schema menggunakan `directUrl` untuk migrasi:

```prisma
datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL")   // pooler URL untuk production queries
  directUrl = env("DIRECT_URL")     // direct URL untuk migrations
}
```

### 4. Parameter URL yang Penting

| Parameter | Value | Keterangan |
|-----------|-------|-----------|
| `pgbouncer=true` | true | Aktifkan pgBouncer compatibility |
| `connection_limit=1` | 1 | Batasi koneksi per serverless instance |
| `pool_timeout=20` | 20 | Timeout jika tidak ada koneksi tersedia |

### 5. Vercel Environment Setup

Di Vercel Dashboard → Project → Settings → Environment Variables:

1. Set `DATABASE_URL` ke **pooler URL** (port 6543) untuk semua environments
2. Set `DIRECT_URL` ke **direct URL** (port 5432) untuk Production + Preview

> ⚠️ JANGAN gunakan direct URL (port 5432) sebagai DATABASE_URL di Vercel — ini akan menyebabkan connection exhaustion!

## Validasi

Setelah konfigurasi, test dengan:

```bash
# Test build (tidak boleh ada error koneksi)
npm run build

# Test database (jalankan dari local dengan DIRECT_URL)
npx prisma db push
```

## Monitoring

Di Supabase Dashboard → Database → Connection pooling, lihat:
- Current connections count
- Pool utilization
- Connection errors

## Referensi

- [Supabase Connection Pooling Docs](https://supabase.com/docs/guides/database/connecting-to-postgres#connection-pooler)
- [Prisma + Supabase Guide](https://supabase.com/partners/integrations/prisma)
- [Vercel + Prisma Best Practices](https://www.prisma.io/docs/guides/deployment/deployment-guides/deploying-to-vercel)
