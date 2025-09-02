import { useState, useEffect } from 'react'

const useGoogleMapsError = () => {
    const [error, setError] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (typeof window === 'undefined') return;

        // Check if the Google Maps script is already loaded
        const checkGoogleMaps = () => {
            if (window.google && window.google.maps) {
                setError(false);
                setLoading(false);
            } else {
                // Wait a bit and try again
                setTimeout(() => {
                    if (window.google && window.google.maps) {
                        setError(false);
                        setLoading(false);
                    } else {
                        setError(new Error("Google Maps failed to load"));
                        setLoading(false);
                    }
                }, 3000); // Wait 3s after document load
            }
        };

        // Listen for errors on the Google Maps script tag
        const script = document.querySelector('script[src*="maps.googleapis.com"]');
        if (script) {
            const onError = () => {
                setError(new Error("Failed to load Google Maps script"));
            };
            const onLoad = () => {
                setLoading(false);
            };
            script.addEventListener('error', onError);
            script.addEventListener('load', onLoad);
            checkGoogleMaps();

            return () => {
                script.removeEventListener('error', onError);
                script.removeEventListener('load', onLoad);
            };
        } else {
            setError(new Error("Google Maps script not found"));
            setLoading(false);
        }
    }, []);

    return { error, loading };
};

export default useGoogleMapsError;
