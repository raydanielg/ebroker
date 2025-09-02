import { Skeleton } from "@/components/ui/skeleton";

const ChatListSkeleton = ({ count = 5 }) => {
    return (
        <div className="w-full">
            {Array.from({ length: count }).map((_, index) => (
                <div key={index} className="flex items-center p-4 border-b">
                    {/* Profile picture skeleton */}
                    <div className="relative">
                        <Skeleton className="h-7 w-7 md:h-12 md:w-12 rounded-full bg-gray-200" />
                    </div>

                    {/* Content skeleton */}
                    <div className="ml-3 flex-1 overflow-hidden">
                        <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center flex-1">
                                {/* Name skeleton */}
                                <Skeleton className="h-4 w-24 md:w-32" />
                                {/* Blocked badge skeleton (sometimes visible) */}
                                {index % 3 === 0 && (
                                    <Skeleton className="ml-2 h-5 w-16 rounded" />
                                )}
                            </div>
                            {/* Time skeleton */}
                            <Skeleton className="h-3 w-12" />
                        </div>

                        <div className="flex items-center justify-between">
                            {/* Message/title skeleton */}
                            <Skeleton className="h-3 w-32 md:w-48" />
                            {/* Unread count skeleton (sometimes visible) */}
                            {index % 2 === 0 && (
                                <Skeleton className="h-6 w-6 rounded-full" />
                            )}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default ChatListSkeleton;
