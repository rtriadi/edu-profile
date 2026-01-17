"use client";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import type { Block } from "@/types";
import { cn } from "@/lib/utils";

interface BlockEditorProps {
  block: Block;
  onUpdate: (data: Record<string, unknown>) => void;
  isActive: boolean;
}

export function BlockEditor({ block, onUpdate, isActive }: BlockEditorProps) {
  switch (block.type) {
    case "heading":
      return (
        <HeadingEditor
          data={block.data as { level: number; text: string; align: string }}
          onUpdate={onUpdate}
          isActive={isActive}
        />
      );
    case "paragraph":
      return (
        <ParagraphEditor
          data={block.data as { text: string; align: string }}
          onUpdate={onUpdate}
          isActive={isActive}
        />
      );
    case "image":
      return (
        <ImageEditor
          data={block.data as { src: string; alt: string; caption: string; align: string }}
          onUpdate={onUpdate}
          isActive={isActive}
        />
      );
    case "video":
      return (
        <VideoEditor
          data={block.data as { src: string; type: string; caption: string }}
          onUpdate={onUpdate}
          isActive={isActive}
        />
      );
    case "quote":
      return (
        <QuoteEditor
          data={block.data as { text: string; author: string; source: string }}
          onUpdate={onUpdate}
          isActive={isActive}
        />
      );
    case "list":
      return (
        <ListEditor
          data={block.data as { type: string; items: string[] }}
          onUpdate={onUpdate}
          isActive={isActive}
        />
      );
    case "divider":
      return <DividerEditor />;
    case "spacer":
      return (
        <SpacerEditor
          data={block.data as { height: string }}
          onUpdate={onUpdate}
          isActive={isActive}
        />
      );
    case "callout":
      return (
        <CalloutEditor
          data={block.data as { type: string; title: string; text: string }}
          onUpdate={onUpdate}
          isActive={isActive}
        />
      );
    case "hero":
      return (
        <HeroEditor
          data={block.data as { title: string; subtitle: string; backgroundImage: string; ctaText: string; ctaLink: string; align: string }}
          onUpdate={onUpdate}
          isActive={isActive}
        />
      );
    case "stats-counter":
      return (
        <StatsEditor
          data={block.data as { items: Array<{ value: number; label: string; prefix: string; suffix: string }> }}
          onUpdate={onUpdate}
          isActive={isActive}
        />
      );
    default:
      return (
        <div className="text-center py-4 text-muted-foreground">
          <p className="text-sm">Blok: {block.type}</p>
          <p className="text-xs">Editor untuk blok ini sedang dikembangkan</p>
        </div>
      );
  }
}

