import ImageWithPlaceholder from "@/components/image-with-placeholder/ImageWithPlaceholder";
import CustomLink from "../context/CustomLink";
import { MdOutlineArrowCircleRight } from "react-icons/md";
import { useSelector } from "react-redux";
import { useTranslation } from "../context/TranslationContext";
import { ReactSVG } from "react-svg";
import { getFormattedDate } from "@/utils/helperFunction";
/**
 * ArticleHorizontalCard Component
 *
 * A responsive horizontal card displaying article information with:
 * - Featured image on the left using ImageWithPlaceholder
 * - Article metadata (category, date)
 * - Article title and excerpt
 * - Read more button with icon
 * - Author information
 *
 * Features:
 * - Fully responsive design
 * - Accessible with proper ARIA labels
 * - Clean typography hierarchy
 * - Hover effects for better UX
 * - Next.js Link integration for optimal routing
 */
const ArticleHorizontalCard = ({ data }) => {
  const t = useTranslation();
  const webSettings = useSelector((state) => state.WebSetting?.data);
  const author = webSettings?.admin_name;
  const authorAvatar = webSettings?.admin_image;
  const categories = useSelector((state) => state.cacheData?.categories);

  return (
    <CustomLink href={`/article-details/${data?.slug_id}`} className="block">
      <article
        className="group flex cursor-pointer flex-col gap-4 overflow-hidden rounded-lg bg-transparent transition-all duration-300 md:flex-row"
        tabIndex="0"
        aria-label={`Read article: ${data?.translated_title || data?.title}`}
      >
        <div className="min-h-[300px] lg:grid lg:grid-cols-2 h-full w-full flex flex-col gap-3 bg-transparent lg:max-h-[300px] lg:flex-row">
          {/* Article Image */}
          <div className="relative w-full overflow-hidden">
            <ImageWithPlaceholder
              src={data?.image}
              alt={data?.title}
              className="h-[205px] lg:h-full w-full object-fill md:aspect-auto rounded-2xl"
              loading="lazy"
            />
          </div>

          {/* Article Content */}
          <div className="flex max-h-[300px] w-full flex-col justify-between newBorder bg-white p-2 rounded-2xl md:p-4">
            {/* Article Header */}
            <div className="space-y-2 md:space-y-3">
              {/* Category and Date */}
              <div className="flex items-center gap-2 text-sm">
                <div className="primaryBackgroundBg flex items-center gap-2 rounded-lg p-2">
                  {/* Category icon */}
                  <ReactSVG
                    src={categories?.find((cat) => cat?.id == data?.category_id)
                      ?.image}
                    beforeInjection={(svg) => {
                      svg.querySelectorAll("path,text,tspan,circle").forEach((path) => {
                        path.setAttribute(
                          "style",
                          `fill: var(--facilities-icon-color)`,
                        );
                        path.classList.add("transition-all");
                        path.classList.add("duration-500");
                        path.classList.add("ease-in-out");
                      });
                      svg.setAttribute(
                        "style",
                        `height: 20px; width: 20px;`,
                      );
                    }}
                    className={`h-5 w-5`}
                    alt={`${data?.category?.category} icon`}
                  />
                  <span className="leadColor font-bold">
                    {data?.category?.category ? data?.category?.translated_name || data?.category?.category : t("general")}
                  </span>
                </div>
                <span className="leadColor">-</span>
                <span className="text-xs md:text-base text-nowrap leadColor">
                  {getFormattedDate(data?.created_at, t)}
                </span>
              </div>

              {/* Article Title */}
              <h2 className="brandColor line-clamp-1 truncate text-base font-bold md:text-xl">
                {data?.translated_title || data?.title}
              </h2>

              {/* Article Excerpt */}
              <p
                className="leadColor line-clamp-2 text-sm md:text-base"
                dangerouslySetInnerHTML={{ __html: data?.translated_description || data?.description }}
              />
            </div>

            {/* Article Footer */}
            <div className="mt-4 flex items-center justify-between pt-4 md:mt-6 gap-2">
              {/* Read More Button */}
              <div
                className="group-hover:primaryBg brandBg inline-flex items-center gap-2 rounded-lg p-2 lg:px-4 lg:py-3 text-sm font-medium text-white transition-colors duration-200 focus:outline-none"
                aria-label={`Read full article: ${data?.translated_title || data?.title}`}
              >
                <span className="text-xs md:text-sm lg:text-base">
                  {t("readFullArticle")}
                </span>
                <MdOutlineArrowCircleRight className="h-5 w-5 rtl:rotate-180 flex-shrink-0" />
              </div>

              {/* Author Info */}
              <div className="flex items-center gap-2">
                <ImageWithPlaceholder
                  src={authorAvatar}
                  alt={`${author}'s avatar`}
                  className="h-10 w-10 rounded-full"
                  loading="lazy"
                  imageClassName="border-2 border-gray-200"
                />
                <span className="text-sm text-gray-500">
                  {t("by")}{" "}
                  <span className="font-medium text-gray-700">{author}</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </article>
    </CustomLink>
  );
};

export default ArticleHorizontalCard;
