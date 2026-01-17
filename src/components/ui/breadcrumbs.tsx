import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";
import { cn } from "@/lib/utils";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  showHome?: boolean;
  className?: string;
  separator?: React.ReactNode;
}

export function Breadcrumbs({ 
  items, 
  showHome = true, 
  className,
  separator = <ChevronRight className="h-4 w-4 text-muted-foreground/50" />
}: BreadcrumbsProps) {
  const allItems = showHome 
    ? [{ label: "Beranda", href: "/" }, ...items]
    : items;

  return (
    <nav 
      aria-label="Breadcrumb" 
      className={cn("flex items-center text-sm", className)}
    >
      <ol className="flex items-center gap-1.5 flex-wrap">
        {allItems.map((item, index) => {
          const isLast = index === allItems.length - 1;
          const isFirst = index === 0 && showHome;

          return (
            <li key={index} className="flex items-center gap-1.5">
              {index > 0 && separator}
              
              {isLast ? (
                <span 
                  className="font-medium text-foreground truncate max-w-[200px]"
                  aria-current="page"
                >
                  {item.label}
                </span>
              ) : item.href ? (
                <Link
                  href={item.href}
                  className={cn(
                    "text-muted-foreground hover:text-foreground transition-colors truncate max-w-[200px]",
                    "flex items-center gap-1"
                  )}
                >
                  {isFirst && <Home className="h-4 w-4" />}
                  {!isFirst && item.label}
                </Link>
              ) : (
                <span className="text-muted-foreground truncate max-w-[200px]">
                  {isFirst && <Home className="h-4 w-4" />}
                  {!isFirst && item.label}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

// Simple breadcrumb for admin pages
interface AdminBreadcrumbsProps {
  current: string;
  parent?: { label: string; href: string };
  className?: string;
}

export function AdminBreadcrumbs({ current, parent, className }: AdminBreadcrumbsProps) {
  const items: BreadcrumbItem[] = [
    { label: "Dashboard", href: "/admin" },
  ];

  if (parent) {
    items.push(parent);
  }

  items.push({ label: current });

  return <Breadcrumbs items={items} showHome={false} className={className} />;
}

// Breadcrumb for public pages
interface PublicBreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
}

export function PublicBreadcrumbs({ items, className }: PublicBreadcrumbsProps) {
  return (
    <div className={cn("bg-muted/50 border-b", className)}>
      <div className="container mx-auto px-4 py-3">
        <Breadcrumbs items={items} showHome={true} />
      </div>
    </div>
  );
}
