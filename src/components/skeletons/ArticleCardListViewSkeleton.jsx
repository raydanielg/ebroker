import { Skeleton } from "../ui/skeleton";

const ArticleCardListViewSkeleton = () => {
    return (
        <article className="cardBg overflow-hidden rounded-xl border w-full grid grid-cols-1 md:grid-cols-12 gap-4">
            {/* Image Section Skeleton */}
            <figure className="relative md:col-span-4 p-3">
                <div className="aspect-video md:aspect-square w-full h-full">
                    <Skeleton className="h-full w-full rounded-xl" />
                </div>
                <div className="absolute left-6 top-6">
                    <Skeleton className="h-6 w-20 rounded-md" />
                </div>
            </figure>

            {/* Content Section Skeleton */}
            <div className="md:col-span-8 p-4 flex flex-col justify-between">
                <div>
                    <header>
                        {/* Title Skeleton */}
                        <Skeleton className="h-7 w-3/4" />

                        {/* Description Skeleton */}
                        <div className="mt-4 space-y-2">
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-5/6" />
                        </div>
                    </header>

                    {/* Read More Button Skeleton */}
                    <div className="my-4 flex items-center gap-2">
                        <Skeleton className="h-5 w-24" />
                        <Skeleton className="h-4 w-4 rounded-full" />
                    </div>
                </div>

                {/* Author Section Skeleton */}
                <footer className="flex items-center space-x-4 mt-auto border-t pt-4">
                    <Skeleton className="h-12 w-12 rounded-full" />
                    <div>
                        <Skeleton className="h-5 w-32 mb-1" />
                        <Skeleton className="h-4 w-24" />
                    </div>
                </footer>
            </div>
        </article>
    );
};

export default ArticleCardListViewSkeleton; 