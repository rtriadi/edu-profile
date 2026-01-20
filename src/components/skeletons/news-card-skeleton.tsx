import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export function NewsCardSkeleton() {
  return (
    <Card className="overflow-hidden">
      {/* Image placeholder */}
      <Skeleton className="aspect-video w-full" />
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2 mb-2">
          {/* Badge placeholder */}
          <Skeleton className="h-5 w-16 rounded-full" />
        </div>
        {/* Title placeholder */}
        <Skeleton className="h-6 w-full mb-1" />
        <Skeleton className="h-6 w-3/4" />
      </CardHeader>
      <CardContent>
        {/* Date and views placeholder */}
        <div className="flex items-center gap-4 mb-3">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-16" />
        </div>
        {/* Excerpt placeholder */}
        <Skeleton className="h-4 w-full mb-1" />
        <Skeleton className="h-4 w-5/6" />
      </CardContent>
    </Card>
  );
}

export function NewsGridSkeleton({ count = 9 }: { count?: number }) {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <NewsCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function NewsPageSkeleton() {
  return (
    <main className="flex-1">
      {/* Hero skeleton */}
      <section className="bg-gradient-to-r from-primary to-primary/80 py-12">
        <div className="container mx-auto px-4">
          <Skeleton className="h-10 w-48 bg-white/20 mb-2" />
          <Skeleton className="h-5 w-72 bg-white/20" />
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Posts Grid */}
          <div className="flex-1">
            <NewsGridSkeleton />
          </div>

          {/* Sidebar */}
          <aside className="w-full lg:w-72 space-y-6">
            <div className="rounded-lg border bg-card p-4">
              <Skeleton className="h-6 w-24 mb-4" />
              <div className="flex flex-wrap gap-2">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Skeleton key={i} className="h-8 w-20 rounded-full" />
                ))}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
