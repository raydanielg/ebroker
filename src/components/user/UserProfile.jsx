"use client";

import React, { useEffect, useState } from 'react';
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import ImageWithPlaceholder from '../image-with-placeholder/ImageWithPlaceholder';
import { useTranslation } from '../context/TranslationContext';
import { BiSolidImageAdd } from "react-icons/bi";
import { FaUser } from "react-icons/fa";
import { Autocomplete } from "@react-google-maps/api";
import { HiOutlineMapPin } from "react-icons/hi2";

import toast from 'react-hot-toast';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { extractAddressComponents, validateAllSocialMediaUrls } from '@/utils/helperFunction';
import { useSelector, useDispatch } from 'react-redux';
import { getUserProfileApi, updateUserProfileApi } from '@/api/apiRoutes';
import { updateUserProfile } from '@/redux/slices/authSlice';
import ButtonLoader from '../ui/loaders/ButtonLoader';
import PhoneInput from 'react-phone-number-input';
import "react-phone-number-input/style.css";
import { IoMdArrowDropdown } from 'react-icons/io';
import { PhoneNumberUtil } from "google-libphonenumber";
import Swal from 'sweetalert2';

const UserProfile = () => {
    const t = useTranslation();
    const dispatch = useDispatch();

    const userData = useSelector(state => state.User?.data);
    const webSettings = useSelector(state => state.WebSetting?.data);

    useEffect(() => {
        // Fetch address from coordinates if latitude and longitude are available
        if (userData?.latitude && userData?.longitude) {
            fetchAddressFromCoordinates(userData.latitude, userData.longitude);
        }
    }, [userData]);

    useEffect(() => {
        fetchUserData();
    }, []);

    const fetchUserData = async () => {
        try {
            const res = await getUserProfileApi();
            if (res.data) {
                // Update Redux store with the fetched user data
                dispatch(updateUserProfile({
                    data: res.data
                }));
            }
        } catch (error) {
            console.error("Error fetching user data:", error);
        }
    };
    // Function to fetch address from coordinates using Google Geocoding API
    const fetchAddressFromCoordinates = async (lat, lng) => {
        if (!window.google || !window.google.maps || !window.google.maps.Geocoder) {
            console.error("Google Maps API not available");
            return;
        }

        try {
            const geocoder = new window.google.maps.Geocoder();
            geocoder.geocode({ location: { lat: parseFloat(lat), lng: parseFloat(lng) } }, (results, status) => {
                if (status === "OK" && results[0]) {
                    const place = results[0];
                    const { formattedAddress } = extractAddressComponents(place);

                    setFormData(prev => ({
                        ...prev,
                        location: formattedAddress
                    }));
                } else {
                    // Fallback to coordinate display
                    const coordString = `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
                    setFormData(prev => ({
                        ...prev,
                        location: coordString
                    }));
                }
            });
        } catch (error) {
            console.error("Error fetching address:", error);
            toast.error(t("locationError"));
        }
    }; const autocompleteRef = React.useRef(null);
    const [isLoadingLocation, setIsLoadingLocation] = useState(false);
    const [mapError, setMapError] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);


    // Initialize with userData directly in state definition
    const [formData, setFormData] = useState({
        firstName: userData?.name || '',
        email: userData?.email || '',
        phoneNumber: userData?.country_code ? `+${userData?.country_code}${userData?.mobile}` : userData?.mobile || '',
        location: '',
        latitude: userData?.latitude || null,
        longitude: userData?.longitude || null,
        address: userData?.address || '',
        city: userData?.city || '',
        state: userData?.state || '',
        country: userData?.country || '',
        about_me: userData?.about_me || '',
        facebook_id: userData?.facebook_id || '',
        instagram_id: userData?.instagram_id || '',
        youtube_id: userData?.youtube_id || '',
        twiiter_id: userData?.twiiter_id || ''
    });

    // Handle the profile image properly to avoid rate limiting
    const [previewImage, setPreviewImage] = useState(null);
    const [imageError, setImageError] = useState(false);

    // Set profile image once on component mount with proxy solution
    useEffect(() => {
        if (userData?.profile) {
            // For Google profile images, we need a workaround
            if (userData.profile.includes('googleusercontent.com')) {
                // Use a data URL approach for the preview instead of direct Google URL
                // Create user initials as fallback
                const initials = userData.name ? userData?.name?.charAt(0).toUpperCase() : 'U';
                // Store original URL in case we want to submit it later
                const originalUrl = userData.profile;

                // Set a simple colored background with user initial as fallback
                // This ensures we show something even if Google image fails
                setPreviewImage(originalUrl);
                // We don't need to set imageError here as we'll handle it in the component
            } else {
                setPreviewImage(userData.profile);
            }
        }
    }, [userData?.profile, userData?.name]);

    // Handle input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Handle image upload
    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData(prev => ({ ...prev, profileImage: file }));
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewImage(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    // Handle Places Autocomplete
    const onPlaceChanged = () => {
        if (!autocompleteRef.current) return;

        try {
            const place = autocompleteRef.current.getPlace();

            if (place && place.geometry) {
                const { city, state, country, formattedAddress } = extractAddressComponents(place);
                const lat = place.geometry?.location?.lat();
                const lng = place.geometry?.location?.lng();

                if (lat && lng) {
                    setFormData(prev => ({
                        ...prev,
                        location: formattedAddress,
                        city: city,
                        state: state,
                        country: country,
                        latitude: lat,
                        longitude: lng
                    }));
                }
            }
        } catch (error) {
            toast.error(t("locationError"));
        }
    };

    // Get current location
    const getCurrentLocation = () => {
        setIsLoadingLocation(true);
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(
                async (position) => {
                    try {
                        const { latitude, longitude } = position.coords;
                        if (!window.google || !window.google.maps || !window.google.maps.Geocoder) {
                            throw new Error("Google Maps API not available");
                        }

                        const geocoder = new window.google.maps.Geocoder();
                        geocoder.geocode({ location: { lat: parseFloat(latitude), lng: parseFloat(longitude) } }, (results, status) => {
                            if (status === "OK" && results[0]) {
                                const place = results[0];
                                const { city, state, country, formattedAddress } = extractAddressComponents(place);
                                setFormData(prev => ({
                                    ...prev,
                                    location: formattedAddress,
                                    city: city,
                                    state: state,
                                    country: country,
                                    latitude,
                                    longitude
                                }));
                            } else {
                                throw new Error("No results found");
                            }
                            setIsLoadingLocation(false);
                        });
                    } catch (error) {
                        toast.error(t("locationError"));
                        setIsLoadingLocation(false);
                    }
                },
                (error) => {
                    toast.error(t("locationPermissionDenied"));
                    setIsLoadingLocation(false);
                },
                {
                    enableHighAccuracy: true,
                    timeout: 5000,
                    maximumAge: 0
                }
            );
        } else {
            toast.error(t("locationNotSupported"));
            setIsLoadingLocation(false);
        }
    };
    const phoneUtil = PhoneNumberUtil.getInstance();
    // Handle form submission
    const handleSubmit = async (e) => {
        e?.preventDefault();
        setIsSubmitting(true);

        if (webSettings?.demo_mode) {
            Swal.fire({
                title: t("oops"),
                text: t("notAllowdDemo"),
                icon: "warning",
                showCancelButton: false,
                customClass: {
                    confirmButton: 'Swal-confirm-buttons',
                    cancelButton: "Swal-cancel-buttons"
                },
                confirmButtonText: t("ok"),
            });
            setIsSubmitting(false);
            return false;
        }


        // Only require a profile image if we don't already have one
        if (!previewImage) {
            toast.error(t("profilePictureRequired"));
            setIsSubmitting(false);
            return;
        }
        if (!formData.phoneNumber) {
            toast.error(t("phoneNumberIsRequired"));
            setIsSubmitting(false);
            return;
        }

        // Validate social media URLs before submission
        const socialMediaValidation = validateAllSocialMediaUrls(formData);
        if (!socialMediaValidation.isValid) {
            toast.error(t("invalidSocialMediaUrl"));
            setIsSubmitting(false);
            return;
        }

        let phone, isValidPhoneNumber;
        try {
            phone = phoneUtil?.parseAndKeepRawInput(formData.phoneNumber, "ZZ");
            isValidPhoneNumber = phoneUtil.isValidNumber(phone);
        } catch (error) {
            if (error?.message.includes("Invalid country calling code")) {
                // Handle specific error for invalid phone number format
                console.error("Invalid phone number format:", error);
                toast.error(t("invalidCountryCode"));
                setIsSubmitting(false);
                return;
            }
            toast.error(t("invalidPhoneNumberFormat"));
            setIsSubmitting(false);
            return;

        }
        const countryCode = phone.getCountryCode();
        const phonenum = phone.getNationalNumber().toString();
        // Create form data for submission
        const submitData = {
            ...formData,
            // Only include profile if a new image was uploaded
            profile: formData.profileImage || undefined,
            ...(formData.phoneNumber ? { country_code: countryCode } : {})
        };

        try {
            const res = await updateUserProfileApi({ ...submitData, mobile: phonenum, name: formData.firstName });

            // Update Redux store with the new profile data
            if (res.data) {
                dispatch(updateUserProfile({
                    data: res.data
                }));
            }
            toast.success(t("profileUpdatedSuccessfully"));
        } catch (error) {
            console.error(error);
            toast.error(t("profileUpdateFailed"));
        } finally {
            setIsSubmitting(false);
        }
    };

    // Required field label component
    const RequiredLabel = ({ children }) => (
        <p className="text-sm mb-2 flex items-center gap-1">
            {children}
            <span className="text-red-500">*</span>
        </p>
    );

    const handlePhoneNumberChange = (value) => {
        setFormData({
            ...formData,
            phoneNumber: value,
        });
    };

    return (
        <form onSubmit={handleSubmit} className="w-full max-w-full px-2 sm:px-4 md:px-0">
            {/* Main Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-6">
                {/* Personal Info Section */}
                <div className="bg-white rounded-lg p-4 sm:p-6 shadow-sm">
                    <h2 className="text-base sm:text-lg font-medium mb-4 sm:mb-6 border-b border-gray-200 pb-2">{t("personalInfo")}</h2>

                    {/* Profile Image Upload */}
                    <div className="mb-4 sm:mb-6">
                        <RequiredLabel>{t("profilePicture")}</RequiredLabel>
                        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
                            <div
                                className={`relative h-[100px] w-[100px] sm:h-[76px] sm:w-[76px] overflow-hidden rounded-lg bg-[#F7F7F7] border-2 border-dashed ${previewImage ? "border-none" : "border-gray-400"} focus-within:primaryBorderColor focus-within:ring-2 focus-within:ring-primary/20 transition-all duration-200`}
                                tabIndex="0"
                                role="button"
                                // onClick={() => document.getElementById('profileImage').click()}
                                onKeyDown={(e) => e.key === 'Enter' && document.getElementById('profileImage').click()}
                            >
                                {previewImage ? (
                                    <ImageWithPlaceholder
                                        src={previewImage}
                                        alt="Profile"
                                        className="h-full w-full object-cover"
                                    />
                                ) : (
                                    <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                                        <FaUser size={30} />
                                    </div>
                                )}
                                {/* Overlay on hover */}
                                <div
                                    className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity cursor-pointer"
                                    onClick={() => document.getElementById('profileImage').click()}
                                >
                                    <BiSolidImageAdd size={24} className="text-white" />
                                </div>
                            </div>
                            <div className="flex-1 text-center sm:text-left">
                                <Button
                                    type="button"
                                    variant="outline"
                                    className="h-10 px-4 secondaryTextBg !text-white border-0 text-sm font-normal hover:primaryBg"
                                    onClick={() => document.getElementById('profileImage').click()}
                                >
                                    <span className="flex items-center gap-2">
                                        <BiSolidImageAdd size={20} />
                                        {t("uploadProfile")}
                                    </span>
                                </Button>
                                <input
                                    id="profileImage"
                                    name="profileImage"
                                    type="file"
                                    accept="image/jpeg, image/png"
                                    onChange={handleImageUpload}
                                    className="hidden"
                                />
                                <p className="text-[#FF0000] text-xs mt-2">{t("profilePictureNote")}</p>
                            </div>
                        </div>
                    </div>

                    {/* Form Fields */}
                    <div className="grid grid-cols-1 gap-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <RequiredLabel>{t("firstName")}</RequiredLabel>
                                <Input
                                    name="firstName"
                                    value={formData.firstName}
                                    onChange={handleInputChange}
                                    placeholder={t("enterFirstName")}
                                    className="h-10 sm:h-12 bg-[#F7F7F7] border-0 rounded focus-visible:!primaryBorderColor focus-visible:!ring-2 focus-visible:!ring-primary/20 transition-all duration-200"
                                    required
                                />
                            </div>
                            <div>
                                <RequiredLabel>{t("email")}</RequiredLabel>
                                <Input
                                    name="email"
                                    type="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    placeholder={t("enterEmail")}
                                    className="h-10 sm:h-12 bg-[#F7F7F7] border-0 rounded focus-visible:!primaryBorderColor focus-visible:!ring-2 focus-visible:!ring-primary/20 transition-all duration-200"
                                    required
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className=''>
                                <RequiredLabel>{t("phoneNumber")}</RequiredLabel>
                                <PhoneInput
                                    defaultCountry={process.env.NEXT_PUBLIC_DEFAULT_COUNTRY}
                                    international
                                    showCountrySelect={false}
                                    value={formData?.phoneNumber}
                                    onChange={handlePhoneNumberChange}
                                    className="custom-phone-input user-profile"
                                    countrySelectProps={{
                                        arrowComponent: ({ children, ...props }) => (
                                            <span {...props} className="custom-arrow">
                                                <IoMdArrowDropdown size={16} />
                                            </span>
                                        )
                                    }}
                                />
                                {/* <Input
                                    type="number"
                                    name="phoneNumber"
                                    value={formData.phoneNumber}
                                    onChange={handleInputChange}
                                    placeholder={t("enterPhonenumber")}
                                    className="h-10 sm:h-12 bg-[#F7F7F7] border-0 rounded focus-visible:!primaryBorderColor focus-visible:!ring-2 focus-visible:!ring-primary/20 transition-all duration-200"
                                    required
                                /> */}
                            </div>
                            <div>
                                <label htmlFor='location' className='text-sm mb-2'>{t("location")}</label>
                                <div className="flex gap-2 w-full custom-search-box">
                                    {/* {isLoaded && !mapError ? ( */}
                                    <Autocomplete
                                        onLoad={autocomplete => autocompleteRef.current = autocomplete}
                                        onPlaceChanged={onPlaceChanged}
                                    >
                                        <div className='w-full'>
                                            <Input
                                                name="location"
                                                value={formData.location}
                                                onChange={handleInputChange}
                                                placeholder={t("searchLocation")}
                                                className="h-10 sm:h-12 !w-full bg-[#F7F7F7] border-0 rounded focus-visible:!primaryBorderColor focus-visible:!ring-2 focus-visible:!ring-primary/20 transition-all duration-200"
                                            // required
                                            />
                                        </div>
                                    </Autocomplete>
                                    {/* ) : (
                                    <Input
                                            name="location"
                                            value={formData.location}
                                            onChange={handleInputChange}
                                            placeholder={mapError ? t("googleMapsNotAvailable") : t("loading")}
                                            className="h-10 sm:h-12 w-full bg-[#F7F7F7] border-0 rounded focus-visible:!primaryBorderColor focus-visible:!ring-2 focus-visible:!ring-primary/20 transition-all duration-200"
                                            required
                                        disabled={!isLoaded}
                                    />
                                    )} */}
                                    <TooltipProvider>
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    size="icon"
                                                    className={`h-10 sm:h-12 w-10 sm:w-12 bg-[#F7F7F7] border-0 hover:bg-[#F0F0F0] ${(isLoadingLocation) ? 'opacity-50 cursor-not-allowed' : ''}`}
                                                    onClick={getCurrentLocation}
                                                // disabled={isLoadingLocation || !isLoaded}
                                                >
                                                    <HiOutlineMapPin className={`w-4 h-4 sm:w-5 sm:h-5 ${isLoadingLocation ? 'animate-pulse' : ''}`} />
                                                </Button>
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                <p>{t("currentLocation")}</p>
                                            </TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>
                                </div>
                            </div>
                        </div>

                        <div>
                            <RequiredLabel>{t("address")}</RequiredLabel>
                            <Textarea
                                name="address"
                                value={formData.address}
                                onChange={handleInputChange}
                                placeholder={t("enterYourAddress")}
                                className="min-h-[100px] sm:min-h-[120px] bg-[#F7F7F7] border-0 rounded resize-none focus-visible:!primaryBorderColor focus-visible:!ring-2 focus-visible:!ring-primary/20 transition-all duration-200"
                                required
                            />
                        </div>
                    </div>
                </div>

                {/* About Section */}
                <div className="bg-white rounded-lg p-4 sm:p-6 shadow-sm">
                    <h2 className="text-base sm:text-lg font-medium mb-4 sm:mb-6 border-b border-gray-200 pb-2">{t("about")}</h2>
                    <RequiredLabel>{t("aboutMe")}</RequiredLabel>
                    <Textarea
                        name="about_me"
                        value={formData.about_me}
                        onChange={handleInputChange}
                        placeholder={t("enterAboutMe")}
                        className="min-h-[250px] sm:min-h-[400px] bg-[#F7F7F7] border-0 rounded resize-none focus-visible:!primaryBorderColor focus-visible:!ring-2 focus-visible:!ring-primary/20 transition-all duration-200"
                        required
                    />
                </div>
            </div>

            {/* Social Media Section */}
            <div className="bg-white rounded-lg p-4 sm:p-6 shadow-sm mb-6">
                <h2 className="text-base sm:text-lg font-medium mb-4 sm:mb-6 border-b border-gray-200 pb-2">{t("socialMedia")}</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <p className="text-sm mb-2">{t("facebook")}</p>
                        <Input
                            name="facebook_id"
                            value={formData.facebook_id}
                            onChange={handleInputChange}
                            placeholder={t("enterFacebookUrl")}
                            className="h-10 sm:h-12 bg-[#F7F7F7] border-0 rounded focus-visible:!primaryBorderColor focus-visible:!ring-2 focus-visible:!ring-primary/20 transition-all duration-200"
                        />
                    </div>
                    <div>
                        <p className="text-sm mb-2">{t("instagram")}</p>
                        <Input
                            name="instagram_id"
                            value={formData.instagram_id}
                            onChange={handleInputChange}
                            placeholder={t("enterInstagramUrl")}
                            className="h-10 sm:h-12 bg-[#F7F7F7] border-0 rounded focus-visible:!primaryBorderColor focus-visible:!ring-2 focus-visible:!ring-primary/20 transition-all duration-200"
                        />
                    </div>
                    <div>
                        <p className="text-sm mb-2">{t("youtube")}</p>
                        <Input
                            name="youtube_id"
                            value={formData.youtube_id}
                            onChange={handleInputChange}
                            placeholder={t("enterYoutubeUrl")}
                            className="h-10 sm:h-12 bg-[#F7F7F7] border-0 rounded focus-visible:!primaryBorderColor focus-visible:!ring-2 focus-visible:!ring-primary/20 transition-all duration-200"
                        />
                    </div>
                    <div>
                        <p className="text-sm mb-2">{t("twitter")}</p>
                        <Input
                            name="twiiter_id"
                            value={formData.twiiter_id}
                            onChange={handleInputChange}
                            placeholder={t("enterTwitterUrl")}
                            className="h-10 sm:h-12 bg-[#F7F7F7] border-0 rounded focus-visible:!primaryBorderColor focus-visible:!ring-2 focus-visible:!ring-primary/20 transition-all duration-200"
                        />
                    </div>
                </div>
            </div>

            {/* Update Profile Button */}
            <div className="flex justify-center sm:justify-end">
                <Button
                    type="submit"
                    className="h-10 sm:h-12 w-full sm:w-auto px-4 sm:px-8 bg-black text-white rounded hover:opacity-90"
                    disabled={isSubmitting}
                >
                    {isSubmitting ? (
                        <div className='flex items-center gap-2'>
                            <ButtonLoader />
                            {t("updating")}
                        </div>
                    ) : (
                        t("updateProfile")
                    )}
                </Button>
            </div>
        </form>
    );
};

export default UserProfile;