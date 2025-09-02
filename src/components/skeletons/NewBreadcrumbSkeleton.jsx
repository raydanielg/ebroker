"use client";

import { Skeleton } from "@/components/ui/skeleton";

const NewBreadcrumbSkeleton = () => {
    return (
        <div className="w-full bg-[#F5F5F4] flex justify-center items-center min-h-[130px]">
            <div className="container mx-auto px-4 md:px-6">
                {/* Title Section */}
                <div className="flex justify-between items-center">
                    <div className="py-8 space-y-2">
                        {/* Main title skeleton */}
                        <Skeleton className="h-6 sm:h-8 md:h-9 w-48 sm:w-64 md:w-80" />

                        {/* Subtitle skeleton - smaller and optional */}
                        <Skeleton className="h-4 md:h-5 w-32 sm:w-48 md:w-64" />
                    </div>

                    {/* Breadcrumb Navigation Skeleton */}
                    <nav className="hidden sm:block">
                        <div className="flex items-center text-sm gap-1">
                            {/* Home link */}
                            <Skeleton className="h-4 w-12" />

                            {/* Separator */}
                            <Skeleton className="h-4 w-4" />

                            {/* Current page/item */}
                            <Skeleton className="h-4 w-16" />

                            {/* Optional second separator and item */}
                            <Skeleton className="h-4 w-4" />
                            <Skeleton className="h-4 w-20" />
                        </div>
                    </nav>
                </div>
            </div>
        </div>
    );
};

export default NewBreadcrumbSkeleton; 