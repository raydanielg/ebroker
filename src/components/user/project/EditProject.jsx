"use client"
import { useState, useEffect } from 'react'
import { useTranslation } from '@/components/context/TranslationContext'
import { Skeleton } from "@/components/ui/skeleton"
import { getProjectDetailsApi, postProjectApi } from '@/api/apiRoutes'
import toast from 'react-hot-toast'
import { generateSlug } from '@/utils/helperFunction'
import { useSelector } from 'react-redux'
import { useRouter } from 'next/router'
import LocationComponent from '@/components/reusable-components/add-property/LocationComponent'
import ImagesVideoTab from '@/components/reusable-components/add-project/ImagesVideoTab'
import SEODetailsTab from '@/components/reusable-components/add-property/SEODetailsTab'
import ProjectDetailsTab from '@/components/reusable-components/add-project/ProjectDetailsTab'
import FloorDetails from '@/components/reusable-components/add-project/FloorDetails'
import React from 'react';

const EditProject = ({ params }) => {
    const router = useRouter()
    const { locale, slug } = router?.query
    // Get propertySlug from the params passed through UserRoot component
    const projectSlug = params?.[0] || slug?.split('/')[1]
    const userData = useSelector(state => state.User?.data)
    const languages = useSelector(state => state.LanguageSettings?.languages) || []
    const activeLanguage = useSelector(state => state.LanguageSettings?.active_language)
    const t = useTranslation()
    const [activeTab, setActiveTab] = useState("projectDetails")
    const [isLoading, setIsLoading] = useState(true)
    const [showLoader, setShowLoader] = useState(false);
    const [removedGalleryImages, setRemovedGalleryImages] = useState([]);
    const [removedDocuments, setRemovedDocuments] = useState([]);
    const [removedPlans, setRemovedPlans] = useState([]);

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

    const [editProjectId, setEditProjectId] = useState(null);

    // Fetch project details when slug_id is available
    useEffect(() => {
        if (projectSlug) {
            handleFetchProjectDetails();
        }
    }, [projectSlug]);

    // Initialize selected language when translations are loaded
    useEffect(() => {
        if (translations.length > 0 && !selectedLanguage) {
            // Set to the first available language or activeLanguageObj
            setSelectedLanguage(activeLanguageObj || activeLanguage || "English");
        }
    }, [translations, activeLanguageObj, activeLanguage, selectedLanguage])

    const handleFetchProjectDetails = async () => {
        try {
            setIsLoading(true);
            const response = await getProjectDetailsApi({ slug_id: projectSlug });

            if (!response.error) {
                const projectData = response.data;

                // Set category from API response
                setSelectedCategory(projectData.category);

                setEditProjectId(projectData.id);

                // Set project form data
                setProjectFormData({
                    projectType: projectData.type || "upcoming",
                    projectTitle: projectData.title || "",
                    projectSlug: projectData.slug_id || "",
                    projectDescription: projectData.description || "",
                });

                // Set SEO form data
                setSeoFormData({
                    metaTitle: projectData.meta_title || "",
                    metaKeywords: projectData.meta_keywords || "",
                    metaDescription: projectData.meta_description || "",
                    ogImage: projectData.meta_image || null
                });

                // Set location data
                setSelectedLocationAddress({
                    city: projectData.city || "",
                    state: projectData.state || "",
                    country: projectData.country || "",
                    formattedAddress: projectData.location || "",
                    latitude: projectData.latitude || 0,
                    longitude: projectData.longitude || 0
                });

                // Set floor plan data
                if (projectData.plans && projectData.plans.length > 0) {
                    setFloorFormData(projectData.plans.map(plan => ({
                        id: plan.id,
                        floorTitle: plan.title || "",
                        floorImage: plan.document || null
                    })));
                }

                // Set media data
                setMediaFormData({
                    titleImage: projectData.image || null,
                    documents: projectData.documents || [],
                    galleryImages: projectData.gallary_images || [],
                    videoLink: projectData.video_link || ""
                });

                // Set translations if they exist (simplified structure like AddProject)
                if (projectData.translations && Array.isArray(projectData.translations)) {
                    // Group translations by language_id since each language has separate entries for title and description
                    const translationsByLanguage = {};

                    projectData.translations.forEach(translation => {
                        const langId = translation.language_id;

                        // Initialize language entry if it doesn't exist
                        if (!translationsByLanguage[langId]) {
                            translationsByLanguage[langId] = {
                                language_id: langId,
                                title: "",
                                description: ""
                            };
                        }

                        // Assign values based on the key (title or description)
                        if (translation.key === "title") {
                            translationsByLanguage[langId].title = translation.value || "";
                        } else if (translation.key === "description") {
                            translationsByLanguage[langId].description = translation.value || "";
                        }
                    });

                    // Convert the grouped object back to an array
                    const translationsData = Object.values(translationsByLanguage);
                    setTranslations(translationsData);
                } else {
                    // Initialize empty translations array if no translations exist
                    setTranslations([]);
                }

                // Start with project details tab instead of categories
                setActiveTab("projectDetails");
            } else {
                toast.error(t(response.message) || t("somethingWentWrong"));
            }
        } catch (error) {
            console.error("Error fetching project details:", error);
            toast.error(t(error?.message) || t("errorFetchingProjectDetails"));
        } finally {
            setIsLoading(false);
        }
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

    // Handle removing any type of media
    const handleRemoveMedia = (type, index, id = null) => {
        if (type === 'titleImage') {
            setMediaFormData(prev => ({
                ...prev,
                titleImage: null
            }));
            return;
        }

        setMediaFormData(prev => {
            const updatedMedia = [...prev[type]];

            // Track removed item if it has an ID (existing item from backend)
            if (id && type === 'galleryImages') {
                setRemovedGalleryImages(prev => [...prev, id]);
            } else if (id && type === 'documents') {
                setRemovedDocuments(prev => [...prev, id]);
            }

            updatedMedia.splice(index, 1);
            return {
                ...prev,
                [type]: updatedMedia
            };
        });
    };

    // For backward compatibility with editing mode
    const handleRemoveGalleryImages = (index, id) => {
        if (id) {
            setRemovedGalleryImages(prev => [...prev, id]);
        }
        handleRemoveMedia('galleryImages', index);
    };

    const handleRemoveDocuments = (index, id) => {
        if (id) {
            setRemovedDocuments(prev => [...prev, id]);
        }
        handleRemoveMedia('documents', index);
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

            // Handle title input for English language (similar to AddProject logic)
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
            case "floorDetails":
                // Check if user has started entering floor details
                const hasFloorData = floorFormData.some(floor =>
                    floor.floorTitle.trim() !== '' || floor.floorImage !== null
                );

                if (hasFloorData) {
                    // If user has started entering floor details, validate all entries
                    for (const floor of floorFormData) {
                        if (!floor.floorTitle.trim()) {
                            toast.error(t("floorTitleIsRequired"));
                            missingFields = true;
                            break;
                        }
                        if (!floor.floorImage) {
                            toast.error(t("floorImageIsRequired"));
                            missingFields = true;
                            break;
                        }
                    }
                }
                // If no floor data entered, allow user to proceed (floor details are optional)
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
                handleUpdateProject();
            } else {
                setActiveTab(nextTab);
            }
        }
    };

    const handleTabChange = (value) => {
        setActiveTab(value);
        // Reset language selection to default/active language when switching tabs
        setSelectedLanguage(activeLanguageObj || activeLanguage || "English");
    };
    //  "latitude": "23.23641641035775",
    // "longitude": "69.66288219979255",
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

    const handleUpdateProject = async () => {
        try {
            setShowLoader(true);
            const plans = []; // Initialize an empty array for plans

            // Loop through floorFields and push each entry into plans array
            for (const field of floorFormData) {
                const id = field.id || "";
                const title = field.floorTitle?.trim() || "";
                const document = field.floorImage;

                // Only include plans that have both title and image
                if (document && title) {
                    plans.push({
                        id: id,
                        title: title,
                        document: document instanceof File ? document : "",
                    });
                } else if (id) {
                    // If this is an existing plan with ID but document was removed
                    setRemovedPlans(prev => [...prev, id]);
                }
            }

            // Convert removed items arrays for API
            const removeFloorsArray = Array.from(removedPlans);
            const removeGalleryArray = Array.from(removedGalleryImages);
            const removeDocArray = Array.from(removedDocuments);

            // Filter out non-File objects from documents and galleryImages
            const filteredDocuments = mediaFormData.documents
                .filter(doc => doc instanceof File)
                .map(doc => doc);

            const filteredGalleryImages = mediaFormData.galleryImages
                .filter(img => img instanceof File)
                .map(img => img);

            // Format translations for API (same as AddProject)
            const formattedTranslations = translations.map((translation, index) => ({
                translation_id: index,
                language_id: translation.language_id,
                title: translation.title || "",
                description: translation.description || ""
            }));

            // Prepare data payload for API
            const data = {
                id: editProjectId,
                title: projectFormData.projectTitle,
                description: projectFormData.projectDescription,
                category_id: selectedCategory.id,
                type: projectFormData.projectType,
                meta_title: seoFormData.metaTitle,
                meta_description: seoFormData.metaDescription,
                meta_keywords: seoFormData.metaKeywords,
                meta_image: (() => {
                    // If ogImage exists and is a file, return it
                    if (seoFormData.ogImage) {
                        if (seoFormData.ogImage instanceof File) {
                            return seoFormData.ogImage;
                        }
                        return ""; // Don't pass string URLs
                    }
                    return ""; // Return empty string if no image
                })(),
                city: selectedLocationAddress.city,
                state: selectedLocationAddress.state,
                country: selectedLocationAddress.country,
                latitude: selectedLocationAddress.latitude,
                longitude: selectedLocationAddress.longitude,
                location: selectedLocationAddress.formattedAddress,
                plans: plans,
                image: mediaFormData.titleImage instanceof File ? mediaFormData.titleImage : "",
                documents: filteredDocuments,
                gallery_images: filteredGalleryImages,
                video_link: mediaFormData.videoLink,
                remove_plans: removeFloorsArray,
                remove_gallery_images: removeGalleryArray,
                remove_documents: removeDocArray,
                slug_id: projectFormData.projectSlug,
                translations: formattedTranslations,
            };

            // Make the API call
            const response = await postProjectApi(data);

            if (!response?.error) {
                toast.success(t(response?.message));
                // Redirect to projects listing
                router.push(`/${locale}/user/projects`);
            } else {
                toast.error(response?.message || t("somethingWentWrong"));
            }
        } catch (error) {
            console.error("Error updating project:", error);
            toast.error(error?.response?.data?.message || error?.message || t("somethingWentWrong"));
        } finally {
            setShowLoader(false);
        }
    };

    if (isLoading) {
        return (
            <div className="space-y-4">
                <h1 className="text-2xl font-semibold">{t("editProject")}</h1>
                <div className="bg-white p-6">
                    <div className="flex flex-col gap-4">
                        <Skeleton className="h-8 w-1/3" />
                        <Skeleton className="h-40 w-full" />
                        <Skeleton className="h-10 w-1/2" />
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <h1 className="text-2xl font-semibold">{t("editProject")}</h1>

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
                    {activeTab === "projectDetails" && (
                        <div className="flex flex-col gap-12">
                            <ProjectDetailsTab
                                selectedCategory={selectedCategory}
                                projectFormData={projectFormData}
                                handleUpdateProjectForm={handleUpdateProjectForm}
                                handleCheckRequiredFields={handleCheckRequiredFields}
                                isEditing={true}
                                disableCategoryChange={true}
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
                            isEditing={true}
                        />
                    )}

                    {activeTab === "floorDetails" && (
                        <FloorDetails
                            floorFormData={floorFormData}
                            setFloorFormData={setFloorFormData}
                            handleCheckRequiredFields={handleCheckRequiredFields}
                            isEditing={true}
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
                            isEditing={true}
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
                            isEditing={true}
                            handleRemoveMedia={handleRemoveMedia}
                        />
                    )}
                </div>
            </div>
        </div>
    )
}

export default EditProject