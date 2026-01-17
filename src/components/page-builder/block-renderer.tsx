"use client";

import Image from "next/image";
import Link from "next/link";
import type { Block } from "@/types";
import { cn } from "@/lib/utils";

interface BlockRendererProps {
  block: Block;
}

// =============================================================================
// SANITIZATION HELPERS
// =============================================================================

/**
 * Sanitize text content to prevent XSS
 * React already escapes text content in JSX, but we add an extra layer
 * for defense-in-depth against potential edge cases
 */
function sanitizeText(text: string | undefined | null): string {
  if (!text || typeof text !== "string") return "";
  
  // Remove null bytes and control characters
  return text
    .replace(/\0/g, "")
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, "")
    .trim();
}

/**
 * Sanitize and validate URL to prevent javascript: and data: URLs
 */
function sanitizeUrl(url: string | undefined | null): string {
  if (!url || typeof url !== "string") return "";
  
  const trimmed = url.trim();
  
  // Only allow http, https, mailto, tel, and relative URLs
  const allowedProtocols = ["http://", "https://", "mailto:", "tel:", "/", "#"];
  const isAllowed = allowedProtocols.some(protocol => 
    trimmed.toLowerCase().startsWith(protocol)
  );
  
  // Block javascript:, data:, and other potentially dangerous protocols
  if (!isAllowed && trimmed.includes(":")) {
    return "";
  }
  
  return trimmed;
}

/**
 * Validate alignment value
 */
function sanitizeAlign(align: string | undefined | null): string {
  const validAligns = ["left", "center", "right", "justify", "full"];
  if (!align || !validAligns.includes(align)) return "left";
  return align;
}

/**
 * Validate heading level
 */
function sanitizeLevel(level: number | undefined | null): 1 | 2 | 3 | 4 | 5 | 6 {
  if (!level || level < 1 || level > 6) return 2;
  return level as 1 | 2 | 3 | 4 | 5 | 6;
}

// =============================================================================
// BLOCK RENDERER
// =============================================================================

export function BlockRenderer({ block }: BlockRendererProps) {
  switch (block.type) {
    case "heading":
      return <HeadingBlock data={block.data as { level: number; text: string; align: string }} />;
    case "paragraph":
      return <ParagraphBlock data={block.data as { text: string; align: string }} />;
    case "image":
      return <ImageBlock data={block.data as { src: string; alt: string; caption: string; align: string }} />;
    case "video":
      return <VideoBlock data={block.data as { src: string; type: string; caption: string }} />;
    case "quote":
      return <QuoteBlock data={block.data as { text: string; author: string; source: string }} />;
    case "list":
      return <ListBlock data={block.data as { type: string; items: string[] }} />;
    case "divider":
      return <hr className="my-8 border-t-2" />;
    case "spacer":
      return <SpacerBlock data={block.data as { height: string }} />;
    case "callout":
      return <CalloutBlock data={block.data as { type: string; title: string; text: string }} />;
    case "hero":
      return <HeroBlock data={block.data as { title: string; subtitle: string; backgroundImage: string; backgroundOverlay: boolean; ctaText: string; ctaLink: string; align: string }} />;
    case "stats-counter":
      return <StatsBlock data={block.data as { items: Array<{ value: number; label: string; prefix: string; suffix: string }> }} />;
    case "cta":
      return <CTABlock data={block.data as { title: string; description: string; buttonText: string; buttonLink: string }} />;
    default:
      return (
        <div className="p-4 bg-muted rounded-lg text-center text-muted-foreground">
          Blok {sanitizeText(block.type)} tidak dikenali
        </div>
      );
  }
}

// =============================================================================
// BLOCK COMPONENTS
// =============================================================================

// Heading Block
function HeadingBlock({ data }: { data: { level: number; text: string; align: string } }) {
  const level = sanitizeLevel(data.level);
  const Tag = `h${level}` as "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
  const text = sanitizeText(data.text);
  const align = sanitizeAlign(data.align);
  
  const sizes: Record<number, string> = {
    1: "text-4xl md:text-5xl",
    2: "text-3xl md:text-4xl",
    3: "text-2xl md:text-3xl",
    4: "text-xl md:text-2xl",
    5: "text-lg md:text-xl",
    6: "text-base md:text-lg",
  };

  return (
    <Tag
      className={cn(
        "font-bold leading-tight",
        sizes[level] || sizes[2],
        align === "center" && "text-center",
        align === "right" && "text-right"
      )}
    >
      {text}
    </Tag>
  );
}

