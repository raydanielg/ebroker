"use client"
import React from 'react'
import { FiGrid, FiList } from 'react-icons/fi'
import { FaFilter } from 'react-icons/fa'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useTranslation } from '@/components/context/TranslationContext'
import { Button } from '@/components/ui/button'
import { IoFilterSharp } from 'react-icons/io5'

const FilterTopBar = ({
    itemCount = 0,
    totalItems = 0,
    viewType = 'grid',
    setViewType,
    sortBy = 'newest',
    setSortBy,
    onOpenFilters,
    showFilterButton = true,
    showItemCount = true,
    showSortBy = true,
    showViewToggle = true,
}) => {
    // Translation hook for localization
    const t = useTranslation()

    // Handle sort change
    const handleSortChange = (value) => {
        setSortBy(value)
    }

    return (
        <div className="w-full flex flex-row justify-between items-center gap-4 p-4 bg-white rounded-lg border cardBorder mb-4">
            {/* Left side: Property Count */}
            {showItemCount && (
                <div className="text-gray-700 font-medium">
                    <span className="text-sm md:text-base brancColor font-bold">
                        {itemCount > 0
                            ? `${t("showing")} 1-${itemCount} ${t("of")} ${totalItems} ${t("results")}`
                            : t("noResultsFound") || "No results found"
                        }
                    </span>
                </div>
            )}

            {/* Right side: Filter Button, Sort and View Type */}
            <div className="flex flex-row justify-between sm:justify-end items-center gap-4">
                {/* Filter Button - Visible based on prop */}
                {showFilterButton && onOpenFilters && (
                    <Button
                        variant="outline"
                        onClick={onOpenFilters}
                        className="flex items-center gap-2 xl:hidden"
                        aria-label={t("filterProperties")}
                    >
                        <IoFilterSharp className="w-4 h-4" />
                        <span>{t("filter")}</span>
                    </Button>
                )}

                {/* Sort By Dropdown */}
                {showSortBy && (
                    <div className="flex justify-evenly items-center gap-3 min-w-[120px]">
                        <span className="text-sm text-nowrap md:text-base brandColor font-medium w-full">
                            {t("sortBy")} :
                        </span>
                        <Select value={sortBy} onValueChange={handleSortChange}>
                            <SelectTrigger className="w-full min-w-[165px] flex gap-2 bg-white focus:ring-0 max-w-min">
                                <SelectValue placeholder={t("sortBy")} />
                            </SelectTrigger>
                            <SelectContent className='max-w-max'>
                                <SelectItem value="newest">{t("newest")}</SelectItem>
                                <SelectItem value="oldest">{t("oldest")}</SelectItem>
                                <SelectItem value="price_high">{t("priceHighToLow")}</SelectItem>
                                <SelectItem value="price_low">{t("priceLowToHigh")}</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                )}

                {/* View Type Switcher */}
                {showViewToggle && (
                    <div className="hidden sm:flex items-center gap-2 overflow-hidden">
                        <button
                            className={`p-2 rounded group ${viewType === 'grid' ? 'primaryBg text-white' : 'bg-white text-gray-400'} hover:primaryBg border cardBorder`}
                            onClick={() => setViewType('grid')}
                            aria-label={t("gridView") || "Grid View"}
                        >
                            <FiGrid className='w-5 h-5 group-hover:text-white' />
                        </button>
                        <button
                            className={`p-2 rounded group ${viewType === 'list' ? 'primaryBg text-white' : 'bg-white text-gray-400'} hover:primaryBg border cardBorder`}
                            onClick={() => setViewType('list')}
                            aria-label={t("listView") || "List View"}
                        >
                            <FiList className='w-5 h-5 group-hover:text-white' />
                        </button>
                    </div>
                )}
            </div>
        </div>
    )
}

export default FilterTopBar