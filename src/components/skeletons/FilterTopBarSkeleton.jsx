import React from 'react'
import { Skeleton } from '../ui/skeleton'

const FilterTopBarSkeleton = () => {
    return (
        <div className="flex newBorder rounded-lg justify-between h-16 items-center p-4 mb-4">
            <Skeleton className="h-10 w-1/6" />
            <Skeleton className="h-10 w-1/12" />
        </div>
    )
}

export default FilterTopBarSkeleton