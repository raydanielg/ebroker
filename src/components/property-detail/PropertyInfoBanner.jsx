import React from "react";
import { FaBed, FaBath, FaRulerCombined } from "react-icons/fa";
import { MdLocationOn } from "react-icons/md";
import { useTranslation } from "../context/TranslationContext";
import { capitalizeFirstLetter, formatPriceAbbreviated, getDisplayValueForOption, truncate } from "@/utils/helperFunction";
import Image from "next/image";
import { LuMapPin } from "react-icons/lu";
import { IoMdTime } from "react-icons/io";
import { ReactSVG } from "react-svg";

const PropertyInfoBanner = ({ property }) => {
  const t = useTranslation();

  return (
    <div className="cardBg rounded-xl p-2 shadow-sm md:p-4 lg:p-6">
      <div className="flex flex-col md:flex-row items-center justify-between gap-2 border-b pb-2 md:gap-6">
        {/* Left side - Title and Location */}
        <div className="flex-1 w-full">
          <div className="mb-2 flex items-center gap-2 md:gap-4">
            <div className="primaryBackgroundBg flex items-center justify-center rounded-lg px-4 py-2">
              <ReactSVG
                src={property?.category?.image}
                beforeInjection={(svg) => {
                  svg.setAttribute(
                    "style",
                    `height: 100%; width: 100%;`,
                  );
                  svg.querySelectorAll("path").forEach((path) => {
                    path.setAttribute(
                      "style",
                      `fill: var(--facilities-icon-color);`,
                    );
                  });
                }}
                className="brandColor h-5 w-5 rounded-full object-cover"
                alt={property?.category?.translated_name || property?.category?.name || 'category icon'}
              />
              {property?.category?.category && (
                <span className="leadColor ml-2 text-sm font-semibold">
                  {property?.category?.translated_name || property?.category?.category}
                </span>
              )}
            </div>
            <div className="flex items-center gap-1 text-xs font-semibold text-gray-500 md:text-sm">
              <IoMdTime className="h-4 w-4 md:h-6 md:w-6" />
              {property?.posted_on && <span>{property?.posted_on}</span>}
            </div>
          </div>
          <h2 className="blackTextColor mb-2 text-sm font-bold sm:text-base md:text-xl lg:text-2xl">
            {capitalizeFirstLetter(property?.translated_title || property?.title)}
          </h2>
        </div>

        {/* Right side - Price and Type */}
        <div className="w-full md:w-fit flex flex-col items-end self-start">
          <div className="mb-2 w-full md:w-fit flex flex-row-reverse md:flex-col justify-between  md:justify-normal items-center gap-1 md:gap-3">
            <span
              className={`status-badge self-end ${property?.property_type === "sell" ? "primarySellBg primarySellText" : "primaryRentBg primaryRentText"} mr-3`}
            >
              {property?.property_type === "sell" ? t("sell") : t("rent")}
            </span>
            <span className="brandColor text-sm font-bold sm:text-base md:text-xl lg:text-2xl">
              {formatPriceAbbreviated(property?.price)}
              {property?.property_type === "rent" &&
                property?.rent_duration && (
                  <span className="ml-1 text-sm font-normal">
                    /{property?.rent_duration}
                  </span>
                )}
            </span>
          </div>
        </div>
      </div>
      <div className="flex flex-wrap items-center justify-center gap-2 pt-2 text-xs font-semibold sm:justify-between md:text-sm">
        <div className="leadColor flex items-center text-sm">
          <LuMapPin className="mr-1 text-lg" />
          <span>
            {property?.address}, {property?.city}, {property?.state}
          </span>
        </div>
        <div className="place-self-center flex flex-wrap justify-center md:justify-normal items-center gap-4 md:gap-4 [&>div:last-child>span]:border-0">
          {property?.parameters?.slice(0, 4)?.map((parameter, idx) => (
            <div
              key={parameter?.id}
              className="flex items-center gap-2 md:gap-3"
            >
              <ReactSVG
                src={parameter?.image}
                beforeInjection={(svg) => {
                  svg.setAttribute(
                    "style",
                    `height: 100%; width: 100%;`,
                  );
                  svg.querySelectorAll("path").forEach((path) => {
                    path.setAttribute(
                      "style",
                      `fill: var(--facilities-icon-color);`,
                    );
                  });
                }}
                className="leadColor h-4 w-4 object-contain"
                alt={parameter?.translated_name || parameter?.name || 'facilites icon'}
              />

              <span className="text-sm truncate font-medium">
                {getDisplayValueForOption(parameter)}
              </span>
              <span className="h-4 border-r" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PropertyInfoBanner;
