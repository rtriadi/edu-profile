import { Role, Status, SchoolLevel, ProgramType, GalleryType, EventType, PPDBStatus, Gender } from "@prisma/client";

// Re-export Prisma enums
export { Role, Status, SchoolLevel, ProgramType, GalleryType, EventType, PPDBStatus, Gender };

// ==========================================
// USER TYPES
// ==========================================

export interface UserSession {
  id: string;
  name: string;
  email: string;
  image?: string | null;
  role: Role;
}

export interface UserWithoutPassword {
  id: string;
  name: string;
  email: string;
  image?: string | null;
  role: Role;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// ==========================================
// PAGE BUILDER TYPES
// ==========================================

export type BlockType =
  // Content blocks
  | "heading"
  | "paragraph"
  | "image"
  | "gallery"
  | "video"
  | "quote"
  | "list"
  | "table"
  | "divider"
  | "code"
  | "file"
  // Layout blocks
  | "columns"
  | "accordion"
  | "tabs"
  | "callout"
  | "card"
  | "spacer"
  // School-specific blocks
  | "staff-grid"
  | "news-list"
  | "event-calendar"
  | "gallery-embed"
  | "download-list"
  | "testimonial-slider"
  | "contact-form"
  | "google-map"
  | "stats-counter"
  | "timeline"
  | "program-cards"
  | "facility-showcase"
  | "achievement-list"
  | "hero"
  | "cta";

export interface Block {
  id: string;
  type: BlockType;
  data: Record<string, unknown>;
  children?: Block[];
}

export interface HeadingBlockData {
  level: 1 | 2 | 3 | 4 | 5 | 6;
  text: string;
  align?: "left" | "center" | "right";
}

export interface ParagraphBlockData {
  text: string;
  align?: "left" | "center" | "right" | "justify";
}

export interface ImageBlockData {
  src: string;
  alt?: string;
  caption?: string;
  width?: number;
  height?: number;
  align?: "left" | "center" | "right" | "full";
}

export interface VideoBlockData {
  src: string;
  type: "youtube" | "vimeo" | "file";
  caption?: string;
  autoplay?: boolean;
}

export interface QuoteBlockData {
  text: string;
  author?: string;
  source?: string;
}

export interface ListBlockData {
  type: "ordered" | "unordered";
  items: string[];
}

export interface CalloutBlockData {
  type: "info" | "warning" | "success" | "error" | "tip";
  title?: string;
  text: string;
}

export interface ColumnsBlockData {
  columns: 2 | 3 | 4;
  gap?: "sm" | "md" | "lg";
}

export interface SpacerBlockData {
  height: "sm" | "md" | "lg" | "xl";
}

export interface HeroBlockData {
  title: string;
  subtitle?: string;
  backgroundImage?: string;
  backgroundOverlay?: boolean;
  ctaText?: string;
  ctaLink?: string;
  align?: "left" | "center" | "right";
}

export interface StatsCounterBlockData {
  items: Array<{
    value: number;
    label: string;
    prefix?: string;
    suffix?: string;
  }>;
}

export interface TimelineBlockData {
  items: Array<{
    year: string;
    title: string;
    description?: string;
  }>;
}

// ==========================================
// API RESPONSE TYPES
// ==========================================

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// ==========================================
// FORM TYPES
// ==========================================

export interface LoginFormData {
  email: string;
  password: string;
}

export interface ContactFormData {
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  message: string;
}

export interface PPDBFormData {
  studentName: string;
  nisn?: string;
  birthPlace: string;
  birthDate: Date;
  gender: Gender;
  religion?: string;
  address: string;
  previousSchool?: string;
  fatherName?: string;
  fatherJob?: string;
  fatherPhone?: string;
  motherName?: string;
  motherJob?: string;
  motherPhone?: string;
  guardianName?: string;
  guardianPhone?: string;
  guardianEmail?: string;
}

// ==========================================
// NAVIGATION TYPES
// ==========================================

export interface NavItem {
  id: string;
  label: string;
  url?: string;
  pageSlug?: string;
  icon?: string;
  children?: NavItem[];
  isVisible: boolean;
  openNew: boolean;
}

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

// ==========================================
// THEME TYPES
// ==========================================

export interface ThemeConfig {
  name: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    foreground: string;
    muted: string;
  };
  fonts: {
    heading: string;
    body: string;
  };
  layout: {
    headerStyle: "default" | "centered" | "minimal" | "transparent";
    footerStyle: "default" | "minimal" | "expanded";
    containerWidth: "sm" | "md" | "lg" | "xl" | "full";
  };
  components: {
    buttonStyle: "rounded" | "square" | "pill";
    cardStyle: "shadow" | "border" | "flat";
  };
}

// ==========================================
// SETTINGS TYPES
// ==========================================

export interface GeneralSettings {
  siteName: string;
  siteTagline?: string;
  siteLogo?: string;
  siteFavicon?: string;
  siteLanguage: "id" | "en";
  timezone: string;
}

export interface SEOSettings {
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string;
  ogImage?: string;
  googleAnalyticsId?: string;
  googleSiteVerification?: string;
}

export interface EmailSettings {
  smtpHost?: string;
  smtpPort?: number;
  smtpUser?: string;
  smtpPassword?: string;
  fromEmail?: string;
  fromName?: string;
}

export interface SocialMediaSettings {
  facebook?: string;
  instagram?: string;
  youtube?: string;
  twitter?: string;
  tiktok?: string;
  linkedin?: string;
  whatsapp?: string;
}

// ==========================================
// DASHBOARD TYPES
// ==========================================

export interface DashboardStats {
  totalPosts: number;
  totalPages: number;
  totalStaff: number;
  totalGalleries: number;
  totalDownloads: number;
  totalMessages: number;
  unreadMessages: number;
  pendingPPDB: number;
  upcomingEvents: number;
  recentPosts: Array<{
    id: string;
    title: string;
    createdAt: Date;
    views: number;
  }>;
  popularPosts: Array<{
    id: string;
    title: string;
    views: number;
  }>;
}

// ==========================================
// FILTER & SEARCH TYPES
// ==========================================

export interface PostFilters {
  search?: string;
  categoryId?: string;
  status?: Status;
  authorId?: string;
  startDate?: Date;
  endDate?: Date;
}

export interface EventFilters {
  search?: string;
  type?: EventType;
  startDate?: Date;
  endDate?: Date;
  isPublished?: boolean;
}

export interface PPDBFilters {
  search?: string;
  periodId?: string;
  status?: PPDBStatus;
  startDate?: Date;
  endDate?: Date;
}

export interface SortOption {
  field: string;
  direction: "asc" | "desc";
}

export interface PaginationParams {
  page: number;
  limit: number;
  sort?: SortOption;
}
