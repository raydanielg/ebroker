import { useEffect, useState } from 'react';
import ImageWithPlaceholder from '../image-with-placeholder/ImageWithPlaceholder';
import { ArrowRight } from 'lucide-react';
import { useTranslation } from '../context/TranslationContext';
import { formatPriceAbbreviated, getDisplayValueForOption, handlePackageCheck, isRTL } from '@/utils/helperFunction';
import Swal from 'sweetalert2';
import { addFavouritePropertyApi } from '@/api/apiRoutes';
import toast from 'react-hot-toast';
import { FaHeart } from 'react-icons/fa';
import { FiHeart } from 'react-icons/fi';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import CustomLink from '../context/CustomLink';
import { useAuthStatus } from '@/hooks/useAuthStatus';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import { PackageTypes } from '@/utils/checkPackages/packageTypes';
import { ReactSVG } from 'react-svg';

const FeaturedPropertyHorizontalCard = ({ property, removeCard = null }) => {
    const t = useTranslation();
    const router = useRouter();
    const { locale } = router?.query;
    const userData = useSelector((state) => state.User?.data);
    const isUserProperty = property?.added_by == userData?.id;
    const isUserLoggedIn = useAuthStatus();
    const isRtl = isRTL();
    const validParameters = property?.parameters
        ?.filter((elem) => elem?.value !== "" && elem?.value !== "0")
        .slice(0, 4);


    // Initialize states with proper type conversion
    const [isLiked, setIsLiked] = useState(Boolean(property?.is_favourite));
    const [isLoading, setIsLoading] = useState(false);
    const [isDisliked, setIsDisliked] = useState(false);
    const [showLoginModal, setShowLoginModal] = useState(false);

    // Handle Like
    const handleLike = async (e) => {
        e.preventDefault();
        e.stopPropagation();

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
                toast.success(t(res?.message));
            } else {
                // Revert on failure
                setIsLiked(false);
                toast.error(res.message);
            }
        } catch (error) {
            // Revert on error
            setIsLiked(false);
            console.error("Error adding to favorites:", error);
            toast.error(t(error?.message) || t("errorAddingToFavorites"));
        } finally {
            setIsLoading(false);
        }
    };

    // Handle Dislike
    const handleDislike = async (e) => {
        e.preventDefault();
        e.stopPropagation();

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
                toast.success(t(res?.message));
                // If we're in favorites view, remove the card
                if (removeCard) {
                    removeCard(property?.id);
                }
            } else {
                // Revert on failure
                setIsLiked(true);
                setIsDisliked(false);
                toast.error(t(res?.message));
            }
        } catch (error) {
            // Revert on error
            setIsLiked(true);
            setIsDisliked(false);
            console.error("Error removing from favorites:", error);
            toast.error(t(error.message) || t("errorRemovingFromFavorites"));
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
        if (!userData?.jwtToken) {
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
        if (property?.is_premium) {
            handlePackageCheck(e, PackageTypes.PREMIUM_PROPERTIES, router, property?.slug_id, property, isUserProperty, false, t);
        } else if (isUserProperty) {
            router?.push(`/${locale}/my-property/${property.slug_id}`);
        } else {
            router.push(`/${locale}/property-details/${property.slug_id}`);
        }
    };
    return (
        <div className="group bg-[#181818] rounded-2xl overflow-hidden border border-transparent transition-all duration-300 flex flex-col sm:flex-row p-3 sm:p-4 md:p-5 lg:p-6 gap-4 sm:gap-5 md:gap-6">
            <div className="relative w-full sm:w-[300px] md:w-[360px] lg:w-[390px] shrink-0" >
                <CustomLink onClick={handlePropertyClick} href={`${isUserProperty ? `/my-property/${property?.slug_id}` : `/property-details/${property?.slug_id}`}`} aria-label={property?.translated_title || property?.title}>
                    <ImageWithPlaceholder
                        src={property?.title_image}
                        alt={property?.translated_title || property?.title}
                        className="w-full h-full object-cover rounded-2xl aspect-square"
                    />
                </CustomLink>
                <div className='primaryBackgroundBg leadColor absolute bottom-4 left-4 p-2 font-bold text-sm rounded-lg flex items-center gap-2'>
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
                                    `fill: var(--featured-animated-color);`,
                                );
                            });
                        }}
                        className="w-5 h-5 flex items-center justify-center object-contain shrink-0"
                        alt={property?.category?.translated_name || property?.category?.name || 'parameter icon'}
                    />
                    {property?.category?.translated_name || property?.category?.category}
                </div>
                <button
                    onClick={isLiked ? handleDislike : handleLike}
                    disabled={isLoading}
                    aria-label={isLiked ? "Remove from favorites" : "Add to favorites"}
                    className={`absolute top-3 right-3 bg-[#00000080] hover:bg-[#00000090] text-white p-1.5 rounded-md transition-colors duration-200 backdrop-blur-sm ${isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:scale-110'}`}
                >
                    {isLiked ? (
                        <FaHeart className="text-lg text-white" />
                    ) : (
                        <FiHeart className="text-lg text-white" />
                    )}
                </button>
            </div>

            <div className="p-2 sm:p-3 md:p-4 lg:p-5 flex flex-col flex-grow">
                <div className="flex justify-between items-center mb-3">
                    {property?.promoted ? (
                        <span className="bg-white text-black text-xs font-bold px-3 py-1 rounded-md flex items-center gap-1.5">
                            <div className="w-4 h-4 !fill-black">
                                <svg width="100%" height="100%" viewBox="0 0 16 16" fill="none">
                                    <path d="M8 0.5C3.8645 0.5 0.5 3.8645 0.5 8C0.5 12.1355 3.8645 15.5 8 15.5C12.1355 15.5 15.5 12.1355 15.5 8C15.5 3.8645 12.1355 0.5 8 0.5ZM7.25 12.5V8.75H4.25L8.75 3.5V7.25H11.75L7.25 12.5Z" fill="black" />
                                </svg>
                            </div>
                            {t('featured')}
                        </span>
                    ) : (
                        <div></div>
                    )}

                    {property?.propery_type && (
                        <span className={`shrink-0 text-xs font-semibold px-3 py-1 rounded-full ${property?.propery_type === 'sell' ? 'primarySellBg primarySellText' : 'primaryRentBg primaryRentText'}`}>
                            {t(property?.propery_type)}
                        </span>
                    )}
                </div>

                <h3 className="text-lg font-semibold text-white mb-1" title={property?.title}>
                    <CustomLink
                        href={`${isUserProperty ? `/my-property/${property?.slug_id}` : `/property-details/${property?.slug_id}`}`}
                        className="hover:text-gray-300 transition-colors line-clamp-1"
                    >
                        {property?.translated_title || property?.title}
                    </CustomLink>
                </h3>

                <p className="text-sm text-gray-400 mb-2 truncate">
                    {`${property?.city || ''}${property?.city && property?.state ? ', ' : ''}${property?.state || ''}`}
                </p>

                <p className="text-sm text-gray-500 mb-4 line-clamp-2">
                    {property?.translated_description || property?.description}
                </p>

                <div className="flex items-center text-sm text-white mb-5 gap-3">
                    {validParameters?.length > 0 && (
                        <TooltipProvider delayDuration={100}>
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-y-2 text-xs text-white w-full">
                                {validParameters.map((parameter, index) => (
                                    <Tooltip key={parameter.id || index}>
                                        <TooltipTrigger asChild>
                                            <div
                                                className="flex items-center justify-start gap-1 px-2 cursor-default"
                                            >
                                                <div className="bg-white/25 p-2 flex items-center justify-center rounded-full">
                                                    <ReactSVG
                                                        src={parameter.image}
                                                        beforeInjection={(svg) => {
                                                            svg.setAttribute(
                                                                "style",
                                                                `height: 100%; width: 100%;`,
                                                            );
                                                            svg.querySelectorAll("path").forEach((path) => {
                                                                path.setAttribute(
                                                                    "style",
                                                                    `fill: var(--featured-animated-color);`,
                                                                );
                                                            });
                                                        }}
                                                        className="w-4 h-4 flex items-center justify-center object-contain shrink-0"
                                                        alt={parameter.translated_name || parameter.name || 'parameter icon'}
                                                    />
                                                </div>
                                                <span className="truncate">
                                                    {getDisplayValueForOption(parameter)}
                                                </span>
                                            </div>
                                        </TooltipTrigger>
                                        <TooltipContent side={isRtl ? "right" : "left"} className="bg-white text-black">
                                            <p>{parameter.translated_name || parameter.name}</p>
                                        </TooltipContent>
                                    </Tooltip>
                                ))}
                            </div>
                        </TooltipProvider>
                    )}
                </div>

                <div className="flex items-center justify-between mt-auto pt-3 sm:pt-4">
                    <div>
                        <p className="text-sm text-gray-500 mb-0.5">{t('price')}</p>
                        <span className="text-xl font-bold text-white">{formatPriceAbbreviated(property?.price)}</span>
                    </div>
                    <CustomLink
                        href={`${isUserProperty ? `/my-property/${property?.slug_id}` : `/property-details/${property?.slug_id}`}`}
                        className="flex items-center justify-center border-[1.5px] border-[#FFFFFF3D] text-[#FFFFFF3D] group-hover:bg-white group-hover:brandColor w-12 h-12 rounded-full transition-colors duration-500 ease-in-out"
                    >
                        <ArrowRight size={18} className={`flex-shrink-0 ${isRtl ? "rotate-180" : ""}`} onClick={handlePropertyClick} />
                    </CustomLink>
                </div>
            </div>
        </div>

    );
};

export default FeaturedPropertyHorizontalCard;