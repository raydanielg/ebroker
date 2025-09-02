import { Skeleton } from "@/components/ui/skeleton";

const FileAttachmentsSkeleton = () => {
  return (
    <div className="cardBg newBorder mb-5 flex flex-col rounded-lg md:rounded-2xl">
      {/* Section Header */}
      <div className="blackTextColor border-b p-5">
        <Skeleton className="h-6 w-40" />
      </div>

      {/* File List */}
      <div className="p-5">
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="flex items-center gap-4 rounded-lg border p-3"
            >
              {/* File Icon */}
              <Skeleton className="h-10 w-10 rounded" />

              {/* File Details */}
              <div className="flex-1">
                <Skeleton className="mb-1 h-4 w-48" />
                <Skeleton className="h-3 w-24" />
              </div>

              {/* Download Button */}
              <Skeleton className="h-8 w-20 rounded" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FileAttachmentsSkeleton;
