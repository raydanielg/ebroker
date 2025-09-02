'use client';

import { MapPin, ArrowRight } from 'lucide-react';
import ImageWithPlaceholder from '../image-with-placeholder/ImageWithPlaceholder';
import { featuredIcon, premiumIcon } from '@/assets/svg';
import { useTranslation } from '../context/TranslationContext';
import CustomLink from '../context/CustomLink';
import { useSelector } from 'react-redux';
import { ReactSVG } from 'react-svg';
import { handlePackageCheck, isRTL, showLoginSwal } from '@/utils/helperFunction';
import { PackageTypes } from '@/utils/checkPackages/packageTypes';
import { useRouter } from 'next/router';

const PremiumPropertyCard = ({ property, type = "" }) => {
    const router = useRouter();
    const t = useTranslation();
    const userId = useSelector((state) => state.User?.data?.id);
    const isUserProperty = userId && property?.added_by === userId;
    const propertyLink = `/property-details/${property?.slug_id}`;
    const projectLink = `/project-details/${property?.slug_id}`;
    const webSettings = useSelector((state) => state.WebSetting?.data);
    const isRtl = isRTL();
    const imageUrl = property?.title_image || property?.image || webSettings?.web_placeholder_image;

    const handleClick = (e) => {
        e?.preventDefault();
        if (!userId) {
            return showLoginSwal(
                "oops",
                "plzLogFirsttoAccess",
                () => { },
                t
            );
        }
        if (type === "featured_projects_section") {
            handlePackageCheck(e, PackageTypes.PROJECT_ACCESS, router, property?.slug_id, property, isUserProperty, false, t);

        }
        else {
            handlePackageCheck(e, PackageTypes.PREMIUM_PROPERTIES, router, property?.slug_id, property, isUserProperty, false, t);
        }

    };

    // Determine clip path class based on badges for featured projects
    const getClipPathClass = () => {
        const hasPremium = property?.is_premium || type === "featured_projects_section";
        const hasFeatured = property?.promoted || property?.is_promoted;

        // Use dual badges clip path only for featured projects when both badges are present
        if (type === "featured_projects_section" && hasPremium && hasFeatured && !isRtl) {
            return "my-clip-path-dual-badges";
        } else if (type === "featured_projects_section" && hasPremium && hasFeatured && isRtl) {
            return "my-clip-path-dual-badges-rtl";
        }
        if (type === "premium_properties_section" && isRtl) {
            return "my-clip-path-rtl";
        }
        return "my-clip-path";
    };
    return (
        <div className="relative rounded-2xl overflow-hidden h-full p-4 bg-white">

            {/* Main image with outside rounded corners */}
            <div className="w-full h-full">
                <div className='relative w-full h-full rounded-2xl overflow-hidden'>
                    <ImageWithPlaceholder
                        src={imageUrl}
                        alt={property?.title || 'Property'}
                        fill
                        className={`object-fill w-full h-full min-h-[550px] ${getClipPathClass()}`}
                    />

                    {/* Badge container with custom corner cut */}
                    <div className='absolute top-0 left-0 z-10 flex items-center justify-start gap-2 bg-white py-2 px-2 rounded-br-2xl'>
                        {/* Top right corner cut element */}
                        {/* {(property?.promoted || property?.is_promoted || property?.is_premium) && <div className='absolute w-6 h-6 content-[""] right-[-23px] top-[-1px] bg-transparent rounded-tl-[50px] shadow-[-6px_-6px_0px_0px_#fff]'></div>} */}

                        {/* Badges container */}
                        <div className='flex items-center gap-2 relative'>
                            {property?.is_premium || type == "featured_projects_section" ? (
                                <span className="text-sm font-semibold p-1 rounded-[8px] bg-[#F9EDD7] flex items-center gap-1 capitalize">
                                    {premiumIcon()}
                                    {t('premium')}
                                </span>
                            ) : null}
                            {property?.promoted || property?.is_promoted && (
                                <span className="bg-black text-white text-sm font-semibold p-1 rounded-[8px] flex items-center gap-1">
                                    <div className='w-6 h-6'>{featuredIcon()}</div>
                                    {t('featured')}
                                </span>
                            )}
                        </div>

                        {/* Bottom left corner cut */}
                        {/* {(property?.promoted || property?.is_promoted || property?.is_premium) && <div className='absolute w-6 h-6 content-[""] left-0 bottom-[-24px] bg-transparent rounded-tl-[19px] shadow-[-4px_-4px_0px_4px_#fff]'></div>} */}
                    </div>
                </div>

                {/* Floating white panel at bottom */}
                <div className="absolute bottom-0 left-0 right-0 bg-white rounded-2xl shadow-sm p-4 m-6 flex flex-col items-start lg:flex-row lg:items-end justify-between gap-2">
                    <div className='flex flex-col gap-1'>
                        <div className="flex items-center gap-2 bg-[#F5F5F4] rounded-md p-2 mb-3 w-fit">
                            {/* <ImageWithPlaceholder
                                src={property?.category?.image}
                                alt={property?.category?.translated_name || property?.category?.category || 'category icon'}
                                className="w-4 h-4 object-contain"
                                width={16}
                                height={16}
                                isSkeleton={false}
                            /> */}
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
                            <span className="line-clamp-1 text-sm font-bold leadColor">{property?.category?.translated_name || property?.category?.category || 'N/A'}</span>
                        </div>

                        <h3 className="text-base font-semibold" title={property?.translated_title || property?.title}>
                            {property?.translated_title || property?.title}
                        </h3>

                        <div className="flex items-center gap-2 text-gray-500">
                            <MapPin size={18} className="text-gray-400 flex-shrink-0" />
                            <p className="text-xs text-gray-500 truncate">
                                {`${property?.city || ''}${property?.city && property?.state ? ', ' : ''}${property?.state || ''}`}
                            </p>
                        </div>
                    </div>
                    <div className="flex justify-end">
                        <button
                            onClick={handleClick}
                            className="inline-flex items-center gap-1 px-6 py-2 rounded-md border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors text-sm font-medium"
                        >
                            {t('seeDetails')}
                            <ArrowRight size={16} className={`flex-shrink-0 ${isRtl ? "rotate-180" : ""}`} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PremiumPropertyCard;
