import { Skeleton } from "@/components/ui/skeleton";

const SimilarPropertySliderSkeleton = () => {
  return (
    <div className="mb-8">
      {/* Section Header */}
      <div className="mb-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="mt-2 h-4 w-64" />
      </div>

      {/* Property Cards Grid */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="cardBg newBorder rounded-lg md:rounded-2xl"
          >
            {/* Property Image */}
            <div className="relative">
              <Skeleton className="h-48 w-full rounded-t-lg md:rounded-t-2xl" />
              {/* Price badge */}
              <div className="absolute right-2 top-2">
                <Skeleton className="h-6 w-20 rounded-full" />
              </div>
              {/* Heart icon */}
              <div className="absolute left-2 top-2">
                <Skeleton className="h-8 w-8 rounded-full" />
              </div>
            </div>

            {/* Property Details */}
            <div className="p-4">
              {/* Property Title */}
              <Skeleton className="mb-2 h-5 w-3/4" />

              {/* Property Address */}
              <Skeleton className="mb-3 h-4 w-full" />

              {/* Property Features */}
              <div className="mb-3 flex gap-4">
                <div className="flex items-center gap-1">
                  <Skeleton className="h-4 w-4" />
                  <Skeleton className="h-3 w-8" />
                </div>
                <div className="flex items-center gap-1">
                  <Skeleton className="h-4 w-4" />
                  <Skeleton className="h-3 w-8" />
                </div>
                <div className="flex items-center gap-1">
                  <Skeleton className="h-4 w-4" />
                  <Skeleton className="h-3 w-12" />
                </div>
              </div>

              {/* Property Type and Date */}
              <div className="flex items-center justify-between">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-3 w-20" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SimilarPropertySliderSkeleton;
