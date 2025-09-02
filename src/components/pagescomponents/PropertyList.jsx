"use client";
import { useState, useEffect, useCallback } from "react";
import Layout from "../layout/Layout";
import PropertySideFilter from "./PropertySideFilter";
import PropertyListing from "./PropertyListing";
import { useTranslation } from "@/components/context/TranslationContext";
import { getPropertyListApi } from "@/api/apiRoutes";
// Import Shadcn UI components
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import NewBreadcrumb from "../breadcrumb/NewBreadCrumb";
import { useRouter } from "next/router";
import { VerticlePropertyCardSkeleton } from "../skeletons";
import FilterTopBarSkeleton from "../skeletons/FilterTopBarSkeleton";
import FilterTopBar from "../reusable-components/FilterTopBar";
import { getPostedSince, isRTL } from "@/utils/helperFunction";


const PropertyList = ({ isCategoryPage, isCityPage }) => {
  const t = useTranslation();
  const router = useRouter();
  const { locale, slug } = router?.query || {};
  const isRtl = isRTL();
  const citySlug = slug;
  const categorySlug = slug;
  // --- Local State for Data & UI ---
  const [filteredProperties, setFilteredProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const [offset, setOffset] = useState(0);
  const [viewType, setViewType] = useState("grid");
  const [hasMore, setHasMore] = useState(true);
  const [sortBy, setSortBy] = useState("newest");
  const limit = 9;
  const [isFilterSheetOpen, setIsFilterSheetOpen] = useState(false);
  const [prevFilters, setPrevFilters] = useState(null); // Track previous filters to prevent duplicate fetches

  // Helper function to initialize filters from router.query (replacing searchParams)
  const initializeFiltersFromQuery = useCallback(() => {
    // Use router.query with fallbacks for when query params might be undefined
    const query = router?.query || {};

    // Helper function to safely access query params
    const getQueryParam = (key) => {
      return query[key] || "";
    };

    // Parse amenities array safely
    const amenitiesString = getQueryParam("amenities");
    const amenities = amenitiesString ? amenitiesString.split(",") : [];

    return {
      property_type: getQueryParam("property_type"),
      category_id: getQueryParam("category_id"),
      category_slug_id: getQueryParam("category_slug_id"),
      city: citySlug || getQueryParam("city"),
      state: getQueryParam("state"),
      country: getQueryParam("country"),
      min_price: getQueryParam("min_price"),
      max_price: getQueryParam("max_price"),
      posted_since: getQueryParam("posted_since"),
      promoted: getQueryParam("promoted") === "true" || getQueryParam("promoted") === "1",
      keywords: getQueryParam("keywords"),
      amenities: amenities,
      is_premium: getQueryParam("is_premium") === "true" || getQueryParam("is_premium") === "1",
    };
  }, [router?.query, citySlug]);

  const [filters, setFilters] = useState(initializeFiltersFromQuery);

  // Sync filters with router.query changes
  useEffect(() => {
    if (router?.isReady) {
      const newFilters = initializeFiltersFromQuery();
      setFilters(newFilters);
      setOffset(0); // Reset offset when filters change from URL
    }
  }, [router?.isReady, initializeFiltersFromQuery]);

  // --- Breadcrumb Title State (Derived from props) ---
  const [breadcrumbTitle, setBreadcrumbTitle] = useState(() => {
    if (isCityPage)
      return `${t("propertiesIn")} ${citySlug?.charAt(0)?.toUpperCase() + citySlug?.slice(1)}`;
    if (isCategoryPage)
      return `${t("category")}: ${categorySlug?.charAt(0)?.toUpperCase() + categorySlug?.slice(1)}`;
    return t("allProperties");
  });

  // Update breadcrumb if props change after initial load
  useEffect(() => {
    if (isCityPage)
      setBreadcrumbTitle(
        `${t("propertiesIn")} ${citySlug?.charAt(0)?.toUpperCase() + citySlug?.slice(1)}`,
      );
    else if (isCategoryPage)
      setBreadcrumbTitle(
        `${categorySlug?.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())} ${t("properties")}`,
      );
    else setBreadcrumbTitle(t("allProperties"));
  }, [isCityPage, isCategoryPage, citySlug, categorySlug, t]);

  // Check if filters are active (excluding context-based filters)
  const hasActiveFilters = (() => {
    return (
      filters.keywords !== "" ||
      filters.property_type !== "" ||
      filters.category_id !== "" ||
      filters.min_price !== "" ||
      filters.max_price !== "" ||
      filters.posted_since !== "" ||
      filters.promoted ||
      (filters.amenities && filters.amenities.length > 0) ||
      (filters.city && filters.city !== citySlug) ||
      filters.state !== "" ||
      filters.country !== "" ||
      filters.is_premium
    );
  })();

  // Helper function to check if two filter objects are equivalent
  const areFiltersEqual = (filters1, filters2) => {
    if (!filters1 || !filters2) return false;

    // Compare basic properties
    const basicProps = [
      'property_type', 'category_id', 'category_slug_id', 'city',
      'state', 'country', 'min_price', 'max_price', 'posted_since',
      'promoted', 'keywords', 'is_premium'
    ];

    for (const prop of basicProps) {
      if (filters1[prop] !== filters2[prop]) return false;
    }

    // Compare amenities arrays
    const amenities1 = filters1.amenities || [];
    const amenities2 = filters2.amenities || [];

    if (amenities1.length !== amenities2.length) return false;

    // Check if arrays contain the same elements (order doesn't matter)
    const sortedAmenities1 = [...amenities1].sort();
    const sortedAmenities2 = [...amenities2].sort();

    for (let i = 0; i < sortedAmenities1.length; i++) {
      if (sortedAmenities1[i] !== sortedAmenities2[i]) return false;
    }

    return true;
  };

  // Fetch data function
  const fetchData = useCallback(
    async (isLoadMore = false, isFilterChange = false) => {
      try {
        // Skip fetch if filters haven't changed and it's not a load more request
        if (!isLoadMore && !isFilterChange && areFiltersEqual(filters, prevFilters)) {
          return;
        }

        isLoadMore ? setLoadingMore(true) : setLoading(true);

        // If it's a filter change, reset the offset
        if (isFilterChange && !isLoadMore) {
          setOffset(0);
        }

        // Use the current offset value from state for API call
        const currentOffset = isLoadMore ? offset + limit : offset;

        const res = await getPropertyListApi({
          ...filters,
          search: filters.keywords,
          promoted: filters.promoted ? "1" : "0",
          property_type:
            filters.property_type === "Sell"
              ? "0"
              : filters.property_type === "Rent"
                ? "1"
                : "",
          category_slug_id: isCategoryPage ? categorySlug || filters.category_slug_id || "" : "",
          city: isCityPage ? citySlug || filters.city || "" : "",
          limit: limit.toString(),
          offset: currentOffset.toString(),
          parameter_id: filters?.amenities?.join(",") || "",
          sort: sortBy || "newest",
          posted_since: getPostedSince(filters.posted_since),
          get_all_premium_properties: filters.is_premium ? "1" : "",
        });

        if (!res?.error) {
          if (isLoadMore) {
            setFilteredProperties((prevProperties) => [
              ...prevProperties,
              ...res?.data,
            ]);
            // Only update offset after successful load more
            setOffset(currentOffset);
          } else {
            setFilteredProperties(res?.data || []);
            // When filter changes, reset offset
            if (isFilterChange) {
              setOffset(0);
            }
          }

          setTotalCount(res?.total || 0);
          setHasMore(res?.total > currentOffset + (res?.data?.length || 0));

          // Store current filters to prevent duplicate fetches
          setPrevFilters({ ...filters });
        } else {
          console.error("API returned an error:", res?.error);
        }
      } catch (error) {
        console.error("Error fetching property data:", error);
        // Set empty data to avoid UI issues when error occurs
        if (!isLoadMore) {
          setFilteredProperties([]);
          setTotalCount(0);
          setHasMore(false);
        }
      } finally {
        isLoadMore ? setLoadingMore(false) : setLoading(false);
      }
    },
    [filters, offset, categorySlug, citySlug, sortBy, limit, prevFilters],
  );

  useEffect(() => {
    if (router?.isReady) {
      // Only fetch data for initial load or filter changes, not for loadMore
      // The offset state is intentionally excluded from dependencies
      fetchData(false, true);
    }
  }, [filters, router?.isReady, sortBy]);

  // Handle filter apply
  const handleFilterApply = (newFilters) => {
    // Ensure all filter values are properly formatted for URL
    const urlFilters = {
      // Only include property_type if it's not "All" or empty
      ...(newFilters.property_type &&
        newFilters.property_type !== "All" && {
        property_type: newFilters.property_type,
      }),
      ...(newFilters.category_id && { category_id: newFilters.category_id }),
      ...(newFilters.category_slug_id && {
        category_slug_id: newFilters.category_slug_id,
      }),
      ...(newFilters.city &&
        newFilters.city !== citySlug && { city: newFilters.city }),
      ...(newFilters.state && { state: newFilters.state }),
      ...(newFilters.country && { country: newFilters.country }),
      ...(newFilters.min_price && { min_price: newFilters.min_price }),
      ...(newFilters.max_price && { max_price: newFilters.max_price }),
      ...(newFilters.posted_since && { posted_since: newFilters.posted_since }),
      ...(newFilters.promoted && { promoted: "1" }),
      ...(newFilters.keywords && { keywords: newFilters.keywords }),
      ...(newFilters.amenities && { amenities: newFilters.amenities }),
      ...(newFilters.is_premium && { is_premium: "1" }),
    };
    setFilters(urlFilters);

    if (isFilterSheetOpen) {
      setIsFilterSheetOpen(false);
    }

    // Update URL with new filters
    try {
      const currentPath = router?.asPath?.split("?")[0] || "/";
      const queryString = new URLSearchParams(urlFilters).toString();
      router?.push(
        {
          pathname: `/${locale}/properties/`,
          query: queryString
        },
        `/${locale}/properties/?${queryString || ""}`
      );
    } catch (error) {
      console.error("Error updating URL with filters:", error);
    }
  };

  const handleClearFilter = useCallback(() => {
    // Reset filters to empty state but keep context filters
    const clearedFilters = {
      property_type: "",
      category_id: "",
      category_slug_id: categorySlug || "",
      city: citySlug || "",
      state: "",
      country: "",
      min_price: "",
      max_price: "",
      posted_since: "",
      promoted: false,
      keywords: "",
      amenities: [],
      is_premium: "",
    };
    // Check if filters are already cleared to prevent unnecessary updates
    if (areFiltersEqual(filters, clearedFilters)) {
      return;
    }

    setFilters(clearedFilters);

    // if (isFilterSheetOpen) {
    setIsFilterSheetOpen(false);
    // }

    // Navigate to clean URL
    try {
      const currentPath = router?.asPath?.split("?")[0] || "/";
      router?.push(currentPath, undefined, { shallow: true });
    } catch (error) {
      console.error("Error updating URL after clearing filters:", error);
    }
  }, [router, citySlug, categorySlug, filters]);

  const loadMore = () => {
    if (loadingMore || !hasMore) return;
    fetchData(true);
  };

  const handleLoadMore = () => {
    loadMore();
  };

  const handleSetViewType = (newViewType) => {
    setViewType(newViewType);
  };


  // --- JSX Return ---
  return (
    <Layout>
      <NewBreadcrumb
        title={breadcrumbTitle}
        items={[
          {
            href: `/${citySlug ? citySlug : router?.asPath?.split("/")[1] || ""}`,
            label: breadcrumbTitle,
          },
        ]}
      />

      <div className="container mx-auto px-4 py-8">
        {/* <NewBreadcrumb title={breadcrumbTitle} /> */}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-8">
          {/* Mobile Filter Button - Only visible on mobile */}
          <Sheet open={isFilterSheetOpen} onOpenChange={setIsFilterSheetOpen}>
            <SheetContent
              side={isRtl ? "left" : "right"}
              className="flex h-full w-full flex-col !p-0"
            >
              <div className="overflow-y-auto no-scrollbar h-full p-2">
                <PropertySideFilter
                  showBorder={false}
                  onFilterApply={handleFilterApply}
                  handleClearFilter={handleClearFilter}
                  currentFilters={filters}
                  isMobileSheet={true}
                  setIsFilterSheetOpen={setIsFilterSheetOpen}
                />
              </div>
            </SheetContent>
          </Sheet>

          {/* Side Filter - Hidden on mobile */}
          <div className="hidden xl:block xl:col-span-3">
            <div className="sticky top-24">
              <PropertySideFilter
                onFilterApply={handleFilterApply}
                handleClearFilter={handleClearFilter}
                currentFilters={filters}
              />
            </div>
          </div>

          {/* Main Content Area */}
          <div className="col-span-12 xl:col-span-9">
            {/* Filter Top Bar */}
            {loading ? (
              <FilterTopBarSkeleton />
            ) : (
              <FilterTopBar
                itemCount={filteredProperties.length}
                totalItems={totalCount}
                viewType={viewType}
                setViewType={handleSetViewType}
                sortBy={sortBy}
                setSortBy={setSortBy}
                onOpenFilters={() => setIsFilterSheetOpen(true)}
                showFilterButton={true}
                showSortBy={false}
              />
            )}

            {/* Property Listings */}
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                {[...Array(9)].map((_, index) => (
                  <VerticlePropertyCardSkeleton key={index} />
                ))}
              </div>
            ) : (
              <PropertyListing
                properties={filteredProperties}
                totalCount={totalCount}
                onOpenFilters={() => setIsFilterSheetOpen(true)}
                hasActiveFilters={hasActiveFilters}
                viewType={viewType}
                setViewType={handleSetViewType}
              />
            )}

            {/* Load More Button */}
            {hasMore && !loading && (
              <div className="flex justify-center mt-8">
                <Button
                  onClick={handleLoadMore}
                  disabled={loadingMore}
                  className="primaryBg hover:bg-primary/90"
                >
                  {loadingMore ? t("loadingMore") : t("loadMore")}
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default PropertyList;
