import { Skeleton } from "@/components/ui/skeleton";

const UnlockPremiumPropertyCardSkeleton = () => {
  return (
    <div className="relative h-full min-h-[400px] w-full overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
      {/* Background Image Skeleton */}
      <Skeleton className="absolute inset-0 h-full w-full" />

      {/* Dark overlay placeholder */}
      <div className="absolute inset-0 bg-black/20"></div>

      <div className="absolute bottom-0 left-0 right-0 z-10 flex h-full flex-col items-center justify-between gap-4">
        {/* Header Section Skeleton */}
        <div className="flex w-full flex-col gap-2 p-4 text-center md:p-4 md:text-start lg:p-6">
          {/* Title Skeleton */}
          <Skeleton className="mx-auto h-8 w-64 bg-white/20 md:mx-0" />

          {/* Description Skeleton */}
          <div className="space-y-2">
            <Skeleton className="mx-auto h-4 w-72 bg-white/20 md:mx-0" />
            <Skeleton className="mx-auto h-4 w-48 bg-white/20 md:mx-0" />
          </div>
        </div>

        {/* Footer Section Skeleton */}
        <div className="flex flex-col gap-2 p-4 md:p-4 lg:p-6">
          {/* Subscribe Button Skeleton */}
          <Skeleton className="h-10 w-32 rounded-lg bg-white/80" />

          {/* Footer Text Skeleton */}
          <Skeleton className="h-4 w-48 bg-white/20" />
        </div>
      </div>
    </div>
  );
};

export default UnlockPremiumPropertyCardSkeleton;
