"use client";
import { useState, useRef, useEffect } from "react";
import { Autocomplete, GoogleMap, Marker, Circle } from "@react-google-maps/api";
import { IoLocationOutline } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import { setLocationAction } from "@/redux/slices/locationSlice";
import toast from "react-hot-toast";
import { useTranslation } from "@/components/context/TranslationContext";
import { extractAddressComponents, isRTL } from "@/utils/helperFunction";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog";
import { useIsMobile } from "@/hooks/use-mobile";
import { MdOutlineMyLocation } from "react-icons/md";

const mapContainerStyle = {
    width: "100%",
    height: "100%",
    borderRadius: "0.5rem",
};

const defaultCenter = {
    lat: 23.2530, // Bhuj latitude
    lng: 69.6699, // Bhuj longitude
    radius: 1
};

const LocationSearchWithRadius = ({ isOpen, onClose }) => {
    const t = useTranslation();
    const dispatch = useDispatch();
    const isMobile = useIsMobile();
    const isRtl = isRTL();
    const webSettings = useSelector(state => state.WebSetting?.data);
    const systemSettings = webSettings || {};
    const currentLocation = useSelector(state => state.location);
    const minRadius = systemSettings?.min_radius_range || 1;
    const maxRadius = systemSettings?.max_radius_range || 50;

    const [searchInput, setSearchInput] = useState("");
    const [radius, setRadius] = useState(minRadius);
    const [location, setLocation] = useState({
        lat: Number(webSettings?.latitude) || defaultCenter.lat,
        lng: Number(webSettings?.longitude) || defaultCenter.lng,
        radius: minRadius
    });
    const [address, setAddress] = useState("");
    const [showTooltip, setShowTooltip] = useState(false);
    const [tooltipPosition, setTooltipPosition] = useState("0%");
    const [selectedLocation, setSelectedLocation] = useState(currentLocation || {
        lat: Number(webSettings?.latitude) || defaultCenter.lat,
        lng: Number(webSettings?.longitude) || defaultCenter.lng,
        address: "",
        city: "",
        state: "",
        country: "",
        radius: minRadius
    });
    const [map, setMap] = useState(null);
    const autocompleteRef = useRef(null);
    const sliderRef = useRef(null);
    const mapRef = useRef(null);
    const tooltipRef = useRef(null);


    // Calculate tooltip position for slider
    // function calculateTooltipPosition(value) {
    //     if (!sliderRef.current) return "0%";
    //     const min = parseFloat(sliderRef.current.min);
    //     const max = parseFloat(sliderRef.current.max);
    //     const percent = ((value - min) / (max - min)) * 100;
    //     return `${percent}%`;
    // }

    // useEffect(() => {
    //     setTooltipPosition(calculateTooltipPosition(radius));
    // }, [radius]);


    // Google Maps Geocoder for address lookup
    function fetchAddressFromCoordinates(lat, lng) {
        if (!window.google) return;
        const geocoder = new window.google.maps.Geocoder();
        geocoder.geocode({ location: { lat, lng } }, (results, status) => {
            if (status === "OK" && results[0]) {
                setAddress(results[0].formatted_address);
                setSearchInput(results[0].formatted_address);
                const data = extractAddressComponents(results[0]);
                setSelectedLocation({ lat, lng, address: results[0].formatted_address, city: data.city, state: data.state, country: data.country });
            } else {
                setAddress(`${lat.toFixed(6)}, ${lng.toFixed(6)}`);
                setSearchInput(`${lat.toFixed(6)}, ${lng.toFixed(6)}`);
                const data = extractAddressComponents({ formatted_address: `${lat.toFixed(6)}, ${lng.toFixed(6)}` });
                setSelectedLocation({ lat, lng, address: `${lat.toFixed(6)}, ${lng.toFixed(6)}`, city: data.city, state: data.state, country: data.country });
            }
        });
    }

    // Autocomplete handlers
    const onLoad = (autocomplete) => {
        autocompleteRef.current = autocomplete;
    };
    const onPlaceChanged = () => {
        if (autocompleteRef.current) {
            const place = autocompleteRef.current.getPlace();
            if (place && place.geometry) {
                const lat = place.geometry.location.lat();
                const lng = place.geometry.location.lng();
                const city = place.address_components?.find(component => component.types.includes('locality'))?.long_name || "";
                const state = place.address_components?.find(component => component.types.includes('administrative_area_level_1'))?.long_name || "";
                const country = place.address_components?.find(component => component.types.includes('country'))?.long_name || "";
                setLocation({ lat, lng });
                setAddress(place.formatted_address);
                setSearchInput(place.formatted_address);
                setSelectedLocation({ lat, lng, address: place.formatted_address, city, state, country });
                if (map || mapRef.current) {
                    const mapInstance = map || mapRef.current;
                    mapInstance.panTo({ lat, lng });
                    mapInstance.setZoom(14);
                }
            }
        }
    };

    // Map click handler
    const handleMapClick = (event) => {
        const lat = event.latLng.lat();
        const lng = event.latLng.lng();
        setLocation({ lat, lng });
        fetchAddressFromCoordinates(lat, lng);
        if (map || mapRef.current) {
            const mapInstance = map || mapRef.current;
            mapInstance.panTo({ lat, lng });
        }
    };

    // Marker drag handler
    const handleMarkerDragEnd = (event) => {
        const lat = event.latLng.lat();
        const lng = event.latLng.lng();
        setLocation({ lat, lng });
        fetchAddressFromCoordinates(lat, lng);
    };

    // Find my location handler
    const handleFindMyLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const lat = position.coords.latitude;
                    const lng = position.coords.longitude;
                    setLocation({ lat, lng });
                    fetchAddressFromCoordinates(lat, lng);
                    if (map || mapRef.current) {
                        const mapInstance = map || mapRef.current;
                        mapInstance.panTo({ lat, lng });
                        mapInstance.setZoom(14);
                    }
                },
                () => {
                    toast.error(t("locationAccessDenied"));
                }
            );
        } else {
            toast.error(t("geolocationNotSupported"));
        }
    };

    // Slider change handler
    // const handleRadiusChange = (e) => {
    //     setRadius(Number(e.target.value));
    //     setTooltipPosition(calculateTooltipPosition(e.target.value));
    // };

    // Clear handler
    const handleClear = () => {
        setSearchInput("");
        setAddress("");
        setLocation(defaultCenter);
        setSelectedLocation(null);
        setRadius(minRadius);
        setShowTooltip(false);
        updateSliderUI(minRadius);
        if (map || mapRef.current) {
            const mapInstance = map || mapRef.current;
            mapInstance.panTo(defaultCenter);
            mapInstance.setZoom(10);
        }
    };

    // Save handler
    const handleSaveLocation = async () => {
        try {
            const locationData = {
                formatted_address: selectedLocation.address || '',
                latitude: selectedLocation.lat,
                longitude: selectedLocation.lng,
                city: selectedLocation.city || '',
                state: selectedLocation.state || '',
                country: selectedLocation.country || '',
                radius: radius
            };

            // Save the location data
            dispatch(setLocationAction(locationData));
            onClose();
        } catch (error) {
            console.error('Error saving location:', error);
            toast.error(t("locationSaveError"));
        }
    };

    useEffect(() => {
        if (currentLocation?.latitude && currentLocation?.longitude) {
            setLocation({
                lat: currentLocation.latitude,
                lng: currentLocation.longitude
            });
            fetchAddressFromCoordinates(currentLocation.latitude, currentLocation.longitude);
        }
    }, [currentLocation]);

    // Initialize location with webSettings when available
    useEffect(() => {
        if (webSettings?.latitude && webSettings?.longitude && !currentLocation?.latitude) {
            const lat = Number(webSettings.latitude);
            const lng = Number(webSettings.longitude);
            if (!isNaN(lat) && !isNaN(lng)) {
                setLocation({ lat, lng, radius: minRadius });
                setSelectedLocation(prev => ({
                    ...prev,
                    lat,
                    lng
                }));
            }
        }
    }, [webSettings, currentLocation, minRadius]);

    useEffect(() => {
        if (isOpen) {
            const radiusValue = currentLocation?.radius || minRadius;
            setRadius(radiusValue);
            // Use setTimeout to ensure DOM elements are ready
            setTimeout(() => {
                updateSliderUI(radiusValue);
            }, 0);
        }
    }, [isOpen, currentLocation?.radius, minRadius]);

    // Additional effect to ensure slider UI is updated when modal content is rendered
    useEffect(() => {
        if (isOpen && sliderRef.current) {
            updateSliderUI(radius);
        }
    }, [isOpen, radius, sliderRef.current]);

    // Prevent autocomplete input from auto-focusing on mobile when modal opens
    useEffect(() => {
        if (isOpen && isMobile) {
            // Small delay to ensure DOM is ready
            setTimeout(() => {
                const autocompleteInput = document.querySelector('input[placeholder*="' + t("enterLocation") + '"]');
                if (autocompleteInput) {
                    autocompleteInput.blur();
                    // Clear any user interaction flags when modal opens
                    delete autocompleteInput.dataset.userClicked;
                }
            }, 100);
        }
    }, [isOpen, isMobile, t]);

    const handleKeyPress = (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
        }
    };


    const updateSliderUI = (value) => {
        if (!sliderRef.current) return;

        const percent = ((value - minRadius) / (maxRadius - minRadius)) * 100;

        // Set the progress percentage - CSS handles the direction
        sliderRef.current.style.setProperty("--range-progress", `${percent}%`);

        if (tooltipRef.current) {
            const sliderWidth = sliderRef.current.offsetWidth;
            const thumbWidth = 20;

            // Calculate tooltip position based on text direction
            let left;
            if (isRtl) {
                // For RTL, position from right side
                left = ((100 - percent) / 100) * (sliderWidth - thumbWidth) + thumbWidth / 2;
            } else {
                // For LTR, position from left side (original logic)
                left = (percent / 100) * (sliderWidth - thumbWidth) + thumbWidth / 2;
            }

            tooltipRef.current.style.left = `${left}px`;
        }
    };

    const handleRadiusChange = (e) => {
        const value = Number(e.target.value);
        setRadius(value);
        updateSliderUI(value);
    };

    useEffect(() => {
        updateSliderUI(radius);
        const handleResize = () => updateSliderUI(radius);
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, [radius, minRadius, maxRadius]);

    return (
        <Dialog open={isOpen} onOpenChange={(open) => {
            // Only close if explicitly clicking outside or pressing escape
            if (!open) {
                onClose();
            }
        }}>
            <DialogContent
                className="max-w-[300px] md:max-w-2xl p-0 rounded-xl"
                onPointerDownOutside={(e) => {
                    // Prevent closing when clicking on the autocomplete dropdown
                    if (e.target.closest('.pac-container')) {
                        e.preventDefault();
                    }
                }}
                onOpenAutoFocus={(e) => {
                    // Prevent auto-focus on mobile devices to avoid keyboard popup
                    if (isMobile) {
                        e.preventDefault();
                    }
                }}>
                <DialogHeader className={`text-start space-y-4 px-5 pt-5 ${isRtl ? 'text-right' : 'text-left'}`}>
                    <DialogTitle>{t("selectLocation")}</DialogTitle>
                    <DialogDescription className="mt-2">
                        {t("locationDescription")}
                    </DialogDescription>
                </DialogHeader>

                <div className="p-4">
                    {/* Search and Find My Location */}
                    <div className="flex justify-center primaryBackgroundBg items-center border rounded-lg p-1 mb-4 relative">
                        <div className="w-full">
                            <Autocomplete onLoad={onLoad} onPlaceChanged={onPlaceChanged}>
                                <input
                                    type="text"
                                    placeholder={t("enterLocation")}
                                    className="w-full flex-grow rounded-l-lg primaryBackgroundBg px-2 py-2 focus:outline-none"
                                    value={searchInput}
                                    onKeyDown={handleKeyPress}
                                    onChange={(e) => setSearchInput(e.target.value)}
                                    onClick={(e) => e.stopPropagation()}
                                    autoFocus={false}
                                    autoComplete="off"
                                    onFocus={(e) => {
                                        // Prevent focus on mobile devices unless explicitly clicked
                                        if (isMobile && !e.target.dataset.userClicked) {
                                            e.target.blur();
                                        }
                                    }}
                                    onMouseDown={(e) => {
                                        // Mark that user explicitly clicked the input
                                        e.target.dataset.userClicked = "true";
                                    }}
                                    onTouchStart={(e) => {
                                        // Mark that user explicitly touched the input
                                        e.target.dataset.userClicked = "true";
                                    }}
                                />
                            </Autocomplete>
                        </div>
                        <button
                            type="button"
                            onClick={handleFindMyLocation}
                            className="flex items-center text-nowrap justify-center px-2.5 py-2 primaryBg text-white rounded-md hover:bg-teal-700 gap-2"
                        >
                            <MdOutlineMyLocation className="fill-white" />
                            {!isMobile ? t("findMyLocation") : null}
                        </button>
                    </div>

                    {/* Map */}
                    <div className="mb-4">
                        <div className="relative rounded-lg overflow-hidden h-[13rem] md:h-[21rem]" >
                            <GoogleMap
                                mapContainerStyle={mapContainerStyle}
                                center={selectedLocation || location || defaultCenter}
                                zoom={12}
                                onLoad={(map) => {
                                    mapRef.current = map;
                                    setMap(map);
                                }}
                                onClick={handleMapClick}
                                options={{
                                    draggable: true
                                }}
                            >
                                <Marker
                                    position={location}
                                    draggable={true}
                                    onDragEnd={handleMarkerDragEnd}
                                />
                                <Circle

                                    center={location}
                                    radius={radius * 1000}
                                    options={{
                                        strokeColor: "#087c7c",
                                        fillColor: "#087c7c",
                                        strokeOpacity: 0.8,
                                        strokeWeight: 2,
                                        fillOpacity: 0.2,
                                    }}
                                />
                            </GoogleMap>
                        </div>
                    </div>

                    {/* KM Range Slider */}
                    <div className="mb-3 primaryBackgroundBg px-4 py-3 rounded-lg">
                        <div className="flex items-center justify-between mb-1">
                            <h3 className="font-medium text-gray-800">{t("kmRange")}</h3>
                        </div>
                        <div className="relative w-full" dir={isRtl ? "rtl" : "ltr"}>
                            <div className="relative w-full">
                                {/* Tooltip */}
                                <div
                                    ref={tooltipRef}
                                    className={`absolute -top-12 z-10 -translate-x-1/2 flex flex-col items-center pointer-events-none transition-all duration-200 ${showTooltip ? 'opacity-100 visible' : 'opacity-0 invisible'
                                        }`}
                                >
                                    <div className="bg-black text-white text-sm font-semibold px-3 py-1 rounded">
                                        {radius} {t("km")}
                                    </div>
                                    <div className="w-3 h-3 bg-black rotate-45 mt-[-6px]" />
                                </div>

                                {/* Slider */}
                                <input
                                    ref={sliderRef}
                                    type="range"
                                    min={minRadius}
                                    max={maxRadius}
                                    value={radius}
                                    onChange={handleRadiusChange}
                                    className="w-full h-3 appearance-none bg-transparent location-slider"
                                    onMouseEnter={() => setShowTooltip(true)}
                                    onMouseLeave={() => setShowTooltip(false)}
                                    onMouseDown={() => setShowTooltip(true)}
                                    onMouseUp={() => setShowTooltip(false)}
                                    onTouchStart={() => setShowTooltip(true)}
                                    onTouchEnd={() => setShowTooltip(false)}
                                    onFocus={() => setShowTooltip(true)}
                                    onBlur={() => setShowTooltip(false)}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <DialogFooter className={`!flex-row px-4 pb-4 ${isRtl ? 'justify-start' : 'justify-end'}`}>
                    <button
                        onClick={handleClear}
                        className="px-6 py-2 rounded-lg hover:bg-gray-50"
                    >
                        {t("clear")}
                    </button>
                    <button
                        onClick={handleSaveLocation}
                        className="px-6 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700"
                    >
                        {t("saveLocation")}
                    </button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default LocationSearchWithRadius;