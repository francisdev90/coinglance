import { HeaderSkeleton, Skeleton } from "@/components/ui/PageSkeleton";

export default function AffiliateDisclosureLoading() {
  return (
    <div className="min-h-screen bg-bg-light dark:bg-bg-dark">
      <HeaderSkeleton />
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-4">
        <Skeleton className="h-9 w-56 mb-6" />
        {Array.from({ length: 4 }, (_, s) => (
          <div key={s} className="space-y-3">
            <Skeleton className="h-5 w-40" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-4/5" />
          </div>
        ))}
      </div>
    </div>
  );
}
