"use client";

import { useState, useEffect } from "react";
import { MdAddCircleOutline, MdMenu } from "react-icons/md";
import { FaChevronDown } from "react-icons/fa";
import { useTranslation } from "../context/TranslationContext";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { setActiveLanguage, setCurrentLanguage, setIsFetched, setManualChange, setIsLanguageLoaded } from "@/redux/slices/languageSlice";
import { getLanguageData } from "@/api/apiRoutes";
import { handlePackageCheck, isRTL } from "@/utils/helperFunction";
import { PackageTypes } from "@/utils/checkPackages/packageTypes";
import toast from "react-hot-toast";
// Removed NavigationMenu imports - using simple ul/li instead

const UserHeader = ({ isMobile, open, toggleDrawer }) => {
    const t = useTranslation();
    const router = useRouter();
    const dispatch = useDispatch();
    const isRtl = isRTL();
    const { locale } = router?.query;

    // Redux state for language management
    const languages = useSelector((state) => state.LanguageSettings?.languages);
    const defaultLang = useSelector((state) => state.LanguageSettings?.default_language);
    const activeLang = useSelector((state) => state.LanguageSettings?.active_language);
    const currentLang = activeLang || defaultLang;

    // State for language dropdown
    const [isLangDropdownOpen, setIsLangDropdownOpen] = useState(false);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (!event.target.closest('.language-dropdown')) {
                setIsLangDropdownOpen(false);
            }
        };

        if (isLangDropdownOpen) {
            document.addEventListener('click', handleClickOutside);
        }

        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, [isLangDropdownOpen]);

    // Language change handler - based on main Header implementation
    const handleLanguageChange = async (newLang) => {
        try {
            // Skip if already the current language
            if (newLang === currentLang) return;

            // Close dropdown
            setIsLangDropdownOpen(false);

            // Set manual change flag to prevent Layout from refetching
            dispatch(setManualChange({ data: true }));

            // Fetch language data for the new language
            const response = await getLanguageData({
                language_code: newLang,
                web_language_file: 1,
            });

            // Handle RTL/LTR direction
            if (response?.data?.rtl === 1) {
                document.dir = "rtl";
            } else {
                document.dir = "ltr";
            }
            document.documentElement.lang = newLang;
            // Update Redux state with the new language data
            dispatch(setActiveLanguage({ data: newLang }));
            dispatch(setCurrentLanguage({ data: response.data }));
            dispatch(setIsFetched({ data: true }));
            dispatch(setIsLanguageLoaded({ data: true }));

            // Update URL to reflect language change
            let newPath = router.asPath;

            // Handle root path
            if (newPath === '/') {
                newPath = `/${newLang}`;
            }
            // Handle path with existing locale
            else if (locale) {
                newPath = newPath.replace(`/${locale}/`, `/${newLang}/`);
            }
            // Handle path without locale
            else if (newPath.startsWith('/')) {
                newPath = `/${newLang}${newPath}`;
            }

            // Use router.push with shallow option to prevent triggering getServerSideProps
            router.push(newPath, undefined, { shallow: true });
        } catch (error) {
            console.error("Failed to change language:", error);
            toast.error(t("languageChangeError"));
        }
    }; return (
        <header className={`${isMobile ? open ? "hidden" : "max-w-full" : !isMobile && open && !isRtl ? "max-w-[calc(100%-240px)]" : "max-w-full"} fixed top-0 w-full right-0 h-24 bg-white shadow-lg z-30 flex items-center ${!open ? "justify-between" : "justify-end"} px-4 transition-all duration-300 ease-out`}>
            {/* Menu toggle button - only shown when sidebar is closed */}
            {!open && <button onClick={toggleDrawer} className="text-lg rounded-full h-9 w-9 flex items-center justify-center font-semibold hover:bg-gray-200"><MdMenu className="primaryColor h-6 w-6" /></button>}

            <div className="flex items-center gap-4">
                {/* Language Dropdown using simple ul/li */}
                <div className="relative language-dropdown">
                    <button
                        className="flex w-max items-center gap-1 bg-transparent p-0 text-sm font-medium text-gray-700 transition-all hover:text-gray-900"
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setIsLangDropdownOpen(!isLangDropdownOpen);
                        }}
                    >
                        {languages?.find((lang) => lang.code === currentLang)?.name || t("language")}
                        <FaChevronDown
                            size={10}
                            className={`transition-transform duration-200 ${isLangDropdownOpen ? 'rotate-180' : ''
                                }`}
                        />
                    </button>

                    {isLangDropdownOpen && (
                        <div className={`absolute ${isRtl ? "left-0" : "right-0"} top-full z-20 mt-1 w-[110px] rounded-md bg-white shadow-lg border`}>
                            <ul className="py-1 [&>li:last-child>button]:border-b-0">
                                {languages &&
                                    languages.map((lang) => (
                                        <li key={lang.code}>
                                            <button
                                                className="hover:primaryColor hover:primaryBorderColor group block w-full cursor-pointer border-b-2 border-dashed px-3 py-2 text-left transition-all duration-150"
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    e.stopPropagation();
                                                    handleLanguageChange(lang.code);
                                                }}
                                            >
                                                <span className="transition-all duration-150 group-hover:ml-2">
                                                    {lang.name}
                                                </span>
                                            </button>
                                        </li>
                                    ))}
                            </ul>
                        </div>
                    )}
                </div>

                {/* Add Property/Project Button */}
                <div className="text-sm text-gray-500">
                    {router?.asPath?.includes("dashboard") ?
                        <button
                            className='flex items-center gap-2 p-2 secondaryTextBg primaryTextColor rounded-md hover:opacity-90 transition-opacity'
                            onClick={(e) => handlePackageCheck(e, PackageTypes.PROPERTY_LIST, router, null, null, true, null, t)}
                        >
                            <MdAddCircleOutline size={24} /> {t("addProperty")}
                        </button>
                        :
                        router?.asPath?.includes("projects") ?
                            <button
                                className='flex items-center gap-2 p-2 secondaryTextBg primaryTextColor rounded-md hover:opacity-90 transition-opacity'
                                onClick={(e) => handlePackageCheck(e, PackageTypes.PROJECT_LIST, router, null, null, true, null, t)}
                            >
                                <MdAddCircleOutline size={24} /> {t("addProject")}
                            </button>
                            : null
                    }
                </div>
            </div>
        </header>
    );
};

export default UserHeader;