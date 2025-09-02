"use client"
import { useState, useEffect } from 'react'
import { useTranslation } from '@/components/context/TranslationContext'
import { Skeleton } from "@/components/ui/skeleton"
import { getCategoriesApi, postProjectApi } from '@/api/apiRoutes'
import ImageWithPlaceholder from '@/components/image-with-placeholder/ImageWithPlaceholder'
import toast from 'react-hot-toast'
import { generateSlug } from '@/utils/helperFunction'
import { useSelector } from 'react-redux'
import { useRouter } from 'next/router'
import LocationComponent from '@/components/reusable-components/add-property/LocationComponent'
import ImagesVideoTab from '@/components/reusable-components/add-project/ImagesVideoTab'
import SEODetailsTab from '@/components/reusable-components/add-property/SEODetailsTab'
import ProjectDetailsTab from '@/components/reusable-components/add-project/ProjectDetailsTab'
import FloorDetails from '@/components/reusable-components/add-project/FloorDetails'
import React from 'react'
import Swal from 'sweetalert2'
import successMark from '@/assets/SuccessTick.gif'

const AddProject = () => {
    const router = useRouter()
    const { locale } = router?.query
    const userData = useSelector(state => state.User?.data)
    const languages = useSelector(state => state.LanguageSettings?.languages) || []
    const activeLanguage = useSelector(state => state.LanguageSettings?.active_language)
    const websettings = useSelector(state => state.WebSetting?.data)
    const t = useTranslation()
    const [activeTab, setActiveTab] = useState("categories")
    const [isCategoriesLoading, setIsCategoriesLoading] = useState(true)
    const [isFetchingMore, setIsFetchingMore] = useState(false)
    const [categories, setCategories] = useState([])
    const [hasMoreCategories, setHasMoreCategories] = useState(false)
    const limit = 12
    const [offset, setOffset] = useState(0)
    const [showLoader, setShowLoader] = useState(false);

    // Find the active language object from the languages array
    const activeLanguageObj = React.useMemo(() => {
        if (!activeLanguage || !languages.length) return null;
        return languages.find(lang => lang.code === activeLanguage) || null;
    }, [activeLanguage, languages]);

    const [selectedLanguage, setSelectedLanguage] = useState(activeLanguageObj || activeLanguage || "English");
    const [translations, setTranslations] = useState([]);

    const GoogleMapApiKey = process.env.NEXT_PUBLIC_GOOGLE_API;

    // Tab components
    const tabItems = [
        { id: "categories", label: t("categories") },
        { id: "projectDetails", label: t("projectDetails") },
        { id: "seoSettings", label: t("seoSettings") },
        { id: "location", label: t("location") },
        { id: "floorDetails", label: t("floorDetails") },
        { id: "imagesVideo", label: t("imagesVideo") },
    ]

    // Property Details Form State
    const [selectedCategory, setSelectedCategory] = useState("")

    // Project Details Form State
    const [projectFormData, setProjectFormData] = useState({
        projectType: "upcoming",
        projectTitle: "",
        projectSlug: "",
        projectDescription: "",
    })

    // SEO Settings Form State
    const [seoFormData, setSeoFormData] = useState({
        metaTitle: "",
        metaKeywords: "",
        metaDescription: "",
        ogImage: null
    })

    // Floor Details Form State
    const [floorFormData, setFloorFormData] = useState([
        { floorTitle: '', floorImage: null }
    ]);

    // Combined Media Form State
    const [mediaFormData, setMediaFormData] = useState({
        titleImage: null,
        documents: [],
        galleryImages: [],
        videoLink: ''
    });

    // Location Form State
    const [selectedLocationAddress, setSelectedLocationAddress] = useState({
        city: '',
        state: '',
        country: '',
        formattedAddress: '',
        latitude: 0,
        longitude: 0
    });

    // Handle removing any type of media
    const handleRemoveMedia = (type, index, id = null) => {
        setMediaFormData(prev => {
            const updatedMedia = [...prev[type]];
            updatedMedia.splice(index, 1);
            return {
                ...prev,
                [type]: updatedMedia
            };
        });
    };

    // For backward compatibility with editing mode
    const handleRemoveGalleryImages = (index, id) => {
        // If the ID exists, you might want to track it for backend deletion
        // For now, just use the generic removal function
        handleRemoveMedia('galleryImages', index);
    };

    const handleRemoveDocuments = (index, id) => {
        // If the ID exists, you might want to track it for backend deletion
        // For now, just use the generic removal function
        handleRemoveMedia('documents', index);
    };

    // Handle multilingual data changes
    const handleMultiLangChange = (language, field, value) => {
        setTranslations(prev => {
            // Find if we already have a translation for this language
            const existingIndex = prev.findIndex(item =>
                item.language_id === language.id ||
                item.language_id === language
            );

            // Create a new array to avoid mutating the previous state
            const newTranslations = [...prev];

            if (existingIndex !== -1) {
                // Update existing translation
                newTranslations[existingIndex] = {
                    ...newTranslations[existingIndex],
                    [field]: value
                };
            } else {
                // Add new translation
                newTranslations.push({
                    language_id: language.id || language,
                    [field]: value
                });
            }

            return newTranslations;
        });
    };

    // Update property form field handler
    const handleUpdateProjectForm = (e, customName, customValue) => {
        // For radio inputs and custom events where e.target might not have name/value
        if (customName && customValue !== undefined) {
            setProjectFormData(prev => ({
                ...prev,
                [customName]: customValue
            }));
            return;
        }

        // For standard form events (input, textarea)
        if (e && e.target) {
            const { name, value, type, checked } = e.target;

            // Handle title input for English language
            if (name === "title" && selectedLanguage === "English") {
                setProjectFormData(prev => ({
                    ...prev,
                    projectTitle: value,
                    projectSlug: generateSlug(value)
                }));
                return;
            }

            // Handle description input for English language
            if (name === "description" && selectedLanguage === "English") {
                setProjectFormData(prev => ({
                    ...prev,
                    projectDescription: value
                }));
                return;
            }

            if (name === "projectTitle") {
                setProjectFormData(prev => ({
                    ...prev,
                    [name]: value,
                    projectSlug: generateSlug(value)
                }));
                return;
            }
            // Handle checkbox/switch inputs
            if (type === 'checkbox') {
                setProjectFormData(prev => ({
                    ...prev,
                    [name]: checked
                }));
                return;
            }

            // Handle regular inputs
            setProjectFormData(prev => ({
                ...prev,
                [name]: value
            }));
        }
    }

    const handleFillSeoFormData = (e, customName, customValue) => {
        // If we have direct customName and customValue (from TagInput)
        if (customName && customValue !== undefined) {
            setSeoFormData(prev => ({
                ...prev,
                [customName]: customValue
            }))
            return
        }

        // For standard form events (input, textarea)
        if (e && e.target) {
            const { name, value } = e.target
            setSeoFormData(prev => ({
                ...prev,
                [name]: value
            }))
        }
    }

    const handleCheckRequiredFields = (currentTab, nextTab) => {
        let missingFields = false;

        switch (currentTab) {
            case "categories":
                if (!selectedCategory) {
                    toast.error(t("pleaseSelectCategory"));
                    missingFields = true;
                }
                break;

            case "projectDetails":
                if (!projectFormData.projectTitle) {
                    toast.error(t("projectTitleIsRequired"));
                    missingFields = true;
                    break;
                }

                if (!projectFormData.projectDescription) {
                    toast.error(t("projectDescriptionIsRequired"));
                    missingFields = true;
                    break;
                }
                break;
            case "location":
                if (!selectedLocationAddress.city) {
                    toast.error(t("cityIsRequired"));
                    missingFields = true;
                    break;
                }

                if (!selectedLocationAddress.state) {
                    toast.error(t("stateIsRequired"));
                    missingFields = true;
                    break;
                }

                if (!selectedLocationAddress.country) {
                    toast.error(t("countryIsRequired"));
                    missingFields = true;
                    break;
                }

                if (!selectedLocationAddress.formattedAddress) {
                    toast.error(t("addressIsRequired"));
                    missingFields = true;
                    break;
                }
                break;

            case "imagesVideo":
                if (!mediaFormData.titleImage) {
                    toast.error(t("projectTitleImageIsRequired"));
                    missingFields = true;
                    break;
                }
                break;

            default:
                break;
        }

        if (!missingFields) {
            if (nextTab === "submit") {
                handlePostProject();
            } else {
                setActiveTab(nextTab);
            }
        }
    };

    const handleFetchCategories = async (currentOffset = 0, isInitial = false) => {
        if (isInitial) {
            setIsCategoriesLoading(true)
            setOffset(0) // Reset offset when initializing
        } else {
            setIsFetchingMore(true)
        }

        try {
            const res = await getCategoriesApi({ limit, offset: currentOffset, passHasProperty: false })

            if (isInitial) {
                setCategories(res.data)
            } else {
                setCategories(prev => [...prev, ...res.data])
            }

            setHasMoreCategories(res.data.length >= limit)
        } catch (error) {
            console.error("Failed to fetch categories:", error)
        } finally {
            setIsCategoriesLoading(false)
            setIsFetchingMore(false)
        }
    }

    const handleLoadMoreCategories = async () => {
        if (!isFetchingMore && hasMoreCategories) {
            const newOffset = offset + limit
            setOffset(newOffset)
            await handleFetchCategories(newOffset, false)
        }
    };

    const handleTabChange = (value) => {
        setActiveTab(value);
        // Reset language selection to default/active language when switching tabs
        setSelectedLanguage(activeLanguageObj || activeLanguage || "English");
    };

    const handleSelectCategory = (category) => {
        setSelectedCategory(category);
        handleTabChange("projectDetails");
    };

    const handleRemoveCategory = () => {
        setSelectedCategory(null);
        setActiveTab("categories");
    };

    const handleLocationSelect = (address) => {
        // Update the form field with the selected address from the Map component
        setSelectedLocationAddress(prev => ({
            ...prev,
            city: address.city || prev.city,
            state: address.state || prev.state,
            country: address.country || prev.country,
            formattedAddress: address.formattedAddress || prev.formattedAddress,
            latitude: address.latitude || address.lat || prev.latitude,
            longitude: address.longitude || address.lng || prev.longitude
        }));
    };

    // Only fetch categories on initial component mount
    useEffect(() => {
        if (activeTab === "categories" && categories.length === 0) {
            handleFetchCategories(0, true)
        } else if (categories?.length > 0) {
            handleFetchCategories(0, true)
        }
    }, [activeTab, categories.length, activeLanguage]);

    useEffect(() => {
    }, [activeLanguage])

    // Category selection skeleton loader
    const CategorySkeleton = () => (
        <div className="flex items-center justify-center p-4 rounded-lg primaryBackgroundBg gap-3">
            <Skeleton className="h-12 w-12 rounded-full bg-gray-200" />
            <Skeleton className="h-6 w-24 bg-gray-200" />
        </div>
    );

    const handlePostProject = async () => {
        try {
            setShowLoader(true);
            const plans = []; // Initialize an empty array for plans

            // Loop through floorFields and push each entry into plans array
            for (const field of floorFormData) {
                const title = field.floorTitle;
                const document = field.floorImage;

                // Loop through documents array to handle multiple images
                // for (const document of documents) {
                if (document) {
                    plans.push({
                        id: "",
                        title: title,
                        document: document,
                        // You may need to adjust these fields based on your data structure
                    });
                }
            }

            // Format translations for API
            const formattedTranslations = translations.map((translation, index) => ({
                translation_id: index,
                language_id: translation.language_id,
                title: translation.title || "",
                description: translation.description || ""
            }));

            const data = {
                category_id: selectedCategory.id,
                title: projectFormData.projectTitle,
                description: projectFormData.projectDescription,
                slug: projectFormData.projectSlug,
                type: projectFormData.projectType,

                // SEO Details
                meta_title: seoFormData.metaTitle,
                meta_description: seoFormData.metaDescription,
                meta_keywords: seoFormData.metaKeywords,
                meta_image: seoFormData.ogImage,
                // Location Details
                city: selectedLocationAddress.city,
                state: selectedLocationAddress.state,
                country: selectedLocationAddress.country,
                location: selectedLocationAddress.formattedAddress,
                latitude: selectedLocationAddress.latitude,
                longitude: selectedLocationAddress.longitude,

                // Floor Details
                plans: plans,

                // Media Details
                image: mediaFormData.titleImage, // Main title image
                gallery_images: mediaFormData.galleryImages,
                documents: mediaFormData.documents,
                video_link: mediaFormData.videoLink,

                // Translations
                translations: formattedTranslations
            };

            // Make the API call
            const response = await postProjectApi(data);

            if (!response?.error) {
                // toast.success(t("projectAddedSuccessfully"));
                // // Redirect to projects listing
                // router.push(`/${locale}/user/projects`);
                Swal.fire({
                    imageUrl: successMark.src,
                    imageWidth: 160,
                    imageHeight: 160,
                    title: t("projectSubmittedSuccess"),
                    text: !websettings?.auto_approve
                        ? websettings?.text_project_submission
                        : "",
                    allowOutsideClick: false,
                    showCancelButton: false,
                    customClass: {
                        confirmButton: "Swal-confirm-buttons",
                        cancelButton: "Swal-cancel-buttons",
                    },
                    confirmButtonText: t("ok"),
                }).then((result) => {
                    router.push(`/${locale}/user/projects`);
                });
            } else {
                toast.error(t(response?.message) || t("somethingWentWrong"));
            }
        } catch (error) {
            console.error("Error adding project:", error);
            toast.error(t(error?.response?.data?.message) || t(error?.message) || t("somethingWentWrong"));
        } finally {
            setShowLoader(false);
        }
    };

    return (
        <div className="space-y-4">
            <h1 className="text-2xl font-semibold">{t("addProject")}</h1>

            <div className="bg-white">
                {/* Custom Tab Navigation */}
                <div className="border-b">
                    <div className="flex overflow-x-auto">
                        {tabItems.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => handleTabChange(tab.id)}
                                className={`relative px-6 py-3 rounded-none border-b-2 whitespace-nowrap ${activeTab === tab.id
                                    ? "primaryBorderColor primaryColor"
                                    : "border-transparent text-gray-500 hover:text-gray-700"
                                    }`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Tab Content */}
                <div className="p-6">
                    {activeTab === "categories" ? (
                        <>
                            <div className="flex flex-wrap items-center gap-4">
                                {isCategoriesLoading ? (
                                    // Show skeletons when initially loading
                                    Array.from({ length: 5 }).map((_, index) => (
                                        <CategorySkeleton key={index} />
                                    ))
                                ) : (
                                    // Show categories when loaded
                                    categories.map((category) => (
                                        <div
                                            key={category.id}
                                            className={`flex items-center justify-center p-4 rounded-lg cursor-pointer transition-colors duration-500 primaryBackgroundBg gap-3 hover:primaryBg hover:text-white ${selectedCategory && selectedCategory?.id === category.id ? "!primaryBg text-white" : ""}`}
                                            onClick={() => handleSelectCategory(category)}
                                        >
                                            <div className="w-10 h-10 flex justify-center items-center bg-white rounded-full">
                                                <ImageWithPlaceholder src={category.image} alt={category.translated_name || category.category} className="w-7 h-7" />
                                            </div>
                                            <span className="text-lg font-semibold">{category.translated_name || category?.category}</span>
                                        </div>
                                    ))
                                )}
                            </div>
                            {/* Show loading indicators when fetching more */}
                            {isFetchingMore && (
                                <div className="flex flex-wrap items-center gap-4 mt-4">
                                    {Array.from({ length: 3 }).map((_, index) => (
                                        <CategorySkeleton key={`more-${index}`} />
                                    ))}
                                </div>
                            )}

                            {/* Load More Button and Loading Indicator */}
                            {!isCategoriesLoading && hasMoreCategories && (
                                <div className="flex justify-center mt-6">
                                    <button
                                        onClick={handleLoadMoreCategories}
                                        className="border primaryColor primaryBorderColor px-4 py-2 rounded-md disabled:opacity-70"
                                        disabled={isFetchingMore}
                                    >
                                        {isFetchingMore ? t("loading") : t("loadMore")}
                                    </button>
                                </div>
                            )}
                        </>
                    ) : (
                        <>
                            {activeTab === "projectDetails" && (
                                <div className="flex flex-col gap-12">
                                    <ProjectDetailsTab
                                        selectedCategory={selectedCategory}
                                        handleRemoveCategory={handleRemoveCategory}
                                        projectFormData={projectFormData}
                                        handleUpdateProjectForm={handleUpdateProjectForm}
                                        handleCheckRequiredFields={handleCheckRequiredFields}
                                        selectedLanguage={selectedLanguage}
                                        setSelectedLanguage={setSelectedLanguage}
                                        languages={languages}
                                        translations={translations}
                                        handleMultiLangChange={handleMultiLangChange}
                                    />
                                </div>
                            )}

                            {activeTab === "seoSettings" && (
                                <SEODetailsTab
                                    handleTabChange={handleTabChange}
                                    seoFormData={seoFormData}
                                    handleFillSeoFormData={handleFillSeoFormData}
                                    isProperty={false}
                                />
                            )}

                            {activeTab === "floorDetails" && (
                                <FloorDetails
                                    floorFormData={floorFormData}
                                    setFloorFormData={setFloorFormData}
                                    handleCheckRequiredFields={handleCheckRequiredFields}
                                />
                            )}

                            {activeTab === "location" && (
                                <LocationComponent
                                    selectedLocationAddress={selectedLocationAddress}
                                    setSelectedLocationAddress={setSelectedLocationAddress}
                                    apiKey={GoogleMapApiKey}
                                    handleLocationSelect={handleLocationSelect}
                                    handleCheckRequiredFields={handleCheckRequiredFields}
                                    isProperty={false}
                                />
                            )}

                            {activeTab === "imagesVideo" && (
                                <ImagesVideoTab
                                    showLoader={showLoader}
                                    handleCheckRequiredFields={handleCheckRequiredFields}
                                    mediaFormData={mediaFormData}
                                    setMediaFormData={setMediaFormData}
                                    handleRemoveGalleryImages={handleRemoveGalleryImages}
                                    handleRemoveDocuments={handleRemoveDocuments}
                                />
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    )
}

export default AddProject