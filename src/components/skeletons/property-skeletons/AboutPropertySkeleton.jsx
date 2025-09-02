import { Skeleton } from "@/components/ui/skeleton";

const AboutPropertySkeleton = () => {
  return (
    <div className="cardBg newBorder mb-5 flex flex-col rounded-lg md:rounded-2xl">
      {/* Section Header */}
      <div className="blackTextColor border-b p-5">
        <Skeleton className="h-6 w-40" />
      </div>

      {/* Description Content */}
      <div className="p-5">
        <div className="space-y-3">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-11/12" />
          <Skeleton className="h-4 w-4/5" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-5/6" />
        </div>
      </div>
    </div>
  );
};

export default AboutPropertySkeleton;
