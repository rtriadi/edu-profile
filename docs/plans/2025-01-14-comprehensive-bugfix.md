# Comprehensive Bug Fix & Production Ready Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Fix all identified bugs and make the EduProfile CMS production-ready with working navigation, language support, media upload, and Grade Levels section on homepage.

**Architecture:** 
- Fix header navigation dropdown rendering issue (menu items with type "dropdown" or children not rendering properly)
- Implement server-side language from admin settings (no user toggle needed)
- Fix media upload for Vercel production using Vercel Blob storage
- Add Grade Levels section to homepage (already fetched, just needs display)
- Review and enhance Menu Manager functionality in backend

**Tech Stack:** Next.js 15, React, Prisma, PostgreSQL, Vercel Blob, TypeScript, Tailwind CSS

---

## Issue Summary

| # | Issue | Root Cause | Priority |
|---|-------|------------|----------|
| 1 | Menu Profil & Akademik dropdown tidak muncul | Header menggunakan default menu saat database menu kosong, dropdown logic issue | HIGH |
| 2 | Bahasa tidak bekerja di frontend/backend | Language dari settings tidak propagate ke semua komponen | HIGH |
| 3 | Kelas tidak ada di beranda | GradeLevels sudah di-fetch tapi section sudah ada di homepage | MEDIUM |
| 4 | Media upload lambat/timeout di Vercel | Menggunakan `uploadMediaLocal` bukan `uploadMedia` (Vercel Blob) | HIGH |
| 5 | Menu Manager tidak dinamis | Perlu dokumentasi dan UX improvement | LOW |

---

## Task 1: Fix Header Navigation Dropdown

**Files:**
- Modify: `src/components/public/header.tsx`
- Modify: `src/app/(public)/layout.tsx`

**Problem:** 
- When database has no menus, header uses default navigation with proper dropdowns
- When database has menus but items have no children, dropdowns don't render
- The `transformMenuItems` function works correctly, but the menu data from database may not have proper type="dropdown" for parent items

**Step 1: Analyze current header logic**

The header checks `menuItems.length > 0` to decide whether to use database menu or default. The issue is that database menus might not have proper dropdown structure.

**Step 2: Fix transformMenuItems to properly handle dropdown parents**

```typescript
// In header.tsx - Update transformMenuItems function
function transformMenuItems(items: MenuItem[]): NavItem[] {
  return items
    .filter(item => item.isVisible) // Only visible items
    .map((item) => {
      // Determine href based on type
      let href = "/";
      if (item.type === "page" && item.pageSlug) {
        href = item.pageSlug.startsWith("/") ? item.pageSlug : `/${item.pageSlug}`;
      } else if ((item.type === "link" || item.type === "route") && item.url) {
        href = item.url;
      } else if (item.type === "dropdown") {
        // For dropdown without url, use # or first child's href
        if (item.children?.length) {
          const firstChild = item.children[0];
          if (firstChild?.pageSlug) {
            href = firstChild.pageSlug.startsWith("/") ? firstChild.pageSlug : `/${firstChild.pageSlug}`;
          } else if (firstChild?.url) {
            href = firstChild.url;
          }
        } else {
          href = "#";
        }
      }

      return {
        label: item.label,
        href,
        openNew: item.openNew,
        children: item.children?.length 
          ? transformMenuItems(item.children) 
          : undefined,
      };
    });
}
```

**Step 3: Update header to handle empty menu gracefully**

Ensure that when menuItems from database is empty or malformed, we fall back to default navigation.

**Step 4: Verify dropdown rendering in desktop and mobile views**

Run: `npm run dev` and test navigation manually

**Step 5: Commit**

```bash
git add src/components/public/header.tsx
git commit -m "fix: header navigation dropdown rendering for database menus"
```

---

## Task 2: Fix Language Implementation (Admin Setting Only)

**Files:**
- Modify: `src/app/layout.tsx`
- Modify: `src/components/providers.tsx`
- Modify: `src/components/public/header.tsx`
- Modify: `src/components/public/footer.tsx`
- Modify: `src/app/(public)/page.tsx`

**Problem:**
- Language setting exists in admin (Settings > General > Bahasa Default)
- `getSiteConfig()` returns `language` properly
- But most frontend pages use hardcoded Indonesian text, not translations
- The `useTranslation` hook works but isn't used consistently

**Step 1: Update homepage to use server-side translations**

