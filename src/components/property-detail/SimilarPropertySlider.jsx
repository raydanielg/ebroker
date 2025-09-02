"use client";
import React, { useState } from "react";
// Import shadcn carousel components
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  CarouselDots,
} from "@/components/ui/carousel";

import PropertyVerticalNewCard from "../cards/PropertyVerticalNewCard";
import VerticlePropertyCardSkeleton from "../skeletons/VerticlePropertyCardSkeleton";

import { FaArrowRightArrowLeft } from "react-icons/fa6";
import ComparePropertyModal from "../compare-property/ComparePropertyModal";
import { useTranslation } from "../context/TranslationContext";
import { useSelector } from "react-redux";
import { useIsMobile } from "@/hooks/use-mobile";

const SimilarPropertySlider = ({ data, isLoading, currentPropertyId }) => {
  const t = useTranslation();
  const language = useSelector(
    (state) => state.LanguageSettings.current_language,
  );
  const isMobile = useIsMobile();
  const [showCompareModal, setShowCompareModal] = useState(false);
  const [api, setApi] = useState(null);

  // Calculate the number of properties, default to 0 if undefined/null
  const propertyCount = data?.length || 0;

  const handleOpenCompareModal = () => {
    setShowCompareModal(true);
  };

  const handleCloseCompareModal = () => {
    setShowCompareModal(false);
  };

  return (
    <div className="w-full py-4 sm:py-10">
      {data?.length > 0 ? (
        <>
          <div className="pb-8">
            <span className="blackTextColor text-xl font-bold md:text-2xl">
              {t("compareWithSimilarProperties")}
            </span>
          </div>
          <div className="grid grid-cols-12 gap-6">
            {/* Properties Carousel - Takes 8 columns out of 12 */}
            <div className="col-span-12 md:col-span-12 lg:col-span-9">
              {propertyCount > 0 && (
                <div className="relative w-full">
                  <Carousel
                    opts={{
                      // loop: propertyCount >= 3,
                      direction: language?.rtl === 1 ? "rtl" : "ltr",
                      slidesToScroll: "auto",
                      dragFree: true
                    }}
                    setApi={setApi}
                    className="w-full"
                  >
                    <CarouselContent className="-ml-2">
                      {isLoading
                        ? Array.from({ length: 6 }).map((_, index) => (
                          <CarouselItem
                            key={index}
                            className="basis-full pl-2 sm:basis-1/2 lg:basis-1/3"
                          >
                            <VerticlePropertyCardSkeleton />
                          </CarouselItem>
                        ))
                        : data &&
                        data.map((property, index) => (
                          <CarouselItem
                            key={property.id || index}
                            className={`basis-full pl-2 md:basis-1/2 lg:basis-1/2 xl:basis-1/3 ${isMobile ? 'flex justify-center' : ''}`}
                          >
                            <PropertyVerticalNewCard property={property} />
                          </CarouselItem>
                        ))}
                    </CarouselContent>
                    {/* Carousel Dots - Must be inside Carousel component */}
                    {propertyCount > 3 && (
                      <div className="flex justify-center gap-6 mt-6">
                        <CarouselPrevious className="shrink-0 relative rtl:rotate-180 left-0 right-0 h-10 w-10 translate-y-0 border-none bg-white !shadow-none hover:bg-gray-100 hover:text-gray-900" />
                        <CarouselDots />
                        <CarouselNext className="shrink-0 relative rtl:rotate-180 left-0 right-0 h-10 w-10 translate-y-0 border-none bg-white !shadow-none hover:bg-gray-100 hover:text-gray-900" />
                      </div>
                    )}

                  </Carousel>
                </div>
              )}

            </div>

            {/* Compare Card - Takes 3 columns out of 12 */}
            <div className="col-span-12 md:col-span-12 lg:col-span-3 ">
              <div className="cardBg newBorder flex h-full max-h-[428px] flex-col items-center rounded-2xl p-4 md:p-6 text-center">
                <div className="primaryBgLight08 flex w-full h-full flex-col gap-4 items-center justify-center rounded-2xl p-4">
                  {/* Compare Icon */}
                  <div className="primaryBgLight12 flex h-16 w-16 items-center justify-center rounded-2xl">
                    <FaArrowRightArrowLeft className="primaryColor" size={24} />
                  </div>
                  {/* Title */}
                  <h3 className="blackTextColor text-sm lg:text-base font-bold">
                    {t("compareTitle")}
                  </h3>
                  {/* Description */}
                  <p className="leadColor text-sm lg:text-base">
                    {t("compareDesc")}
                  </p>
                  {/* Compare Button */}
                  <button
                    className="primaryBg rounded-lg px-2 py-2 md:px-2 md:py-1 lg:px-3 lg:py-3 font-semibold text-sm lg:text-base text-white transition-all duration-200 hover:opacity-90 hover:shadow-lg"
                    onClick={handleOpenCompareModal}
                  >
                    {t("compareNow")}
                  </button>
                </div>
              </div>
            </div>
          </div>{" "}
          {/* Property Compare Modal */}
          <ComparePropertyModal
            show={showCompareModal}
            handleClose={handleCloseCompareModal}
            similarProperties={data}
            currentPropertyId={currentPropertyId}
          />
        </>
      ) : null}
    </div>
  );
};

export default SimilarPropertySlider;
