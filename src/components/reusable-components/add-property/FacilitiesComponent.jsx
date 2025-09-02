import React, { useState, useEffect } from 'react'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { useTranslation } from '@/components/context/TranslationContext'
import { getDisplayValueForOption, isRTL } from '@/utils/helperFunction'
const FacilitiesComponent = ({
    formData,
    setFormData,
    selectedCategory,
    categories,
    handleCheckRequiredFields,
    isEditing = false
}) => {
    const t = useTranslation()
    const isRtl = isRTL()
    const [categoryData, setCategoryData] = useState(null);
    const [parameterTypes, setParameterTypes] = useState(null);
    useEffect(() => {
        if (selectedCategory) {
            // Find the selected category data from categories in Redux
            const category = categories.find(cat => cat.id === selectedCategory?.id);
            if (category) {
                setParameterTypes(typeof category.parameter_types === "object" ? Object.values(category.parameter_types) : category.parameter_types);
            }
            setCategoryData(category);
        } else {
            setCategoryData(null);
        }
    }, [selectedCategory, categories]);

    const handleInputChange = (e, parameter) => {
        const { name, value, type, checked } = e.target;
        if (type === "number" && (value < 0 || parseFloat(value) < 0 || isNaN(value))) {
            setFormData(prev => ({
                ...prev,
                [name]: 0
            }));
            return;
        }

        if (type === "checkbox") {
            // Handle checkbox inputs (multiple values)
            let currentValues = formData[name] || [];
            if (currentValues?.includes(",")) {
                currentValues = currentValues?.split(",")
            }
            const updatedValues = checked
                ? [...currentValues, value]
                : currentValues.filter(val => val !== value);

            setFormData(prev => ({
                ...prev,
                [name]: updatedValues
            }));
        } else {
            // Handle other input types
            setFormData(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };

    if (!selectedCategory) {
        return (
            <div className="flex items-center justify-center p-8 rounded-md">
                <p className="text-muted-foreground">{t("pleaseSelectACategory")}</p>
            </div>
        );
    }

    if (!categoryData) {
        return (
            <div className="flex items-center justify-center p-8">
                <p>{t("categoryLoading")}</p>
            </div>
        );
    }

    return (
        <>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {parameterTypes && parameterTypes.map((parameter) => (
                    <div key={parameter.id} className="space-y-2">
                        <div className="flex items-center gap-2">
                            <label htmlFor={parameter.translated_name || parameter?.name} className="font-medium text-sm">
                                {parameter.translated_name || parameter.name}
                                {parameter.is_required === 1 && <span className="text-red-500 ml-1">*</span>}
                            </label>
                        </div>

                        {/* Render different input types based on parameter type */}
                        {parameter.type_of_parameter === "textbox" && (
                            <Input
                                id={parameter.name}
                                name={parameter.id}
                                value={formData[parameter.id] || ""}
                                onChange={(e) => handleInputChange(e, parameter)}
                                required={parameter.is_required === 1}
                                className="primaryBackgroundBg"
                            />
                        )}

                        {parameter.type_of_parameter === "textarea" && (
                            <Textarea
                                id={parameter.name}
                                name={parameter.id}
                                value={formData[parameter.id] || ""}
                                onChange={(e) => handleInputChange(e, parameter)}
                                required={parameter.is_required === 1}
                                className="primaryBackgroundBg resize-none"
                            />
                        )}

                        {parameter.type_of_parameter === "number" && (
                            <Input
                                id={parameter.name}
                                name={parameter.id}
                                type="number"
                                value={formData[parameter.id] || ""}
                                onChange={(e) => handleInputChange(e, parameter)}
                                required={parameter.is_required === 1}
                                onInput={(e) => {
                                    if (e.target.value < 0) {
                                        e.target.value = 0;
                                    }
                                }}
                                className="primaryBackgroundBg"
                            />
                        )}

                        {parameter.type_of_parameter === "dropdown" && (
                            <Select
                                dir={isRtl ? "rtl" : "ltr"}
                                value={formData[parameter.id] || ""}
                                onValueChange={(value) =>
                                    setFormData(prev => ({ ...prev, [parameter.id]: value }))
                                }
                            >
                                <SelectTrigger className="w-full focus:ring-0">
                                    <SelectValue placeholder="Select" />
                                </SelectTrigger>
                                <SelectContent>
                                    {parameter.translated_option_value && parameter.translated_option_value.map((option, index) => (
                                        <SelectItem key={option?.translated} value={option?.value} className="hover:!primaryBg hover:!text-white hover:!cursor-pointer">
                                            {option?.translated || option?.value}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        )}

                        {parameter.type_of_parameter === "radiobutton" && (
                            <div className="flex flex-col w-fit items-start gap-2">
                                {parameter.translated_option_value && parameter.translated_option_value.map((option, index) => (
                                    <label
                                        key={option?.id}
                                        className={`px-3 py-2 rounded border cursor-pointer transition-colors ${formData[parameter.id] === option?.value
                                            ? "primaryBg text-white"
                                            : "hover:bg-muted"
                                            }`}
                                    >
                                        <input
                                            type="radio"
                                            name={parameter.id}
                                            value={option?.value}
                                            checked={formData[parameter.id] === option?.value}
                                            onChange={(e) => handleInputChange(e, parameter)}
                                            className="sr-only"
                                            required={parameter.is_required === 1}
                                        />
                                        {option?.translated || option?.value}
                                    </label>
                                ))}
                            </div>
                        )}
                        {parameter.type_of_parameter === "checkbox" && (
                            <div className="flex flex-col w-fit items-start gap-2">
                                {parameter.translated_option_value && parameter.translated_option_value.map((option, index) => (
                                    <label
                                        key={`${parameter.id}_${index}`}
                                        className={`px-3 py-2 rounded border cursor-pointer transition-colors ${(formData[parameter.id] || []).includes(option?.value)
                                            ? "primaryBg text-white"
                                            : "hover:bg-muted"
                                            }`}
                                    >
                                        <input
                                            type="checkbox"
                                            name={parameter.id}
                                            value={option?.value}
                                            checked={(formData[parameter.id] || []).includes(option?.value)}
                                            onChange={(e) => handleInputChange(e, parameter)}
                                            className="sr-only"
                                        />
                                        {option?.translated || option?.value}
                                    </label>
                                ))}
                            </div>
                        )}

                        {parameter.type_of_parameter === "file" && (
                            <Input
                                id={parameter.name}
                                name={parameter.id}
                                type="file"
                                onChange={(e) => handleInputChange(e, parameter)}
                                required={parameter.is_required === 1}
                            />
                        )}
                    </div>
                ))}
            </div >
            <div className="flex justify-end mt-4">
                <Button
                    onClick={() => handleCheckRequiredFields("facilities", "outdoorFacilities")}
                    className="px-10 py-5"
                >
                    {isEditing ? t("save") : t("next")}
                </Button>
            </div>
        </>
    );
}

export default FacilitiesComponent