"use client";
import { useRef, useState } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import AgentProfileCard from "@/components/cards/AgentProfileCard";
import { MdArrowForward, MdKeyboardArrowLeft, MdKeyboardArrowRight } from "react-icons/md";
import { useTranslation } from "../context/TranslationContext";
import CustomLink from "../context/CustomLink";
import { useIsMobile } from "@/hooks/use-mobile";
import Autoplay from "embla-carousel-autoplay";
import { isRTL } from "@/utils/helperFunction";

const AgentSwiperSection = ({ translated_title, title, data = [] }) => {
  const t = useTranslation();
  const isMobile = useIsMobile();
  const isRtl = isRTL();
  const [api, setApi] = useState(null);
  const autoplayPlugin = useRef(
    Autoplay({
      delay: 3000, // 3 seconds delay between slides
      stopOnInteraction: true, // Stop autoplay when user touches/swipes the carousel
      stopOnMouseEnter: false, // Continue autoplay on mouse enter (mobile doesn't have mouse)
      stopOnFocusIn: false, // Continue autoplay when carousel gains focus
      playOnInit: true, // Start autoplay immediately when carousel initializes
    })
  );

  return (
    <div className="bg-white py-5 md:py-10 lg:py-[60px]">
      <div className="primaryBgLight px-4 container mx-auto rounded-2xl">
        <div className="w-full gap-6 py-12 md:py-[60px] md:px-[55px] lg:px-[75px] flex flex-col md:gap-12 relative">
          <h2 className="mx-auto max-w-2xl text-xl text-center md:text-3xl font-bold text-gray-800">
            {translated_title || title}
          </h2>
          <Carousel
            opts={{
              dragFree: true,
              slidesToScroll: "auto",
              ...(isMobile && data?.length > 1 ? { loop: true } : {}), // Enable loop for better autoplay experience only when data length > 1
              direction: isRTL() ? "rtl" : "ltr",
            }}
            className="w-full relative"
            plugins={isMobile && data?.length > 1 ? [autoplayPlugin.current] : []} // Only add autoplay plugin on mobile and when data length > 1
            onMouseEnter={isMobile && data?.length > 1 ? autoplayPlugin.current.stop : undefined}
            onMouseLeave={isMobile && data?.length > 1 ? autoplayPlugin.current.play : undefined}
            onTouchStart={isMobile && data?.length > 1 ? autoplayPlugin.current.stop : undefined}
            onTouchEnd={isMobile && data?.length > 1 ? () => setTimeout(() => autoplayPlugin.current.play, 3000) : undefined}
            setApi={setApi}
          >
            <CarouselContent>
              {data.map((agent) => (
                <CarouselItem
                  key={agent?.id}
                  className={`pl-4 sm:basis-1/2 lg:basis-1/3 xl:basis-1/5 ${isMobile ? "flex justify-center" : ""}`}
                >
                  <AgentProfileCard agent={agent} />
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>

          <div className="flex justify-center">
            <CustomLink
              href="/all/agents"
              className="flex items-center gap-2 rounded-md bg-black px-4 py-3 font-medium text-white transition-colors hover:bg-gray-800"
            >
              {t("findYourAgent")}
              <MdArrowForward className={`${isRtl ? "rotate-180" : ""}`} />
            </CustomLink>
          </div>
          {isMobile && data?.length > 0 ? (
            <>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  isRtl ? api?.scrollNext() : api?.scrollPrev();
                }}
                className="shrink-0 carousel-arrow carousel-arrow-prev absolute top-1/2 -translate-y-1/2 -left-2 md:left-4 h-10 md:h-16 w-10 md:w-16 bg-white rounded-md shadow-md border border-gray-100 opacity-80 hover:opacity-100 flex items-center justify-center z-10 focus:outline-none"
              >
                <MdKeyboardArrowLeft className="h-6 w-6 md:h-8 md:w-8 text-gray-800" />
              </button>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  isRtl ? api?.scrollPrev() : api?.scrollNext();
                }}
                className="shrink-0 carousel-arrow carousel-arrow-next absolute top-1/2 -translate-y-1/2 -right-2 md:right-4 h-10 md:h-16 w-10 md:w-16 bg-white rounded-md shadow-md border border-gray-100 opacity-80 hover:opacity-100 flex items-center justify-center z-10 focus:outline-none"
              >
                <MdKeyboardArrowRight className="h-6 w-6 md:h-8 md:w-8 text-gray-800" />
              </button>
            </>
          ) : data?.length > 4 ? (
            <>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  isRtl ? api?.scrollNext() : api?.scrollPrev();
                }}
                className="carousel-arrow carousel-arrow-prev absolute top-1/2 -translate-y-1/2 left-0 md:left-0 h-10 md:h-16 w-10 md:w-10 bg-white rounded-md shadow-md border border-gray-100 opacity-80 hover:opacity-100 flex items-center justify-center z-10 focus:outline-none"
              >
                <MdKeyboardArrowLeft className="h-6 w-6 md:h-8 md:w-8 text-gray-800" />
              </button>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  isRtl ? api?.scrollPrev() : api?.scrollNext();
                }}
                className="carousel-arrow carousel-arrow-next absolute top-1/2 -translate-y-1/2 right-0 md:right-0 h-10 md:h-16 w-10 md:w-10 bg-white rounded-md shadow-md border border-gray-100 opacity-80 hover:opacity-100 flex items-center justify-center z-10 focus:outline-none"
              >
                <MdKeyboardArrowRight className="h-6 w-6 md:h-8 md:w-8 text-gray-800" />
              </button>
            </>
          ) : null}
        </div>

      </div>
    </div>
  );
};

export default AgentSwiperSection;
