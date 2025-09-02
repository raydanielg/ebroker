import { Skeleton } from "@/components/ui/skeleton";

const PropertyAddressSkeleton = () => {
  return (
    <div className="cardBg newBorder mb-5 flex flex-col rounded-lg md:rounded-2xl">
      {/* Section Header */}
      <div className="blackTextColor border-b p-5">
        <Skeleton className="h-6 w-36" />
      </div>

      <div className="p-5">
        {/* Address Details */}
        <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="flex items-center justify-between">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-32" />
            </div>
          ))}
        </div>

        {/* Map Skeleton */}
        <div className="relative">
          <Skeleton className="h-[400px] w-full rounded-lg" />
          {/* Map controls skeleton */}
          <div className="absolute right-2 top-2 space-y-2">
            <Skeleton className="h-8 w-8 rounded" />
            <Skeleton className="h-8 w-8 rounded" />
          </div>
          {/* Show on map button skeleton */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
            <Skeleton className="h-10 w-32 rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyAddressSkeleton;
