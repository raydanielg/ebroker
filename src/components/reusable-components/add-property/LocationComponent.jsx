import { useRef } from 'react'
import { useTranslation } from '@/components/context/TranslationContext'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Autocomplete } from '@react-google-maps/api'
import { extractAddressComponents } from '@/utils/helperFunction'
import Map from '@/components/google-maps/GoogleMap'


const LocationComponent = ({
    selectedLocationAddress,
    setSelectedLocationAddress,
    apiKey,
    handleLocationSelect,
    handleCheckRequiredFields,
    isEditing = false,
    isProperty = true
}) => {
    const t = useTranslation();
    const autocompleteRef = useRef(null);

    const handleCityPlaceSelect = () => {
        if (autocompleteRef.current) {
            const place = autocompleteRef.current.getPlace();
            if (place && place.geometry && place.geometry.location) {
                try {
                    const location = place.geometry.location;

                    // Extract address components
                    const addressData = extractAddressComponents(place);

                    // Update the form with city and state from the selected place
                    setSelectedLocationAddress(prev => ({
                        ...prev,
                        city: addressData.city || '',
                        state: addressData.state || '',
                        latitude: location.lat ? location.lat() : prev.latitude,
                        longitude: location.lng ? location.lng() : prev.longitude,
                        country: addressData.country || prev.country,
                        formattedAddress: addressData.formattedAddress || prev.formattedAddress
                    }));
                } catch (error) {
                    console.error("Error processing place data:", error);
                }
            }
        }
    };

    return (
        <div className="flex flex-col gap-8">
            <div className='font-medium text-gray-800'>{isProperty ? t("selectPropertyLocationNote") : t("selectProjectLocationNote")}</div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                    {/* City */}
                    <div className='flex w-full gap-3'>
                        <div className="w-1/2">
                            <Label htmlFor="city" className="font-medium text-gray-800">
                                {t("city")} <span className="text-red-500">*</span>
                            </Label>
                            <div className="relative">
                                <Autocomplete
                                    onLoad={ref => autocompleteRef.current = ref}
                                    onPlaceChanged={handleCityPlaceSelect}
                                    types={['(cities)']}
                                >
                                    <Input
                                        type="text"
                                        id="city"
                                        value={selectedLocationAddress.city || ''}
                                        onChange={(e) => setSelectedLocationAddress(prev => ({ ...prev, city: e.target.value }))}
                                        placeholder={t("searchCity")}
                                        className="w-full px-3 py-2 primaryBackgroundBg rounded-md focus:outline-none focus:border-none focus:border-transparent pr-10"
                                    />
                                </Autocomplete>
                            </div>
                        </div>
                        <div className="w-1/2">
                            <Label htmlFor="state" className="font-medium text-gray-800">
                                {t("state")} <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                type="text"
                                id="state"
                                value={selectedLocationAddress.state || ''}
                                onChange={(e) => setSelectedLocationAddress(prev => ({ ...prev, state: e.target.value }))}
                                placeholder={t("enterState")}
                                className="w-full px-3 py-2 primaryBackgroundBg rounded-md focus:outline-none focus:border-none focus:border-transparent"
                            />
                        </div>
                    </div>

                    {/* Country */}
                    <div>
                        <Label htmlFor="country" className="font-medium text-gray-800">
                            {t("country")} <span className="text-red-500">*</span>
                        </Label>
                        <Input
                            type="text"
                            id="country"
                            value={selectedLocationAddress.country || ''}
                            onChange={(e) => setSelectedLocationAddress(prev => ({ ...prev, country: e.target.value }))}
                            placeholder={t("enterCountry")}
                            className="w-full px-3 py-2 primaryBackgroundBg rounded-md focus:outline-none focus:border-none focus:border-transparent"
                        />
                    </div>

                    {/* Address */}
                    <div>
                        <Label htmlFor="address" className="font-medium text-gray-800">
                            {t("address")} <span className="text-red-500">*</span>
                        </Label>
                        <div className="relative">
                            <Textarea
                                id="address"
                                value={selectedLocationAddress.formattedAddress || ''}
                                onChange={(e) => setSelectedLocationAddress(prev => ({ ...prev, formattedAddress: e.target.value }))}
                                placeholder={t("enterFullAddress")}
                                className="w-full px-3 py-2 primaryBackgroundBg rounded-md focus:outline-none focus:border-none focus:border-transparent resize-none h-24"
                            />
                        </div>
                    </div>
                </div>

                <div className="w-full h-[350px] rounded-lg overflow-hidden">
                    <Map
                        latitude={selectedLocationAddress.latitude || 0}
                        longitude={selectedLocationAddress.longitude || 0}
                        showLabel={true}
                        apiKey={apiKey}
                        onSelectLocation={handleLocationSelect}
                    />
                </div>
            </div>

            {/* Next Button */}
            <div className="flex justify-end">
                <Button
                    onClick={() => handleCheckRequiredFields("location", isProperty ? "imagesVideo" : "floorDetails")}
                    className="px-10 py-5"
                >
                    {isEditing ? t("save") : t("next")}
                </Button>
            </div>
        </div>
    );
};

export default LocationComponent