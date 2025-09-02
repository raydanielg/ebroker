"use client"
import { useState, useEffect } from "react";
import { useTranslation } from "../context/TranslationContext";
import FaqItem from "./FaqItem";
import * as api from "@/api/apiRoutes";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import NewBreadcrumb from "../breadcrumb/NewBreadCrumb";
import { useSelector } from "react-redux";
import { Accordion } from "../ui/accordion";
import NoDataFound from "../no-data-found/NoDataFound";

const FAQsListing = () => {
  const t = useTranslation();
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const limit = 5;
  const language = useSelector((state) => state.LanguageSettings?.current_languages);
  const fetchFaqs = async (currentOffset = 0, isLoadingMore = false) => {
    try {
      if (isLoadingMore) {
        setLoadingMore(true);
      } else {
        setLoading(true);
      }

      // Assuming the API supports limit and offset parameters
      const response = await api.getFaqsApi({ limit, offset: currentOffset });
      if (response && response.data) {
        if (isLoadingMore) {
          // Append new FAQs to existing ones
          setFaqs(prevFaqs => [...prevFaqs, ...response.data]);
        } else {
          // Replace FAQs with new data
          setFaqs(response.data);
        }

        // Check if there are more FAQs to load
        const total = faqs.length + response.data.length;
        setHasMore(total < response.total);
      } else {
        if (!isLoadingMore) {
          setFaqs([]);
          setHasMore(false);
        }
      }
    } catch (error) {
      console.error("Error fetching FAQs:", error);
      if (!isLoadingMore) {
        setFaqs([]);
        setHasMore(false);
      }
    } finally {
      if (isLoadingMore) {
        setLoadingMore(false);
      } else {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    // Initial load of FAQs
    fetchFaqs();
  }, [language]);

  const handleLoadMore = () => {
    const newOffset = offset + limit;
    setOffset(newOffset);
    fetchFaqs(newOffset, true);
  };

  const renderSkeletonLoaders = () => {
    return Array(5).fill(0).map((_, index) => (
      <div key={index} className="w-full border rounded-lg mb-4">
        <div className="flex justify-between items-center p-4">
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-6 w-6 rounded-full" />
        </div>
      </div>
    ));
  };

  return (
    <div>
      <NewBreadcrumb title={t("FAQs")} items={[{ href: "/faqs", label: t("faqs") }]} />

      <section className="py-8 sm:py-10 md:py-12 px-4 md:px-0">
        <div className="container mx-auto">
          <div className="text-center mx-auto mb-8 sm:mb-10 md:mb-12">
            <h1 className="text-2xl md:text-3xl font-bold mb-3 md:mb-5 leading-tight">{t("faqTitle")}</h1>
            <p className="text-sm sm:text-base leadColor max-w-5xl mx-auto">{t("faqDescription")}</p>
          </div>

          <div className="mx-auto">
            {loading ? (
              renderSkeletonLoaders()
            ) : (
              <>
                {faqs.length > 0 ? (
                  <Accordion type="single" collapsible className="w-full flex flex-col gap-4">
                    {faqs.map((faq) => (
                      <div key={faq.id}>
                        <FaqItem faq={faq} />
                      </div>
                    ))}
                  </Accordion>
                ) : (
                  <div className="text-center py-8">
                    <NoDataFound />
                  </div>
                )}

                {hasMore && (
                  <div className="text-center mt-4 sm:mt-6 md:mt-8">
                    <Button
                      onClick={handleLoadMore}
                      disabled={loadingMore}
                      className="bg-white brandColor border brandBorder text-sm sm:text-base font-medium px-4 py-2 rounded-lg transition-colors duration-300 hover:brandBg hover:text-white hover:border-none w-full sm:w-fit"
                    >
                      {loadingMore ? (
                        <span className="flex items-center">
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          {t("loading")}
                        </span>
                      ) : (
                        <span className="flex items-center">
                          {`${t("loadMore")} ${t("faqs")}`}
                        </span>
                      )}
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default FAQsListing;
