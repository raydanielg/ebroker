import React, { useEffect, useState, useRef, useCallback } from 'react';
import dynamic from 'next/dynamic';
const MainSwiper = dynamic(() => import('../mainswiper/MainSwiper'), { ssr: false });
import * as api from "@/api/apiRoutes";
const Faqs = dynamic(() => import('../faqs/Faqs'), { ssr: false });
import { useTranslation } from '../context/TranslationContext';
import { useSelector } from 'react-redux';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuthStatus } from '@/hooks/useAuthStatus';
import LocationSearchWithRadius from '../location-search/LocationSearchWithRadius';
import Swal from 'sweetalert2';


const HomeNewSectionOne = dynamic(() => import('../homepagesections/HomeNewSectionOne'), { ssr: false });
const HomeNewSectionFour = dynamic(() => import('../homepagesections/HomeNewSectionFour'), { ssr: false });
const PremiumPropertiesSection = dynamic(() => import('../homepagesections/PremiumPropertiesSection'), { ssr: false });
const AgentSwiperSection = dynamic(() => import('../homepagesections/AgentSwiperSection'), { ssr: false });
const HomeNewSectionTwo = dynamic(() => import('../homepagesections/HomeNewSectionTwo'), { ssr: false });
const HomePropertiesOnMap = dynamic(() => import('../homepagesections/HomePropertiesOnMap'), { ssr: false });


