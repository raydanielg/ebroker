'use client'
import { ArrowRight } from 'lucide-react'; // Example icons
import { useTranslation } from '../context/TranslationContext';
import PropertyVerticalNewCard from '../cards/PropertyVerticalNewCard';
import { useSelector } from 'react-redux';
import CategoryCard from '../cards/CategoryCard';
import PremiumPropertyCard from '../cards/PremiumPropertyCard';
import PropertyHorizontalCard from '../cards/PropertyHorizontalCard';
import ArticlesSection from './ArticlesSection';
import CustomLink from '../context/CustomLink';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious, CarouselDots } from '../ui/carousel';
import Autoplay from 'embla-carousel-autoplay'; // Import autoplay plugin
import { useIsMobile } from '@/hooks/use-mobile'; // Import mobile detection hook
import { useRef } from 'react'; // Import useRef for plugin instance
import { isRTL } from '@/utils/helperFunction';

// Define background colors using correct Tailwind arbitrary value syntax
const primarySectionColor = "primaryBgLight";
const secondarySectionColor = "bg-white";

// Define a mapping from section type to background color class
// Only include types that should have the primary color
const SECTION_BG_CONFIG = {
    "categories_section": primarySectionColor,
    "premium_properties_section": primarySectionColor,
    "nearby_properties_section": secondarySectionColor,
    "articles_section": secondarySectionColor,
    // Types not listed will use the default (secondary)
};

