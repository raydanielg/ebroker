import { getInterestedUsersApi } from '@/api/apiRoutes'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import CustomPagination from '@/components/ui/custom-pagination'
import ReusableTable from "@/components/ui/reusable-table"
import { Skeleton } from "@/components/ui/skeleton"
import Image from "next/image"
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useTranslation } from '../context/TranslationContext'
import Link from 'next/link'

// Table loading skeleton component
const TableLoadingSkeleton = ({ itemLength }) => (
    <div className="w-full">
        {/* Table Header Skeleton */}
        <div className="bg-gray-50 border-y">
            <div className="grid grid-cols-5 px-6 py-4">
                {['w-10', 'w-40', 'w-40', 'w-40', 'w-40'].map((width, i) => (
                    <Skeleton key={i} className={`h-4 ${width}`} />
                ))}
            </div>
        </div>

        {/* Table Rows Skeleton */}
        {[...Array(Number(itemLength))].map((_, rowIndex) => (
            <div key={rowIndex} className="border-b px-6 py-4">
                <div className="grid grid-cols-5 gap-4 items-center">
                    <Skeleton className="h-4 w-10" />
                    <div className="flex items-center space-x-3">
                        <Skeleton className="h-10 w-10 rounded-full" />
                        <Skeleton className="h-4 w-32" />
                    </div>
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-4 w-40" />
                    <Skeleton className="h-4 w-28" />
                </div>
            </div>
        ))}
    </div>
);

const InterestedUsersTable = ({ params }) => {
    const router = useRouter()
    const t = useTranslation()
    const { locale, slug } = router?.query
    // Get propertySlug from the params passed through UserRoot component
    const projectSlug = params?.[0] || slug?.split('/')[1]
    const userData = useSelector(state => state.User?.data)
    const webSettings = useSelector(state => state.WebSetting?.data)

    const [limit, setLimit] = useState(10)
    const [offset, setOffset] = useState(0)
    const [interestedUsers, setInterestedUsers] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const [isPageLoading, setIsPageLoading] = useState(false)
    const [total, setTotal] = useState(0)

    const fetchInterestedUsers = async () => {
        try {
            if (!isPageLoading) {
                setIsLoading(true)
            }

            const res = await getInterestedUsersApi({
                slug_id: projectSlug,
                limit: limit.toString(),
                offset: offset.toString()
            })

            if (!res?.error) {
                setInterestedUsers(res?.data || [])
                setTotal(res?.total || 0)
            }
        } catch (error) {
            console.error("Error fetching interested users", error)
        } finally {
            setIsLoading(false)
            setIsPageLoading(false)
        }
    }

    useEffect(() => {
        if (projectSlug) {
            fetchInterestedUsers()
        }
    }, [projectSlug, offset, limit])

    // Handle page change for pagination
    const handlePageChange = (page) => {
        setIsPageLoading(true)
        setOffset((page - 1) * limit)
    }

    // Define table columns configuration
    const tableColumns = [
        {
            header: "ID",
            accessor: "id",
            align: "center",
        },
        {
            header: t("Profile"),
            accessor: "profile",
            align: "center",
            renderCell: (user) => (
                <div className="flex justify-center items-center space-x-3">
                    <Avatar className="h-10 w-10">
                        <AvatarImage src={user?.profile || ""} alt={user?.name || "User"} />
                        <AvatarFallback>{user?.name ? user?.name?.charAt(0) : "U"}</AvatarFallback>
                    </Avatar>
                </div>
            ),
        },
        {
            header: t("Name"),
            accessor: "name",
            align: "center",
        },
        {
            header: t("Email"),
            accessor: "email",
            align: "center",
            renderCell: (user) => (
                <Link href={`mailto:${user?.email}`} className="text-center">
                    {user?.email}
                </Link>
            )
        },
        {
            header: t("Mobile No"),
            accessor: "mobile",
            align: "center",
            renderCell: (user) => (
                <Link href={`tel:${user?.mobile}`} className="text-center">
                    {user?.mobile}
                </Link>
            )
        },
    ];

    return (
        <div className="overflow-y-auto">
            <h1 className="text-2xl font-medium py-6">{t("Interested Users Details")}</h1>
            <div className="bg-white rounded-lg">

                {(isLoading || isPageLoading) ? (
                    <TableLoadingSkeleton itemLength={limit} />
                ) : (
                    <ReusableTable
                        columns={tableColumns}
                        data={interestedUsers}
                        loading={false}
                        emptyMessage={t("noDataAvailable")}
                    />
                )}

                {/* Pagination */}
                <div className={`transition-opacity duration-200 ${isPageLoading ? 'opacity-50' : 'opacity-100'}`}>
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
                </div>
            </div>
        </div>
    )
}

export default InterestedUsersTable