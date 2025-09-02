import React, { useEffect, useState } from "react";
import NewBreadcrumb from "../breadcrumb/NewBreadCrumb";
import { useTranslation } from "../context/TranslationContext";
import { useRouter } from "next/router";
import { SlLocationPin } from "react-icons/sl";
import { formatPriceAbbreviated, truncate } from "@/utils/helperFunction";
import { comparePropertiesAPI } from "@/api/apiRoutes";
import ReusableTable from "../ui/reusable-table";
import { useSelector } from "react-redux";
import ImageWithPlaceholder from "../image-with-placeholder/ImageWithPlaceholder";
import { ReactSVG } from "react-svg";

const CompareProperty = () => {
  const t = useTranslation();
  const router = useRouter();
  const { locale, slug } = router?.query;

  const slugString = Array.isArray(slug) ? slug[0] : slug || "";
  const [sourcePropertyId, targetPropertyId] = slugString.split("-vs-");

  const [properties, setProperties] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const systemSettingsData = useSelector((state) => state?.WebSettings?.data);
  const DistanceSymbol = systemSettingsData?.distance_option || "km";
  const language = useSelector((state) => state.LanguageSettings?.active_language);

  useEffect(() => {
    if (sourcePropertyId && targetPropertyId) {
      fetchPropertiesData();
    }
    // eslint-disable-next-line
  }, [sourcePropertyId, targetPropertyId, language]);

  const fetchPropertiesData = async () => {
    try {
      const res = await comparePropertiesAPI({
        source_property_id: sourcePropertyId,
        target_property_id: targetPropertyId,
      });
      if (!res?.error) {
        setProperties(res?.data || {});
      }
    } catch (err) {
      setError("Failed to fetch properties");
    } finally {
      setLoading(false);
    }
  };

  // Helper: get facility value as tags or string
  const getFacilityValue = (
    property,
    facilityName,
    defaultValue = t("n/a"),
  ) => {
    const facility = property.facilities?.find((f) => f.name === facilityName);
    if (!facility) return defaultValue;
    let value = facility.value;

    // Handle array values (checkbox type)
    if (Array.isArray(value)) {
      return (
        <div className="flex flex-wrap gap-1">
          {value.map((item, idx) => (
            <span
              key={idx}
              className="primaryBg primaryTextColor inline-flex rounded-lg px-2 py-1 text-center text-xs font-medium md:rounded-xl"
            >
              {truncate(item, 20)}
            </span>
          ))}
        </div>
      );
    }

    // Handle JSON string values
    if (
      typeof value === "string" &&
      (value.startsWith("[") || value.startsWith("{"))
    ) {
      try {
        const parsed = JSON.parse(value);
        if (Array.isArray(parsed)) {
          return (
            <div className="flex flex-wrap gap-1">
              {parsed.map((item, idx) => (
                <span
                  key={idx}
                  className="primaryBg primaryTextColor inline-block rounded-full px-2 py-1 text-xs font-medium"
                >
                  {truncate(item, 20)}
                </span>
              ))}
            </div>
          );
        }
        if (typeof parsed === "object") {
          const values = Object.values(parsed).filter(Boolean);
          return (
            <div className="flex flex-wrap gap-1">
              {values.map((item, idx) => (
                <span
                  key={idx}
                  className="primaryBg primaryTextColor inline-block rounded-full px-2 py-1 text-xs font-medium"
                >
                  {truncate(item, 20)}
                </span>
              ))}
            </div>
          );
        }
      } catch {
        // If parsing fails, return the original value
      }
    }


    // Handle quoted string values
    if (
      typeof value === "string" &&
      value.includes(",")
    ) {
      try {
        const valuesArray = value.split(",");
        return (
          <div className="flex flex-wrap gap-1">
            {valuesArray.map((item, idx) => (
              <span
                key={idx}
                className="primaryBg primaryTextColor inline-block rounded-full px-2 py-1 text-xs font-medium"
              >
                {truncate(item, 20)}
              </span>
            ))}
          </div>
        );
      } catch {
        value = value.slice(1, -1);
      }
    }

    return truncate(value, 20) || defaultValue;
  };

  const formatListingDate = (dateString) => {
    if (!dateString) return t("recentlyAdded");
    const date = new Date(dateString);
    const now = new Date();
    const months = Math.floor((now - date) / (1000 * 60 * 60 * 24 * 30));
    return `${months} ${t("monthsAgo")}`;
  };

  // Table data construction
  let tableRows = [];
  if (properties?.source_property && properties?.target_property) {
    const source = properties.source_property;
    const target = properties.target_property;

    // Basic property information rows
    tableRows = [
      {
        label: t("propertyName"),
        propertyA: source?.translated_title || source?.title || t("n/a"),
        propertyB: target?.translated_title || target?.title || t("n/a"),
      },
      {
        label: t("locationName"),
        propertyA: `${source?.city || t("n/a")}, ${source?.state || ""}, ${source?.country || ""}`,
        propertyB: `${target?.city || t("n/a")}, ${target?.state || ""}, ${target?.country || ""}`,
      },
      {
        label: t("listingDate"),
        propertyA: formatListingDate(source?.created_at) || t("n/a"),
        propertyB: formatListingDate(target?.created_at) || t("n/a"),
      },
      {
        label: t("price"),
        propertyA: formatPriceAbbreviated(source?.price),
        propertyB: formatPriceAbbreviated(target?.price),
      },
      {
        label: t("propertyViews"),
        propertyA: source?.total_views || "0",
        propertyB: target?.total_views || "0",
      },
      {
        label: t("propertyLikes"),
        propertyA: source?.total_likes || "0",
        propertyB: target?.total_likes || "0",
      },
    ];

    // Add facility comparison rows
    const allFacilityNames = Array.from(
      new Set([
        ...(source.facilities || []).map((f) => f.translated_name || f.name),
        ...(target.facilities || []).map((f) => f.translated_name || f.name),
      ]),
    ).sort();

    allFacilityNames.forEach((facilityName) => {
      tableRows.push({
        label: facilityName?.translated_name || facilityName?.name || facilityName,
        propertyA: getFacilityValue(source, facilityName, t("n/a")),
        propertyB: getFacilityValue(target, facilityName, t("n/a")),
      });
    });

    // Add nearby places comparison rows
    const sourceNearby = source.near_by_places || [];
    const targetNearby = target.near_by_places || [];

    if (sourceNearby.length || targetNearby.length) {
      const allPlaceNames = Array.from(
        new Set([
          ...sourceNearby.map((p) => p.name),
          ...targetNearby.map((p) => p.name),
        ]),
      ).sort();

      const getPlaceDistance = (places, name) => {
        const place = places.find((p) => p.name === name);
        return place ? `${place.distance} ${DistanceSymbol}` : t("n/a");
      };

      allPlaceNames.forEach((placeName) => {
        tableRows.push({
          label: placeName?.translated_name || placeName?.name || placeName,
          propertyA: getPlaceDistance(sourceNearby, placeName),
          propertyB: getPlaceDistance(targetNearby, placeName),
        });
      });
    }
  }

  // Table columns configuration for ReusableTable
  const columns = [
    {
      header: t("comparisonDetails"),
      accessor: "label",
      align: "left",
      className: "font-bold w-1/3 text-base",
    },
    {
      header: <span className="text-nowrap text-base font-bold">{t("propertyA")}</span>,
      accessor: "propertyA",
      align: "left",
      className: "w-1/3",
      renderCell: (row) => (
        <div className="text-start">
          {typeof row.propertyA === "string" ? row.propertyA : row.propertyA}
        </div>
      ),
    },
    {
      header: <span className="text-nowrap text-base font-bold">{t("propertyB")}</span>,
      accessor: "propertyB",
      align: "left",
      className: "w-1/3",
      renderCell: (row) => (
        <div className="text-start">
          {typeof row.propertyB === "string" ? row.propertyB : row.propertyB}
        </div>
      ),
    },
  ];

  // Loading skeleton data for table
  const loadingData = Array(8)
    .fill(0)
    .map((_, idx) => ({
      label: <div className="h-4 w-3/4 animate-pulse rounded bg-gray-200" />,
      propertyA: (
        <div className="h-4 w-full animate-pulse rounded bg-gray-200" />
      ),
      propertyB: (
        <div className="h-4 w-full animate-pulse rounded bg-gray-200" />
      ),
    }));

  return (
    <section id="compare-property">
      <NewBreadcrumb
        title={t("compareProperties")}
        items={[
          {
            href: `/${locale}/compare-properties/${slug}`,
            label: t("compareProperties"),
          },
        ]}
      />
      <div className="container mx-auto py-10 md:py-[60px]">
        {loading ? (
          <div className="flex flex-col gap-8">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {[0, 1].map((i) => (
                <div
                  key={i}
                  className="compare-property-card bg-primaryCatBg border-primaryCatBg flex animate-pulse gap-4 rounded-2xl border p-6"
                >
                  <div className="compare-property-image h-48 w-full rounded-2xl bg-gray-200" />
                  <div className="flex w-full flex-col gap-3">
                    <div className="proeprtyTag bg-primaryColor w-full rounded-lg px-4 py-2 text-lg font-medium text-white" />
                    <div className="main-details border-primaryColor flex flex-col gap-2 rounded-lg bg-white p-4">
                      <div className="property-location bg-primaryCatBg text-primaryColor w-1/2 rounded-lg px-2 py-1" />
                      <div className="property-title border-primaryColor border-l-2 pl-2 text-lg font-medium" />
                      <div className="price-and-type flex justify-between">
                        <span className="price text-lg font-bold" />
                        <span className="property-type min-w-[66px] rounded-full" />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {/* Loading Table - Desktop */}
            <div className="hidden md:block">
              <ReusableTable
                columns={columns}
                data={loadingData}
                isLoading={false}
                tableClassName="rounded-lg newBorder"
                headerClassName="[&_tr]:!brandBg [&_tr_th]:!text-white"
                rowClassName={(_, idx) =>
                  idx % 2 === 1 ? "primaryBackgroundBg" : ""
                }
              />
            </div>

            {/* Loading Cards - Mobile */}
            <div className="block space-y-4 md:hidden">
              {Array(8)
                .fill(0)
                .map((_, idx) => (
                  <div
                    key={idx}
                    className={`newBorder animate-pulse rounded-lg p-4 ${idx % 2 === 1 ? "primaryBackgroundBg" : "bg-white"
                      }`}
                  >
                    <div className="mb-3 h-4 w-1/2 rounded bg-gray-200" />
                    <div className="space-y-3">
                      <div className="flex flex-col gap-2">
                        <div className="h-6 w-20 rounded bg-gray-200" />
                        <div className="h-4 w-full rounded bg-gray-200" />
                      </div>
                      <div className="flex flex-col gap-2">
                        <div className="h-6 w-20 rounded bg-gray-200" />
                        <div className="h-4 w-full rounded bg-gray-200" />
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        ) : error ||
          !properties?.source_property ||
          !properties?.target_property ? (
          <div className="flex flex-col items-center justify-center py-12">
            <h3 className="text-xl font-semibold text-red-600">
              {error || t("comparePropertiesError")}
            </h3>
            <button
              className="btn btn-primary mt-4"
              onClick={() => router.back()}
            >
              {t("goBack") || "Go Back"}
            </button>
          </div>
        ) : (
          <div className="px-4">
            {/* Property Cards */}
            <div className="mb-10 grid grid-cols-1 gap-6 md:grid-cols-2">
              {[properties.source_property, properties.target_property].map(
                (prop, idx) => (
                  <div
                    key={idx}
                    className="newBorder flex flex-col gap-4 rounded-2xl p-3 md:flex-row md:p-6"
                  >
                    <div className="h-[251px] w-full overflow-hidden rounded-2xl">
                      <ImageWithPlaceholder
                        src={prop?.title_image}
                        alt={prop?.translated_title || prop.title}
                        className="h-full w-full rounded-2xl object-fill"
                      />
                    </div>
                    <div className="flex w-full flex-col gap-3">
                      <div className="brandBg w-full rounded-lg px-4 py-2 text-base font-medium text-white md:text-lg">
                        {idx === 0 ? t("propertyA") : t("propertyB")}
                      </div>
                      <div className="newBorder flex flex-col rounded-lg bg-white ">
                        <div className="flex flex-col gap-2 p-3 md:p-4">
                          <div className="flex justify-between gap-2 items-center">
                            <div className="flex gap-2 items-center w-fit p-2 rounded-md primaryBackgroundBg">
                              <ReactSVG
                                src={prop?.category?.image}
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
                                alt={prop?.category?.translated_name || prop?.category?.name || 'parameter icon'}
                              />
                              <span className="text-sm font-bold leadColor">
                                {prop?.category?.translated_name || prop?.category?.name}
                              </span>
                            </div>
                            <div
                              className={`${prop.property_type === "rent"
                                ? "primaryRentBg primaryRentText"
                                : "primarySellBg primarySellText"
                                } flex items-center justify-center rounded-lg px-3 py-2 text-sm font-medium md:rounded-[100px]`}
                            >
                              {t(prop.property_type)}
                            </div>
                          </div>
                          <div className="brandColor flex items-center justify-between text-base font-bold capitalize">
                            <span className="line-clamp-1">{prop.translated_title || prop.title}</span>

                          </div>
                          <div className="brandColor flex w-fit items-center rounded-lg">
                            <span className="text-xs line-clamp-1 leadColor font-medium md:text-sm">
                              {(prop?.city ? prop.city + ", " : "") +
                                (prop?.state ? prop.state + ", " : "") +
                                (prop?.country || "")}
                            </span>
                          </div>
                        </div>
                        <div className="flex w-full items-center justify-between p-4 border-t">
                          <span className="text-lg font-bold">
                            {formatPriceAbbreviated(prop.price)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ),
              )}
            </div>

            {/* Comparison Table - Desktop */}
            <div className="hidden md:block">
              <ReusableTable
                parentClassName="rounded-xl"
                columns={columns}
                data={tableRows}
                isLoading={false}
                emptyMessage={t("noDataAvailable")}
                tableClassName="rounded-b-md"
                headerClassName="[&_tr]:!brandBg [&_tr_th]:!text-white"
                rowClassName={(_, idx) =>
                  idx % 2 === 1 ? "primaryBackgroundBg" : ""
                }
              />
            </div>

            {/* Mobile Comparison Cards */}
            <div className="block md:hidden">
              <div className="">
                <div className="px-4 py-6 rounded-t-2xl brandBg text-white">{t("comparisonDetails")}</div>
                {tableRows.map((row, idx) => (
                  <div
                    key={idx}
                    className={`newBorderColor ${idx === tableRows.length - 1 ? "rounded-b-2xl" : ""} border-b border-x p-4 ${idx % 2 === 1 ? "primaryBackgroundBg" : "bg-white"
                      }`}
                  >
                    <h3 className="brandColor mb-3 text-base font-semibold pb-2 border-b newBorderColor">
                      {typeof row.label === "string" ? row.label : ""}
                    </h3>
                    <div className="space-y-3">
                      <div className="flex flex-col gap-2">
                        <div className="flex justify-between items-center gap-2 border-b pb-2">
                          <span className="brandColor py-2 text-base text-nowrap font-bold text-white">
                            {t("propertyA")}
                          </span>
                          <div className="text-sm text-start">
                            {typeof row.propertyA === "string" ? row.propertyA : row.propertyA}
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col gap-2">
                        <div className={`flex justify-between items-center gap-2 ${idx < tableRows.length - 1 ? "border-b" : ""} pb-2`}>
                          <span className="brandColor py-2 text-base font-bold text-white">
                            {t("propertyB")}
                          </span>
                          <div className="text-sm break-all text-start">
                            {typeof row.propertyB === "string" ? row.propertyB : row.propertyB}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default CompareProperty;