```typescript
// In src/app/(public)/page.tsx - Add translations
import { getTranslations, type Language } from "@/lib/translations";

export default async function HomePage() {
  const [data, siteConfig] = await Promise.all([
    getHomeData(),
    getSiteConfig(),
  ]);
  
  const t = getTranslations(siteConfig.language as Language);
  // Use t.home.*, t.stats.*, etc. for all text
}
```

**Step 2: Update all public pages to use server translations**

Pages to update:
- `src/app/(public)/page.tsx` - Homepage
- `src/app/(public)/profil/page.tsx`
- `src/app/(public)/akademik/page.tsx`
- `src/app/(public)/berita/page.tsx`
- `src/app/(public)/galeri/page.tsx`
- `src/app/(public)/kontak/page.tsx`
- `src/app/(public)/ppdb/page.tsx`
- `src/app/(public)/agenda/page.tsx`
- `src/app/(public)/unduhan/page.tsx`

**Step 3: Ensure footer uses translations properly**

Footer already uses `getTranslations(siteConfig.language)` - verify it works.

**Step 4: Commit**

```bash
git add src/app/\(public\)/*.tsx src/components/public/*.tsx
git commit -m "fix: implement server-side language translations from admin settings"
```

---

## Task 3: Verify Grade Levels Section on Homepage

**Files:**
- Review: `src/app/(public)/page.tsx`

**Problem:**
- User says "belum ada tempat untuk kelas di beranda"
- But looking at the code, Grade Levels section ALREADY EXISTS (lines 381-471)
- The section only renders if `data.gradeLevels && data.gradeLevels.length > 0`

**Step 1: Verify GradeLevel data is being fetched**

The `getHomeData()` function already fetches:
```typescript
gradeLevels: prisma.gradeLevel.findMany({
  where: { isActive: true },
  orderBy: { order: "asc" },
}).catch(() => []),
```

**Step 2: Check if GradeLevels exist in database**

Run in dev:
```bash
npx prisma studio
```
Check if `grade_levels` table has data with `isActive: true`

**Step 3: If no data exists, create seed or inform user**

The section works - user just needs to add Grade Levels in admin panel at `/admin/grade-levels`

**Step 4: Document finding**

No code changes needed - section already exists. User needs to add Grade Level data via admin.

---

## Task 4: Fix Media Upload for Vercel Production

**Files:**
- Modify: `src/components/admin/media/media-library.tsx`
- Modify: `src/actions/media.ts`

**Problem:**
- `MediaLibrary` component calls `uploadMediaLocal()` which writes to filesystem
- On Vercel (serverless), filesystem is read-only and ephemeral
- Should use `uploadMedia()` which uses Vercel Blob

**Step 1: Update MediaLibrary to use correct upload function**

```typescript
// In src/components/admin/media/media-library.tsx
// Change import
import { uploadMedia, deleteMedia, updateMediaAlt } from "@/actions/media";

// In onDrop callback, change:
const result = await uploadMedia(formData);  // NOT uploadMediaLocal
```

**Step 2: Verify Vercel Blob environment variables**

Ensure these are set in Vercel:
- `BLOB_READ_WRITE_TOKEN` - From Vercel Blob dashboard

**Step 3: Add environment variable check**

```typescript
// In src/actions/media.ts - Add at top of uploadMedia
if (!process.env.BLOB_READ_WRITE_TOKEN) {
  console.error("BLOB_READ_WRITE_TOKEN not configured");
  return { success: false, error: "Storage not configured. Please set BLOB_READ_WRITE_TOKEN." };
}
```

**Step 4: Test upload locally (will fail without token) and on Vercel**

**Step 5: Commit**

```bash
git add src/components/admin/media/media-library.tsx src/actions/media.ts
git commit -m "fix: use Vercel Blob for media upload in production"
```

---

## Task 5: Enhance Menu Manager Documentation & UX

**Files:**
- Modify: `src/app/(admin)/admin/menus/page.tsx`
- Modify: `src/components/admin/menus/menu-manager.tsx`

**Problem:**
- User is confused about Menu Manager functionality
- It's not clear that menus need to be created first, then items added
- System routes vs pages vs links is confusing

**Step 1: Add helpful description to Menu Manager page**

