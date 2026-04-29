import { HeaderSkeleton, TickerSkeleton, Skeleton } from "@/components/ui/PageSkeleton";

export default function CoinsLoading() {
  return (
    <div className="min-h-screen bg-bg-light dark:bg-bg-dark">
      <HeaderSkeleton />
      <TickerSkeleton />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Page header */}
        <div className="mb-8">
          <Skeleton className="h-8 w-56 mb-2" />
          <Skeleton className="h-4 w-36" />
        </div>
        {/* Controls */}
        <div className="flex gap-3 mb-5">
          <Skeleton className="h-10 w-64 rounded-lg" />
          <Skeleton className="h-10 w-36 rounded-lg" />
        </div>
        {/* Filter tabs */}
        <Skeleton className="h-9 w-80 rounded-lg mb-5" />
        {/* Table */}
        <div className="rounded-xl border border-border-light dark:border-border-dark bg-bg-card-light dark:bg-bg-card-dark overflow-hidden">
          <div className="px-4 py-3 border-b border-border-light dark:border-border-dark flex gap-6">
            {[12, 40, 24, 20, 20, 20, 28, 28].map((w, i) => (
              <Skeleton key={i} className="h-3" style={{ width: `${w * 3}px` }} />
            ))}
          </div>
          {Array.from({ length: 10 }, (_, i) => (
            <div key={i} className="flex items-center gap-4 px-4 py-3.5 border-b border-border-light dark:border-border-dark last:border-0">
              <Skeleton className="h-4 w-6" />
              <Skeleton className="h-8 w-8 rounded-full flex-shrink-0" />
              <div className="flex flex-col gap-1.5 min-w-[120px]">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-3 w-12" />
              </div>
              <Skeleton className="h-4 w-20 ml-auto" />
              <Skeleton className="h-4 w-14 hidden sm:block" />
              <Skeleton className="h-4 w-14" />
              <Skeleton className="h-4 w-14 hidden md:block" />
              <Skeleton className="h-4 w-20 hidden lg:block" />
              <Skeleton className="h-4 w-20 hidden lg:block" />
              <Skeleton className="h-7 w-16 rounded-md ml-2" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
