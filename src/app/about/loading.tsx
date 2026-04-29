import { HeaderSkeleton, Skeleton } from "@/components/ui/PageSkeleton";

export default function AboutLoading() {
  return (
    <div className="min-h-screen bg-bg-light dark:bg-bg-dark">
      <HeaderSkeleton />
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-6">
        <Skeleton className="h-10 w-40 mb-2" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-6 w-32 mt-6" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
        <Skeleton className="h-6 w-40 mt-6" />
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {Array.from({ length: 3 }, (_, i) => <Skeleton key={i} className="h-28 rounded-xl" />)}
        </div>
      </div>
    </div>
  );
}
