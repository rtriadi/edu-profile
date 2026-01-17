"use client";

import { useState } from "react";
import NextImage, { ImageProps as NextImageProps } from "next/image";
import { cn } from "@/lib/utils";
import { ImageOff } from "lucide-react";

interface OptimizedImageProps extends Omit<NextImageProps, "onError" | "onLoad"> {
  fallback?: React.ReactNode;
  showPlaceholder?: boolean;
  aspectRatio?: "video" | "square" | "portrait" | "auto";
}

export function OptimizedImage({
  src,
  alt,
  className,
  fallback,
  showPlaceholder = true,
  aspectRatio = "auto",
  ...props
}: OptimizedImageProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const aspectClasses = {
    video: "aspect-video",
    square: "aspect-square",
    portrait: "aspect-[3/4]",
    auto: "",
  };

  if (hasError || !src) {
    return (
      <div
        className={cn(
          "flex items-center justify-center bg-muted text-muted-foreground",
          aspectClasses[aspectRatio],
          className
        )}
      >
        {fallback || <ImageOff className="h-8 w-8" />}
      </div>
    );
  }

  return (
    <div className={cn("relative overflow-hidden", aspectClasses[aspectRatio], className)}>
      {/* Placeholder shimmer */}
      {showPlaceholder && isLoading && (
        <div className="absolute inset-0 bg-muted animate-pulse" />
      )}
      
      <NextImage
        src={src}
        alt={alt}
        className={cn(
          "object-cover transition-opacity duration-300",
          isLoading ? "opacity-0" : "opacity-100"
        )}
        onLoad={() => setIsLoading(false)}
        onError={() => {
          setIsLoading(false);
          setHasError(true);
        }}
        {...props}
      />
    </div>
  );
}

// Card image with built-in aspect ratio
interface CardImageProps {
  src?: string | null;
  alt: string;
  aspectRatio?: "video" | "square" | "portrait";
  className?: string;
  fallbackIcon?: React.ReactNode;
}

export function CardImage({
  src,
  alt,
  aspectRatio = "video",
  className,
  fallbackIcon,
}: CardImageProps) {
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const aspectClasses = {
    video: "aspect-video",
    square: "aspect-square",
    portrait: "aspect-[3/4]",
  };

  if (!src || hasError) {
    return (
      <div
        className={cn(
          "relative bg-muted flex items-center justify-center",
          aspectClasses[aspectRatio],
          className
        )}
      >
        {fallbackIcon || <ImageOff className="h-12 w-12 text-muted-foreground/50" />}
      </div>
    );
  }

  return (
    <div className={cn("relative overflow-hidden", aspectClasses[aspectRatio], className)}>
      {isLoading && (
        <div className="absolute inset-0 bg-muted animate-pulse" />
      )}
      <NextImage
        src={src}
        alt={alt}
        fill
        className={cn(
          "object-cover transition-opacity duration-300",
          isLoading ? "opacity-0" : "opacity-100"
        )}
        onLoad={() => setIsLoading(false)}
        onError={() => {
          setIsLoading(false);
          setHasError(true);
        }}
      />
    </div>
  );
}

// Avatar image with fallback
interface AvatarImageProps {
  src?: string | null;
  alt: string;
  size?: "sm" | "md" | "lg" | "xl";
  fallback?: string;
  className?: string;
}

export function AvatarImage({
  src,
  alt,
  size = "md",
  fallback,
  className,
}: AvatarImageProps) {
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const sizeClasses = {
    sm: "h-8 w-8 text-xs",
    md: "h-10 w-10 text-sm",
    lg: "h-12 w-12 text-base",
    xl: "h-16 w-16 text-lg",
  };

  const initials = fallback || alt.charAt(0).toUpperCase();

  if (!src || hasError) {
    return (
      <div
        className={cn(
          "rounded-full bg-primary/10 flex items-center justify-center font-medium text-primary",
          sizeClasses[size],
          className
        )}
      >
        {initials}
      </div>
    );
  }

  return (
    <div className={cn("relative rounded-full overflow-hidden", sizeClasses[size], className)}>
      {isLoading && (
        <div className="absolute inset-0 bg-muted animate-pulse rounded-full" />
      )}
      <NextImage
        src={src}
        alt={alt}
        fill
        className={cn(
          "object-cover transition-opacity duration-300",
          isLoading ? "opacity-0" : "opacity-100"
        )}
        onLoad={() => setIsLoading(false)}
        onError={() => {
          setIsLoading(false);
          setHasError(true);
        }}
      />
    </div>
  );
}

// Background image with overlay
interface BackgroundImageProps {
  src: string;
  alt?: string;
  overlay?: boolean;
  overlayOpacity?: number;
  children?: React.ReactNode;
  className?: string;
}

export function BackgroundImage({
  src,
  alt = "",
  overlay = true,
  overlayOpacity = 0.5,
  children,
  className,
}: BackgroundImageProps) {
  return (
    <div className={cn("relative overflow-hidden", className)}>
      <NextImage
        src={src}
        alt={alt}
        fill
        className="object-cover"
        priority
      />
      {overlay && (
        <div
          className="absolute inset-0 bg-black"
          style={{ opacity: overlayOpacity }}
        />
      )}
      <div className="relative z-10">{children}</div>
    </div>
  );
}
