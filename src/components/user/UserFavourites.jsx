"use client"
import { useEffect, useState } from 'react';
import { useTranslation } from '../context/TranslationContext';
import { getFavouritePropertyApi } from '@/api/apiRoutes';
import PropertyVerticalNewCard from '../cards/PropertyVerticalNewCard';
import NoDataFound from '../no-data-found/NoDataFound';
import VerticlePropertyCardSkeleton from '../skeletons/VerticlePropertyCardSkeleton';
import { useSelector } from 'react-redux';

const UserFavourites = () => {
    const t = useTranslation();
    const LIMIT = 8; // Number of items per page

    const [favouriteProperty, setFavouriteProperty] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [offset, setOffset] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [error, setError] = useState(null);
    const [totalCount, setTotalCount] = useState(0);

    const language = useSelector((state) => state.LanguageSettings?.active_language);


    const fetchFavouriteProperty = async (isLoadMore = false) => {
        try {
            setLoadingMore(isLoadMore);
            if (!isLoadMore) {
                setIsLoading(true);
                setError(null);
            }

            const res = await getFavouritePropertyApi({
                limit: LIMIT,
                offset: isLoadMore ? offset : 0
            });

            if (!res.error) {
                const newData = res.data || [];
                setTotalCount(res.total || 0);

                if (isLoadMore) {
                    setFavouriteProperty(prev => [...prev, ...newData]);
                    setOffset(prev => prev + newData.length);
                } else {
                    setFavouriteProperty(newData);
                    setOffset(newData.length);
                }

                // Only show load more if total is greater than LIMIT
                setHasMore((res.total || 0) > LIMIT);
            } else {
                setError(res.message);
            }
        } catch (error) {
            console.error("Error fetching favorites:", error);
            setError(error);
        } finally {
            setIsLoading(false);
            setLoadingMore(false);
        }
    }

    // Handle removing a property from favorites
    const handleRemoveProperty = async (propertyId) => {
        // Remove the property from current list
        setFavouriteProperty(prev => prev.filter(property => property.id !== propertyId));

        // Update total count
        const newTotalCount = totalCount - 1;
        setTotalCount(newTotalCount);

        // Only show load more if total is greater than LIMIT
        setHasMore(newTotalCount > LIMIT);

        // If we removed an item and have more items available, fetch next item
        if (newTotalCount > favouriteProperty.length - 1) {
            try {
                const res = await getFavouritePropertyApi({
                    limit: 1,
                    offset: favouriteProperty.length - 1 // -1 because we just removed one
                });

                if (!res.error && res.data && res.data.length > 0) {
                    setFavouriteProperty(prev => [...prev, ...res.data]);
                }
            } catch (error) {
                console.error("Error fetching replacement property:", error);
            }
        }
    }

    useEffect(() => {
        fetchFavouriteProperty();
    }, [language]);

    // Loading skeleton
    if (isLoading) {
        return (
            <div className="space-y-4">
                <h1 className="text-2xl font-semibold">{t("myFavourites")}</h1>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {Array.from({ length: LIMIT }).map((_, i) => (
                        <VerticlePropertyCardSkeleton key={i} />
                    ))}
                </div>
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <div className="space-y-4">
                <h1 className="text-2xl font-semibold">{t("myFavourites")}</h1>
                <NoDataFound
                    title={t("errorLoadingFavorites")}
                    description={t("pleaseTryAgainLater")}
                />
                <div className="flex justify-center">
                    <button
                        onClick={() => fetchFavouriteProperty()}
                        className="primaryBg primaryTextColor px-6 py-2 rounded-md hover:opacity-90"
                    >
                        {t("tryAgain")}
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <h1 className="text-2xl font-semibold">
                {t("myFavourites")}
            </h1>

            {favouriteProperty.length === 0 ? (
                <NoDataFound
                    title={t("noFavoritesYet")}
                    description={t("startExploringAndSaveProperties")}
                />
            ) : (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {favouriteProperty.map((property) => (
                            <PropertyVerticalNewCard
                                key={property.id}
                                property={property}
                                removeCard={handleRemoveProperty}
                            />
                        ))}
                    </div>

                    {/* Load More Button - only show if total count is greater than LIMIT */}
                    {hasMore && (
                        <div className="flex justify-center mt-8">
                            <button
                                onClick={() => fetchFavouriteProperty(true)}
                                disabled={loadingMore}
                                className={`border brandBorder brandTextColor px-6 py-2 rounded-md transition-all hover:primaryTextColor hover:brandBg hover:brandBorder ${loadingMore ? 'opacity-50 cursor-not-allowed' : 'hover:opacity-90'}`}
                            >
                                {loadingMore ? t("loading") : t("loadMore")}
                            </button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}

export default UserFavourites;