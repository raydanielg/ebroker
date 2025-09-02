import ImageWithPlaceholder from "../image-with-placeholder/ImageWithPlaceholder";
import { FaArrowRight } from "react-icons/fa";
import { useSelector } from "react-redux";
import { timeAgo } from "@/utils/helperFunction";
import { useTranslation } from "../context/TranslationContext";
import CustomLink from "../context/CustomLink";

const ArticleCardListView = ({ item }) => {
    const t = useTranslation();
    const setting = useSelector((state) => {
        if (!state || !state.WebSetting) {
            return null;
        }
        return state.WebSetting;
    });

    return (
        <article
            className="cardBg overflow-hidden rounded-xl border w-full grid grid-cols-1 md:grid-cols-12 gap-4"
            aria-label="Article card in list view"
            itemScope
            itemType="https://schema.org/BlogPosting"
        >
            {/* Image Section */}
            <figure className="relative md:col-span-4 p-3">
                <ImageWithPlaceholder
                    src={item?.image}
                    alt={item?.title}
                    className="aspect-video h-full w-full rounded-xl object-cover"
                    loading="lazy"
                    itemProp="image"
                />
                <figcaption className="primaryBg primaryTextColor absolute left-6 top-6 rounded-md px-3 py-1 text-sm font-semibold">
                    {item?.category?.category ? item?.category?.translated_name || item?.category?.category : t("general")}
                </figcaption>
            </figure>

            {/* Content Section */}
            <div className="md:col-span-8 p-4 flex flex-col justify-between">
                <div>
                    <header>
                        <h1 className="text-xl font-bold" itemProp="headline">{item?.translated_title || item?.title}</h1>
                        <div
                            className="secondryTextColor mt-4 overflow-hidden text-ellipsis text-sm leading-6 line-clamp-2"
                            dangerouslySetInnerHTML={{ __html: item?.translated_description || item?.description }}
                            itemProp="description"
                        />
                    </header>

                    <div className="my-4">
                        <CustomLink
                            href={`/article-details/${item?.slug_id}`}
                            className="flex items-center gap-2 font-semibold hover:underline w-fit"
                            aria-label={`Read more about ${item?.title}`}
                        >
                            <span>{t("readMore")}</span>
                            <FaArrowRight aria-hidden="true" className="rtl:rotate-180" />
                        </CustomLink>
                    </div>
                </div>

                {/* Author Section */}
                <footer className="flex items-center space-x-4 border-t pt-4">
                    <ImageWithPlaceholder
                        src={setting?.data?.admin_image}
                        alt={`${setting?.data?.admin_name}'s profile picture`}
                        className="h-12 w-12 rounded-full"
                        loading="lazy"
                    />
                    <div>
                        <p className="text-base font-semibold text-gray-900" itemProp="author">
                            {t("by")} {setting?.data?.admin_name}
                        </p>
                        <time
                            className="secondryTextColor text-sm"
                            dateTime={item?.created_at}
                            itemProp="datePublished"
                        >
                            {timeAgo(item?.created_at)}
                        </time>
                    </div>
                </footer>
            </div >
        </article >
    );
};

export default ArticleCardListView; 