import React, { useCallback, useMemo, useEffect, useRef } from 'react'
import { useDropzone } from 'react-dropzone'
import { FaTimes } from 'react-icons/fa'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useTranslation } from '@/components/context/TranslationContext'
import Image from 'next/image'

// Images & Video Tab Component for Projects
const ImagesVideoTab = ({
    showLoader,
    handleCheckRequiredFields,
    mediaFormData,
    setMediaFormData,
    isEditing = false,
    handleRemoveGalleryImages,
    handleRemoveDocuments,
    handleRemoveMedia: parentHandleRemoveMedia
}) => {
    const t = useTranslation();

    // Create refs to store object URLs to prevent recreation on every render
    const titleImageUrl = useRef(null);
    const galleryImageUrls = useRef(new Map());

    // Clean up object URLs when component unmounts
    useEffect(() => {
        // Capture current ref values for cleanup
        const titleImgUrl = titleImageUrl.current;
        const galleryImgUrls = galleryImageUrls.current;

        return () => {
            // Revoke all object URLs to prevent memory leaks
            if (titleImgUrl) {
                URL.revokeObjectURL(titleImgUrl);
            }
            [...galleryImgUrls.values()].forEach(url => {
                URL.revokeObjectURL(url);
            });
        };
    }, []);

    // Create or get cached object URL for a file
    const getObjectUrl = (file, urlMap) => {
        // If file is already a string URL, return it directly
        if (typeof file === 'string') return file;
        if (!file) return null;

        try {
            // Use file name or object ID as key
            const fileId = file.name || file.id || Date.now().toString();

            if (!urlMap.current.has(fileId)) {
                const url = URL.createObjectURL(file);
                urlMap.current.set(fileId, url);
            }

            return urlMap.current.get(fileId);
        } catch (error) {
            console.error("Error creating object URL:", error);
            return "";
        }
    };

    // Get object URL for title image
    const getTitleImageUrl = (file) => {
        // If file is already a string URL, return it directly
        if (typeof file === 'string') return file;
        if (!file) return null;

        try {
            if (!titleImageUrl.current) {
                titleImageUrl.current = URL.createObjectURL(file);
            }
            return titleImageUrl.current;
        } catch (error) {
            console.error("Error creating object URL:", error);
            return "";
        }
    };

    // Get gallery image URL - ensure fresh URL creation for each file
    const getGalleryImageUrl = (file) => {
        // If file is already a string URL, return it directly
        if (typeof file === 'string') return file;
        if (!file) return null;

        try {
            // Use file name or id as key
            const fileId = file.name || file.id || Date.now().toString();

            if (!galleryImageUrls.current.has(fileId)) {
                const url = URL.createObjectURL(file);
                galleryImageUrls.current.set(fileId, url);
            }

            return galleryImageUrls.current.get(fileId);
        } catch (error) {
            console.error("Error creating object URL:", error);
            return "";
        }
    };

    // Local removal handler as a separate function
    const handleLocalRemove = useCallback((mediaType, index) => {
        if (mediaType === 'titleImage') {
            setMediaFormData(prev => ({
                ...prev,
                titleImage: null
            }));

            // Clean up object URL if it exists and is for a File
            if (titleImageUrl.current && typeof mediaFormData.titleImage !== 'string') {
                try {
                    URL.revokeObjectURL(titleImageUrl.current);
                } catch (error) {
                    console.error("Error revoking object URL:", error);
                }
                titleImageUrl.current = null;
            }
            return;
        }

        setMediaFormData(prev => {
            const updatedMedia = [...prev[mediaType]];
            updatedMedia.splice(index, 1);
            return {
                ...prev,
                [mediaType]: updatedMedia
            };
        });
    }, [mediaFormData.titleImage, setMediaFormData]);

    // Generic media removal handler
    const handleRemoveMedia = useCallback((mediaType, index) => {

        // When in editing mode and parent provided a removal handler, use it
        if (isEditing && parentHandleRemoveMedia) {
            try {
                if (mediaType === 'titleImage') {
                    parentHandleRemoveMedia(mediaType, 0); // 0 is just a placeholder
                } else {
                    parentHandleRemoveMedia(mediaType, index);
                }
            } catch (error) {
                console.error("Error in parent handler:", error);
                // Fallback to local handling if parent handler fails
                handleLocalRemove(mediaType, index);
            }
            return;
        }

        // Default behavior for non-editing mode
        handleLocalRemove(mediaType, index);
    }, [isEditing, parentHandleRemoveMedia, handleLocalRemove]);

    // Project Title Image Handler
    const onDropTitleImage = useCallback((acceptedFiles) => {
        if (acceptedFiles.length > 0) {
            const file = acceptedFiles[0]; // Take only the first file

            // Clean up previous URL if exists
            if (titleImageUrl.current) {
                URL.revokeObjectURL(titleImageUrl.current);
                titleImageUrl.current = null;
            }

            setMediaFormData(prev => ({
                ...prev,
                titleImage: file
            }));
        }
    }, [setMediaFormData]);

    const {
        getRootProps: getTitleImageRootProps,
        getInputProps: getTitleImageInputProps,
        isDragActive: isTitleImageDragActive
    } = useDropzone({
        onDrop: onDropTitleImage,
        accept: {
            'image/jpeg': ['.jpeg', '.jpg'],
            'image/png': ['.png'],
            'image/webp': ['.webp']
        },
        multiple: false
    });

    // Document Handler
    const onDropDocuments = useCallback((acceptedFiles) => {
        setMediaFormData(prev => ({
            ...prev,
            documents: [...prev.documents, ...acceptedFiles]
        }));
    }, [setMediaFormData]);

    const removeDocument = useCallback((index, docId) => {
        if (isEditing && handleRemoveDocuments) {
            handleRemoveDocuments(index, docId);
            return;
        }

        handleRemoveMedia('documents', index);
    }, [isEditing, handleRemoveDocuments, handleRemoveMedia]);

    const {
        getRootProps: getDocumentRootProps,
        getInputProps: getDocumentInputProps,
        isDragActive: isDocumentDragActive
    } = useDropzone({
        onDrop: onDropDocuments,
        accept: {
            'application/pdf': ['.pdf'],
            'application/msword': ['.doc', '.docx'],
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx']
        },
        multiple: true
    });

    // Gallery Images Handler
    const onDropGallery = useCallback((acceptedFiles) => {
        setMediaFormData(prev => ({
            ...prev,
            galleryImages: [...prev.galleryImages, ...acceptedFiles]
        }));
    }, [setMediaFormData]);

    const removeGalleryImage = useCallback((index, id) => {
        if (isEditing && handleRemoveGalleryImages) {
            handleRemoveGalleryImages(index, id);
            return;
        }

        handleRemoveMedia('galleryImages', index);
    }, [isEditing, handleRemoveGalleryImages, handleRemoveMedia]);

    const {
        getRootProps: getGalleryRootProps,
        getInputProps: getGalleryInputProps,
        isDragActive: isGalleryDragActive
    } = useDropzone({
        onDrop: onDropGallery,
        accept: {
            'image/jpeg': ['.jpeg', '.jpg'],
            'image/png': ['.png'],
            'image/webp': ['.webp']
        },
        multiple: true
    });

    // Video link handler
    const handleVideoInputChange = (e) => {
        setMediaFormData(prev => ({ ...prev, videoLink: e.target.value }));
    };

    // Render title image
    const titleImageElement = useMemo(() => {
        if (!mediaFormData.titleImage) return null;

        try {
            // Move getTitleImageUrl inside useMemo to fix dependency warning
            const getTitleImgUrl = (file) => {
                // If file is already a string URL, return it directly
                if (typeof file === 'string') return file;
                if (!file) return null;

                try {
                    if (!titleImageUrl.current) {
                        titleImageUrl.current = URL.createObjectURL(file);
                    }
                    return titleImageUrl.current;
                } catch (error) {
                    console.error("Error creating object URL:", error);
                    return "";
                }
            };

            const file = mediaFormData.titleImage;
            // For string URLs, use directly. For File objects, use object URL
            const imageUrl = typeof file === 'string' ? file : getTitleImgUrl(file);

            return (
                <div className="relative mb-2 rounded-md overflow-hidden w-full">
                    <Image
                        height={0}
                        width={0}
                        src={imageUrl || '/placeholder-image.png'} // Fallback to placeholder if URL is null
                        alt="Title image preview"
                        className="w-full h-[150px] object-cover"
                        onError={(e) => {
                            console.error("Image failed to load");
                            e.target.src = '/placeholder-image.png'; // Use placeholder on error
                        }}
                    />
                    <button
                        className="absolute top-2 right-2 bg-black rounded-full p-1 text-white hover:bg-gray-800"
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleRemoveMedia('titleImage');
                        }}
                    >
                        <FaTimes size={14} />
                    </button>
                    <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-xs px-2 py-1 flex justify-between items-center">
                        <div className="flex items-center">
                            <span className="text-xs font-medium mr-1">{typeof file === 'string' ? file.split('/').pop() || t("file") : file.name || t("file")}</span>
                        </div>
                        <span className="text-xs">{typeof file !== 'string' && file.size ? Math.round(file.size / 1024) + ' KB' : ''}</span>
                    </div>
                </div>
            );
        } catch (error) {
            console.error("Error rendering title image:", error);
            return null;
        }
    }, [mediaFormData.titleImage, handleRemoveMedia, t]);

    // Render documents
    const documentFiles = useMemo(() => {
        // Function to handle document removal inside the useMemo
        const handleRemoveDoc = (index, docId) => {
            removeDocument(index, docId);
        };

        return mediaFormData.documents.map((file, index) => {
            try {
                return (
                    <div key={index} className="relative mb-2 p-3 bg-white border rounded-md flex items-center justify-between w-full">
                        <div className="flex items-center gap-2 overflow-hidden">
                            <span className="truncate">{file instanceof File ? file.name : file.name.split('/').pop() || t("file")}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-xs text-gray-500">{typeof file !== 'string' && file.size ? Math.round(file.size / 1024) + ' KB' : ''}</span>
                            <button
                                className="bg-black rounded-full p-1 text-white hover:bg-gray-800"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleRemoveDoc(index, typeof file === 'string' ? file : file.id);
                                }}
                            >
                                <FaTimes size={14} />
                            </button>
                        </div>
                    </div>
                );
            } catch (error) {
                console.error(`Error rendering document at index ${index}:`, error);
                return null;
            }
        }).filter(Boolean);
    }, [mediaFormData.documents, t, removeDocument]);

    // Render gallery images
    const galleryImageFiles = useMemo(() => {
        // Move getObjectUrl inside useMemo to fix dependency warning
        const getImageUrl = (file) => {
            // If file is already a string URL, return it directly
            if (typeof file === 'string') return file;
            if (!file) return null;

            try {
                // Use file name or object ID as key
                const fileId = file.name || file.id || Date.now().toString();

                if (!galleryImageUrls.current.has(fileId)) {
                    const url = URL.createObjectURL(file);
                    galleryImageUrls.current.set(fileId, url);
                }

                return galleryImageUrls.current.get(fileId);
            } catch (error) {
                console.error("Error creating object URL:", error);
                return "";
            }
        };

        return mediaFormData.galleryImages.map((file, index) => {
            try {
                // For string URLs, use directly. For File objects, use object URL
                const imageUrl = file instanceof File ? getImageUrl(file) : file.name;

                return (
                    <div key={index} className="relative mb-2 rounded-md overflow-hidden w-full">
                        <Image
                            height={0}
                            width={0}
                            src={imageUrl || '/placeholder-image.png'}
                            alt={`preview-${index}`}
                            className="w-full h-[150px] object-cover"
                            onError={(e) => {
                                console.error(`Gallery image ${index} failed to load`);
                                e.target.src = '/placeholder-image.png'; // Use placeholder on error
                            }}
                        />
                        <button
                            className="absolute top-2 right-2 bg-black rounded-full p-1 text-white hover:bg-gray-800"
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                removeGalleryImage(index, typeof file === 'string' ? file : file.id);
                            }}
                        >
                            <FaTimes size={14} />
                        </button>
                        <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-xs px-2 py-1 flex justify-between items-center">
                            <div className="flex items-center">
                                <span className="text-xs font-medium mr-1">{typeof file.name === 'string' ? file.name.split('/').pop() || t("file") : file.name || t("file")}</span>
                            </div>
                            <span className="text-xs">{typeof file !== 'string' && file.size ? Math.round(file.size / 1024) + ' KB' : ''}</span>
                        </div>
                    </div>
                );
            } catch (error) {
                console.error(`Error rendering gallery image at index ${index}:`, error);
                return null;
            }
        }).filter(Boolean);
    }, [mediaFormData.galleryImages, removeGalleryImage, t]);


    return (
        <div className="flex flex-col gap-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Project Title Image */}
                <div className="space-y-2">
                    <Label htmlFor="title-image" className="font-medium text-gray-800">
                        {t("projectTitleImage")} <span className="text-red-500">*</span>
                    </Label>
                    <div className="primaryBackgroundBg rounded-md">
                        <div
                            {...getTitleImageRootProps()}
                            className={`border border-dashed p-4 rounded-md cursor-pointer transition-colors duration-200 flex flex-col items-center justify-center min-h-[120px] ${isTitleImageDragActive ? 'border-primary bg-primary/5' : 'border-gray-300'}`}
                        >
                            <input {...getTitleImageInputProps()} />
                            {mediaFormData.titleImage ? (
                                titleImageElement
                            ) : (
                                <div className="text-center text-gray-500">
                                    {isTitleImageDragActive ? (
                                        <span>{t("dropToUpload")}</span>
                                    ) : (
                                        <span>
                                            {t("dragDrop")} <span className="underline">{t("browse")}</span>
                                        </span>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Project Documents */}
                <div className="space-y-2">
                    <Label htmlFor="documents" className="font-medium text-gray-800">
                        {t("documents")}
                    </Label>
                    <div className="primaryBackgroundBg rounded-md">
                        <div
                            {...getDocumentRootProps()}
                            className={`border border-dashed p-4 rounded-md cursor-pointer transition-colors duration-200 flex flex-col items-center justify-center min-h-[120px] ${isDocumentDragActive ? 'border-primary bg-primary/5' : 'border-gray-300'}`}
                        >
                            <input {...getDocumentInputProps()} />
                            <div className="w-full">
                                <div className="text-center text-gray-500 mb-3">
                                    {isDocumentDragActive ? (
                                        <span>{t("dropToUpload")}</span>
                                    ) : (
                                        <span>
                                            {t("dragDrop")} <span className="underline">{t("browse")}</span>
                                        </span>
                                    )}
                                </div>
                                {documentFiles.length > 0 && (
                                    <div className="w-full space-y-2">
                                        {documentFiles}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Gallery Images */}
                <div className="space-y-2">
                    <Label htmlFor="gallery-images" className="font-medium text-gray-800">
                        {t("galleryImages")}
                    </Label>
                    <div className="primaryBackgroundBg rounded-md">
                        <div
                            {...getGalleryRootProps()}
                            className={`border border-dashed p-4 rounded-md cursor-pointer transition-colors duration-200 flex flex-col items-center justify-center min-h-[120px] ${isGalleryDragActive ? 'border-primary bg-primary/5' : 'border-gray-300'}`}
                        >
                            <input {...getGalleryInputProps()} />
                            <div className="w-full">
                                <div className="text-center text-gray-500 mb-3">
                                    {isGalleryDragActive ? (
                                        <span>{t("dropToUpload")}</span>
                                    ) : (
                                        <span>
                                            {t("dragDrop")} <span className="underline">{t("browse")}</span>
                                        </span>
                                    )}
                                </div>
                                {galleryImageFiles.length > 0 && (
                                    <div className="w-full space-y-2">
                                        {galleryImageFiles}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Video Link */}
                <div className="space-y-2">
                    <Label htmlFor="video-link" className="font-medium text-gray-800">
                        {t("videoLink")}
                    </Label>
                    <Input
                        type="text"
                        id="video-link"
                        placeholder={t("enterVideoLink")}
                        value={mediaFormData.videoLink}
                        onChange={handleVideoInputChange}
                        className="w-full px-3 py-2 primaryBackgroundBg rounded-md focus:outline-none focus:border-none focus:border-transparent"
                    />
                </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end">
                <Button
                    disabled={showLoader}
                    onClick={() => {
                        handleCheckRequiredFields("imagesVideo", "submit");
                    }}
                    className="px-10 py-5"
                >
                    {showLoader ? t("submitting") : isEditing ? t("updateProject") : t("submitProject")}
                </Button>
            </div>
        </div>
    );
};

export default ImagesVideoTab; 