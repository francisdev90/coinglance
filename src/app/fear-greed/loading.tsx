import { HeaderSkeleton, TickerSkeleton, Skeleton } from "@/components/ui/PageSkeleton";

export default function FearGreedLoading() {
  return (
    <div className="min-h-screen bg-bg-light dark:bg-bg-dark">
      <HeaderSkeleton />
      <TickerSkeleton />
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-8">
          <Skeleton className="h-8 w-48 mb-2" />
          <Skeleton className="h-4 w-80" />
        </div>
        {/* Gauge */}
        <div className="rounded-xl border border-border-light dark:border-border-dark bg-bg-card-light dark:bg-bg-card-dark p-8 flex flex-col items-center gap-6">
          <Skeleton className="h-48 w-64 rounded-full" />
          <Skeleton className="h-10 w-32" />
          <Skeleton className="h-5 w-24 rounded-full" />
          <Skeleton className="h-4 w-48" />
        </div>
        {/* Historical */}
        <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3">
          {Array.from({ length: 4 }, (_, i) => (
            <div key={i} className="rounded-xl border border-border-light dark:border-border-dark bg-bg-card-light dark:bg-bg-card-dark p-4 flex flex-col items-center gap-2">
              <Skeleton className="h-3 w-16" />
              <Skeleton className="h-7 w-12" />
              <Skeleton className="h-4 w-14 rounded-full" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
