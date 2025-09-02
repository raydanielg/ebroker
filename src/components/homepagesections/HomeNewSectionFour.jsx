"use client";
import React, { useRef } from "react";
import { ArrowRight } from "lucide-react"; // Zap icon for the title
import { useTranslation } from "../context/TranslationContext";
import { featuredIcon } from "@/assets/svg";
import AnimatedFeaturedCard from "../cards/AnimatedFeaturedCard"; // Import the new component
import CustomLink from "../context/CustomLink";
import { isRTL } from "@/utils/helperFunction";

const HomeNewSectionFour = ({
  translated_title,
  title,
  data = [],
  buttonText = "See Featured Properties",
  buttonLink = "/properties/featured-properties",
}) => {
  const t = useTranslation();
  const containerRef = useRef(null);
  const isRtl = isRTL();
  return (
    <div className="bg-black text-white">
      <div className="container mx-auto px-4 md:px-0 py-5 md:py-10 lg:py-[60px]">
        <div className="grid grid-cols-1 items-start gap-6 md:gap-12 lg:grid-cols-3">
          {/* Keep left column sticky */}
          <div className={`flex items-start flex-col text-center ${data?.length > 1 ? "lg:sticky lg:top-[180px]" : ""} lg:col-span-1 lg:text-left`}>
            <div className="mb-4 inline-flex justify-start h-16 w-16 items-center md:justify-center rounded-full bg-[#181818] p-1 text-white shadow-[0_4.2px_10.8px_2.4px_rgba(255,255,255,0.2)]">
              {featuredIcon()}
            </div>
            <h2 className="mb-4 text-start text-xl md:text-3xl font-bold">{translated_title || title}</h2>
            {/* Removed description paragraph */}
            <CustomLink
              href={buttonLink}
              className="inline-flex items-center gap-2 bg-white brandColor rounded-lg border border-white/30 py-2 px-4 md:px-4 md:py-3  text-base font-medium transition-colors duration-200 hover:bg-white/80"
            >
              {t(buttonText)}
              <ArrowRight size={16} className={`${isRtl ? "rotate-180" : ""}`} />
            </CustomLink>
          </div>

          {/* Right Column: Map over data and render the new animated component - Added Padding Bottom */}
          <div
            ref={containerRef}
            className={`relative flex flex-col gap-12 ${data?.length > 1 ? "min-h-[800px]" : ""} lg:col-span-2`}
          >
            {data.slice(0, 4).map((property, index) => (
              // Render the new component, passing props
              <AnimatedFeaturedCard
                key={property?.id} // It's good practice to keep the key here
                property={property}
                index={index}
                data={data} // Pass data if needed for the component
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeNewSectionFour;
