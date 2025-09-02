import React, { useEffect, useState } from 'react'
import { GoogleMap, Marker } from '@react-google-maps/api';
import { extractAddressComponents } from '@/utils/helperFunction';
import { useSelector } from 'react-redux';
import { useTranslation } from '@/components/context/TranslationContext';

const Map = ({ onSelectLocation, latitude, longitude, apiKey, showLabel = false, isDraggable = true }) => {
    const t = useTranslation()
    const webSettings = useSelector(state => state.WebSetting?.data)
    const [location, setLocation] = useState({
        lat: latitude ? parseFloat(latitude) : parseFloat(webSettings?.latitude),
        lng: longitude ? parseFloat(longitude) : parseFloat(webSettings?.longitude),
    });
    const [mapError, setMapError] = useState(null);
    const [selectedLocationAddress, setSelectedLocationAddress] = useState({
        city: "",
        state: "",
        country: "",
        formattedAddress: "",
        lat: latitude ? parseFloat(latitude) : parseFloat(webSettings?.latitude),
        lng: longitude ? parseFloat(longitude) : parseFloat(webSettings?.longitude),
    });

    useEffect(() => {
        // Update the location state when latitude or longitude changes
        if (latitude && longitude) {

            setLocation({
                lat: latitude ? parseFloat(latitude) : parseFloat(webSettings?.latitude),
                lng: longitude ? parseFloat(longitude) : parseFloat(webSettings?.longitude),
            });
        }
    }, [latitude, longitude]);

    const containerStyle = {
        width: "100%",
        height: "400px",
    };

    const handleMarkerDragEnd = async (e) => {
        const { lat, lng } = e.latLng;
        const reverseGeocodedData = await performReverseGeocoding(lat(), lng());
        if (reverseGeocodedData) {
            const { city, country, state, formattedAddress } = reverseGeocodedData;
            const updatedLocation = {
                ...location,
                lat: lat(),
                lng: lng(),
                city: city,
                country: country,
                state: state,
                formattedAddress: formattedAddress,
            };
            setLocation(updatedLocation);
            onSelectLocation(updatedLocation);
            setSelectedLocationAddress({
                ...selectedLocationAddress,
                city: city,
                country: country,
                state: state,
                formattedAddress: formattedAddress,
                lat: lat(),
                lng: lng(),
            });
        } else {
            console.error("No reverse geocoding data available");
        }
    };

    const performReverseGeocoding = async (lat, lng) => {
        try {
            const geocoder = new window.google.maps.Geocoder();
            const latlng = { lat, lng };
            return new Promise((resolve, reject) => {
                geocoder.geocode({ location: latlng }, (results, status) => {
                    if (status === "OK") {
                        if (results && results.length > 0) {
                            const result = results[0];
                            const { city, country, state, formattedAddress } = extractAddressComponents(result);
                            resolve({
                                city,
                                country,
                                state,
                                formattedAddress
                            });
                        } else {
                            reject(new Error("No results found"));
                        }
                    } else {
                        reject(new Error("Geocoder failed due to: " + status));
                    }
                });
            });
        } catch (error) {
            console.error("Error performing reverse geocoding:", error);
            return null;
        }
    };

    return (
        <div>
            {mapError ?
                <div>{mapError}</div>
                :
                <div className="relative">
                    {showLabel && (
                        <p className="secondaryTextColor font-medium">
                            {t("map")} <span className="text-red-500">*</span>
                        </p>
                    )}
                    <GoogleMap mapContainerStyle={containerStyle} center={location} zoom={14}>
                        <Marker position={location} draggable={isDraggable} onDragEnd={handleMarkerDragEnd} />
                    </GoogleMap>
                </div>
            }
        </div>
    )
}

export default Map