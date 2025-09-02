"use client";
import { changePropertyStatusApi, deletePropertyApi, getAddedPropertiesApi } from '@/api/apiRoutes';
import BgImage from "@/assets/dashboard_img.jpg";
import PremiumIcon from "@/assets/premium.svg";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import ReusableTable from "@/components/ui/reusable-table";
import { Switch } from "@/components/ui/switch";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger
} from "@/components/ui/tooltip";
import { PackageTypes } from '@/utils/checkPackages/packageTypes';
import { BadgeSvg, formatPriceAbbreviated, handlePackageCheck, isRTL, RejectionTooltip, renderStatusBadge, truncate } from "@/utils/helperFunction";
import Image from "next/image";
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { AiOutlineEdit } from "react-icons/ai";
import { BsThreeDotsVertical } from "react-icons/bs";
import { FaCrown, FaRegEye, FaUserFriends } from "react-icons/fa";
import { MdDeleteOutline, MdHome, MdOutlineSell, MdRemoveRedEye } from "react-icons/md";
import { useSelector } from 'react-redux';
import Swal from 'sweetalert2';
import CustomLink from '../context/CustomLink';
import { useTranslation } from '../context/TranslationContext';
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger } from '../ui/navigation-menu';
import ChangeStatusModal from './ChangeStatusModal';
import CustomPagination from '@/components/ui/custom-pagination';
import { Skeleton } from "@/components/ui/skeleton";

// Add TableLoadingSkeleton component
const TableLoadingSkeleton = ({ itemLength }) => (
    <div className="w-full">
        {/* Table Header Skeleton */}
        <div className="bg-gray-50 border-y">
            <div className="grid grid-cols-8 px-6 py-4">
                {['w-32', 'w-24', 'w-24', 'w-24', 'w-24', 'w-24', 'w-24', 'w-16'].map((width, i) => (
                    <Skeleton key={i} className={`h-4 ${width}`} />
                ))}
            </div>
        </div>

        {/* Table Rows Skeleton */}
        {[...Array(Number(itemLength))].map((_, rowIndex) => (
            <div key={rowIndex} className="border-b px-6 py-4">
                <div className="grid grid-cols-8 gap-4 items-center">
                    {/* Property Title and Image */}
                    <div className="flex items-center space-x-3">
                        {/* <div className="relative p-3">
                            <Skeleton className="h-16 w-16 rounded-md" />
                        </div> */}
                        <div className="space-y-2">
                            <Skeleton className="h-4 w-16" />
                            <Skeleton className="h-3 w-12" />
                        </div>
                    </div>

                    {/* Other columns */}
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-6 w-16 rounded-full" />
                    <div className="flex justify-center">
                        <Skeleton className="h-8 w-8 rounded-full" />
                    </div>
                    <Skeleton className="h-6 w-20 rounded-full" />
                    <div className="flex items-center gap-2 justify-center">
                        <Skeleton className="h-6 w-12 rounded-full" />
                        <Skeleton className="h-4 w-16" />
                    </div>
                    <Skeleton className="h-4 w-20" />
                    <div className="flex justify-center gap-2">
                        <Skeleton className="h-8 w-8 rounded-md" />
                        <Skeleton className="h-8 w-8 rounded-md" />
                    </div>
                </div>
            </div>
        ))}
    </div>
);

