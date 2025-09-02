'use client';

import React from 'react';
import { useTranslation } from '../context/TranslationContext';
import ImageWithPlaceholder from '../image-with-placeholder/ImageWithPlaceholder';
import CustomLink from "../context/CustomLink";
import { addFavouritePropertyApi } from "@/api/apiRoutes";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import { useAuthStatus } from '@/hooks/useAuthStatus';
import { FiHeart } from 'react-icons/fi';
import { FaHeart } from 'react-icons/fa';
import { formatPriceAbbreviated, handlePackageCheck } from '@/utils/helperFunction';
import { featuredIcon } from '@/assets/svg';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
import { PackageTypes } from '@/utils/checkPackages/packageTypes';
import { ReactSVG } from 'react-svg';


const MapPropertyCard = ({ property, removeCard = null }) => {
    const t = useTranslation();
    const isUserLoggedIn = useAuthStatus();
    const router = useRouter();
    const { locale } = router?.query;
    const userData = useSelector((state) => state.User?.data);
    const isUserProperty = property?.added_by == userData?.id;

    const [isLiked, setIsLiked] = useState(Boolean(property?.is_favourite));
    const [isLoading, setIsLoading] = useState(false);
    const [isDisliked, setIsDisliked] = useState(false);
    const [showLoginModal, setShowLoginModal] = useState(false);

    // Handle Like
    const handleLike = async (e) => {
        e?.preventDefault();
        e?.stopPropagation();

        if (isLoading) return;

        if (!isUserLoggedIn) {
            Swal.fire({
                title: t("plzLogFirst"),
                icon: "warning",
                allowOutsideClick: true,
                showCancelButton: false,
                customClass: {
                    confirmButton: "Swal-confirm-buttons",
                    cancelButton: "Swal-cancel-buttons",
                },
                confirmButtonText: t("ok"),
            }).then((result) => {
                if (result.isConfirmed) {
                    setShowLoginModal(true);
                }
            });
            return;
        }

        try {
            setIsLoading(true);
            // Optimistically update UI
            setIsLiked(true);
            setIsDisliked(false);

            const res = await addFavouritePropertyApi({
                property_id: property?.id,
                type: "1", // Add to favorites
            });

            if (res.error === false) {
                toast.success(t(res.message));
            } else {
                // Revert on failure
                setIsLiked(false);
                toast.error(res.message);
            }
        } catch (error) {
            // Revert on error
            setIsLiked(false);
            console.error("Error adding to favorites:", error);
            toast.error(t((error?.message) || t("errorAddingToFavorites")));
        } finally {
            setIsLoading(false);
        }
    };

    // Handle Dislike
    const handleDislike = async (e) => {
        e?.preventDefault();
        e?.stopPropagation();

        if (isLoading) return;

        try {
            setIsLoading(true);
            // Optimistically update UI
            setIsLiked(false);
            setIsDisliked(true);

            const res = await addFavouritePropertyApi({
                property_id: property?.id,
                type: "0", // Remove from favorites
            });

            if (res.error === false) {
                toast.success(t(res.message));
                // If we're in favorites view, remove the card
                if (removeCard) {
                    removeCard(property?.id);
                }
            } else {
                // Revert on failure
                setIsLiked(true);
                setIsDisliked(false);
                toast.error(res.message);
            }
        } catch (error) {
            // Revert on error
            setIsLiked(true);
            setIsDisliked(false);
            console.error("Error removing from favorites:", error);
            toast.error(t(error?.message) || t("errorRemovingFromFavorites"));
        } finally {
            setIsLoading(false);
        }
    };

    // Update states when property changes
    useEffect(() => {
        // Convert to boolean and update state
        setIsLiked(Boolean(property?.is_favourite));
        setIsDisliked(false);
    }, [property?.is_favourite]);

    const handlePropertyClick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (property?.is_premium) {
            handlePackageCheck(e, PackageTypes.PREMIUM_PROPERTIES, router, property?.slug_id, property, isUserProperty, false, t);
        } else if (isUserProperty) {
            router?.push(`/${locale}/my-property/${property.slug_id}`);
        } else {
            router.push(`/${locale}/property-details/${property.slug_id}`);
        }
    };


    return (
        <div className="w-full h-fit cardBg rounded-2xl newBorder">
            {/* Property Image */}
            {/* Image & Favorite Button */}
            <div className="relative rounded-t-2xl">
                <CustomLink
                    href={`${isUserProperty ? `/my-property/${property?.slug_id}` : `/property-details/${property?.slug_id}`}`}
                    aria-label={property.title}
                    className="rounded-t-2xl"
                    onClick={handlePropertyClick}
                    tabIndex={-1}
                >
                    <ImageWithPlaceholder
                        src={property.title_image}
                        alt={property.title}
                        className="h-56 w-full rounded-t-2xl object-cover"
                    />
                    <div className="absolute inset-0 bg-black opacity-0 rounded-t-2xl transition-opacity duration-300 ease-in-out group-hover:opacity-45"></div>
                </CustomLink>

                <div className="absolute left-3 right-3 top-3 flex items-start justify-between">
                    {property.promoted && (
                        <span className="flex items-center gap-1 rounded-[8px] bg-black bg-opacity-75 px-2 py-1 text-sm font-semibold text-white backdrop-blur-sm">
                            <div className="h-4 w-4">{featuredIcon()}</div>
                            {t("featured")}
                        </span>
                    )}
                    {!property.promoted && <div></div>}

                    <button
                        onClick={isLiked ? handleDislike : handleLike}
                        disabled={isLoading}
                        aria-label={isLiked ? "Remove from favorites" : "Add to favorites"}
                        className={`rounded-md bg-[#00000080] p-1.5 text-white backdrop-blur-sm transition-colors duration-200 hover:bg-[#00000090] ${isLoading ? "cursor-not-allowed opacity-50" : "hover:scale-110"}`}
                    >
                        {isLiked ? (
                            <FaHeart className="text-lg text-white" />
                        ) : (
                            <FiHeart className="text-lg text-white" />
                        )}
                    </button>
                </div>

                <span className="absolute bottom-3 left-3 flex items-center gap-1.5 rounded-md bg-white px-2.5 py-1 text-xs font-semibold text-gray-800 shadow">
                    <ReactSVG
                        src={property?.category?.image}
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
                        className="w-5 h-5 flex items-center justify-center object-contain shrink-0"
                        alt={property?.category?.translated_name || property?.category?.name || 'category icon'}
                    />
                    <span className="line-clamp-1 text-sm font-bold leadColor">
                        {property.category?.translated_name || property.category?.category}
                    </span>
                </span>
            </div>


            {/* Property details */}
            <div className="">
                <div className="md:space-y-1.5">
                    {/* Title and rent tag */}
                    <div className="p-2 md:p-3 flex flex-col gap-1">

                        <div className="flex justify-between items-start">
                            <h3 className="font-semibold text-base text-gray-900 truncate pr-2">
                                {property?.translated_title || property?.title}
                            </h3>
                            {property?.property_type == "sell" ? (
                                <span
                                    className="primarySellBg primarySellText rounded-md px-3 py-1 text-sm font-bold"
                                    itemProp="offeredBy"
                                >
                                    {t("sell")}
                                </span>
                            ) : (
                                <span
                                    className="primaryRentBg primaryRentText rounded-md px-3 py-1 text-sm font-bold"
                                    itemProp="offeredBy"
                                >
                                    {t("rent")}
                                </span>
                            )}
                        </div>

                        {/* Location */}
                        <p
                            className="text-sm text-gray-500"
                            itemProp="addressLocality"
                        >{`${property?.city ? property?.city + ", " : ""} ${property?.state ? property?.state + ", " : ""} ${property?.country ? property?.country : ""}`}</p>
                    </div>

                    {/* Divider */}
                    <hr className="border-gray-100 border" />

                    {/* Price and details button */}
                    <div className="flex justify-between items-center pt-1 p-2 md:p-3">
                        <span
                            className="text-lg font-bold text-black"
                            itemProp="price"
                            content={property?.price}
                        >
                            {property?.price
                                ? formatPriceAbbreviated(property?.price.toString())
                                : ""}
                        </span>
                        <CustomLink href={`${isUserProperty ? `/my-property/${property?.slug_id}` : `/property-details/${property?.slug_id}`}`} title={property?.translated_title || property?.title} onClick={handlePropertyClick}>
                            <div className="border brandBorder rounded-md py-1.5 px-3 text-center text-sm brandColor hover:bg-gray-50 transition-colors">
                                {t("details")}
                            </div>
                        </CustomLink>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MapPropertyCard; 