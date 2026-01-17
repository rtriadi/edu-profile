import { ZodError } from "zod";

// =============================================================================
// ERROR TYPES
// =============================================================================

/**
 * Custom application error with additional context
 */
export class AppError extends Error {
  public readonly code: string;
  public readonly statusCode: number;
  public readonly isOperational: boolean;

  constructor(
    message: string,
    code: string = "INTERNAL_ERROR",
    statusCode: number = 500,
    isOperational: boolean = true
  ) {
    super(message);
    this.code = code;
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    Object.setPrototypeOf(this, AppError.prototype);
  }
}

/**
 * Unauthorized access error
 */
export class UnauthorizedError extends AppError {
  constructor(message: string = "Anda tidak memiliki akses") {
    super(message, "UNAUTHORIZED", 401);
  }
}

/**
 * Not found error
 */
export class NotFoundError extends AppError {
  constructor(resource: string = "Resource") {
    super(`${resource} tidak ditemukan`, "NOT_FOUND", 404);
  }
}

/**
 * Validation error
 */
export class ValidationError extends AppError {
  public readonly errors: Record<string, string[]>;

  constructor(message: string = "Data tidak valid", errors: Record<string, string[]> = {}) {
    super(message, "VALIDATION_ERROR", 400);
    this.errors = errors;
  }
}

/**
 * Duplicate entry error
 */
export class DuplicateError extends AppError {
  constructor(field: string = "Data") {
    super(`${field} sudah digunakan`, "DUPLICATE", 409);
  }
}

/**
 * Rate limit exceeded error
 */
export class RateLimitError extends AppError {
  public readonly retryAfter: number;

  constructor(retryAfter: number = 60) {
    super(`Terlalu banyak permintaan. Coba lagi dalam ${retryAfter} detik.`, "RATE_LIMIT", 429);
    this.retryAfter = retryAfter;
  }
}

// =============================================================================
// ERROR HANDLER
// =============================================================================

interface ErrorResult {
  success: false;
  error: string;
  code?: string;
  errors?: Record<string, string[]>;
}

/**
 * Format error for API response
 */
export function formatError(error: unknown): ErrorResult {
  // Handle Zod validation errors
  if (error instanceof ZodError) {
    const fieldErrors: Record<string, string[]> = {};
    for (const issue of error.issues) {
      const path = issue.path.join(".");
      if (!fieldErrors[path]) {
        fieldErrors[path] = [];
      }
      fieldErrors[path].push(issue.message);
    }
    return {
      success: false,
      error: "Data tidak valid",
      code: "VALIDATION_ERROR",
      errors: fieldErrors,
    };
  }

  // Handle custom app errors
  if (error instanceof AppError) {
    const result: ErrorResult = {
      success: false,
      error: error.message,
      code: error.code,
    };
    if (error instanceof ValidationError) {
      result.errors = error.errors;
    }
    return result;
  }

  // Handle Prisma errors
  if (error && typeof error === "object" && "code" in error) {
    const prismaError = error as { code: string; meta?: { target?: string[] } };
    
    // Unique constraint violation
    if (prismaError.code === "P2002") {
      const field = prismaError.meta?.target?.[0] || "Data";
      return {
        success: false,
        error: `${field} sudah digunakan`,
        code: "DUPLICATE",
      };
    }
    
    // Record not found
    if (prismaError.code === "P2025") {
      return {
        success: false,
        error: "Data tidak ditemukan",
        code: "NOT_FOUND",
      };
    }
    
    // Foreign key constraint
    if (prismaError.code === "P2003") {
      return {
        success: false,
        error: "Data terkait tidak ditemukan",
        code: "FOREIGN_KEY_ERROR",
      };
    }
  }

  // Handle generic errors
  if (error instanceof Error) {
    // Don't expose internal error messages in production
    const message = process.env.NODE_ENV === "development" 
      ? error.message 
      : "Terjadi kesalahan pada server";
    
    return {
      success: false,
      error: message,
      code: "INTERNAL_ERROR",
    };
  }

  // Fallback for unknown errors
  return {
    success: false,
    error: "Terjadi kesalahan yang tidak diketahui",
    code: "UNKNOWN_ERROR",
  };
}

/**
 * Log error with context
 */
export function logError(
  error: unknown,
  context: {
    action: string;
    userId?: string;
    data?: Record<string, unknown>;
  }
): void {
  const timestamp = new Date().toISOString();
  const errorInfo = {
    timestamp,
    action: context.action,
    userId: context.userId,
    data: context.data,
    error: error instanceof Error ? {
      name: error.name,
      message: error.message,
      stack: error.stack,
    } : error,
  };

  // In production, you would send this to a logging service
  // For now, we'll use console.error
  console.error("[ERROR]", JSON.stringify(errorInfo, null, 2));
}

/**
 * Wrapper for server actions with standardized error handling
 */
export async function withErrorHandling<T>(
  action: string,
  fn: () => Promise<T>,
  options: {
    userId?: string;
    logData?: Record<string, unknown>;
  } = {}
): Promise<T | ErrorResult> {
  try {
    return await fn();
  } catch (error) {
    logError(error, {
      action,
      userId: options.userId,
      data: options.logData,
    });
    return formatError(error);
  }
}
