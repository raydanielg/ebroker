"use client";

import { useState, useEffect } from 'react';
import { useTranslation } from '../context/TranslationContext';
import { Skeleton } from '@/components/ui/skeleton';
import CustomPagination from '@/components/ui/custom-pagination';
import { FaBell } from 'react-icons/fa';
import { getNotificationListApi } from '@/api/apiRoutes';
import ImageWithPlaceholder from '../image-with-placeholder/ImageWithPlaceholder';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

// Loading skeleton component for notifications
const NotificationSkeleton = ({ count = 3 }) => (
    <TableBody>
        {Array(count).fill(0).map((_, index) => (
            <TableRow key={index}>
                <TableCell className="py-4 px-2 sm:p-6">
                    <div className="flex items-start gap-2 sm:gap-4">
                        <Skeleton className="h-14 w-14 sm:h-20 sm:w-20 rounded-md" />
                        <div className="space-y-2 flex-1">
                            <Skeleton className="h-4 w-20 sm:w-36" />
                            <Skeleton className="h-3 w-full max-w-[200px] sm:max-w-[350px]" />
                        </div>
                    </div>
                </TableCell>
                <TableCell className="text-right py-4 px-2 sm:p-6 align-top">
                    <Skeleton className="h-4 w-16 sm:w-24 ml-auto" />
                </TableCell>
            </TableRow>
        ))}
    </TableBody>
);

const UserNotifications = () => {
    const t = useTranslation();
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const [isPageLoading, setIsPageLoading] = useState(false);
    const itemsPerPage = 10;

    // Fetch notifications
    const fetchNotifications = async () => {
        try {
            setError(null);
            if (!isPageLoading) {
                setLoading(true);
            }
            const response = await getNotificationListApi({
                limit: itemsPerPage,
                offset: (currentPage - 1) * itemsPerPage
            });
            if (response && !response.error) {
                setNotifications(response.data || []);
                // Make sure we're setting the total items from the correct property
                setTotalItems(response.total || 0);
            } else {
                setError(response?.message || t("failedToFetchNotifications"));
            }
        } catch (error) {
            console.error("Error fetching notifications:", error);
            setError(t("somethingWentWrong"));
        } finally {
            setLoading(false);
            setIsPageLoading(false);
        }
    };

    useEffect(() => {
        fetchNotifications();
    }, [currentPage]);

    // Function to handle page change
    const handlePageChange = (page) => {
        setIsPageLoading(true);
        setCurrentPage(page);
    };

    // Helper to format date using native JavaScript
    const formatDate = (dateString) => {
        try {
            const date = new Date(dateString);

            // Check if date is valid
            if (isNaN(date.getTime())) {
                return dateString;
            }

            // Format: dd MMM yyyy (e.g., "15 Jan 2024")
            const day = date.getDate().toString().padStart(2, '0');
            const month = date.toLocaleDateString('en-US', { month: 'long' });
            const year = date.getFullYear();
            return `${day} ${t(month?.toLowerCase())} ${year}`;
        } catch (error) {
            console.error('Error formatting date:', error);
            return dateString;
        }
    };

    return (
        <div className="space-y-2 sm:space-y-4 w-full">
            <h1 className="text-xl sm:text-2xl font-semibold px-2 sm:px-0">{t("userNotification")}</h1>

            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                <Table>
                    <TableHeader className="bg-gray-50">
                        <TableRow>
                            <TableHead className="font-medium text-xs sm:text-base w-3/4 py-4 px-2 sm:p-6">
                                {t("notifications")}
                            </TableHead>
                            <TableHead className="font-medium text-xs sm:text-base text-center py-4 px-2 sm:p-6 w-1/4 min-w-[80px]">
                                {t("date")}
                            </TableHead>
                        </TableRow>
                    </TableHeader>

                    {loading && !isPageLoading ? (
                        <NotificationSkeleton count={5} />
                    ) : error ? (
                        <TableBody>
                            <TableRow>
                                <TableCell colSpan={2} className="p-6 text-center text-gray-500">
                                    {error}
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    ) : notifications.length === 0 ? (
                        <TableBody>
                            <TableRow>
                                <TableCell colSpan={2} className="p-0">
                                    <div className="flex flex-col items-center justify-center py-12 text-center">
                                        <FaBell className="text-gray-300 h-8 w-8 sm:h-12 sm:w-12 mb-4" />
                                        <p className="text-gray-500">{t("noNotificationsFound")}</p>
                                    </div>
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    ) : (
                        <TableBody className={`transition-opacity duration-200 ${isPageLoading ? 'opacity-50' : 'opacity-100'}`}>
                            {notifications.map((notification, index) => (
                                <TableRow key={index} className="hover:bg-gray-50 transition-colors">
                                    <TableCell className="py-4 px-2 sm:p-6">
                                        <div className="flex items-start gap-2 sm:gap-4">
                                            <div className="flex-shrink-0">
                                                {notification.notification_image ? (
                                                    <ImageWithPlaceholder
                                                        src={notification.notification_image}
                                                        alt={notification.title || "Notification"}
                                                        width={48}
                                                        height={48}
                                                        className="rounded-md h-14 w-14 sm:h-20 sm:w-20 object-cover"
                                                    />
                                                ) : (
                                                    <div className="h-14 w-14 sm:h-20 sm:w-20 rounded-md bg-gray-200 flex items-center justify-center">
                                                        {/* {getNotificationIcon(notification)} */}
                                                        <FaBell size={30} />
                                                    </div>
                                                )}
                                            </div>
                                            <div className="flex-1 min-w-0 max-w-full overflow-hidden">
                                                <p className="font-medium text-sm sm:text-base text-gray-900 truncate break-words">
                                                    {notification.title || t("notification")}
                                                </p>
                                                <p className="text-xs sm:text-sm text-gray-500 mt-1 line-clamp-2 sm:line-clamp-3 break-words">
                                                    {notification.message || notification.description || ""}
                                                </p>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-center py-4 px-2 sm:p-6 text-xs sm:text-sm text-gray-500 align-top whitespace-nowrap">
                                        {formatDate(notification.date || notification.created_at)}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    )}
                </Table>

                {/* Pagination - Integrated directly with the table */}
                {!loading && !error && totalItems > 0 && (
                    <div className="overflow-x-auto">
                        <CustomPagination
                            currentPage={currentPage}
                            totalItems={totalItems}
                            itemsPerPage={itemsPerPage}
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
                )}
            </div>
        </div>
    );
};

export default UserNotifications;