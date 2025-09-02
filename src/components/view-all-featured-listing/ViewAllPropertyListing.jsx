import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useTranslation } from "../context/TranslationContext";
import dynamic from "next/dynamic";
import { getCountbyCityApi, getPropertyListApi } from "@/api/apiRoutes";
import PropertyVerticalNewCard from "../cards/PropertyVerticalNewCard";
import PropertyHorizontalCard from "../cards/PropertyHorizontalCard";
import NewBreadcrumb from "../breadcrumb/NewBreadCrumb";
import PropertySideFilter from "../pagescomponents/PropertySideFilter";
import VerticlePropertyCardSkeleton from "../skeletons/VerticlePropertyCardSkeleton";
import PropertySideFilterSkeleton from "../skeletons/PropertySideFilterSkeleton";
import NewBreadcrumbSkeleton from "../skeletons/NewBreadcrumbSkeleton";
import { Sheet, SheetContent } from "../ui/sheet";
import { FaFilter } from "react-icons/fa";
import { Button } from "../ui/button";
import { FiGrid, FiList } from "react-icons/fi";
import FilterTopBarSkeleton from "../skeletons/FilterTopBarSkeleton";
import FilterTopBar from "../reusable-components/FilterTopBar";
import { useSelector } from "react-redux";
import { getPostedSince, isRTL } from "@/utils/helperFunction";
import NoDataFound from "../no-data-found/NoDataFound";

const PropertyCityCard = dynamic(() => import("../cards/PropertyCityCard"), {
  ssr: false,
});

