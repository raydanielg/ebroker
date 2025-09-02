import { Skeleton } from "@/components/ui/skeleton";

const PropertyCardSkeleton = () => {
    return (
        <div className="group bg-white rounded-2xl overflow-hidden border border-color-[#E7E7E7] hover:shadow-lg transition-shadow duration-300 flex flex-col">
            {/* Image section with badges */}
            <div className="relative">
                <Skeleton className="w-full h-56 object-cover rounded-t-2xl" />

                {/* Top badges container */}
                <div className="absolute top-3 left-3 right-3 flex justify-between items-start">
                    {/* Featured badge */}
                    <Skeleton className="h-8 w-24 rounded-[8px]" />

                    {/* Favorite button */}
                    <Skeleton className="h-9 w-9 rounded-md" />
                </div>

                {/* Category badge */}
                <div className="absolute bottom-3 left-3">
                    <Skeleton className="h-7 w-24 rounded-md" />
                </div>
            </div>

            {/* Content section */}
            <div className="flex flex-col flex-grow">
                {/* Title and location */}
                <div className="p-4 flex justify-between items-start mb-2">
                    <div className="flex-1 mr-2">
                        <Skeleton className="h-5 w-full mb-2" /> {/* Title */}
                        <Skeleton className="h-4 w-3/4" /> {/* Location */}
                    </div>
                    {/* Property type badge */}
                    <Skeleton className="h-6 w-16 rounded-full" />
                </div>

                {/* Parameters/features */}
                <div className="px-4 py-2 grid grid-cols-4 gap-2 border-y-2 border-gray-100">
                    {[...Array(4)].map((_, index) => (
                        <div key={index} className="flex flex-col items-center justify-center gap-1">
                            <Skeleton className="h-6 w-6 rounded-full" /> {/* Icon */}
                            <Skeleton className="h-3 w-10" /> {/* Value */}
                        </div>
                    ))}
                </div>

                {/* Price and premium badge */}
                <div className="p-4 flex items-center justify-between mt-auto">
                    <Skeleton className="h-6 w-20" /> {/* Price */}
                    <Skeleton className="h-8 w-24 rounded-full" /> {/* Premium badge */}
                </div>
            </div>
        </div>
    );
};

export default PropertyCardSkeleton; 