import { Skeleton } from "@/components/ui/skeleton";

const AboutAgentSkeleton = () => {
    return (
        <div className="bg-white border rounded-lg shadow-sm p-6 mb-6">
            {/* Title section with "About Agent" */}
            <div className="flex items-center gap-2 mb-4">
                <Skeleton className="h-8 w-16" /> {/* "About" text */}
                <Skeleton className="h-8 w-16 primaryColor" /> {/* "Agent" text */}
            </div>

            {/* About text content */}
            <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
            </div>

            {/* Read more button */}
            <div className="mt-5">
                <Skeleton className="h-8 w-28 rounded-lg" />
            </div>
        </div>
    );
};

export default AboutAgentSkeleton; 