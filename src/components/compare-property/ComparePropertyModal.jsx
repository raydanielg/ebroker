import React, { useState } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import { FaArrowRightArrowLeft } from "react-icons/fa6";
import { SlLocationPin } from "react-icons/sl";

// Shadcn UI Components
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

// Helper functions and APIs
import { formatPriceAbbreviated, getDisplayValueForOption } from "@/utils/helperFunction";
import { getAllSimilarPropertiesApi } from "@/api/apiRoutes";
import { PackageTypes } from "@/utils/checkPackages/packageTypes";
import { checkPackageAvailable } from "@/utils/checkPackages/checkPackage";
import toast from "react-hot-toast";
import { useTranslation } from "../context/TranslationContext";
import ImageToSVG from "../reusable-components/ImageToSVG";
import premiumIcon from "../../assets/premium.svg";
import { useSelector } from "react-redux";
import ImageWithPlaceholder from "../image-with-placeholder/ImageWithPlaceholder";
import { BiSearchAlt } from "react-icons/bi";
import { AiOutlineClose } from "react-icons/ai";

const ComparePropertyModal = ({
  show,
  handleClose,
  similarProperties,
  currentPropertyId,
}) => {
  const router = useRouter();
  const t = useTranslation();
  const { locale } = router?.query;
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const webSettings = useSelector((state) => state.WebSetting?.data);
  const themeEnabled = webSettings?.svg_clr === "1";

  // Handle search input changes
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
  };

  // Handle search button click
  const handleSearchClick = () => {
    if (searchQuery.length > 2) {
      setIsLoading(true);
      performSearch(searchQuery);
    } else {
      setSearchResults([]);
    }
  };

  // Perform the search
  const performSearch = async (query) => {
    try {
      const res = await getAllSimilarPropertiesApi({
        search: query,
        property_id: currentPropertyId,
        limit: 10,
        offset: 0,
      });
      if (!res?.error && res?.data?.length > 0) {
        setSearchResults(res.data);
      } else {
        setSearchResults([]);
      }
    } catch (error) {
      console.error("Error performing search:", error);
      toast.error(t("searchError"));
    } finally {
      setIsLoading(false);
    }
  };

  // Handle key press in search input
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearchClick();
    }
  };

  const handleCompare = (property) => {
    const isPremiumProperty = property?.is_premium;
    if (isPremiumProperty) {
      checkPackageAvailable(PackageTypes.PREMIUM_PROPERTIES).then(
        (isAvailable) => {
          if (isAvailable) {
            handleClose?.();
            router.push(
              `/${locale}/compare-properties/${currentPropertyId}-vs-${property.id}`,
            );
          } else {
            toast.error(t("premiumPropertyCompare"));
          }
        },
      );
    } else {
      handleClose?.();
      router.push(
        `/${locale}/compare-properties/${currentPropertyId}-vs-${property.id}`,
      );
    }
  };
  return (
    <Dialog open={show} onOpenChange={handleClose}>
      <DialogContent className="cardBg max-h-[90vh] max-w-3xl p-0 [&>button]:hidden overflow-hidden">
        <DialogHeader className="newBorder mb-3 border-b p-6 pb-4">
          <DialogTitle className="blackTextColor flex items-center justify-between text-xl font-semibold">
            {t("selectPropertyToCompare")}
            <button
              type="button"
              onClick={handleClose}
              className="primaryBackgroundBg inline-flex h-10 w-10 items-center justify-center rounded-xl"
            >
              <AiOutlineClose />
            </button>
          </DialogTitle>
          <DialogDescription className="sr-only">
            compare property modal
          </DialogDescription>
        </DialogHeader>

        <div className="px-6">
          {/* Search Container */}
          <div className="relative mb-6">
            <div className="newBorder primaryBackgroundBg relative flex items-center overflow-hidden rounded-lg">
              <input
                type="text"
                placeholder={t("searchProperties")}
                value={searchQuery}
                onChange={handleSearchChange}
                onKeyPress={handleKeyPress}
                className="blackTextColor placeholder:leadColor w-full border-none bg-transparent px-4 text-sm outline-none"
              />
              <button
                onClick={handleSearchClick}
                disabled={!searchQuery}
                className={`primaryBg m-2 flex items-center gap-3 rounded-md px-2 py-2 transition-all duration-200 md:px-3 md:py-2 ${searchQuery
                  ? "primaryBg text-white hover:opacity-90"
                  : "cursor-not-allowed bg-gray-100 text-white"
                  }`}
              >
                <BiSearchAlt />
                {t("search")}
              </button>
            </div>
          </div>
        </div>

        {/* Properties List */}
        <div className="md:px-4 px-6 pb-6">
          <div className="max-h-96 space-y-3 overflow-y-auto">
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="leadColor text-center">{t("loading")}</div>
              </div>
            ) : (
              (searchQuery && searchResults?.length > 0
                ? searchResults
                : similarProperties
              )?.map((property) => (
                <div
                  key={property.id}
                  className="newBorder cardBg flex flex-col items-center justify-between rounded-xl transition-all p-4 duration-200 sm:flex-row"
                >
                  <div className="flex w-full flex-col items-center gap-4 sm:flex-row sm:gap-0">
                    {/* Property Image */}
                      <div className="relative md:mr-4 h-[116px] w-full md:w-28 md:h-28 overflow-hidden rounded-lg sm:h-28">
                      <Image
                        src={property.title_image}
                        alt={property.translated_title || property.title}
                        fill
                        className="w-full sm:w-auto object-fill"
                      />{" "}
                      {property.is_premium && (
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <div className="absolute right-2 top-2">
                                <ImageWithPlaceholder
                                  src={premiumIcon}
                                  alt="premium"
                                  className={`h-6 w-6`}
                                />
                              </div>
                            </TooltipTrigger>
                            <TooltipContent side="top">
                              <p>{t("premiumProperty")}</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      )}
                    </div>
                    {/* Property Details */}
                    <div className="flex flex-col items-start w-full px-2">
                      <h5 className="blackTextColor mb-1 text-base font-semibold">
                        {property.translated_title || property.title}
                      </h5>
                      <div className="leadColor mb-2 flex items-center text-sm">
                        <SlLocationPin
                          size={14}
                          className="mr-1 flex-shrink-0"
                        />
                        <span className="">
                          {`${property?.city ? property?.city + ", " : ""}${property?.state ? property?.state + ", " : ""
                            }${property?.country || ""}`}
                        </span>
                      </div>
                      {/* Property Specs */}
                      {property?.parameters?.length > 0 && (
                        <div className="mb-2 flex flex-wrap items-center gap-2">
                          {property.parameters
                            .slice(0, 3)
                            .map((elem, index) => (
                              <div
                                key={index}
                                className="flex h-full items-center justify-center gap-2 rounded p-[5px] text-sm primaryBackgroundBg leadColor"
                              >
                                <span>{getDisplayValueForOption(elem)}</span>
                                <span >{elem?.translated_name || elem?.name}</span>
                              </div>
                            ))}
                        </div>
                      )}
                      <p className="blackTextColor text-lg font-semibold">
                        {formatPriceAbbreviated(property.price)}
                      </p>
                    </div>
                  </div>

                  {/* Compare Button */}
                  <button
                    onClick={() => handleCompare(property)}
                    className="primaryBg mt-4 md:mt-0 md:ml-4 flex flex-shrink-0 items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-white transition-all duration-200 hover:opacity-90"
                  >
                    <FaArrowRightArrowLeft size={14} />
                    <span className="">{t("compare")}</span>
                  </button>
                </div>
              ))
            )}

            {!isLoading &&
              !searchQuery &&
              (!similarProperties || similarProperties.length === 0) && (
                <div className="leadColor py-8 text-center">
                  {t("noSimilarProperties")}
                </div>
              )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ComparePropertyModal;
