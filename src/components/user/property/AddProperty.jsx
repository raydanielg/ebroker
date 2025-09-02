"use client"
import { useState, useEffect } from 'react'
import { useTranslation } from '@/components/context/TranslationContext'
import { Skeleton } from "@/components/ui/skeleton"
import { getCategoriesApi, getFacilitiesApi, postPropertyApi } from '@/api/apiRoutes'
import ImageWithPlaceholder from '@/components/image-with-placeholder/ImageWithPlaceholder'
import toast from 'react-hot-toast'
import { generateSlug } from '@/utils/helperFunction'
import { useSelector } from 'react-redux'
import { useRouter } from 'next/router'
import FacilitiesComponent from '@/components/reusable-components/add-property/FacilitiesComponent'
import OutdoorFacilitiesComponent from '@/components/reusable-components/add-property/OutdoorFacilitiesComponent'
import LocationComponent from '@/components/reusable-components/add-property/LocationComponent'
import ImagesVideoTab from '@/components/reusable-components/add-property/ImagesVideoTab'
import SEODetailsTab from '@/components/reusable-components/add-property/SEODetailsTab'
import PropertyDetailsTab from '@/components/reusable-components/add-property/PropertyDetailsTab'
import React from 'react';
import Swal from 'sweetalert2'
import successMark from '@/assets/SuccessTick.gif'

