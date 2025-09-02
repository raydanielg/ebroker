"use client";

import { Skeleton } from "@/components/ui/skeleton";

const VerticlePropertyCardSkeleton = () => {
    return (
        <div className="cardBorder cardBg flex flex-col gap-4 overflow-hidden rounded-xl">
            {/* Image Section with Premium/Featured Tags and Heart */}
            <div className="relative">
                {/* Main Image */}
                <Skeleton className="h-48 w-full" />
                
                {/* Premium & Featured Tags */}
                <div className="flex items-center gap-2 absolute top-3 left-3">
                    <Skeleton className="h-7 w-7 rounded" /> {/* Premium Icon */}
                    <Skeleton className="h-8 w-20 rounded" /> {/* Featured Tag */}
                </div>
                
                {/* Heart Button */}
                <Skeleton className="absolute right-5 top-4 h-8 w-8 rounded-full" />
            </div>

            {/* Property Details Section */}
            <div className="flex flex-grow flex-col gap-4 pb-4">
                {/* Header Section */}
                <div className="px-4 space-y-2">
                    {/* Category with Icon */}
                    <div className="flex items-center gap-2">
                        <Skeleton className="h-5 w-5 rounded" /> {/* Category Icon */}
                        <Skeleton className="h-4 w-24" /> {/* Category Name */}
                    </div>
                    
                    {/* Title */}
                    <Skeleton className="h-6 w-3/4" />
                    
                    {/* Address */}
                    <Skeleton className="h-4 w-1/2" />
                </div>

                {/* Divider */}
                <Skeleton className="mx-4 h-[1px]" />

                {/* Features Grid */}
                <div className="grid grid-cols-3 items-center justify-center gap-2 px-4">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="flex items-center gap-2">
                            <div className="relative flex h-8 w-8 items-center justify-center">
                                <Skeleton className="absolute inset-0 rounded-full opacity-50" />
                                <Skeleton className="h-5 w-5" />
                            </div>
                            <Skeleton className="h-4 w-12" />
                        </div>
                    ))}
                </div>

                {/* Divider */}
                <Skeleton className="mx-4 h-[1px]" />

                {/* Footer - Price and Type */}
                <div className="flex items-center justify-between px-4">
                    <Skeleton className="h-6 w-16 rounded-md" /> {/* Property Type */}
                    <Skeleton className="h-6 w-24" /> {/* Price */}
                </div>
            </div>
        </div>
    );
};

export default VerticlePropertyCardSkeleton; 