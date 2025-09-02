import { Skeleton } from "@/components/ui/skeleton";

const ChatHeaderSkeleton = ({ isMobile = false }) => {
    return (
        <div className="flex items-center justify-between gap-3 border-b px-2 py-4 md:p-4">
            <div className="flex items-center rtl:gap-2">
                {/* Back button skeleton for mobile */}
                {isMobile && (
                    <Skeleton className="mr-2 h-5 w-5" />
                )}

                {/* Profile picture skeleton */}
                <div className="relative">
                    <Skeleton className="mr-3 h-7 w-7 md:h-12 md:w-12 rounded-full" />
                    {/* Active status indicator skeleton (sometimes visible) */}
                    <Skeleton className="absolute -bottom-1 right-[10px] h-4 w-4 rounded-full" />
                </div>

                {/* Chat info skeleton */}
                <div className="flex flex-col">
                    {/* Name skeleton */}
                    <Skeleton className="h-4 w-32 md:w-40 mb-1" />
                    {/* Status/subtitle skeleton */}
                    <Skeleton className="h-3 w-20 md:w-28" />
                </div>
            </div>

            {/* Actions skeleton */}
            <div className="flex items-center gap-2">
                {/* Action buttons skeleton */}
                <Skeleton className="h-8 w-8 rounded" />
                <Skeleton className="h-8 w-8 rounded" />
                {/* Menu button skeleton */}
                <Skeleton className="h-8 w-8 rounded" />
            </div>
        </div>
    );
};

export default ChatHeaderSkeleton;