const HomeNewSectionOne = ({ translated_title, title, data = [], buttonText = "Explore More Listings", buttonLink = "/properties", name }) => {
    const t = useTranslation();
    const isMobile = useIsMobile(); // Get mobile detection status

    const isRtl = isRTL()

    const autoplayPlugin = useRef(
        Autoplay({
            delay: 3000, // 3 seconds delay between slides
            stopOnInteraction: true, // Stop autoplay when user touches/swipes the carousel
            stopOnMouseEnter: false, // Continue autoplay on mouse enter (mobile doesn't have mouse)
            stopOnFocusIn: false, // Continue autoplay when carousel gains focus
            playOnInit: true, // Start autoplay immediately when carousel initializes
        })
    );

    const userPreferedLocation = useSelector((state) => state.User?.data?.city); // Added optional chaining

    const sectionTitle = name === "nearby_properties_section" && userPreferedLocation
        ? `${translated_title || title} ${t("in")} ${userPreferedLocation}`
        : translated_title || title;

    const sectionType = name;

    // Look up the background color, default to secondary if not found
    const bgColor = SECTION_BG_CONFIG[sectionType] || secondarySectionColor;

    // Filter data for categories section if needed
    const displayData = sectionType === "categories_section"
        ? data.filter(category => category.properties_count > 0)
        : data;

    const renderMobileCarousel = () => {
        if (sectionType === "user_recommendations_section") {
            return (
                <div className="relative">
                    <Carousel
                        className="w-full"
                        plugins={isMobile && displayData.length > 1 ? [autoplayPlugin.current] : []} // Only add autoplay plugin on mobile and when data length > 1
                        opts={{
                            dragFree: true,
                            slidesToScroll: "auto",
                            ...(isMobile && displayData.length > 1 ? { loop: true } : {}), // Enable loop for better autoplay experience only when data length > 1
                            direction: isRtl ? "rtl" : "ltr"
                        }}
                        // Autoplay control events - only active on mobile devices and when data length > 1
                        onMouseEnter={isMobile && displayData.length > 1 ? autoplayPlugin.current.stop : undefined}
                        onMouseLeave={isMobile && displayData.length > 1 ? autoplayPlugin.current.play : undefined}
                        onTouchStart={isMobile && displayData.length > 1 ? autoplayPlugin.current.stop : undefined}
                        onTouchEnd={isMobile && displayData.length > 1 ? () => setTimeout(() => autoplayPlugin.current.play, 3000) : undefined}
                    >
                        <CarouselContent className={isMobile ? "-ml-8" : ""}>
                            {displayData.slice(0, 4).map((element) => (
                                <CarouselItem key={element?.id} className={`!basis-[80%] sm:basis-1/2 md:basis-1/3 ${isMobile ? "flex justify-center" : ""}`}>
                                    <PropertyVerticalNewCard property={element} />
                                </CarouselItem>
                            ))}
                        </CarouselContent>
                        {name === "user_recommendations_section" && data.length > 4 && (
                            <div className="text-center">
                                <CustomLink href={buttonLink} className="mt-6 inline-flex items-center gap-2 py-2 px-4 md:px-6 md:py-3 border border-black rounded-md text-black font-medium hover:brandBg hover:text-white transition-colors duration-200">
                                    {t(buttonText)}
                                    <ArrowRight size={16} className={`${isRtl ? "rotate-180" : ""}`} />
                                </CustomLink>
                            </div>
                        )}
                        <div className="flex justify-center gap-6 mt-6">
                            <CarouselPrevious className="relative left-0 right-0 h-10 w-10 translate-y-0 border-none bg-white !shadow-none hover:bg-gray-100 hover:text-gray-900" />
                            <CarouselDots />
                            <CarouselNext className="relative left-0 right-0 h-10 w-10 translate-y-0 border-none bg-white !shadow-none hover:bg-gray-100 hover:text-gray-900" />
                        </div>
                    </Carousel>
                </div>
            );
        } else if (sectionType === "articles_section") {
            return (
                <div className="mx-auto">
                    <ArticlesSection data={displayData} />
                </div>
            );
        } else {
            return (
                <Carousel
                    className="w-full"
                    plugins={isMobile && displayData?.length > 1 ? [autoplayPlugin.current] : []} // Only add autoplay plugin on mobile and when data length > 1
                    opts={{
                        dragFree: true,
                        slidesToScroll: "auto",
                        ...(isMobile && displayData?.length > 1 ? { loop: true } : {}), // Enable loop for better autoplay experience only when data length > 1
                        direction: isRtl ? "rtl" : "ltr",
                    }}
                    // Autoplay control events - only active on mobile devices and when data length > 1
                    onMouseEnter={isMobile && displayData?.length > 1 ? autoplayPlugin.current.stop : undefined}
                    onMouseLeave={isMobile && displayData?.length > 1 ? autoplayPlugin.current.play : undefined}
                    onTouchStart={isMobile && displayData?.length > 1 ? autoplayPlugin.current.stop : undefined}
                    onTouchEnd={isMobile && displayData?.length > 1 ? () => setTimeout(() => autoplayPlugin.current.reset(), 1000) : undefined}
                >
                    <CarouselContent className={isMobile && sectionType !== "categories_section" ? "-ml-8" : ""}>
                        {displayData?.slice(0, 8)?.map((element) => (
                            <CarouselItem key={element.id} className={`${sectionType === "categories_section" ? "basis-1/2 md:basis-1/3 lg:basis-1/4" : "basis-[85%] sm:basis-1/2 md:basis-1/3 lg:basis-1/4 " + (isMobile ? "flex justify-center" : "")} `}>
                                {sectionType === "featured_projects_section" ? (
                                    <PremiumPropertyCard property={element} />
                                ) : sectionType === "categories_section" ? (
                                    <CategoryCard category={element} />
                                ) : (
                                    <PropertyVerticalNewCard property={element} />
                                )}
                            </CarouselItem>
                        ))}
                    </CarouselContent>
                </Carousel>
            );
        }
    };

    const renderDesktopGrid = () => {
        if (sectionType === "user_recommendations_section") {
            return (
                <div className="grid grid-cols-2 gap-6 justify-center mx-auto">
                    {displayData.slice(0, 4).map((element) => (
                        <PropertyHorizontalCard property={element} key={element?.id} />
                    ))}
                </div>
            );
        } else if (sectionType === "articles_section") {
            return (
                <ArticlesSection data={displayData} />
            );
        } else {
            return (
                <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 place-content-center">
                    {displayData.slice(0, 8).map((element) => {
                        if (sectionType === "featured_projects_section") {
                            return <PremiumPropertyCard property={element} key={element?.id} />;
                        }
                        if (sectionType === "categories_section") {
                            return <CategoryCard category={element} key={element?.id} />;
                        } else {
                            return <PropertyVerticalNewCard property={element} key={element?.id} />;
                        }
                    })}
                </div>
            );
        }
    };

    const renderContent = () => {
        return (
            <>
                {/* Mobile Carousel (visible only on screens smaller than md) */}
                <div className="w-full block md:hidden">
                    {renderMobileCarousel()}
                </div>

                {/* Desktop Grid (visible only on md screens and larger) */}
                <div className="w-full hidden md:block">
                    {renderDesktopGrid()}
                </div>
            </>
        );
    };

    return (
        <div className={`${bgColor}`}> {/* Use the looked-up color */}
            <div className='container mx-auto px-2 md:px-0 py-5 md:py-10 lg:py-[60px]'>
                <div className='flex flex-col gap-6 md:gap-12 items-center'>

                    {/* Section Title */}
                    <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-center text-gray-800 max-w-2xl mx-auto">{sectionTitle}</h2>

                    {renderContent()}

                    {/* Explore More Button */}
                    {buttonText && buttonLink && name !== "user_recommendations_section" && (displayData.length > 8 || data?.length > 3) && (
                        <div className="text-center">
                            <CustomLink href={buttonLink} className="inline-flex items-center gap-2 py-2 px-3 md:px-4 md:py-3 border border-black rounded-md text-black font-medium hover:brandBg hover:text-white transition-colors duration-200">
                                {t(buttonText)}
                                <ArrowRight size={16} className={`${isRtl ? "rotate-180" : ""}`} />
                            </CustomLink>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default HomeNewSectionOne;
