"use client";
import { useEffect, useState } from "react";
import ImageWithPlaceholder from "../image-with-placeholder/ImageWithPlaceholder";
import Logo from "@/assets/logo.png";
import MobileMenu from "./MobileMenu";
import { FaRegUserCircle, FaYoutube } from "react-icons/fa";
import { FiPlusCircle } from "react-icons/fi";
import { FaPhone, FaX } from "react-icons/fa6";
import { MdEmail } from "react-icons/md";
import {
  FaFacebookF, FaChevronDown
} from "react-icons/fa";
import { BiMapPin } from "react-icons/bi";

// Removed NavigationMenu imports - using simple ul/li instead

import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { setActiveLanguage, setCurrentLanguage, setIsFetched, setManualChange, setIsLanguageLoaded } from "@/redux/slices/languageSlice";
import { useTranslation } from "../context/TranslationContext";
import LoginModal from "../modal/LoginModal";
import { handlePackageCheck, truncate } from "@/utils/helperFunction";
import Swal from "sweetalert2";
import { beforeLogoutApi, getLanguageData } from "@/api/apiRoutes";
import { logout } from "@/redux/slices/authSlice";
import FirebaseData from "@/utils/Firebase";
import toast from "react-hot-toast";
import CustomLink from "../context/CustomLink";
import AreaConverter from "../area-converter/AreaConverter";
import { useAuthStatus } from "@/hooks/useAuthStatus";
import LocationSearchWithRadius from "../location-search/LocationSearchWithRadius";
import Link from "next/link";
import { PackageTypes } from "@/utils/checkPackages/packageTypes";
import { AiFillInstagram } from "react-icons/ai";

const SCROLL_THRESHOLD = 50;

