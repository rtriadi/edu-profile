"use client";

import Image from "next/image";
import Link from "next/link";
import type { Block } from "@/types";
import { cn } from "@/lib/utils";

interface BlockRendererProps {
  block: Block;
}

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
          Blok {block.type} tidak dikenali
        </div>
      );
  }
}

// Heading Block
function HeadingBlock({ data }: { data: { level: number; text: string; align: string } }) {
  const Tag = `h${data.level}` as "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
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
        sizes[data.level] || sizes[2],
        data.align === "center" && "text-center",
        data.align === "right" && "text-right"
      )}
    >
      {data.text}
    </Tag>
  );
}

// Paragraph Block
function ParagraphBlock({ data }: { data: { text: string; align: string } }) {
  return (
    <p
      className={cn(
        "text-base md:text-lg leading-relaxed",
        data.align === "center" && "text-center",
        data.align === "right" && "text-right",
        data.align === "justify" && "text-justify"
      )}
    >
      {data.text}
    </p>
  );
}

// Image Block
function ImageBlock({ data }: { data: { src: string; alt: string; caption: string; align: string } }) {
  if (!data.src) return null;

  return (
    <figure
      className={cn(
        data.align === "center" && "flex flex-col items-center",
        data.align === "right" && "flex flex-col items-end",
        data.align === "full" && "w-full"
      )}
    >
      <div className={cn(
        "relative overflow-hidden rounded-lg",
        data.align === "full" ? "w-full" : "max-w-2xl"
      )}>
        <img
          src={data.src}
          alt={data.alt || ""}
          className="w-full h-auto"
        />
      </div>
      {data.caption && (
        <figcaption className="mt-2 text-sm text-muted-foreground text-center">
          {data.caption}
        </figcaption>
      )}
    </figure>
  );
}

// Video Block
function VideoBlock({ data }: { data: { src: string; type: string; caption: string } }) {
  if (!data.src) return null;

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

  return (
    <figure className="flex flex-col items-center">
      <div className="w-full max-w-3xl aspect-video">
        {data.type === "file" ? (
          <video src={data.src} controls className="w-full h-full rounded-lg" />
        ) : (
          <iframe
            src={getEmbedUrl(data.src, data.type)}
            className="w-full h-full rounded-lg"
            allowFullScreen
          />
        )}
      </div>
      {data.caption && (
        <figcaption className="mt-2 text-sm text-muted-foreground">
          {data.caption}
        </figcaption>
      )}
    </figure>
  );
}

// Quote Block
function QuoteBlock({ data }: { data: { text: string; author: string; source: string } }) {
  return (
    <blockquote className="border-l-4 border-primary pl-6 py-2 my-6">
      <p className="text-lg md:text-xl italic text-foreground/90">{data.text}</p>
      {data.author && (
        <footer className="mt-3 text-sm text-muted-foreground">
          — {data.author}
          {data.source && <cite>, {data.source}</cite>}
        </footer>
      )}
    </blockquote>
  );
}

// List Block
function ListBlock({ data }: { data: { type: string; items: string[] } }) {
  const ListTag = data.type === "ordered" ? "ol" : "ul";

  return (
    <ListTag
      className={cn(
        "space-y-2 pl-6",
        data.type === "ordered" ? "list-decimal" : "list-disc"
      )}
    >
      {data.items.map((item, index) => (
        <li key={index} className="text-base md:text-lg">
          {item}
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

  return <div className={heights[data.height] || "h-8"} />;
}

// Callout Block
function CalloutBlock({ data }: { data: { type: string; title: string; text: string } }) {
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
      {data.title && (
        <h4 className="font-semibold mb-1">
          {style.icon} {data.title}
        </h4>
      )}
      <p className="text-sm md:text-base">{data.text}</p>
    </div>
  );
}

// Hero Block
function HeroBlock({ data }: { data: { title: string; subtitle: string; backgroundImage: string; backgroundOverlay: boolean; ctaText: string; ctaLink: string; align: string } }) {
  return (
    <section
      className={cn(
        "relative rounded-xl overflow-hidden py-16 md:py-24 px-6 md:px-12 bg-cover bg-center",
        !data.backgroundImage && "bg-gradient-to-r from-primary to-primary/80"
      )}
      style={data.backgroundImage ? { backgroundImage: `url(${data.backgroundImage})` } : undefined}
    >
      {data.backgroundOverlay !== false && (
        <div className="absolute inset-0 bg-black/50" />
      )}
      <div
        className={cn(
          "relative z-10 text-white max-w-3xl",
          data.align === "center" && "mx-auto text-center",
          data.align === "right" && "ml-auto text-right"
        )}
      >
        <h1 className="text-3xl md:text-5xl font-bold mb-4">{data.title}</h1>
        {data.subtitle && (
          <p className="text-lg md:text-xl text-white/90 mb-6">{data.subtitle}</p>
        )}
        {data.ctaText && data.ctaLink && (
          <Link
            href={data.ctaLink}
            className="inline-block px-6 py-3 bg-white text-primary font-semibold rounded-lg hover:bg-white/90 transition-colors"
          >
            {data.ctaText}
          </Link>
        )}
      </div>
    </section>
  );
}

// Stats Block
function StatsBlock({ data }: { data: { items: Array<{ value: number; label: string; prefix: string; suffix: string }> } }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 py-8">
      {data.items.map((item, index) => (
        <div key={index} className="text-center">
          <div className="text-3xl md:text-4xl font-bold text-primary">
            {item.prefix}
            {item.value.toLocaleString("id-ID")}
            {item.suffix}
          </div>
          <div className="text-sm md:text-base text-muted-foreground mt-1">
            {item.label}
          </div>
        </div>
      ))}
    </div>
  );
}

// CTA Block
function CTABlock({ data }: { data: { title: string; description: string; buttonText: string; buttonLink: string } }) {
  return (
    <section className="bg-primary text-primary-foreground rounded-xl p-8 md:p-12 text-center">
      <h2 className="text-2xl md:text-3xl font-bold mb-3">{data.title}</h2>
      {data.description && (
        <p className="text-primary-foreground/90 mb-6 max-w-2xl mx-auto">
          {data.description}
        </p>
      )}
      {data.buttonText && data.buttonLink && (
        <Link
          href={data.buttonLink}
          className="inline-block px-6 py-3 bg-white text-primary font-semibold rounded-lg hover:bg-white/90 transition-colors"
        >
          {data.buttonText}
        </Link>
      )}
    </section>
  );
}
