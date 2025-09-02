import { Skeleton } from "@/components/ui/skeleton";

const AgentHorizontalCardSkeleton = () => {
  return (
    <div className="w-full rounded-2xl border border-gray-200 bg-white p-4 shadow-sm md:p-6">
      <div className="flex flex-col items-center gap-4 sm:gap-2 md:flex-row md:gap-6">
        {/* Agent Image Section Skeleton */}
        <div className="h-full w-full md:w-[40%]">
          <Skeleton className="h-[300px] w-full rounded-2xl md:h-[350px]" />
        </div>

        {/* Agent Details Section Skeleton */}
        <div className="relative flex w-full flex-1 flex-col justify-between">
          {/* Header Section Skeleton */}
          <div className="space-y-4">
            {/* Name and Agent ID Skeleton */}
            <div className="flex items-center justify-between border-b pb-4">
              <Skeleton className="h-8 w-48" />
              <div className="flex flex-col items-center gap-2 sm:flex-row">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-6 w-20 rounded" />
              </div>
            </div>

            {/* Contact Information Skeleton */}
            <div className="space-y-3">
              {/* Address Skeleton */}
              <div className="flex items-center gap-3">
                <Skeleton className="h-12 w-12 rounded-lg" />
                <div className="flex flex-col gap-2">
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-4 w-64" />
                </div>
              </div>

              {/* Email Skeleton */}
              <div className="flex items-center gap-3">
                <Skeleton className="h-12 w-12 rounded-lg" />
                <div className="flex flex-col gap-2">
                  <Skeleton className="h-4 w-12" />
                  <Skeleton className="h-4 w-48" />
                </div>
              </div>

              {/* Phone Skeleton */}
              <div className="flex items-center gap-3">
                <Skeleton className="h-12 w-12 rounded-lg" />
                <div className="flex w-full flex-col items-start gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex flex-col gap-2">
                    <Skeleton className="h-4 w-8" />
                    <Skeleton className="h-4 w-32" />
                  </div>
                  <Skeleton className="h-4 w-24" />
                </div>
              </div>
            </div>
          </div>

          {/* Footer Section Skeleton */}
          <div className="mt-6 flex flex-col gap-4 border-t pt-6 sm:flex-row sm:items-center sm:justify-between">
            {/* Social Links Skeleton */}
            <div className="flex items-center gap-3">
              {[...Array(4)].map((_, index) => (
                <Skeleton
                  key={index}
                  className="h-8 w-8 rounded-full sm:h-10 sm:w-10"
                />
              ))}
            </div>

            {/* Chat Button Skeleton */}
            <Skeleton className="h-10 w-32 rounded-lg" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgentHorizontalCardSkeleton;
