import { HeaderSkeleton, TickerSkeleton, Skeleton } from "@/components/ui/PageSkeleton";

export default function P2PRatesLoading() {
  return (
    <div className="min-h-screen bg-bg-light dark:bg-bg-dark">
      <HeaderSkeleton />
      <TickerSkeleton />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-8">
          <Skeleton className="h-8 w-36 mb-2" />
          <Skeleton className="h-4 w-80" />
        </div>
        {/* Currency tabs */}
        <div className="flex gap-2 mb-6">
          {Array.from({ length: 5 }, (_, i) => <Skeleton key={i} className="h-9 w-16 rounded-lg" />)}
        </div>
        {/* Table */}
        <div className="rounded-xl border border-border-light dark:border-border-dark bg-bg-card-light dark:bg-bg-card-dark overflow-hidden">
          <div className="flex gap-4 px-4 py-3 border-b border-border-light dark:border-border-dark">
            {[60, 80, 80, 80, 80].map((w, i) => <Skeleton key={i} className="h-3" style={{ width: w }} />)}
          </div>
          {Array.from({ length: 8 }, (_, i) => (
            <div key={i} className="flex items-center gap-4 px-4 py-3.5 border-b border-border-light dark:border-border-dark last:border-0">
              <Skeleton className="h-8 w-8 rounded-full flex-shrink-0" />
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-20 ml-auto" />
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-7 w-16 rounded-md" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