const AddProperty = () => {
    const router = useRouter()
    const { locale } = router?.query
    const websettings = useSelector(state => state.WebSetting?.data)
    const userData = useSelector(state => state.User?.data)
    const languages = useSelector(state => state.LanguageSettings?.languages) || []
    const activeLanguage = useSelector(state => state.LanguageSettings?.active_language)
    const t = useTranslation()
    const [activeTab, setActiveTab] = useState("categories")
    const [isCategoriesLoading, setIsCategoriesLoading] = useState(true)
    const [isFetchingMore, setIsFetchingMore] = useState(false)
    const [categories, setCategories] = useState([])
    const [hasMoreCategories, setHasMoreCategories] = useState(false)
    const limit = 12
    const [offset, setOffset] = useState(0)
    const [facilities, setFacilities] = useState([])
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
        { id: "propertyDetails", label: t("propertyDetails") },
        { id: "seoSettings", label: t("seoSettings") },
        { id: "facilities", label: t("facilities") },
        { id: "outdoorFacilities", label: t("outdoorFacilities") },
        { id: "location", label: t("location") },
        { id: "imagesVideo", label: t("imagesVideo") },
    ]

    // Facility Distances Form State
    const [facilityDistances, setFacilityDistances] = useState({});

    // Category parameters form state
    const [parameterFormData, setParameterFormData] = useState({});

    // Property Details Form State
    const [selectedCategory, setSelectedCategory] = useState("")

    // Property Details Form State
    const [propertyFormData, setPropertyFormData] = useState({
        propertyType: "Sell",
        propertyTitle: "",
        propertySlug: "",
        propertyPrice: "",
        propertyDescription: "",
        isPrivateProperty: false,
        rentDuration: ""
    })

    // SEO Settings Form State
    const [seoFormData, setSeoFormData] = useState({
        metaTitle: "",
        metaKeywords: "",
        metaDescription: "",
        ogImage: null
    })

    // Combined Media Form State
    const [mediaFormData, setMediaFormData] = useState({
        titleImages: [],
        documents: [],
        images3D: [],
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
    const handleUpdatePropertyForm = (e, customName, customValue) => {
        // For radio inputs and custom events where e.target might not have name/value
        if (customName && customValue !== undefined) {
            setPropertyFormData(prev => ({
                ...prev,
                [customName]: customValue
            }));
            return;
        }

        // For select inputs (from PropertyRentDuration) 
        if (typeof e === 'string' && customName) {
            setPropertyFormData(prev => ({
                ...prev,
                [customName]: e
            }));
            return;
        }

        // For standard form events (input, textarea)
        if (e && e.target) {
            const { name, value, type, checked } = e.target;

            // Handle title input for English language
            if (name === "title" && selectedLanguage === "English") {
                setPropertyFormData(prev => ({
                    ...prev,
                    propertyTitle: value,
                    propertySlug: generateSlug(value)
                }));
                return;
            }

            // Handle description input for English language
            if (name === "description" && selectedLanguage === "English") {
                setPropertyFormData(prev => ({
                    ...prev,
                    propertyDescription: value
                }));
                return;
            }

            if (name === "propertyTitle") {
                setPropertyFormData(prev => ({
                    ...prev,
                    [name]: value,
                    propertySlug: generateSlug(value)
                }));
                return;
            }

            // Handle checkbox/switch inputs
            if (type === 'checkbox') {
                setPropertyFormData(prev => ({
                    ...prev,
                    [name]: checked
                }));
                return;
            }

            // Handle regular inputs
            setPropertyFormData(prev => ({
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

            case "propertyDetails":
                if (!propertyFormData.propertyTitle) {
                    toast.error(t("propertyTitleRequired"));
                    missingFields = true;
                    break;
                }

                if (!propertyFormData.propertyPrice) {
                    toast.error(t("propertyPriceRequired"));
                    missingFields = true;
                    break;
                }

                if (!propertyFormData.propertyDescription) {
                    toast.error(t("propertyDescriptionRequired"));
                    missingFields = true;
                    break;
                }

                if (propertyFormData.propertyType === "Rent" && !propertyFormData.rentDuration) {
                    toast.error(t("rentDurationRequired"));
                    missingFields = true;
                    break;
                }
                break;

            case "facilities":
                if (selectedCategory && categories.length > 0) {
                    const category = categories.find(cat => cat.id === selectedCategory?.id);
                    if (category && category.parameter_types) {
                        const requiredParameters = category.parameter_types.filter(param => param.is_required === 1);

                        for (const param of requiredParameters) {
                            const value = parameterFormData[param.id];
                            if (value === undefined || value === '' || value === null) {
                                toast.error(`${t("pleaseFillRequiredField")} ${param.name}`);
                                missingFields = true;
                                break;
                            }
                        }
                    }
                }
                break;

            case "outdoorFacilities":
                if (facilities.length > 0) {
                    const requiredFacilities = facilities.filter(facility => facility.is_required === 1);

                    for (const facility of requiredFacilities) {
                        const distance = facilityDistances[facility.id];
                        if (distance === undefined || distance === '' || distance === null) {
                            toast.error(`${t("distanceFor")} ${facility.name} ${t("isRequired")}`);
                            missingFields = true;
                            break;
                        }
                    }
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
                if (mediaFormData.titleImages.length === 0) {
                    toast.error(t("titleImageRequired"));
                    missingFields = true;
                    break;
                }

                // If we're on the images tab and no errors were found, and no nextTab is specified,
                // we should submit the form
                if (!missingFields && nextTab === null) {
                    handlePostProperty();
                    return;
                }
                break;
        }

        if (!missingFields && nextTab) {
            setActiveTab(nextTab);
        }
    }

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

    const handleFetchFacilities = async () => {
        try {
            const res = await getFacilitiesApi()
            setFacilities(res.data)
        } catch (error) {
            console.error("Failed to fetch facilities:", error)
        }
    }

    // Only fetch categories on initial component mount, not on tab changes
    useEffect(() => {
        if (activeTab === "categories" && categories.length === 0) {
            handleFetchCategories(0, true)
        } else if (activeTab === "categories" && facilities.length === 0) {
            handleFetchFacilities()
        }
    }, [activeTab, categories.length, facilities.length])

    useEffect(() => {
        handleFetchCategories(0, true)
        handleFetchFacilities()
    }, [activeLanguage])



    const handleLoadMoreCategories = async () => {
        const newOffset = offset + limit
        setOffset(newOffset)
        await handleFetchCategories(newOffset, false)
    }

    const handleTabChange = (value) => {
        setActiveTab(value)
        // Reset language selection to default/active language when switching tabs
        setSelectedLanguage(activeLanguageObj || activeLanguage || "English")
    }

    // Select Category
    const handleSelectCategory = (category) => {
        setSelectedCategory(category)
        setActiveTab("propertyDetails")
    }
    const handleRemoveCategory = () => {
        setSelectedCategory("")
        setActiveTab("categories")
    }

    //  Outdoor Facilities Distance Change
    const handleDistanceChange = (facilityId, value) => {
        // Ensure that the input value is a positive number
        const parsedValue = parseFloat(value);
        const newValue = isNaN(parsedValue) || parsedValue < 0 ? 0 : parsedValue;

        setFacilityDistances(prev => ({
            ...prev,
            [facilityId]: newValue
        }));
    };

    const handleLocationSelect = (address) => {
        // Update the form field with the selected address from the Map component
        setSelectedLocationAddress(prev => ({
            ...prev,
            city: address.city || prev.city,
            state: address.state || prev.state,
            country: address.country || prev.country,
            formattedAddress: address.formattedAddress || prev.formattedAddress,
            latitude: address?.latitude || address?.lat || prev.latitude,
            longitude: address?.longitude || address?.lng || prev.longitude
        }));
    };

    // CategorySkeleton component
    const CategorySkeleton = () => (
        <div className="flex items-center justify-center p-4 rounded-lg primaryBackgroundBg gap-3">
            <Skeleton className="h-12 w-12 rounded-full bg-gray-200" />
            <Skeleton className="h-6 w-24 bg-gray-200" />
        </div>
    )

    // Handle post property submission
    const handlePostProperty = async (e) => {
        // If called from a button click, prevent default form submission
        if (e) e.preventDefault();
        setShowLoader(true);
        try {
            // Format translations for API
            const formattedTranslations = translations.map((translation, index) => ({
                translation_id: index,
                language_id: translation.language_id,
                title: translation.title || "",
                description: translation.description || ""
            }));

            const data = {
                userid: userData?.id,
                title: propertyFormData.propertyTitle,
                description: propertyFormData.propertyDescription,
                city: selectedLocationAddress.city,
                state: selectedLocationAddress.state,
                country: selectedLocationAddress.country,
                latitude: selectedLocationAddress.latitude,
                longitude: selectedLocationAddress.longitude,
                address: selectedLocationAddress.formattedAddress,
                price: propertyFormData.propertyPrice,
                category_id: selectedCategory.id,
                property_type: propertyFormData.propertyType?.toLowerCase() === "sell" ? "0" : "1", // 0 for Sell, 1 for Rent
                video_link: mediaFormData.videoLink,
                parameters: parameterFormData,
                facilities: facilityDistances,
                title_image: mediaFormData.titleImages[0],
                three_d_image: mediaFormData.images3D[0],
                gallery_images: mediaFormData.galleryImages,
                meta_title: seoFormData.metaTitle,
                meta_description: seoFormData.metaDescription,
                meta_keywords: seoFormData.metaKeywords,
                meta_image: seoFormData.ogImage,
                rentduration: propertyFormData.rentDuration,
                is_premium: propertyFormData.isPrivateProperty,
                client_address: userData?.address,
                slug_id: propertyFormData.propertySlug,
                documents: mediaFormData.documents,
                translations: formattedTranslations
            }
            // Call the API with FormData
            const response = await postPropertyApi(data);
            setShowLoader(false);

            if (response && !response.error) {
                // toast.success(response.message || t("propertyAddedSuccessfully"));
                // // Redirect or reset form as needed
                // router.push(`/${locale}/user/dashboard`)
                Swal.fire({
                    imageUrl: successMark.src,
                    imageWidth: 160,
                    imageHeight: 160,
                    title: t("propertySubmittedSuccess"),
                    text: !websettings?.auto_approve
                        ? websettings?.text_property_submission
                        : "",
                    allowOutsideClick: false,
                    showCancelButton: false,
                    customClass: {
                        confirmButton: "Swal-confirm-buttons",
                        cancelButton: "Swal-cancel-buttons",
                    },
                    confirmButtonText: t("ok"),
                }).then((result) => {
                    //   toast.success(response.message);
                    router.push(`/${locale}/user/dashboard`);
                });
            } else {
                toast.error(t(response?.message) || t("failedToAddProperty"));
            }

        } catch (error) {
            setShowLoader(false);
            toast.error(t(error?.message) || t("somethingWentWrong"));
            console.error("Error adding property:", error);
        }
    };

    return (
        <div className="space-y-4 p-2 md:p-0">
            <h1 className="text-2xl font-semibold">{t("addProperty")}</h1>

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
                                            className={`flex items-center justify-center py-2 px-3 md:p-4 rounded-lg cursor-pointer transition-colors duration-500 primaryBackgroundBg gap-3 hover:primaryBg hover:text-white ${selectedCategory && selectedCategory?.id === category.id ? "!primaryBg text-white" : ""}`}
                                            onClick={() => handleSelectCategory(category)}
                                        >
                                            <div className="w-10 h-10 flex justify-center items-center bg-white rounded-full">
                                                <ImageWithPlaceholder src={category.image} alt={category.translated_name || category.category} className="w-7 h-7" />
                                            </div>
                                            <span className="text-lg font-semibold">{category?.translated_name || category?.category}</span>
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
                            {activeTab === "propertyDetails" && (
                                <div className="flex flex-col gap-12">
                                    <PropertyDetailsTab
                                        selectedCategory={selectedCategory}
                                        handleRemoveCategory={handleRemoveCategory}
                                        handleUpdatePropertyForm={handleUpdatePropertyForm}
                                        propertyFormData={propertyFormData}
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
                                />
                            )}

                            {activeTab === "facilities" && (
                                <FacilitiesComponent
                                    formData={parameterFormData}
                                    setFormData={setParameterFormData}
                                    selectedCategory={selectedCategory}
                                    categories={categories}
                                    handleTabChange={handleTabChange}
                                    handleCheckRequiredFields={handleCheckRequiredFields}
                                />
                            )}

                            {activeTab === "outdoorFacilities" && (
                                <OutdoorFacilitiesComponent
                                    facilities={facilities}
                                    handleTabChange={handleTabChange}
                                    facilityDistances={facilityDistances}
                                    handleDistanceChange={handleDistanceChange}
                                />
                            )}

                            {activeTab === "location" && (
                                <LocationComponent
                                    selectedLocationAddress={selectedLocationAddress}
                                    setSelectedLocationAddress={setSelectedLocationAddress}
                                    apiKey={GoogleMapApiKey}
                                    handleLocationSelect={handleLocationSelect}
                                    handleCheckRequiredFields={handleCheckRequiredFields}
                                />
                            )}

                            {activeTab === "imagesVideo" && (
                                <ImagesVideoTab
                                    showLoader={showLoader}
                                    handleCheckRequiredFields={handleCheckRequiredFields}
                                    mediaFormData={mediaFormData}
                                    setMediaFormData={setMediaFormData}
                                    handleRemoveMedia={handleRemoveMedia}
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

export default AddProperty