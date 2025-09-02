import React, { useState, useEffect, useMemo, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { FaTimes } from 'react-icons/fa'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { Textarea } from '@/components/ui/textarea'
import { FaInfoCircle } from 'react-icons/fa'
import { useTranslation } from '@/components/context/TranslationContext'
import TagInput from './TagInput'
import Image from 'next/image'

// SEODetailsTab Component
const SEODetailsTab = ({
    handleTabChange,
    seoFormData,
    handleFillSeoFormData,
    handleSeoImageUpload,
    isEditing = false,
    isProperty = true
}) => {
    const t = useTranslation();
    // OG Image State and Handler
    const [uploadedOgImage, setUploadedOgImage] = useState([]);

    const onDropOgImage = useCallback((acceptedFiles) => {
        if (acceptedFiles && acceptedFiles.length > 0) {
            setUploadedOgImage([acceptedFiles[0]]);

            // Use the new handler if in editing mode, otherwise use the old one
            if (isEditing && handleSeoImageUpload) {
                handleSeoImageUpload(acceptedFiles[0]);
            } else {
                handleFillSeoFormData(null, "ogImage", acceptedFiles[0]);
            }
        }
    }, [isEditing, handleSeoImageUpload, handleFillSeoFormData]);

    const removeOgImage = (index) => {
        setUploadedOgImage([]);
        handleFillSeoFormData(null, "ogImage", null);
    };

    const {
        getRootProps: getOgImageRootProps,
        getInputProps: getOgImageInputProps,
        isDragActive: isOgImageDragActive
    } = useDropzone({
        onDrop: onDropOgImage,
        accept: {
            'image/jpeg': ['.jpeg', '.jpg'],
            'image/png': ['.png'],
            'image/webp': ['.webp']
        },
        multiple: false
    });

    // Set initial OG image if it exists in seoFormData
    useEffect(() => {
        if (seoFormData.ogImage && uploadedOgImage.length === 0) {
            setUploadedOgImage([seoFormData.ogImage]);
        }
    }, [seoFormData.ogImage, uploadedOgImage.length]);

    // Render OG image
    const ogImageFiles = useMemo(() =>
        uploadedOgImage.map((file, index) => (
            <div key={index} className="relative mb-2 rounded-md overflow-hidden w-full">
                <Image
                    src={file instanceof File ? URL.createObjectURL(file) : file}
                    alt={`preview-${index}`}
                    className="w-full h-[150px] object-cover"
                    width={0}
                    height={0}
                />
                <button
                    className="absolute top-2 right-2 bg-black rounded-full p-1 text-white hover:bg-gray-800"
                    onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        removeOgImage(index);
                    }}
                >
                    <FaTimes size={14} />
                </button>
                <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-xs px-2 py-1 flex justify-between items-center">
                    <div className="flex items-center">
                        <span className="text-xs font-medium mr-1">{file.name || 'File'}</span>
                    </div>
                    <span className="text-xs">{Math.round(file.size / 1024)} KB</span>
                </div>
            </div>
        )),
        [uploadedOgImage]);

    // Parse keywords into array for tag display
    const keywordsArray = useMemo(() => {
        return seoFormData.metaKeywords
            ? seoFormData.metaKeywords.split(',').filter(k => k.trim().length > 0)
            : [];
    }, [seoFormData.metaKeywords]);

    // SEO validation
    const isTitleValid = seoFormData.metaTitle.length <= 60;
    const isDescriptionValid = seoFormData.metaDescription.length >= 150 && seoFormData.metaDescription.length <= 160;

    return (
        <div className="flex flex-col gap-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Meta Title */}
                <div className="space-y-2">
                    <div className="flex items-center gap-2">
                        <Label htmlFor="meta-title" className="font-medium text-gray-800">
                            {t("metaTitle")}
                        </Label>
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <span className="cursor-help text-gray-500 hover:text-gray-700">
                                        <FaInfoCircle size={14} />
                                    </span>
                                </TooltipTrigger>
                                <TooltipContent className="max-w-xs">
                                    <p>{t("metaTitleTooltip")}</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </div>
                    <Input
                        type="text"
                        id="metaTitle"
                        value={seoFormData.metaTitle}
                        name="metaTitle"
                        maxLength={60}
                        onChange={handleFillSeoFormData}
                        placeholder={t("enterPropertyMetaTitle")}
                        className={`w-full px-3 py-2 primaryBackgroundBg rounded-md focus:outline-none focus:border-none focus:border-transparent ${!isTitleValid ? 'border-red-500' : ''}`}
                    />
                </div>

                {/* OG Image */}
                <div className="space-y-2">
                    <div className="flex items-center gap-2">
                        <Label htmlFor="og-image" className="font-medium text-gray-800">
                            {t("ogImage")}
                        </Label>
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <span className="cursor-help text-gray-500 hover:text-gray-700">
                                        <FaInfoCircle size={14} />
                                    </span>
                                </TooltipTrigger>
                                <TooltipContent className="max-w-xs">
                                    <p>{t("ogImageTooltip")}</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </div>
                    {uploadedOgImage.length > 0 ? (
                        <div className="rounded-md overflow-hidden">{ogImageFiles}</div>
                    ) : (
                        <div className="primaryBackgroundBg rounded-md">
                            <div
                                {...getOgImageRootProps()}
                                className={`border border-dashed p-4 rounded-md cursor-pointer transition-colors duration-200 flex flex-col items-center justify-center min-h-[120px] ${isOgImageDragActive ? 'border-primary bg-primary/5' : 'border-gray-300'}`}
                            >
                                <input {...getOgImageInputProps()} name="ogImage" />
                                <div className="text-center text-gray-500">
                                    {isOgImageDragActive ? (
                                        <span>{t("dropToUpload")}</span>
                                    ) : (
                                        <span>
                                            {t("dragDrop")} <span className="underline">{t("browse")}</span>
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                <div className="space-y-2">
                    <div className="flex items-center gap-2">
                        <Label htmlFor="meta-keyword" className="font-medium text-gray-800">
                            {t("metaKeywords")}
                        </Label>
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <span className="cursor-help text-gray-500 hover:text-gray-700">
                                        <FaInfoCircle size={14} />
                                    </span>
                                </TooltipTrigger>
                                <TooltipContent className="max-w-xs">
                                    <p>{t("metaKeywordsTooltip")}{keywordsArray.length}/{t("maxTags")}.</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </div>
                    <TagInput
                        tags={keywordsArray}
                        setTags={(newTags) => handleFillSeoFormData(null, "metaKeywords", newTags.join(','))}
                        name="metaKeywords"
                        setData={handleFillSeoFormData}
                    // maxTags={10}
                    />
                </div>

                {/* Meta Description */}
                <div className="space-y-2">
                    <div className="flex items-center gap-2">
                        <Label htmlFor="meta-description" className="font-medium text-gray-800">
                            {t("metaDescription")}
                        </Label>
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <span className="cursor-help text-gray-500 hover:text-gray-700">
                                        <FaInfoCircle size={14} />
                                    </span>
                                </TooltipTrigger>
                                <TooltipContent className="max-w-xs">
                                    <p>{t("metaDescriptionTooltip")}{seoFormData.metaDescription.length}</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </div>
                    <Textarea
                        id="metaDescription"
                        value={seoFormData.metaDescription}
                        name="metaDescription"
                        onChange={handleFillSeoFormData}
                        placeholder={t("enterPropertyMetaDescription")}
                        className={`w-full px-3 py-2 primaryBackgroundBg rounded-md focus:outline-none focus:border-none focus:border-transparent resize-none h-24 ${!isDescriptionValid && seoFormData.metaDescription.length > 0 ? "border-red-500" : ""}`}
                    />
                </div>
            </div>

            {/* Navigation Buttons */}
            <div className="flex justify-end">
                <Button
                    onClick={() => handleTabChange(isProperty ? "facilities" : "location")}
                    className="px-10 py-5"
                >
                    {isEditing ? t("save") : t("next")}
                </Button>
            </div>
        </div>
    );
};

export default SEODetailsTab