import { HeaderSkeleton, TickerSkeleton, Skeleton } from "@/components/ui/PageSkeleton";

export default function ConverterLoading() {
  return (
    <div className="min-h-screen bg-bg-light dark:bg-bg-dark">
      <HeaderSkeleton />
      <TickerSkeleton />
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-8">
          <Skeleton className="h-8 w-44 mb-2" />
          <Skeleton className="h-4 w-72" />
        </div>
        <div className="rounded-xl border border-border-light dark:border-border-dark bg-bg-card-light dark:bg-bg-card-dark p-6 space-y-5">
          <div className="space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-12 w-full rounded-lg" />
          </div>
          <div className="flex items-center justify-center">
            <Skeleton className="h-9 w-9 rounded-full" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-12 w-full rounded-lg" />
          </div>
          <Skeleton className="h-12 w-full rounded-lg" />
        </div>
        <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3">
          {Array.from({ length: 8 }, (_, i) => <Skeleton key={i} className="h-16 rounded-xl" />)}
        </div>
      </div>
    </div>
  );
}