```typescript
// In src/app/(admin)/admin/menus/page.tsx
<p className="text-muted-foreground">
  Kelola menu navigasi website. Buat menu untuk lokasi berbeda (header, footer, mobile), 
  lalu tambahkan item menu berupa halaman CMS, rute sistem, atau link eksternal.
</p>

{/* Add info card */}
<Card className="bg-muted/50 border-dashed">
  <CardContent className="pt-6">
    <h3 className="font-semibold mb-2">Cara Menggunakan:</h3>
    <ol className="list-decimal list-inside space-y-1 text-sm text-muted-foreground">
      <li>Buat menu baru dengan lokasi (header/footer/mobile)</li>
      <li>Tambahkan item menu dengan tipe: Rute Sistem untuk halaman bawaan, Halaman CMS untuk halaman custom, atau Link untuk URL eksternal</li>
      <li>Gunakan tipe Dropdown untuk membuat menu dengan sub-menu</li>
      <li>Atur urutan dengan drag & drop (coming soon)</li>
    </ol>
  </CardContent>
</Card>
```

**Step 2: Add default header menu seed**

Create a seed script that adds default header menu with Profil and Akademik dropdowns if no menu exists.

**Step 3: Commit**

```bash
git add src/app/\(admin\)/admin/menus/page.tsx src/components/admin/menus/menu-manager.tsx
git commit -m "docs: add Menu Manager usage instructions and improve UX"
```

---

## Task 6: Review All Frontend Pages for Bugs

**Files to review:**
- `src/app/(public)/profil/*.tsx`
- `src/app/(public)/akademik/*.tsx`
- `src/app/(public)/berita/*.tsx`
- `src/app/(public)/galeri/*.tsx`
- `src/app/(public)/kontak/page.tsx`
- `src/app/(public)/ppdb/*.tsx`
- `src/app/(public)/agenda/*.tsx`
- `src/app/(public)/unduhan/page.tsx`

**Step 1: Test each page for errors**

Run dev server and visit each page:
- `/` - Homepage
- `/profil` - School profile
- `/profil/visi-misi`
- `/profil/sejarah`
- `/profil/struktur`
- `/profil/guru-staff`
- `/profil/fasilitas`
- `/profil/alumni`
- `/akademik` - Academic programs
- `/akademik/kurikulum`
- `/akademik/ekstrakurikuler`
- `/akademik/program-unggulan`
- `/akademik/prestasi`
- `/berita` - News list
- `/galeri` - Gallery
- `/kontak` - Contact
- `/ppdb` - PPDB info
- `/ppdb/daftar` - PPDB registration form
- `/agenda` - Events
- `/unduhan` - Downloads

**Step 2: Document any errors found**

**Step 3: Fix errors and commit**

---

## Task 7: Review All Backend Pages for Bugs

**Files to review:**
- All files in `src/app/(admin)/admin/*/page.tsx`

**Step 1: Test each admin page**

Login to admin and visit:
- `/admin` - Dashboard
- `/admin/posts` - Blog posts
- `/admin/pages` - CMS pages
- `/admin/media` - Media library
- `/admin/staff` - Staff management
- `/admin/galleries` - Gallery management
- `/admin/ppdb` - PPDB periods
- `/admin/ppdb/registrations` - PPDB registrations
- `/admin/events` - Events
- `/admin/programs` - Programs
- `/admin/facilities` - Facilities
- `/admin/achievements` - Achievements
- `/admin/testimonials` - Testimonials
- `/admin/alumni` - Alumni
- `/admin/downloads` - Downloads
- `/admin/announcements` - Announcements
- `/admin/grade-levels` - Grade levels
- `/admin/menus` - Menu manager
- `/admin/messages` - Contact messages
- `/admin/users` - User management
- `/admin/school-profile` - School profile
- `/admin/settings` - Settings

**Step 2: Document any errors found**

**Step 3: Fix errors and commit**

---

## Task 8: Final Build & Deployment Test

**Step 1: Run production build locally**

```bash
npm run build
```

Fix any build errors.

**Step 2: Run production server locally**

```bash
npm run start
```

Test all critical paths.

**Step 3: Commit all fixes**

```bash
git add .
git commit -m "fix: resolve all build errors for production"
```

**Step 4: Push and verify Vercel deployment**

```bash
git push
```

Check Vercel dashboard for deployment status.

---

## Execution Checklist

- [ ] Task 1: Fix Header Navigation Dropdown
- [ ] Task 2: Fix Language Implementation
- [ ] Task 3: Verify Grade Levels Section
- [ ] Task 4: Fix Media Upload for Vercel
- [ ] Task 5: Enhance Menu Manager UX
- [ ] Task 6: Review All Frontend Pages
- [ ] Task 7: Review All Backend Pages
- [ ] Task 8: Final Build & Deployment Test
