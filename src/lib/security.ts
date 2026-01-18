import { headers } from "next/headers";

// =============================================================================
// RATE LIMITING
// =============================================================================

// In-memory rate limiting store (for development/single-instance deployments)
// For production with multiple instances, use Redis (@upstash/ratelimit + @vercel/kv)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

interface RateLimitConfig {
  maxRequests: number;  // Maximum requests allowed
  windowMs: number;     // Time window in milliseconds
}

interface RateLimitResult {
  success: boolean;
  remaining: number;
  resetIn: number;  // Seconds until reset
}

/**
 * Simple in-memory rate limiter
 * For production, replace with @upstash/ratelimit + @vercel/kv
 */
export async function rateLimit(
  key: string,
  config: RateLimitConfig = { maxRequests: 5, windowMs: 60000 }
): Promise<RateLimitResult> {
  const now = Date.now();
  const record = rateLimitStore.get(key);

  // Clean up expired entries periodically
  if (Math.random() < 0.01) {
    for (const [k, v] of rateLimitStore.entries()) {
      if (now > v.resetTime) {
        rateLimitStore.delete(k);
      }
    }
  }

  if (!record || now > record.resetTime) {
    // First request or window expired
    rateLimitStore.set(key, {
      count: 1,
      resetTime: now + config.windowMs,
    });
    return {
      success: true,
      remaining: config.maxRequests - 1,
      resetIn: Math.ceil(config.windowMs / 1000),
    };
  }

  if (record.count >= config.maxRequests) {
    // Rate limit exceeded
    return {
      success: false,
      remaining: 0,
      resetIn: Math.ceil((record.resetTime - now) / 1000),
    };
  }

  // Increment counter
  record.count++;
  return {
    success: true,
    remaining: config.maxRequests - record.count,
    resetIn: Math.ceil((record.resetTime - now) / 1000),
  };
}

/**
 * Get client IP address from request headers
 */
export async function getClientIp(): Promise<string> {
  const headersList = await headers();
  
  // Check various headers for the real IP
  const forwardedFor = headersList.get("x-forwarded-for");
  if (forwardedFor) {
    // x-forwarded-for can contain multiple IPs, get the first one
    return forwardedFor.split(",")[0].trim();
  }

  const realIp = headersList.get("x-real-ip");
  if (realIp) {
    return realIp;
  }

  // Fallback for local development
  return "127.0.0.1";
}

/**
 * Rate limit by IP address
 */
export async function rateLimitByIp(
  action: string,
  config?: RateLimitConfig
): Promise<RateLimitResult> {
  const ip = await getClientIp();
  const key = `${action}:${ip}`;
  return rateLimit(key, config);
}

// =============================================================================
// FILE UPLOAD VALIDATION
// =============================================================================

// Allowed file types with their MIME types and extensions
export const ALLOWED_FILE_TYPES = {
  image: {
    mimeTypes: ["image/jpeg", "image/png", "image/gif", "image/webp", "image/svg+xml"],
    extensions: [".jpg", ".jpeg", ".png", ".gif", ".webp", ".svg"],
  },
  video: {
    mimeTypes: ["video/mp4", "video/webm", "video/ogg", "video/quicktime"],
    extensions: [".mp4", ".webm", ".ogv", ".mov"],
  },
  audio: {
    mimeTypes: ["audio/mpeg", "audio/wav", "audio/ogg", "audio/mp4"],
    extensions: [".mp3", ".wav", ".ogg", ".m4a"],
  },
  document: {
    mimeTypes: [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "application/vnd.ms-powerpoint",
      "application/vnd.openxmlformats-officedocument.presentationml.presentation",
      "text/plain",
    ],
    extensions: [".pdf", ".doc", ".docx", ".xls", ".xlsx", ".ppt", ".pptx", ".txt"],
  },
} as const;

// Get all allowed MIME types
export const ALL_ALLOWED_MIME_TYPES = [
  ...ALLOWED_FILE_TYPES.image.mimeTypes,
  ...ALLOWED_FILE_TYPES.video.mimeTypes,
  ...ALLOWED_FILE_TYPES.audio.mimeTypes,
  ...ALLOWED_FILE_TYPES.document.mimeTypes,
];

// Get all allowed extensions
export const ALL_ALLOWED_EXTENSIONS = [
  ...ALLOWED_FILE_TYPES.image.extensions,
  ...ALLOWED_FILE_TYPES.video.extensions,
  ...ALLOWED_FILE_TYPES.audio.extensions,
  ...ALLOWED_FILE_TYPES.document.extensions,
];

interface FileValidationResult {
  valid: boolean;
  error?: string;
  fileType?: "image" | "video" | "audio" | "document" | "other";
}

/**
 * Validate file for upload
 */
