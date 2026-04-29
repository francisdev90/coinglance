import { HeaderSkeleton, TickerSkeleton, Skeleton } from "@/components/ui/PageSkeleton";

export default function ExchangesLoading() {
  return (
    <div className="min-h-screen bg-bg-light dark:bg-bg-dark">
      <HeaderSkeleton />
      <TickerSkeleton />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-8">
          <Skeleton className="h-8 w-52 mb-2" />
          <Skeleton className="h-4 w-96 max-w-full" />
        </div>
        <Skeleton className="h-16 w-full rounded-xl mb-6" />
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {Array.from({ length: 8 }, (_, i) => (
            <div key={i} className="rounded-xl border border-border-light dark:border-border-dark bg-bg-card-light dark:bg-bg-card-dark p-5 flex flex-col gap-4">
              <div className="flex items-start gap-3">
                <Skeleton className="w-11 h-11 rounded-xl flex-shrink-0" />
                <div className="flex flex-col gap-1.5 flex-1">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-3 w-full" />
                  <Skeleton className="h-3 w-3/4" />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {Array.from({ length: 3 }, (_, j) => <Skeleton key={j} className="h-12 rounded-lg" />)}
              </div>
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <div className="flex gap-1.5 flex-wrap">
                {Array.from({ length: 4 }, (_, j) => <Skeleton key={j} className="h-5 w-16 rounded-full" />)}
              </div>
              <Skeleton className="h-10 w-full rounded-lg mt-auto" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
