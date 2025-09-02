"use client";

import React, { useState, useCallback, useMemo, useEffect } from "react";
import { useRouter } from "next/router";
import NewBreadcrumb from "../breadcrumb/NewBreadCrumb";
import { useTranslation } from "../context/TranslationContext";
import SearchBox from "../mainswiper/SearchBox";
import PropertyOnMapView from "../google-maps/PropertyOnMapView";
import mapIcon from "@/assets/mapIcon.svg";
import { useSelector } from "react-redux";
import PropertyVerticalNewCard from "../cards/PropertyVerticalNewCard";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getPropertyOnMapApi } from "@/api/apiRoutes";
import { getPostedSince } from "@/utils/helperFunction";
import { PropertyCardSkeleton } from "../skeletons";
import MapPropertyCard from "../cards/MapPropertyCard";

const PropertiesOnMap = () => {
  const t = useTranslation();
  const router = useRouter();
  const { locale } = router?.query || {};
  const webSettings = useSelector((state) => state.WebSetting?.data);
  const language = useSelector((state) => state.LanguageSettings?.active_language);

  // Map states
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [map, setMap] = useState(null);
  const [isMapLoaded, setIsMapLoaded] = useState(false);

  // Property list states
  const [properties, setProperties] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [sortBy, setSortBy] = useState("default");
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMoreData, setHasMoreData] = useState(true);
  const PROPERTIES_PER_PAGE = 6;

  // Helper function to initialize filters from URL parameters
  const initializeFiltersFromURL = useCallback(() => {
    const query = router?.query || {};

    return {
      propertyType: query.property_type || 'all',
      selectedCategory: parseInt(query.category_id) || '',
      keywords: query.keywords || '',
      city: query.city || '',
      state: query.state || '',
      country: query.country || '',
      minPrice: query.min_price || '',
      maxPrice: query.max_price || '',
      postedSince: query.posted_since || 'anytime',
      amenities: query.amenities ? query.amenities.split(',').map(id => parseInt(id)).filter(id => !isNaN(id)) : [],
      showAdvancedFilters: query.show_advanced_filters === 'true'
    };
  }, [router?.query]);

  // SearchBox state management - initialize from URL
  const [propertyType, setPropertyType] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [keywords, setKeywords] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [country, setCountry] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [postedSince, setPostedSince] = useState('anytime');
  const [amenities, setAmenities] = useState([]);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  // Initialize filters from URL parameters when component mounts or URL changes
  useEffect(() => {
    if (router?.isReady) {
      const urlFilters = initializeFiltersFromURL();
      setPropertyType(urlFilters.propertyType);
      setSelectedCategory(urlFilters.selectedCategory);
      setKeywords(urlFilters.keywords);
      setCity(urlFilters.city);
      setState(urlFilters.state);
      setCountry(urlFilters.country);
      setMinPrice(urlFilters.minPrice);
      setMaxPrice(urlFilters.maxPrice);
      setPostedSince(urlFilters.postedSince);
      setAmenities(urlFilters.amenities);
      setShowAdvancedFilters(urlFilters.showAdvancedFilters);
    }
  }, [router?.isReady, initializeFiltersFromURL]);

  // Container style for the map
  const containerStyle = {
    width: "100%",
    height: "100%",
    borderRadius: "0.5rem",
  };

  // Default map center from web settings
  const defaultCenter = useMemo(
    () => ({
      lat: Number(webSettings?.latitude) || 23.2532,
      lng: Number(webSettings?.longitude) || 69.6695,
    }),
    [webSettings],
  );

  // Map icon configuration
  const iconConfig = useMemo(() => {
    if (!mapIcon?.src) return null;
    return {
      url: mapIcon.src,
      scaledSize: { width: 33, height: 48 },
    };
  }, [mapIcon?.src]);

  // Handle marker click on map
  const handleMarkerClick = (property) => {
    setSelectedProperty(property);
  };

  // Handle info window close
  const handleInfoWindowClose = () => {
    setSelectedProperty(null);
  };

  // Load callback function for map
  const onLoad = useCallback((map) => {
    setMap(map);
    setIsMapLoaded(true);
  }, []);

  // Unload callback function for map
  const onUnload = useCallback(() => {
    setMap(null);
    setIsMapLoaded(false);
  }, []);

  // Function to update URL with current filter state
  const updateURLWithFilters = useCallback((newFilters) => {
    if (!router?.isReady) return;

    const urlParams = new URLSearchParams();

    // Add non-empty parameters to URL
    if (newFilters.propertyType && newFilters.propertyType !== 'all') {
      urlParams.set('property_type', newFilters.propertyType);
    }
    if (newFilters.selectedCategory) {
      urlParams.set('category_id', newFilters.selectedCategory);
    }
    if (newFilters.keywords) {
      urlParams.set('keywords', newFilters.keywords);
    }
    if (newFilters.city) {
      urlParams.set('city', newFilters.city);
    }
    if (newFilters.state) {
      urlParams.set('state', newFilters.state);
    }
    if (newFilters.country) {
      urlParams.set('country', newFilters.country);
    }
    if (newFilters.minPrice) {
      urlParams.set('min_price', newFilters.minPrice);
    }
    if (newFilters.maxPrice) {
      urlParams.set('max_price', newFilters.maxPrice);
    }
    if (newFilters.postedSince && newFilters.postedSince !== 'anytime') {
      urlParams.set('posted_since', newFilters.postedSince);
    }
    if (newFilters.amenities?.length > 0) {
      urlParams.set('amenities', newFilters.amenities.join(','));
    }
    if (newFilters.showAdvancedFilters) {
      urlParams.set('show_advanced_filters', 'true');
    }

    const queryString = urlParams.toString();
    const currentPath = router?.asPath?.split("?")[0] || "/";
    const newUrl = queryString ? `${currentPath}?${queryString}` : currentPath;

    router.push({
      pathname: `/${locale}/properties-on-map/`,
      query: queryString ? Object.fromEntries(urlParams.entries()) : {},
    }, newUrl
    );
  }, [router]);

  // Fetch properties using the properties on map API
  const fetchProperties = async (isReset = false, loadMore = false) => {
    try {
      if (loadMore) {
        setIsLoadingMore(true);
      } else {
        setIsLoading(true);
        if (isReset) {
          setCurrentPage(1);
          setHasMoreData(true);
        }
      }

      // Prepare API parameters
      const apiParams = {
        // Map property type to API format
        property_type: propertyType === 'sell' ? '0' : propertyType === 'rent' ? '1' : '',
        category_id: selectedCategory,
        city: city || '',
        state: state || '',
        country: country || '',
        min_price: minPrice || '',
        max_price: maxPrice || '',
        posted_since: postedSince !== 'anytime' ? getPostedSince(postedSince) : '',
        parameter_id: amenities?.length > 0 ? amenities.join(',') : '',
        search: keywords || '',
        // Map center coordinates for radius search
        latitude: "",
        longitude: "",
        // radius: '50', // 50km radius by default
      };

      const response = await getPropertyOnMapApi(isReset ? {} : apiParams);

      if (!response.error) {
        const allProperties = response?.data || [];

        // Simulate pagination with client-side slicing
        const pageToFetch = loadMore ? currentPage + 1 : (isReset ? 1 : currentPage);
        const startIndex = (pageToFetch - 1) * PROPERTIES_PER_PAGE;
        const endIndex = startIndex + PROPERTIES_PER_PAGE;
        const paginatedProperties = allProperties.slice(startIndex, endIndex);

        // Check if there's more data available
        const hasMore = endIndex < allProperties.length;
        setHasMoreData(hasMore);

        if (loadMore) {
          // Append new properties to existing ones
          setProperties(prevProperties => [...prevProperties, ...paginatedProperties]);
          setCurrentPage(pageToFetch);
        } else {
          // Replace properties (for new search or reset)
          const initialProperties = allProperties.slice(0, PROPERTIES_PER_PAGE);
          setProperties(initialProperties);
          setCurrentPage(1);
          setHasMoreData(PROPERTIES_PER_PAGE < allProperties.length);
        }
      } else {
        console.error("API returned an error:", response.error);
        setProperties([]);
        setHasMoreData(false);
      }
    } catch (error) {
      console.error("Error fetching properties:", error);
      setProperties([]);
      setHasMoreData(false);
    } finally {
      setIsLoading(false);
      setIsLoadingMore(false);
    }
  };

  // Sort properties
  const handleSortChange = (value) => {
    setSortBy(value);
    // Implement sorting logic here if needed
  };

  // SearchBox handlers - only update local state, not URL
  const handlePropertyTypeChange = (value) => {
    setPropertyType(value);
  };

  const handleCategoryChange = (value) => {
    setSelectedCategory(parseInt(value));
  };

  const handleKeywordsChange = (value) => {
    setKeywords(value);
  };

  const handleCityChange = (value) => {
    setCity(value);
  };

  const handleStateChange = (value) => {
    setState(value);
  };

  const handleCountryChange = (value) => {
    setCountry(value);
  };

  const handleMinPriceChange = (value) => {
    setMinPrice(value);
  };

  const handleMaxPriceChange = (value) => {
    setMaxPrice(value);
  };

  const handlePostedSinceChange = (value) => {
    setPostedSince(value);
  };

  const handleAmenitiesChange = (value) => {
    setAmenities(value);
  };

  const handleShowAdvancedFiltersChange = (value) => {
    setShowAdvancedFilters(value);
  };

  const handleApplyFilters = () => {
    // Prevent default form submission behavior
    setShowAdvancedFilters(false);

    // Reset pagination when applying new filters
    setCurrentPage(1);
    setHasMoreData(true);

    // Update URL first with shallow routing
    updateURLWithFilters({
      propertyType,
      selectedCategory,
      keywords,
      city,
      state,
      country,
      minPrice,
      maxPrice,
      postedSince,
      amenities,
      showAdvancedFilters: false
    });

    // Then fetch properties without causing page reload
    fetchProperties();
  };

  const handleClearFilters = () => {
    const clearedFilters = {
      propertyType: 'all',
      selectedCategory: '',
      keywords: '',
      city: '',
      state: '',
      country: '',
      minPrice: '',
      maxPrice: '',
      postedSince: 'anytime',
      amenities: [],
      showAdvancedFilters: false
    };
    setPropertyType(clearedFilters.propertyType);
    setSelectedCategory(clearedFilters.selectedCategory);
    setKeywords(clearedFilters.keywords);
    setCity(clearedFilters.city);
    setState(clearedFilters.state);
    setCountry(clearedFilters.country);
    setMinPrice(clearedFilters.minPrice);
    setMaxPrice(clearedFilters.maxPrice);
    setPostedSince(clearedFilters.postedSince);
    setAmenities(clearedFilters.amenities);
    setShowAdvancedFilters(clearedFilters.showAdvancedFilters);

    // Reset pagination when clearing filters
    setCurrentPage(1);
    setHasMoreData(true);

    router.push(
      {
        pathname: `/${locale}/properties-on-map/`,
        query: {},
      },
      `/${locale}/properties-on-map/`
    );

    // Fetch properties after clearing filters to show updated results
    fetchProperties(true);
  };

  // Handle load more functionality
  const handleLoadMore = () => {
    if (!isLoadingMore && hasMoreData) {
      fetchProperties(false, true);
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchProperties();
  }, [language]);

  return (
    <div className="min-h-screen">
      <NewBreadcrumb
        title={t("propertiesOnMap")}
        items={[{ href: "/properties-on-map", label: t("propertiesOnMap") }]}
      />

      {/* Search Box with props */}
      <div className="shadow-[0px_36px_36px_3px_#ADB3B829]">
        <SearchBox
          propertyType={propertyType}
          selectedCategory={selectedCategory}
          keywords={keywords}
          city={city}
          state={state}
          country={country}
          minPrice={minPrice}
          maxPrice={maxPrice}
          postedSince={postedSince}
          amenities={amenities}
          showAdvancedFilters={showAdvancedFilters}
          onPropertyTypeChange={handlePropertyTypeChange}
          onCategoryChange={handleCategoryChange}
          onKeywordsChange={handleKeywordsChange}
          onCityChange={handleCityChange}
          onStateChange={handleStateChange}
          onCountryChange={handleCountryChange}
          onMinPriceChange={handleMinPriceChange}
          onMaxPriceChange={handleMaxPriceChange}
          onPostedSinceChange={handlePostedSinceChange}
          onAmenitiesChange={handleAmenitiesChange}
          onShowAdvancedFiltersChange={handleShowAdvancedFiltersChange}
          onApplyFilters={handleApplyFilters}
          onClearFilters={handleClearFilters}
          className="xl:!px-0"
        />
      </div>

      {/* Main Content - Map and Property Listings */}
      <div className="">
        <div className="flex flex-col gap-6 xl:flex-row">
          {/* Map Section - Left side on desktop */}
          <div className="h-[500px] xl:h-[1318px] w-full overflow-hidden !rounded-none border shadow-md xl:min-w-[52%] 2xl:min-w-[57%]">
            <PropertyOnMapView
              containerStyle={containerStyle}
              defaultCenter={defaultCenter}
              onLoad={onLoad}
              onUnload={onUnload}
              isMapLoaded={isMapLoaded}
              selectedProperty={selectedProperty}
              handleMarkerClick={handleMarkerClick}
              handleInfoWindowClose={handleInfoWindowClose}
              iconConfig={iconConfig}
              data={properties}
            />
          </div>

          {/* Property Listings - Right side on desktop */}
          <div className="container px-3 md:px-0 mt-10">
            {/* Heading and Sort */}
            <div className="h-full w-full">

              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-xl md:text-2xl font-semibold">
                  {t("propertylisting")}
                </h2>
                {/* <div className="flex items-center">
                <span className="mr-2 text-sm">{t("sortBy")}:</span>
                <Select value={sortBy} onValueChange={handleSortChange}>
                <SelectTrigger className="h-9 w-[140px]">
                <SelectValue placeholder={t("default")} />
                </SelectTrigger>
                <SelectContent>
                <SelectItem value="default">{t("default")}</SelectItem>
                <SelectItem value="price_low">
                {t("priceLowToHigh")}
                </SelectItem>
                <SelectItem value="price_high">
                {t("priceHighToLow")}
                </SelectItem>
                    <SelectItem value="newest">{t("newest")}</SelectItem>
                    </SelectContent>
                    </Select>
              </div> */}
              </div>

              {/* Property Cards */}
              <div className="md:max-h-[1260px] w-full xl:max-w-[620px] items-center justify-center md:justify-normal overflow-y-auto lg:mr-[50px] xl:mr-[140px]">
                {isLoading ? (
                  // Loading skeletons
                  <div className="grid grid-cols-1 gap-4 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-2">
                    {Array.from({ length: 4 }).map((_, index) => (
                      <PropertyCardSkeleton key={index} />
                    ))}
                  </div>
                ) : properties.length > 0 ? (
                  <div className="grid grid-cols-1 gap-4 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-2">
                    {properties.map((property, index) => (
                      <div
                        key={index}
                        className={`transition-all flex justify-center duration-200  ${selectedProperty?.id === property.id ? "ring-2 ring-primary" : ""}`}
                        onClick={() => handleMarkerClick(property)}
                      >
                        <MapPropertyCard property={property} />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-12 text-center">
                    <p className="text-gray-500">{t("noPropertiesFound")}</p>
                  </div>
                )}

                {/* Load More Button */}
                {!isLoading && properties.length > 0 && hasMoreData && (
                  <div className="flex justify-center py-3">
                    <button
                      onClick={handleLoadMore}
                      disabled={isLoadingMore}
                      className="px-6 py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                    >
                      {isLoadingMore ? t("loading") : t("loadMore")}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertiesOnMap;
