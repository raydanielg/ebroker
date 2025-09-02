import { Skeleton } from "@/components/ui/skeleton";

const ProjectGallerySkeleton = () => {
  return (
    <div className="mb-3">
      {/* Single image layout skeleton */}
      <div className="grid grid-cols-12 gap-2">
        <div className="col-span-12">
          <div className="relative overflow-hidden rounded-lg">
            <Skeleton className="h-64 w-full md:h-80 lg:h-96" />
            {/* Gallery counter skeleton */}
            <div className="absolute bottom-4 right-4">
              <Skeleton className="h-8 w-16 rounded-full bg-black/20" />
            </div>
          </div>
        </div>
      </div>

      {/* Thumbnail navigation skeleton */}
      <div className="mt-4 flex justify-center">
        <div className="flex gap-2 overflow-hidden rounded-lg bg-white p-2">
          {Array.from({ length: 6 }).map((_, index) => (
            <Skeleton
              key={index}
              className="h-12 w-12 flex-shrink-0 rounded-md md:h-16 md:w-16"
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProjectGallerySkeleton;
