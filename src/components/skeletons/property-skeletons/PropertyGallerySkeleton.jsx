import { Skeleton } from "@/components/ui/skeleton";

const PropertyGallerySkeleton = () => {
  return (
    <div className="mb-3">
      {/* Main Image Skeleton */}
      <div className="relative mb-3">
        <Skeleton className="h-[400px] w-full rounded-lg md:h-[500px] lg:h-[600px]" />
        {/* Gallery counter skeleton */}
        <div className="absolute bottom-4 right-4">
          <Skeleton className="h-8 w-16 rounded-full" />
        </div>
      </div>

      {/* Thumbnail Gallery Skeleton */}
      <div className="grid grid-cols-4 gap-2 md:grid-cols-6 lg:grid-cols-8">
        {Array.from({ length: 8 }).map((_, index) => (
          <Skeleton
            key={index}
            className="aspect-square h-16 w-16 rounded-lg md:h-20 md:w-20"
          />
        ))}
      </div>
    </div>
  );
};

export default PropertyGallerySkeleton;
