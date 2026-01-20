# Frontend Polish & Experience Upgrade Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Elevate the frontend experience from "Functional" to "Premium" by implementing advanced performance optimizations, micro-interactions, accessibility features, and UX refinements across the entire application.

**Architecture:** 
- **Animations:** Use `framer-motion` for complex page transitions and scroll effects.
- **Loading:** Implement specialized Skeleton components matching exact UI layouts.
- **Accessibility:** Enforce semantic HTML and focus management.
- **State Management:** Use `use-debounce` and local storage for form persistence.

**Tech Stack:** Next.js 15 (App Router), Tailwind CSS, Framer Motion, Lucide React, Radix UI.

---

## Phase 1: Visual Polish & Animations (The "Wow" Factor)

### Task 1: Scroll Animations (AOS/Framer)
**Goal:** Make the landing page elements fade/slide in as the user scrolls.
**Files:**
- Create: `src/components/ui/scroll-animation.tsx` (Wrapper component)
- Modify: `src/app/(public)/page.tsx` (Apply wrapper to sections)

**Step 1: Create ScrollAnimation Component**
```tsx
"use client";
import { motion } from "framer-motion";

export function ScrollAnimation({ children, className }: { children: React.ReactNode, className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.5 }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
```

**Step 2: Apply to Homepage**
- Wrap Hero section, Features grid, and Stats cards with `<ScrollAnimation>`.

### Task 2: Page Transitions
**Goal:** Smooth transition between routes.
**Files:**
- Create: `src/app/template.tsx` (Use Next.js template for transitions)

**Step 1: Create Template**
```tsx
"use client";
import { motion } from "framer-motion";

export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ ease: "easeInOut", duration: 0.4 }}
    >
      {children}
    </motion.div>
  );
}
```

---

## Phase 2: Performance & Loading (The "Speed" Factor)

### Task 3: Skeleton UI System
**Goal:** Eliminate layout shift and generic spinners.
**Files:**
- Create: `src/components/skeletons/news-card-skeleton.tsx`
- Create: `src/components/skeletons/gallery-skeleton.tsx`
- Modify: `src/app/(public)/berita/loading.tsx`
- Modify: `src/app/(public)/galeri/loading.tsx`

**Step 1: Create Skeletons**
- Use `src/components/ui/skeleton.tsx` (shadcn) to mimic the exact layout of a News Card (Image area, Title bar, Date, Excerpt).

**Step 2: Implement Loading Pages**
- Create `loading.tsx` files that render a grid of these skeletons.

### Task 4: Image Optimization (Blurhash/Placeholder)
**Goal:** Prevent white flash on image load.
**Files:**
- Modify: `src/components/ui/image-with-fallback.tsx` (or create if generic `Image` is used)

**Step 1: Create Wrapper**
- Create a wrapper around `next/image` that handles `placeholder="blur"` logic (even a generic gray blur is better than white).

---

## Phase 3: Accessibility & Semantics (The "Trust" Factor)

### Task 5: Semantic HTML Audit
**Goal:** Ensure better SEO and Screen Reader support.
**Files:**
- Modify: `src/components/admin/posts/post-card.tsx` (if exists) or public news lists.

**Step 1: Refactor Cards**
- Change `div` wrappers to `<article>`.
- Change dates to `<time datetime="...">`.

### Task 6: Skip-Link & Focus Management
**Goal:** Keyboard navigation efficiency.
**Files:**
- Modify: `src/app/layout.tsx` or `src/components/public/header.tsx`

**Step 1: Add Skip Link**
- Ensure `<a href="#main-content" ...>` exists and is the very first element in `body`.
- Ensure `<main id="main-content">` exists on all pages.

---

## Phase 4: Form Experience (The "Utility" Factor)

### Task 7: Real-time Feedback
**Goal:** Instant validation for inputs.
**Files:**
- Modify: `src/components/public/contact-form.tsx` (or similar)

**Step 1: Zod Integration**
- Ensure `react-hook-form` mode is set to `onChange` or `onBlur` to show errors immediately, not just on submit.

### Task 8: Auto-Save Draft (Local Storage)
**Goal:** Prevent data loss.
**Files:**
- Modify: `src/components/public/ppdb-form.tsx` (if complex)

**Step 1: Hook Implementation**
- Use a hook like `useLocalStorage` to sync form state.
- Restore state on mount.

---

## Phase 5: Dark Mode Polish

### Task 9: Dark Mode Asset Handling
**Goal:** Reduce eye strain.
**Files:**
- Modify: `src/app/globals.css`

**Step 1: Image Filter**
```css
.dark img {
  filter: brightness(0.8) contrast(1.2);
}
```

**Step 2: Border Contrast**
- Verify `border-border` color in dark mode (oklch) provides enough separation.

---

## Execution Strategy

1.  **Dependencies:** Install `framer-motion` first.
2.  **Order:** Visuals -> Performance -> A11y -> UX.
3.  **Verification:** Test each change on Mobile + Desktop + Dark Mode.

Ready to execute?
