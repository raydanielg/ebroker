'use client';

import React, { useRef } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { useTranslation } from '../context/TranslationContext';
import PremiumPropertyCard from '../cards/PremiumPropertyCard';
import CustomLink from '../context/CustomLink';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious, CarouselDots } from '../ui/carousel';
import { getBgColorConfig, isRTL } from '@/utils/helperFunction';
import { useIsMobile } from '@/hooks/use-mobile';
import Autoplay from 'embla-carousel-autoplay';

const PremiumPropertiesSection = ({ translated_title, title, data = [], buttonText = "See All Premium Properties", buttonLink = "/properties/?is_premium=true", type }) => {
    const t = useTranslation();

    const isMobile = useIsMobile();
    const isRtl = isRTL();
    const autoplayPlugin = useRef(
        Autoplay({
            delay: 3000, // 3 seconds delay between slides
            stopOnInteraction: true, // Stop autoplay when user touches/swipes the carousel
            stopOnMouseEnter: false, // Continue autoplay on mouse enter (mobile doesn't have mouse)
            stopOnFocusIn: false, // Continue autoplay when carousel gains focus
            playOnInit: true, // Start autoplay immediately when carousel initializes
        })
    );


    // Only display up to 4 properties for this layout
    const displayData = data.slice(0, 4);
    // const bgColor = bgColorConfig[type] || "bg-white";
    const bgColor = getBgColorConfig(type);
    // If we don't have any properties, don't render the section
    if (!displayData.length) {
        return null;
    }



    return (
        <div className={`${bgColor}`}>
            <div className="container mx-auto px-4 md:px-0 py-6 md:py-10 lg:py-[60px]">
                <div className="flex flex-col gap-6 md:gap-12">
                    {/* Section Title */}
                    <h2 className="text-xl md:text-3xl font-bold text-center text-gray-800">{translated_title || title}</h2>
                    {/* Mobile Carousel (visible only up to md breakpoint) */}
                    <div className="lg:hidden relative">
                        <Carousel
                            className="w-full"
                            plugins={isMobile && displayData.length > 1 ? [autoplayPlugin.current] : []}
                            onMouseEnter={isMobile && displayData.length > 1 ? autoplayPlugin.current.stop : undefined}
                            onMouseLeave={isMobile && displayData.length > 1 ? autoplayPlugin.current.play : undefined}
                            onTouchStart={isMobile && displayData.length > 1 ? autoplayPlugin.current.stop : undefined}
                            onTouchEnd={isMobile && displayData.length > 1 ? () => setTimeout(() => autoplayPlugin.current.play, 3000) : undefined}
                            opts={{
                                direction: isRtl ? "rtl" : "ltr",
                                slidesToScroll: "auto",
                                ...(displayData.length > 1 ? { loop: true } : {}), // Enable loop only when data length > 1
                            }}
                        >
                            <CarouselContent>
                                {displayData.map((property, index) => (
                                    <CarouselItem key={property?.id || index} className="basis-full sm:basis-1/2">
                                        <div className="h-full min-h-[550px]">
                                            <PremiumPropertyCard property={property} />
                                        </div>
                                    </CarouselItem>
                                ))}
                            </CarouselContent>
                            {buttonText && buttonLink && data.length > 4 && (
                                <div className="mt-10 md:hidden text-center">
                                    <CustomLink href={buttonLink} className="inline-flex items-center gap-2 px-4 py-2 md:px-4 md:py-3 border border-black rounded-md text-black font-medium hover:brandBg hover:text-white transition-colors duration-200">
                                        {t(buttonText)}
                                        <ArrowRight size={16} className={`${isRtl ? "rotate-180" : ""}`} />
                                    </CustomLink>
                                </div>
                            )}
                            <div className="flex justify-center gap-6 mt-4">
                                <CarouselPrevious className={`relative left-0 right-0 h-10 w-10 translate-y-0 border-none bg-white !shadow-none hover:bg-gray-100 hover:text-gray-900 ${isRtl ? "rotate-180" : ""}`} />
                                <CarouselDots />
                                <CarouselNext className={`relative left-0 right-0 h-10 w-10 translate-y-0 border-none bg-white !shadow-none hover:bg-gray-100 hover:text-gray-900 ${isRtl ? "rotate-180" : ""}`} />
                            </div>
                        </Carousel>
                    </div>
                    {/* Desktop Grid Layout (hidden on mobile, visible from md breakpoint) */}
                    {displayData.length === 1 && (
                        // Single card centered layout
                        <div className="hidden lg:flex justify-center">
                            <div className="w-full max-w-md">
                                <PremiumPropertyCard property={displayData[0]} type={type} />
                            </div>
                        </div>
                    )}

                    {displayData.length === 2 && (
                        // Two cards side by side layout
                        <div className="hidden lg:grid grid-cols-2 gap-6 max-w-4xl mx-auto">
                            <div className="h-full">
                                <PremiumPropertyCard property={displayData[0]} type={type} />
                            </div>
                            <div className="h-full">
                                <PremiumPropertyCard property={displayData[1]} type={type} />
                            </div>
                        </div>
                    )}

                    {displayData.length === 3 && (
                        // Three cards side by side layout
                        <div className="hidden lg:grid grid-cols-3 gap-6">
                            <div className="h-full">
                                <PremiumPropertyCard property={displayData[0]} type={type} />
                            </div>
                            <div className="h-full">
                                <PremiumPropertyCard property={displayData[1]} type={type} />
                            </div>
                            <div className="h-full">
                                <PremiumPropertyCard property={displayData[2]} type={type} />
                            </div>
                        </div>
                    )}

                    {displayData.length >= 4 && (
                        // Four cards complex grid layout
                        <div className="hidden lg:grid grid-cols-6 gap-4 max-h-[700px]" style={{ gridTemplateRows: 'repeat(6, 1fr)' }}>
                            {/* Left card - full height */}
                            <div className="col-span-2 row-span-6 h-full">
                                {displayData[0] && (
                                    <div className="h-full">
                                        <PremiumPropertyCard property={displayData[0]} type={type} />
                                    </div>
                                )}
                            </div>
                            {/* Right card - full height */}
                            <div className="col-span-2 row-span-6 col-start-5 row-start-1 h-full">
                                {displayData[1] && (
                                    <div className="h-full">
                                        <PremiumPropertyCard property={displayData[1]} type={type} />
                                    </div>
                                )}
                            </div>
                            {/* Top middle card */}
                            <div className="col-span-2 row-span-3 col-start-3 row-start-1">
                                {displayData[2] && (
                                    <PremiumPropertyCard property={displayData[2]} type={type} />
                                )}
                            </div>
                            {/* Bottom middle card */}
                            <div className="col-span-2 row-span-3 col-start-3 row-start-4">
                                {displayData[3] && (
                                    <PremiumPropertyCard property={displayData[3]} type={type} />
                                )}
                            </div>
                        </div>
                    )}
                    {/* Explore More Button */}
                    {buttonText && buttonLink && data?.length > 4 && (
                        <div className="hidden md:block text-center">
                            <CustomLink href={buttonLink} className="inline-flex items-center gap-2 px-4 py-2 md:px-4 md:py-3 border border-black rounded-md text-black font-medium hover:brandBg hover:text-white transition-colors duration-200">
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

export default PremiumPropertiesSection;