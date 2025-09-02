import { Skeleton } from "@/components/ui/skeleton";

const SimilarProjectsSkeleton = () => {
  return (
    <div className="py-16">
      <div className="container mx-auto px-4">
        {/* Header Section */}
        <div className="mb-8 flex items-center justify-between">
          <Skeleton className="h-9 w-48 md:w-56" />
          <Skeleton className="h-9 w-32 rounded-lg" />
        </div>

        {/* Carousel Section */}
        <div className="relative">
          {/* Carousel Content */}
          <div className="flex gap-4 overflow-hidden">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="min-w-0 max-w-[300px] flex-1">
                {/* Project Card Skeleton */}
                <div className="cardBg overflow-hidden rounded-lg shadow-sm">
                  {/* Project Image */}
                  <div className="relative">
                    <Skeleton className="h-48 w-full" />
                    {/* Category Badge */}
                    <div className="absolute left-3 top-3">
                      <Skeleton className="h-6 w-20 rounded-full bg-white/20" />
                    </div>
                    {/* Premium Badge */}
                    <div className="absolute right-3 top-3">
                      <Skeleton className="h-6 w-6 rounded-sm bg-white/20" />
                    </div>
                  </div>

                  {/* Project Details */}
                  <div className="p-4">
                    {/* Project Title */}
                    <Skeleton className="mb-2 h-5 w-full" />

                    {/* Location */}
                    <div className="mb-3 flex items-center gap-2">
                      <Skeleton className="h-4 w-4 rounded-sm" />
                      <Skeleton className="h-4 w-3/4" />
                    </div>

                    {/* Project Details */}
                    <div className="mb-3 space-y-2">
                      <div className="flex justify-between">
                        <Skeleton className="h-4 w-16" />
                        <Skeleton className="h-4 w-20" />
                      </div>
                      <div className="flex justify-between">
                        <Skeleton className="h-4 w-20" />
                        <Skeleton className="h-4 w-16" />
                      </div>
                    </div>

                    {/* Agent Info */}
                    <div className="border-t pt-3">
                      <div className="flex items-center gap-2">
                        <Skeleton className="h-8 w-8 rounded-full" />
                        <div className="flex-1">
                          <Skeleton className="mb-1 h-4 w-24" />
                          <Skeleton className="h-3 w-16" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Carousel Controls */}
          <div className="mt-6 flex justify-center gap-6">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div className="flex gap-2">
              {Array.from({ length: 3 }).map((_, index) => (
                <Skeleton key={index} className="h-2 w-2 rounded-full" />
              ))}
            </div>
            <Skeleton className="h-10 w-10 rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SimilarProjectsSkeleton;
