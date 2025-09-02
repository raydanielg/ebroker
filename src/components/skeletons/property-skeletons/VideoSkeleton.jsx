import { Skeleton } from "@/components/ui/skeleton";

const VideoSkeleton = () => {
  return (
    <div className="cardBg newBorder mb-5 flex flex-col rounded-lg md:rounded-2xl">
      {/* Section Header */}
      <div className="blackTextColor border-b p-5">
        <Skeleton className="h-6 w-24" />
      </div>

      {/* Video Player Skeleton */}
      <div className="p-5">
        <div className="relative">
          <Skeleton className="h-[300px] w-full rounded-lg md:h-[400px]" />
          {/* Play button skeleton */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            <Skeleton className="h-16 w-16 rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoSkeleton;
