import { GoogleMap, Marker, InfoWindow } from "@react-google-maps/api";
import MapPropertyCard from '../cards/MapPropertyCard';

const PropertyOnMapView = ({
    containerStyle,
    defaultCenter,
    onLoad,
    onUnmount,
    isMapLoaded,
    selectedProperty,
    handleMarkerClick,
    handleInfoWindowClose,
    iconConfig,
    data,
}) => {
    // Make sure data is valid
    const validProperties = Array.isArray(data) ? data.filter(property =>
        property && property.latitude && property.longitude
    ) : [];

    return (
        <GoogleMap
            mapContainerStyle={containerStyle}
            center={defaultCenter}
            zoom={14}
            onLoad={onLoad}
            onUnmount={onUnmount}
            onClick={handleInfoWindowClose}
            options={{
                fullscreenControl: true,
                streetViewControl: false,
                mapTypeControl: false,
                gestureHandling: 'greedy',

                styles: [
                    {
                        featureType: "administrative",
                        elementType: "labels.text.fill",
                        stylers: [{ color: "#444444" }]
                    },
                    {
                        featureType: "landscape",
                        elementType: "all",
                        stylers: [{ color: "#f2f2f2" }]
                    },
                    {
                        featureType: "poi",
                        elementType: "all",
                        stylers: [{ visibility: "off" }]
                    }
                ]
            }}
        >
            {/* Render markers */}
            {isMapLoaded && validProperties.map((property) => {
                // Convert latitude and longitude to numbers
                const position = {
                    lat: parseFloat(property.latitude),
                    lng: parseFloat(property.longitude)
                };

                return (
                    <div key={property.id} className='relative'>
                        <Marker
                            key={property.id}
                            position={position}
                            onClick={() => handleMarkerClick(property)}
                            icon={iconConfig}
                            zIndex={selectedProperty?.id === property.id ? 1000 : 1}
                        />

                        {/* Render InfoWindow if this property is selected */}
                        {selectedProperty?.id === property.id && (
                            <InfoWindow
                                position={position}
                                onCloseClick={handleInfoWindowClose}
                                options={{
                                    pixelOffset: isMapLoaded ? new window.google.maps.Size(0, -45) : undefined,
                                    maxWidth: 320,
                                    disableAutoPan: true,
                                    minHeight: 400,
                                    borderRadius: "16px",
                                }}
                            >
                                {/* InfoWindow content container */}
                                <div className="rounded-t-2xl p-0 m-0 gmaps-infowindow-content">
                                    <MapPropertyCard property={selectedProperty} />
                                </div>
                            </InfoWindow>
                        )
                        }
                    </div>
                );
            })}
        </GoogleMap>
    );
};

export default PropertyOnMapView;
