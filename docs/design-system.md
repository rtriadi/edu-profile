---
File: `docs/design-system.md`
---
# EduProfile Design System

## 1. Overview

EduProfile uses a modern, clean, and accessible design system built on top of **Tailwind CSS** and **shadcn/ui**. The system supports both light and dark modes out of the box using CSS variables and the `oklch` color space for consistent perceptual brightness.

### Principles
- **Clarity**: High contrast, legible typography (Geist), and clear hierarchy.
- **Accessibility**: Focus states, sufficient color contrast, and semantic HTML.
- **Responsiveness**: Mobile-first layouts using standard breakpoints.
- **Efficiency**: Reusable components and utility-first styling.

---

## 2. Foundations

### Colors

Colors are defined as CSS variables in `src/app/globals.css` and mapped to Tailwind utility classes. We use `oklch` values for dynamic range.

#### Core Palette
| Token | Class | Usage |
|-------|-------|-------|
| **Primary** | `bg-primary` `text-primary-foreground` | Main actions, active states, brand highlights. |
| **Secondary** | `bg-secondary` `text-secondary-foreground` | Less prominent actions, backgrounds. |
| **Background** | `bg-background` | Page background. |
| **Foreground** | `text-foreground` | Base text color. |
| **Muted** | `bg-muted` `text-muted-foreground` | Subtitles, disabled states, skeletons. |
| **Accent** | `bg-accent` `text-accent-foreground` | Hover states, selected items. |
| **Destructive** | `bg-destructive` `text-destructive-foreground` | Error states, delete actions. |

#### Borders & Inputs
- **Border**: `border-border` - Default borders for cards, inputs.
- **Input**: `border-input` - Specific border color for form controls.
- **Ring**: `ring-ring` - Focus outlines.

### Typography

We use the **Geist** font family for a modern, digital-native feel.

- **Sans**: `font-sans` (Geist Sans) - UI text, headings, body.
- **Mono**: `font-mono` (Geist Mono) - Code snippets, technical data.

#### Scale (Tailwind Default)
- `text-xs`: 12px
- `text-sm`: 14px (Base UI size)
- `text-base`: 16px (Body text)
- `text-lg`: 18px
- `text-xl`: 20px
- `text-2xl`: 24px

### Radius & Shadows

- **Base Radius**: `0.625rem` (10px) - Defined as `--radius`.
- **Buttons/Inputs**: `rounded-md`.
- **Cards/Dialogs**: `rounded-xl`.
- **Shadows**: Tailwind defaults (`shadow-sm`, `shadow-md`).

---

## 3. Components

We use a component library located in `src/components/ui`. These are built with Radix UI primitives and styled with Tailwind.

### Button (`src/components/ui/button.tsx`)

Primary interaction element.

**Variants:**
- `default`: Primary action (Solid background).
- `secondary`: Secondary action (Muted background).
- `outline`: Bordered, transparent background.
- `ghost`: Transparent, hover background only.
- `destructive`: For dangerous actions (Delete).
- `link`: Looks like a text link.

**Sizes:** `default`, `sm`, `lg`, `icon`.

```tsx
import { Button } from "@/components/ui/button"

<Button variant="default" size="sm">Save Changes</Button>
<Button variant="ghost" size="icon"><MenuIcon /></Button>
```

### Input (`src/components/ui/input.tsx`)

Standard text field.

```tsx
import { Input } from "@/components/ui/input"

<Input type="email" placeholder="Email" />
```

### Card (`src/components/ui/card.tsx`)

Container for content grouping. Composed of sub-components.

```tsx
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"

<Card>
  <CardHeader>
    <CardTitle>Profile</CardTitle>
  </CardHeader>
  <CardContent>
    <p>User details here...</p>
  </CardContent>
</Card>
```

### Badge (`src/components/ui/badge.tsx`)

Status indicators and labels.

**Variants:**
- `default`: Primary color.
- `secondary`: Muted color.
- `outline`: Border only.
- `destructive`: Error/Danger state.

```tsx
import { Badge } from "@/components/ui/badge"

<Badge variant="secondary">Draft</Badge>
```

### Dialog (`src/components/ui/dialog.tsx`)

Modal windows for focused tasks.

```tsx
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"

<Dialog>
  <DialogTrigger>Open</DialogTrigger>
  <DialogContent>
    <h2>Modal Content</h2>
  </DialogContent>
</Dialog>
```

---

## 4. Patterns & Animations

### Animations (`src/app/globals.css`)

Custom keyframe animations are available for smooth transitions.

- `.animate-fade-in`: Simple fade in.
- `.animate-fade-in-up` / `.animate-fade-in-down`: Fade in with vertical movement.
- `.animate-scale-in`: Zoom in effect.
- `.animate-shimmer`: Loading skeleton effect.
- `.animate-float`: Continuous floating motion.

### Layouts

- **Admin Layout**: Sidebar navigation (`src/components/ui/sidebar.tsx`) with a top header.
- **Public Layout**: Top navigation bar with content container.
- **Container**: `container mx-auto px-4` is the standard wrapper for page content.

### Utility Classes (`src/lib/utils.ts`)

- **`cn(...)`**: Combines Tailwind classes conditionally (merges `clsx` and `tailwind-merge`). Always use this for `className` props.
- **`formatDate` / `formatRelativeTime`**: Standard date formatting.
- **`formatFileSize`**: Human-readable file sizes.

---

## 5. Usage for AI Tools

When generating code for this repository:

1.  **Strictly use shadcn/ui components**: Do not use raw HTML `<button>` or `<input>` if a UI component exists.
2.  **Use `cn()` for classes**: Always wrap dynamic class names in `cn()`.
3.  **Respect CSS Variables**: Use `bg-primary`, `bg-muted`, etc., instead of hardcoded hex values or arbitrary Tailwind colors like `bg-blue-500`.
4.  **Icons**: Use **Lucide React** icons (`import { IconName } from "lucide-react"`).
5.  **Typography**: Use standard text classes (`text-sm text-muted-foreground`) for secondary text.
6.  **Responsive Design**: Always include mobile (`base`) and desktop (`md:` or `lg:`) styles for layout components.
