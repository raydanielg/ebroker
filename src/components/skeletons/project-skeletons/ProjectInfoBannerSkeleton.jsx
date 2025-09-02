import { Skeleton } from "@/components/ui/skeleton";

const ProjectInfoBannerSkeleton = () => {
  return (
    <div className="brandBg relative mb-4 overflow-hidden rounded-lg md:mb-7">
      <div className="relative flex min-h-[180px] flex-col justify-between p-6">
        {/* Top Section */}
        <div className="flex items-start justify-between">
          {/* Category Badge Skeleton */}
          <div className="flex items-center gap-2 rounded-lg bg-white/20 px-3 py-1">
            <Skeleton className="h-4 w-4 rounded-sm" />
            <Skeleton className="h-4 w-20" />
          </div>

          {/* Project Type Badge Skeleton */}
          <Skeleton className="h-8 w-24 rounded-lg bg-white/20" />
        </div>

        {/* Bottom Section */}
        <div className="mt-6">
          {/* Project Title */}
          <Skeleton className="mb-3 h-7 w-3/4 bg-white/20 md:h-8" />

          {/* Location */}
          <div className="flex items-center gap-2">
            <Skeleton className="h-4 w-4 rounded-sm bg-white/20" />
            <Skeleton className="h-4 w-48 bg-white/20" />
          </div>

          {/* Rating */}
          <div className="mt-3 flex items-center gap-2">
            <div className="flex gap-1">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-4 w-4 rounded-sm bg-white/20" />
              ))}
            </div>
            <Skeleton className="h-4 w-16 bg-white/20" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectInfoBannerSkeleton;
