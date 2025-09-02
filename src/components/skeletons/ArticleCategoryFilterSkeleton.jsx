import { Skeleton } from "../ui/skeleton";

const ArticleCategoryFilterSkeleton = () => {
  return (
    <div className="primaryBackgroundBg rounded-lg p-4 md:rounded-2xl">
      {/* Header skeleton */}
      <div className="mb-6">
        <Skeleton className="h-7 w-24" />
      </div>

      {/* Category items skeleton */}
      <div className="grid grid-cols-1 gap-4">
        {/* General category skeleton */}
        <div className="w-full rounded-lg bg-white px-6 py-4 shadow-sm">
          <div className="flex items-center justify-between">
            <Skeleton className="h-5 w-20" />
            <Skeleton className="h-5 w-8" />
          </div>
        </div>

        {/* Other categories skeleton */}
        {Array(8)
          .fill(0)
          .map((_, index) => (
            <div
              key={index}
              className="w-full rounded-lg bg-white px-6 py-4 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-5 w-8" />
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default ArticleCategoryFilterSkeleton;
