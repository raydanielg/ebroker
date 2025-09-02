import { Skeleton } from "../ui/skeleton";

/**
 * ArticleHorizontalCardSkeleton Component
 *
 * A skeleton loader that matches the exact structure of ArticleHorizontalCard:
 * - Responsive horizontal layout (flex-col on mobile, md:flex-row on desktop)
 * - Image placeholder on the left
 * - Content section with category, title, excerpt, and footer elements
 * - Maintains the same spacing and dimensions as the original component
 */
const ArticleHorizontalCardSkeleton = () => {
  return (
    <article className="group flex cursor-pointer flex-col gap-4 overflow-hidden rounded-lg bg-white shadow-sm transition-all duration-300 md:flex-row mb-4">
      <div className="flex h-full max-h-[300px] w-full flex-col gap-3 md:flex-row">
        {" "}
        {/* Article Image Skeleton */}
        <div className="relative w-full max-w-[524px] overflow-hidden">
          <Skeleton className="h-[200px] w-full max-w-[524px] rounded-md md:h-[300px] md:rounded-2xl" />
        </div>
        {/* Article Content Skeleton */}
        <div className="flex max-h-[300px] w-full flex-col justify-between rounded-md border p-2 md:rounded-2xl md:p-6">
          {/* Article Header Skeleton */}
          <div className="space-y-2 md:space-y-3">
            {/* Category and Date Skeleton */}
            <div className="flex items-center gap-2 text-sm">
              {/* Category badge skeleton */}
              <div className="flex items-center gap-2 rounded-lg p-2">
                <Skeleton className="h-5 w-5" />
                <Skeleton className="h-4 w-16" />
              </div>
              <Skeleton className="h-4 w-2" />
              <Skeleton className="h-4 w-20" />
            </div>

            {/* Article Title Skeleton */}
            <div className="space-y-2">
              <Skeleton className="h-5 w-full md:h-6 lg:h-7" />
              <Skeleton className="h-5 w-3/4 md:h-6 lg:h-7" />
            </div>

            {/* Article Excerpt Skeleton */}
            <div className="space-y-2">
              <Skeleton className="h-4 w-full md:h-4" />
              <Skeleton className="h-4 w-5/6 md:h-4" />
              <Skeleton className="hidden h-4 w-4/5 md:block" />
            </div>
          </div>

          {/* Article Footer Skeleton */}
          <div className="mt-4 flex items-center justify-between pt-4 md:mt-6">
            {/* Read More Button Skeleton */}
            <div className="inline-flex items-center gap-2 rounded-lg px-4 py-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-5 w-5 rounded-full" />
            </div>

            {/* Author Info Skeleton */}
            <div className="flex items-center gap-2">
              <Skeleton className="h-8 w-8 rounded-full" />
              <div className="space-y-1">
                <Skeleton className="h-3 w-16" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
};

export default ArticleHorizontalCardSkeleton;
