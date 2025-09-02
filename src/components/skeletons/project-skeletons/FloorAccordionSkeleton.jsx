import { Skeleton } from "@/components/ui/skeleton";

const FloorAccordionSkeleton = () => {
  return (
    <div className="cardBg newBorder mb-7 flex flex-col rounded-lg">
      {/* Header */}
      <div className="border-b p-5">
        <Skeleton className="h-6 w-32" />
      </div>

      {/* Accordion Items */}
      <div className="p-5">
        <div className="w-full space-y-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="rounded-md border border-slate-200 p-4">
              {/* Accordion Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Skeleton className="h-6 w-6 rounded-sm" />
                  <div>
                    <Skeleton className="mb-1 h-5 w-32" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                </div>
                <Skeleton className="h-5 w-5 rounded-sm" />
              </div>

              {/* Accordion Content (shown for first item to represent expanded state) */}
              {index === 0 && (
                <div className="mt-4 border-t pt-4">
                  <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                    {/* Floor Plan Details */}
                    <div className="space-y-3">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Skeleton className="mb-1 h-4 w-16" />
                          <Skeleton className="h-5 w-20" />
                        </div>
                        <div>
                          <Skeleton className="mb-1 h-4 w-20" />
                          <Skeleton className="h-5 w-24" />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Skeleton className="mb-1 h-4 w-24" />
                          <Skeleton className="h-5 w-16" />
                        </div>
                        <div>
                          <Skeleton className="mb-1 h-4 w-20" />
                          <Skeleton className="h-5 w-28" />
                        </div>
                      </div>
                    </div>

                    {/* Floor Plan Image */}
                    <div>
                      <Skeleton className="h-48 w-full rounded-lg" />
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FloorAccordionSkeleton;
