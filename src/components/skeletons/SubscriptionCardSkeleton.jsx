import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";


const SubscriptionCardSkeleton = () => {
  return (
    <Card className="relative overflow-hidden border-0 shadow-sm mb-6">
    <CardHeader className="pb-0 pt-6 px-6">
        <Skeleton className="h-6 w-40" />
        <div className="flex items-baseline mt-3">
            <Skeleton className="h-8 w-20" />
            <Skeleton className="h-4 w-24 ml-2" />
        </div>
    </CardHeader>

    <CardContent className="space-y-4 px-6 pt-4 pb-6">
        {/* Stats cards grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Listing Usage Skeleton */}
            <Card className="bg-[#F5F5F4] border-0 shadow-none rounded-md">
                <CardHeader className="pb-0">
                    <Skeleton className="h-4 w-20 mx-auto" />
                </CardHeader>
                <CardContent className="flex flex-row items-center justify-between p-4 m-4 bg-white">
                    <div className="flex-shrink-0">
                        <Skeleton className="h-[75px] w-[75px] rounded-full" />
                    </div>
                    <div className="space-y-3 flex-1 pl-4">
                        <div className="flex items-center gap-2">
                            <Skeleton className="w-1 h-6" />
                            <Skeleton className="w-20 h-4" />
                            <Skeleton className="w-16 h-4 ml-auto" />
                        </div>
                        <div className="flex items-center gap-2">
                            <Skeleton className="w-1 h-6" />
                            <Skeleton className="w-20 h-4" />
                            <Skeleton className="w-16 h-4 ml-auto" />
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Featured Ad Usage Skeleton */}
            <Card className="bg-[#F5F5F4] border-0 shadow-none rounded-md">
                <CardHeader className="pb-0">
                    <Skeleton className="h-4 w-20 mx-auto" />
                </CardHeader>
                <CardContent className="flex flex-row items-center justify-between p-4 m-4 bg-white">
                    <div className="flex-shrink-0">
                        <Skeleton className="h-[75px] w-[75px] rounded-full" />
                    </div>
                    <div className="space-y-3 flex-1 pl-4">
                        <div className="flex items-center gap-2">
                            <Skeleton className="w-1 h-6" />
                            <Skeleton className="w-20 h-4" />
                            <Skeleton className="w-16 h-4 ml-auto" />
                        </div>
                        <div className="flex items-center gap-2">
                            <Skeleton className="w-1 h-6" />
                            <Skeleton className="w-20 h-4" />
                            <Skeleton className="w-16 h-4 ml-auto" />
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>

        {/* Remaining Days Skeleton */}
        <Card className="bg-[#F5F5F4] border-0 shadow-none rounded-md">
            <CardContent className="p-4 flex justify-between items-center">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-4 w-20" />
            </CardContent>
        </Card>

        {/* Benefits Skeleton */}
        <div>
            <Skeleton className="h-5 w-32 mb-2" />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-2">
                {[1, 2, 3].map(i => (
                    <div key={i} className="flex items-start p-4 bg-[#F5F5F4] rounded-md">
                        <Skeleton className="h-4 w-4 mr-2" />
                        <div className="flex-1">
                            <Skeleton className="h-3 w-full mb-2" />
                            <Skeleton className="h-4 w-20" />
                        </div>
                    </div>
                ))}
            </div>
        </div>

        {/* Dates Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div className="flex items-center gap-2">
                <Skeleton className="h-9 w-9 rounded-md" />
                <div>
                    <Skeleton className="h-3 w-16 mb-1" />
                    <Skeleton className="h-5 w-32" />
                </div>
            </div>
            <div className="flex items-center justify-end gap-2">
                <div className="text-right">
                    <Skeleton className="h-3 w-16 mb-1 ml-auto" />
                    <Skeleton className="h-5 w-32" />
                </div>
                <Skeleton className="h-9 w-9 rounded-md" />
            </div>
        </div>
    </CardContent>
</Card>
  )
}

export default SubscriptionCardSkeleton
