import { HeaderSkeleton, Skeleton } from "@/components/ui/PageSkeleton";

export default function ContactLoading() {
  return (
    <div className="min-h-screen bg-bg-light dark:bg-bg-dark">
      <HeaderSkeleton />
      <div className="max-w-xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Skeleton className="h-10 w-32 mb-2" />
        <Skeleton className="h-4 w-80 max-w-full mb-8" />
        <div className="space-y-5">
          {Array.from({ length: 4 }, (_, i) => (
            <div key={i} className="space-y-1.5">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-10 w-full rounded-lg" />
            </div>
          ))}
          <Skeleton className="h-32 w-full rounded-lg" />
          <Skeleton className="h-11 w-full rounded-lg" />
        </div>
      </div>
    </div>
  );
}
