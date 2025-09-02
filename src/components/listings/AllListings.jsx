"use client";
import {
  getAllAgentsApi,
  getArticlesApi,
  getCategoriesApi,
} from "@/api/apiRoutes";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import ArticleCategoryFilter from "../article-filter/ArticleCategoryFilter";
import ArticleCategoryFilterSkeleton from "../skeletons/ArticleCategoryFilterSkeleton.jsx";
import ArticleHorizontalCardSkeleton from "../skeletons/ArticleHorizontalCardSkeleton";
import { useTranslation } from "../context/TranslationContext";
import { useSelector, useDispatch } from "react-redux";
import { setArticleCategoryId } from "@/redux/slices/cacheSlice";
import NewBreadcrumb from "../breadcrumb/NewBreadCrumb";
import AgentProfileCard from "../cards/AgentProfileCard";
import CategoryCard from "../cards/CategoryCard";
import ArticleHorizontalCard from "../cards/ArticleHorizontalCard";
import CustomLink from "../context/CustomLink";
import CategoryHorizontalCardSkeleton from "../skeletons/CategoryHorizontalCardSkeleton";
import AgentVerticleCardSkeleton from "../skeletons/AgentVerticleCardSkeleton";
import NoDataFound from "../no-data-found/NoDataFound";
import { useIsMobile } from "@/hooks/use-mobile";