const Home = () => {
    const t = useTranslation();

    // --- Use the custom hook to get reactive login status ---
    const isUserLoggedIn = useAuthStatus();

    const userSelectedLocation = useSelector(state => state.location);
    const languageCode = useSelector(state => state.LanguageSettings?.active_language);
    const [isLocationPopupOpen, setIsLocationPopupOpen] = useState(false);
    const settings = useSelector(state => state.WebSetting?.data);
    const isPropertiesOnMapEnabled = settings?.is_properties_on_map_section_active === true;
    const isNearByCitiesEnabled = settings?.is_properties_by_city_section_active === true;
    const isHomePageLocationAlertEnabled = settings?.homepage_location_alert_status === "1";

    const [homePageData, setHomePageData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    // Use refs to track previous values for comparison
    const prevLocationRef = useRef({
        latitude: userSelectedLocation?.latitude,
        longitude: userSelectedLocation?.longitude,
        radius: userSelectedLocation?.radius
    });
    const prevAuthStatusRef = useRef(isUserLoggedIn);
    const prevLanguageRef = useRef(languageCode);
    const dataFetchedRef = useRef(false);

    // Memoized API call function to prevent unnecessary re-renders
    const fetchHomeData = useCallback(async () => {
        try {
            // Skip if no change in dependencies that would affect the API call
            // Note: We always fetch when language changes, so language is excluded from this check
            // if (
            //     dataFetchedRef.current &&
            //     prevLocationRef.current.latitude === userSelectedLocation?.latitude &&
            //     prevLocationRef.current.longitude === userSelectedLocation?.longitude &&
            //     prevLocationRef.current.radius === userSelectedLocation?.radius &&
            //     prevAuthStatusRef.current === isUserLoggedIn &&
            //     prevLanguageRef.current === languageCode &&
            //     false // Force fetch for language changes (by making this condition always false)
            // ) {
            //     return homePageData;
            // }

            const response = await api.getHomePageData({
                latitude: userSelectedLocation?.latitude,
                longitude: userSelectedLocation?.longitude,
                radius: userSelectedLocation?.radius
            });
            if (response?.data?.homepage_location_data_available === false && isHomePageLocationAlertEnabled) {
                Swal.fire({
                    title: t("locationDataNotAvailable"),
                    text: t("pleaseChangeLocationOrContinue"),
                    icon: "warning",
                    showCancelButton: true,
                    confirmButtonText: t("changeLocation"),
                    cancelButtonText: t("continue"),
                    customClass: {
                        confirmButton: "Swal-confirm-buttons",
                        cancelButton: "Swal-cancel-buttons",
                    },
                }).then((result) => {
                    if (result.isConfirmed) {
                        setIsLocationPopupOpen(true);
                    }
                });
            }

            // Update state with new data
            setHomePageData(response.data);

            // Update refs with current values to track changes
            prevLocationRef.current = {
                latitude: userSelectedLocation?.latitude,
                longitude: userSelectedLocation?.longitude,
                radius: userSelectedLocation?.radius
            };
            prevAuthStatusRef.current = isUserLoggedIn;
            prevLanguageRef.current = languageCode;
            dataFetchedRef.current = true;

            return response.data;
        } catch (error) {
            console.error("Error fetching home data:", error);
            return null;
        }
    }, [
        userSelectedLocation?.latitude,
        userSelectedLocation?.longitude,
        userSelectedLocation?.radius,
        isUserLoggedIn,
        languageCode
        // Removed homePageData from dependencies to prevent unnecessary rerenders
    ]);

    // Effect to fetch data when dependencies change
    useEffect(() => {
        let isMounted = true;
        setIsLoading(true);

        const loadData = async () => {
            // Always fetch data when language changes or any other dependency changes
            // This ensures translated content is fetched properly
            const data = await fetchHomeData();
            if (isMounted && data) {
                setIsLoading(false);
            }
        };

        loadData();

        // Cleanup function
        return () => {
            isMounted = false;
        };
    }, [fetchHomeData]);

    const getSectionInfo = (type) => {
        switch (type) {
            case "nearby_properties_section":
                return { Component: HomeNewSectionOne, style: null, buttonText: "exploreMoreListings" };
            case "most_viewed_properties_section":
                return { Component: HomeNewSectionTwo, style: null, label: "checkOutMostViewed" };
            case "most_liked_properties_section":
                return { Component: HomeNewSectionTwo, style: null, label: "seeMostLiked" };
            case "properties_by_cities_section":
                return { Component: HomeNewSectionTwo, style: "style_2", label: "exploreCities" };
            case "featured_projects_section":
                return { Component: PremiumPropertiesSection, style: "style_1", buttonLink: "/projects/featured-projects", buttonText: "browseFeaturedProjects" };
            case "user_recommendations_section":
                return { Component: HomeNewSectionOne, style: "style_1", buttonText: "exploreMoreListings" };
            case "categories_section":
                return { Component: HomeNewSectionOne, style: "style_1", buttonLink: "/all/categories", buttonText: "exploreCategories" };
            case "agents_list_section":
                return { Component: AgentSwiperSection, style: null };
            case "articles_section":
                return { Component: HomeNewSectionOne, style: "style_3", buttonLink: "/all/articles", buttonText: "readMoreInsights" };
            case "projects_section":
                return { Component: HomeNewSectionTwo, style: "style_4", label: "exploreProjects" };
            case "faqs_section":
                return { Component: Faqs, style: null };
            case "featured_properties_section":
                return { Component: HomeNewSectionFour, style: null, buttonText: "seeFeaturedProperties" };
            case "premium_properties_section":
                return { Component: PremiumPropertiesSection, style: null, buttonText: "seeAllPremiumProperties" };
            case "properties_on_map_section":
                return { Component: HomePropertiesOnMap, style: null, label: "exploreOnMap" };
            default:
                console.warn("Unknown section type:", type);
                return { Component: null, style: null };
        }
    };

    // --- Define a typical order for skeleton sections ---
    const SKELETON_SECTION_ORDER = [
        'featured_properties_section', // Style 1
        'categories_section',          // Style 2
        'most_viewed_properties_section',// Style 1
        'agents_list_section',         // Style 2
        'projects_section',            // Style 4
        'articles_section',            // Style 3
        'premium_properties_section',  // Style 1
        'properties_on_map_section',  // Style 1
        // Add more representative types if needed
    ];

    // --- Helper to get the correct skeleton component based on type ---
    const getSkeletonForType = (type) => {
        switch (type) {
            case "nearby_properties_section":
            case "featured_properties_section":
            case "most_viewed_properties_section":
            case "user_recommendation_section":
            case "most_liked_properties_section":
            case "properties_by_cities_section":
            case "premium_properties_section":
            case "featured_projects_section":
            case "properties_on_map_section":
                return SkeletonSectionOne;
            case "categories_section":
            case "agents_list_section":
                return SkeletonSectionTwo;
            case "articles_section":
                return SkeletonSectionThree;
            case "projects_section":
                return SkeletonSectionFour;
            // Note: We handle FaqsSkeleton separately if it's always last
            default:
                return SkeletonSectionOne; // Fallback to a default skeleton
        }
    };

    // Skeleton components for different section styles
    const SkeletonSectionOne = ({ title }) => (
        <div className="container mx-auto py-8 px-4">
            <div className="mb-6">
                <Skeleton className="h-8 w-64" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3].map((_, index) => (
                    <div key={index} className="rounded-lg overflow-hidden shadow-md">
                        <Skeleton className="w-full h-48" />
                        <div className="p-4 space-y-3">
                            <Skeleton className="h-6 w-3/4" />
                            <Skeleton className="h-4 w-1/2" />
                            <div className="flex justify-between items-center pt-3">
                                <Skeleton className="h-6 w-24" />
                                <Skeleton className="h-8 w-8 rounded-full" />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );

    const SkeletonSectionTwo = ({ title }) => (
        <div className="container mx-auto py-8 px-4">
            <div className="mb-6">
                <Skeleton className="h-8 w-64" />
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {[1, 2, 3, 4, 5].map((_, index) => (
                    <div key={index} className="flex flex-col items-center">
                        <Skeleton className="h-16 w-16 rounded-full mb-3" />
                        <Skeleton className="h-5 w-24" />
                    </div>
                ))}
            </div>
        </div>
    );

    const SkeletonSectionThree = ({ title }) => (
        <div className="container mx-auto py-8 px-4">
            <div className="mb-6">
                <Skeleton className="h-8 w-64" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3].map((_, index) => (
                    <div key={index} className="rounded-lg overflow-hidden shadow-md">
                        <Skeleton className="w-full h-40" />
                        <div className="p-4 space-y-2">
                            <Skeleton className="h-6 w-full" />
                            <Skeleton className="h-4 w-3/4" />
                            <div className="flex items-center gap-2 pt-2">
                                <Skeleton className="h-8 w-8 rounded-full" />
                                <Skeleton className="h-4 w-32" />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );

    const SkeletonSectionFour = ({ title }) => (
        <div className="container mx-auto py-8 px-4">
            <div className="mb-6">
                <Skeleton className="h-8 w-64" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[1, 2].map((_, index) => (
                    <div key={index} className="rounded-lg overflow-hidden shadow-md">
                        <Skeleton className="w-full h-60" />
                        <div className="p-4 space-y-3">
                            <Skeleton className="h-6 w-3/4" />
                            <Skeleton className="h-4 w-1/2" />
                            <div className="grid grid-cols-3 gap-2 py-3">
                                {[1, 2, 3].map((_, i) => (
                                    <div key={i} className="flex items-center gap-2">
                                        <Skeleton className="h-4 w-4 rounded-full" />
                                        <Skeleton className="h-4 w-16" />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );

    const MainSwiperSkeleton = () => (
        <div className="relative w-full h-[600px] md:h-[700px]">
            <Skeleton className="absolute inset-0 w-full h-full" />
            {/* <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center w-3/4 space-y-4">
                    <Skeleton className="h-10 w-3/4 mx-auto" />
                    <Skeleton className="h-6 w-1/2 mx-auto" />
                    <div className="flex justify-center gap-3 pt-4">
                        <Skeleton className="h-12 w-32 rounded-md" />
                        <Skeleton className="h-12 w-32 rounded-md" />
                    </div>
                </div>
            </div> */}
        </div>
    );

    const FaqsSkeleton = () => (
        <div className="container mx-auto py-8 px-4">
            <div className="text-center mb-8">
                <Skeleton className="h-8 w-64 mx-auto mb-3" />
                <Skeleton className="h-4 w-full max-w-lg mx-auto" />
            </div>
            <div className="max-w-3xl mx-auto space-y-4">
                {[1, 2, 3, 4].map((_, index) => (
                    <div key={index} className="border rounded-lg p-4">
                        <Skeleton className="h-6 w-full mb-2" />
                        <Skeleton className="h-4 w-3/4" />
                    </div>
                ))}
            </div>
        </div>
    );

    return (
        <section className=''>
            {isLoading ? (
                // Skeleton UI during loading
                <>
                    <MainSwiperSkeleton />
                    <div className='flex flex-col'>
                        {SKELETON_SECTION_ORDER.map((type, index) => {
                            const SkeletonComponent = getSkeletonForType(type);
                            // Use index for key, pass a generic title prop
                            return <SkeletonComponent key={index} title={`Loading Section ${index + 1}...`} />;
                        })}
                    </div>
                    <FaqsSkeleton />
                </>
            ) : (
                // Actual content when data is loaded
                <>
                    <MainSwiper slides={homePageData?.slider_section} />
                    <div className='flex flex-col'>
                        {homePageData?.sections?.map((apiSection, index) => {
                            const { Component, style, label, buttonLink, buttonText } = getSectionInfo(apiSection.type);
                            if (Component) {
                                // Special case for properties_nearby_cities which uses a different data source
                                const sectionData = apiSection.data;

                                // Make sure data is not empty or null before rendering
                                if (apiSection.type === 'faqs_section') {
                                    if (sectionData && Array.isArray(sectionData) && sectionData.length > 0) {
                                        return <Component translated_title={apiSection?.translated_title} faqs={sectionData} key={index} />;
                                    }
                                } else if (apiSection.type === 'featured_properties_section') {
                                    if (sectionData && Array.isArray(sectionData) && sectionData.length > 0) {
                                        return <Component translated_title={apiSection?.translated_title} title={apiSection.title} data={sectionData} key={index} index={index} name={apiSection.type} buttonLink={buttonLink} buttonText={buttonText} />;
                                    }
                                } else if (apiSection.type === 'properties_on_map_section') {
                                    return <Component translated_title={apiSection?.translated_title} title={apiSection.title} data={sectionData} key={index} index={index} name={apiSection.type} />;
                                } else if (sectionData && (!Array.isArray(sectionData) || sectionData.length > 0)) {
                                    return (
                                        <Component
                                            translated_title={apiSection?.translated_title}
                                            title={apiSection.title}
                                            data={sectionData}
                                            key={index}
                                            index={index}
                                            name={apiSection.type}
                                            label={label}
                                            type={apiSection.type}
                                            buttonLink={buttonLink}
                                            buttonText={buttonText}
                                        />
                                    );
                                }
                            }
                            return null; // Don't render if no component found or data is empty
                        })}
                    </div>
                </>
            )}
            {isLocationPopupOpen && (
                <LocationSearchWithRadius
                    isOpen={isLocationPopupOpen}
                    onClose={() => setIsLocationPopupOpen(false)}
                />
            )}
        </section>
    );
};

export default Home;