export function validateFile(
  file: File,
  options: {
    maxSizeMB?: number;
    allowedTypes?: ("image" | "video" | "audio" | "document")[];
  } = {}
): FileValidationResult {
  const { maxSizeMB = 10, allowedTypes = ["image", "video", "audio", "document"] } = options;

  // Check file size
  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  if (file.size > maxSizeBytes) {
    return {
      valid: false,
      error: `Ukuran file maksimal ${maxSizeMB}MB`,
    };
  }

  // Get file extension
  const fileName = file.name.toLowerCase();
  const lastDotIndex = fileName.lastIndexOf(".");
  const extension = lastDotIndex !== -1 ? fileName.substring(lastDotIndex) : "";

  // Determine file type from MIME type
  let detectedType: "image" | "video" | "audio" | "document" | "other" = "other";
  
  for (const [type, config] of Object.entries(ALLOWED_FILE_TYPES)) {
    if (config.mimeTypes.includes(file.type as never)) {
      detectedType = type as "image" | "video" | "audio" | "document";
      break;
    }
  }

  // Check if type is allowed
  if (detectedType === "other" || !allowedTypes.includes(detectedType)) {
    return {
      valid: false,
      error: "Tipe file tidak diizinkan",
    };
  }

  // Validate extension matches MIME type
  const typeConfig = ALLOWED_FILE_TYPES[detectedType];
  if (!typeConfig.extensions.includes(extension as never)) {
    return {
      valid: false,
      error: "Ekstensi file tidak valid untuk tipe ini",
    };
  }

  // Additional security: check for double extensions (e.g., file.jpg.exe)
  const parts = fileName.split(".");
  if (parts.length > 2) {
    // Check if any middle part is an executable extension
    const dangerousExtensions = [".exe", ".bat", ".cmd", ".sh", ".ps1", ".msi", ".dll", ".js", ".vbs"];
    for (let i = 1; i < parts.length - 1; i++) {
      if (dangerousExtensions.includes(`.${parts[i]}`)) {
        return {
          valid: false,
          error: "Nama file tidak valid",
        };
      }
    }
  }

  return {
    valid: true,
    fileType: detectedType,
  };
}

// =============================================================================
// INPUT SANITIZATION
// =============================================================================

/**
 * Sanitize text input by removing potentially dangerous characters
 * Use this for plain text that should not contain HTML
 */
export function sanitizeText(input: string): string {
  if (typeof input !== "string") return "";
  
  return input
    // Remove null bytes
    .replace(/\0/g, "")
    // Encode HTML entities
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;")
    // Remove control characters except newlines and tabs
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, "")
    .trim();
}

/**
 * Strip all HTML tags from input
 * Use this when you need plain text without any HTML
 */
export function stripHtmlTags(input: string): string {
  if (typeof input !== "string") return "";
  
  return input
    // Remove HTML tags
    .replace(/<[^>]*>/g, "")
    // Decode common entities
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#x27;/g, "'")
    // Remove null bytes and control characters
    .replace(/\0/g, "")
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, "")
    .trim();
}

/**
 * Sanitize URL input
 */
export function sanitizeUrl(url: string): string {
  if (typeof url !== "string") return "";
  
  const trimmed = url.trim();
  
  // Only allow http, https, mailto, and tel protocols
  const allowedProtocols = ["http://", "https://", "mailto:", "tel:", "/"];
  const isAllowed = allowedProtocols.some(protocol => 
    trimmed.toLowerCase().startsWith(protocol)
  );
  
  if (!isAllowed && trimmed.includes(":")) {
    // Block javascript:, data:, and other potentially dangerous protocols
    return "";
  }
  
  return trimmed;
}

/**
 * Validate and sanitize email
 */
export function sanitizeEmail(email: string): string {
  if (typeof email !== "string") return "";
  
  const trimmed = email.trim().toLowerCase();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
  if (!emailRegex.test(trimmed)) {
    return "";
  }
  
  return trimmed;
}

/**
 * Sanitize phone number (keep only digits and common characters)
 */
export function sanitizePhone(phone: string): string {
  if (typeof phone !== "string") return "";
  
  // Keep only digits, +, -, (, ), and spaces
  return phone.replace(/[^\d+\-() ]/g, "").trim();
}

/**
 * Validate Google Analytics ID format
 * Accepts GA4 (G-XXXXXXXXXX) or Universal Analytics (UA-XXXXXXXX-X)
 */
export function validateGoogleAnalyticsId(id: string): boolean {
  if (typeof id !== "string") return false;
  
  const trimmed = id.trim();
  
  // GA4 format: G-XXXXXXXXXX (10+ alphanumeric after G-)
  const ga4Regex = /^G-[A-Z0-9]{10,}$/i;
  
  // Universal Analytics format: UA-XXXXXXXX-X
  const uaRegex = /^UA-\d{4,10}-\d{1,4}$/i;
  
  return ga4Regex.test(trimmed) || uaRegex.test(trimmed);
}

/**
 * Sanitize CSS input to prevent CSS injection attacks
 * Removes potentially dangerous CSS properties and values
 */
export function sanitizeCss(css: string): string {
  if (typeof css !== "string") return "";
  
  // Remove null bytes
  let sanitized = css.replace(/\0/g, "");
  
  // Remove JavaScript expressions
  sanitized = sanitized.replace(/expression\s*\(/gi, "");
  sanitized = sanitized.replace(/javascript\s*:/gi, "");
  
  // Remove behavior property (IE-specific, can execute HTC files)
  sanitized = sanitized.replace(/behavior\s*:/gi, "");
  
  // Remove -moz-binding (Firefox-specific, can execute XBL)
  sanitized = sanitized.replace(/-moz-binding\s*:/gi, "");
  
  // Remove @import to prevent loading external stylesheets
  sanitized = sanitized.replace(/@import\s+/gi, "/* @import blocked */ ");
  
  // Remove data: URIs in url() to prevent data exfiltration
  sanitized = sanitized.replace(/url\s*\(\s*["']?\s*data:/gi, "url(/* data: blocked */");
  
  // Remove javascript: URIs in url()
  sanitized = sanitized.replace(/url\s*\(\s*["']?\s*javascript:/gi, "url(/* javascript: blocked */");
  
  // Remove HTML comments that could hide malicious content
  sanitized = sanitized.replace(/<!--[\s\S]*?-->/g, "");
  
  // Remove </style> tags that could break out of the style element
  sanitized = sanitized.replace(/<\s*\/?\s*style\s*>/gi, "");
  
  // Remove any remaining < or > that could be used for HTML injection
  sanitized = sanitized.replace(/</g, "");
  sanitized = sanitized.replace(/>/g, "");
  
  return sanitized.trim();
}
