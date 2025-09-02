"use client";

import { Skeleton } from "@/components/ui/skeleton";

const PropertySideFilterSkeleton = () => {
    return (
        <div className="bg-white rounded-lg shadow-sm flex flex-col h-fit overflow-hidden border">
            {/* Header - matches exact structure */}
            <div className="flex items-center justify-between p-3 sm:p-4 border-b">
                <Skeleton className="h-5 sm:h-6 w-12" /> {/* "Filter" text */}
                <Skeleton className="h-4 w-20" /> {/* "Clear Filter" button */}
            </div>

            <div className="flex-grow overflow-y-auto">
                {/* Keywords Filter Section */}
                <div className="mb-4 sm:mb-6 mt-3 sm:mt-4 px-3 sm:px-4">
                    <Skeleton className="h-4 sm:h-5 w-16 mb-1.5 sm:mb-2" /> {/* "Keywords" label */}
                    <Skeleton className="w-full h-10 sm:h-12 rounded-lg" /> {/* Input field */}
                </div>

                {/* Property Type Filter Section */}
                <div className="mb-4 sm:mb-6 px-3 sm:px-4">
                    <Skeleton className="h-4 sm:h-5 w-24 mb-1.5 sm:mb-2" /> {/* "Property Type" label */}
                    <Skeleton className="w-full h-10 sm:h-12 rounded-lg" /> {/* Select dropdown */}
                </div>

                {/* Location Filter Section */}
                <div className="mb-4 sm:mb-6 px-3 sm:px-4">
                    <Skeleton className="h-4 sm:h-5 w-16 mb-1.5 sm:mb-2" /> {/* "Location" label */}
                    <Skeleton className="w-full h-10 sm:h-12 rounded-lg" /> {/* Google Maps input */}
                </div>

                {/* Sell / Rent Filter Section */}
                <div className="mb-4 sm:mb-6 px-3 sm:px-4">
                    <Skeleton className="h-4 sm:h-5 w-20 mb-1.5 sm:mb-2" /> {/* "Sell or Rent" label */}
                    <Skeleton className="w-full h-10 sm:h-12 rounded-lg" /> {/* Select dropdown */}
                </div>

                {/* Property Feature Toggles - with border */}
                <div className="border-t mb-2">
                    {/* Featured Property Switch */}
                    <div className="flex items-center justify-between border-b p-3 sm:p-4">
                        <Skeleton className="h-4 sm:h-5 w-32" /> {/* "Is Featured Property" text */}
                        <Skeleton className="w-8 sm:w-10 h-4 sm:h-5 rounded-full" /> {/* Toggle switch */}
                    </div>

                    {/* Premium Property Switch */}
                    <div className="flex items-center justify-between p-3 sm:p-4">
                        <Skeleton className="h-4 sm:h-5 w-32" /> {/* "Is Premium Property" text */}
                        <Skeleton className="w-8 sm:w-10 h-4 sm:h-5 rounded-full" /> {/* Toggle switch */}
                    </div>
                </div>

                {/* Smart Filter Collapsible Section */}
                <div className="border-t p-3 sm:p-4">
                    {/* Smart Filter Button */}
                    <div className="w-full flex items-center justify-between rounded-lg border-[1.5px] px-3 sm:px-5 py-2.5 sm:py-3">
                        <div className="flex items-center">
                            <Skeleton className="w-4 h-4 sm:w-5 sm:h-5 mr-2" /> {/* Filter icon */}
                            <Skeleton className="h-4 sm:h-5 w-24" /> {/* "Smart Filters" text */}
                        </div>
                        <Skeleton className="w-5 h-5 sm:w-7 sm:h-7" /> {/* Arrow icon */}
                    </div>

                    {/* Smart Filter Content - Expanded State */}
                    <div className="overflow-hidden px-0.5 sm:px-1 mt-4">
                        {/* Property Budget Section */}
                        <div className="mb-4 sm:mb-5">
                            <Skeleton className="h-4 sm:h-5 w-28 mb-2 sm:mb-3" /> {/* "Property Budget" label */}
                            <div className="grid grid-cols-2 gap-2 sm:gap-3">
                                <Skeleton className="w-full h-10 sm:h-12 rounded-lg" /> {/* Min price input */}
                                <Skeleton className="w-full h-10 sm:h-12 rounded-lg" /> {/* Max price input */}
                            </div>
                        </div>

                        {/* Posted Since Section */}
                        <div className="mb-4 sm:mb-5">
                            <Skeleton className="h-4 sm:h-5 w-20 mb-2 sm:mb-3" /> {/* "Posted Since" label */}
                            <Skeleton className="w-full h-10 sm:h-12 rounded-lg" /> {/* Select dropdown */}
                        </div>

                        {/* Amenities Section */}
                        <div className="mb-4 sm:mb-5">
                            <Skeleton className="h-4 sm:h-5 w-16 mb-2 sm:mb-3" /> {/* "Amenities :" label */}

                            {/* Amenities grid - 2 columns as in original */}
                            <div className="grid grid-cols-2 px-0 sm:px-2 gap-x-2 sm:gap-x-4 gap-y-2 sm:gap-y-3">
                                {[...Array(8)].map((_, index) => (
                                    <div key={index} className="flex items-center space-x-1.5 sm:space-x-2">
                                        <Skeleton className="h-4 sm:h-5 w-4 sm:w-5 rounded" /> {/* Checkbox */}
                                        <Skeleton className="h-3 sm:h-4 w-16 sm:w-20" /> {/* Amenity name */}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer / Search Button */}
            <div className="p-3 sm:p-4 border-t mt-auto">
                <div className="w-full py-2.5 sm:py-3 rounded-lg flex items-center justify-center bg-gray-100">
                    <Skeleton className="w-4 h-4 sm:w-5 sm:h-5 mr-1.5 sm:mr-2" /> {/* Search icon */}
                    <Skeleton className="h-4 sm:h-5 w-12" /> {/* "Search" text */}
                </div>
            </div>
        </div>
    );
};

export default PropertySideFilterSkeleton; 