import { Skeleton } from "@/components/ui/skeleton";

const ChatInputSkeleton = ({ isMobile = false }) => {
    return (
        <div className="primaryBackgroundBg m-3 rounded-lg relative flex flex-col gap-3 p-3">
            {isMobile ? (
                // Mobile View Input Skeleton
                <div className="flex w-full flex-row gap-2 md:gap-3 md:hidden">
                    {/* File attachment button skeleton */}
                    <Skeleton className="h-10 w-10 rounded-md" />

                    {/* Input field skeleton */}
                    <Skeleton className="flex-1 h-10 rounded-md" />

                    {/* Action buttons skeleton */}
                    <div className="flex justify-center gap-2">
                        <Skeleton className="h-10 w-10 rounded" />
                        <Skeleton className="h-10 w-16 rounded-lg" />
                    </div>
                </div>
            ) : (
                // Desktop View Input Skeleton
                <div className="hidden w-full gap-3 md:flex md:flex-row md:items-center">
                    {/* File attachment button skeleton */}
                    <Skeleton className="h-10 w-10 rounded-md" />

                    {/* Input field skeleton */}
                    <Skeleton className="flex-1 h-10 rounded-full" />

                    {/* Action buttons skeleton */}
                    <div className="flex justify-center gap-2">
                        <Skeleton className="h-10 w-10 rounded" />
                        <Skeleton className="h-10 w-20 rounded-lg" />
                    </div>
                </div>
            )}
        </div>
    );
};

export default ChatInputSkeleton;
