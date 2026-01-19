# Frontend Audit Report
**Date:** January 19, 2026
**Scope:** `src/` directory (app, components, lib)
**Focus:** Colors, Spacing, Typography, Responsiveness

## 1. Color Audit
**Objective:** Identify hardcoded hex codes replacing Tailwind variables.

**Findings:**
- **Admin Pages & Components:** Widespread use of hardcoded fallbacks (e.g., `#3B82F6` for blue, `#10B981` for green) in dynamic style attributes.
- **Theme Configuration:** `theme-styles.tsx` and `site-config.ts` rely on hex codes for default theme values.
- **Specific Instances:**
    - `src/app/(admin)/admin/page.tsx`: `style={{ backgroundColor: post.category.color || "#3B82F6" }}`
    - `src/components/admin/settings/settings-tabs.tsx`: Multiple instances of `#3B82F6`, `#10B981`, `#8B5CF6`, `#EC4899`, etc.
    - `src/components/theme-styles.tsx`: Default fallbacks.
    - `src/app/(public)/berita/[slug]/page.tsx`: `style={{ backgroundColor: ... || "#3B82F6" }}`

**Recommendation:**
- Replace hardcoded defaults with Tailwind CSS variables (e.g., `var(--primary)`, `colors.blue.500`) where possible.
- If dynamic colors are necessary (user-defined), ensure the fallback comes from a central config or CSS variable rather than scattered strings.

## 2. Spacing Audit
**Objective:** Identify arbitrary values violating the 8px grid system.

**Findings:**
- **Arbitrary Widths & Heights:**
    - `src/app/(public)/page.tsx`: `min-h-[90vh]`, `w-[800px]`, `h-[800px]`, `h-[300px]`.
    - `src/components/admin/alumni/alumni-table.tsx`: `w-[60px]`, `w-[70px]`.
    - `src/components/admin/posts/posts-filter.tsx`: `w-[180px]`, `w-[150px]`.
- **Arbitrary Positioning:**
    - `src/components/admin/menus/menu-manager.tsx`: `left-[-12px]`, `top-[20px]`.
    - `src/app/(public)/page.tsx`: `bg-[size:60px_60px]`.
- **Arbitrary Padding/Margin:**
    - `src/components/ui/tabs.tsx`: `p-[3px]`.
    - `src/components/ui/checkbox.tsx`: `rounded-[4px]`.

**Recommendation:**
- Refactor `w-[...]` and `h-[...]` to closest Tailwind spacing tokens (e.g., `w-96`, `h-64`).
- Use `layout.css` or `tailwind.config.ts` to extend spacing if specific sizes are repeatedly needed.
- Review `min-h-[...]` usage for responsiveness.

## 3. Typography Audit
**Objective:** Identify inconsistent font sizes or weights.

**Findings:**
- **Arbitrary Font Sizes:**
    - `src/components/admin/dashboard/recent-registrations.tsx`: `text-[10px]` inside Badges.
    - `src/components/ui/calendar.tsx`: `text-[0.8rem]`.
    - `src/components/admin/menus/menu-manager.tsx`: `text-[10px]`.
- **Inconsistent Scales:**
    - `src/app/(public)/page.tsx` uses standard `text-4xl`, `text-lg` (Good).
    - `src/components/ui/badge.tsx` uses `text-xs`.
    - Some admin tables use mixed small sizes without a clear system.

**Recommendation:**
- Standardize small text usage. Use `text-xs` (12px) or `text-sm` (14px). Avoid `10px` unless absolutely necessary for dense UI, and if so, create a utility class like `text-xxs`.

## 4. Responsive Audit
**Objective:** Identify components lacking responsive classes.

**Findings:**
- **Fixed Dimensions:**
    - `src/components/admin/posts/posts-table.tsx`: `w-[400px]` on a table head might cause overflow on mobile.
    - `src/app/(public)/page.tsx`: `w-[800px] h-[800px]` decorative blobs are absolute and might affect scroll or layout on small screens if not carefully handled (though they have `overflow-hidden` container).
    - `src/components/page-builder/block-editor.tsx`: `min-h-[100px]`.
- **Sidebar & Layouts:**
    - `src/components/ui/sidebar.tsx`: Uses complex `w-[--sidebar-width]` calculations which are generally robust but dependent on CSS variables being set correctly on mobile.
    - `src/components/public/header.tsx`: `min-w-[40px]` fixed constraints.

**Recommendation:**
- Replace fixed pixel widths in tables with `min-w-[...]` or percentage-based widths where appropriate, or ensure horizontal scrolling is enabled (which `Table` component usually handles).
- Ensure decorative absolute elements in `page.tsx` are hidden or resized on mobile (`hidden md:block` or similar).

## Summary Table

| Category | Issue Count (Approx) | Top Offender Files |
| :--- | :--- | :--- |
| **Colors** | 30+ | `settings-tabs.tsx`, `theme-styles.tsx` |
| **Spacing** | 50+ | `page.tsx`, `alumni-table.tsx`, `sidebar.tsx` |
| **Typography** | 10+ | `recent-registrations.tsx`, `calendar.tsx` |
| **Responsive** | 15+ | `posts-table.tsx`, `page.tsx` |

