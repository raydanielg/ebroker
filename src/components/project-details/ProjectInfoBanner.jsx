import { useTranslation } from "../context/TranslationContext";
import ImageWithPlaceholder from "../image-with-placeholder/ImageWithPlaceholder";
import premiumIcon from "@/assets/premium.svg";
import { capitalizeFirstLetter } from "@/utils/helperFunction";
import { ReactSVG } from "react-svg";

const ProjectInfoBanner = ({ projectDetails }) => {
  const t = useTranslation();

  if (!projectDetails) return null;

  const getProjectTypeLabel = (type) => {
    switch (type) {
      case "upcoming":
        return t("upcoming");
      case "under_construction":
        return t("underConstruction");
      default:
        return type;
    }
  };

  return (
    <div className="brandBg relative mb-4 overflow-hidden rounded-2xl text-white md:mb-7">
      {/* <div className="absolute inset-0 bg-black/20"></div> */}
      <div className="relative flex min-h-[180px] flex-col justify-between p-6">
        {/* Top Section */}
        <div className="flex items-start justify-between">
          {/* Category Badge */}
          {projectDetails.category && (
            <div className="flex items-center gap-2 rounded-lg bg-white px-3 py-1">
              {projectDetails.category?.image && (
                <div className="h-4 w-4 flex-shrink-0">
                  <ReactSVG
                    src={projectDetails.category.image}
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
                    className="h-full w-full object-contain"
                    alt={projectDetails.category.translated_name || projectDetails.category.name || 'category icon'}
                  />
                </div>
              )}
              <span className="leadColor text-xs font-bold md:text-base">
                {projectDetails.category?.translated_name || projectDetails.category?.category}
              </span>
            </div>
          )}

          {/* Project Type Badge */}
          {projectDetails.type && (
            <div
              className={`primaryBg primaryTextColor rounded-lg px-3 py-1 text-xs font-bold md:text-base`}
            >
              {getProjectTypeLabel(projectDetails.type)}
            </div>
          )}
        </div>

        {/* Bottom Section */}
        <div className="flex items-end justify-between">
          {/* Left - Project Info */}
          <div className="flex flex-col gap-2">
            {/* Project Title */}
            <h1 className="text-lg font-bold text-white md:text-xl">
              {capitalizeFirstLetter(projectDetails?.translated_title || projectDetails?.title)}
              {/* {t("in")}
              {projectDetails?.category?.category} */}
            </h1>

            {/* Location */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-white/60 md:text-sm">
                {[
                  projectDetails.location || projectDetails.address,
                  projectDetails.city,
                  projectDetails.state,
                  projectDetails.country,
                ]
                  .filter(Boolean)
                  .join(", ")}
              </span>
            </div>
          </div>

          {/* Right - Premium Badge */}
          {(projectDetails.is_premium || projectDetails.is_promoted) && (
            <div className="premiumBgColor brandColor flex items-center gap-1 rounded-full px-3 py-2 text-xs font-medium md:text-sm">
              <ImageWithPlaceholder
                src={premiumIcon}
                alt={"Premium Icon"}
                className="h-5 w-5"
              />
              <span>{t("premium")}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectInfoBanner;
