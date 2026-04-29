-- Add missing performance indexes to database
-- Run this via: npx prisma db execute --file prisma/migrations/add_indexes.sql

-- GalleryItem indexes
CREATE INDEX IF NOT EXISTS "gallery_items_galleryId_idx" ON "gallery_items"("galleryId");
CREATE INDEX IF NOT EXISTS "gallery_items_order_idx" ON "gallery_items"("order");

-- MenuItem indexes
CREATE INDEX IF NOT EXISTS "menu_items_menuId_idx" ON "menu_items"("menuId");
CREATE INDEX IF NOT EXISTS "menu_items_parentId_idx" ON "menu_items"("parentId");

-- Download indexes
CREATE INDEX IF NOT EXISTS "downloads_isPublished_idx" ON "downloads"("isPublished");
CREATE INDEX IF NOT EXISTS "downloads_category_idx" ON "downloads"("category");

-- Announcement indexes
CREATE INDEX IF NOT EXISTS "announcements_isActive_idx" ON "announcements"("isActive");

-- Alumni indexes
CREATE INDEX IF NOT EXISTS "alumni_isPublished_idx" ON "alumni"("isPublished");
CREATE INDEX IF NOT EXISTS "alumni_graduationYear_idx" ON "alumni"("graduationYear");

-- Testimonial indexes
CREATE INDEX IF NOT EXISTS "testimonials_isPublished_idx" ON "testimonials"("isPublished");

-- PPDBPeriod indexes
CREATE INDEX IF NOT EXISTS "ppdb_periods_isActive_idx" ON "ppdb_periods"("isActive");

-- Facility indexes
CREATE INDEX IF NOT EXISTS "facilities_isPublished_idx" ON "facilities"("isPublished");

-- Program indexes
CREATE INDEX IF NOT EXISTS "programs_isActive_type_idx" ON "programs"("isActive", "type");
