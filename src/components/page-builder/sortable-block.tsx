"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  GripVertical,
  Trash2,
  Copy,
  ChevronUp,
  ChevronDown,
  Plus,
  Settings,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { BlockEditor } from "./block-editor";
import type { Block } from "@/types";
import { cn } from "@/lib/utils";

interface SortableBlockProps {
  block: Block;
  isActive: boolean;
  onSelect: () => void;
  onUpdate: (data: Record<string, unknown>) => void;
  onDelete: () => void;
  onDuplicate: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onAddBelow: () => void;
  isFirst: boolean;
  isLast: boolean;
}

export function SortableBlock({
  block,
  isActive,
  onSelect,
  onUpdate,
  onDelete,
  onDuplicate,
  onMoveUp,
  onMoveDown,
  onAddBelow,
  isFirst,
  isLast,
}: SortableBlockProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: block.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "group relative rounded-lg border bg-background transition-all",
        isActive && "ring-2 ring-primary",
        isDragging && "opacity-50 shadow-lg"
      )}
      onClick={onSelect}
    >
      {/* Block Controls */}
      <div
        className={cn(
          "absolute -left-10 top-1/2 -translate-y-1/2 flex flex-col gap-1 opacity-0 transition-opacity",
          "group-hover:opacity-100",
          isActive && "opacity-100"
        )}
      >
        <button
          {...attributes}
          {...listeners}
          className="p-1 rounded hover:bg-muted cursor-grab active:cursor-grabbing"
        >
          <GripVertical className="h-4 w-4 text-muted-foreground" />
        </button>
      </div>

      {/* Block Actions */}
      <div
        className={cn(
          "absolute -right-2 top-2 flex items-center gap-1 opacity-0 transition-opacity",
          "group-hover:opacity-100",
          isActive && "opacity-100"
        )}
      >
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7"
          onClick={(e) => {
            e.stopPropagation();
            onAddBelow();
          }}
        >
          <Plus className="h-3 w-3" />
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-7 w-7">
              <Settings className="h-3 w-3" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={onDuplicate}>
              <Copy className="mr-2 h-4 w-4" />
              Duplikasi
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onMoveUp} disabled={isFirst}>
              <ChevronUp className="mr-2 h-4 w-4" />
              Pindah ke Atas
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onMoveDown} disabled={isLast}>
              <ChevronDown className="mr-2 h-4 w-4" />
              Pindah ke Bawah
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={onDelete}
              className="text-destructive focus:text-destructive"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Hapus
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Block Content */}
      <div className="p-4">
        <BlockEditor block={block} onUpdate={onUpdate} isActive={isActive} />
      </div>
    </div>
  );
}
