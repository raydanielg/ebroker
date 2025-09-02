// PropertyAddress.js
import React from "react";
import MapImage from "@/assets/map.png";
import Map from "../google-maps/GoogleMap";
// import { t } from '@/utils/translation'
import { useTranslation } from "../context/TranslationContext";
import { LuMapPin } from "react-icons/lu";
import { PiMapPinFill } from "react-icons/pi";
import Link from "next/link";

const PropertyAddress = ({
  details,
  isPremiumProperty,
  isPremiumUser,
  showMap,
  handleShowMap,
  latitude,
  longitude,
  handleOpenGoogleMap,
  isProject = false
}) => {
  const t = useTranslation();

  return (
    <div className="cardBg newBorder mb-7 flex flex-col rounded-2xl">
      <div className="blackTextColor flex flex-col sm:flex-row items-center justify-between border-b p-5 gap-4 md:gap-0">
        <div className="text-base place-self-start font-bold md:text-xl">
          {isProject ? t("project") : t("property")} {t("address")}
        </div>
        <div className="w-full sm:w-auto flex items-center gap-2">
          <button
            onClick={handleOpenGoogleMap}
            className="brandBg w-full primaryTextColor flex justify-center md:justify-normal items-center gap-2 rounded-lg px-3 py-2 text-base font-medium underline "
          >
            <PiMapPinFill className="h-4 w-4 shrink-0 fill-white" />
            {t("openOnGoogleMaps")}
          </button>
        </div>
      </div>
      {!isPremiumProperty || isPremiumUser ? (
        <div className="grid grid-cols-1 gap-4 p-5 md:grid-cols-2 md:gap-7">
          {details.map(
            (item, index) =>
              item.value && (
                <div key={index} className="grid grid-cols-2 max-w-xs">
                  <p className="blackTextColor text-sm font-semibold">
                    {item.label}
                  </p>
                  <p className="blackTextColor text-sm">{item.value}</p>
                </div>
              ),
          )}
        </div>
      ) : null}
      <div className="relative p-5">
        {showMap ? (
          <Map latitude={latitude} longitude={longitude} isDraggable={false} />
        ) : (
          <>
            <div
              className="flex min-h-[400px] w-full items-center justify-center rounded blur-[5px]"
              style={{
                backgroundImage: `url(${MapImage?.src})`,
              }}
            ></div>
            <button
              className="brandBg primaryTextColor absolute left-[35%] top-[40%] rounded px-4 py-2 md:left-[45%] md:top-[45%]"
              onClick={handleShowMap}
            >
              {t("viewMap")}
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default PropertyAddress;
