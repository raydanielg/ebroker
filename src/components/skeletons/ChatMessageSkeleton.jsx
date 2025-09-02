import { Skeleton } from "@/components/ui/skeleton";

const ChatMessageSkeleton = ({ count = 8 }) => {
    return (
        <div className="flex flex-col gap-4 p-4 h-full overflow-y-auto">
            {Array.from({ length: count }).map((_, index) => {
                const isOutgoing = index % 3 === 0; // Simulate some outgoing messages

                return (
                    <div
                        key={index}
                        className={`flex gap-3 ${isOutgoing ? 'flex-row-reverse' : 'flex-row'}`}
                    >
                        {/* Profile picture skeleton - only for incoming messages */}
                        {!isOutgoing && (
                            <Skeleton className="h-8 w-8 rounded-full flex-shrink-0" />
                        )}

                        {/* Message content skeleton */}
                        <div className={`flex flex-col gap-2 max-w-[70%] ${isOutgoing ? 'items-end' : 'items-start'}`}>
                            {/* Message bubble skeleton */}
                            <div
                                className={`rounded-lg p-3 ${isOutgoing ? 'bg-primary/10' : 'bg-gray-100'
                                    }`}
                            >
                                {/* Different message types */}
                                {index % 5 === 0 ? (
                                    // Image message skeleton
                                    <Skeleton className="h-32 w-48 rounded" />
                                ) : index % 4 === 0 ? (
                                    // Audio message skeleton
                                    <div className="flex items-center gap-2">
                                        <Skeleton className="h-8 w-8 rounded-full" />
                                        <Skeleton className="h-6 w-32" />
                                        <Skeleton className="h-4 w-12" />
                                    </div>
                                ) : index % 3 === 0 ? (
                                    // File message skeleton
                                    <div className="flex items-center gap-2">
                                        <Skeleton className="h-8 w-8 rounded" />
                                        <div className="flex flex-col gap-1">
                                            <Skeleton className="h-4 w-24" />
                                            <Skeleton className="h-3 w-16" />
                                        </div>
                                    </div>
                                ) : (
                                    // Text message skeleton
                                    <div className="flex flex-col gap-2">
                                        <Skeleton className="h-4 w-32 md:w-48" />
                                        {index % 2 === 0 && <Skeleton className="h-4 w-24 md:w-32" />}
                                    </div>
                                )}
                            </div>

                            {/* Timestamp skeleton */}
                            <Skeleton className="h-3 w-12" />
                        </div>

                        {/* Message options skeleton - only for outgoing messages */}
                        {isOutgoing && (
                            <Skeleton className="h-6 w-6 rounded flex-shrink-0" />
                        )}
                    </div>
                );
            })}
        </div>
    );
};

export default ChatMessageSkeleton;
