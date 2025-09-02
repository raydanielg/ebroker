import "@/styles/globals.css";
import { Provider } from "react-redux";
import { store } from "@/redux/store";
import { TranslationProvider } from "@/components/context/TranslationContext";
import { Toaster } from "react-hot-toast";
import { Suspense, useEffect } from "react";
import { getCurrentLocationData } from "@/utils/helperFunction";
import SlopedCurtainLoader from "@/components/ui/loaders/SlopedCurtainLoader";
import ErrorBoundary from "@/components/error/ErrorBoundary";

export default function App({ Component, pageProps }) {
  // Function to request location permission
  const requestLocationPermission = async () => {
    if ("geolocation" in navigator) {
      // Use getCurrentLocationData with proper callbacks
      getCurrentLocationData(
        (locationData) => {
        },
        (error) => {
          // Error callback
          console.error("Error getting location:", error);
        },
      );
    } else {
      // Geolocation is not supported
      console.error("Geolocation is not supported by this browser");
    }
  };

  useEffect(() => {
    requestLocationPermission();
  }, []);

  return (
    <ErrorBoundary>
      <Provider store={store}>
        <TranslationProvider>
          <Suspense fallback={<SlopedCurtainLoader />}>
            <Component {...pageProps} />
          </Suspense>
          <Toaster />
        </TranslationProvider>
      </Provider>
    </ErrorBoundary>
  );
}
