import { useRef, useState } from "react";
import ImageWithPlaceholder from "../image-with-placeholder/ImageWithPlaceholder";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { formatPriceAbbreviated, isRTL } from "@/utils/helperFunction";
import { useRouter } from "next/router";
import { useTranslation } from "../context/TranslationContext";
import { FaArrowRight } from "react-icons/fa";
import CustomLink from "../context/CustomLink";
import SearchBox from "./SearchBox";

const MainSwiper = ({ slides }) => {
  const router = useRouter();
  const t = useTranslation();
  const locale = router?.query?.locale;

  const images = slides;

  const isRtl = isRTL();

  // SearchBox state management for home page - using flat structure
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

  const handleImageClick = (image) => {
    if (image?.property?.id) {
      router.push(`/${locale}/property-details/${image.property.id}`);
    }
  };

  // SearchBox handlers for home page - using flat structure
  const handlePropertyTypeChange = (value) => {
    setPropertyType(value);
  };

  const handleCategoryChange = (value) => {
    setSelectedCategory(value);
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
    // Prepare query parameters for search page
    const queryParams = new URLSearchParams();

    if (propertyType !== 'all') {
      queryParams.set('property_type', propertyType);
    }
    if (selectedCategory) {
      queryParams.set('category_id', selectedCategory);
    }
    if (city) {
      queryParams.set('city', city);
    }
    if (state) {
      queryParams.set('state', state);
    }
    if (country) {
      queryParams.set('country', country);
    }
    if (keywords) {
      queryParams.set('keywords', keywords);
    }
    if (minPrice) {
      queryParams.set('min_price', minPrice);
    }
    if (maxPrice) {
      queryParams.set('max_price', maxPrice);
    }
    if (postedSince !== 'anytime') {
      queryParams.set('posted_since', postedSince);
    }
    if (amenities?.length > 0) {
      queryParams.set('amenities', amenities.join(','));
    }

    const queryString = queryParams.toString();
    router.push(queryString ? `/${locale}/search?${queryString}` : `/${locale}/search`);
    setShowAdvancedFilters(false);
  };

  const handleClearFilters = () => {
    setPropertyType('all');
    setSelectedCategory('');
    setKeywords('');
    setCity('');
    setState('');
    setCountry('');
    setMinPrice('');
    setMaxPrice('');
    setPostedSince('anytime');
    setAmenities([]);
    setShowAdvancedFilters(false);
  };

  const autoplayPlugin = useRef(
    Autoplay({ delay: 3000, stopOnInteraction: false, stopOnMouseEnter: false })
  );

  if (!images || images.length === 0) {
    return null;
  }

  return (
    <div className="relative w-full min-h-[500px] md:min-h-[600px] lg:min-h-[600px] 3xl:min-h-[700px] pb-40">
      <Carousel
        plugins={images.length > 1 ? [autoplayPlugin.current] : []}
        opts={{
          loop: images.length > 1,
          direction: isRtl ? "rtl" : "ltr",
        }}
        onMouseEnter={images.length > 1 ? autoplayPlugin.current.stop : undefined}
        onMouseLeave={images.length > 1 ? autoplayPlugin.current.play : undefined}
        onTouchStart={images.length > 1 ? autoplayPlugin.current.stop : undefined}
        onTouchEnd={images.length > 1 ? () => setTimeout(() => autoplayPlugin.current.play, 3000) : undefined}
        className="w-full h-full relative"
      >
        <CarouselContent>
          {images.map((image, index) => (
            <CarouselItem key={index}>
              <div className="relative w-full h-[320px] md:h-[500px] lg:h-[600px] 3xl:h-[700px]">
                <ImageWithPlaceholder
                  src={image?.web_image}
                  alt={`Property ${index + 1}`}
                  className="object-cover w-full h-full"
                  priority={index === 0}
                />

                <div className="absolute inset-0 bg-black/60" />
                {image?.property && (
                  <div className="absolute inset-0 pointer-events-none">
                    <div className="container mx-auto h-full relative">
                      <div className="absolute top-1/2 left-0 transform -translate-y-1/2 z-10 pl-9 lg:pl-0">
                        <div className="flex flex-col items-start p-2 sm:p-4 md:p-6 bg-white w-[214px] md:w-[400px] lg:w-[580px] shadow-lg pointer-events-auto gap-1 md:gap-3">
                          <h2 className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold text-gray-900 leading-tight">
                            {image.property.translated_title || image.property.title}
                          </h2>
                          {/* Display parameters */}
                          <p className="text-sm text-gray-500 font-medium">
                            {image?.property?.parameters?.slice(0, 3).map(p => `${p.translated_name || p.name}: ${p.value}`).join(', ')}
                          </p>
                          <hr className="w-full border-t border-gray-200 my-3 sm:my-4 md:my-6" />

                          <div className="flex items-center justify-between w-full">
                            <div className="text-lg md:text-xl font-bold primaryColor">
                              {formatPriceAbbreviated(image.property.price)}
                            </div>
                            <CustomLink
                              href={`/property-details/${image.property.slug_id}`}
                              className="bg-gray-900 text-white px-2 py-1 md:px-3 md:py-2 rounded-md text-sm font-normal h-auto pointer-events-auto flex items-center gap-1"
                            >
                              <span className="hidden md:block">{t("viewDetails")}</span>
                              <FaArrowRight size={14} className={`flex-shrink-0 ${isRtl ? "rotate-180" : ""}`} />
                            </CustomLink>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>

        {images && images.length > 1 && (
          <>
            <CarouselPrevious className={" isabsolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white hover:bg-gray-100 text-gray-800 border-0 w-8 h-10 md:w-10 md:h-16 rounded-none"} />
            <CarouselNext className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white hover:bg-gray-100 text-gray-800 border-0 w-8 h-10 md:w-10 md:h-16 rounded-none" />
          </>
        )}
      </Carousel>

      {/* Search Box Container - Restore absolute positioning */}
      <div className="absolute bottom-0 md:bottom-16 left-0 right-0 z-20 px-4">
        <div className="container mx-auto shadow-[0px_14px_36px_3px_#ADB3B852]">
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
          />
        </div>
      </div>
    </div>
  );
};

export default MainSwiper;
