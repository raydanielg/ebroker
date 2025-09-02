import { useRef, useState } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  CarouselDots,
} from "@/components/ui/carousel";
import PropertyVerticalNewCard from "@/components/cards/PropertyVerticalNewCard";
import { useTranslation } from "@/components/context/TranslationContext";
import CustomLink from "../context/CustomLink";
import { MdArrowForward } from "react-icons/md";
import PropertyCityCard from "../cards/PropertyCityCard";
import ProjectCardWithSwiperNew from "../cards/ProjectCardWithSwiperNew";
import { getBgColorConfig, isRTL } from "@/utils/helperFunction";
import { useIsMobile } from "@/hooks/use-mobile";
import Autoplay from "embla-carousel-autoplay";

const HomeNewSectionTwo = ({ translated_title, title, data, name, label, type = "" }) => {
  const t = useTranslation();
  const isMobile = useIsMobile();
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
  const [api, setApi] = useState(null);
  const bgColor = getBgColorConfig(type);
  const handleLink = () => {
    switch (type) {
      case "nearby_properties_section":
        return "/properties/properties-nearby-city";
      case "properties_by_cities_section":
        return "/properties/properties-nearby-city";
      case "projects_section":
        return "/projects";
      case "most_viewed_properties_section":
        return "/properties/most-viewed-properties";
      case "most_liked_properties_section":
        return "/properties/most-favourite-properties";
      default:
        return "/properties";
    }
  };
  return (
    <div className={`${bgColor}`}>
      <div className="container mx-auto px-4 md:px-0 py-5 sm:py-6 md:py-10 lg:pt-[60px] pb-3">
        <div className="flex flex-col gap-6 md:gap-12">
          <div className="flex items-center justify-center md:justify-between gap-4 md:gap-12">
            <h2 className="max-w-2xl text-xl text-center md:text-start md:text-3xl font-bold">{translated_title || title}</h2>
            {label && (
              <CustomLink
                href={handleLink()}
                className="hidden brandColor brandBorder md:flex items-center justify-center gap-2 rounded-lg border bg-white px-4 py-3 text-xl font-normal transition-colors duration-300 hover:bg-gray-50"
              >
                {t(label)}
                <MdArrowForward className={`${isRtl ? "rotate-180" : ""}`} />
              </CustomLink>
            )}
          </div>

          <div className="relative">
            <Carousel
              opts={{
                dragFree: true,
                slidesToScroll: "auto",
                ...(isMobile && data.length > 1 ? { loop: true } : {}), // Enable loop for better autoplay experience only when data length > 1
                direction: isRtl ? "rtl" : "ltr",
              }}
              setApi={setApi}
              className="w-full"
              plugins={isMobile && data.length > 1 ? [autoplayPlugin.current] : []} // Only add autoplay plugin on mobile and when data length > 1
              onMouseEnter={isMobile && data.length > 1 ? autoplayPlugin.current.stop : undefined}
              onMouseLeave={isMobile && data.length > 1 ? autoplayPlugin.current.play : undefined}
              onTouchStart={isMobile && data.length > 1 ? autoplayPlugin.current.stop : undefined}
              onTouchEnd={isMobile && data.length > 1 ? () => setTimeout(() => autoplayPlugin.current.play, 3000) : undefined}
            >
              <CarouselContent className={isMobile ? "-ml-8" : ""}>
                {data.map((property) => {
                  return (
                    <CarouselItem
                      key={property?.id || property?.City}
                      className={`basis-[80%] sm:basis-1/2 md:basis-1/3 lg:basis-1/4 ${isMobile ? "flex justify-center" : ""}`}
                    >
                      {type === "properties_by_cities_section" ? (
                        <PropertyCityCard property={property} />
                      ) : type === "projects_section" ? (
                        <ProjectCardWithSwiperNew data={property} />
                      ) : type === "similar_projects_section" ? (
                        <ProjectCardWithSwiperNew data={property} />
                      ) : (
                        <PropertyVerticalNewCard property={property} />
                      )}
                    </CarouselItem>
                  );
                })}
              </CarouselContent>
              {label && (
                <CustomLink
                  href={handleLink()}
                  className="md:hidden mt-4 w-fit mx-auto brandColor mb-4 brandBorder flex items-center justify-center gap-2 rounded-lg border bg-white px-3 py-2 text-lg md:px-4 md:py-3 md:text-xl text-nowrap font-normal transition-colors duration-300 hover:brandBg hover:text-white"
                >
                  {t(label)}
                  <MdArrowForward className={`${isRtl ? "rotate-180" : ""}`} />
                </CustomLink>
              )}
              {isMobile && data?.length > 0 ? (
                <div className="flex justify-center mt-6 mb-10 gap-4">
                  <CarouselPrevious className={`shrink-0 relative left-0 right-0 h-10 w-10 translate-y-0 border-none bg-white !shadow-none hover:bg-gray-100 hover:text-gray-900 ${isRtl ? "rotate-180" : ""}`} />
                  <CarouselDots />
                  <CarouselNext className={`shrink-0 relative left-0 right-0 h-10 w-10 translate-y-0 border-none bg-white !shadow-none hover:bg-gray-100 hover:text-gray-900 ${isRtl ? "rotate-180" : ""}`} />
                </div>
              ) : data?.length > 4 ? (
                <div className="flex justify-center mt-12 gap-6">
                  <CarouselPrevious className={`relative left-0 right-0 h-10 w-10 translate-y-0 border-none bg-white !shadow-none hover:bg-gray-100 hover:text-gray-900 ${isRtl ? "rotate-180" : ""}`} />
                  <CarouselDots />
                  <CarouselNext className={`relative left-0 right-0 h-10 w-10 translate-y-0 border-none bg-white !shadow-none hover:bg-gray-100 hover:text-gray-900 ${isRtl ? "rotate-180" : ""}`} />
                </div>
              ) : null}
            </Carousel>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeNewSectionTwo;
