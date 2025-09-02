import React from 'react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useTranslation } from '@/components/context/TranslationContext'

// Property Rent Duration Component
const PropertyRentDuration = ({ value, onChange, name }) => {
    const t = useTranslation()

    return (
        <div className="w-full min-w-[170px] max-w-[250px] space-y-2">
            <Select defaultValue={value} onValueChange={(value) => onChange(value, name)} className="primaryBackgroundBg ">
                <SelectTrigger className="!py-5 border-none focus:ring-0 primaryBackgroundBg text-gray-500">
                    <SelectValue placeholder={t("selectRentDuration") || "Select Rent Duration"} />
                </SelectTrigger>
                <SelectContent className="primaryBackgroundBg text-gray-500">
                    <SelectItem className="hover:cursor-pointer" value="none">{t("selectRentDuration") || "Select Rent Duration"}</SelectItem>
                    <SelectItem className="hover:cursor-pointer" value="Daily">{t("daily") || "Daily"}</SelectItem>
                    <SelectItem className="hover:cursor-pointer" value="Monthly">{t("monthly") || "Monthly"}</SelectItem>
                    <SelectItem className="hover:cursor-pointer" value="Yearly">{t("yearly") || "Yearly"}</SelectItem>
                    <SelectItem className="hover:cursor-pointer" value="Quaterly">{t("quaterly") || "Quaterly"}</SelectItem>
                </SelectContent>
            </Select>
        </div>
    )
}
export default PropertyRentDuration