const UserDashboard = () => {
    const t = useTranslation();
    const router = useRouter();
    const { locale } = router?.query;
    const isRtl = isRTL();
    // Get data from redux state
    const userData = useSelector(state => state.User?.data?.name);
    const language = useSelector((state) => state.LanguageSettings?.active_language);
    const webSettings = useSelector(state => state.WebSetting?.data);
    const userVerificationStatus = webSettings?.verification_status; // possible values: "initial", "pending", "success", "failed"

    const [isLoading, setIsLoading] = useState(false);
    // State for status change modal
    const [statusModalOpen, setStatusModalOpen] = useState(false);
    const [selectedProperty, setSelectedProperty] = useState(null);

    const [getFeaturedListing, setFeaturedListing] = useState([]);
    const [offset, setOffset] = useState(0);
    const [total, setTotal] = useState(0);
    const [view, setView] = useState(0);
    const limit = 8;

    const [isPageLoading, setIsPageLoading] = useState(false);
    const itemsPerPage = 8; // Match with limit variable

    // Handle featuring a property
    const handleFeatureClick = (e, propertyId) => {
        e.preventDefault();
        // Implementation for featuring a property would go here
        if (webSettings.demo_mode === true) {
            Swal.fire({
                title: t("oops"),
                text: t("notAllowdDemo"),
                icon: "warning",
                showCancelButton: false,
                customClass: {
                    confirmButton: "Swal-buttons",
                },
                confirmButtonText: t("ok"),
            });
            return false;
        }
        handlePackageCheck(e, PackageTypes.PROPERTY_FEATURE, router, propertyId, null, null, null, t);
    };

    const placeholderImage = () => {
        console.error('Image error handled');
    };

    // Handle opening the status change modal
    const handleOpenStatusModal = (property) => {
        setSelectedProperty(property);
        setStatusModalOpen(true);
    };

    const fetchProperties = async () => {
        try {
            if (!isPageLoading) {
                setIsLoading(true);
            }
            const res = await getAddedPropertiesApi({
                limit: limit.toString(),
                offset: offset.toString(),
            });
            if (!res?.error) {
                setFeaturedListing(res?.data);
                setTotal(res?.total);
                setView(res?.total_views);
            }
        } catch (error) {
            console.error("Error in fetching properties", error);
        } finally {
            setIsLoading(false);
            setIsPageLoading(false);
        }
    };

    useEffect(() => {
        fetchProperties();
    }, [offset, language]);

    // Handle Property Active/Deactive Status toggle
    const handleStatusToggle = async (propertyId, currentStatus) => {
        if (webSettings.demo_mode === true) {
            Swal.fire({
                title: t("oops"),
                text: t("notAllowdDemo"),
                icon: "warning",
                showCancelButton: false,
                customClass: {
                    confirmButton: "Swal-buttons",
                },
                confirmButtonText: t("ok"),
            });
            return false;
        }

        try {
            setIsLoading(true);
            const newStatus = currentStatus === 1 ? 0 : 1;
            const res = await changePropertyStatusApi({
                property_id: propertyId,
                status: newStatus,
            });
            if (!res?.error) {
                toast.success(t("statusUpdatedSuccessfully"));
                fetchProperties(); // Refresh properties after status change
            } else {
                toast.error(res?.message || t("failedToUpdateStatus"));
            }
        } catch (error) {
            setIsLoading(false);
            toast.error(t("failedToUpdateStatus"));
        }
    };

    // Handle deleting a property
    const handleDeleteProperty = async (propertyId) => {
        if (webSettings.demo_mode === true) {
            Swal.fire({
                title: t("oops"),
                text: t("notAllowdDemo"),
                icon: "warning",
                showCancelButton: false,
                customClass: {
                    confirmButton: "Swal-confirm-buttons",
                    cancelButton: "Swal-cancel-buttons",
                },
                confirmButtonText: t("ok"),
            });
            return false;
        }

        Swal.fire({
            icon: "warning",
            title: t("areYouSure"),
            text: t("youWantToDeleteProperty"),
            customClass: {
                confirmButton: "Swal-confirm-buttons",
            },
        }).then((result) => {
            if (result.isConfirmed) {
                handleDeletePropertyConfirm(propertyId);
            }
        });
    };

    const handleDeletePropertyConfirm = async (propertyId) => {
        try {
            setIsLoading(true);
            const res = await deletePropertyApi({ id: propertyId });
            if (!res?.error) {
                toast.success(t(res?.message));
                fetchProperties(); // Refresh properties after deletion
            } else {
                toast.error(t(res?.message) || t("failedToDeleteProperty"));
            }
        } catch (error) {
            console.error("Error in deleting property", error);
            toast.error(t(error?.message) || t("failedToDeleteProperty"));
        } finally {
            setIsLoading(false);
        }
    };

    const handleEditProperty = (propertySlug) => {
        router.push(`/${locale}/user/edit-property/${propertySlug}`);
    };


    // Define table columns configuration
    const tableColumns = [
        {
            header: t("property"),
            accessor: "title",
            align: isRtl ? "right" : "left",
            renderCell: (elem) => (
                <div className="flex items-center space-x-3">
                    <div className="relative p-3">
                        <div className="h-16 w-16 rounded-md overflow-hidden bg-gray-100">
                            <Image
                                src={elem.title_image}
                                alt={elem.title}
                                width={60}
                                height={60}
                                className="object-cover h-full w-full"
                                onError={placeholderImage}
                            />
                        </div>
                        {elem.is_premium && (
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <span className="absolute top-4 left-3 text-white text-xs px-1 rounded">
                                            <Image src={PremiumIcon} alt="Premium" width={20} height={20} />
                                        </span>
                                    </TooltipTrigger>
                                    <TooltipContent sideOffset={8}>
                                        <p>{t("premiumProperty")}</p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        )}
                    </div>
                    <div className='w-full'>
                        <div className="font-medium rtl:text-start">{truncate(elem.translated_title || elem.title, 25)}</div>
                        <div className="text-sm text-gray-500">
                            {elem?.promoted ?
                                <span className="primaryColor font-bold flex items-center">
                                    {t("featured")}
                                </span> : null}
                            <div className="flex flex-col md:flex-row justify-between gap-2">
                                <span className='rtl:text-start'>{elem.city}, {elem.state}, {elem.country}</span>
                                <div className='flex items-center gap-1'>
                                    {elem.total_click > 0 && (
                                        <>
                                            <FaRegEye className="" size={12} /> {elem.total_click}
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ),
        },
        {
            header: t("propertyType"),
            accessor: "category.category",
            align: "center",
            renderCell: (elem) => (
                <span className="capitalize px-3 py-1.5 rounded-lg text-sm">
                    {elem.category?.translated_name || elem.category?.category}
                </span>
            ),
        },
        {
            header: t("rentSale"),
            accessor: "property_type",
            align: "center",
            renderCell: (elem) => (
                <span className={`capitalize px-3 py-1.5 rounded-lg text-sm ${elem.property_type === 'sell' ? 'primarySellText primarySellBg' : 'primaryRentText primaryRentBg'}`}>
                    {t(elem.property_type)}
                </span>
            ),
        },
        {
            header: t("interestedUsers"),
            accessor: "interested_users",
            align: "center",
            renderCell: (elem) => (
                <CustomLink href={`/user/interested/${elem.slug_id}`}>
                    {elem.interested_users && elem.interested_users.length > 0 ? (
                        <div className="flex justify-center overflow-hidden">
                            {elem.interested_users.slice(0, 3).map((user, index) => (
                                <Avatar key={user?.id} className="border-2 border-white w-8 h-8">
                                    <AvatarImage src={user?.profile || ""} alt={user?.name || `User ${user?.id + 1}`} />
                                    <AvatarFallback>{user?.name ? user?.name?.charAt(0) : "U"}</AvatarFallback>
                                </Avatar>
                            ))}
                            {elem.interested_users.length > 3 && (
                                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-200 border-2 border-white text-xs">
                                    +{elem.interested_users.length - 3}
                                </div>
                            )}
                        </div>
                    ) : (
                        <span className="text-xs">-</span>
                    )}
                </CustomLink>
            ),
        },
        {
            header: t("adminStatus"),
            accessor: "request_status",
            align: "center",
            renderCell: (elem) => (
                <div className="flex justify-center items-center gap-2">
                    {renderStatusBadge(elem.request_status, t)}
                    {elem.request_status === 'rejected' && <RejectionTooltip reason={elem?.reject_reason?.reason} t={t} />}
                </div>
            ),
        },
        {
            header: t("propertyStatus"),
            accessor: "status",
            align: "center",
            renderCell: (elem) => (
                <div className="flex justify-center items-center gap-1">
                    <Switch
                        checked={elem.status === 1 && elem?.request_status !== "pending"}
                        onCheckedChange={() => handleStatusToggle(elem.id, elem.status)}
                        disabled={elem.request_status === "pending" || elem.request_status === "rejected"}
                        className={`${elem.status === 1 && elem?.request_status !== "pending" ? "!primaryBg" : "!bg-[#28252566]"} rounded-[100px] h-4 w-8 transition-colors duration-300 sm:h-5 sm:w-10 [&>span]:h-2.5 [&>span]:w-2.5 ${isRtl ? "data-[state=checked]:[&>span]:-translate-x-4" : "data-[state=checked]:[&>span]:translate-x-4"} sm:[&>span]:h-3 sm:[&>span]:w-3 ${isRtl ? "sm:data-[state=checked]:[&>span]:-translate-x-5" : "sm:data-[state=checked]:[&>span]:translate-x-5"}`}
                    />
                    <span className={`ml-2 text-sm ${elem.status === 1 && elem?.request_status !== "pending" ? "primaryColor" : "secondryTextColor"} capitalize`}>
                        {elem.status === 1 && elem?.request_status !== "pending" ? t("active") : t("deactive")}
                    </span>
                </div>
            ),
        },
        {
            header: t("price"),
            accessor: "price",
            align: "center",
            renderCell: (elem) => formatPriceAbbreviated(elem.price),
        },
        {
            header: t("action"),
            accessor: "id",
            align: "center",
            renderCell: (elem, rowIndex, data) => {
                const isLastRow = rowIndex === getFeaturedListing.length - 1;
                return (
                    <div className="flex justify-center items-center gap-2">
                        <Button size="sm" variant="outline" className="bg-transparent h-8 w-8 p-0" onClick={() => router.push(`/${locale}/my-property/${elem.slug_id}`)}>
                            <MdRemoveRedEye className="h-4 w-4" />
                        </Button>
                        <NavigationMenu className={`
                        ${isRtl ? "[&_div:nth-child(2)]:!left-5 [&_div:nth-child(2)]:!right-auto" : "[&_div:nth-child(2)]:!right-5 [&_div:nth-child(2)]:!left-auto"}
                        [&_div:nth-child(2)>div]:!z-[9999]
                      [&_div:nth-child(2)>div]:!bg-white
                        ${isLastRow ? "[&_div:nth-child(2)]:!bottom-[40px] [&_div:nth-child(2)]:!top-auto" : "[&_div:nth-child(2)]:!bottom-0"}
                    `}>
                            <NavigationMenuList>
                                <NavigationMenuItem>
                                    <NavigationMenuTrigger
                                        className="primaryRentBg 
                                        primaryRentText 
                                        [&_svg.lucide]:hidden 
                                        hover:primaryRentBg 
                                        data-[state=open]:!primaryRentBg 
                                        data-[state=open]:!primaryRentText 
                                        hover:primaryRentText 
                                        data-[state=active]:!primaryRentBg 
                                        data-[state=active]:!primaryRentText 
                                        p-3 
                                        focus:primaryRentBg focus:primaryRentText ">
                                        <BsThreeDotsVertical className="h-4 w-4" />
                                    </NavigationMenuTrigger>
                                    <NavigationMenuContent className="grid !w-[150px]  gap-1 relative z-[9999]">
                                        {elem.request_status !== "pending" && <NavigationMenuLink className='rtl:text-start px-3 py-2 flex justify-start items-center gap-2 bg-white hover:primaryBgLight hover:primaryColor hover:cursor-pointer' onClick={() => handleEditProperty(elem?.slug_id)}>
                                            <AiOutlineEdit />{t("edit")}
                                        </NavigationMenuLink>}
                                        {elem.request_status !== "pending" &&
                                            elem?.is_feature_available ? (
                                            <NavigationMenuLink
                                                key="feature"
                                                onClick={(e) =>
                                                    handleFeatureClick(e, elem?.id)
                                                }
                                                className='rtl:text-start px-3 py-2 flex justify-start items-center gap-2 bg-white hover:primaryBgLight hover:primaryColor hover:cursor-pointer'
                                            >
                                                <FaCrown />
                                                {t("featured")}
                                            </NavigationMenuLink>
                                        ) : null}
                                        {elem.request_status !== "pending" &&
                                            elem.status === 1 &&
                                            elem.property_type !== "sold" ? (
                                            <NavigationMenuLink
                                                className='rtl:text-start px-3 py-2 flex justify-start items-center gap-2 bg-white hover:primaryBgLight hover:primaryColor hover:cursor-pointer'
                                                onClick={() => handleOpenStatusModal(elem)}
                                            >
                                                <MdOutlineSell />{t("changeStatus")}
                                            </NavigationMenuLink>
                                        ) : null}
                                        <NavigationMenuLink className='rtl:text-start px-3 py-2 flex justify-start items-center gap-2 bg-white hover:primaryBgLight hover:primaryColor hover:cursor-pointer'
                                            onClick={() => handleDeleteProperty(elem?.id)}
                                        >
                                            <MdDeleteOutline />{t("delete")}
                                        </NavigationMenuLink>
                                    </NavigationMenuContent>
                                </NavigationMenuItem>
                            </NavigationMenuList>
                        </NavigationMenu>
                    </div >
                );
            },
        },
    ];

    // Render verification content based on status
    const renderVerificationContent = () => {
        switch (userVerificationStatus) {
            case "success":
                return (
                    <div className="p-5 h-full flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                        <div>
                            <h1 className="text-2xl md:text-4xl font-medium mb-2">
                                {t("verifySuccessTitle")}
                            </h1>
                            <p className="text-base secondryTextColor mb-4 secondryTextColor opacity-80">{t("verifySuccessDesc")}</p>
                        </div>
                        <div className="flex items-center gap-2 primaryTextColor primaryBg uppercase px-3 py-2 rounded-lg font-bold">
                            <span className="font-medium">{t("verified")}</span>
                            {BadgeSvg}
                        </div>
                    </div>
                );
            case "failed":
                return (
                    <div className="p-5 h-full flex flex-col md:flex-row justify-between items-center gap-4">
                        <div>
                            <h1 className="text-2xl md:text-4xl font-medium mb-2">
                                {t("verifyFailTitle")}
                            </h1>
                            <p className="text-base secondryTextColor mb-4 secondryTextColor opacity-80">{t("verifyFailDesc")}</p>
                        </div>
                        <CustomLink href="/user/verification-form">
                            <button className="text-base  font-semibold secondaryTextBg text-white px-5 py-2.5 rounded-lg hover:primaryBg hover:text-white transition-all duration-300 ease-in-out">
                                {t("reApply")}
                            </button>
                        </CustomLink>
                    </div>
                );
            case "pending":
                return (
                    <div className="p-5 h-full flex flex-col md:flex-row justify-between items-center gap-4">
                        <div>
                            <h1 className="text-2xl md:text-4xl font-medium mb-2">
                                {t("verifyPendingTitle")}
                            </h1>
                            <p className="text-base secondryTextColor mb-4 secondryTextColor opacity-80">{t("verifyPendingDesc")}</p>
                        </div>
                    </div>
                );
            case "initial":
            default:
                return (
                    <div className="p-5 h-full flex flex-col md:flex-row justify-between items-center gap-4">
                        <div>
                            <h1 className="text-2xl md:text-4xl font-medium mb-2">
                                {t("verifyIntialTitle")}
                            </h1>
                            <p className="text-base secondryTextColor mb-4 secondryTextColor opacity-80">{t("verifyIntialDesc")}</p>
                        </div>
                        <CustomLink href="/user/verification-form">
                            <button className="secondaryTextBg text-white px-4 py-2 rounded-md">
                                {t("apply")}
                            </button>
                        </CustomLink>
                    </div>
                );
        }
    };

    // Add handlePageChange function
    const handlePageChange = (page) => {
        setIsPageLoading(true);
        setOffset((page - 1) * limit);
    };

    return (
        <div className="overflow-y-auto">
            <div className='grid grid-cols-12 gap-4'>
                {/* User Info Card */}
                <div className="min-h-[130px] col-span-12 md:col-span-4 rounded-lg overflow-hidden"
                    style={{
                        backgroundImage: `url(${BgImage?.src})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        backgroundRepeat: "no-repeat",
                        backgroundSize: "100% 130px",
                        backgroundOrigin: "padding-box",
                    }}
                >
                    <div className="px-5 h-full flex items-center bg-[rgba(8,124,124,.568)]">
                        <div className="primaryTextColor opacity-100">
                            <h2 className="text-lg md:text-2xl font-bold">
                                {t("hy")}, {truncate(userData, 15)}
                            </h2>
                            <p className="text-base mt-1">
                                {t("manageYourProfileAndViewProperty")}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Total Properties Card */}
                <div className="min-h-[130px] col-span-12 md:col-span-4 bg-white rounded-lg overflow-hidden">
                    <div className="px-5 h-full flex justify-between items-center">
                        <div>
                            <h3 className="secondryTextColor text-base font-medium">
                                {t("totalProperties")}
                            </h3>
                            <p className="text-3xl font-semibold mt-1">{total > 0 ? total : 0}</p>
                        </div>
                        <div className="secondaryTextBg w-[70px] h-[70px] flex justify-center items-center rounded-full">
                            <MdHome size={38} className='text-white' />
                        </div>
                    </div>
                </div>

                {/* Total Views Card */}
                <div className="min-h-[130px] col-span-12 md:col-span-4 bg-white rounded-lg overflow-hidden">
                    <div className="px-5 h-full flex justify-between items-center">
                        <div>
                            <h3 className="secondryTextColor text-base font-medium">
                                {t("totalViews")}
                            </h3>
                            <p className="text-3xl font-semibold mt-1">{view > 0 ? view : 0}</p>
                        </div>
                        <div className="secondaryTextBg w-[70px] h-[70px] flex justify-center items-center rounded-full">
                            <FaUserFriends size={38} className='text-white' />
                        </div>
                    </div>
                </div>

                {/* Verification Card */}
                <div className="min-h-[130px] border col-span-12 md:col-span-12 bg-white rounded-lg overflow-hidden">
                    {renderVerificationContent()}
                </div>

                {/* Property Listing Table */}
                <div className="col-span-12 my-4">
                    <div className="bg-white rounded-lg overflow-visible">
                        {(isLoading || isPageLoading) ? (
                            <TableLoadingSkeleton itemLength={itemsPerPage} />
                        ) : (
                            <ReusableTable
                                parentClassName="rounded-tl-xl rounded-tr-xl overflow-visible [&>div]:overflow-visible"
                                columns={tableColumns}
                                data={getFeaturedListing}
                                loading={false}
                                emptyMessage={t("noDataAvailable")}
                            />
                        )}

                        {/* Add Pagination */}
                        {!isLoading && !isPageLoading && (total > itemsPerPage) && <div className={`transition-opacity duration-200 ${isPageLoading ? 'opacity-50' : 'opacity-100'}`}>
                            <CustomPagination
                                currentPage={Math.floor(offset / limit) + 1}
                                totalItems={total}
                                itemsPerPage={limit}
                                onPageChange={handlePageChange}
                                isLoading={isPageLoading}
                                translations={{
                                    showing: t("showing"),
                                    to: t("to"),
                                    of: t("of"),
                                    entries: t("entries")
                                }}
                            />
                        </div>}
                    </div>
                </div>
            </div>

            {/* Change Status Modal */}
            {selectedProperty && (
                <ChangeStatusModal
                    open={statusModalOpen}
                    onOpenChange={setStatusModalOpen}
                    propertyId={selectedProperty.id}
                    propertyType={selectedProperty.property_type}
                    onStatusChanged={fetchProperties}
                />
            )}
        </div>
    );
};

export default UserDashboard;