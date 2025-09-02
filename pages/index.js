import axios from "axios";
import { useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import MetaData from "@/components/meta/MetaData";
import { setDefaultLanguage } from "@/redux/slices/languageSlice";
import FullScreenSpinLoader from "@/components/ui/loaders/FullScreenSpinLoader";

/**
 * Fetches web settings including default language from API
 * @returns {Promise<Object|null>} Web settings data or null on error
 */
const fetchWebSettings = async () => {
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}${process.env.NEXT_PUBLIC_END_POINT}web-settings`,
    );
    return response.data;
  } catch (err) {
    console.error("Failed to fetch web settings:", err);
    return null;
  }
};

/**
 * Root page that handles language redirection based on SEO settings
 */
export default function Home() {
  const router = useRouter();
  const dispatch = useDispatch();
  const [settingsData, setSettingsData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Handle redirection when SEO is disabled (static export)
  useEffect(() => {
    const handleNoSeoRedirect = async () => {
      try {
        const settings = await fetchWebSettings();
        setSettingsData(settings);
        const defaultLanguage = settings?.data?.default_language ?? "en-new";
        router.replace(`/${defaultLanguage}`);
        dispatch(setDefaultLanguage({ data: defaultLanguage }));
      } catch (error) {
        console.error("Error during redirection:", error);
        // Fallback to English if something goes wrong
        router.replace("/en-new");
      } finally {
        setIsLoading(false);
      }
    };

    handleNoSeoRedirect();
  }, []);
  // Show .env metadata when loading redirection
  return (
    <>
      <MetaData
        title={process.env.NEXT_PUBLIC_META_TITLE}
        description={process.env.NEXT_PUBLIC_META_DESCRIPTION}
        keywords={process.env.NEXT_PUBLIC_META_KEYWORD}
        pageName={"/"}
      />
      <FullScreenSpinLoader />
    </>
  );
}
