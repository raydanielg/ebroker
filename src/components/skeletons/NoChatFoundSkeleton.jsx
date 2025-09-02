import { Skeleton } from "@/components/ui/skeleton";

const NoChatFoundSkeleton = () => {
    return (
        <div className="flex flex-col items-center justify-center gap-6 h-full">
            {/* Image skeleton */}
            <Skeleton className="h-[200px] w-[200px] md:h-[300px] md:w-[300px] rounded-lg" />

            {/* Text skeleton */}
            <Skeleton className="h-8 w-48 md:w-64" />
        </div>
    );
};

export default NoChatFoundSkeleton;
