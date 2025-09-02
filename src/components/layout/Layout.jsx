import dynamic from "next/dynamic";
import * as api from "@/api/apiRoutes";
import { useCallback, useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setWebSettings } from "@/redux/slices/webSettingSlice";
import {
  setActiveLanguage,
  setCurrentLanguage,
  setDefaultLanguage,
  setIsFetched,
  setLanguages,
  setManualChange,
  setIsLanguageLoaded,
} from "@/redux/slices/languageSlice";
import { useRouter } from "next/router";
import SomthingWentWrong from "../error/SomthingWentWrong";
import { setCategories } from "@/redux/slices/cacheSlice";
import withAuth from "../HOC/withAuth";
import Header from "./Header";
import Footer from "./Footer";
import FullScreenSpinLoader from "../ui/loaders/FullScreenSpinLoader";
// To suppress hydration error
const PushNotificationLayout = dynamic(
  () => import("../wrapper/PushNotificationLayout"),
  { ssr: false },
);

import { useTranslation } from "../context/TranslationContext";
import CookieComponent from "../cookie/Cookie";
import PWAInstallButton from "../PWAInstallButton";
import UnderMaintenance from "../under-maintenance/UnderMaintenance";

const Layout = ({ children }) => {
  const router = useRouter();
  const t = useTranslation()
  const dispatch = useDispatch();
  const [isInitialLoading, setIsInitialLoading] = useState(true); // Only for initial app load
  const [isRouteChanging, setIsRouteChanging] = useState(false); // Only for route changes
  const [isError, setIsError] = useState(false);
  const initialLoadComplete = useRef(false); // Track if initial load finished
  const eventsSetup = useRef(false); // Add a ref to track if events are already set up

  // Get locale from router
  const urlLocale = router.query?.locale || router.locale;

  // Get language settings from Redux
  const defaultLanguage = useSelector((state) => state.LanguageSettings?.default_language);
  const activeLanguage = useSelector((state) => state.LanguageSettings?.active_language);
  const isFetched = useSelector((state) => state.LanguageSettings?.isFetched);
  const manualChange = useSelector((state) => state.LanguageSettings?.manual_change);
  const isLanguageLoaded = useSelector((state) => state.LanguageSettings?.isLanguageLoaded);
  const currentLanguage = useSelector((state) => state.LanguageSettings?.current_language);
  const webSettings = useSelector((state) => state.WebSetting?.data);
  const underMaintenance = webSettings?.web_maintenance_mode === "1";
  const allowCookies = webSettings?.allow_cookies;


  // Setup router event listeners for page transitions - only once after initial load
  // useEffect(() => {
  //   // Only set up events once after initial load completes
  //   if (!initialLoadComplete.current || eventsSetup.current) return;

  //   eventsSetup.current = true; // Mark events as set up

  //   // When route change starts
  //   const handleRouteChangeStart = (url) => {
  //     // Don't show loader for hash changes (e.g., #section) or query param changes
  //     const currentPath = router?.pathname;
  //     const newPath = url.split("?")[0].split("#")[0];

  //     if (currentPath !== newPath) {
  //       setIsRouteChanging(true);
  //     }
  //   };

  //   // When route change completes
  //   const handleRouteChangeComplete = () => {
  //     // Add a delay to ensure smooth transition
  //     setTimeout(() => {
  //       setIsRouteChanging(false);
  //     }, 500);
  //   };

  //   // If there's an error during route change
  //   const handleRouteChangeError = () => {
  //     setIsRouteChanging(false);
  //   };

  //   // Subscribe to router events
  //   router.events.on("routeChangeStart", handleRouteChangeStart);
  //   router.events.on("routeChangeComplete", handleRouteChangeComplete);
  //   router.events.on("routeChangeError", handleRouteChangeError);

  //   // Cleanup
  //   return () => {
  //     router.events.off("routeChangeStart", handleRouteChangeStart);
  //     router.events.off("routeChangeComplete", handleRouteChangeComplete);
  //     router.events.off("routeChangeError", handleRouteChangeError);
  //     eventsSetup.current = false; // Reset if component unmounts
  //   };
  // }, [router]); // Only depend on router, check refs inside effect

  // Memoized API calls to prevent unnecessary re-renders
  const fetchWebSettings = useCallback(async () => {
    try {
      const response = await api.getWebSetting();
      const { data } = response;
      document.documentElement.lang = currentLanguage?.code;
      document.documentElement.style.setProperty(
        "--primary-color",
        data?.system_color
      );
      document.documentElement.style.setProperty(
        "--primary-category-background",
        data?.category_background
      );
      document.documentElement.style.setProperty(
        "--primary-sell",
        data?.sell_web_color
      );
      document.documentElement.style.setProperty(
        "--primary-rent",
        data?.rent_web_color
      );
      document.documentElement.style.setProperty(
        "--primary-sell-bg",
        data?.sell_web_background_color
      );
      document.documentElement.style.setProperty(
        "--primary-rent-bg",
        data?.rent_web_background_color
      );
      dispatch(setWebSettings({ data }));
      dispatch(setLanguages({ data: data.languages }));
      dispatch(setDefaultLanguage({ data: data.default_language }));
      document.dir = currentLanguage?.rtl === 1 ? "rtl" : "ltr";
      return true;
    } catch (error) {
      console.error("Failed to fetch web settings:", error);
      setIsError(true);
      return false;
    }
  }, [dispatch]);

  const fetchCategories = useCallback(async () => {
    try {
      const response = await api.getCategoriesApi({ limit: "12", offset: "0" });
      dispatch(setCategories({ data: response.data }));
      return true;
    } catch (error) {
      console.error("Failed to fetch categories:", error);
      return false;
    }
  }, [dispatch]);

  const fetchLanguageData = useCallback(
    async (localeCode) => {
      if (!localeCode) return false;

      // Skip if this is the current active language and data is already loaded
      if (localeCode === activeLanguage && isLanguageLoaded) {
        return true;
      }

      try {
        const response = await api.getLanguageData({
          language_code: localeCode,
          web_language_file: 1,
        });
        if (response?.data?.rtl === 1) {
          document.dir = "rtl";
        } else {
          document.dir = "ltr";
        }

        // Set active language to the requested locale
        dispatch(setActiveLanguage({ data: localeCode }));
        dispatch(setCurrentLanguage({ data: response.data }));
        dispatch(setIsFetched({ data: true }));

        // Also fetch categories to ensure they're updated with new language
        await fetchCategories();

        // Finally mark language as loaded after all dependent data is refreshed
        dispatch(setIsLanguageLoaded({ data: true }));

        return true;
      } catch (error) {
        console.error(
          `Failed to fetch language data for ${localeCode}:`,
          error,
        );
        return false;
      }
    },
    [dispatch, activeLanguage, isLanguageLoaded, fetchCategories],
  );

  // Initial load effect - runs only once when component mounts
  useEffect(() => {
    // Skip if initial load is already complete
    if (initialLoadComplete.current) return;

    const initialLoad = async () => {
      setIsInitialLoading(true);

      await Promise.all([
        fetchWebSettings(),
        fetchCategories(),
      ]);

      // Determine which language to load
      const languageToLoad = urlLocale || activeLanguage || defaultLanguage;

      // If we have a language to load and it's not already loaded
      if (languageToLoad && !isLanguageLoaded) {
        await fetchLanguageData(languageToLoad);
      }

      // Use timeout to ensure minimum display duration
      setIsInitialLoading(false);
      initialLoadComplete.current = true; // Mark initial load as complete
    };

    initialLoad();
  }, []);

  // Handle URL locale changes after initial load
  useEffect(() => {
    // Skip during initial load, if URL locale is not available, or if manual change is in progress
    if (!initialLoadComplete.current || !urlLocale || manualChange) return;

    // If URL locale differs from active language, reset isLanguageLoaded and fetch new language data
    if (urlLocale !== activeLanguage) {
      // Set isLanguageLoaded to false to trigger a reload of language-dependent data
      dispatch(setIsLanguageLoaded({ data: false }));
      fetchLanguageData(urlLocale);
    }
  }, [
    urlLocale,
    activeLanguage,
    manualChange,
    fetchLanguageData,
    initialLoadComplete,
    dispatch,
  ]);

  // Handle manual_change reset
  useEffect(() => {
    if (manualChange) {
      const timer = setTimeout(() => {
        // Reset manual change flag after URL has been updated
        dispatch(setManualChange({ data: false }));
      }, 1000); // Increased timeout to ensure URL change completes

      return () => clearTimeout(timer);
    }
  }, [manualChange, dispatch]);

  // Show loader for initial load or route changes
  if (isInitialLoading || isRouteChanging) {
    return <FullScreenSpinLoader />;
  }

  if (underMaintenance) {
    return (
      <UnderMaintenance />
    )
  }

  if (isError) {
    return <SomthingWentWrong />;
  }

  return (
    <PushNotificationLayout>
      <Header />
      <main>{children}</main>
      <Footer />
      {allowCookies && <CookieComponent />}
      {process.env.NEXT_PUBLIC_PWA_ENABLED === "true" && (
        <PWAInstallButton />
      )}
    </PushNotificationLayout>
  );
};

export default withAuth(Layout);
