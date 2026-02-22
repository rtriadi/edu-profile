# Changelog

## 2026-02-22
- Preserve default theme CSS variables when settings fetch fails in `src/components/theme-styles.tsx`.
- Validate hex color inputs with fallback defaults in `src/components/theme-styles.tsx`.
- Restore Prisma client logging based on environment in `src/lib/prisma.ts`.
- Force dynamic rendering for root layout to avoid build-time DB access in `src/app/layout.tsx`.
- Simplify `ScrollAnimation` initial render to avoid hydration mismatch in `src/components/ui/scroll-animation.tsx`.