// Paragraph Block
function ParagraphBlock({ data }: { data: { text: string; align: string } }) {
  const text = sanitizeText(data.text);
  const align = sanitizeAlign(data.align);
  
  return (
    <p
      className={cn(
        "text-base md:text-lg leading-relaxed",
        align === "center" && "text-center",
        align === "right" && "text-right",
        align === "justify" && "text-justify"
      )}
    >
      {text}
    </p>
  );
}

// Image Block - Using Next.js Image component for optimization
function ImageBlock({ data }: { data: { src: string; alt: string; caption: string; align: string } }) {
  const src = sanitizeUrl(data.src);
  const alt = sanitizeText(data.alt) || "Image";
  const caption = sanitizeText(data.caption);
  const align = sanitizeAlign(data.align);
  
  if (!src) return null;

  // Check if it's an external URL or internal
  const isExternal = src.startsWith("http://") || src.startsWith("https://");
  
  return (
    <figure
      className={cn(
        align === "center" && "flex flex-col items-center",
        align === "right" && "flex flex-col items-end",
        align === "full" && "w-full"
      )}
    >
      <div className={cn(
        "relative overflow-hidden rounded-lg",
        align === "full" ? "w-full" : "max-w-2xl w-full"
      )}>
        {isExternal ? (
          // For external images, use img tag with loading="lazy"
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={src}
            alt={alt}
            className="w-full h-auto"
            loading="lazy"
          />
        ) : (
          // For internal images, use Next.js Image component
          <Image
            src={src}
            alt={alt}
            width={800}
            height={600}
            className="w-full h-auto"
            style={{ width: '100%', height: 'auto' }}
          />
        )}
      </div>
      {caption && (
        <figcaption className="mt-2 text-sm text-muted-foreground text-center">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}

// Video Block
function VideoBlock({ data }: { data: { src: string; type: string; caption: string } }) {
  const src = sanitizeUrl(data.src);
  const caption = sanitizeText(data.caption);
  const videoType = data.type || "youtube";
  
  if (!src) return null;

  const getEmbedUrl = (url: string, type: string): string => {
    if (type === "youtube") {
      const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/);
      if (match) return `https://www.youtube.com/embed/${match[1]}`;
    }
    if (type === "vimeo") {
      const match = url.match(/vimeo\.com\/(\d+)/);
      if (match) return `https://player.vimeo.com/video/${match[1]}`;
    }
    return url;
  };

  const embedUrl = videoType !== "file" ? getEmbedUrl(src, videoType) : src;
  
  // Validate embed URL
  if (!embedUrl.startsWith("https://")) {
    return null;
  }

  return (
    <figure className="flex flex-col items-center">
      <div className="w-full max-w-3xl aspect-video">
        {videoType === "file" ? (
          <video src={src} controls className="w-full h-full rounded-lg" />
        ) : (
          <iframe
            src={embedUrl}
            className="w-full h-full rounded-lg"
            allowFullScreen
            loading="lazy"
            referrerPolicy="strict-origin-when-cross-origin"
          />
        )}
      </div>
      {caption && (
        <figcaption className="mt-2 text-sm text-muted-foreground">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}

// Quote Block
function QuoteBlock({ data }: { data: { text: string; author: string; source: string } }) {
  const text = sanitizeText(data.text);
  const author = sanitizeText(data.author);
  const source = sanitizeText(data.source);
  
  return (
    <blockquote className="border-l-4 border-primary pl-6 py-2 my-6">
      <p className="text-lg md:text-xl italic text-foreground/90">{text}</p>
      {author && (
        <footer className="mt-3 text-sm text-muted-foreground">
          — {author}
          {source && <cite>, {source}</cite>}
        </footer>
      )}
    </blockquote>
  );
}

// List Block
function ListBlock({ data }: { data: { type: string; items: string[] } }) {
  const ListTag = data.type === "ordered" ? "ol" : "ul";
  const items = Array.isArray(data.items) ? data.items : [];

  return (
    <ListTag
      className={cn(
        "space-y-2 pl-6",
        data.type === "ordered" ? "list-decimal" : "list-disc"
      )}
    >
      {items.map((item, index) => (
        <li key={index} className="text-base md:text-lg">
          {sanitizeText(item)}
        </li>
      ))}
    </ListTag>
  );
}

// Spacer Block
function SpacerBlock({ data }: { data: { height: string } }) {
  const heights: Record<string, string> = {
    sm: "h-4",
    md: "h-8",
    lg: "h-16",
    xl: "h-24",
  };

  const height = heights[data.height] || "h-8";
  return <div className={height} />;
}

// Callout Block
function CalloutBlock({ data }: { data: { type: string; title: string; text: string } }) {
  const title = sanitizeText(data.title);
  const text = sanitizeText(data.text);
  
  const styles: Record<string, { bg: string; border: string; icon: string }> = {
    info: { bg: "bg-blue-50 dark:bg-blue-950", border: "border-blue-500", icon: "ℹ️" },
    warning: { bg: "bg-yellow-50 dark:bg-yellow-950", border: "border-yellow-500", icon: "⚠️" },
    success: { bg: "bg-green-50 dark:bg-green-950", border: "border-green-500", icon: "✅" },
    error: { bg: "bg-red-50 dark:bg-red-950", border: "border-red-500", icon: "❌" },
    tip: { bg: "bg-purple-50 dark:bg-purple-950", border: "border-purple-500", icon: "💡" },
  };

  const style = styles[data.type] || styles.info;

  return (
    <div className={cn("border-l-4 rounded-r-lg p-4", style.bg, style.border)}>
      {title && (
        <h4 className="font-semibold mb-1">
          {style.icon} {title}
        </h4>
      )}
      <p className="text-sm md:text-base">{text}</p>
    </div>
  );
}

// Hero Block
function HeroBlock({ data }: { data: { title: string; subtitle: string; backgroundImage: string; backgroundOverlay: boolean; ctaText: string; ctaLink: string; align: string } }) {
  const title = sanitizeText(data.title);
  const subtitle = sanitizeText(data.subtitle);
  const backgroundImage = sanitizeUrl(data.backgroundImage);
  const ctaText = sanitizeText(data.ctaText);
  const ctaLink = sanitizeUrl(data.ctaLink);
  const align = sanitizeAlign(data.align);
  
  return (
    <section
      className={cn(
        "relative rounded-xl overflow-hidden py-16 md:py-24 px-6 md:px-12 bg-cover bg-center",
        !backgroundImage && "bg-gradient-to-r from-primary to-primary/80"
      )}
      style={backgroundImage ? { backgroundImage: `url(${backgroundImage})` } : undefined}
    >
      {data.backgroundOverlay !== false && (
        <div className="absolute inset-0 bg-black/50" />
      )}
      <div
        className={cn(
          "relative z-10 text-white max-w-3xl",
          align === "center" && "mx-auto text-center",
          align === "right" && "ml-auto text-right"
        )}
      >
        <h1 className="text-3xl md:text-5xl font-bold mb-4">{title}</h1>
        {subtitle && (
          <p className="text-lg md:text-xl text-white/90 mb-6">{subtitle}</p>
        )}
        {ctaText && ctaLink && (
          <Link
            href={ctaLink}
            className="inline-block px-6 py-3 bg-white text-primary font-semibold rounded-lg hover:bg-white/90 transition-colors"
          >
            {ctaText}
          </Link>
        )}
      </div>
    </section>
  );
}

// Stats Block
function StatsBlock({ data }: { data: { items: Array<{ value: number; label: string; prefix: string; suffix: string }> } }) {
  const items = Array.isArray(data.items) ? data.items : [];
  
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 py-8">
      {items.map((item, index) => (
        <div key={index} className="text-center">
          <div className="text-3xl md:text-4xl font-bold text-primary">
            {sanitizeText(item.prefix)}
            {typeof item.value === "number" ? item.value.toLocaleString("id-ID") : 0}
            {sanitizeText(item.suffix)}
          </div>
          <div className="text-sm md:text-base text-muted-foreground mt-1">
            {sanitizeText(item.label)}
          </div>
        </div>
      ))}
    </div>
  );
}

// CTA Block
function CTABlock({ data }: { data: { title: string; description: string; buttonText: string; buttonLink: string } }) {
  const title = sanitizeText(data.title);
  const description = sanitizeText(data.description);
  const buttonText = sanitizeText(data.buttonText);
  const buttonLink = sanitizeUrl(data.buttonLink);
  
  return (
    <section className="bg-primary text-primary-foreground rounded-xl p-8 md:p-12 text-center">
      <h2 className="text-2xl md:text-3xl font-bold mb-3">{title}</h2>
      {description && (
        <p className="text-primary-foreground/90 mb-6 max-w-2xl mx-auto">
          {description}
        </p>
      )}
      {buttonText && buttonLink && (
        <Link
          href={buttonLink}
          className="inline-block px-6 py-3 bg-white text-primary font-semibold rounded-lg hover:bg-white/90 transition-colors"
        >
          {buttonText}
        </Link>
      )}
    </section>
  );
}