const AllListings = () => {
  const t = useTranslation();
  const router = useRouter();
  const dispatch = useDispatch();
  const articleCatId = useSelector(
    (state) => state.cacheData?.articleCategoryId,
  );
  const language = useSelector(state => state?.LanguageSettings?.active_language);
  const { slug } = router?.query;
  const limit = 8;
  const isMobile = useIsMobile();
  const [offset, setOffset] = useState(0);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [categories, setCategories] = useState([]);
  const [agents, setAgents] = useState([]);
  const [articles, setArticles] = useState([]);
  const [categoryId, setCategoryId] = useState(
    articleCatId ? articleCatId : "",
  );
  const [itemCount, setItemCount] = useState(0);
  const [totalItems, setTotalItems] = useState(0);

  // Generic API fetcher utility function
  const fetchAPI = async ({
    apiFunction, // The API function to call
    params = {}, // Parameters to pass to the API function
    onSuccess, // Success callback function
    onError, // Error callback function
    onFinally, // Optional finally callback
  }) => {
    try {
      const response = await apiFunction(params);

      if (onSuccess && typeof onSuccess === "function") {
        onSuccess(response);
      }

      return response;
    } catch (error) {
      if (onError && typeof onError === "function") {
        onError(error);
      } else {
        console.error("API Error:", error);
      }

      throw error;
    } finally {
      if (onFinally && typeof onFinally === "function") {
        onFinally();
      }
    }
  };

  // Define mapping of slug to API functions and state setters
  const apiConfig = {
    categories: {
      apiFn: getCategoriesApi,
      length: categories.length,
      stateSetter: setCategories,
      params: (offset, limit, category_id) => ({
        limit: limit?.toString(),
        offset: offset?.toString(),
        // has_property: true,
        passHasProperty: false,
      }),
    },
    agents: {
      apiFn: getAllAgentsApi,
      length: agents.length,
      stateSetter: setAgents,
      params: (offset, limit) => ({
        limit: limit?.toString(),
        offset: offset?.toString(),
      }),
    },
    articles: {
      apiFn: getArticlesApi,
      length: articles.length,
      total: totalItems,
      stateSetter: setArticles,
      params: (offset, limit, category_id) => ({
        limit: limit?.toString(),
        offset: offset?.toString(),
        category_id: category_id?.toString(),
      }),
    },
  };

  useEffect(() => {
    if (slug) {
      // Reset states when slug changes
      setOffset(0);
      setCategories([]);
      setAgents([]);
      setHasMore(true);
      setInitialLoading(true);
      fetchData(0, true, categoryId);
    } else {
      // If no slug, fetch data anyway for initial page load
      setInitialLoading(true);
      fetchData(0, true, categoryId);
    }
  }, [slug, language]);

  const fetchData = async (
    currentOffset = offset,
    isFirstLoad = false,
    category_id = "",
  ) => {
    // Default to categories if no slug is provided
    const dataType = slug || "categories";

    // Get the config for this data type, or use categories as fallback
    const config = apiConfig[dataType] || apiConfig["categories"];

    if (isFirstLoad) {
      setInitialLoading(true);
    } else {
      setLoading(true);
    }

    await fetchAPI({
      apiFunction: config.apiFn,
      params: config.params(currentOffset, limit, category_id),
      onSuccess: (res) => {
        // If no data or empty array, there are no more items to load
        if (!res?.data || res?.data.length === 0 && currentOffset === 0) {
          setHasMore(false);
          config.stateSetter([]);
          if (dataType == "articles") {
            setItemCount(0);
            setTotalItems(0);
          }
          return;
        }

        // Use the appropriate state setter from config
        if (isFirstLoad) {
          config.stateSetter(res?.data);
          if (dataType == "articles") {
            setItemCount(res?.data?.length);
            setTotalItems(res?.data?.length);
          }
        } else {
          if (dataType == "agents") {
            config.stateSetter((prev) => {
              const newAgents = res?.data.filter(
                (newAgent) =>
                  !prev.some(
                    (existingAgent) => existingAgent.id === newAgent.id,
                  ),
              );
              return [...prev, ...newAgents];
            });
          } else {
            config.stateSetter((prev) => [...prev, ...res?.data]);
            if (dataType == "articles") {
              setItemCount((prev) => prev + res?.data?.length);
            }
          }
        }
        // Check if we received fewer items than the limit
        const totalItemsReceived = isFirstLoad
          ? res?.data.length
          : config.length + res?.data.length;
        const expectedTotalItems = currentOffset + limit;
        if (totalItemsReceived < expectedTotalItems) {
          setHasMore(false);
        } else {
          setHasMore(true);
        }
      },
      onError: (err) => {
        console.error(err);
        setHasMore(false);
      },
      onFinally: () => {
        setLoading(false);
        setInitialLoading(false);
      },
    });
  };

  const handleLoadMore = () => {
    if (loading || !hasMore) return;
    const newOffset = offset + limit;
    setOffset(newOffset);
    fetchData(newOffset, false);
  };

  const allListings = [
    { name: "All Categories", data: categories },
    { name: "All Agents", data: agents },
    { name: "All Articles", data: articles },
  ];

  // Render skeletons during loading states
  const renderSkeletons = () => {
    if (slug === "articles") {
      return (
        <div className="grid grid-cols-12 gap-4">
          <div className="cols-span-12 space-y-10 md:col-span-9">
            <div className="flex flex-col gap-4">
              {Array(limit)
                .fill(0)
                .map((_, index) => (
                  <ArticleHorizontalCardSkeleton
                    key={`article-horizontal-skeleton-${index}`}
                  />
                ))}
            </div>
          </div>
          <div className="col-span-12 md:col-span-3">
            <ArticleCategoryFilterSkeleton />
          </div>
        </div>
      );
    }
    if (slug === "agents") {
      return (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {Array(limit)
            .fill(0)
            .map((_, index) => (
              <AgentVerticleCardSkeleton key={`agent-skeleton-${index}`} />
            ))}
        </div>
      );
    }

    return (
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 md:grid-cols-4">
        {Array(limit)
          .fill(0)
          .map((_, index) => (
            <CategoryHorizontalCardSkeleton
              key={`category-skeleton-${index}`}
            />
          ))}
      </div>
    );
  };

  // Render only card skeletons for load more functionality
  const renderCardSkeletons = () => {
    if (slug === "articles") {
      return (
        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-12 lg:col-span-9">
            {Array(limit)
              .fill(0)
              .map((_, index) => (
                <ArticleHorizontalCardSkeleton
                  key={`article-horizontal-loadmore-skeleton-${index}`}
                />
              ))}
          </div>
        </div>
      );
    }
    if (slug === "agents") {
      return (
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {Array(limit)
            .fill(0)
            .map((_, index) => (
              <AgentVerticleCardSkeleton
                key={`agent-loadmore-skeleton-${index}`}
              />
            ))}
        </div>
      );
    }

    // Default case (categories)
    return (
      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4">
        {Array(limit)
          .fill(0)
          .map((_, index) => (
            <CategoryHorizontalCardSkeleton
              key={`category-loadmore-skeleton-${index}`}
            />
          ))}
      </div>
    );
  };

  const handleCategorySelect = (category_id) => {
    setCategoryId(category_id);
    dispatch(setArticleCategoryId({ data: category_id }));
    fetchData(0, true, category_id);
  };

  const breadCrumbItems = [
    // ...(slug === "articles" ? [{ href: "", label: t("pages") }] : []),
    { href: slug, label: t(slug) },
  ];

  return (
    <div>
      <NewBreadcrumb
        title={t(`all${slug?.charAt(0)?.toUpperCase() + slug?.slice(1)}`)}
        items={breadCrumbItems}
      />
      <section
        id="all-categories"
        className={`${slug === "articles" ? "" : "bg-white"}`}
      >
        <div className="container mx-auto px-4 py-10">
          {/* <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4'> */}
          {initialLoading
            ? renderSkeletons()
            : allListings.map((item, index) => {
              if (item.name === "All Categories" && slug === "categories") {
                return (
                  <>
                    {item?.data?.length === 0 && (
                      <div className="flex w-full flex-col items-center justify-center">
                        <NoDataFound />
                      </div>
                    )}
                    <div
                      className="grid grid-cols-2 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
                      key={`listing-${index}`}
                    >
                      {item?.data?.length > 0 && item?.data.map((data) => (
                        <CategoryCard
                          key={`category-${data?.id}`}
                          category={data}
                        />
                      ))}
                    </div>
                  </>
                );
              } else if (item.name === "All Agents" && slug === "agents") {
                return (
                  <>
                    {item?.data?.length === 0 &&
                      (
                        <div className="flex w-full flex-col items-center justify-center">
                          <NoDataFound />
                        </div>
                      )}
                    <div
                      className={`grid grid-cols-1 gap-4 ${isMobile ? "place-items-center" : ""} sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5`}
                      key={`listing-${index}`}
                    >
                      {item?.data?.map((data) => (
                        <AgentProfileCard agent={data} key={data?.id} />
                      ))}
                    </div>
                  </>
                );
              } else if (
                item.name === "All Articles" &&
                slug === "articles"
              ) {
                return (
                  <div
                    className="grid grid-cols-12 gap-4"
                    key={`listing-${index}`}
                  >
                    <div className={`col-span-12 space-y-10  ${item?.data?.length > 0 ? "md:col-span-8 lg:col-span-9" : ""} `}>
                      {item?.data?.length === 0 && (
                        <NoDataFound
                          title={t("noArticlesFound")}
                          description={t("noArticlesFoundMessage")}
                        />
                      )}
                      {item?.data?.length > 0 && item?.data?.map((data) => (
                        <ArticleHorizontalCard
                          data={data}
                          key={`article-${data?.id}`}
                        />
                      ))}
                    </div>
                    {item?.data?.length > 0 &&
                      <div className="col-span-12 md:col-span-4 lg:col-span-3">
                        <ArticleCategoryFilter
                          articles={item?.data}
                          onCategorySelect={handleCategorySelect}
                          selectedCategory={categoryId}
                        />
                      </div>}
                  </div>
                );
              } else {
                return null;
              }
            })}

          {!initialLoading && allListings.length === 0 && (
            <NoDataFound
            />
          )}

          {/* Show skeletons at the bottom when loading more */}
          {loading && renderCardSkeletons()}
        </div>
        {hasMore && !initialLoading && (
          <div className="flex items-center justify-center pb-10">
            <button
              className="brandColor brandBorder rounded-md hover:border-transparent border px-4 py-3 capitalize disabled:opacity-50 hover:primaryBg hover:text-white"
              onClick={handleLoadMore}
              disabled={loading}
            >
              {loading ? t("loading") : `${t("loadMore")} ${t(slug)}`}
            </button>
          </div>
        )}
      </section>
    </div>
  );
};

export default AllListings;