// Heading Editor
function HeadingEditor({
  data,
  onUpdate,
  isActive,
}: {
  data: { level: number; text: string; align: string };
  onUpdate: (data: Record<string, unknown>) => void;
  isActive: boolean;
}) {
  const HeadingTag = `h${data.level}` as "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
  const sizes: Record<number, string> = {
    1: "text-4xl",
    2: "text-3xl",
    3: "text-2xl",
    4: "text-xl",
    5: "text-lg",
    6: "text-base",
  };

  return (
    <div className="space-y-2">
      {isActive && (
        <div className="flex items-center gap-2 mb-2">
          <Select
            value={String(data.level)}
            onValueChange={(value) => onUpdate({ level: Number(value) })}
          >
            <SelectTrigger className="w-24">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">H1</SelectItem>
              <SelectItem value="2">H2</SelectItem>
              <SelectItem value="3">H3</SelectItem>
              <SelectItem value="4">H4</SelectItem>
              <SelectItem value="5">H5</SelectItem>
              <SelectItem value="6">H6</SelectItem>
            </SelectContent>
          </Select>
          <Select
            value={data.align || "left"}
            onValueChange={(value) => onUpdate({ align: value })}
          >
            <SelectTrigger className="w-28">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="left">Kiri</SelectItem>
              <SelectItem value="center">Tengah</SelectItem>
              <SelectItem value="right">Kanan</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}
      <Input
        value={data.text}
        onChange={(e) => onUpdate({ text: e.target.value })}
        placeholder="Masukkan heading..."
        className={cn(
          sizes[data.level],
          "font-bold border-none shadow-none focus-visible:ring-0 px-0",
          data.align === "center" && "text-center",
          data.align === "right" && "text-right"
        )}
      />
    </div>
  );
}

// Paragraph Editor
function ParagraphEditor({
  data,
  onUpdate,
  isActive,
}: {
  data: { text: string; align: string };
  onUpdate: (data: Record<string, unknown>) => void;
  isActive: boolean;
}) {
  return (
    <div className="space-y-2">
      {isActive && (
        <div className="flex items-center gap-2 mb-2">
          <Select
            value={data.align || "left"}
            onValueChange={(value) => onUpdate({ align: value })}
          >
            <SelectTrigger className="w-28">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="left">Kiri</SelectItem>
              <SelectItem value="center">Tengah</SelectItem>
              <SelectItem value="right">Kanan</SelectItem>
              <SelectItem value="justify">Rata</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}
      <Textarea
        value={data.text}
        onChange={(e) => onUpdate({ text: e.target.value })}
        placeholder="Masukkan paragraf..."
        className={cn(
          "min-h-[100px] border-none shadow-none focus-visible:ring-0 px-0 resize-none",
          data.align === "center" && "text-center",
          data.align === "right" && "text-right",
          data.align === "justify" && "text-justify"
        )}
      />
    </div>
  );
}

// Image Editor
function ImageEditor({
  data,
  onUpdate,
  isActive,
}: {
  data: { src: string; alt: string; caption: string; align: string };
  onUpdate: (data: Record<string, unknown>) => void;
  isActive: boolean;
}) {
  return (
    <div className="space-y-3">
      <div className="space-y-2">
        <Label>URL Gambar</Label>
        <Input
          value={data.src}
          onChange={(e) => onUpdate({ src: e.target.value })}
          placeholder="https://example.com/image.jpg"
        />
      </div>
      {data.src && (
        <div className={cn(
          "relative",
          data.align === "center" && "flex justify-center",
          data.align === "right" && "flex justify-end"
        )}>
          <img
            src={data.src}
            alt={data.alt || ""}
            className="max-h-64 rounded-lg object-cover"
          />
        </div>
      )}
      {isActive && (
        <>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label>Alt Text</Label>
              <Input
                value={data.alt}
                onChange={(e) => onUpdate({ alt: e.target.value })}
                placeholder="Deskripsi gambar"
              />
            </div>
            <div className="space-y-2">
              <Label>Posisi</Label>
              <Select
                value={data.align || "center"}
                onValueChange={(value) => onUpdate({ align: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="left">Kiri</SelectItem>
                  <SelectItem value="center">Tengah</SelectItem>
                  <SelectItem value="right">Kanan</SelectItem>
                  <SelectItem value="full">Full Width</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-2">
            <Label>Caption (opsional)</Label>
            <Input
              value={data.caption}
              onChange={(e) => onUpdate({ caption: e.target.value })}
              placeholder="Caption gambar"
            />
          </div>
        </>
      )}
    </div>
  );
}

// Video Editor
function VideoEditor({
  data,
  onUpdate,
  isActive,
}: {
  data: { src: string; type: string; caption: string };
  onUpdate: (data: Record<string, unknown>) => void;
  isActive: boolean;
}) {
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-3 gap-3">
        <div className="col-span-2 space-y-2">
          <Label>URL Video</Label>
          <Input
            value={data.src}
            onChange={(e) => onUpdate({ src: e.target.value })}
            placeholder="https://youtube.com/watch?v=..."
          />
        </div>
        <div className="space-y-2">
          <Label>Tipe</Label>
          <Select
            value={data.type || "youtube"}
            onValueChange={(value) => onUpdate({ type: value })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="youtube">YouTube</SelectItem>
              <SelectItem value="vimeo">Vimeo</SelectItem>
              <SelectItem value="file">File</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      {data.src && data.type === "youtube" && (
        <div className="aspect-video">
          <iframe
            src={getYouTubeEmbedUrl(data.src)}
            className="w-full h-full rounded-lg"
            allowFullScreen
          />
        </div>
      )}
    </div>
  );
}

function getYouTubeEmbedUrl(url: string): string {
  const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/);
  if (match) {
    return `https://www.youtube.com/embed/${match[1]}`;
  }
  return url;
}

// Quote Editor
function QuoteEditor({
  data,
  onUpdate,
  isActive,
}: {
  data: { text: string; author: string; source: string };
  onUpdate: (data: Record<string, unknown>) => void;
  isActive: boolean;
}) {
  return (
    <div className="border-l-4 border-primary pl-4 space-y-2">
      <Textarea
        value={data.text}
        onChange={(e) => onUpdate({ text: e.target.value })}
        placeholder="Masukkan kutipan..."
        className="italic border-none shadow-none focus-visible:ring-0 px-0 resize-none"
      />
      {isActive && (
        <div className="grid grid-cols-2 gap-3">
          <Input
            value={data.author}
            onChange={(e) => onUpdate({ author: e.target.value })}
            placeholder="Penulis"
          />
          <Input
            value={data.source}
            onChange={(e) => onUpdate({ source: e.target.value })}
            placeholder="Sumber"
          />
        </div>
      )}
      {!isActive && data.author && (
        <p className="text-sm text-muted-foreground">
          — {data.author}
          {data.source && `, ${data.source}`}
        </p>
      )}
    </div>
  );
}

// List Editor
function ListEditor({
  data,
  onUpdate,
  isActive,
}: {
  data: { type: string; items: string[] };
  onUpdate: (data: Record<string, unknown>) => void;
  isActive: boolean;
}) {
  const addItem = () => {
    onUpdate({ items: [...data.items, ""] });
  };

  const updateItem = (index: number, value: string) => {
    const newItems = [...data.items];
    newItems[index] = value;
    onUpdate({ items: newItems });
  };

  const removeItem = (index: number) => {
    const newItems = data.items.filter((_, i) => i !== index);
    onUpdate({ items: newItems.length > 0 ? newItems : [""] });
  };

  return (
    <div className="space-y-2">
      {isActive && (
        <Select
          value={data.type || "unordered"}
          onValueChange={(value) => onUpdate({ type: value })}
        >
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="unordered">Bullet List</SelectItem>
            <SelectItem value="ordered">Numbered List</SelectItem>
          </SelectContent>
        </Select>
      )}
      <div className="space-y-1">
        {data.items.map((item, index) => (
          <div key={index} className="flex items-center gap-2">
            <span className="w-6 text-muted-foreground">
              {data.type === "ordered" ? `${index + 1}.` : "•"}
            </span>
            <Input
              value={item}
              onChange={(e) => updateItem(index, e.target.value)}
              placeholder="Item..."
              className="flex-1"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addItem();
                }
                if (e.key === "Backspace" && item === "" && data.items.length > 1) {
                  e.preventDefault();
                  removeItem(index);
                }
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

// Divider Editor
function DividerEditor() {
  return <hr className="border-t-2" />;
}

// Spacer Editor
function SpacerEditor({
  data,
  onUpdate,
  isActive,
}: {
  data: { height: string };
  onUpdate: (data: Record<string, unknown>) => void;
  isActive: boolean;
}) {
  const heights: Record<string, string> = {
    sm: "h-4",
    md: "h-8",
    lg: "h-16",
    xl: "h-24",
  };

  return (
    <div className="flex flex-col items-center">
      <div className={cn("w-full bg-muted/50 rounded", heights[data.height] || "h-8")} />
      {isActive && (
        <Select
          value={data.height || "md"}
          onValueChange={(value) => onUpdate({ height: value })}
        >
          <SelectTrigger className="w-32 mt-2">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="sm">Kecil</SelectItem>
            <SelectItem value="md">Sedang</SelectItem>
            <SelectItem value="lg">Besar</SelectItem>
            <SelectItem value="xl">Sangat Besar</SelectItem>
          </SelectContent>
        </Select>
      )}
    </div>
  );
}

// Callout Editor
function CalloutEditor({
  data,
  onUpdate,
  isActive,
}: {
  data: { type: string; title: string; text: string };
  onUpdate: (data: Record<string, unknown>) => void;
  isActive: boolean;
}) {
  const colors: Record<string, string> = {
    info: "bg-blue-50 border-blue-500 text-blue-900",
    warning: "bg-yellow-50 border-yellow-500 text-yellow-900",
    success: "bg-green-50 border-green-500 text-green-900",
    error: "bg-red-50 border-red-500 text-red-900",
    tip: "bg-purple-50 border-purple-500 text-purple-900",
  };

  return (
    <div className={cn("border-l-4 rounded-r-lg p-4", colors[data.type] || colors.info)}>
      {isActive && (
        <Select
          value={data.type || "info"}
          onValueChange={(value) => onUpdate({ type: value })}
        >
          <SelectTrigger className="w-32 mb-2">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="info">Info</SelectItem>
            <SelectItem value="warning">Peringatan</SelectItem>
            <SelectItem value="success">Sukses</SelectItem>
            <SelectItem value="error">Error</SelectItem>
            <SelectItem value="tip">Tips</SelectItem>
          </SelectContent>
        </Select>
      )}
      <Input
        value={data.title}
        onChange={(e) => onUpdate({ title: e.target.value })}
        placeholder="Judul (opsional)"
        className="font-semibold border-none shadow-none focus-visible:ring-0 px-0 bg-transparent"
      />
      <Textarea
        value={data.text}
        onChange={(e) => onUpdate({ text: e.target.value })}
        placeholder="Isi callout..."
        className="border-none shadow-none focus-visible:ring-0 px-0 bg-transparent resize-none"
      />
    </div>
  );
}

// Hero Editor
function HeroEditor({
  data,
  onUpdate,
  isActive,
}: {
  data: { title: string; subtitle: string; backgroundImage: string; ctaText: string; ctaLink: string; align: string };
  onUpdate: (data: Record<string, unknown>) => void;
  isActive: boolean;
}) {
  return (
    <div className="space-y-3">
      <div
        className={cn(
          "relative rounded-lg p-8 min-h-[200px] bg-cover bg-center",
          !data.backgroundImage && "bg-gradient-to-r from-primary to-primary/80"
        )}
        style={data.backgroundImage ? { backgroundImage: `url(${data.backgroundImage})` } : undefined}
      >
        <div className="absolute inset-0 bg-black/50 rounded-lg" />
        <div className={cn(
          "relative z-10 text-white",
          data.align === "center" && "text-center",
          data.align === "right" && "text-right"
        )}>
          <Input
            value={data.title}
            onChange={(e) => onUpdate({ title: e.target.value })}
            placeholder="Judul Hero"
            className="text-3xl font-bold bg-transparent border-none text-white placeholder:text-white/60"
          />
          <Input
            value={data.subtitle}
            onChange={(e) => onUpdate({ subtitle: e.target.value })}
            placeholder="Subtitle"
            className="text-lg bg-transparent border-none text-white/90 placeholder:text-white/50"
          />
        </div>
      </div>
      {isActive && (
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-2">
            <Label>Background Image URL</Label>
            <Input
              value={data.backgroundImage}
              onChange={(e) => onUpdate({ backgroundImage: e.target.value })}
              placeholder="https://..."
            />
          </div>
          <div className="space-y-2">
            <Label>Posisi Teks</Label>
            <Select
              value={data.align || "center"}
              onValueChange={(value) => onUpdate({ align: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="left">Kiri</SelectItem>
                <SelectItem value="center">Tengah</SelectItem>
                <SelectItem value="right">Kanan</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Teks Tombol CTA</Label>
            <Input
              value={data.ctaText}
              onChange={(e) => onUpdate({ ctaText: e.target.value })}
              placeholder="Daftar Sekarang"
            />
          </div>
          <div className="space-y-2">
            <Label>Link CTA</Label>
            <Input
              value={data.ctaLink}
              onChange={(e) => onUpdate({ ctaLink: e.target.value })}
              placeholder="/ppdb"
            />
          </div>
        </div>
      )}
    </div>
  );
}

// Stats Editor
function StatsEditor({
  data,
  onUpdate,
  isActive,
}: {
  data: { items: Array<{ value: number; label: string; prefix: string; suffix: string }> };
  onUpdate: (data: Record<string, unknown>) => void;
  isActive: boolean;
}) {
  const addItem = () => {
    onUpdate({
      items: [...data.items, { value: 0, label: "", prefix: "", suffix: "" }],
    });
  };

  const updateItem = (index: number, field: string, value: string | number) => {
    const newItems = [...data.items];
    newItems[index] = { ...newItems[index], [field]: value };
    onUpdate({ items: newItems });
  };

  const removeItem = (index: number) => {
    const newItems = data.items.filter((_, i) => i !== index);
    onUpdate({ items: newItems.length > 0 ? newItems : [{ value: 0, label: "", prefix: "", suffix: "" }] });
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {data.items.map((item, index) => (
          <div key={index} className="text-center p-4 bg-muted rounded-lg">
            <div className="text-3xl font-bold text-primary">
              {item.prefix}{item.value}{item.suffix}
            </div>
            <div className="text-sm text-muted-foreground">{item.label}</div>
          </div>
        ))}
      </div>
      {isActive && (
        <div className="space-y-3">
          {data.items.map((item, index) => (
            <div key={index} className="grid grid-cols-5 gap-2 items-end">
              <div>
                <Label className="text-xs">Prefix</Label>
                <Input
                  value={item.prefix}
                  onChange={(e) => updateItem(index, "prefix", e.target.value)}
                  placeholder="Rp"
                />
              </div>
              <div>
                <Label className="text-xs">Nilai</Label>
                <Input
                  type="number"
                  value={item.value}
                  onChange={(e) => updateItem(index, "value", Number(e.target.value))}
                />
              </div>
              <div>
                <Label className="text-xs">Suffix</Label>
                <Input
                  value={item.suffix}
                  onChange={(e) => updateItem(index, "suffix", e.target.value)}
                  placeholder="+"
                />
              </div>
              <div>
                <Label className="text-xs">Label</Label>
                <Input
                  value={item.label}
                  onChange={(e) => updateItem(index, "label", e.target.value)}
                  placeholder="Siswa"
                />
              </div>
              <button
                type="button"
                onClick={() => removeItem(index)}
                className="text-destructive text-sm hover:underline"
              >
                Hapus
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={addItem}
            className="text-primary text-sm hover:underline"
          >
            + Tambah Item
          </button>
        </div>
      )}
    </div>
  );
}
