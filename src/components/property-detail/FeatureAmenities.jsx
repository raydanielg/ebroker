import { ReactSVG } from "react-svg";
import CustomLink from "../context/CustomLink";
import { useTranslation } from "../context/TranslationContext";
import ImageWithPlaceholder from "../image-with-placeholder/ImageWithPlaceholder";
import { useSelector } from "react-redux";
import { getDisplayValueForOption } from "@/utils/helperFunction";
import Link from "next/link";

const FeaturesAmenities = ({ data, themeEnabled, DistanceSymbol }) => {
  const t = useTranslation();
  const webSettings = useSelector((state) => state.WebSetting?.data);

  // Check if parameters exist and have non-empty values
  const hasParameters =
    data?.parameters?.length > 0 &&
    data.parameters.some(
      (elem) => elem.value !== null && elem.value !== "" && elem.value !== "0",
    );

  // Check if facilities exist and have distance values
  const hasFacilities =
    data?.assign_facilities?.length > 0 &&
    data.assign_facilities.some(
      (elem) =>
        elem.distance !== null && elem.distance !== "" && elem.distance !== 0,
    );

  return (
    <>
      {/* Parameters Section */}
      {hasParameters && (
        <div className="cardBg newBorder mb-7 flex flex-col rounded-2xl">
          <div className="blackTextColor border-b p-5 text-base font-bold md:text-xl">
            {t("feature&Amenities")}
          </div>
          <div className="p-5">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 md:gap-8 xl:grid-cols-4">
              {data.parameters.map((elem, index) =>
                elem.value !== "" && elem.value !== "0" ? (
                  <div key={index} className="flex flex-row gap-4">
                    <div className="flex h-10 w-10 min-w-10 items-center justify-center rounded newBorder">
                      <ReactSVG
                        src={elem?.image}
                        beforeInjection={(svg) => {
                          svg.setAttribute(
                            "style",
                            `height: 100%; width: 100%;`,
                          );
                          svg.querySelectorAll("path").forEach((path) => {
                            path.setAttribute(
                              "style",
                              `fill: var(--facilities-icon-color)`,
                            );
                          });
                        }}
                        className={`flex h-7 w-7 items-center justify-center object-cover`}
                        alt={`Feature ${index + 1}`}
                      />

                    </div>
                    <div className="blackTextColor flex flex-col overflow-hidden text-sm sm:text-base">
                      <span className="font-semibold">{elem?.translated_name || elem?.name}</span>
                      <span className="truncate font-medium">
                        {elem?.value &&
                          typeof elem?.value === "string" &&
                          elem?.value?.startsWith("https://") ? (
                          <Link
                            href={elem?.value || "#"}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {elem.value}
                          </Link>
                        ) : (
                          <>
                            {getDisplayValueForOption(elem)}
                          </>
                        )}
                      </span>
                    </div>
                  </div>
                ) : null,
              )}
            </div>
          </div>
        </div>
      )}

      {/* Facilities Section */}
      {hasFacilities && (
        <div className="cardBg newBorder mb-7 flex flex-col rounded-2xl">
          <div className="blackTextColor border-b p-5 text-base font-bold md:text-xl">
            {t("OTF")}
          </div>
          <div className="p-5">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 md:gap-8 xl:grid-cols-4">
              {data.assign_facilities.map((elem, index) =>
                elem.distance !== "" && elem.distance !== 0 ? (
                  <div key={index} className="flex flex-row gap-4">
                    <div className="newBorderColor flex h-10 w-10 min-w-10 items-center justify-center rounded border-[0.2px]">
                      <ReactSVG
                        src={elem?.image}
                        beforeInjection={(svg) => {
                          svg.setAttribute(
                            "style",
                            `height: 100%; width: 100%;`,
                          );
                          svg.querySelectorAll("path").forEach((path) => {
                            path.setAttribute(
                              "style",
                              `fill: var(--facilities-icon-color)`,
                            );
                          });
                        }}
                        className={`flex h-7 w-7 items-center justify-center object-cover`}
                        alt={`Feature ${index + 1}`}
                      />
                    </div>
                    <div className="blackTextColor flex flex-col overflow-hidden text-sm sm:text-base">
                      <span className="font-semibold">{elem?.translated_name || elem?.name}</span>
                      <span className="truncate font-medium">
                        {elem.distance}{" "}
                        {elem.distance > 1
                          ? t(DistanceSymbol + "s")
                          : t(DistanceSymbol)}
                      </span>
                    </div>
                  </div>
                ) : null,
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default FeaturesAmenities;
