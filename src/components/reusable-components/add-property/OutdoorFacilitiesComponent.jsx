import React from 'react'
import { useTranslation } from '@/components/context/TranslationContext'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useSelector } from 'react-redux'

// Outdoor Facilities Component
const OutdoorFacilitiesComponent = ({
    facilities,
    handleTabChange,
    facilityDistances,
    handleDistanceChange,
    isEditing = false
}) => {
    const t = useTranslation()
    const webSettings = useSelector((state) => state.WebSetting?.data)
    const distanceSymbol = webSettings?.distance_option
    const distanceSymbolMap = {
        km: t('enterDistanceInKm'),
        m: t('enterDistanceInMeters'),
        mi: t('enterDistanceInMiles'),
        yd: t('enterDistanceInYards')
    }
    const distancePlaceholder = t(distanceSymbolMap[distanceSymbol]) || t('enterDistanceInkm')
    return (
        <div className="">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {facilities.map((facility) => (
                    <div key={facility.id} className="space-y-2">
                        <Label htmlFor={`facility-${facility.id}`} className="font-medium text-gray-800">
                            {facility.translated_name || facility.name}
                        </Label>
                        <Input
                            id={`facility-${facility.id}`}
                            type="number"
                            min="0"
                            value={facilityDistances[facility.id] || ""}
                            onChange={(e) => handleDistanceChange(facility.id, e.target.value)}
                            placeholder={distancePlaceholder}
                            className="primaryBackgroundBg rounded-lg border-0 focus:ring-0 focus-visible:ring-0 primaryBackgroundBg"
                        />
                    </div>
                ))}
            </div>

            <div className="flex justify-end mt-4">
                <Button
                    onClick={() => handleTabChange("location")}
                    className="px-10 py-5"
                >
                    {isEditing ? t("save") : t("next")}
                </Button>
            </div>
        </div>
    );
}

export default OutdoorFacilitiesComponent