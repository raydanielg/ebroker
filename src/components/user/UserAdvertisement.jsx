"use client"
import React, { useState, useEffect } from 'react'
import ReusableTable from '@/components/ui/reusable-table'
import { Button } from '../ui/button'
import { Eye } from 'lucide-react'
import { useTranslation } from '../context/TranslationContext'
import Image from 'next/image'
import { getFeaturedDataApi } from '@/api/apiRoutes'
import { Skeleton } from "@/components/ui/skeleton"
import CustomLink from '../context/CustomLink'
import CustomPagination from '@/components/ui/custom-pagination'
import { useRouter } from 'next/router'
import { MdRemoveRedEye } from 'react-icons/md'
import { useSelector } from 'react-redux'
import { getFormattedDate, isRTL } from '@/utils/helperFunction'

// Table skeleton loading component
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
                    {/* Listing Title */}
                    <div className="flex items-center gap-3">
                        <Skeleton className="h-12 w-12 rounded-md" />
                        <div className="space-y-2">
                            <Skeleton className="h-4 w-24" />
                            <Skeleton className="h-3 w-20" />
                        </div>
                    </div>

                    {/* Other columns */}
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-6 w-16 rounded-full" />
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-4 w-20" />
                    <div className="flex justify-end">
                        <Skeleton className="h-8 w-8 rounded-md" />
                    </div>
                </div>
            </div>
        ))}
    </div>
)

