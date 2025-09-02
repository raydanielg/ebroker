import { Skeleton } from "../ui/skeleton";

const CategoryHorizontalCardSkeleton = () => (
  <div className="relative flex items-center gap-6 overflow-hidden rounded-2xl border bg-white p-4 transition-colors duration-300 ease-in-out">
    {/* Icon container skeleton */}
    <div className="flex items-center justify-center rounded-[8px] bg-[#F5F5F4] p-3">
      <Skeleton className="h-12 w-12" />
    </div>

    {/* Content section skeleton */}
    <div className="flex flex-col gap-3">
      {/* Category name skeleton */}
      <Skeleton className="h-6 w-32" />
      {/* Properties count skeleton */}
      <Skeleton className="h-4 w-24" />
    </div>

    {/* View Properties button skeleton (hidden by default, like the original) */}
    <div className="absolute bottom-0 left-[110px] flex translate-y-full items-center justify-center gap-1 bg-white p-2">
      <Skeleton className="h-4 w-20" />
      <Skeleton className="h-4 w-4" />
    </div>
  </div>
);

export default CategoryHorizontalCardSkeleton;
