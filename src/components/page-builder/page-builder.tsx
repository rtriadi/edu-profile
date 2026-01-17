"use client";

import { useState, useCallback } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { SortableBlock } from "./sortable-block";
import { BlockToolbar } from "./block-toolbar";
import { BlockRenderer } from "./block-renderer";
import type { Block, BlockType } from "@/types";
import { generateId } from "@/lib/utils";

interface PageBuilderProps {
  initialBlocks?: Block[];
  onChange?: (blocks: Block[]) => void;
  readOnly?: boolean;
}

export function PageBuilder({
  initialBlocks = [],
  onChange,
  readOnly = false,
}: PageBuilderProps) {
  const [blocks, setBlocks] = useState<Block[]>(initialBlocks);
  const [activeBlockId, setActiveBlockId] = useState<string | null>(null);
  const [showToolbar, setShowToolbar] = useState(false);
  const [toolbarPosition, setToolbarPosition] = useState(0);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const updateBlocks = useCallback(
    (newBlocks: Block[]) => {
      setBlocks(newBlocks);
      onChange?.(newBlocks);
    },
    [onChange]
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = blocks.findIndex((block) => block.id === active.id);
      const newIndex = blocks.findIndex((block) => block.id === over.id);

      const newBlocks = arrayMove(blocks, oldIndex, newIndex);
      updateBlocks(newBlocks);
    }
  };

  const addBlock = (type: BlockType, position: number) => {
    const newBlock: Block = {
      id: generateId(),
      type,
      data: getDefaultBlockData(type),
    };

    const newBlocks = [...blocks];
    newBlocks.splice(position, 0, newBlock);
    updateBlocks(newBlocks);
    setShowToolbar(false);
    setActiveBlockId(newBlock.id);
  };

  const updateBlock = (id: string, data: Record<string, unknown>) => {
    const newBlocks = blocks.map((block) =>
      block.id === id ? { ...block, data: { ...block.data, ...data } } : block
    );
    updateBlocks(newBlocks);
  };

  const deleteBlock = (id: string) => {
    const newBlocks = blocks.filter((block) => block.id !== id);
    updateBlocks(newBlocks);
    setActiveBlockId(null);
  };

  const duplicateBlock = (id: string) => {
    const index = blocks.findIndex((block) => block.id === id);
    if (index === -1) return;

    const originalBlock = blocks[index];
    const newBlock: Block = {
      ...originalBlock,
      id: generateId(),
    };

    const newBlocks = [...blocks];
    newBlocks.splice(index + 1, 0, newBlock);
    updateBlocks(newBlocks);
  };

  const moveBlockUp = (id: string) => {
    const index = blocks.findIndex((block) => block.id === id);
    if (index <= 0) return;

    const newBlocks = arrayMove(blocks, index, index - 1);
    updateBlocks(newBlocks);
  };

  const moveBlockDown = (id: string) => {
    const index = blocks.findIndex((block) => block.id === id);
    if (index === -1 || index >= blocks.length - 1) return;

    const newBlocks = arrayMove(blocks, index, index + 1);
    updateBlocks(newBlocks);
  };

  const handleShowToolbar = (position: number) => {
    setToolbarPosition(position);
    setShowToolbar(true);
  };

  if (readOnly) {
    return (
      <div className="space-y-4">
        {blocks.map((block) => (
          <BlockRenderer key={block.id} block={block} />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {/* Add block at start */}
      <div className="flex justify-center py-2">
        <Button
          variant="ghost"
          size="sm"
          className="text-muted-foreground hover:text-foreground"
          onClick={() => handleShowToolbar(0)}
        >
          <Plus className="h-4 w-4 mr-1" />
          Tambah Blok
        </Button>
      </div>

      {showToolbar && (
        <BlockToolbar
          onSelect={(type) => addBlock(type, toolbarPosition)}
          onClose={() => setShowToolbar(false)}
        />
      )}

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={blocks.map((b) => b.id)}
          strategy={verticalListSortingStrategy}
        >
          {blocks.map((block, index) => (
            <SortableBlock
              key={block.id}
              block={block}
              isActive={activeBlockId === block.id}
              onSelect={() => setActiveBlockId(block.id)}
              onUpdate={(data) => updateBlock(block.id, data)}
              onDelete={() => deleteBlock(block.id)}
              onDuplicate={() => duplicateBlock(block.id)}
              onMoveUp={() => moveBlockUp(block.id)}
              onMoveDown={() => moveBlockDown(block.id)}
              onAddBelow={() => handleShowToolbar(index + 1)}
              isFirst={index === 0}
              isLast={index === blocks.length - 1}
            />
          ))}
        </SortableContext>
      </DndContext>

      {blocks.length === 0 && (
        <div className="text-center py-12 text-muted-foreground border-2 border-dashed rounded-lg">
          <p className="mb-2">Halaman masih kosong</p>
          <p className="text-sm">Klik &quot;Tambah Blok&quot; untuk mulai membuat konten</p>
        </div>
      )}
    </div>
  );
}

function getDefaultBlockData(type: BlockType): Record<string, unknown> {
  switch (type) {
    case "heading":
      return { level: 2, text: "", align: "left" };
    case "paragraph":
      return { text: "", align: "left" };
    case "image":
      return { src: "", alt: "", caption: "", align: "center" };
    case "video":
      return { src: "", type: "youtube", caption: "" };
    case "quote":
      return { text: "", author: "", source: "" };
    case "list":
      return { type: "unordered", items: [""] };
    case "divider":
      return {};
    case "spacer":
      return { height: "md" };
    case "callout":
      return { type: "info", title: "", text: "" };
    case "columns":
      return { columns: 2, gap: "md" };
    case "hero":
      return {
        title: "",
        subtitle: "",
        backgroundImage: "",
        backgroundOverlay: true,
        ctaText: "",
        ctaLink: "",
        align: "center",
      };
    case "stats-counter":
      return {
        items: [
          { value: 0, label: "", prefix: "", suffix: "" },
        ],
      };
    case "staff-grid":
      return { limit: 8, showAll: false };
    case "news-list":
      return { limit: 6, categoryId: "" };
    case "gallery-embed":
      return { galleryId: "" };
    case "testimonial-slider":
      return { limit: 5 };
    case "contact-form":
      return { showMap: true };
    case "google-map":
      return { height: 400 };
    case "program-cards":
      return { type: "", limit: 6 };
    case "facility-showcase":
      return { limit: 6 };
    case "event-calendar":
      return { limit: 5 };
    case "download-list":
      return { category: "", limit: 10 };
    case "achievement-list":
      return { limit: 6 };
    case "timeline":
      return { items: [] };
    case "cta":
      return { title: "", description: "", buttonText: "", buttonLink: "" };
    default:
      return {};
  }
}
