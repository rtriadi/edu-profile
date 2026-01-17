import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import slugify from "slugify";
import { nanoid } from "nanoid";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Generate URL-friendly slug
export function generateSlug(text: string): string {
  return slugify(text, {
    lower: true,
    strict: true,
    locale: "id",
  });
}

// Generate unique ID
export function generateId(size: number = 10): string {
  return nanoid(size);
}

// Format date to Indonesian locale
export function formatDate(
  date: Date | string,
  options?: Intl.DateTimeFormatOptions
): string {
  const defaultOptions: Intl.DateTimeFormatOptions = {
    day: "numeric",
    month: "long",
    year: "numeric",
    ...options,
  };
  return new Date(date).toLocaleDateString("id-ID", defaultOptions);
}

// Format date with time
export function formatDateTime(date: Date | string): string {
  return new Date(date).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

// Format relative time (e.g., "2 hours ago")
export function formatRelativeTime(date: Date | string): string {
  const now = new Date();
  const past = new Date(date);
  const diffInSeconds = Math.floor((now.getTime() - past.getTime()) / 1000);

  if (diffInSeconds < 60) return "Baru saja";
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} menit lalu`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} jam lalu`;
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} hari lalu`;
  if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 604800)} minggu lalu`;
  
  return formatDate(date);
}

// Format file size
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}

// Format number with thousand separator
export function formatNumber(num: number): string {
  return new Intl.NumberFormat("id-ID").format(num);
}

// Truncate text with ellipsis
export function truncate(text: string, length: number): string {
  if (text.length <= length) return text;
  return text.slice(0, length).trim() + "...";
}

// Strip HTML tags from string
export function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, "");
}

// Get initials from name
export function getInitials(name: string): string {
  return name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

// Check if URL is external
export function isExternalUrl(url: string): boolean {
  return url.startsWith("http://") || url.startsWith("https://");
}

// Generate registration number for PPDB
export function generateRegistrationNo(prefix: string = "PPDB"): string {
  const year = new Date().getFullYear();
  const timestamp = Date.now().toString().slice(-6);
  const random = nanoid(4).toUpperCase();
  return `${prefix}${year}${timestamp}${random}`;
}

// Delay/sleep function
export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Safe JSON parse
export function safeJsonParse<T>(json: string, fallback: T): T {
  try {
    return JSON.parse(json);
  } catch {
    return fallback;
  }
}

// Get file extension from filename
export function getFileExtension(filename: string): string {
  return filename.slice(((filename.lastIndexOf(".") - 1) >>> 0) + 2);
}

// Check if file is image
export function isImageFile(filename: string): boolean {
  const ext = getFileExtension(filename).toLowerCase();
  return ["jpg", "jpeg", "png", "gif", "webp", "svg", "ico"].includes(ext);
}

// Check if file is video
export function isVideoFile(filename: string): boolean {
  const ext = getFileExtension(filename).toLowerCase();
  return ["mp4", "webm", "ogg", "mov", "avi"].includes(ext);
}

// Check if file is document
export function isDocumentFile(filename: string): boolean {
  const ext = getFileExtension(filename).toLowerCase();
  return ["pdf", "doc", "docx", "xls", "xlsx", "ppt", "pptx", "txt"].includes(ext);
}

// Get file type category
export function getFileType(filename: string): "image" | "video" | "document" | "audio" | "other" {
  if (isImageFile(filename)) return "image";
  if (isVideoFile(filename)) return "video";
  if (isDocumentFile(filename)) return "document";
  const ext = getFileExtension(filename).toLowerCase();
  if (["mp3", "wav", "ogg", "m4a"].includes(ext)) return "audio";
  return "other";
}

// Capitalize first letter
export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// Convert object to query string
export function objectToQueryString(obj: Record<string, unknown>): string {
  return Object.entries(obj)
    .filter(([, value]) => value !== undefined && value !== null && value !== "")
    .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`)
    .join("&");
}

// ==========================================
// TIMEZONE-AWARE DATE/TIME UTILITIES
// ==========================================

// Get locale code from language setting
export function getLocaleFromLanguage(language: string): string {
  const localeMap: Record<string, string> = {
    id: "id-ID",
    en: "en-US",
  };
  return localeMap[language] || "id-ID";
}

// Format date with timezone awareness
export function formatDateWithTimezone(
  date: Date | string,
  timezone: string = "Asia/Jakarta",
  language: string = "id",
  options?: Intl.DateTimeFormatOptions
): string {
  const locale = getLocaleFromLanguage(language);
  const defaultOptions: Intl.DateTimeFormatOptions = {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: timezone,
    ...options,
  };
  return new Date(date).toLocaleDateString(locale, defaultOptions);
}

// Format date with time and timezone awareness
export function formatDateTimeWithTimezone(
  date: Date | string,
  timezone: string = "Asia/Jakarta",
  language: string = "id"
): string {
  const locale = getLocaleFromLanguage(language);
  return new Date(date).toLocaleString(locale, {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: timezone,
  });
}

// Format time only with timezone
export function formatTimeWithTimezone(
  date: Date | string,
  timezone: string = "Asia/Jakarta",
  language: string = "id"
): string {
  const locale = getLocaleFromLanguage(language);
  return new Date(date).toLocaleTimeString(locale, {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: timezone,
  });
}

// Get current date/time in specific timezone
export function getCurrentDateTime(
  timezone: string = "Asia/Jakarta",
  language: string = "id"
): string {
  const locale = getLocaleFromLanguage(language);
  return new Date().toLocaleString(locale, {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    timeZone: timezone,
  });
}

// Get timezone display name
export function getTimezoneDisplayName(timezone: string): string {
  const timezoneNames: Record<string, string> = {
    "Asia/Jakarta": "WIB (Jakarta)",
    "Asia/Makassar": "WITA (Makassar)",
    "Asia/Jayapura": "WIT (Jayapura)",
  };
  return timezoneNames[timezone] || timezone;
}

// Format relative time with language support
export function formatRelativeTimeWithLanguage(
  date: Date | string,
  language: string = "id"
): string {
  const now = new Date();
  const past = new Date(date);
  const diffInSeconds = Math.floor((now.getTime() - past.getTime()) / 1000);

  if (language === "en") {
    if (diffInSeconds < 60) return "Just now";
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} days ago`;
    if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 604800)} weeks ago`;
    return formatDateWithTimezone(date, "Asia/Jakarta", language);
  }

  // Indonesian (default)
  if (diffInSeconds < 60) return "Baru saja";
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} menit lalu`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} jam lalu`;
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} hari lalu`;
  if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 604800)} minggu lalu`;
  
  return formatDateWithTimezone(date, "Asia/Jakarta", language);
}
