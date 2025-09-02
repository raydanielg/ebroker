import React, { useEffect, useState } from 'react'
import { useTranslation } from '../context/TranslationContext'
import NewBreadcrumb from '../breadcrumb/NewBreadCrumb'
import NewBreadcrumbSkeleton from '../skeletons/NewBreadcrumbSkeleton'
import { getUserPersonalizedFeedsApi } from '@/api/apiRoutes'
import VerticlePropertyCardSkeleton from '../skeletons/VerticlePropertyCardSkeleton'
import NoDataFound from '../no-data-found/NoDataFound'
import PropertyVerticalNewCard from '../cards/PropertyVerticalNewCard'
import { useSelector } from 'react-redux'

const LIMIT = 8; // Number of items per fetch

const UserPersonalizedFeeds = () => {
    const t = useTranslation()
    const [personalizedFeeds, setPersonalizedFeeds] = useState([])
    const [isLoading, setIsLoading] = useState(true);
    const [offset, setOffset] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [error, setError] = useState(null);
    const language = useSelector((state) => state.LanguageSettings?.active_language);

    const fetchPersonalizedFeeds = async (isLoadMore = false) => {
        try {
            // Loading state handling
            if (isLoadMore) {
                setLoadingMore(true);
            } else {
                setIsLoading(true);
                setError(null);
            }

            const res = await getUserPersonalizedFeedsApi({
                limit: LIMIT,
                offset: isLoadMore ? offset : 0,
            });

            if (!res.error) {
                const newData = res.data || [];

                if (isLoadMore) {
                    setPersonalizedFeeds((prev) => [...prev, ...newData]);
                    setOffset((prev) => prev + newData.length);
                } else {
                    setPersonalizedFeeds(newData);
                    setOffset(newData.length);
                }

                // Determine if more data exists
                setHasMore((res?.total || 0) >= (isLoadMore ? offset + newData.length : newData.length));
            } else {
                setError(res.message);
            }
        } catch (err) {
            console.error('Error fetching personalized feeds:', err);
            setError(err);
        } finally {
            setIsLoading(false);
            setLoadingMore(false);
        }
    };

    // Initial fetch
    useEffect(() => {
        fetchPersonalizedFeeds();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [language]);

    return (
        <main className=''>
            {isLoading ? (
                <NewBreadcrumbSkeleton />
            ) : (
                <NewBreadcrumb title={t("allPersonalizedFeeds")} items={[{ label: t("allPersonalizedFeeds"), href: `/all-personalized-feeds` }]} />
            )}

            <div className='container mx-auto my-5 px-2'>
                {isLoading ? (
                    // Loading State
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                        {Array.from({ length: LIMIT }).map((_, idx) => (
                            <VerticlePropertyCardSkeleton key={idx} />
                        ))}
                    </div>
                ) : error ? (
                    // Error State
                    <NoDataFound title={t('errorOccurred')} description={t('pleaseTryAgainLater')} />
                ) : personalizedFeeds.length === 0 ? (
                    // No Data State
                    <NoDataFound title={t('noDataFound')} description={t('noDataFoundMessage')} />
                ) : (
                    // Data Loaded
                    <>
                        <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 mb-4'>
                            {personalizedFeeds.map((property) => (
                                <PropertyVerticalNewCard key={property.id} property={property} />
                            ))}
                        </div>
                        {!hasMore && (
                            <div className='flex justify-center mb-10'>
                                <button
                                    onClick={() => fetchPersonalizedFeeds(true)}
                                    disabled={loadingMore}
                                    className={`border brandBorder brandTextColor px-6 py-2 rounded-md transition-all hover:primaryTextColor hover:brandBg hover:brandBorder ${loadingMore ? 'opacity-50 cursor-not-allowed' : 'hover:opacity-90'}`}
                                >
                                    {loadingMore ? t('loading') : t('loadMore')}
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>
        </main>
    )
}

export default UserPersonalizedFeeds