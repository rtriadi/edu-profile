"use client";

import { useState } from "react";
import {
  Type,
  AlignLeft,
  Image,
  Video,
  Quote,
  List,
  Minus,
  Columns,
  MessageSquare,
  ChevronDown,
  Users,
  Newspaper,
  ImageIcon,
  Calendar,
  Download,
  Phone,
  MapPin,
  BarChart3,
  Clock,
  GraduationCap,
  Building,
  Trophy,
  Megaphone,
  X,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { BlockType } from "@/types";
import { cn } from "@/lib/utils";

interface BlockToolbarProps {
  onSelect: (type: BlockType) => void;
  onClose: () => void;
}

const contentBlocks = [
  { type: "heading" as BlockType, label: "Heading", icon: Type },
  { type: "paragraph" as BlockType, label: "Paragraf", icon: AlignLeft },
  { type: "image" as BlockType, label: "Gambar", icon: Image },
  { type: "video" as BlockType, label: "Video", icon: Video },
  { type: "quote" as BlockType, label: "Kutipan", icon: Quote },
  { type: "list" as BlockType, label: "Daftar", icon: List },
  { type: "divider" as BlockType, label: "Pembatas", icon: Minus },
  { type: "callout" as BlockType, label: "Callout", icon: MessageSquare },
];

const layoutBlocks = [
  { type: "columns" as BlockType, label: "Kolom", icon: Columns },
  { type: "spacer" as BlockType, label: "Spasi", icon: ChevronDown },
  { type: "hero" as BlockType, label: "Hero Section", icon: ImageIcon },
  { type: "cta" as BlockType, label: "Call to Action", icon: Megaphone },
  { type: "stats-counter" as BlockType, label: "Statistik", icon: BarChart3 },
  { type: "timeline" as BlockType, label: "Timeline", icon: Clock },
];

const schoolBlocks = [
  { type: "staff-grid" as BlockType, label: "Grid Guru/Staff", icon: Users },
  { type: "news-list" as BlockType, label: "Daftar Berita", icon: Newspaper },
  { type: "gallery-embed" as BlockType, label: "Embed Galeri", icon: ImageIcon },
  { type: "event-calendar" as BlockType, label: "Kalender Event", icon: Calendar },
  { type: "download-list" as BlockType, label: "Daftar Download", icon: Download },
  { type: "testimonial-slider" as BlockType, label: "Slider Testimoni", icon: Quote },
  { type: "contact-form" as BlockType, label: "Form Kontak", icon: Phone },
  { type: "google-map" as BlockType, label: "Google Maps", icon: MapPin },
  { type: "program-cards" as BlockType, label: "Kartu Program", icon: GraduationCap },
  { type: "facility-showcase" as BlockType, label: "Showcase Fasilitas", icon: Building },
  { type: "achievement-list" as BlockType, label: "Daftar Prestasi", icon: Trophy },
];

export function BlockToolbar({ onSelect, onClose }: BlockToolbarProps) {
  return (
    <div className="border rounded-lg bg-background shadow-lg p-4 mb-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold">Pilih Jenis Blok</h3>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      <Tabs defaultValue="content">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="content">Konten</TabsTrigger>
          <TabsTrigger value="layout">Layout</TabsTrigger>
          <TabsTrigger value="school">Sekolah</TabsTrigger>
        </TabsList>

        <TabsContent value="content" className="mt-4">
          <div className="grid grid-cols-4 gap-2">
            {contentBlocks.map((block) => (
              <BlockButton
                key={block.type}
                icon={block.icon}
                label={block.label}
                onClick={() => onSelect(block.type)}
              />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="layout" className="mt-4">
          <div className="grid grid-cols-4 gap-2">
            {layoutBlocks.map((block) => (
              <BlockButton
                key={block.type}
                icon={block.icon}
                label={block.label}
                onClick={() => onSelect(block.type)}
              />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="school" className="mt-4">
          <ScrollArea className="h-[200px]">
            <div className="grid grid-cols-4 gap-2">
              {schoolBlocks.map((block) => (
                <BlockButton
                  key={block.type}
                  icon={block.icon}
                  label={block.label}
                  onClick={() => onSelect(block.type)}
                />
              ))}
            </div>
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function BlockButton({
  icon: Icon,
  label,
  onClick,
}: {
  icon: React.ElementType;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex flex-col items-center gap-2 p-3 rounded-lg border",
        "hover:bg-accent hover:border-primary transition-colors",
        "text-sm text-center"
      )}
    >
      <Icon className="h-5 w-5 text-muted-foreground" />
      <span className="text-xs">{label}</span>
    </button>
  );
}
