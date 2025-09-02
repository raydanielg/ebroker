import { Skeleton } from "../ui/skeleton";

const ArticleCardSkeleton = () => {
    return (
        <article className="cardBg max-w-sm overflow-hidden rounded-xl border">
            {/* Image Section */}
            <figure className="relative aspect-video p-4">
                <Skeleton className="h-full w-full rounded-xl object-cover" />
                <div className="absolute left-6 top-6">
                    <Skeleton className="h-6 w-20 rounded-md" />
                </div>
            </figure>

            {/* Content Section */}
            <header className="px-4">
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-6 w-3/4 mt-2" />
                <Skeleton className="h-4 w-full mt-4" />

                {/* Read More */}
                <div className="my-4 flex items-center gap-2">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-4 w-4 rounded-full" />
                </div>
            </header>

            <hr className="border-t" />

            {/* Author Section */}
            <footer className="flex items-center space-x-4 p-4">
                <Skeleton className="h-12 w-12 rounded-full" />
                <div>
                    <Skeleton className="h-5 w-32 mb-1" />
                    <Skeleton className="h-4 w-24" />
                </div>
            </footer>
        </article>
    );
};

export default ArticleCardSkeleton; 