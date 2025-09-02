"use client";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { formatPriceAbbreviated, getDisplayValueForOption, handlePackageCheck, truncate } from "@/utils/helperFunction";
import { FiHeart } from "react-icons/fi";
import { useTranslation } from "../context/TranslationContext";
import ImageWithPlaceholder from "../image-with-placeholder/ImageWithPlaceholder";
import PremiumIcon from "@/assets/premium.svg";
import { addFavouritePropertyApi } from "@/api/apiRoutes";
import React, { useState } from "react";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { PackageTypes } from "@/utils/checkPackages/packageTypes";
import { useRouter } from "next/router";
import { ReactSVG } from "react-svg";

const PropertyHorizontalCard = ({ property }) => {
  const t = useTranslation();
  const router = useRouter();
  const { locale } = router?.query;
  const userData = useSelector((state) => state.User?.data);
  const [isFavourite, setIsFavourite] = useState(property?.is_favourite);

  const isUserProperty = property?.added_by == userData?.id;

  const validParameters = property?.parameters
    ?.filter((elem) => elem?.value !== "" && elem?.value !== "0")
    .slice(0, 3);

  const handleFavourite = async () => {
    try {
      const res = await addFavouritePropertyApi({
        property_id: property?.id,
        type: isFavourite ? 1 : 0
      });

      if (!res?.error) {
        setIsFavourite(!isFavourite);
        toast.success(t(res?.message));
      } else {
        toast.error(res?.message);
      }
    } catch (error) {
      console.error("Error", error);
      toast.error(t(error?.message));
    }
  };

  const handlePropertyClick = (e) => {
    e.preventDefault();
    if (property?.is_premium) {
      handlePackageCheck(e, PackageTypes.PREMIUM_PROPERTIES, router, property?.slug_id, property, isUserProperty, false, t);
    } else if (isUserProperty) {
      router?.push(`/${locale}/my-property/${property.slug_id}`);
    } else {
      router.push(`/${locale}/property-details/${property.slug_id}`);
    }
  };
  return (
    <div
      aria-label={`${property?.translated_title || property?.title} in ${property?.state}`}
      className="group"
    >
      <article
        className="cardBg lg:h-[250px] hover:shadow-lg transition-all duration-500 cardBorder mx-auto grid  grid-cols-1 overflow-hidden rounded-2xl lg:grid-cols-12"
        aria-label={`${property?.translated_title || property?.title} in ${property?.state}`}
      >
        {/* Image Section */}
        <figure className="relative col-span-5 group-hover:cursor-pointer">
          <div className="lg:aspect-square h-full w-full" onClick={handlePropertyClick}>
            <ImageWithPlaceholder
              src={property?.title_image}
              alt={property?.translated_title || property?.title || "Property Image"}
              className="h-[250px] w-full object-fill transition-all duration-300 group-hover:brightness-90"
            />
          </div>
          <button
            className="p-2 rounded-lg absolute top-2 right-2 bg-black/50 text-white"
            aria-label="Add to favourites"
            onClick={handleFavourite}
          >
            {isFavourite ?
              <FaHeart />
              :
              <FaRegHeart />
            }
          </button>
          <figcaption className="sr-only">{property?.translated_title || property?.title} {t("in")} {property?.state}</figcaption>
          {property?.promoted && (
            <span className="primaryTextColor absolute left-3 top-3 rounded-md bg-black px-3 py-1 text-sm font-semibold">
              {t("featured")}
            </span>
          )}
        </figure>

        {/* Content Section */}
        <div className="md:col-span-7 w-full flex flex-col cardBg group-hover:cursor-pointer h-auto">
          <div onClick={handlePropertyClick}>
            {/* Header Section */}
            <header className="mx-2 p-2 flex-grow h-fit">
              <div className="flex justify-between items-center">
                <span className="leadColor primaryBackgroundBg p-2 rounded-lg font-semibold text-base flex items-center gap-2">
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
                    className="w-5 h-5 flex items-center justify-center object-contain shrink-0"
                    alt={property?.category?.translated_name || property?.category?.name || 'category icon'}
                  />
                  {property?.category?.translated_name || property?.category?.name}
                </span>
                <span
                  className={`${property?.property_type === "sell" ? "primarySellBg primarySellText" : "primaryRentBg primaryRentText"} rounded-[100px] px-3 py-1 text-sm font-bold`}
                  itemProp="offeredBy"
                >
                  {t(property?.property_type)}
                </span>
              </div>
              <h1 className="mt-1 text-lg font-bold">{property?.translated_title || property?.title}</h1>
              <p className="text-sm" itemProp="addressLocality">
                {`${property?.city ? property?.city + ", " : ""} ${property?.state ? property?.state + ", " : ""} ${property?.country ? property?.country : ""}`}
              </p>
            </header>
            {/* Parameters Section - Always show container for consistent height */}
            <div className="mb-2">
              <hr className="cardBorder" />
              <div
                className="flex justify-between items-center gap-6 px-4 py-3"
                itemProp="additionalProperty"
              >
                {validParameters && validParameters.length > 0 ? (
                  validParameters.map((parameter, index) => (
                    <React.Fragment key={index}>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger className="!w-fit">
                            <div
                              className="flex items-center gap-2 overflow-hidden text-ellipsis"
                              aria-label={parameter?.translated_name || parameter?.name}
                            >
                              <div className="relative flex h-8 w-8 items-center justify-center">
                                <div className="absolute inset-0 rounded-full opacity-50"></div>
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
                                  className="w-5 h-5 flex items-center justify-center object-contain shrink-0"
                                  alt={parameter?.translated_name || parameter?.name || 'category icon'}
                                />
                              </div>
                              <span
                                className="font-medium leadColor"
                                itemProp="numberOfRooms"
                              >
                                {getDisplayValueForOption(parameter)}
                              </span>
                            </div>
                          </TooltipTrigger>
                          <TooltipContent>{parameter?.translated_name || parameter?.name}</TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                      {(index < validParameters.length - 1) && <div className="border-l-2 h-6" />}
                    </React.Fragment>
                  ))
                ) : (
                  // Placeholder divs to maintain layout when no parameters
                  <div className="h-8 opacity-0">No parameters</div>
                )}
              </div>
              <hr className="cardBorder" />
            </div>
            {/* Footer Section */}
            <footer className="mx-2 flex items-center justify-between p-2">
              <span
                className="text-lg font-bold"
                itemProp="price"
                content={property?.price}
              >
                {formatPriceAbbreviated(property?.price.toString())}
              </span>
              {!property?.is_premium && (
                <div className="h-11" />
              )}
              {property?.is_premium && <span
                className={`rounded-[100px] primaryRentBg p-2  font-semibold text-base flex items-center gap-2`}
              >
                <ImageWithPlaceholder src={PremiumIcon} alt={"Premium Icon"} className="w-7 h-7" />
                {t("premium")}
              </span>}
            </footer>
          </div>
        </div>
      </article>
    </div>
  );
};

export default PropertyHorizontalCard;
