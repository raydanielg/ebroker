import { Skeleton } from "@/components/ui/skeleton";

const VirtualTourSkeleton = () => {
  return (
    <div className="cardBg newBorder mb-5 flex flex-col rounded-lg md:rounded-2xl">
      {/* Section Header */}
      <div className="blackTextColor border-b p-5">
        <Skeleton className="h-6 w-32" />
      </div>

      {/* Virtual Tour Container */}
      <div className="flex h-[500px] justify-center rounded p-5">
        <Skeleton className="h-full w-full rounded-lg" />
      </div>
    </div>
  );
};

export default VirtualTourSkeleton;
