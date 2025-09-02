"use client";
import React, { useState, useEffect } from "react";
import { useTranslation } from "@/components/context/TranslationContext";
import { getCategoriesApi, getArticlesApi } from "@/api/apiRoutes";
import { Skeleton } from "../ui/skeleton";

const ArticleCategoryFilter = ({
  articles,
  onCategorySelect,
  selectedCategory,
}) => {
  // Translation hook for localization
  const t = useTranslation();

  // State to store categories and loading state
  const [categories, setCategories] = useState([]);
  const [allArticles, setAllArticles] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch categories and all articles on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);

        // Fetch categories and all articles in parallel
        const [categoriesResponse, articlesResponse] = await Promise.all([
          getCategoriesApi({
            limit: "",
            offset: "",
            has_property: false,
            passHasProperty: false,
          }),
          getArticlesApi({
            limit: "",
            offset: "",
          })
        ]);

        // Set the categories data from API response
        if (categoriesResponse?.error === false && categoriesResponse?.data) {
          setCategories(categoriesResponse.data);
        }

        // Set all articles for counting purposes
        if (articlesResponse?.error === false && articlesResponse?.data) {
          setAllArticles(articlesResponse.data);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setCategories([]);
        setAllArticles([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const getArticleCountByCategory = (categoryId) => {
    if (!allArticles || !Array.isArray(allArticles)) return 0;
    return allArticles.filter((article) => article?.category_id == categoryId)
      .length;
  };
  const CategorySkeletons = Array.from({ length: 8 })?.map((_, idx) => idx);
  // Show loading state while fetching categories
  if (isLoading) {
    return (
      <div className="primaryBackgroundBg rounded-lg p-4 md:rounded-2xl">
        <h2 className="mb-6 text-xl font-bold">
          {t("categories")}
        </h2>
        <div className="text-center flex flex-col items-center gap-3 py-4">
          {CategorySkeletons.map((_, idx) => (
            <div
              key={idx}
              className={`w-full flex items-center justify-between rounded-lg bg-white px-6 py-4 text-left shadow-sm transition-colors min-h-16`}
            >
              <Skeleton className="text-base min-h-6 min-w-16" />
              <Skeleton className="min-w-6 min-h-6" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="primaryBackgroundBg rounded-lg p-4 md:rounded-2xl">
      <h2 className="mb-6 text-xl font-bold">
        {t("categories") || "Categories"}
      </h2>

      <div className="grid grid-cols-1 gap-4">
        <button
          key={"general"}
          onClick={() => onCategorySelect("")}
          className={`w-full rounded-lg bg-white px-5  py-4 text-left shadow-sm transition-colors ${selectedCategory?.toString() === "" ? "ring-2 ring-[var(--primary-color)]" : ""}`}
          aria-label={`Filter by all categories`}
          tabIndex="0"
          onKeyDown={(e) => e.key === "Enter" && onCategorySelect("")}
        >
          <div className="flex flex-wrap items-center justify-between">
            <span className="text-base text-gray-700">
              {String("").padStart(2, "0")}. {t("general")}
            </span>
            <span className="text-gray-500">({allArticles?.length || 0})</span>
          </div>
        </button>
        {categories &&
          categories.map((category, idx) => (
            <button
              key={category?.id}
              onClick={() => onCategorySelect(category?.id)}
              className={`w-full rounded-lg bg-white px-5  py-4 text-left shadow-sm transition-colors ${selectedCategory?.toString() === category?.id?.toString() ? "ring-2 ring-[var(--primary-color)]" : ""}`}
              aria-label={`Filter by ${category?.translated_name || category?.category}`}
              tabIndex="0"
              onKeyDown={(e) =>
                e.key === "Enter" && onCategorySelect(category?.id)
              }
            >
              <div className="flex flex-wrap items-center justify-between">
                <span className="text-base text-gray-700">
                  {String(idx + 1).padStart(2, "0")}. <span className="text-wrap">{category?.translated_name || category?.category}</span>
                </span>
                <span className="text-gray-500">
                  ({getArticleCountByCategory(category?.id)})
                </span>
              </div>
            </button>
          ))}
      </div>
    </div>
  );
};

export default ArticleCategoryFilter;
