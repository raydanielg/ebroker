'use client';

import { useState, useCallback, useMemo } from 'react';
import mapIcon from '@/assets/mapIcon.svg';
import PropertyOnMapView from '../google-maps/PropertyOnMapView';
import { useSelector } from 'react-redux';
import CustomLink from '../context/CustomLink';
import { MdArrowForward } from 'react-icons/md';
import { useTranslation } from '../context/TranslationContext';
import { isRTL } from '@/utils/helperFunction';

// Map container style
const containerStyle = {
    width: '100%',
    height: '600px',
    borderRadius: '1rem'
};

const HomePropertiesOnMap = ({
    translated_title,
    title = "Find Homes, Apartments & More with Real-Time Listings on the Map",
    data = [],
    label = "exploreOnMap"
}) => {
    const t = useTranslation();
    const [selectedProperty, setSelectedProperty] = useState(null);
    const [map, setMap] = useState(null);
    const [isMapLoaded, setIsMapLoaded] = useState(false);
    const location = useSelector(state => state.location);
    const isRtl = isRTL();
    const webSettings = useSelector(state => {
        if (!state || !state.WebSetting) {
            return null;
        }
        return state.WebSetting.data;
    });

    // Bhuj coordinates
    const defaultCenter = {
        lat: Number(location?.latitude || webSettings?.latitude),
        lng: Number(location?.longitude || webSettings?.longitude),
    };
    // Create map icon config
    const iconConfig = useMemo(() => {
        if (!mapIcon?.src) return null;

        return {
            url: mapIcon.src,
            scaledSize: { width: 33, height: 48 }
        };
    }, [mapIcon?.src]);

    // Handle marker click
    const handleMarkerClick = (property) => {
        setSelectedProperty(property);
    };

    // Handle close InfoWindow
    const handleInfoWindowClose = () => {
        setSelectedProperty(null);
    };

    // Load callback function
    const onLoad = useCallback((map) => {
        setMap(map);
        setIsMapLoaded(true);

    }, []);

    // Unload callback function
    const onUnmount = useCallback(() => {
        setMap(null);
        setIsMapLoaded(false);
    }, []);
    if (data?.length === 0) {
        return null;
    }
    return (
        <div className="relative bg-black text-white">
            <div className="container mx-auto px-4 py-6 sm:py-6 md:py-12 lg:py-[60px]">
                {/* Header section */}
                <div className="flex flex-col gap-6 md:gap-12">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center h-full">
                        <div className="flex items-center justify-between w-full">
                            <h2 className="text-xl md:text-3xl font-bold max-w- mb-0 max-w-xl">{translated_title || title}</h2>
                            <CustomLink
                                href="/properties-on-map"
                                className="hidden md:flex text-xl justify-center items-center gap-2 bg-white brandColor border brandBorder hover:bg-gray-50 rounded-lg px-3 py-2 md:px-4 md:py-3 font-normal transition-colors duration-300">
                                {t(label)}
                                <MdArrowForward className={`flex-shrink-0 ${isRtl ? "rotate-180" : ""}`} />
                            </CustomLink>
                        </div>
                    </div>
                    {/* Map container */}
                    <div className="w-full min-h-[400px] md:h-[600px] rounded-2xl overflow-hidden relative shadow-lg">
                        <PropertyOnMapView
                            containerStyle={containerStyle}
                            defaultCenter={defaultCenter}
                            onLoad={onLoad}
                            onUnmount={onUnmount}
                            isMapLoaded={isMapLoaded}
                            selectedProperty={selectedProperty}
                            handleMarkerClick={handleMarkerClick}
                            handleInfoWindowClose={handleInfoWindowClose}
                            iconConfig={iconConfig}
                            data={data}
                        />
                    </div>
                </div>
                <CustomLink
                    href="/properties-on-map"
                    className="flex mt-12 md:hidden w-fit mx-auto text-lg justify-center items-center gap-2 bg-white brandColor border brandBorder hover:bg-gray-50 rounded-lg px-4 py-3 font-normal transition-colors duration-300">
                    {t(label)}
                    <MdArrowForward className={`flex-shrink-0 ${isRtl ? "rotate-180" : ""}`} />
                </CustomLink>
            </div>
        </div>
    );
};

export default HomePropertiesOnMap;
