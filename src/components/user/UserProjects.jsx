"use client";
import React, { useEffect, useState } from 'react';
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
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger } from '../ui/navigation-menu';
import CustomPagination from '@/components/ui/custom-pagination';
import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";
import { useTranslation } from '../context/TranslationContext';
import { truncate, formatPriceAbbreviated, handlePackageCheck, isDemoMode, renderStatusBadge, RejectionTooltip, timeAgo, isRTL } from "@/utils/helperFunction";
import CustomLink from '../context/CustomLink';
import { AiOutlineEdit } from "react-icons/ai";
import { BsThreeDotsVertical, BsQuestionCircle } from "react-icons/bs";
import { FaCrown, FaRegEye } from "react-icons/fa";
import { MdDeleteOutline, MdRemoveRedEye } from "react-icons/md";
import PremiumIcon from "@/assets/premium.svg";
import { getUserProjectsApi, changeProjectStatusApi, deleteProjectApi } from '@/api/apiRoutes';
import toast from 'react-hot-toast';
import { PackageTypes } from '@/utils/checkPackages/packageTypes';
import Swal from 'sweetalert2';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
// Table Loading Skeleton Component
const TableLoadingSkeleton = ({ itemLength }) => (
    <div className="w-full">
        {/* Table Header Skeleton */}
        <div className="bg-gray-50 border-y">
            <div className="grid grid-cols-7 px-6 py-4">
                {['w-32', 'w-24', 'w-24', 'w-24', 'w-24', 'w-24', 'w-16'].map((width, i) => (
                    <Skeleton key={i} className={`h-4 ${width}`} />
                ))}
            </div>
        </div>

        {/* Table Rows Skeleton */}
        {[...Array(Number(itemLength))].map((_, rowIndex) => (
            <div key={rowIndex} className="border-b px-6 py-4">
                <div className="grid grid-cols-7 gap-4 items-center">
                    {/* Project Title and Image */}
                    <div className="flex items-center space-x-3">
                        {/* <div className="relative p-3">
                            <Skeleton className="h-16 w-16 rounded-md" />
                        </div> */}
                        <div className="space-y-2">
                            <Skeleton className="h-4 w-24" />
                            <Skeleton className="h-3 w-20" />
                        </div>
                    </div>

                    {/* Other columns */}
                    <Skeleton className="h-4 w-24" />
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

const UserProjects = () => {
    const t = useTranslation();
    const router = useRouter();
    const isRtl = isRTL();
    const { locale } = router?.query;
    const isDemoModeActive = isDemoMode();
    const language = useSelector((state) => state.LanguageSettings?.active_language);
    // States
    const [isLoading, setIsLoading] = useState(false);
    const [isPageLoading, setIsPageLoading] = useState(false);
    const [offset, setOffset] = useState(0);
    const [total, setTotal] = useState(15); // Dummy total count
    const limit = 5; // Items per page

    // Dummy data for projects
    const [projects, setProjects] = useState([]);


    const fetchUserProjects = async () => {
        setIsLoading(true);
        try {
            const res = await getUserProjectsApi({ limit: limit.toString(), offset: offset.toString() });
            setProjects(res?.data);
            setTotal(res?.total);
        } catch (error) {
            console.error("Error in fetching user projects", error);
        } finally {
            setIsLoading(false);
            setIsPageLoading(false);
        }
    };

    useEffect(() => {
        fetchUserProjects();
    }, [offset, language]);

    // Handlers
    const handleStatusToggle = async (projectId, currentStatus) => {
        try {
            // Call API to change status
            const newStatus = currentStatus === 1 ? 0 : 1;
            const response = await changeProjectStatusApi({
                project_id: projectId,
                status: newStatus
            });

            if (response?.error === false) {
                // Update local state only if API call is successful
                setProjects(prev => prev.map(project =>
                    project.id === projectId
                        ? { ...project, status: newStatus }
                        : project
                ));
                toast.success(t("projectStatusUpdatedSuccessfully"));
            }
        } catch (error) {
            console.error("Error in changing project status:", error);
        }
    };

    // Handle featuring a project
    const handleFeatureClick = (e, projectId) => {
        e.preventDefault();
        // Implementation for featuring a project would go here
        if (isDemoModeActive) {
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
        handlePackageCheck(e, PackageTypes.PROJECT_FEATURE, router, projectId, null, null, true, t);
    };

    // Handle edit click
    const handleClickEdit = (slugId) => {
        if (isDemoModeActive) {
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
        router.push(`/${locale}/user/edit-project/${slugId}`);
    };

    // Handle delete click
    const handleClickDelete = (projectId) => {
        if (isDemoModeActive) {
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

        Swal.fire({
            title: t("areYouSure"),
            text: t("deleteProjectWarning"),
            icon: "warning",
            showCancelButton: true,
            customClass: {
                confirmButton: "Swal-confirm-buttons",
                cancelButton: "Swal-cancel-buttons",
            },
            confirmButtonText: t("yesDelete"),
            cancelButtonText: t("cancel"),
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    // Call delete API here
                    const response = await deleteProjectApi({ id: projectId });
                    if (response?.error === false) {
                        toast.success(t(response?.message));
                        fetchUserProjects(); // Refresh the list
                    }
                } catch (error) {
                    toast.error(t(error?.message) || t("somethingWentWrong"));
                    console.error("Error deleting project:", error);
                }
            }
        });
    };


    const handlePageChange = (page) => {
        setIsPageLoading(true);
        setOffset((page - 1) * limit);
        // Simulate API call
        setTimeout(() => {
            setIsPageLoading(false);
        }, 500);
    };

    // Table columns configuration
    const tableColumns = [
        {
            header: t("listingTitle"),
            accessor: "title",
            align: isRtl ? "right" : "left",
            renderCell: (elem) => (
                <div className="flex items-center space-x-3">
                    <div className="relative p-3">
                        <div className="h-16 w-16 rounded-md overflow-hidden bg-gray-100">
                            <Image
                                src={elem.image}
                                alt={elem.title}
                                width={60}
                                height={60}
                                className="object-cover h-full w-full"
                            />
                        </div>
                    </div>
                    <div>
                        <div className="font-medium">{truncate(elem.translated_title || elem.title, 25)}</div>
                        {elem?.is_promoted ?
                            <span className="primaryColor font-bold flex items-center">
                                {t("featured")}
                            </span> : null}
                        <div className="text-sm text-gray-500">
                            <div className="flex items-center gap-2">
                                {elem.city}, {elem.state}, {elem.country}
                            </div>
                        </div>
                    </div>
                </div>
            ),
        },
        {
            header: t("category"),
            accessor: "category",
            align: "center",
            renderCell: (elem) => (
                <span className="capitalize px-3 py-1.5 rounded-lg text-sm">
                    {elem.category?.translated_name || elem.category?.category || '-'}
                </span>
            ),
        },
        {
            header: t("type"),
            accessor: "type",
            align: "center",
            renderCell: (elem) => (
                <span className={`capitalize px-3 py-1.5 rounded-lg text-sm ${elem.type === 'upcoming'
                    ? 'primarySellText primarySellBg'
                    : 'primaryRentText primaryRentBg'
                    }`}>
                    {t(elem.type)}
                </span>
            ),
        },
        {
            header: t("postedOn"),
            accessor: "created_at",
            align: "center",
            renderCell: (elem) => (
                <span className="text-sm text-gray-600">
                    {elem?.posted_since}
                </span>
            ),
        },
        {
            header: t("adminStatus"),
            accessor: "request_status",
            align: "center",
            renderCell: (elem) => (
                <div className="flex items-center justify-center gap-2">
                    {renderStatusBadge(elem.request_status, t)}
                    {elem.request_status === 'rejected' && <RejectionTooltip reason={elem?.reject_reason?.reason} t={t} />}
                </div>
            ),
        },
        {
            header: t("projectStatus"),
            accessor: "status",
            align: "center",
            renderCell: (elem) => (
                <div className="flex justify-center items-center rtl:gap-2">
                    <Switch
                        checked={elem.status === 1 && elem?.request_status !== "pending"}
                        onCheckedChange={() => handleStatusToggle(elem.id, elem.status)}
                        disabled={elem.request_status === "pending" || elem.request_status === "rejected"}
                        className={`${elem.status === 1 && elem?.request_status !== "pending" ? "!primaryBg" : "!bg-[#28252566]"} rounded-[100px]
                          h-4 w-8 transition-colors duration-300 sm:h-5 sm:w-10 [&>span]:h-2.5 [&>span]:w-2.5 ${isRtl ? "data-[state=checked]:[&>span]:-translate-x-4" : "data-[state=checked]:[&>span]:translate-x-4"} sm:[&>span]:h-3 sm:[&>span]:w-3 ${isRtl ? "sm:data-[state=checked]:[&>span]:-translate-x-5" : "sm:data-[state=checked]:[&>span]:translate-x-5"}`}
                    />
                    <span className={`ml-2 text-sm ${elem.status === 1 && elem?.request_status !== "pending" ? "primaryColor" : "secondryTextColor"} capitalize`}>
                        {elem.status === 1 && elem?.request_status !== "pending" ? t("active") : t("deactive")}
                    </span>
                </div>
            ),
        },
        {
            header: t("action"),
            accessor: "id",
            align: "center",
            renderCell: (elem, rowIndex) => {
                const isLastRow = rowIndex === projects.length - 1;
                return (
                    <div className="flex justify-center items-center gap-2">
                        <Button size="sm" variant="outline" className="bg-transparent h-8 w-8 p-0" onClick={() => router.push(`/${locale}/my-project/${elem.slug_id}`)}>
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
                                    <NavigationMenuTrigger className="primaryRentBg primaryRentText [&_svg.lucide]:hidden hover:primaryRentBg data-[state=open]:!primaryRentBg data-[state=open]:!primaryRentText hover:primaryRentText data-[state=active]:!primaryRentBg data-[state=active]:!primaryRentText p-3 focus:primaryRentBg focus:primaryRentText">
                                        <BsThreeDotsVertical className="h-4 w-4" />
                                    </NavigationMenuTrigger>
                                    <NavigationMenuContent className="grid !w-[150px] gap-1 relative z-[9999]">
                                        {/* Edit option - only show if status is 1 */}
                                        {elem.request_status !== "pending" && (
                                            <NavigationMenuLink
                                                onClick={() => handleClickEdit(elem.slug_id)}
                                                className='rtl:text-start px-3 py-2 flex justify-start items-center gap-2 bg-white hover:primaryBgLight hover:primaryColor hover:cursor-pointer'
                                            >
                                                <AiOutlineEdit />{t("edit")}
                                            </NavigationMenuLink>
                                        )}

                                        {/* Feature option - show if not pending and feature is available */}
                                        {elem.request_status !== "pending" && elem?.is_feature_available && (
                                            <NavigationMenuLink
                                                onClick={(e) => handleFeatureClick(e, elem.id)}
                                                className='rtl:text-start px-3 py-2 flex justify-start items-center gap-2 bg-white hover:primaryBgLight hover:primaryColor hover:cursor-pointer'
                                            >
                                                <FaCrown />
                                                {t("featured")}
                                            </NavigationMenuLink>
                                        )}

                                        {/* Delete option - always show */}
                                        <NavigationMenuLink
                                            onClick={() => handleClickDelete(elem?.id)}
                                            className='rtl:text-start px-3 py-2 flex justify-start items-center gap-2 bg-white hover:primaryBgLight hover:primaryColor hover:cursor-pointer'
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


    return (
        <div className="space-y-4 p-2 md:p-0">
            <h1 className="text-2xl font-semibold">{t("myProjects")}</h1>

            <div className="bg-white rounded-lg">
                {(isLoading || isPageLoading) ? (
                    <TableLoadingSkeleton itemLength={limit} />
                ) : (
                    <ReusableTable
                        parentClassName="rounded-tl-xl rounded-tr-xl overflow-visible [&>div]:overflow-visible"
                        columns={tableColumns}
                        data={projects}
                        loading={false}
                        emptyMessage={t("noDataAvailable")}
                    />
                )}

                {/* Pagination */}
                {!isPageLoading && !isLoading && total > limit && <div className={`transition-opacity duration-200 ${isPageLoading ? 'opacity-0' : 'opacity-100'}`}>
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
    );
};

export default UserProjects;