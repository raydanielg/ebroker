import { Skeleton } from "@/components/ui/skeleton";

const ProjectCardSkeleton = () => {
  return (
    <div className="group mx-auto flex w-full max-w-md flex-col gap-4 overflow-hidden rounded-2xl">
      {/* Image Carousel Section */}
      <div className="relative h-full w-full">
        {/* Status Badge - Top Left */}
        <div className="absolute left-4 top-4 z-10">
          <Skeleton className="h-7 w-16 rounded" />
        </div>

        {/* Favorite Button - Top Right */}
        <div className="absolute right-4 top-4 z-10">
          <Skeleton className="h-9 w-9 rounded-lg" />
        </div>

        {/* Main Image with 4:3 aspect ratio */}
        <div className="relative aspect-[4/3] w-full rounded-b-2xl">
          <Skeleton className="h-full w-full rounded-b-2xl" />
        </div>

        {/* Carousel Navigation Buttons (when multiple images) */}
        <div className="absolute left-0 top-1/2 z-20 -translate-y-1/2">
          <Skeleton className="h-8 w-8 rounded-none sm:h-10 sm:w-10" />
        </div>
        <div className="absolute right-0 top-1/2 z-20 -translate-y-1/2">
          <Skeleton className="h-8 w-8 rounded-none sm:h-10 sm:w-10" />
        </div>

        {/* Carousel Dots */}
        <div className="absolute bottom-4 left-1/2 z-30 flex -translate-x-1/2 space-x-2">
          {[...Array(3)].map((_, index) => (
            <Skeleton key={index} className="h-2 w-2 rounded-full" />
          ))}
        </div>
      </div>

      {/* Content Section - Dark Background */}
      <div className="brandBg rounded-t-2xl p-4 text-white">
        <div className="flex w-full flex-col justify-center gap-3 sm:flex-row sm:items-end sm:justify-between">
          {/* Left Side - Category, Title, Location */}
          <div className="flex w-fit flex-col">
            {/* Category Badge with Icon */}
            <div className="mb-3">
              <div className="flex w-fit gap-2">
                <Skeleton className="h-7 w-20 rounded-lg bg-white/80" />
              </div>
            </div>

            {/* Title */}
            <Skeleton className="mb-1 h-5 w-36 bg-white/80 sm:h-6" />

            {/* Location */}
            <Skeleton className="h-4 w-28 bg-white/50" />
          </div>

          {/* Right Side - Premium Badge */}
          <div className="ml-4">
            <Skeleton className="h-10 w-10 rounded-full bg-white/80 sm:w-24" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectCardSkeleton;