const ViewAllPropertyListing = () => {
  const router = useRouter();
  const t = useTranslation();
  const { locale } = router?.query || {};
  const searchParams = router?.query || {};

  const slug = router?.query?.slug;
  const isRtl = isRTL();

  const [propertyData, setPropertyData] = useState([]);
  const [offset, setOffset] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMoreData, setHasMoreData] = useState(false);
  const [totalItems, setTotalItems] = useState(0);
  const [isReady, setIsReady] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [isFilterSheetOpen, setIsFilterSheetOpen] = useState(false);
  const [viewType, setViewType] = useState('grid');
  const [filters, setFilters] = useState({
    keywords: searchParams?.keywords || "",
    property_type: searchParams?.property_type || "All",
    category_id: "",
    category_slug_id: "",
    city: "",
    state: "",
    country: "",
    min_price: "",
    max_price: "",
    posted_since: "",
    sortBy: "newest",
    // Initialize with empty values - slug-specific useEffect will set the correct one
    most_viewed: "",
    most_liked: "",
    promoted: searchParams?.promoted,
    is_premium: searchParams?.is_premium || "",
    // Fix: Convert amenities string from URL to array format for proper state handling
    // URL params come as comma-separated strings, but component expects array
    amenities: searchParams?.amenities ? searchParams?.amenities?.split(',').map(id => parseInt(id)).filter(id => !isNaN(id)) : [],
  });

  const language = useSelector((state) => state?.LanguageSettings?.current_language);


  // Track if initial fetch has been done to prevent duplicate calls
  const hasInitialFetched = React.useRef(false);
  const prevFiltersRef = React.useRef();
  const prevSlugRef = React.useRef();

  const limit = 12;

  // Helper function to map property_type values
  const mapPropertyType = (propertyType) => {
    if (propertyType === "Sell") return "0";
    if (propertyType === "Rent") return "1";
    return ""; // For "All" or any other value
  };

  // Dedicated effect to handle slug changes
  useEffect(() => {
    if (!slug) return; // Skip if slug is not yet available

    // Reset pagination state when slug changes
    setPropertyData([]);
    setOffset(0);
    setHasMoreData(false);
    setTotalItems(0);
    setInitialLoading(true);

    // Reset the initial fetch tracker when slug changes
    hasInitialFetched.current = false;

    // Update filters based on new slug
    const updatedFilters = {
      ...filters,
      // Clear all slug-specific parameters
      most_viewed: "",
      most_liked: "",
      promoted: "",
    };

    // Set the appropriate filter based on the new slug
    if (slug === "most-viewed-properties") {
      updatedFilters.most_viewed = "1";
    } else if (slug === "most-favourite-properties") {
      updatedFilters.most_liked = "1";
    } else if (slug === "featured-properties") {
      updatedFilters.promoted = "1";
    }

    // Update filters state with the new values
    setFilters(updatedFilters);

    // Store current slug for reference in future changes
    prevSlugRef.current = slug;
  }, [slug]); // Only run when slug changes

  // This effect handles pagination only
  useEffect(() => {
    // Skip initial render and only run when offset increases (Load More was clicked)
    if (offset > 0 && slug) {
      // Use current filters for load more functionality
      if (slug !== "properties-nearby-city") {
        // For property listings, use current filters
        const dataConfig = fetchDataHelper.find(
          (item) => item.slug === slug,
        );
        if (dataConfig) {
          // Merge current filters with the config data
          const mergedFilters = { ...dataConfig.data, ...filters };
          handleFetchData(mergedFilters, offset);
        }
      } else {
        // For city data, use the city API
        handleFetchCityData(offset);
      }
    }
  }, [offset]); // Only depends on offset

  const handleLoadMore = () => {
    if (hasMoreData) {
      setOffset((prev) => prev + limit);
    }
  };

  const handleFetchData = async (params, currentOffset) => {
    try {
      setIsLoading(true);
      // Use the passed offset rather than the state value
      const updatedParams = {
        ...params,
        search: params?.keywords || "",
        limit: limit.toString(),
        offset: currentOffset.toString(),
        property_type: mapPropertyType(params?.property_type) || "",
        // Ensure these parameters are properly passed
        most_viewed: params?.most_viewed || "",
        most_liked: params?.most_liked || "",
        promoted: params?.promoted === true || params?.promoted === "1" ? "1" : "",
        sort: params?.sortBy || "newest",
        parameter_id: Array.isArray(params?.amenities)
          ? params.amenities.join(',')
          : params?.amenities || "",
        // Add get_all_premium_properties parameter when is_premium is set
        get_all_premium_properties: params?.is_premium || "",
        posted_since: getPostedSince(params?.posted_since),
      };

      const res = await getPropertyListApi(updatedParams);
      if (!res?.error) {
        // If offset is 0, replace data; otherwise append
        if (currentOffset === 0) {
          setPropertyData(res?.data);
        } else {
          setPropertyData((prev) => [...prev, ...res?.data]);
        }
        // Evaluate if more data is available
        evaluateMoreData(
          res?.total || 0,
          currentOffset,
          res?.data?.length || 0,
        );
      }
      setIsLoading(false);
      setInitialLoading(false); // Set initial loading to false after first fetch
    } catch (err) {
      setIsLoading(false);
      setInitialLoading(false); // Set initial loading to false even on error
      setHasMoreData(false);
    }
  };

  const handleFetchCityData = async (currentOffset) => {
    try {
      setIsLoading(true);
      // Use the passed offset rather than the state value
      const params = {
        limit: limit.toString(),
        offset: currentOffset.toString(),
      };
      const res = await getCountbyCityApi(params);
      if (!res?.error) {
        // If offset is 0, replace data; otherwise append
        if (currentOffset === 0) {
          setPropertyData(res?.data);
        } else {
          setPropertyData((prev) => [...prev, ...res?.data]);
        }
        // Evaluate if more data is available
        evaluateMoreData(
          res?.total || 0,
          currentOffset,
          res?.data?.length || 0,
        );
      }
      setIsLoading(false);
      setInitialLoading(false); // Set initial loading to false after first fetch
    } catch (err) {
      console.error("Error fetching nearby cities:", err); // Fixed typo
      setIsLoading(false);
      setInitialLoading(false); // Set initial loading to false even on error
      setHasMoreData(false);
    }
  };

  // More data evaluation helper
  const evaluateMoreData = (total, currentOffset, loadedItems) => {
    // Store total for future reference
    setTotalItems(total);

    // Check if we've loaded all available items
    const hasMore = currentOffset + loadedItems < total;
    setHasMoreData(hasMore);

    return hasMore;
  };

  const fetchDataHelper = [
    {
      slug: "featured-properties",
      data: {
        promoted: "1",
      },
    },
    {
      slug: "most-viewed-properties",
      data: {
        most_viewed: "1",
      },
    },
    {
      slug: "most-favourite-properties",
      data: {
        most_liked: "1",
      },
    },
    {
      slug: "properties-nearby-city",
      data: {},
    },
  ];

  const featureSectionLists = [
    {
      name: "featuredProperties",
      data: propertyData,
      title: t("featuredProperties"),
    },
    {
      name: "mostViewedProperties",
      data: propertyData,
      title: t("mostViewedProperties"),
    },
    {
      name: "mostFavouriteProperties",
      data: propertyData,
      title: t("mostFavouriteProperties"),
    },
    {
      name: "propertiesNearbyCity",
      data: propertyData,
      title: t("propertiesNearbyCity"),
    },
  ];

  useEffect(() => {
    // Skip if no filters or slug
    if (!filters || !slug) return;

    // Skip this effect if it's triggered by the slug change effect
    // This prevents duplicate fetches when slug changes
    if (prevSlugRef.current !== slug) return;

    // Only run fetch if filters change (not on initial mount)
    if (hasInitialFetched.current) {
      // Reset data and pagination
      setPropertyData([]);
      setOffset(0);
      setHasMoreData(false);
      setTotalItems(0);

      // Fetch data based on current filters
      if (slug !== "properties-nearby-city") {
        const dataConfig = fetchDataHelper.find(
          (item) => item.slug === slug,
        );
        if (dataConfig) {
          const mergedFilters = { ...dataConfig.data, ...filters };
          handleFetchData(mergedFilters, 0);
        }
      } else {
        handleFetchCityData(0);
      }
    } else {
      // Initial fetch
      hasInitialFetched.current = true;

      if (slug !== "properties-nearby-city") {
        const dataConfig = fetchDataHelper.find(
          (item) => item.slug === slug,
        );
        if (dataConfig) {
          const mergedFilters = { ...dataConfig.data, ...filters };
          handleFetchData(mergedFilters, 0);
        }
      } else {
        handleFetchCityData(0);
      }
    }

    // Update filters ref for next comparison
    prevFiltersRef.current = filters;
  }, [filters, language]); // Only depend on filters changes

  const handleFilterApply = (newFilters) => {
    // Reset data and pagination state before applying new filters
    setPropertyData([]);
    setOffset(0);
    setHasMoreData(false);
    setTotalItems(0);

    // Reset the initial fetch tracker since this is an explicit filter change
    hasInitialFetched.current = false;

    // Find the data configuration for the current slug
    const dataConfig = fetchDataHelper.find((item) => item.slug === slug);

    // Prepare the merged filters, keeping slug-specific parameters
    const slugSpecificParams = {
      most_viewed: slug === "most-viewed-properties" ? "1" : "",
      most_liked: slug === "most-favourite-properties" ? "1" : "",
      promoted: slug === "featured-properties" ? "1" : newFilters?.promoted === true ? "1" : "",
    };

    // Merge new filters with slug-specific parameters
    const mergedFilters = {
      ...newFilters,
      ...slugSpecificParams
    };
    setFilters(mergedFilters);

    // Create URL params with proper property_type mapping for URL
    // Include slug-specific params in the URL
    const urlParams = { ...mergedFilters };
    // Fix: Convert amenities array to string for URL params
    if (Array.isArray(urlParams.amenities) && urlParams.amenities.length > 0) {
      urlParams.amenities = urlParams.amenities.join(',');
    } else if (Array.isArray(urlParams.amenities) && urlParams.amenities.length === 0) {
      delete urlParams.amenities; // Remove empty amenities from URL
    }

    // Filter out empty parameters from URL
    const cleanUrlParams = Object.fromEntries(
      Object.entries(urlParams).filter(([_, value]) =>
        value !== undefined &&
        value !== null &&
        value !== "" &&
        !(Array.isArray(value) && value.length === 0)
      )
    );

    // Set isReady flag to trigger data fetch
    setIsReady(true);
    if (isFilterSheetOpen) {
      setIsFilterSheetOpen(false);
    }

    // Keep the original property_type value in URL (Sell/Rent/All)
    router?.push(
      {
        pathname: `/${locale}/properties/${slug}`,
        query: cleanUrlParams,
      },
      `/${locale}/properties/${slug}?${new URLSearchParams(cleanUrlParams).toString()}`
    );
  };

  const handleClearFilter = () => {
    // Reset data and pagination state before clearing filters
    setPropertyData([]);
    setOffset(0);
    setHasMoreData(false);
    setTotalItems(0);

    // Reset the initial fetch tracker since this is an explicit filter change
    hasInitialFetched.current = false;

    // Prepare slug-specific parameters
    const slugSpecificParams = {
      most_viewed: slug === "most-viewed-properties" ? "1" : "",
      most_liked: slug === "most-favourite-properties" ? "1" : "",
      promoted: slug === "featured-properties" ? "1" : "",
    };


    // Reset filters back to defaults but preserve slug-specific parameters
    const clearedFilters = {
      keywords: "",
      property_type: "All",
      category_id: "",
      category_slug_id: "",
      city: "",
      state: "",
      country: "",
      min_price: "",
      max_price: "",
      posted_since: "",
      sortBy: "newest",
      amenities: [],
      ...slugSpecificParams
    };

    if (isFilterSheetOpen) {
      setIsFilterSheetOpen(false);
    }

    setFilters(clearedFilters);
    router?.push(`/${locale}/properties/${slug}`);
  };

  return (
    <main className="">
      {/* Conditional Breadcrumb - show skeleton during initial loading */}
      {initialLoading ? (
        <NewBreadcrumbSkeleton />
      ) : (
        <NewBreadcrumb title={t(slug)} items={[{ label: t(slug), href: `/${slug}` }]} />
      )}

      <div className="container mx-auto py-10 md:py-[60px] px-4 md:px-2">
        {/* Conditional layout based on slug */}
        {slug === "properties-nearby-city" ? (
          // Normal grid layout for properties-nearby-city (no side filter)
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {/* Loading skeletons for initial load */}
            {isLoading && propertyData.length === 0 && (
              <>
                {[...Array(12)].map((_, index) => (
                  <VerticlePropertyCardSkeleton key={`skeleton-${index}`} />
                ))}
              </>
            )}

            {!isLoading && propertyData.length === 0 && (
              <div className="col-span-12 flex items-center justify-center">
                <NoDataFound
                  title={t("noDataFound")}
                />
              </div>
            )}

            {/* Actual data */}
            {!isLoading || propertyData.length > 0 ? (
              featureSectionLists?.map((section, index) => {
                if (section.name === "propertiesNearbyCity") {
                  return section?.data?.map((data, index) => (
                    <PropertyCityCard property={data} key={data?.City} />
                  ));
                }
              })
            ) : null}

            {/* Load more skeletons */}
            {isLoading && propertyData.length > 0 && (
              <>
                {[...Array(4)].map((_, index) => (
                  <VerticlePropertyCardSkeleton key={`load-more-skeleton-${index}`} />
                ))}
              </>
            )}
          </div>
        ) : (
          // Layout with side filter for other slugs
          <div className="grid grid-cols-12 gap-4">

            <Sheet open={isFilterSheetOpen} onOpenChange={setIsFilterSheetOpen}>
              <SheetContent
                side={isRtl ? "left" : "right"}
                className="flex h-full w-full flex-col place-content-center !p-0"
              >
                <div className="overflow-y-auto no-scrollbar h-full p-2">
                  <PropertySideFilter
                    showBorder={false}
                    onFilterApply={handleFilterApply}
                    handleClearFilter={handleClearFilter}
                    setIsFilterSheetOpen={setIsFilterSheetOpen}
                    isMobileSheet={true}
                    currentFilters={filters}
                    hideFilter={true}
                    hideFilterType={slug}
                  />
                </div>
              </SheetContent>
            </Sheet>
            <div className="col-span-12 xl:col-span-3 sticky xl:top-[15vh] xl:self-start">


              {/* Conditional PropertySideFilter - show skeleton during initial loading */}
              <div className="hidden xl:block">
                {initialLoading ? (
                  <PropertySideFilterSkeleton />
                ) : (
                  <PropertySideFilter
                    onFilterApply={handleFilterApply}
                    handleClearFilter={handleClearFilter}
                    currentFilters={filters}
                    hideFilter={true}
                    hideFilterType={slug}
                  />
                )}
              </div>
            </div>
            <div className="col-span-12 h-fit xl:col-span-9">
              {/* Property Top Filter Bar */}
              {initialLoading ? (
                <FilterTopBarSkeleton />
              ) : (
                <FilterTopBar
                  itemCount={propertyData.length}
                  totalItems={totalItems}
                  viewType={viewType}
                  setViewType={setViewType}
                  sortBy={filters.sortBy || "newest"}
                  setSortBy={(value) => setFilters(prev => ({ ...prev, sortBy: value }))}
                  onOpenFilters={() => setIsFilterSheetOpen(true)}
                  showFilterButton={true}
                  showSortBy={false}
                />
              )}

              {/* Property Cards Grid/List */}
              <div className={`${viewType === 'grid' ? 'grid grid-cols-1 place-items-center gap-4 sm:grid-cols-2 md:grid-cols-3' : 'grid grid-cols-1 gap-4 sm:gap-6 sm:grid-cols-1 place-items-center'}`}>
                {/* Loading skeletons for initial load */}
                {isLoading && propertyData.length === 0 && (
                  <>
                    {[...Array(12)].map((_, index) => (
                      <VerticlePropertyCardSkeleton key={`skeleton-${index}`} />
                    ))}
                  </>
                )}

                {/* No Data Found */}
                {!isLoading && propertyData.length === 0 && (
                  <div className="col-span-12 flex items-center justify-center">
                    <NoDataFound
                      title={t("noDataFound")}
                    />
                  </div>
                )}

                {/* Actual data */}
                {!isLoading || propertyData.length > 0 ? (
                  featureSectionLists?.map((section, index) => {
                    if (
                      section.name == "featuredProperties" &&
                      slug == "featured-properties"
                    ) {
                      return section?.data?.map((data) => (
                        viewType === 'list' ? (
                          <div key={data?.id} className='w-full'>
                            {/* Show vertical cards on small screens, horizontal on larger screens */}
                            <div className="block lg:hidden">
                              <PropertyVerticalNewCard property={data} />
                            </div>
                            <div className="hidden lg:block">
                              <PropertyHorizontalCard property={data} />
                            </div>
                          </div>
                        ) : (
                          <PropertyVerticalNewCard property={data} key={data?.id} />
                        )
                      ));
                    } else if (
                      section.name == "mostViewedProperties" &&
                      slug == "most-viewed-properties"
                    ) {
                      return section?.data?.map((data) => (
                        viewType === 'list' ? (
                          <div key={data?.id} className='w-full'>
                            {/* Show vertical cards on small screens, horizontal on larger screens */}
                            <div className="block lg:hidden">
                              <PropertyVerticalNewCard property={data} />
                            </div>
                            <div className="hidden lg:block">
                              <PropertyHorizontalCard property={data} />
                            </div>
                          </div>
                        ) : (
                          <PropertyVerticalNewCard property={data} key={data?.id} />
                        )
                      ));
                    } else if (
                      section.name === "mostFavouriteProperties" &&
                      slug === "most-favourite-properties"
                    ) {
                      return section?.data?.map((data) => (
                        viewType === 'list' ? (
                          <div key={data?.id} className='w-full'>
                            {/* Show vertical cards on small screens, horizontal on larger screens */}
                            <div className="block lg:hidden">
                              <PropertyVerticalNewCard property={data} />
                            </div>
                            <div className="hidden lg:block">
                              <PropertyHorizontalCard property={data} />
                            </div>
                          </div>
                        ) : (
                          <PropertyVerticalNewCard property={data} key={data?.id} />
                        )
                      ));
                    }
                  })
                ) : null}

                {/* Load more skeletons */}
                {isLoading && propertyData.length > 0 && (
                  <>
                    {[...Array(3)].map((_, index) => (
                      <VerticlePropertyCardSkeleton key={`load-more-skeleton-${index}`} />
                    ))}
                  </>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Remove the old loading spinner and replace load more with skeleton-aware version */}
        {isLoading === false && hasMoreData ? (
          <div className="mt-5 flex w-full items-center justify-center text-center">
            <button
              className="brandText brandBorder hover:border-transparent hover:primaryBg hover:text-white my-5 rounded-lg border bg-transparent px-4 py-2"
              onClick={handleLoadMore}
            >
              {t("loadMore")}
            </button>
          </div>
        ) : null}
      </div>
    </main>
  );
};

export default ViewAllPropertyListing;
