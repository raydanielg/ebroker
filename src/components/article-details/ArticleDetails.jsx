"use client";
import { useTranslation } from "../context/TranslationContext";
import ArticleCategoryFilter from "../article-filter/ArticleCategoryFilter";
import ImageWithPlaceholder from "../image-with-placeholder/ImageWithPlaceholder";
import { useRouter } from "next/router";
import { getArticlesApi } from "@/api/apiRoutes";
import { useEffect, useState } from "react";
import RichTextContent from "../reusable-components/RichTextContent";
import { toast } from "react-hot-toast";
import { useSelector, useDispatch } from "react-redux";
import { setArticleCategoryId } from "@/redux/slices/cacheSlice";
import NewBreadcrumb from "../breadcrumb/NewBreadCrumb";
import {
  Carousel,
  CarouselContent,
  CarouselDots,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../ui/carousel";
import ArticleHorizontalCard from "../cards/ArticleHorizontalCard";
import ShareDialog from "../reusable-components/ShareDialog";
import { FaRegCalendarAlt, FaRegEye } from "react-icons/fa";
import { LuShare2 } from "react-icons/lu";
import { getFormattedDate, isRTL, timeAgo } from "@/utils/helperFunction";
import { useIsMobile } from "@/hooks/use-mobile";
import MobileBottomSheet from "../mobile-bottom-sheet/MobileBottomSheet";

const ArticleDetails = () => {
  const t = useTranslation();
  const router = useRouter();
  const { slug, locale } = router?.query;
  const dispatch = useDispatch();
  const settings = useSelector((state) => {
    if (!state || !state.WebSetting) {
      return null;
    }
    return state.WebSetting;
  });

  const [article, setArticle] = useState(null);
  const [similarArticles, setSimilarArticles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [categoryId, setCategoryId] = useState(null);
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);
  const [totalArticles, setTotalArticles] = useState(0);
  const CompanyName = settings?.data?.company_name;
  const currentUrl = `${process.env.NEXT_PUBLIC_WEB_URL}${router?.asPath}?share=true`;
  const isMobile = useIsMobile();
  const isShare = router?.query?.share === "true";
  const [api, setApi] = useState(null);
  const language = useSelector((state) => state.LanguageSettings?.active_language);
  const fetchArticle = async () => {
    setLoading(true);
    try {
      const response = await getArticlesApi({ slug_id: slug });
      if (response?.data) {
        setArticle(response?.data[0]);
        setSimilarArticles(response?.similar_articles);
        setTotalArticles(response?.data?.length + 1);
        setLoading(false);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(currentUrl);
    toast.success(t("linkCopied"));
  };

  useEffect(() => {
    fetchArticle();
  }, [slug]);

  const handleCategorySelect = (categoryId) => {
    setCategoryId(categoryId);
    dispatch(setArticleCategoryId({ data: categoryId }));
    router.push(`/${locale}/all/articles`);
  };

  return (
    <div>
      <NewBreadcrumb
        title={t("articleDetails")}
        items={[
          { href: "/all/articles", label: t("articles") },
          {
            href: `/article-details/${slug}`,
            label: article?.translated_title || article?.title || t("articleDetails"),
          },
        ]}
      />
      <div className="container mx-auto px-4 my-10">
        <div className="mb-4 text-xl xl:text-4xl font-bold">{article?.translated_title || article?.title}</div>
        <div className="primaryBackgroundBg mb-4 flex flex-col justify-between gap-3 rounded-2xl p-2 sm:flex-row md:gap-4 md:p-4">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-4">
              <ImageWithPlaceholder
                src={settings?.data?.admin_image}
                alt={article?.author_name || "Admin"}
                className="h-10 w-10 rounded-full"
              />
              <span className="leadColor text-base font-medium">
                {t("by")} {settings?.data?.admin_name}
              </span>
            </div>
            {article?.created_at && <div className="h-6 border-r-2" />}
            <div className="leadColor flex items-center gap-2">
              <FaRegCalendarAlt />
              <span className="text-xs sm:text-base">
                {getFormattedDate(article?.created_at, t)}
              </span>
            </div>
            {article?.view_count && <div className="h-6 border-r-2" />}
            <div className="leadColor flex items-center gap-2">
              <FaRegEye />
              <span className="text-xs sm:text-base">
                {article?.view_count}
              </span>
            </div>
          </div>
          <div
            className="group flex items-center gap-2 hover:cursor-pointer"
            onClick={() => setIsShareDialogOpen(true)}
          >
            <div className="group-hover:primaryBorderColor flex h-10 w-10 items-center justify-center rounded-lg bg-white group-hover:border">
              <LuShare2 className="group-hover:primaryColor" />
            </div>
            <span className="group-hover:primaryColor">{t("share")}</span>
          </div>
        </div>
        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-12 md:col-span-8 lg:col-span-9">
            <div className="flex items-center gap-2">
              <ImageWithPlaceholder
                src={article?.image}
                alt={article?.title}
                className="h-fit max-h-[635px] w-full rounded-lg object-cover md:rounded-2xl"
              />
            </div>
            <div className="mt-4 rounded-xl p-5">
              <div className="px-4">
                <RichTextContent content={article?.translated_description || article?.description} />
              </div>
            </div>
          </div>
          <div className="col-span-12 md:col-span-4 lg:col-span-3">
            <ArticleCategoryFilter
              articles={[...similarArticles, article]}
              onCategorySelect={handleCategorySelect}
              selectedCategory={categoryId}
            />
          </div>
        </div>
      </div>
      {/* <div className="primaryBackgroundBg mx-auto py-5">
        <div className="container">
          <div className="mb-4 text-3xl font-semibold">
            {t("similar")}{" "}
            <span className="brandColor">{t("articles")}</span>
          </div>
          <div className="grid grid-cols-3">
            {similarArticles?.map((item, index) => (
              <ArticleCard key={index} item={item} />
            ))}
          </div>
        </div>
      </div> */}
      <div className="primaryBackgroundBg mx-auto p-4 sm:p-2">
        <div className="container">
          <div className="my-4 text-3xl font-semibold">
            {t("similar")} <span className="brandColor">{t("articles")}</span>
          </div>
          <Carousel
            opts={{
              align: "start",
              dragFree: true,
              slidesPerView: 1,
              direction: isRTL() ? "rtl" : "ltr",
            }}
            setApi={setApi}
            className="w-full"
          >
            <CarouselContent className="-ml-2 md:-ml-4">
              {similarArticles.map((data) => {
                return (
                  <CarouselItem key={data.id} className="pl-2 md:pl-4 md:basis-1/2 lg:basis-1/2">
                    <div className="h-fit">
                      <ArticleHorizontalCard data={data} />
                    </div>
                  </CarouselItem>
                );
              })}
            </CarouselContent>

            <div className="mt-6 flex justify-center gap-6">
              <CarouselPrevious className="relative left-0 right-0 h-10 w-10 translate-y-0 border-none bg-white !shadow-none hover:bg-gray-100 hover:text-gray-900" />
              <CarouselDots />
              <CarouselNext className="relative left-0 right-0 h-10 w-10 translate-y-0 border-none bg-white !shadow-none hover:bg-gray-100 hover:text-gray-900" />
            </div>
          </Carousel>
        </div>
      </div>

      {/* Share Dialog */}
      <ShareDialog
        open={isShareDialogOpen}
        onOpenChange={setIsShareDialogOpen}
        title={t("shareArticle")}
        subtitle={t("shareArticleSubtitle")}
        pageUrl={currentUrl}
      />
      {isMobile && isShare && <MobileBottomSheet isShare={true} />}
    </div>
  );
};

export default ArticleDetails;