function RenderIf({ condition, children }) {
  return condition ? children : null;
}
const Header = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const t = useTranslation();
  const { locale } = router?.query;

  const userSelectedLocation = useSelector((state) => state.location);

  const isUserLoggedIn = useAuthStatus();

  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showAreaConverter, setShowAreaConverter] = useState(false);
  const [showLangDropdown, setShowLangDropdown] = useState(false);
  const isUserLocationSet =
    userSelectedLocation?.city !== "" &&
    userSelectedLocation?.state !== "" &&
    userSelectedLocation?.country !== "";
  const [location, setLocation] = useState(
    isUserLocationSet
      ? [
        userSelectedLocation?.city,
        userSelectedLocation?.state,
        userSelectedLocation?.country,
      ]
      : [],
  );
  const [isLocationDialogOpen, setIsLocationDialogOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState(null);

  const languages = useSelector((state) => state.LanguageSettings?.languages);
  const defaultLang = useSelector((state) => state.LanguageSettings?.default_language);
  const activeLang = useSelector((state) => state.LanguageSettings?.active_language);
  const currentLang = activeLang || defaultLang;
  const userData = useSelector((state) => state.User?.data);
  const FcmToken = useSelector((state) => state.WebSetting?.fcmToken);
  const webSettings = useSelector((state) => state.WebSetting?.data);

  const { signOut } = FirebaseData();

  useEffect(() => {
    setIsScrolled(window.scrollY > SCROLL_THRESHOLD);
    const handleScroll = () => setIsScrolled(window.scrollY > SCROLL_THRESHOLD);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close navigation menus and language dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Check if the click is outside any dropdown menu
      const isInsideDropdown = event.target.closest('.dropdown-menu') ||
        event.target.closest('.dropdown-trigger');

      // Check if the click is outside the language dropdown
      const isInsideLangDropdown = event.target.closest('.language-dropdown');

      if (!isInsideDropdown && openMenu) {
        setOpenMenu(null);
      }

      if (!isInsideLangDropdown && showLangDropdown) {
        setShowLangDropdown(false);
      }
    };

    if (openMenu || showLangDropdown) {
      document.addEventListener('click', handleClickOutside);
    }

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [openMenu, showLangDropdown]);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const handleShowLogin = () => {
    setShowLogin(true);
    setIsMenuOpen(false);
  };
  const handleShowAreaConverter = () => {
    setShowAreaConverter(true);
    setIsMenuOpen(false);
  };
  useEffect(() => {
    if (isUserLocationSet) {
      setLocation([
        userSelectedLocation?.city,
        userSelectedLocation?.state,
        userSelectedLocation?.country,
      ]);
    }
  }, [userSelectedLocation]);

  const menus = [
    {
      name: "properties",
      links: [
        {
          name: "allProperties",
          route: `/${currentLang}/properties`,
        },
        {
          name: "featuredProperties",
          route: `/${currentLang}/properties/featured-properties`,
        },
        {
          name: "mostViewedProperties",
          route: `/${currentLang}/properties/most-viewed-properties`,
        },
        {
          name: "mostFavouriteProperties",
          route: `/${currentLang}/properties/most-favourite-properties`,
        },
        {
          name: "propertiesNearbyCity",
          route: `/${currentLang}/properties/properties-nearby-city`,
        },
      ],
    },
    {
      name: "pages",
      links: [
        {
          name: "subscriptionPlan",
          route: `/${currentLang}/subscription-plan`,
        },
        {
          name: "articles",
          route: `/${currentLang}/all/articles`,
        },
        { name: "faqs", route: `/${currentLang}/faqs` },
        {
          name: "areaConverter",
          route: `/${currentLang}/area-converter`,
        },
        {
          name: "termsAndConditions",
          route: `/${currentLang}/terms-and-conditions`,
        },
        {
          name: "privacyPolicy",
          route: `/${currentLang}/privacy-policy`,
        },
      ],
    },
  ];

  const handleLanguageChange = async (newLang) => {
    try {
      // Skip if already the current language
      if (newLang === currentLang) return;

      // Set manual change flag to prevent Layout from refetching
      dispatch(setManualChange({ data: true }));

      // Fetch language data for the new language
      const response = await getLanguageData({
        language_code: newLang,
        web_language_file: 1,
      });
      if (response?.data?.rtl === 1) {
        document.dir = "rtl";
      } else {
        document.dir = "ltr";
      }
      document.documentElement.lang = response?.data?.code;


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

      if (isMenuOpen) {
        toggleMenu();
      }
    } catch (error) {
      console.error("Failed to change language:", error);
      toast.error(t("languageChangeError"));
    }
  };

  const handleNavigateLinks = (e, link) => {
    e.preventDefault();
    router.push(link.route);
  };

  const handleLogout = async () => {
    setIsMenuOpen(false);
    Swal.fire({
      title: t("areYouSure"),
      text: t("youNotAbelToRevertThis"),
      icon: "warning",
      showCancelButton: true,
      customClass: {
        confirmButton: "Swal-confirm-buttons",
        cancelButton: "Swal-cancel-buttons",
      },
      confirmButtonText: t("yesLogout"),
      cancelButtonText: t("cancel"),
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          if (FcmToken) {
            const res = await beforeLogoutApi({ fcm_id: FcmToken });
            if (!res.error) {
              dispatch(logout());
              signOut();
              toast.success(t("logoutSuccess"));
            }
          } else {
            dispatch(logout());
            signOut();
            toast.success(t("logoutSuccess"));
          }
        } catch (error) {
          error;
        }
      } else {
        toast.error(t("logoutcancel"));
      }
    });
  };

  const handleMenuToggle = (menuName) => {
    setOpenMenu(openMenu === menuName ? null : menuName);
  };


  return (
    <>
      <div
        className={`flex w-full flex-col ${isScrolled ? "fixed left-0 top-0 z-40 w-full animate-headerSlideDown bg-white shadow-md" : ""}`}
      >
        <div className={`primaryBg hidden py-2 text-white md:block`}>
          <div className="container px-3 md:px-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <RenderIf condition={webSettings?.company_email || webSettings?.company_tel1 || webSettings?.company_tel2}>
                  <Link
                    href={`mailto:${webSettings?.company_email}`}
                    className="flex items-center gap-2 text-sm"
                  >
                    <MdEmail
                      className="rounded-full bg-[#FFFFFF3D] p-1 text-white"
                      size={26}
                    />
                    {webSettings?.company_email}
                  </Link>
                  <Link
                    href={`tel:${webSettings?.company_tel1}`}
                    className="flex items-center gap-2 text-sm"
                  >
                    <FaPhone
                      className="rounded-full bg-[#FFFFFF3D] p-1 text-white"
                      size={26}
                    />
                    {webSettings?.company_tel1}
                  </Link>
                  <Link
                    href={`tel:${webSettings?.company_tel2}`}
                    className="flex items-center gap-2 text-sm"
                  >
                    <FaPhone
                      className="rounded-full bg-[#FFFFFF3D] p-1 text-white"
                      size={26}
                    />
                    {webSettings?.company_tel2}
                  </Link>
                </RenderIf>
              </div>
              <div className="flex items-center gap-4">
                <div
                  className="relative language-dropdown"
                  onClick={() => setShowLangDropdown(!showLangDropdown)}
                >
                  <button className="flex items-center gap-1 text-sm font-medium rounded-full bg-[#FFFFFF3D] px-2 py-1 text-white focus:outline-none">
                    {languages.find((lang) => lang.code === currentLang)
                      ?.name || t("language")}
                    <FaChevronDown size={10} />
                  </button>

                  {showLangDropdown && (
                    <div
                      className="absolute right-0 top-3 z-[9999] mt-2 w-[110px] rounded-md border border-gray-100 bg-white shadow-lg"
                    >
                      {languages.map((lang) => (
                        <div
                          key={lang.code}
                          className="hover:primaryColor hover:primaryBorderColor group block cursor-pointer border-b-2 border-dashed px-3 py-2 text-black transition-all duration-150 last:border-b-0"
                          onClick={() => {
                            handleLanguageChange(lang.code);
                            setShowLangDropdown(false);
                            setOpenMenu(null); // Close any open navigation menus
                          }}
                        >
                          <span className="transition-all duration-150 group-hover:ml-2">
                            {lang.name}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <div className="h-4 border-r border-white/30"></div>
                <div className="flex items-center gap-1">
                  <span className="text-sm font-medium">{t("followUs")}</span>
                  <div className="ml-2 flex items-center gap-2">
                    <RenderIf condition={webSettings?.facebook_id || webSettings?.twitter_id || webSettings?.instagram_id || webSettings?.youtube_id}>
                      <Link
                        href={webSettings?.facebook_id || "#"}
                        target="_blank"
                        className="text-white hover:text-gray-200"
                      >
                        <FaFacebookF size={14} />
                      </Link>
                      <Link
                        href={webSettings?.twitter_id || "#"}
                        target="_blank"
                        className="text-white hover:text-gray-200"
                      >
                        <FaX size={14} />
                      </Link>
                      <Link
                        href={webSettings?.instagram_id || "#"}
                        target="_blank"
                        className="text-white hover:text-gray-200"
                      >
                        <AiFillInstagram size={14} />
                      </Link>
                      <Link
                        href={webSettings?.youtube_id || "#"}
                        target="_blank"
                        className="text-white hover:text-gray-200"
                      >
                        <FaYoutube size={14} />
                      </Link>
                    </RenderIf>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <header className="relative z-10 w-full bg-white">
          <div className="container px-2 md:px-0">
            <div className="my-3 flex items-center justify-between">
              <div className="flex items-center gap-6">
                <CustomLink href={`/`} title="Home">
                  <div className="h-14 w-44">
                    <ImageWithPlaceholder
                      src={webSettings?.web_logo ? webSettings?.web_logo : Logo}
                      alt="logo"
                      height={0}
                      width={0}
                      className="h-full w-full"
                    />
                  </div>
                </CustomLink>
                <div className="h-14 md:border-r border-gray-200 md:block"></div>
                <div className="relative">
                  <div
                    className="relative hidden cursor-pointer transition-all md:block"
                    role="button"
                    tabIndex={0}
                    onClick={() => setIsLocationDialogOpen(true)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        setIsLocationDialogOpen(true);
                      }
                    }}
                  >
                    <div className="flex items-center gap-2">
                      <div className="rounded bg-[#0000001A] p-2">
                        <BiMapPin size={28} />
                      </div>
                      <div>
                        <div className="flex items-center gap-1 text-gray-700">
                          <span className="text-sm">{t("location")}</span>
                          <FaChevronDown size={10} className="mb-0.5" />
                        </div>
                        <div className="mt-0.5 text-sm text-gray-600">
                          {location && location?.length > 0
                            ? location?.join(", ")
                            : t("selectLocation")}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-6">
                <MobileMenu
                  isScrolled={isScrolled}
                  isMenuOpen={isMenuOpen}
                  toggleMenu={toggleMenu}
                  languages={languages}
                  menus={menus}
                  handleLanguageChange={handleLanguageChange}
                  handleShowLogin={handleShowLogin}
                  handleLogout={handleLogout}
                  handleShowAreaConverter={handleShowAreaConverter}
                />

                <ul className="hidden items-center gap-4 2xl:flex">
                  <CustomLink href={`/`}>
                    <li className="hover:primaryColor font-medium text-gray-700 flex flex-col items-center">
                      <span className={router.asPath === `/${locale}` || router.asPath === '/' || router.asPath === `/${locale}/` ? 'primaryColor font-bold' : ''}>
                        {t("home")}
                      </span>
                      {(router.asPath === `/${locale}` || router.asPath === '/' || router.asPath === `/${locale}/`) && (
                        <div className="flex gap-1">
                          <div className="w-1 h-1 rounded-full primaryBg"></div>
                          <div className="w-1 h-1 rounded-full primaryBg"></div>
                          <div className="w-1 h-1 rounded-full primaryBg"></div>
                        </div>
                      )}
                    </li>
                  </CustomLink>
                  {menus.map((menu) => (
                    <li key={menu.name} className="relative dropdown-menu flex flex-col items-center">
                      <button
                        className="dropdown-trigger hover:primaryColor flex items-center gap-1 bg-transparent p-0 text-base font-medium text-gray-700 transition-all"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleMenuToggle(menu.name);
                        }}
                      >
                        <span className={menu.links.some(link => {
                          const routePath = link.route.replace(`/${currentLang}`, '');
                          return router.asPath.includes(routePath) && routePath !== '/';
                        }) ? 'primaryColor font-bold' : ''}>
                          {t(menu.name)}
                        </span>
                        <FaChevronDown
                          size={10}
                          className={`transition-transform duration-200 ${openMenu === menu.name ? 'rotate-180' : ''} ${menu.links.some(link => {
                            const routePath = link.route.replace(`/${currentLang}`, '');
                            return router.asPath.includes(routePath) && routePath !== '/';
                          }) ? 'primaryColor' : ''
                            }`}
                        />
                      </button>

                      {menu.links.some(link => {
                        const routePath = link.route.replace(`/${currentLang}`, '');
                        return router.asPath.includes(routePath) && routePath !== '/';
                      }) && (
                          <div className="flex gap-1">
                            <div className="w-1 h-1 rounded-full primaryBg"></div>
                            <div className="w-1 h-1 rounded-full primaryBg"></div>
                            <div className="w-1 h-1 rounded-full primaryBg"></div>
                          </div>
                        )}

                      {openMenu === menu.name && (
                        <div className="dropdown-content absolute left-0 top-full z-20 mt-2 w-[280px] rounded-md cardBg shadow-lg newBorder">
                          <ul className="py-1 [&>li:last-child>button]:border-b-0">
                            {menu.links.map((link) => (
                              <li key={link.name}>
                                <button
                                  className="hover:primaryColor hover:primaryBorderColor group block w-full cursor-pointer border-b-2 border-dashed px-3 py-2 text-left transition-all duration-150"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    if (link.name === "areaConverter") {
                                      setShowAreaConverter(true);
                                    } else {
                                      handleNavigateLinks(e, link);
                                    }
                                    setOpenMenu(null);
                                  }}
                                >
                                  <span className="transition-all duration-150 group-hover:ml-2">
                                    {t(link.name)}
                                  </span>
                                </button>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </li>
                  ))}
                  <li
                    className="hover:primaryColor text-nowrap font-medium text-gray-700 hover:cursor-pointer flex flex-col items-center"
                    onClick={() =>
                      router.push(`/${locale ? locale : defaultLang}/about-us`)
                    }
                  >
                    <span className={router.asPath.includes('/about-us') ? 'primaryColor font-bold' : ''}>
                      {t("aboutUs")}
                    </span>
                    {router.asPath.includes('/about-us') && (
                      <div className="flex gap-1">
                        <div className="w-1 h-1 rounded-full primaryBg"></div>
                        <div className="w-1 h-1 rounded-full primaryBg"></div>
                        <div className="w-1 h-1 rounded-full primaryBg"></div>
                      </div>
                    )}
                  </li>
                  <li
                    className="hover:primaryColor text-nowrap font-medium text-gray-700 hover:cursor-pointer flex flex-col items-center"
                    onClick={() =>
                      router.push(
                        `/${locale ? locale : defaultLang}/contact-us`,
                      )
                    }
                  >
                    <span className={router.asPath.includes('/contact-us') ? 'primaryColor font-bold' : ''}>
                      {t("contactUs")}
                    </span>
                    {router.asPath.includes('/contact-us') && (
                      <div className="flex gap-1">
                        <div className="w-1 h-1 rounded-full primaryBg"></div>
                        <div className="w-1 h-1 rounded-full primaryBg"></div>
                        <div className="w-1 h-1 rounded-full primaryBg"></div>
                      </div>
                    )}
                  </li>
                </ul>

                <div className="hidden items-center gap-3 font-medium 2xl:flex">
                  {userData === null ? (
                    <button
                      className="hover:primaryBg flex items-center gap-2 rounded bg-gray-900 px-4 py-2 text-white transition-all"
                      onClick={() => setShowLogin(true)}
                    >
                      <FaRegUserCircle size={16} />
                      {t("login")}/{t("register")}
                    </button>
                  ) : (userData && userData?.name) ||
                    userData?.email ||
                    userData?.mobile ? (
                    <div className="relative dropdown-menu">
                      <button
                        className="dropdown-trigger hover:primaryColor flex w-max items-center gap-1 bg-transparent p-0 text-base font-medium text-gray-700 transition-all"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleMenuToggle("user");
                        }}
                      >
                        <FaRegUserCircle size={18} />
                        {userData?.name
                          ? truncate(userData?.name, 15)
                          : t("welcomeUser")}
                        <FaChevronDown
                          size={10}
                          className={`transition-transform duration-200 ${openMenu === "user" ? 'rotate-180' : ''
                            }`}
                        />
                      </button>

                      {openMenu === "user" && (
                        <div className="dropdown-content absolute right-0 top-full z-20 mt-2 min-w-[130px] rounded-md bg-white shadow-lg border">
                          <ul className="py-1">
                            <li>
                              <button
                                className="hover:primaryColor hover:primaryBorderColor group block w-full cursor-pointer border-b-2 border-dashed px-3 py-2 text-left transition-all duration-150"
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  handleNavigateLinks(e, {
                                    route: `/${locale}/user/dashboard`,
                                  });
                                  setOpenMenu(null);
                                }}
                              >
                                <span className="transition-all duration-150 group-hover:ml-2">
                                  {t("dashboard")}
                                </span>
                              </button>
                            </li>
                            <li>
                              <button
                                className="hover:primaryColor hover:primaryBorderColor group block w-full cursor-pointer px-3 py-2 text-left transition-all duration-150"
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  handleLogout();
                                  setOpenMenu(null);
                                }}
                              >
                                <span className="transition-all duration-150 group-hover:ml-2">
                                  {t("logout")}
                                </span>
                              </button>
                            </li>
                          </ul>
                        </div>
                      )}
                    </div>
                  ) : null}

                  {isUserLoggedIn && (
                    <button
                      className="brandBg z-10 flex items-center gap-2 rounded-md px-4 py-2 text-white transition-all duration-500 hover:primaryBg text-nowrap"
                      onClick={(e) =>
                        handlePackageCheck(
                          e,
                          PackageTypes.PROPERTY_LIST,
                          router,
                          null, null, null, null, t
                        )
                      }
                    >
                      <FiPlusCircle />
                      {t("addProperty")}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </header>
      </div>

      <LoginModal showLogin={showLogin} setShowLogin={setShowLogin} />
      {showAreaConverter && (
        <AreaConverter
          isOpen={showAreaConverter}
          onClose={() => setShowAreaConverter(false)}
        />
      )}
      <LocationSearchWithRadius
        isOpen={isLocationDialogOpen}
        onClose={() => setIsLocationDialogOpen(false)}
      />

      {/* Global style to fix Google Places Autocomplete z-index */}
      <style jsx global>{`
        .pac-container.pac-logo {
          z-index: 10000 !important;
        }
      `}</style>

    </>
  );
};

export default Header;
