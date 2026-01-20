"use client";

import { useState } from "react";
import Image, { type ImageProps } from "next/image";
import { cn } from "@/lib/utils";

// Base64 encoded 1x1 gray pixel for blur placeholder
const BLUR_DATA_URL =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mN88P/BfwYABQoC/fH0rCMAAAAASUVORK5CYII=";

interface ImageWithFallbackProps extends Omit<ImageProps, "onError"> {
  fallbackSrc?: string;
  fallbackClassName?: string;
  showSkeleton?: boolean;
}

export function ImageWithFallback({
  src,
  alt,
  className,
  fallbackSrc,
  fallbackClassName,
  showSkeleton = true,
  ...props
}: ImageWithFallbackProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const handleLoad = () => {
    setIsLoading(false);
  };

  const handleError = () => {
    setIsLoading(false);
    setHasError(true);
  };

  // If error and no fallback, show placeholder
  if (hasError && !fallbackSrc) {
    return (
      <div
        className={cn(
          "flex items-center justify-center bg-muted",
          fallbackClassName || className
        )}
        role="img"
        aria-label={alt}
      >
        <svg
          className="h-12 w-12 text-muted-foreground/40"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
      </div>
    );
  }

  // If error and has fallback, use fallback
  if (hasError && fallbackSrc) {
    return (
      <Image
        src={fallbackSrc}
        alt={alt}
        className={className}
        placeholder="blur"
        blurDataURL={BLUR_DATA_URL}
        {...props}
      />
    );
  }

  return (
    <>
      {/* Skeleton while loading */}
      {showSkeleton && isLoading && (
        <div
          className={cn(
            "absolute inset-0 bg-muted animate-pulse",
            className
          )}
          aria-hidden="true"
        />
      )}
      <Image
        src={src}
        alt={alt}
        className={cn(
          className,
          isLoading && "opacity-0",
          !isLoading && "opacity-100 transition-opacity duration-300"
        )}
        placeholder="blur"
        blurDataURL={BLUR_DATA_URL}
        onLoad={handleLoad}
        onError={handleError}
        {...props}
      />
    </>
  );
}
