import { Skeleton } from "@/components/ui/skeleton";

const PropertyInfoBannerSkeleton = () => {
  return (
    <div className="cardBg newBorder mt-5 rounded-lg p-5 md:rounded-2xl">
      {/* Property Title */}
      <Skeleton className="mb-3 h-8 w-3/4" />

      {/* Property Type and Price Row */}
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Skeleton className="h-6 w-20" />
          <Skeleton className="h-6 w-16" />
        </div>
        <Skeleton className="h-8 w-32" />
      </div>

      {/* Property Stats */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="text-center">
            <Skeleton className="mx-auto mb-2 h-8 w-8" />
            <Skeleton className="mx-auto h-4 w-16" />
            <Skeleton className="mx-auto mt-1 h-3 w-12" />
          </div>
        ))}
      </div>

      {/* Additional Info */}
      <div className="mt-4 flex flex-wrap gap-2">
        <Skeleton className="h-6 w-24" />
        <Skeleton className="h-6 w-20" />
        <Skeleton className="h-6 w-28" />
      </div>
    </div>
  );
};

export default PropertyInfoBannerSkeleton;
