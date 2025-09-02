import React, { useState } from 'react';
import { motion, AnimatePresence } from "framer-motion";
import { Button } from './button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { isRTL } from '@/utils/helperFunction';

const numberVariants = {
    enter: (direction) => ({
        x: direction > 0 ? 15 : -15,
        opacity: 0,
        scale: 0.8
    }),
    center: {
        x: 0,
        opacity: 1,
        scale: 1
    },
    exit: (direction) => ({
        x: direction < 0 ? 15 : -15,
        opacity: 0,
        scale: 0.8
    })
};

const isRtl = isRTL();
const CustomPagination = ({
    currentPage = 1,
    totalItems = 0,
    itemsPerPage = 10,
    onPageChange,
    isLoading = false,
    showItemsInfo = true,
    className = "",
    translations = {
        showing: "Showing",
        to: "to",
        of: "of",
        entries: "entries"
    }
}) => {
    const [[page, direction], setPage] = useState([0, 0]);
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const startItem = (currentPage - 1) * itemsPerPage + 1;
    const endItem = Math.min(currentPage * itemsPerPage, totalItems);

    const handlePageChange = (newPage) => {
        if (newPage === currentPage || isLoading) return;
        setPage([page + 1, newPage > currentPage ? 1 : -1]);
        onPageChange(newPage);
    };

    const getPageNumbers = () => {
        const pageNumbers = [];
        const maxVisiblePages = 5;

        if (totalPages <= maxVisiblePages) {
            for (let i = 1; i <= totalPages; i++) {
                pageNumbers.push(i);
            }
        } else {
            pageNumbers.push(1);

            if (currentPage <= 3) {
                for (let i = 2; i <= 4; i++) {
                    pageNumbers.push(i);
                }
                pageNumbers.push('...');
                pageNumbers.push(totalPages);
            } else if (currentPage >= totalPages - 2) {
                pageNumbers.push('...');
                for (let i = totalPages - 3; i <= totalPages; i++) {
                    pageNumbers.push(i);
                }
            } else {
                pageNumbers.push('...');
                pageNumbers.push(currentPage - 1);
                pageNumbers.push(currentPage);
                pageNumbers.push(currentPage + 1);
                pageNumbers.push('...');
                pageNumbers.push(totalPages);
            }
        }

        return pageNumbers;
    };

    if (totalItems <= 0) return null;

    return (
        <div className={`flex flex-col sm:flex-row gap-3 items-center justify-between px-6 py-3 border-t ${className}`}>
            {showItemsInfo && (
                <div className="text-sm text-gray-500">
                    {translations.showing} {startItem} {translations.to} {endItem} {translations.of} {totalItems} {translations.entries}
                </div>
            )}
            <div className={`flex items-center gap-1 ${!showItemsInfo ? 'mx-auto' : ''}`}>
                <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8 p-0"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1 || isLoading}
                >
                    <ChevronLeft className="h-4 w-4 rtl:rotate-180" />
                </Button>

                <div className="flex items-center gap-1">
                    {getPageNumbers().map((pageNumber, index) => {
                        if (pageNumber === '...') {
                            return (
                                <span
                                    key={`ellipsis-${index}`}
                                    className="px-2 text-gray-500"
                                >
                                    ...
                                </span>
                            );
                        }

                        return (
                            <div key={`page-${pageNumber}`} className="relative h-8 w-8">
                                <AnimatePresence mode="wait" custom={direction}>
                                    <motion.div
                                        key={pageNumber}
                                        custom={direction}
                                        variants={numberVariants}
                                        initial="enter"
                                        animate="center"
                                        exit="exit"
                                        transition={{
                                            x: { type: "spring", stiffness: 300, damping: 30 },
                                            opacity: { duration: 0.2 },
                                            scale: { duration: 0.2 }
                                        }}
                                        className="absolute inset-0"
                                    >
                                        <Button
                                            variant={currentPage === pageNumber ? "default" : "outline"}
                                            size="icon"
                                            className={`h-8 w-8 p-0 ${currentPage === pageNumber
                                                ? 'bg-black text-white hover:bg-black/90'
                                                : ''
                                                }`}
                                            onClick={() => handlePageChange(pageNumber)}
                                            disabled={isLoading}
                                        >
                                            {pageNumber}
                                        </Button>
                                    </motion.div>
                                </AnimatePresence>
                            </div>
                        );
                    })}
                </div>

                <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8 p-0"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages || isLoading}
                >
                    <ChevronRight className="h-4 w-4 rtl:rotate-180" />
                </Button>
            </div>
        </div>
    );
};

export default CustomPagination; 