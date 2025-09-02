"use client"

import React, { useState } from 'react'
import { FiGrid, FiList } from 'react-icons/fi'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useTranslation } from '@/components/context/TranslationContext'

const ArticleTopFilter = ({
    itemCount = 16,
    totalItems = 53,
    viewType = 'grid',
    setViewType,
    sortBy = 'newest',
    setSortBy,
}) => {
    // Translation hook for localization
    const t = useTranslation()

    // Handle sort change
    const handleSortChange = (value) => {
        setSortBy(value)
    }

    return (
        <div className="w-full flex flex-col sm:flex-row justify-between items-center gap-4 p-3 bg-white rounded-lg shadow-sm border cardBorder">
            {/* Left side: Property Count */}
            <div className="text-gray-700 font-medium">
                {itemCount > 0
                    ? `${itemCount} ${t("propertiesFound") || "Properties Found"} ${totalItems > itemCount ? `${t("of") || "of"} ${totalItems}` : ''}`
                    : t("noPropertiesFoundShort") || "No properties found"
                }
            </div>

            {/* Right side: Sort and View Type */}
            <div className="flex items-center gap-4 ">
                {/* Sort By Dropdown */}
                <div className="min-w-[120px]">
                    <Select value={sortBy} onValueChange={handleSortChange}>
                        <SelectTrigger className="w-full bg-white focus:ring-0">
                            <SelectValue placeholder={t("sortBy") || "Sort By"} />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="newest">{t("newest") || "Newest"}</SelectItem>
                            <SelectItem value="oldest">{t("oldest") || "Oldest"}</SelectItem>
                            <SelectItem value="price_high">{t("priceHighToLow") || "Price: High to Low"}</SelectItem>
                            <SelectItem value="price_low">{t("priceLowToHigh") || "Price: Low to High"}</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {/* View Type Switcher */}
                <div className="flex items-center border rounded overflow-hidden">
                    <button
                        className={`p-2 ${viewType === 'grid' ? 'bg-gray-900 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
                        onClick={() => setViewType('grid')}
                        aria-label={t("gridView") || "Grid View"}
                    >
                        <FiGrid size={18} />
                    </button>
                    <button
                        className={`p-2 ${viewType === 'list' ? 'bg-gray-900 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
                        onClick={() => setViewType('list')}
                        aria-label={t("listView") || "List View"}
                    >
                        <FiList size={18} />
                    </button>
                </div>
            </div>
        </div>
    )
}

export default ArticleTopFilter