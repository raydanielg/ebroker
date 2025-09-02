import ImageWithPlaceholder from "../image-with-placeholder/ImageWithPlaceholder";
import { FaArrowRight } from "react-icons/fa";
import { useSelector } from "react-redux";
import { timeAgo } from "@/utils/helperFunction";
import { useTranslation } from "../context/TranslationContext";
import CustomLink from "../context/CustomLink";

const ArticleCard = ({ item }) => {
  const t = useTranslation();
  const setting = useSelector((state) => {
    if (!state || !state.WebSetting) {
      return null;
    }
    return state.WebSetting;
  });

  return (
    <article
      className="cardBg max-w-sm overflow-hidden rounded-xl border"
      aria-label="Article card"
    >
      {/* Image Section */}
      <figure className="relative aspect-video p-4">
        <ImageWithPlaceholder
          src={item?.image}
          alt={item?.title}
          className="h-full w-full rounded-xl object-cover"
          loading="lazy"
        />
        <figcaption className="primaryBg primaryTextColor absolute left-6 top-6 rounded-md px-3 py-1 text-sm font-semibold">
          {item?.category?.category ? item?.category?.translated_name || item?.category?.category : t("general")}
        </figcaption>
      </figure>
      {/* Content Section */}
      <header className="px-4">
        <h1 className="text-base font-bold">{item?.translated_title || item?.title}</h1>
        <div
          className="secondryTextColor mt-4 overflow-hidden text-ellipsis text-sm leading-6 line-clamp-1"
          dangerouslySetInnerHTML={{ __html: item?.translated_description || item?.description }}
          itemProp="description"
        />
        <CustomLink
          href={`/article-details/${item?.slug_id}`}
          className="my-4 flex items-center gap-2 font-semibold hover:underline"
        >
          <span>{t("readMore")}</span>
          <FaArrowRight />
        </CustomLink>
      </header>

      <hr className="border-t" />

      {/* Author Section */}
      <footer className="flex items-center space-x-4 p-4">
        <ImageWithPlaceholder
          src={setting?.data?.admin_image}
          alt="Admin's profile picture"
          className="h-10 w-10 rounded-full"
          loading="lazy"
          imageClassName="border-2 border-gray-200"
        />
        <div>
          <p className="text-base font-semibold text-gray-900">
            {t("by")} {setting?.data?.admin_name}
          </p>
          <time className="secondryTextColor text-sm" dateTime={item?.created_at}>
            {timeAgo(item?.created_at)}
          </time>
        </div>
      </footer>
    </article>
  );
};

export default ArticleCard;
