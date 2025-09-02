import { getFormattedDate } from '@/utils/helperFunction';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
import { useTranslation } from '../context/TranslationContext';
import ImageWithPlaceholder from '../image-with-placeholder/ImageWithPlaceholder';
import CustomLink from '../context/CustomLink';
import { ReactSVG } from 'react-svg';

const ArticlesSection = ({ data }) => {
    const router = useRouter();
    const { locale } = router?.query;
    const t = useTranslation();
    const webSettings = useSelector((state) => state.WebSetting?.data);
    // Early return if no data
    if (!data || data.length === 0) return null;

    // Featured (large) card
    const featured = data[0];
    // Two smaller cards
    const smallCards = data.slice(1, 3);

    return (
        // Main fragment
        <div className="grid grid-cols-12 gap-4">
            {/* Left: Featured Article */}
            <CustomLink
                href={`/article-details/${featured?.slug_id}`}
                tabIndex={0}
                aria-label={featured?.translated_title || featured?.title}
                className="relative col-span-12 md:col-span-6 rounded-2xl overflow-hidden flex flex-col justify-end shadow-lg cursor-pointer min-h-[424px] md:h-full"
            // onClick={() => router.push(`/${locale}/article-details/${featured?.slug_id}`)}
            >
                {/* Article Image */}
                <ImageWithPlaceholder
                    src={featured?.image}
                    alt={featured?.translated_title || featured?.title}
                    className="absolute rounded-2xl top-0 left-0 w-full h-full object-cover z-0"
                />
                <div className="z-3 absolute bottom-0 left-0 h-full w-full bg-gradient-to-b from-transparent via-black/30 to-black"></div>
                {/* Content */}
                <div className="absolute w-full z-20 p-4 md:p-6 flex flex-col gap-2">
                    {/* Category Badge */}
                    <span className="flex justify-center items-center gap-2 leadColor primaryBackgroundBg font-medium px-3 py-1 rounded shadow w-fit leadColor" aria-label={featured?.category?.category}>
                        {/* <ImageWithPlaceholder
                                src={featured?.category?.image}
                                alt={featured?.category?.category}
                                className="w-5 h-5 rounded-full object-cover"
                            /> */}
                        <ReactSVG
                            src={featured?.category?.image}
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
                            className="w-5 h-5 rounded-full object-cover"
                            alt={featured?.category?.translated_name || featured?.category?.name || 'category icon'}
                        />
                        {featured?.category?.translated_name || featured?.category?.category}
                    </span>
                    {/* Title */}
                    <h2 className="text-lg md:text-xl font-bold text-white line-clamp-2">
                        {featured?.translated_title || featured?.title}
                    </h2>
                    {/* Meta */}
                    <div className="flex items-center gap-2">
                        {webSettings?.admin_image && (
                            <ImageWithPlaceholder
                                src={webSettings.admin_image}
                                alt={webSettings.admin_name}
                                className="w-8 h-8 rounded-full object-cover"
                                imageClassName="cardBorder"
                            />
                        )}
                        <span className="text-sm font-medium text-white">{t("by")} {webSettings?.admin_name} - {getFormattedDate(featured.created_at, t)}</span>
                    </div>
                </div>
            </CustomLink>

            {/* Right: Two Small Articles */}
            <div className="col-span-12 md:col-span-6 flex flex-col gap-4">
                {smallCards.map((article, idx) => (
                    <CustomLink
                        href={`/article-details/${article?.slug_id}`}
                        key={article?.id || idx}
                        tabIndex={0}
                        aria-label={article?.translated_title || article?.title}
                        className="relative flex flex-col md:flex-row md:gap-6 cursor-pointer bg-white"
                    // onClick={() => router.push(`/${locale}/article-details/${article?.slug_id}`)}
                    >
                        {/* Article Image */}
                        <ImageWithPlaceholder
                            src={article?.image}
                            alt={article?.translated_title || article?.title}
                            className="w-full md:w-min min-w-[200px] min-h-[200px] rounded-2xl object-cover"
                        />
                        {/* Content */}
                        <div className="mt-6 md:mt-0 flex-1 flex flex-col justify-center gap-4" >
                            {/* Category Badge */}
                            <span className="flex items-center gap-2 primaryBackgroundBg leadColor text-sm font-bold p-2 rounded-lg w-fit" aria-label={article?.category?.category}>
                                {/* <ImageWithPlaceholder
                                    src={article?.category?.image}
                                    alt={article?.category?.translated_name || article?.category?.category}
                                    className="w-5 h-5 rounded-full object-cover"
                                /> */}
                                <ReactSVG
                                    src={article?.category?.image}
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
                                    className="w-5 h-5 rounded-full object-cover"
                                    alt={article?.category?.translated_name || article?.category?.name || 'category icon'}
                                />
                                {article?.category?.translated_name || article?.category?.category}
                            </span>
                            {/* Title */}
                            <h3 className="text-sm md:text-base font-bold brandColor line-clamp-2 px-1">
                                {article?.translated_title || article?.title}
                            </h3>
                            {/* Meta */}
                            <div className="flex items-center gap-2">
                                {webSettings?.admin_image && (
                                    <ImageWithPlaceholder
                                        src={webSettings.admin_image}
                                        alt={webSettings.admin_name}
                                        className="w-8 h-8 rounded-full object-cover"
                                        imageClassName="cardBorder"
                                    />
                                )}
                                <span className="text-sm font-medium leadColor">{t("by")} {webSettings?.admin_name} - {getFormattedDate(article.created_at, t)}</span>
                            </div>
                        </div>
                    </CustomLink>
                ))}
            </div>
        </div>
    );
};

export default ArticlesSection;