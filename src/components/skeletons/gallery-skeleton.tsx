import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";

export function GalleryCardSkeleton() {
  return (
    <Card className="overflow-hidden">
      {/* Image placeholder */}
      <Skeleton className="aspect-video w-full" />
      <div className="p-4">
        {/* Title placeholder */}
        <Skeleton className="h-5 w-full mb-2" />
        <Skeleton className="h-5 w-2/3" />
        {/* Meta info placeholder */}
        <div className="flex items-center gap-4 mt-3">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-16" />
        </div>
      </div>
    </Card>
  );
}

export function GalleryGridSkeleton({ count = 12 }: { count?: number }) {
  return (
    <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <GalleryCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function GalleryPageSkeleton() {
  return (
    <main className="flex-1">
      {/* Hero skeleton */}
      <section className="bg-gradient-to-r from-primary to-primary/80 py-12">
        <div className="container mx-auto px-4">
          <Skeleton className="h-10 w-32 bg-white/20 mb-2" />
          <Skeleton className="h-5 w-64 bg-white/20" />
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        {/* Filter tabs skeleton */}
        <div className="flex gap-2 mb-8">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-10 w-24 rounded-full" />
          ))}
        </div>

        {/* Gallery Grid */}
        <GalleryGridSkeleton />
      </div>
    </main>
  );
}
