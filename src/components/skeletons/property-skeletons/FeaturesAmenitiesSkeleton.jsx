import { Skeleton } from "@/components/ui/skeleton";

const FeaturesAmenitiesSkeleton = () => {
  return (
    <div className="cardBg newBorder mb-5 flex flex-col rounded-lg md:rounded-2xl">
      {/* Section Header */}
      <div className="blackTextColor border-b p-5">
        <Skeleton className="h-6 w-48" />
      </div>

      {/* Features Grid */}
      <div className="p-5">
        <div className="mb-6">
          <Skeleton className="mb-4 h-5 w-32" />
          <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, index) => (
              <div key={index} className="flex items-center gap-2">
                <Skeleton className="h-5 w-5 rounded-full" />
                <Skeleton className="h-4 w-20" />
              </div>
            ))}
          </div>
        </div>

        {/* Amenities */}
        <div className="mb-6">
          <Skeleton className="mb-4 h-5 w-28" />
          <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
            {Array.from({ length: 12 }).map((_, index) => (
              <div key={index} className="flex items-center gap-2">
                <Skeleton className="h-5 w-5 rounded-full" />
                <Skeleton className="h-4 w-24" />
              </div>
            ))}
          </div>
        </div>

        {/* Additional Info */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="flex items-center justify-between">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-4 w-20" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FeaturesAmenitiesSkeleton;
