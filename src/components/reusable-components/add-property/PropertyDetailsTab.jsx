import React, { useState, useMemo } from 'react'
import Image from 'next/image'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import PropertyTypeRadio from '@/components/reusable-components/add-property/PropertyTypeRadio'
import PropertyRentDuration from '@/components/reusable-components/add-property/PropertyRentDuration'
import { useTranslation } from '@/components/context/TranslationContext'
import { useSelector } from 'react-redux'
import { isRTL } from '@/utils/helperFunction'

// Property Details Tab Component
const PropertyDetailsTab = ({
    selectedCategory,
    handleRemoveCategory,
    handleUpdatePropertyForm,
    propertyFormData,
    handleCheckRequiredFields,
    isEditing = false,
    selectedLanguage,
    setSelectedLanguage,
    languages = [],
    translations = [],
    handleMultiLangChange
}) => {
    const t = useTranslation()
    const isRtl = isRTL()
    const activeLanguage = useSelector(state => state.LanguageSettings?.active_language)
    const defaultLanguage = useSelector(state => state.LanguageSettings?.default_language)
    const currentLanguage = useSelector(state => state.LanguageSettings?.current_language) || {}
    const availableLanguages = useSelector(state => state.LanguageSettings?.languages) || []

    // Determine the system default language (could be English or any other language)
    const systemDefaultLanguage = useMemo(() => {
        // Try to find the default language object in available languages
        if (defaultLanguage) {
            const defaultLang = availableLanguages.find(lang =>
                lang.code === defaultLanguage || lang.id === defaultLanguage
            )
            if (defaultLang) return defaultLang
        }

        // If current language exists, use it
        if (currentLanguage && currentLanguage.id) {
            return currentLanguage
        }

        // Fallback to English if nothing else is available
        return { id: "English", name: "English", code: "en" }
    }, [defaultLanguage, currentLanguage, availableLanguages])

    // Combine system languages with any additional languages passed as props
    const allLanguages = useMemo(() => {
        // Use Map to ensure uniqueness
        const languageMap = new Map()

        // First add current language from Redux if it exists and has required properties
        if (currentLanguage && currentLanguage.id) {
            languageMap.set(currentLanguage.code || currentLanguage.id, currentLanguage)
        }

        // Add system default language if not already added
        const defaultKey = systemDefaultLanguage.code || systemDefaultLanguage.id
        if (!languageMap.has(defaultKey)) {
            languageMap.set(defaultKey, systemDefaultLanguage)
        }

        // Add languages from Redux state
        availableLanguages.forEach(lang => {
            // Skip if we already have this language
            if (!languageMap.has(lang.code)) {
                languageMap.set(lang.code, lang)
            }
        })

        // Add any additional languages from props that aren't already included
        languages.forEach(lang => {
            const key = typeof lang === 'object' ? (lang.code || lang.id) : lang
            if (key && !languageMap.has(key)) {
                languageMap.set(key, lang)
            }
        })

        return Array.from(languageMap.values())
    }, [currentLanguage, systemDefaultLanguage, availableLanguages, languages])

    // Find the current translation for the selected language
    const findTranslation = (languageId) => {
        return translations.find(item => {
            if (typeof languageId === 'object') {
                return item.language_id === languageId.id;
            }
            return item.language_id === languageId;
        });
    };

    // Get value for a specific field in the selected language
    const getTranslationValue = (languageId, field) => {
        const translation = findTranslation(languageId);
        return translation ? translation[field] || "" : "";
    };

    // Determine if a language is selected
    const isLanguageSelected = (lang) => {
        if (typeof selectedLanguage === 'object' && typeof lang === 'object') {
            return selectedLanguage.id === lang.id;
        }
        if (typeof selectedLanguage === 'string' && typeof lang === 'string') {
            return selectedLanguage === lang;
        }
        return false;
    };

    // Check if a language is the default language
    const isDefaultLanguage = (lang) => {
        // Handle case when lang is undefined
        if (!lang) return false;

        // Handle object comparison
        if (typeof lang === 'object' && typeof systemDefaultLanguage === 'object') {
            // Compare by id, code, or name for flexibility
            return (
                (lang.id && systemDefaultLanguage.id && lang.id === systemDefaultLanguage.id) ||
                (lang.code && systemDefaultLanguage.code && lang.code === systemDefaultLanguage.code) ||
                (lang.name && systemDefaultLanguage.name && lang.name === systemDefaultLanguage.name)
            )
        }

        // Handle string comparison
        if (typeof lang === 'string' && typeof systemDefaultLanguage === 'object') {
            return (
                lang === systemDefaultLanguage.id ||
                lang === systemDefaultLanguage.code ||
                lang === systemDefaultLanguage.name ||
                lang === "English" // For backward compatibility
            )
        }

        // Direct comparison
        return lang === systemDefaultLanguage
    }

    // Check if this is a required language (default or active)
    const isRequiredLanguage = (lang) => {
        return isDefaultLanguage(lang) || lang === activeLanguage;
    }

    // Wrapper for handleUpdatePropertyForm to handle default language fields correctly
    const handleFieldChange = (e, fieldName) => {
        // For standard form events (input, textarea)
        if (e && e.target) {
            const { name, value } = e.target;

            // If this is the default language, update the main property fields
            if (isDefaultLanguage(selectedLanguage) || selectedLanguage === activeLanguage) {
                if (name === "title") {
                    // Update both title and generate slug
                    handleUpdatePropertyForm({
                        target: {
                            name: "propertyTitle",
                            value: value
                        }
                    });
                } else if (name === "description") {
                    // Update description
                    handleUpdatePropertyForm({
                        target: {
                            name: "propertyDescription",
                            value: value
                        }
                    });
                } else {
                    // Pass through other field changes
                    handleUpdatePropertyForm(e);
                }
            } else {
                // For non-default languages, use the translation handler
                handleMultiLangChange(selectedLanguage, fieldName || name, value);
            }
        }
    };

    return (
        <>
            {/* Language Tabs */}
            <div className="flex flex-wrap gap-7 mb-6 overflow-x-auto">
                {/* Default system language is always first */}
                <button
                    key={typeof systemDefaultLanguage === 'object' ? systemDefaultLanguage.id || systemDefaultLanguage.code : systemDefaultLanguage}
                    onClick={() => setSelectedLanguage(systemDefaultLanguage)}
                    className={`px-8 py-3 rounded-lg whitespace-nowrap ${isLanguageSelected(systemDefaultLanguage) ||
                        (selectedLanguage === activeLanguage && isDefaultLanguage(activeLanguage))
                        ? "secondaryTextBg text-white"
                        : "btnBorder secondaryTextColor"
                        }`}
                >
                    {typeof systemDefaultLanguage === 'object' ? systemDefaultLanguage.name : systemDefaultLanguage}
                </button>

                {/* Map through all available languages except the default one */}
                {allLanguages
                    .filter(lang => {
                        // Filter out default language and undefined/null values
                        if (!lang) return false

                        if (typeof lang === 'object' && typeof systemDefaultLanguage === 'object') {
                            return lang.id !== systemDefaultLanguage.id && lang.code !== systemDefaultLanguage.code
                        }
                        return lang !== systemDefaultLanguage
                    })
                    .map(language => (
                        <button
                            key={typeof language === 'object' ? language.id || language.code : language}
                            onClick={() => setSelectedLanguage(language)}
                            className={`px-8 py-3 rounded-lg whitespace-nowrap ${isLanguageSelected(language) ||
                                (typeof selectedLanguage === 'object' &&
                                    typeof language === 'object' &&
                                    selectedLanguage.name === language.name)
                                ? "secondaryTextBg text-white"
                                : "btnBorder secondaryTextColor"
                                }`}
                        >
                            {typeof language === 'object' ? language.name : language}
                        </button>
                    ))
                }
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Selected Category - Only show for default/active language */}
                <div className='space-y-4'>
                    {(isDefaultLanguage(selectedLanguage) || selectedLanguage === activeLanguage) && selectedCategory && (
                        <>
                            <h3 className="font-medium mb-2">{t("selectedCategory")}</h3>
                            <div className={`flex items-center gap-2 ${!isEditing && handleRemoveCategory ? "cursor-pointer" : ""}`}
                                onClick={!isEditing && handleRemoveCategory ? handleRemoveCategory : undefined}>
                                <div className="primaryColor">
                                    <Image
                                        height={0}
                                        width={0}
                                        src={selectedCategory && selectedCategory?.image}
                                        className={"w-10 h-10 bg-white rounded-full"}
                                        alt={selectedCategory && selectedCategory?.category}
                                    />
                                </div>
                                <span>
                                    {selectedCategory && selectedCategory?.category}
                                </span>
                            </div>
                        </>)}
                    {/* Property Type - Only show for default/active language */}
                    {(isDefaultLanguage(selectedLanguage) || selectedLanguage === activeLanguage) && (
                        <div className=''>
                            <h3 className="font-medium mb-2 text-gray-800">
                                {t("propertyType")} <span className="text-red-500">*</span>
                            </h3>
                            <div className="flex flex-col md:flex-row gap-4">
                                <PropertyTypeRadio
                                    value="Sell"
                                    name="propertyType"
                                    checked={propertyFormData.propertyType?.toLowerCase() === "sell"}
                                    onChange={(e) => handleUpdatePropertyForm(e)}
                                    label={t("sell")}
                                />

                                <PropertyTypeRadio
                                    value="Rent"
                                    name="propertyType"
                                    checked={propertyFormData.propertyType?.toLowerCase() === "rent"}
                                    onChange={(e) => handleUpdatePropertyForm(e)}
                                    label={t("rent")}
                                />
                            </div>
                        </div>
                    )}

                    {/* Title */}
                    <div className="flex flex-col md:flex-row gap-3">
                        <div className='w-full'>
                            <Label htmlFor="property-title" className="font-medium mb-2 block text-gray-800">
                                {t("title")} {isRequiredLanguage(selectedLanguage) && <span className="text-red-500">*</span>}
                            </Label>
                            <Input
                                type="text"
                                id="property-title"
                                value={isDefaultLanguage(selectedLanguage) || selectedLanguage === activeLanguage
                                    ? propertyFormData.propertyTitle
                                    : getTranslationValue(selectedLanguage, "title")}
                                name="title"
                                onChange={(e) => handleFieldChange(e, "title")}
                                placeholder={t("enterPropertyTitle")}
                                className="w-full px-3 py-2 primaryBackgroundBg rounded-md focus:outline-none focus:border-none focus:border-transparent"
                            />
                        </div>
                        {/* Slug - Only show for default language */}
                        {(isDefaultLanguage(selectedLanguage) || selectedLanguage === activeLanguage) && (
                            <div className='w-full'>
                                <Label htmlFor="property-slug" className="font-medium mb-2 block text-gray-800">
                                    {t("slug")}
                                </Label>
                                <Input
                                    type="text"
                                    id="property-slug"
                                    value={propertyFormData.propertySlug}
                                    name="propertySlug"
                                    onChange={(e) => handleUpdatePropertyForm(e)}
                                    placeholder={t("enterPropertySlug")}
                                    className="w-full px-3 py-2 primaryBackgroundBg rounded-md focus:outline-none focus:border-none focus:border-transparent"
                                />
                            </div>
                        )}
                    </div>
                    {/* Price and other fields - Only show for default language */}
                    {(isDefaultLanguage(selectedLanguage) || selectedLanguage === activeLanguage) && (
                        <div className='flex justify-between gap-3'>
                            <div className={`flex flex-col ${propertyFormData.propertyType?.toLowerCase() === "rent" ? "w-1/3" : "w-1/2"}`}>
                                <Label htmlFor="property-price" className="font-medium mb-2 block text-gray-800">
                                    {t("price")} <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                    type="number"
                                    id="property-price"
                                    value={propertyFormData.propertyPrice}
                                    name="propertyPrice"
                                    onChange={(e) => handleUpdatePropertyForm(e)}
                                    placeholder={t("enterPropertyPrice")}
                                    onInput={(e) => {
                                        if (e.target.value <= 0) {
                                            e.target.value = null
                                        }
                                    }}
                                    className="w-full px-3 py-2 primaryBackgroundBg rounded-md focus:outline-none focus:border-none focus:border-transparent"
                                />
                            </div>
                            {/* Rent Duration */}
                            {propertyFormData.propertyType?.toLowerCase() === "rent" &&
                                <div className="flex flex-col w-1/3">
                                    <Label htmlFor="property-rent-duration" className="font-medium mb-2 block text-gray-800">
                                        {t("rentDuration")} <span className="text-red-500">*</span>
                                    </Label>
                                    <PropertyRentDuration
                                        value={propertyFormData.rentDuration}
                                        onChange={(value, name) => handleUpdatePropertyForm(value, name)}
                                        name="rentDuration"
                                    />
                                </div>
                            }
                            {/* Is Private Property */}
                            <div className={`flex flex-col ${propertyFormData.propertyType?.toLowerCase() === "rent" ? "w-1/3" : "w-1/2"}`}>
                                <p className="font-medium mb-2 text-gray-800">
                                    {t("isPrivateProperty")}
                                </p>
                                <div className="flex items-center">
                                    <Switch
                                        checked={propertyFormData.isPrivateProperty}
                                        name="isPrivateProperty"
                                        onCheckedChange={(checked) => handleUpdatePropertyForm(null, "isPrivateProperty", checked)}
                                        className={`${propertyFormData.isPrivateProperty ? "!primaryBg" : ""}  sm:[&>span]:h-3 sm:[&>span]:w-3 ${isRtl ? "sm:data-[state=checked]:[&>span]:-translate-x-5" : "sm:data-[state=checked]:[&>span]:translate-x-5"}`}
                                    />
                                </div>
                            </div>
                        </div>
                    )}
                </div>
                {/* Property Description */}
                <div>
                    <Label htmlFor="property-description" className="font-medium mb-2 block text-gray-800">
                        {t("propertyDescription")} {isRequiredLanguage(selectedLanguage) && <span className="text-red-500">*</span>}
                    </Label>
                    <Textarea
                        id="property-description"
                        value={isDefaultLanguage(selectedLanguage) || selectedLanguage === activeLanguage
                            ? propertyFormData.propertyDescription
                            : getTranslationValue(selectedLanguage, "description")}
                        name="description"
                        onChange={(e) => handleFieldChange(e, "description")}
                        placeholder={t("enterPropertyDescription")}
                        className="w-full h-full px-3 py-2 rounded-md focus:outline-none focus:border-none primaryBackgroundBg focus:border-transparent"
                    />
                </div>
            </div>

            {/* Next Button */}
            <div className="flex justify-end">
                <Button
                    onClick={() => handleCheckRequiredFields("propertyDetails", "seoSettings")}
                    className="px-10 py-5"
                >
                    {isEditing ? t("save") : t("next")}
                </Button>
            </div>
        </>
    )
}

export default PropertyDetailsTab