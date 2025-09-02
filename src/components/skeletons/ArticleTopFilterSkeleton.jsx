import React from 'react'
import { Skeleton } from '@/components/ui/skeleton'

const ArticleTopFilterSkeleton = () => {
    return (
        <div className="w-full flex flex-col sm:flex-row justify-between items-center gap-4 p-3 bg-white rounded-md shadow-sm animate-pulse">
            {/* Left side: Property Count Skeleton */}
            <div className="w-40">
                <Skeleton className="h-5 w-full" />
            </div>

            {/* Right side: Sort and View Type Skeleton */}
            <div className="flex items-center gap-4">
                {/* Sort By Dropdown Skeleton */}
                <div className="min-w-[120px]">
                    <Skeleton className="h-9 w-[120px]" />
                </div>

                {/* View Type Switcher Skeleton */}
                <div className="flex items-center">
                    <Skeleton className="h-9 w-[72px]" />
                </div>
            </div>
        </div>
    )
}

export default ArticleTopFilterSkeleton 