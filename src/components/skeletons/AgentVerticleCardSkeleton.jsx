import { Skeleton } from "../ui/skeleton";

const AgentVerticleCardSkeleton = () => (
  <div className="max-w-auto cardBorder group rounded-2xl border bg-white">
    {/* Image section with aspect-square ratio */}
    <div className="relative aspect-square h-[250px] w-full px-4 pt-4">
      <Skeleton className="h-full w-full rounded-lg" />
      {/* Verified badge skeleton */}
      <div className="absolute left-6 top-6 flex items-center gap-1 rounded-md bg-white p-2">
        <Skeleton className="h-4 w-4" />
        <Skeleton className="h-4 w-16" />
      </div>
    </div>

    {/* Content section */}
    <div className="p-4">
      {/* Name skeleton */}
      <Skeleton className="mb-2 h-5 w-32" />
      {/* Email skeleton */}
      <Skeleton className="mb-4 h-3 w-40" />

      {/* Stats grid skeleton */}
      <div className="grid grid-cols-2 gap-4 rounded-lg border border-gray-100 p-3">
        <div className="text-center">
          <Skeleton className="mx-auto mb-1 h-5 w-8" />
          <Skeleton className="mx-auto h-3 w-16" />
        </div>
        <div className="text-center">
          <Skeleton className="mx-auto mb-1 h-5 w-8" />
          <Skeleton className="mx-auto h-3 w-16" />
        </div>
      </div>
    </div>
  </div>
);

export default AgentVerticleCardSkeleton;
