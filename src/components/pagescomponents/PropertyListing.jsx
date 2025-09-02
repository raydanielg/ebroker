"use client";

import React, { useState } from 'react';
import { useTranslation } from '@/components/context/TranslationContext';
import PropertyHorizontalCard from '../cards/PropertyHorizontalCard';
import PropertyVerticalNewCard from '../cards/PropertyVerticalNewCard';
import FilterTopBar from '../reusable-components/FilterTopBar';
import NoDataFound from '../no-data-found/NoDataFound';

const PropertyListing = ({
    properties = [],
    totalCount = 0,
    onOpenFilters,
    hasActiveFilters,
    viewType,
    setViewType
}) => {
    const t = useTranslation();
    const [sortBy, setSortBy] = useState('newest');
    return (
        <div className="flex flex-col gap-4">
            {/* Filter Top Bar */}
            {/* <FilterTopBar
                itemCount={properties.length}
                totalItems={totalCount}
                viewType={viewType}
                setViewType={setViewType}
                sortBy={sortBy}
                setSortBy={setSortBy}
                onOpenFilters={onOpenFilters}
                showFilterButton={true}
            /> */}

            {/* Scrollable content area with appropriate padding top */}
            <div className={`${viewType === 'grid' ? 'grid place-items-center grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'grid grid-cols-1 gap-6'}`}>
                {properties.length > 0 ? (
                    properties.map((property, index) => (
                        viewType === 'list'
                            ?
                            <div key={property.id || index} className='w-full'>
                                <PropertyHorizontalCard property={property} />
                            </div>
                            :
                            <PropertyVerticalNewCard key={property.id || index} property={property} />
                    ))
                ) : (
                    <div className="text-center flex items-center py-16 col-span-full">
                        <NoDataFound
                            title={t('noPropertiesFound')}
                        />
                    </div>
                )}
            </div>
        </div>
    );
};

export default PropertyListing;
