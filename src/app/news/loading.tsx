import { HeaderSkeleton, TickerSkeleton, Skeleton } from "@/components/ui/PageSkeleton";

export default function NewsLoading() {
  return (
    <div className="min-h-screen bg-bg-light dark:bg-bg-dark">
      <HeaderSkeleton />
      <TickerSkeleton />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-8">
          <Skeleton className="h-8 w-44 mb-2" />
          <Skeleton className="h-4 w-72" />
        </div>
        <Skeleton className="h-10 w-full max-w-md rounded-lg mb-5" />
        {/* Source tabs */}
        <div className="flex gap-2 mb-3">
          {Array.from({ length: 5 }, (_, i) => <Skeleton key={i} className="h-7 w-20 rounded-full" />)}
        </div>
        {/* Category tags */}
        <div className="flex gap-2 flex-wrap mb-7">
          {Array.from({ length: 8 }, (_, i) => <Skeleton key={i} className="h-7 w-16 rounded-full" />)}
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {Array.from({ length: 12 }, (_, i) => (
            <div key={i} className="rounded-xl border border-border-light dark:border-border-dark bg-bg-card-light dark:bg-bg-card-dark overflow-hidden">
              <Skeleton className="h-44" />
              <div className="p-4 space-y-2.5">
                <div className="flex gap-2">
                  <Skeleton className="h-5 w-16 rounded-full" />
                  <Skeleton className="h-5 w-20 rounded-full" />
                </div>
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-4/5" />
                <Skeleton className="h-3 w-full" />
                <Skeleton className="h-3 w-3/4" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
