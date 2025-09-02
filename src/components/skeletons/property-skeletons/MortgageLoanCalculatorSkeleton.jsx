import { Skeleton } from "@/components/ui/skeleton";

const MortgageLoanCalculatorSkeleton = () => {
  return (
    <div className="cardBg newBorder mb-5 flex flex-col rounded-lg md:rounded-2xl">
      {/* Section Header */}
      <div className="blackTextColor border-b p-5">
        <Skeleton className="h-6 w-48" />
      </div>

      {/* Calculator Form */}
      <div className="p-5">
        <div className="space-y-4">
          {/* Input Fields */}
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index}>
              <Skeleton className="mb-2 h-4 w-24" />
              <Skeleton className="h-10 w-full rounded" />
            </div>
          ))}

          {/* Calculate Button */}
          <Skeleton className="h-10 w-full rounded" />

          {/* Results */}
          <div className="mt-6 space-y-3">
            <Skeleton className="h-5 w-32" />
            <div className="space-y-2">
              <div className="flex justify-between">
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-4 w-20" />
              </div>
              <div className="flex justify-between">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-16" />
              </div>
              <div className="flex justify-between">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-4 w-24" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MortgageLoanCalculatorSkeleton;
