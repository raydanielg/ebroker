"use client"
import { useState, useEffect } from 'react'
import { useTranslation } from '@/components/context/TranslationContext'
import { Skeleton } from "@/components/ui/skeleton"
import { getCategoriesApi, getFacilitiesApi, getAddedPropertiesApi, updatePostPropertyApi } from '@/api/apiRoutes'
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
import Swal from 'sweetalert2'
import React from 'react'

const EditProperty = ({ params = [] }) => {
    const router = useRouter()
    const { locale, slug } = router?.query
    // Get propertySlug from the params passed through UserRoot component
    const propertySlug = params?.[0] || slug?.split('/')[1]
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
    const [showLoader, setShowLoader] = useState(false)
    const [isLoading, setIsLoading] = useState(true)
    const [propertyId, setPropertyId] = useState(null)

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

    // Track which files are newly uploaded vs existing
    const [newlyUploadedFiles, setNewlyUploadedFiles] = useState({
        titleImages: [],
        documents: [],
        images3D: [],
        galleryImages: [],
        ogImage: null
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

    // Remove Gallery Images Form State
    const [removeGalleryImgsId, setRemoveGalleryImgsId] = useState(new Set());
    // Remove Documents Form State
    const [removeDocId, setRemoveDocId] = useState(new Set());
    // Remove 3D Image Flag
    const [shouldRemove3DImage, setShouldRemove3DImage] = useState(false);
    // Track if title image was changed
    const [isTitleImageChanged, setIsTitleImageChanged] = useState(false);
    // Track if SEO image was changed
    const [isSeoImageChanged, setIsSeoImageChanged] = useState(false);

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

    // Handle new file uploads and track them separately
    const handleNewFileUpload = (mediaType, files) => {
        // Update the media form data
        setMediaFormData(prev => ({
            ...prev,
            [mediaType]: mediaType === 'titleImages' || mediaType === 'images3D'
                ? [files[0]] // Single file for title and 3D images
                : mediaType === 'documents' || mediaType === 'galleryImages'
                    ? [...prev[mediaType], ...files] // Multiple files for documents and gallery
                    : files
        }));

        // Track newly uploaded files
        setNewlyUploadedFiles(prev => ({
            ...prev,
            [mediaType]: mediaType === 'titleImages' || mediaType === 'images3D'
                ? [files[0]] // Single file for title and 3D images
                : mediaType === 'documents' || mediaType === 'galleryImages'
                    ? [...prev[mediaType], ...files] // Multiple files for documents and gallery
                    : files
        }));

        // Set change flags for specific media types
        if (mediaType === 'titleImages') {
            setIsTitleImageChanged(true);
        } else if (mediaType === 'images3D') {
            // Reset the removal flag when a new 3D image is uploaded
            setShouldRemove3DImage(false);
        }
    };

    // Handle SEO image upload separately
    const handleSeoImageUpload = (file) => {
        setSeoFormData(prev => ({
            ...prev,
            ogImage: file
        }));
        setNewlyUploadedFiles(prev => ({
            ...prev,
            ogImage: file
        }));
        setIsSeoImageChanged(true);
    };

    // Update property form field handler
    const handleEditPropertyForm = (e, customName, customValue) => {
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

    const handleEditSeoFormData = (e, customName, customValue) => {
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
                        let requiredParameters = []
                        if (typeof category.parameter_types === "object") {
                            requiredParameters = Object.values(category.parameter_types).filter(param => param.is_required === 1);
                        } else {
                            requiredParameters = category.parameter_types.filter(param => param.is_required === 1);
                        }
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
                    handleEditProperty();
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

    // Fetch property details using slug
    const handleFetchPropertyDetails = async () => {
        if (!slug && !propertySlug) return;

        try {
            setIsLoading(true);
            const response = await getAddedPropertiesApi({ slug_id: propertySlug || slug });

            if (response && response.data && response.data.length > 0) {
                const propertyData = response.data[0]; // Get the first property from the array

                setPropertyId(propertyData.id);
                setSelectedCategory(propertyData.category);
                // Set active tab to propertyDetails
                setActiveTab("propertyDetails");

                // Set property form data
                setPropertyFormData({
                    propertyType: propertyData.property_type === "1" || propertyData.property_type?.toLowerCase() === "rent" ? "Rent" : "Sell",
                    propertyTitle: propertyData.title || "",
                    propertySlug: propertyData.slug_id || "",
                    propertyPrice: propertyData.price || "",
                    propertyDescription: propertyData.description || "",
                    isPrivateProperty: propertyData.is_premium === true,
                    rentDuration: propertyData.rentduration || ""
                });

                // Set SEO form data (without the ogImage which is handled separately)
                setSeoFormData({
                    metaTitle: propertyData.meta_title || "",
                    metaKeywords: propertyData.meta_keywords || "",
                    metaDescription: propertyData.meta_description || "",
                    ogImage: null // This will be set after fetching the image
                });

                // Set location data
                setSelectedLocationAddress({
                    city: propertyData.city || "",
                    state: propertyData.state || "",
                    country: propertyData.country || "",
                    formattedAddress: propertyData.address || "",
                    latitude: propertyData.latitude || 0,
                    longitude: propertyData.longitude || 0
                });

                // Initialize media form data (will be populated with fetched images)
                setMediaFormData({
                    titleImages: [],
                    documents: propertyData.documents || [],
                    images3D: [],
                    galleryImages: [],
                    videoLink: propertyData.video_link || ""
                });

                // Set parameters
                if (propertyData.parameters) {
                    const params = propertyData.parameters.reduce((acc, param) => {
                        try {
                            // Parse the JSON string to get the original value
                            // acc[param.id] = JSON.parse(param.value);
                            acc[param.id] = param.value;
                        } catch (error) {
                            // If parsing fails, use the value as-is
                            console.error(`Error parsing value for parameter ${param.id}:`, error);
                            acc[param.id] = param.value;
                        }
                        return acc;
                    }, {});

                    setParameterFormData(params);
                }

                // Set translations if they exist

                if (propertyData.translations && Array.isArray(propertyData.translations)) {
                    // Group translations by language_id since each language has separate entries for title and description
                    const translationsByLanguage = {};

                    propertyData.translations.forEach(translation => {
                        const langId = translation.language_id;

                        // Initialize language entry if it doesn't exist
                        if (!translationsByLanguage[langId]) {
                            translationsByLanguage[langId] = {
                                language_id: langId,
                                title: "",
                                description: "",
                                title_translation_id: "",
                                description_translation_id: ""
                            };
                        }

                        // Assign values based on the key (title or description)
                        if (translation.key === "title") {
                            translationsByLanguage[langId].title = translation.value || "";
                            translationsByLanguage[langId].title_translation_id = translation.id;
                        } else if (translation.key === "description") {
                            translationsByLanguage[langId].description = translation.value || "";
                            translationsByLanguage[langId].description_translation_id = translation.id;
                        }
                    });

                    // Convert the grouped object back to an array
                    const translationsData = Object.values(translationsByLanguage);
                    setTranslations(translationsData);
                } else {
                    // Initialize empty translations array if no translations exist
                    setTranslations([]);
                }

                // Set facilities
                if (propertyData.assign_facilities) {
                    const distances = {};
                    propertyData.assign_facilities.forEach(facility => {
                        distances[facility.facility_id] = facility.distance;
                    });
                    setFacilityDistances(distances);
                }

                // Process title image
                if (propertyData.title_image) {
                    const titleImageURL = propertyData.title_image;
                    try {
                        const response = await fetch(titleImageURL);
                        const blob = await response.blob();
                        if (blob.type.startsWith("image/")) {
                            const file = new File([blob], "title_image.jpg", {
                                type: blob.type || "image/jpeg",
                            });
                            // Mark as existing file
                            file.isExisting = true;
                            setMediaFormData(prev => ({
                                ...prev,
                                titleImages: [file]
                            }));
                        } else {
                            console.error("Fetched title image is not an image");
                        }
                    } catch (error) {
                        console.error("Error fetching title image:", error);
                    }
                }

                // Process 3D image
                if (propertyData.three_d_image) {
                    const threeDImageURL = propertyData.three_d_image;
                    try {
                        const response = await fetch(threeDImageURL);
                        const blob = await response.blob();
                        if (
                            blob.type === "image/jpeg" ||
                            blob.type === "image/png" ||
                            blob.type === "image/svg+xml" ||
                            blob.type === "image/jpg" ||
                            blob.type.startsWith("image/")
                        ) {
                            const file = new File([blob], "3D_image.jpg", {
                                type: blob.type || "image/jpeg",
                            });
                            // Mark as existing file
                            file.isExisting = true;
                            setMediaFormData(prev => ({
                                ...prev,
                                images3D: [file]
                            }));
                        } else {
                            console.error("Fetched 3D image is not a valid image");
                        }
                    } catch (error) {
                        console.error("Error fetching 3D image:", error);
                    }
                }

                // Process gallery images
                if (propertyData.gallery && propertyData.gallery.length > 0) {
                    const galleryImagesPromises = propertyData.gallery.map(async (galleryItem) => {
                        try {
                            const response = await fetch(galleryItem.image_url);
                            const blob = await response.blob();
                            if (blob.type.startsWith("image/")) {
                                const file = new File([blob], galleryItem.image || `gallery_${galleryItem.id}.jpg`, {
                                    type: blob.type || "image/jpeg"
                                });
                                // Attach the original gallery item ID to the file object
                                file.id = galleryItem.id;
                                // Mark as existing file
                                file.isExisting = true;
                                return file;
                            }
                            return null;
                        } catch (error) {
                            console.error(`Error fetching gallery image ${galleryItem.id}:`, error);
                            return null;
                        }
                    });

                    const galleryFiles = (await Promise.all(galleryImagesPromises)).filter(Boolean);
                    setMediaFormData(prev => ({
                        ...prev,
                        galleryImages: galleryFiles
                    }));
                }

                // Process SEO OG image
                if (propertyData.meta_image) {
                    const ogImageURL = propertyData.meta_image;
                    try {
                        const response = await fetch(ogImageURL);
                        const blob = await response.blob();
                        if (blob.type.startsWith("image/")) {
                            const file = new File([blob], "meta_image.jpg", {
                                type: blob.type || "image/jpeg",
                            });
                            // Mark as existing file
                            file.isExisting = true;
                            setSeoFormData(prev => ({
                                ...prev,
                                ogImage: file
                            }));
                        } else {
                            console.error("Fetched OG image is not an image");
                        }
                    } catch (error) {
                        console.error("Error fetching OG image:", error);
                    }
                }

                // Process documents
                if (propertyData.documents && propertyData.documents.length > 0) {
                    const documentsPromises = propertyData.documents.map(async (doc) => {
                        try {
                            const response = await fetch(doc.file);
                            const blob = await response.blob();
                            const file = new File([blob], doc.file_name || "document.pdf", {
                                type: doc.type === "pdf" ? "application/pdf" : "application/octet-stream"
                            });
                            // Attach the original document ID to the file object
                            file.id = doc.id;
                            // Mark as existing file
                            file.isExisting = true;
                            return file;
                        } catch (error) {
                            console.error(`Error fetching document:`, error);
                            return null;
                        }
                    });

                    const documentFiles = (await Promise.all(documentsPromises)).filter(Boolean);
                    setMediaFormData(prev => ({
                        ...prev,
                        documents: documentFiles
                    }));
                }

            } else {
                toast.error(t("propertyNotFound"));
                router.push(`/${locale}/user/dashboard`);
            }
        } catch (error) {
            console.error("Failed to fetch property details:", error);
            toast.error(t("failedToLoadPropertyDetails"));
        } finally {
            setIsLoading(false);
        }
    };

    // Use the propertySlug in useEffect
    useEffect(() => {
        if (userData && propertySlug) {
            handleFetchPropertyDetails()
            handleFetchCategories(0, true)
            handleFetchFacilities()
        }
    }, [propertySlug, activeLanguage])


    // Initialize selected language when translations are loaded
    useEffect(() => {
        if (translations.length > 0 && !selectedLanguage) {
            // Set to the first available language or activeLanguageObj
            setSelectedLanguage(activeLanguageObj || activeLanguage || "English");
        }
    }, [translations, activeLanguageObj, activeLanguage, selectedLanguage])

    const handleTabChange = (value) => {
        setActiveTab(value)
        // Reset language selection to default/active language when switching tabs
        setSelectedLanguage(activeLanguageObj || activeLanguage || "English")
    }

    // Outdoor Facilities Distance Change
    const handleEditDistanceChange = (facilityId, value) => {
        // Ensure that the input value is a positive number
        const parsedValue = parseFloat(value);
        const newValue = isNaN(parsedValue) || parsedValue < 0 ? 0 : parsedValue;

        setFacilityDistances(prev => ({
            ...prev,
            [facilityId]: newValue
        }));
    };

    const handleEditLocationSelect = (address) => {
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

    // Generic media removal handler
    const handleRemoveMedia = (mediaType, index) => {
        const file = mediaFormData[mediaType][index];

        // Handle different media types for existing files (with IDs)
        if (mediaType === 'galleryImages' && (file.id || file.isExisting)) {
            // Add the gallery image ID to removal set (existing file)
            if (file.id) {
                setRemoveGalleryImgsId(prev => new Set([...prev, file.id]));
            }
        } else if (mediaType === 'documents' && (file.id || file.isExisting)) {
            // Add the document ID to removal set (existing file)
            if (file.id) {
                setRemoveDocId(prev => new Set([...prev, file.id]));
            }
        } else if (mediaType === 'images3D') {
            // Always mark that 3D image should be removed when user removes it
            setShouldRemove3DImage(true);
        } else if (mediaType === 'titleImages') {
            // Mark that title image was changed
            setIsTitleImageChanged(true);
        }

        // Remove the file from the UI state
        setMediaFormData(prev => {
            const updatedMedia = [...prev[mediaType]];
            updatedMedia.splice(index, 1);
            return {
                ...prev,
                [mediaType]: updatedMedia
            };
        });

        // If it's a newly uploaded file (no isExisting flag), remove from newly uploaded files
        if (!file.isExisting) {
            setNewlyUploadedFiles(prev => {
                const updatedNewFiles = [...(prev[mediaType] || [])];
                // Find and remove the corresponding file from newly uploaded
                const fileToRemove = prev[mediaType]?.find(f =>
                    f.name === file.name && f.size === file.size && f.lastModified === file.lastModified
                );
                if (fileToRemove) {
                    const newFileIndex = prev[mediaType].indexOf(fileToRemove);
                    if (newFileIndex > -1) {
                        updatedNewFiles.splice(newFileIndex, 1);
                    }
                }
                return {
                    ...prev,
                    [mediaType]: mediaType === 'titleImages' || mediaType === 'images3D'
                        ? [] // Clear single file types
                        : updatedNewFiles
                };
            });
        }
    };

    // Function to remove a gallery image by index
    const handleRemoveGalleryImages = (index, id) => {
        const file = mediaFormData.galleryImages[index];

        // Update gallery images array by removing the image at the specified index
        setMediaFormData((prevState) => {
            const newGalleryImages = [...prevState.galleryImages];
            newGalleryImages.splice(index, 1); // Properly remove the item at index
            return {
                ...prevState,
                galleryImages: newGalleryImages,
            };
        });

        // If it's an existing file (has ID), add to removal set for API call
        if (file.id || id) {
            setRemoveGalleryImgsId((prevIds) => new Set([...prevIds, file.id || id]));
        }

        // If it's a newly uploaded file (no isExisting flag), remove from newly uploaded files
        if (!file.isExisting) {
            setNewlyUploadedFiles(prev => {
                const updatedNewFiles = [...(prev.galleryImages || [])];
                // Find and remove the corresponding file from newly uploaded
                const fileToRemove = prev.galleryImages?.find(f =>
                    f.name === file.name && f.size === file.size && f.lastModified === file.lastModified
                );
                if (fileToRemove) {
                    const newFileIndex = prev.galleryImages.indexOf(fileToRemove);
                    if (newFileIndex > -1) {
                        updatedNewFiles.splice(newFileIndex, 1);
                    }
                }
                return {
                    ...prev,
                    galleryImages: updatedNewFiles
                };
            });
        }
    };

    // Function to remove a document by index
    const handleRemoveDocuments = (index, docId) => {
        const file = mediaFormData.documents[index];

        // Update documents array by removing the document at the specified index
        setMediaFormData((prevState) => {
            const newDocuments = [...prevState.documents];
            const removedDoc = newDocuments[index];
            newDocuments.splice(index, 1); // Properly remove the item at index
            return {
                ...prevState,
                documents: newDocuments,
            };
        });

        // If it's an existing file (has ID), add to removal set for API call
        if (file.id || docId) {
            setRemoveDocId((prevIds) => new Set([...prevIds, file.id || docId]));
        }

        // If it's a newly uploaded file (no isExisting flag), remove from newly uploaded files
        if (!file.isExisting) {
            setNewlyUploadedFiles(prev => {
                const updatedNewFiles = [...(prev.documents || [])];
                // Find and remove the corresponding file from newly uploaded
                const fileToRemove = prev.documents?.find(f =>
                    f.name === file.name && f.size === file.size && f.lastModified === file.lastModified
                );
                if (fileToRemove) {
                    const newFileIndex = prev.documents.indexOf(fileToRemove);
                    if (newFileIndex > -1) {
                        updatedNewFiles.splice(newFileIndex, 1);
                    }
                }
                return {
                    ...prev,
                    documents: updatedNewFiles
                };
            });
        }
    };

    // Handle update property submission
    const handleEditProperty = async (e) => {
        // If called from a button click, prevent default form submission
        if (e) e.preventDefault();
        setShowLoader(true);

        try {
            if (websettings?.demo_mode) {
                Swal.fire({
                    title: t("opps"),
                    text: t("notAllowdDemo"),
                    icon: "warning",
                    showCancelButton: false,
                    customClass: {
                        confirmButton: "Swal-confirm-buttons",
                        cancelButton: "Swal-cancel-buttons",
                    },
                    confirmButtonText: t("ok"),
                });
                return false;
            }

            // Format translations for API
            const formattedTranslations = translations.map((translation, index) => ({
                title: {
                    translation_id: translation.title_translation_id || "",
                    language_id: translation.language_id,
                    value: translation.title || ""
                },
                description: {
                    translation_id: translation.description_translation_id || "",
                    language_id: translation.language_id,
                    value: translation.description || ""
                }
            }));

            const parameters = [];
            const facilities = [];

            // Assuming tab2 contains parameter data
            for (const [key, value] of Object.entries(parameterFormData)) {
                // Convert the value to a JSON string, regardless of whether it's an array or not
                // const formattedValue = JSON.stringify(value);
                const formattedValue = value;

                parameters.push({
                    parameter_id: key,
                    value: formattedValue, // Always pass the value as a JSON string
                });
            }

            // Assuming tab2 contains parameter data
            for (const [key, value] of Object.entries(facilityDistances)) {
                facilities.push({
                    facility_id: key,
                    distance: value,
                    // You may need to adjust these fields based on your data structure
                });
            }

            const threeDImage = newlyUploadedFiles.images3D.length > 0 ? newlyUploadedFiles.images3D[0] : "";
            const galleryImages = newlyUploadedFiles.galleryImages.length > 0 ? newlyUploadedFiles.galleryImages : "";
            const titleImage = (isTitleImageChanged && newlyUploadedFiles.titleImages.length > 0) ? newlyUploadedFiles.titleImages[0] : "";
            const ogImages = (isSeoImageChanged && newlyUploadedFiles.ogImage) ? newlyUploadedFiles.ogImage : "";

            // Convert Sets to Arrays for the API
            const removeGalleryArray = Array.from(removeGalleryImgsId);
            const removeDocArray = Array.from(removeDocId);

            // Only send newly uploaded documents, not existing ones
            const newDocuments = newlyUploadedFiles.documents || [];

            // Determine if 3D image should be removed - only if explicitly marked for removal
            const shouldRemoveThreeDImage = shouldRemove3DImage ? 1 : "";

            const data = {
                id: propertyId,
                action_type: "0",
                slug_id: propertyFormData.propertySlug,
                title: propertyFormData.propertyTitle,
                description: propertyFormData.propertyDescription,
                price: propertyFormData.propertyPrice,
                category_id: selectedCategory.id,
                property_type: propertyFormData.propertyType?.toLowerCase() === "sell" ? "0" : "1",
                rentduration: propertyFormData.rentDuration ? propertyFormData.rentDuration : "",
                is_premium: propertyFormData.isPrivateProperty,
                city: selectedLocationAddress.city,
                state: selectedLocationAddress.state,
                country: selectedLocationAddress.country,
                latitude: selectedLocationAddress.latitude,
                longitude: selectedLocationAddress.longitude,
                address: selectedLocationAddress.formattedAddress,
                client_address: userData?.address ? userData?.address : "",
                parameters: parameters,
                facilities: facilities,
                title_image: titleImage,
                three_d_image: threeDImage,
                gallery_images: galleryImages,
                video_link: mediaFormData.videoLink,
                meta_title: seoFormData.metaTitle,
                meta_description: seoFormData.metaDescription,
                meta_keywords: seoFormData.metaKeywords,
                meta_image: ogImages,
                documents: newDocuments,
                remove_gallery_images: removeGalleryArray,
                remove_documents: removeDocArray,
                remove_three_d_image: shouldRemoveThreeDImage,
                translations: formattedTranslations,
            }
            // Call the API with FormData
            const response = await updatePostPropertyApi(data);

            setShowLoader(false);

            if (response && !response.error) {
                // toast.success(response.message || t("propertyUpdatedSuccessfully"));
                // Redirect back to dashboard
                toast.success(t(response?.message));
                router.push(`/${locale}/user/dashboard`);
            } else {
                toast.error(t(response?.message) || t("somethingWentWrong"));
            }
        } catch (error) {
            setShowLoader(false);
            toast.error(t(error?.message) || t("somethingWentWrong"));
            console.error("Error updating property:", error);
        }
    };

    // CategorySkeleton component
    const CategorySkeleton = () => (
        <div className="flex items-center justify-center p-4 rounded-lg primaryBackgroundBg gap-3">
            <Skeleton className="h-12 w-12 rounded-full bg-gray-200" />
            <Skeleton className="h-6 w-24 bg-gray-200" />
        </div>
    )

    const handleLoadMoreCategories = async () => {
        const newOffset = offset + limit
        setOffset(newOffset)
        await handleFetchCategories(newOffset, false)
    }

    // Helper function for handling images
    useEffect(() => {
        // Cleanup function for file URLs
        return () => {
            // Clean up any created object URLs to avoid memory leaks
            mediaFormData.titleImages.forEach(file => {
                if (file instanceof File) {
                    URL.revokeObjectURL(URL.createObjectURL(file));
                }
            });
            mediaFormData.images3D.forEach(file => {
                if (file instanceof File) {
                    URL.revokeObjectURL(URL.createObjectURL(file));
                }
            });
            mediaFormData.galleryImages.forEach(file => {
                if (file instanceof File) {
                    URL.revokeObjectURL(URL.createObjectURL(file));
                }
            });
        };
    }, [mediaFormData]);

    if (isLoading) {
        return (
            <div className="space-y-4">
                <Skeleton className="h-8 w-64" />
                <div className="bg-white p-6">
                    <div className="space-y-4">
                        <Skeleton className="h-12 w-full" />
                        <Skeleton className="h-12 w-full" />
                        <Skeleton className="h-12 w-full" />
                        <Skeleton className="h-24 w-full" />
                    </div>
                </div>
            </div>
        );
    }
    return (
        <div className="space-y-4">
            <h1 className="text-2xl font-semibold">{t("editProperty")}</h1>

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
                    {activeTab === "propertyDetails" && (
                        <div className="flex flex-col gap-12">
                            <PropertyDetailsTab
                                selectedCategory={selectedCategory}
                                handleRemoveCategory={null}
                                handleUpdatePropertyForm={handleEditPropertyForm}
                                propertyFormData={propertyFormData}
                                handleCheckRequiredFields={handleCheckRequiredFields}
                                isEditing={true}
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
                            handleFillSeoFormData={handleEditSeoFormData}
                            handleSeoImageUpload={handleSeoImageUpload}
                            isEditing={true}
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
                            isEditing={true}
                        />
                    )}

                    {activeTab === "outdoorFacilities" && (
                        <OutdoorFacilitiesComponent
                            facilities={facilities}
                            handleTabChange={handleTabChange}
                            facilityDistances={facilityDistances}
                            handleDistanceChange={handleEditDistanceChange}
                            isEditing={true}
                        />
                    )}

                    {activeTab === "location" && (
                        <LocationComponent
                            selectedLocationAddress={selectedLocationAddress}
                            setSelectedLocationAddress={setSelectedLocationAddress}
                            apiKey={GoogleMapApiKey}
                            handleLocationSelect={handleEditLocationSelect}
                            handleCheckRequiredFields={handleCheckRequiredFields}
                            isEditing={true}
                        />
                    )}

                    {activeTab === "imagesVideo" && (
                        <ImagesVideoTab
                            showLoader={showLoader}
                            handleCheckRequiredFields={handleCheckRequiredFields}
                            mediaFormData={mediaFormData}
                            setMediaFormData={setMediaFormData}
                            handleNewFileUpload={handleNewFileUpload}
                            isEditing={true}
                            handleRemoveGalleryImages={handleRemoveGalleryImages}
                            handleRemoveDocuments={handleRemoveDocuments}
                            handleRemoveMedia={handleRemoveMedia}
                        />
                    )}
                </div>
            </div>
        </div>
    )
}

export default EditProperty