import { HeaderSkeleton, TickerSkeleton, Skeleton } from "@/components/ui/PageSkeleton";

export default function CoinLoading() {
  return (
    <div className="min-h-screen bg-bg-light dark:bg-bg-dark">
      <HeaderSkeleton />
      <TickerSkeleton />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Breadcrumb */}
        <Skeleton className="h-4 w-48" />

        {/* Coin Header */}
        <div className="flex items-start gap-4">
          <Skeleton className="h-16 w-16 rounded-full flex-shrink-0" />
          <div className="flex flex-col gap-2 flex-1">
            <Skeleton className="h-8 w-48" />
            <div className="flex gap-2">
              <Skeleton className="h-5 w-16 rounded-full" />
              <Skeleton className="h-5 w-20 rounded-full" />
              <Skeleton className="h-5 w-16 rounded-full" />
            </div>
          </div>
        </div>

        {/* Price Header */}
        <div className="flex items-end gap-4">
          <Skeleton className="h-12 w-48" />
          <Skeleton className="h-7 w-20 rounded-full" />
          <Skeleton className="h-7 w-20 rounded-full" />
        </div>

        {/* Chart */}
        <div className="p-5 rounded-xl border border-border-light dark:border-border-dark bg-bg-card-light dark:bg-bg-card-dark">
          <div className="flex items-center justify-between mb-5">
            <Skeleton className="h-4 w-24" />
            <div className="flex gap-1">
              {Array.from({ length: 7 }, (_, i) => <Skeleton key={i} className="h-7 w-10 rounded-md" />)}
            </div>
          </div>
          <Skeleton className="h-64 sm:h-72 rounded-lg" />
        </div>

        {/* Key Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {Array.from({ length: 8 }, (_, i) => (
            <div key={i} className="p-4 rounded-xl border border-border-light dark:border-border-dark bg-bg-card-light dark:bg-bg-card-dark">
              <Skeleton className="h-3 w-20 mb-2" />
              <Skeleton className="h-5 w-24" />
            </div>
          ))}
        </div>

        {/* Buy Section */}
        <div className="rounded-2xl border border-accent-gold/25 bg-accent-gold/[0.04] p-6">
          <Skeleton className="h-7 w-40 mb-2" />
          <Skeleton className="h-4 w-64 mb-6" />
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {Array.from({ length: 6 }, (_, i) => <Skeleton key={i} className="h-36 rounded-xl" />)}
          </div>
        </div>

        {/* About */}
        <div className="p-6 rounded-xl border border-border-light dark:border-border-dark bg-bg-card-light dark:bg-bg-card-dark space-y-3">
          <Skeleton className="h-5 w-32 mb-4" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-4/5" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
        </div>
      </div>
    </div>
  );
}
