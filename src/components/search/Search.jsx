import { useCallback, useEffect, useState, useMemo } from "react";
import NewBreadcrumb from "../breadcrumb/NewBreadCrumb";
import FilterTopBar from "../reusable-components/FilterTopBar";
import PropertySideFilter from "../pagescomponents/PropertySideFilter";
import { getPropertyListApi } from "@/api/apiRoutes";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import PropertyVerticalNewCard from "../cards/PropertyVerticalNewCard";
import PropertyHorizontalCard from "../cards/PropertyHorizontalCard";
import VerticlePropertyCardSkeleton from "../skeletons/VerticlePropertyCardSkeleton";
import PropertyHorizontalCardSkeleton from "../skeletons/PropertyHorizontalCardSkeleton";
import { useTranslation } from "../context/TranslationContext";
// Import Shadcn UI components
import { Button } from "@/components/ui/button";
import { Sheet, SheetClose, SheetContent } from "@/components/ui/sheet";
import NoDataFound from "../no-data-found/NoDataFound";
import { isRTL } from "@/utils/helperFunction";

const Search = () => {
  const router = useRouter();
  const t = useTranslation();
  const locale = router?.query?.locale;
  const isRtl = isRTL();

  // Set initial loading to true to show skeletons while router is hydrating.
  const [loading, setLoading] = useState(true);
  const [properties, setProperties] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [viewType, setViewType] = useState("grid");
  const [sortBy, setSortBy] = useState("newest");
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [offset, setOffset] = useState(0);
  const limit = 12;
  const [isFilterSheetOpen, setIsFilterSheetOpen] = useState(false);

  // 1. DERIVE FILTERS FROM URL: The URL is the single source of truth.
  // useMemo prevents re-calculating on every render, only when router.query changes.
  const filterParams = useMemo(() => {
    // router.isReady ensures we have the query parameters from the URL.
    if (!router.isReady) {
      return null;
    }
    const query = router.query;
    return {
      property_type: query.property_type || "",
      category_id: query.category_id || "",
      category_slug_id: query.category_slug_id || "",
      city: query.city || "",
      state: query.state || "",
      country: query.country || "",
      min_price: query.min_price || "",
      max_price: query.max_price || "",
      posted_since: query.posted_since || "",
      promoted: query.promoted === "true" || query.promoted === "1",
      keywords: query.keywords || "",
      amenities: query.amenities ? query.amenities.split(",") : [],
      is_premium: query.is_premium === "true" || query.is_premium === "1",
    };
  }, [router.isReady, router.query]);


  // 2. FETCH DATA ON FILTER CHANGE: This effect runs for initial load and when filters change.
  useEffect(() => {
    // Do not fetch until the router is ready and filterParams are available.
    if (!filterParams) {
      return;
    }

    setLoading(true);
    setProperties([]); // Clear old results immediately for better UX

    const apiParams = {
      ...filterParams,
      search: filterParams.keywords,
      promoted: filterParams.promoted ? "1" : "0",
      property_type:
        filterParams.property_type === "Sell"
          ? "0"
          : filterParams.property_type === "Rent"
            ? "1"
            : "",
      limit: limit.toString(),
      offset: "0", // Always start from the beginning for a new filter search
      parameter_id: filterParams?.amenities?.join(",") || "",
    };

    getPropertyListApi(apiParams)
      .then((res) => {
        if (!res?.error) {
          setProperties(res.data);
          setTotalItems(res.total);
          const newOffset = res.data.length;
          setOffset(newOffset);
          setHasMore(res.total > newOffset);
        } else {
          setProperties([]);
          setTotalItems(0);
          setOffset(0);
          setHasMore(false);
        }
      })
      .catch((error) => {
        console.error("Error fetching search data:", error);
        setProperties([]);
        setTotalItems(0);
        setOffset(0);
        setHasMore(false);
      })
      .finally(() => {
        setLoading(false);
      });
    // Use JSON.stringify to ensure the effect re-runs only when filter values change.
  }, [JSON.stringify(filterParams)]);

  // 3. LOAD MORE FUNCTIONALITY
  const loadMore = useCallback(() => {
    if (loadingMore || !hasMore || !filterParams) return;

    setLoadingMore(true);

    const apiParams = {
      ...filterParams,
      search: filterParams.keywords,
      promoted: filterParams.promoted ? "1" : "0",
      property_type:
        filterParams.property_type === "Sell"
          ? "0"
          : filterParams.property_type === "Rent"
            ? "1"
            : "",
      limit: limit.toString(),
      offset: offset.toString(), // Use the current offset for pagination
      parameter_id: filterParams?.amenities?.join(",") || "",
    };

    getPropertyListApi(apiParams)
      .then(res => {
        if (!res?.error) {
          setProperties(prev => [...prev, ...res.data]);
          const newOffset = offset + res.data.length;
          setOffset(newOffset);
          setHasMore(res.total > newOffset);
        }
      })
      .catch(error => console.error("Error loading more data:", error))
      .finally(() => setLoadingMore(false));

  }, [loadingMore, hasMore, filterParams, offset, limit]);

  // 4. FILTER HANDLERS: These functions now only update the URL.
  const handleFilterApply = useCallback((newFilters) => {
    // Clean up empty/falsy values before creating the query string
    const urlFilters = Object.entries(newFilters).reduce((acc, [key, value]) => {
      if (key === 'amenities' && Array.isArray(value) && value.length > 0) {
        acc[key] = value.join(',');
      } else if (key === 'promoted' && value) {
        acc[key] = '1';
      } else if (key !== 'amenities' && key !== 'promoted' && value) {
        acc[key] = value;
      }
      return acc;
    }, {});

    // Close filter sheet if open
    if (isFilterSheetOpen) {
      setIsFilterSheetOpen(false);
    }

    try {
      const queryString = new URLSearchParams(urlFilters).toString();
      router?.push(
        {
          pathname: `/${locale}/search/`,
          query: queryString
        },
        `/${locale}/search/?${queryString || ""}`
      );
    } catch (error) {
      console.error("Error applying filters:", error);
    }
  }, [router, locale, isFilterSheetOpen]);

  const handleClearFilter = useCallback(() => {
    // Close filter sheet if open
    if (isFilterSheetOpen) {
      setIsFilterSheetOpen(false);
    }

    try {
      router.push(`/${locale}/search`, undefined, { shallow: true });
    } catch (error) {
      console.error("Error clearing filters:", error);
    }
  }, [router, locale, isFilterSheetOpen]);

  return (
    <div>
      <NewBreadcrumb
        items={[{ label: t("search"), href: "/search" }]}
        title={t("propertySearchListing")}
        subtitle={`${t("thereAreCurrently")} ${totalItems} ${t("properties")}.`}
      />
      <div className="container mx-auto px-4 py-12 md:px-6">
        <FilterTopBar
          itemCount={properties.length} // Use properties.length directly
          totalItems={totalItems}
          viewType={viewType}
          sortBy={sortBy}
          setViewType={setViewType}
          setSortBy={setSortBy}
          onOpenFilters={() => setIsFilterSheetOpen(true)}
          showSortBy={false}
          showFilterButton={true}
        />
        <div className="mt-4 grid grid-cols-12 gap-4">
          {/* Mobile Filter Sheet */}
          <Sheet open={isFilterSheetOpen} onOpenChange={setIsFilterSheetOpen}>
            <SheetContent
              side={isRtl ? "left " : "right"}
              className="flex h-full w-full flex-col place-content-center !p-0"
            >
              <div className="overflow-y-auto no-scrollbar h-full p-2 ">
                <PropertySideFilter
                  showBorder={false}
                  onFilterApply={handleFilterApply}
                  handleClearFilter={handleClearFilter}
                  currentFilters={filterParams || {}} // Pass derived filters
                  hideFilter={false}
                  hideFilterType={"search"}
                  isMobileSheet={isFilterSheetOpen}
                  setIsFilterSheetOpen={setIsFilterSheetOpen}
                />
              </div>
            </SheetContent>
          </Sheet>

          {/* Side Filter - Hidden on mobile */}
          <div className="hidden xl:block sticky col-span-12 xl:top-[15vh] xl:col-span-3 xl:self-start">
            <PropertySideFilter
              onFilterApply={handleFilterApply}
              handleClearFilter={handleClearFilter}
              currentFilters={filterParams || {}} // Pass derived filters
              hideFilter={false}
              hideFilterType={"search"}
            />
          </div>
          <div className="col-span-12 xl:col-span-9">
            {/* Initial loading skeletons */}
            {loading && viewType === "grid" && (
              <div className="grid grid-cols-1 gap-4 place-items-center md:grid-cols-2 lg:grid-cols-3">
                {[...Array(12)].map((_, index) => (
                  <VerticlePropertyCardSkeleton key={index} />
                ))}
              </div>
            )}
            {loading && viewType !== "grid" && (
              <div className="flex flex-col gap-4">
                {[...Array(6)].map((_, index) => (
                  <PropertyHorizontalCardSkeleton key={index} />
                ))}
              </div>
            )}

            {/* Property list */}
            {!loading && (
              viewType === "grid" ? (
                <div className="grid grid-cols-1 w-full sm:grid-cols-2 place-items-center gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {properties.map((property) => (
                    <PropertyVerticalNewCard key={property.id} property={property} />
                  ))}
                </div>
              ) : (
                <div className="flex flex-col gap-4">
                  {properties.map((property) => (
                    <PropertyHorizontalCard key={property.id} property={property} />
                  ))}
                </div>
              )
            )}

            {!loading && properties.length === 0 && (
              <NoDataFound />
            )}

            {/* Skeletons for "Load More" */}
            {loadingMore && viewType === "grid" && (
              <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                {[...Array(3)].map((_, index) => (
                  <VerticlePropertyCardSkeleton key={`load-more-${index}`} />
                ))}
              </div>
            )}
            {loadingMore && viewType !== "grid" && (
              <div className="mt-4 flex flex-col gap-4">
                {[...Array(2)].map((_, index) => (
                  <PropertyHorizontalCardSkeleton key={`load-more-${index}`} />
                ))}
              </div>
            )}

            {/* Load More Button */}
            {hasMore && !loading && !loadingMore && (
              <div className="mt-8 flex justify-center">
                <Button
                  onClick={loadMore}
                  className="border font-medium text-base brandBorder bg-transparent brandColor hover:primaryBg hover:text-white hover:border-none"
                >
                  {t("loadMore")} {t("listing")}
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Search;