const UserAdvertisement = () => {
    const t = useTranslation()
    const router = useRouter()
    const { tab } = router?.query || {}
    const language = useSelector((state) => state.LanguageSettings?.active_language);
    const isRtl = isRTL()

    const [activeTab, setActiveTab] = useState(tab || "property")
    const [currentPage, setCurrentPage] = useState(1)
    const [advertisements, setAdvertisements] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [total, setTotal] = useState(0)
    const itemsPerPage = 5
    const [isPageLoading, setIsPageLoading] = useState(false)

    useEffect(() => {
        setCurrentPage(1)
    }, [activeTab])

    useEffect(() => {
        if (tab === "property") {
            setActiveTab("property")
        } else if (tab === "project") {
            setActiveTab("project")
        }
    }, [tab])

    const fetchAdvertisement = async () => {
        try {
            // Don't show full loading state for pagination
            if (!isPageLoading) {
                setLoading(true);
            }
            setError(null);

            const response = await getFeaturedDataApi({
                type: activeTab === "property" ? "property" : "project",
                limit: itemsPerPage,
                offset: (currentPage - 1) * itemsPerPage
            });

            if (!response.error) {
                setTotal(response.total);
                // Smooth transition for data update
                setTimeout(() => {
                    setAdvertisements(response.data);
                    setIsPageLoading(false);
                    setLoading(false);
                }, 300);
            } else {
                setError(response.message || 'Failed to fetch data');
                setIsPageLoading(false);
                setLoading(false);
            }
        } catch (error) {
            console.error('Error fetching advertisements:', error);
            setError('An unexpected error occurred');
            setIsPageLoading(false);
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchAdvertisement()
    }, [activeTab, currentPage, language])

    const getStatusBadge = (status) => {
        switch (status) {
            case 0:
                return 'status-badge-approved'
            case 1:
                return 'status-badge-pending'
            case 2:
                return 'status-badge-rejected'
            case 3:
                return 'bg-red-50 text-red-600'
            default:
                return ''
        }
    }

    const getStatusText = (status) => {
        switch (status) {
            case 0:
                return t("active")
            case 1:
                return t("pending")
            case 2:
                return t("rejected")
            case 3:
                return t("expired")
            default:
                return ''
        }
    }

    // Table columns configuration
    const tableColumns = [
        {
            header: t("listingTitle"),
            accessor: "property",
            align: isRtl ? "right" : "left",
            renderCell: (elem) => {
                const item = elem.project || elem.property;
                if (!item) return null;

                return (
                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <div className="h-12 w-12 rounded-md overflow-hidden bg-gray-100">
                                <Image
                                    src={item.image || item.title_image || '/placeholder.jpg'}
                                    alt={item.title}
                                    width={48}
                                    height={48}
                                    className="object-cover h-full w-full"
                                    onError={(e) => {
                                        e.target.src = '/placeholder.jpg'
                                    }}
                                />
                            </div>
                        </div>
                        <div>
                            <div className="font-medium text-gray-900 rtl:text-start">{item.translated_title || item.title}</div>
                            <div className="text-xs text-gray-500 rtl:text-start">
                                {[item.city, item.state, item.country].filter(Boolean).join(", ")}
                            </div>
                        </div>
                    </div>
                );
            },
        },
        {
            header: t("status"),
            accessor: "status",
            align: "left",
            renderCell: (elem) => (
                <span className={`inline-flex px-3 py-1 text-xs font-medium rounded-full ${getStatusBadge(elem?.status)}`}>
                    {getStatusText(elem?.status)}
                </span>
            ),
        },
        {
            header: t("featuredOn"),
            accessor: "start_date",
            align: "left",
            renderCell: (elem) => {
                try {
                    return (
                        <span className="text-sm text-gray-600">
                            {getFormattedDate(elem.start_date, t)}
                        </span>
                    );
                } catch (error) {
                    return '-';
                }
            },
        },
        {
            header: t("expiryDate"),
            accessor: "end_date",
            align: "left",
            renderCell: (elem) => {
                try {
                    return (
                        <span className="text-sm text-gray-600">
                            {getFormattedDate(elem.end_date, t)}
                        </span>
                    );
                } catch (error) {
                    return '-';
                }
            },
        },
        {
            header: t("action"),
            accessor: "slug",
            align: "center",
            renderCell: (elem) => {
                const itemData = activeTab === "property" ? elem?.property : elem?.project
                const path = activeTab === "property" ? `/my-property/${itemData?.slug_id}` : `/my-project/${itemData?.slug_id}`

                return (
                    <CustomLink href={path}>
                        <Button size="sm" variant="outline" className="bg-transparent h-8 w-8 p-0">
                            <MdRemoveRedEye className="h-4 w-4" />
                        </Button>
                    </CustomLink>
                )
            },
        },
    ]

    return (
        <div className="space-y-4 p-2 md:p-0">
            <h1 className="text-2xl font-semibold">{t("myAdvertisement")}</h1>

            <div className="bg-white">
                <div className="border-b">
                    <div className="flex">
                        <CustomLink
                            href={`/user/advertisement?tab=property`}
                            className={`relative px-6 py-3 rounded-none border-b-2 ${activeTab === "property"
                                ? "primaryBorderColor primaryColor"
                                : "border-transparent text-gray-500 hover:text-gray-700"
                                }`}
                        >
                            {t("myProperties")}
                        </CustomLink>
                        <CustomLink
                            href={`/user/advertisement?tab=project`}
                            className={`relative px-6 py-3 rounded-none border-b-2 ${activeTab === "project"
                                ? "primaryBorderColor primaryColor"
                                : "border-transparent text-gray-500 hover:text-gray-700"
                                }`}
                        >
                            {t("myProjects")}
                        </CustomLink>
                    </div>
                </div>

                <div className="relative">
                    {activeTab === "property" && (
                        <div className="mt-0">
                            {(loading || isPageLoading) ? (
                                <TableLoadingSkeleton itemLength={itemsPerPage} />
                            ) : (
                                <ReusableTable
                                    tableClassName="!rounded-none"
                                    columns={tableColumns}
                                    data={advertisements}
                                    loading={false}
                                    emptyMessage={error || t("noDataAvailable")}
                                />
                            )}
                        </div>
                    )}

                    {activeTab === "project" && (
                        <div className="mt-0">
                            {(loading || isPageLoading) ? (
                                <TableLoadingSkeleton itemLength={itemsPerPage} />
                            ) : (
                                <ReusableTable
                                    columns={tableColumns}
                                    data={advertisements}
                                    loading={false}
                                    emptyMessage={error || t("noDataAvailable")}
                                />
                            )}
                        </div>
                    )}

                    {!loading && !isPageLoading && (total > itemsPerPage) && <div className={`transition-opacity duration-200 ${isPageLoading ? 'opacity-50' : 'opacity-100'}`}>
                        <CustomPagination
                            currentPage={currentPage}
                            totalItems={total}
                            itemsPerPage={itemsPerPage}
                            onPageChange={(page) => {
                                setIsPageLoading(true);
                                setCurrentPage(page);
                            }}
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
    )
}

export default UserAdvertisement