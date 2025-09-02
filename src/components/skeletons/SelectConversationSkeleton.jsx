import { Skeleton } from "@/components/ui/skeleton";

const SelectConversationSkeleton = () => {
    return (
        <div className="flex flex-1 items-center justify-center text-center p-8">
            <div className="flex flex-col items-center gap-4">
                {/* Icon skeleton */}
                <Skeleton className="h-16 w-16 rounded-full" />

                {/* Text skeleton */}
                <Skeleton className="h-5 w-64" />
            </div>
        </div>
    );
};

export default SelectConversationSkeleton;
