"use client";

import { Skeleton } from "@/components/ui/skeleton";

const PropertyHorizontalCardSkeleton = () => {
    return (
        <div className="group">
            <article className="cardBg max-h-[250px] transition-all duration-500 cardBorder mx-auto grid h-full grid-cols-1 overflow-hidden rounded-2xl lg:grid-cols-12">
                {/* Image Section */}
                <div className="relative col-span-6">
                    <Skeleton className="h-full w-full max-h-[250px] aspect-square" />
                    {/* Favorite button */}
                    <Skeleton className="p-2 rounded-lg absolute top-2 right-2 h-8 w-8" />
                    {/* Featured tag */}
                    <Skeleton className="absolute left-3 top-3 h-7 w-20 rounded-md" />
                </div>

                {/* Content Section */}
                <div className="md:col-span-6 flex flex-col cardBg h-fit">
                    {/* Header Section */}
                    <header className="mx-2 p-2 flex-grow h-fit">
                        <div className="flex justify-between items-center">
                            {/* Category */}
                            <Skeleton className="h-9 w-28 rounded-lg" />
                            {/* Property type (sell/rent) */}
                            <Skeleton className="h-7 w-16 rounded-[100px]" />
                        </div>

                        {/* Title */}
                        <Skeleton className="mt-1 h-6 w-3/4" />
                        {/* Location */}
                        <Skeleton className="mt-1 h-4 w-1/2" />
                    </header>

                    {/* Parameters Section */}
                    <div className="mb-2">
                        <Skeleton className="h-[1px] w-full" /> {/* Divider */}
                        <div className="grid grid-cols-3 items-center justify-center gap-3 px-4 py-3 md:grid-cols-2 lg:grid-cols-3">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="flex items-center gap-2">
                                    <div className="relative flex h-8 w-8 items-center justify-center">
                                        <Skeleton className="absolute inset-0 rounded-full" />
                                        <Skeleton className="h-5 w-5" />
                                    </div>
                                    <Skeleton className="h-4 w-12" />
                                </div>
                            ))}
                        </div>
                        <Skeleton className="h-[1px] w-full" /> {/* Divider */}
                    </div>

                    {/* Footer Section */}
                    <footer className="mx-2 flex items-center justify-between p-2">
                        {/* Price */}
                        <Skeleton className="h-6 w-24" />
                        {/* Premium badge */}
                        <Skeleton className="h-8 w-28 rounded-[100px]" />
                    </footer>
                </div>
            </article>
        </div>
    );
};

export default PropertyHorizontalCardSkeleton; 