"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, XCircle, Calendar } from "lucide-react";
import { useTranslation } from '../context/TranslationContext';
import DualColorCircularProgressBar from '@/components/ui/DualColorCircularProgressBar';
import { getPackagesApi } from '@/api/apiRoutes';
import SubscriptionCardSkeleton from '../skeletons/SubscriptionCardSkeleton';
import { useSelector } from 'react-redux';
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import CustomLink from '../context/CustomLink';

const UserSubscription = () => {
    const t = useTranslation();
    const [isLoading, setIsLoading] = useState(true);
    const [activePackages, setActivePackages] = useState([]);
    const [allFeatures, setAllFeatures] = useState([]);

    const systemSettings = useSelector(state => state?.WebSetting?.data);
    const language = useSelector((state) => state.LanguageSettings?.active_language);
    const CurrencySymbol = systemSettings?.currency_symbol;

    const containerRef = useRef(null);

    const fetchActivePackages = async () => {
        try {
            setIsLoading(true);
            const response = await getPackagesApi();
            setActivePackages(response?.active_packages);
            setAllFeatures(response?.all_features);
            setIsLoading(false);
        } catch (error) {
            console.error('Error fetching active packages:', error);
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchActivePackages();
    }, [language]);

    // Format date helper function
    const formatDate = (inputDate) => {
        if (inputDate === null) {
            return "Lifetime";
        }

        const months = [
            "January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"
        ];

        const date = new Date(inputDate);
        const dayOfWeek = date.toLocaleDateString("en-US", { weekday: "long" });
        const day = date.getDate();
        const month = months[date.getMonth()];
        const year = date.getFullYear();

        return `${t(dayOfWeek?.toLowerCase())}, ${day} ${t(month?.toLowerCase())}, ${year}`;
    };

    // Calculate remaining time helper function
    const calculateRemainingTime = (endDate, durationHours) => {
        const now = new Date();
        const end = new Date(endDate);
        const timeDiff = end - now;

        if (timeDiff <= 0) return "0 " + t("timeLeft"); // Expired

        // If duration is in hours (less than 24 hours)
        if (durationHours && durationHours < 24) {
            const remainingHours = Math.ceil(timeDiff / (1000 * 60 * 60));
            return `${remainingHours} ${t("hoursLeft")}`;
        }

        // Otherwise, calculate remaining days
        const remainingDays = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
        return `${remainingDays} ${t("daysLeft")}`;
    };

    // Helper to get feature limit and inclusion status
    const getFeatureLimit = (features, featureId) => {
        const feature = features?.find(f => f.id === featureId);

        if (!feature) {
            return { included: false, limit: null };
        }

        if (feature.limit_type === "unlimited") {
            return {
                included: true,
                limit: null,
                type: feature.limit_type,
            };
        } else {
            return {
                included: true,
                limit: feature.total_limit,
                usedLimit: feature.used_limit,
                type: feature.limit_type,
            };
        }
    };

    const formatDuration = (hours) => {
        if (hours >= 24) {
            const days = Math.floor(hours / 24);
            return `${days} ${t("days")}`;
        } else {
            return `${hours} ${t("hours")}`;
        }
    };

    // Animated Card component with fade effect
    const AnimatedCard = ({ subscriptionData, index, totalCards }) => {
        const cardRef = useRef(null);

        // For individual card scroll tracking
        const { scrollYProgress } = useScroll({
            target: cardRef,
            offset: ["start end", "end start"],
        });

        // Calculate opacity based on scroll position
        const opacity = useTransform(
            scrollYProgress,
            [0, 0.5, 0.7, 1],  // Scroll progress points
            [1, 1, 0.4, 0.1]  // Opacity values at those points
        );

        // Calculate transform for slight movement when scroll passes
        const y = useTransform(
            scrollYProgress,
            [0, 0.3, 0.7, 1],
            [20, 0, -10, -20]
        );

        // Get property/project names from API data in AnimatedCard component
        // Get feature names from API data
        const propertyListFeature = allFeatures?.find(f => f.id === 1);
        const projectListFeature = allFeatures?.find(f => f.id === 2);
        const propertyFeatureListFeature = allFeatures?.find(f => f.id === 3);
        const projectFeatureListFeature = allFeatures?.find(f => f.id === 4);

        // Get limits for each relevant feature
        const propertyList = getFeatureLimit(subscriptionData.features, 1); // Property List
        const projectList = getFeatureLimit(subscriptionData.features, 2); // Project List
        const propertyFeatureList = getFeatureLimit(subscriptionData.features, 3); // Property Feature
        const projectFeatureList = getFeatureLimit(subscriptionData.features, 4); // Project Feature

        // Get feature limits
        const propertyListLimit = propertyList?.limit || 0;
        const projectListLimit = projectList?.limit || 0;
        const propertyFeatureListLimit = propertyFeatureList?.limit || 0;
        const projectFeatureListLimit = projectFeatureList?.limit || 0;

        // Get used limits
        const usedPropertyListLimit = propertyList?.usedLimit || 0;
        const usedProjectListLimit = projectList?.usedLimit || 0;
        const usedPropertyFeatureListLimit = propertyFeatureList?.usedLimit || 0;
        const usedProjectFeatureListLimit = projectFeatureList?.usedLimit || 0;

        return (
            <motion.div
                ref={cardRef}
            >
                <Card className="relative overflow-hidden border-0 bg-white">
                    {/* Active badge */}
                    <div className="absolute top-1 right-4">
                        <div className="primaryBg text-white py-1 px-6 sm:px-10 transform rotate-45 translate-x-[35%] translate-y-[40%] text-xs sm:text-sm font-medium">
                            {t("active")}
                        </div>
                    </div>

                    {/* Subscription info */}
                    <CardHeader className="pb-4 sm:pb-6 pt-4 sm:pt-6 px-4 sm:px-6 border-b border-gray-200">
                        <div className="text-sm sm:text-base font-medium">{subscriptionData.translated_name || subscriptionData.name}</div>
                        <div className="flex items-baseline mt-1 gap-1">
                            <span className="text-xl sm:text-2xl font-bold">
                                {subscriptionData.price ? `${CurrencySymbol}${subscriptionData.price}` : t("free")}
                            </span>
                            <span className="text-xs sm:text-sm font-normal text-gray-500">/ {formatDuration(subscriptionData.duration)}</span>
                        </div>
                    </CardHeader>

                    <CardContent className="space-y-3 sm:space-y-4 px-4 sm:px-6 pt-3 sm:pt-4 pb-4 sm:pb-6">
                        {/* Stats cards grid */}
                        <div className="grid grid-cols-1 xl:grid-cols-2 gap-3 sm:gap-4">
                            {/* Listing Usage */}
                            <Card className="bg-[#F5F5F4] border-0 shadow-none rounded-md">
                                <CardHeader className="py-2 px-3">
                                    <CardTitle className="text-xs sm:text-sm font-bold capitalize text-center">
                                        {t("listing")}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="flex flex-col gap-1 sm:flex-row items-center justify-between p-2 sm:p-4 m-2 sm:m-4 bg-white">
                                    {subscriptionData.features && (
                                        propertyList?.included || projectList?.included ? (
                                            <>
                                                <div className="flex-shrink-0">
                                                    <DualColorCircularProgressBar
                                                        packageId={subscriptionData.id}
                                                        propertyUsed={usedPropertyListLimit}
                                                        projectUsed={usedProjectListLimit}
                                                        propertyLimit={propertyListLimit}
                                                        projectLimit={projectListLimit}
                                                        isPropertyUnlimited={propertyList?.type === "unlimited"}
                                                        isProjectUnlimited={projectList?.type === "unlimited"}
                                                        isPropertyIncluded={propertyList?.included}
                                                        isProjectIncluded={projectList?.included}
                                                    />
                                                </div>

                                                <div className="gap-2 sm:gap-3 flex-1 pl-2 sm:pl-4">
                                                    <div className="flex items-center gap-1 sm:gap-2">
                                                        <div className="w-1 h-5 sm:h-6 bg-[#FF008A] flex-shrink-0"></div>
                                                        <span className="text-xs sm:text-sm font-medium text-gray-500">{propertyListFeature?.translated_name || propertyListFeature?.name || t("property")}</span>
                                                        <span className="ltr:ml-auto text-xs sm:text-sm font-bold rtl:mr-auto">
                                                            {propertyList?.included ? (
                                                                propertyList?.type === "unlimited" ?
                                                                    t("unlimited") :
                                                                    `${usedPropertyListLimit} / ${propertyListLimit}`
                                                            ) : t("notIncluded")}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center gap-1 sm:gap-2">
                                                        <div className="w-1 h-5 sm:h-6 bg-[#0754FC] flex-shrink-0"></div>
                                                        <span className="text-xs sm:text-sm font-medium text-gray-500">{projectListFeature?.translated_name || projectListFeature?.name || t("project")}</span>
                                                        <span className="ltr:l-auto text-xs sm:text-sm font-bold rtl:mr-auto">
                                                            {projectList?.included ? (
                                                                projectList?.type === "unlimited" ?
                                                                    t("unlimited") :
                                                                    `${usedProjectListLimit} / ${projectListLimit}`
                                                            ) : t("notIncluded")}
                                                        </span>
                                                    </div>
                                                </div>
                                            </>
                                        ) : (
                                            <div className="w-full min-h-[60px] sm:min-h-[100px] text-center py-2 sm:py-4 flex items-center justify-center text-xs sm:text-sm">{t("listingNotIncluded")}</div>
                                        )
                                    )}
                                </CardContent>
                            </Card>

                            {/* Featured Ad Usage */}
                            <Card className="bg-[#F5F5F4] border-0 shadow-none rounded-md">
                                <CardHeader className="py-2 px-3">
                                    <CardTitle className="text-xs sm:text-sm font-bold capitalize text-center">
                                        {t("featuredAd")}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="flex flex-col gap-1 sm:flex-row items-center justify-between p-2 sm:p-4 m-2 sm:m-4 bg-white">
                                    {subscriptionData.features && (
                                        propertyFeatureList?.included || projectFeatureList?.included ? (
                                            <>
                                                <div className="flex-shrink-0">
                                                    <DualColorCircularProgressBar
                                                        packageId={subscriptionData.id}
                                                        propertyUsed={usedPropertyFeatureListLimit}
                                                        projectUsed={usedProjectFeatureListLimit}
                                                        propertyLimit={propertyFeatureListLimit}
                                                        projectLimit={projectFeatureListLimit}
                                                        isPropertyUnlimited={propertyFeatureList?.type === "unlimited"}
                                                        isProjectUnlimited={projectFeatureList?.type === "unlimited"}
                                                        isPropertyIncluded={propertyFeatureList?.included}
                                                        isProjectIncluded={projectFeatureList?.included}
                                                    />
                                                </div>

                                                <div className="space-y-2 sm:space-y-3 flex-1 pl-2 sm:pl-4">
                                                    <div className="flex items-center gap-1 sm:gap-2">
                                                        <div className="w-1 h-5 sm:h-6 bg-[#FF008A] flex-shrink-0"></div>
                                                        <span className="text-xs sm:text-sm font-medium text-gray-500">{propertyFeatureListFeature?.translated_name || propertyFeatureListFeature?.name}</span>
                                                        <span className="ltr:ml-auto text-xs sm:text-sm font-bold rtl:mr-auto">
                                                            {propertyFeatureList?.included ? (
                                                                propertyFeatureList?.type === "unlimited" ?
                                                                    t("unlimited") :
                                                                    `${usedPropertyFeatureListLimit} / ${propertyFeatureListLimit}`
                                                            ) : t("notIncluded")}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center gap-1 sm:gap-2">
                                                        <div className="w-1 h-5 sm:h-6 bg-[#0754FC] flex-shrink-0"></div>
                                                        <span className="text-xs sm:text-sm font-medium text-gray-500">{projectFeatureListFeature?.translated_name || projectFeatureListFeature?.name}</span>
                                                        <span className="ltr:ml-auto text-xs sm:text-sm font-bold rtl:mr-auto">
                                                            {projectFeatureList?.included ? (
                                                                projectFeatureList?.type === "unlimited" ?
                                                                    t("unlimited") :
                                                                    `${usedProjectFeatureListLimit} / ${projectFeatureListLimit}`
                                                            ) : t("notIncluded")}
                                                        </span>
                                                    </div>
                                                </div>
                                            </>
                                        ) : (
                                            <div className="w-full min-h-[60px] sm:min-h-[100px] text-center py-2 sm:py-4 flex items-center justify-center text-xs sm:text-sm">{t("featureNotIncluded")}</div>
                                        )
                                    )}
                                </CardContent>
                            </Card>
                        </div>

                        {/* Remaining Days */}
                        <Card className="bg-[#F5F5F4] border-0 shadow-none rounded-md">
                            <CardContent className="p-3 sm:p-4 flex justify-between items-center">
                                <div className="text-xs sm:text-sm font-semibold capitalize text-gray-500">
                                    {subscriptionData.duration < 24 ? t("remainingHours") : t("remainingDays")}
                                </div>
                                <div className="text-xs sm:text-sm font-medium">
                                    {calculateRemainingTime(subscriptionData.end_date, subscriptionData.duration)}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Benefits */}
                        <div>
                            <div className="text-xs sm:text-sm font-medium mb-2 capitalize">{t("includedBenefits")}</div>
                            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-2">
                                {allFeatures && allFeatures.length > 0 ? (
                                    allFeatures
                                        .filter(feature => feature.id >= 5) // Filter only benefit features - typically IDs 5 and above
                                        .map((benefit) => {
                                            const isIncluded = subscriptionData.features?.some(f => f.id === benefit.id);
                                            return (
                                                <div
                                                    key={benefit.id}
                                                    className="flex items-start p-2 sm:p-4 bg-[#F5F5F4] rounded-md gap-2"
                                                >
                                                    {isIncluded ? (
                                                        <CheckCircle2 className="h-3 w-3 sm:h-4 sm:w-4 text-green-500 relative top-0.5 sm:top-1" />
                                                    ) : (
                                                        <XCircle className="h-3 w-3 sm:h-4 sm:w-4 text-red-500 relative top-0.5 sm:top-1" />
                                                    )}
                                                    <div className='flex flex-col items-start justify-start gap-0.5 sm:gap-1'>
                                                        <span className="flex-grow text-xs sm:text-sm font-normal">{benefit.translated_name || benefit.name}</span>
                                                        <span className="mr-auto text-xs sm:text-sm font-bold capitalize flex-shrink-0 whitespace-nowrap">
                                                            {isIncluded ? t("included") : t("notIncluded")}
                                                        </span>
                                                    </div>
                                                </div>
                                            );
                                        })
                                ) : (
                                    <div className="col-span-full text-center text-xs sm:text-sm text-gray-500">
                                        {t("noAdditionalBenefits")}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Dates */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mt-2 sm:mt-4">
                            <div className="flex items-center gap-1 sm:gap-2">
                                <div className="h-7 w-7 sm:h-9 sm:w-9 primaryBg rounded-md flex items-center justify-center text-white flex-shrink-0">
                                    <Calendar className="h-3 w-3 sm:h-4 sm:w-4" />
                                </div>
                                <div>
                                    <div className="text-xs text-gray-500 capitalize">{t("startedOn")}</div>
                                    <div className="text-xs sm:text-sm font-bold">{formatDate(subscriptionData.start_date)}</div>
                                </div>
                            </div>
                            <div className="flex items-center justify-end gap-1 sm:gap-2">
                                <div className='flex flex-col items-end justify-end'>
                                    <div className="text-xs text-gray-500 capitalize">{t("endsOn")}</div>
                                    <div className="text-xs sm:text-sm font-bold">{formatDate(subscriptionData.end_date)}</div>
                                </div>
                                <div className="h-7 w-7 sm:h-9 sm:w-9 primaryBg rounded-md flex items-center justify-center text-white flex-shrink-0">
                                    <Calendar className="h-3 w-3 sm:h-4 sm:w-4" />
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </motion.div>
        );
    };

    return (
        <div className="w-full px-4 sm:px-6 lg:container lg:mx-auto py-4 sm:py-8 relative" ref={containerRef}>

            <div className="mb-4 sm:mb-6">
                <h2 className="text-xl sm:text-2xl font-bold">
                    {t("mySubscriptions")}
                </h2>
            </div>

            {isLoading ? (
                // Show skeleton loading UI
                <div className="space-y-4 sm:space-y-6">
                    {Array.from({ length: 3 }).map((_, index) => (
                        <SubscriptionCardSkeleton key={index} />
                    ))}
                </div>
            ) : activePackages && activePackages.length > 0 ? (
                // Create a container for sticky scroll sections with enough space to scroll
                <div className={`${window?.innerWidth >= 1280 ? 'space-y-6' : 'space-y-4 sm:space-y-6'}`}>
                    {activePackages.map((subscriptionData, index) => (
                        <div
                            key={subscriptionData.id || index}
                            className={`${window?.innerWidth >= 1280 ? 'sticky-section ' : ''} ${window?.innerWidth >= 1280 && index === activePackages?.length - 1 ? '!mb-[130px]' : ''}`}
                            style={
                                window?.innerWidth >= 1280 ? {
                                    position: 'sticky',
                                    top: `${index}px`,
                                    zIndex: index,
                                    // marginBottom: index === activePackages.length - 1 ? '14vh' : 0,
                                    paddingTop: 0
                                } : {}
                            }
                        >
                            <AnimatedCard
                                subscriptionData={subscriptionData}
                                index={index}
                                totalCards={activePackages.length}
                            />
                        </div>
                    ))}
                </div>
            ) : (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    className="text-center flex flex-col items-center justify-center mx-auto p-4 sm:p-8 gap-3"
                >
                    <p className="text-sm sm:text-base">{t("noActiveSubscription")}</p>
                    <CustomLink href="/subscription-plan" className="primaryBg justify-self-center w-fit text-white px-4 py-2 font-bold rounded-md">
                        {t("viewPlans")}
                    </CustomLink>
                </motion.div>
            )}
        </div>
    );
};

export default UserSubscription;