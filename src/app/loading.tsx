import { HeaderSkeleton, TickerSkeleton, Skeleton } from "@/components/ui/PageSkeleton";

export default function HomeLoading() {
  return (
    <div className="min-h-screen bg-bg-light dark:bg-bg-dark">
      <HeaderSkeleton />
      <TickerSkeleton />
      {/* Hero */}
      <div className="py-16 px-4 max-w-7xl mx-auto">
        <Skeleton className="h-10 w-2/3 mx-auto mb-4" />
        <Skeleton className="h-5 w-1/2 mx-auto mb-8" />
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-2xl mx-auto mb-10">
          {Array.from({ length: 4 }, (_, i) => <Skeleton key={i} className="h-20 rounded-xl" />)}
        </div>
      </div>
      {/* Market stats */}
      <div className="px-4 max-w-7xl mx-auto pb-10">
        <Skeleton className="h-6 w-40 mb-5" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {Array.from({ length: 4 }, (_, i) => <Skeleton key={i} className="h-28 rounded-xl" />)}
        </div>
        {/* Table preview */}
        <Skeleton className="h-6 w-40 mb-4" />
        <div className="rounded-xl border border-border-light dark:border-border-dark overflow-hidden">
          {Array.from({ length: 5 }, (_, i) => (
            <div key={i} className="flex items-center gap-4 px-4 py-3.5 border-b border-border-light dark:border-border-dark last:border-0">
              <Skeleton className="h-4 w-6" />
              <Skeleton className="h-8 w-8 rounded-full flex-shrink-0" />
              <Skeleton className="h-4 flex-1 max-w-[120px]" />
              <Skeleton className="h-4 w-20 ml-auto" />
              <Skeleton className="h-4 w-16" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
