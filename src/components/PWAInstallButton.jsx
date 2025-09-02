'use client';

import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { useTranslation } from './context/TranslationContext';

/**
 * PWA Install Button Component
 * Shows an install button when the PWA is installable but not yet installed
 * Only displays on mobile devices (iOS, Android) when NEXT_PUBLIC_ENABLE_PWA is true
 * Respects user preferences via cookies
 */
export default function PWAInstallButton() {

    const t = useTranslation()
    const [installPrompt, setInstallPrompt] = useState(null);
    const [isInstalled, setIsInstalled] = useState(false);
    const [isIOS, setIsIOS] = useState(false);
    const [isSafari, setIsSafari] = useState(false);
    const [showIOSGuide, setShowIOSGuide] = useState(false);
    const [isMobileDevice, setIsMobileDevice] = useState(false);
    const [isPwaEnabled, setIsPwaEnabled] = useState(false);
    const [showInstallButton, setShowInstallButton] = useState(false);

    // Cookie names for tracking user preferences
    const PWA_DISMISSED_COOKIE = 'pwa_install_dismissed';
    const PWA_INSTALLED_COOKIE = 'pwa_installed';

    useEffect(() => {
        // Check if PWA feature is enabled via env variable
        const pwaEnabled = process.env.NEXT_PUBLIC_PWA_ENABLED === 'true';
        setIsPwaEnabled(pwaEnabled);

        // If PWA is not enabled, don't continue
        if (!pwaEnabled) return;

        if (typeof window === 'undefined') return;

        // Check for cookies first
        const dismissedByUser = Cookies.get(PWA_DISMISSED_COOKIE) === 'true';
        const installedCookie = Cookies.get(PWA_INSTALLED_COOKIE) === 'true';

        if (dismissedByUser || installedCookie) {
            setShowInstallButton(false);
            return;
        }

        // Browser detection
        const userAgent = navigator.userAgent;
        // Check for iOS device
        const isIOSDevice =
            /iPad|iPhone|iPod/.test(userAgent) && !window.MSStream;
        setIsIOS(isIOSDevice);

        // Check if user is on Safari (required for iOS PWA installation)
        const isSafariBrowser = /^((?!chrome|android).)*safari/i.test(userAgent);
        setIsSafari(isSafariBrowser);

        // Check if the device is mobile (Android or iOS)
        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
            userAgent
        );
        setIsMobileDevice(isMobile);

        // Check if the app is already installed
        const checkInstalled = () => {
            if (window.matchMedia('(display-mode: standalone)').matches) {
                setIsInstalled(true);
                Cookies.set(PWA_INSTALLED_COOKIE, 'true', { expires: 30 }); // Set cookie for 30 days
                return true;
            }

            // Also check for window-controls-overlay mode (Windows PWA)
            if (window.matchMedia('(display-mode: window-controls-overlay)').matches) {
                setIsInstalled(true);
                Cookies.set(PWA_INSTALLED_COOKIE, 'true', { expires: 30 }); // Set cookie for 30 days
                return true;
            }

            return false;
        };

        checkInstalled();

        // Listen for the beforeinstallprompt event (not supported on iOS)
        const handleBeforeInstallPrompt = (e) => {
            // Only store the event if it's a mobile device
            if (isMobile) {
                // Prevent Chrome 67 and earlier from automatically showing the prompt
                e.preventDefault();
                // Store the event for later use
                setInstallPrompt(e);
                // Show the install button
                setShowInstallButton(true);
            }
        };

        window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

        window.addEventListener('appinstalled', () => {
            setIsInstalled(true);
            Cookies.set(PWA_INSTALLED_COOKIE, 'true', { expires: 30 }); // Set cookie for 30 days
            setShowInstallButton(false);
        });

        // For iOS devices, always show the button once per session
        if (isIOSDevice && !dismissedByUser && !installedCookie) {
            setShowInstallButton(true);
        }

        return () => {
            window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
            window.removeEventListener('appinstalled', () => {
                setIsInstalled(true);
                Cookies.set(PWA_INSTALLED_COOKIE, 'true', { expires: 30 });
            });
        };
    }, []);

    const handleInstallClick = async () => {
        if (isIOS) {
            // Show iOS installation guide
            setShowIOSGuide(true);
        } else if (installPrompt) {
            // Show the install prompt for non-iOS devices
            const promptEvent = installPrompt;
            promptEvent.prompt();

            // Wait for the user to respond to the prompt
            const choiceResult = await promptEvent.userChoice;

            if (choiceResult.outcome === 'accepted') {
                // User accepted the install prompt
                Cookies.set(PWA_INSTALLED_COOKIE, 'true', { expires: 30 });
            } else {
                // User dismissed the install prompt
                Cookies.set(PWA_DISMISSED_COOKIE, 'true', { expires: 7 }); // Set for 7 days
            }

            // Clear the saved prompt since it can't be used again
            setInstallPrompt(null);
            setShowInstallButton(false);
        } else {
            alert(
                'Installation prompt not available. Please try again later or check if the app is already installed.'
            );
        }
    };

    // Close button handler
    const handleCloseButton = () => {
        Cookies.set(PWA_DISMISSED_COOKIE, 'true', { expires: 7 }); // Set cookie for 7 days
        setShowInstallButton(false);
    };

    // Close iOS guide and set cookie
    const handleCloseIOSGuide = () => {
        setShowIOSGuide(false);
        Cookies.set(PWA_DISMISSED_COOKIE, 'true', { expires: 7 }); // Set cookie for 7 days
    };

    // Don't render anything if:
    // 1. PWA is not enabled via env variable
    // 2. The app is already installed
    // 3. It's not a mobile device
    // 4. User has dismissed the prompt
    if (!isPwaEnabled || isInstalled || !isMobileDevice || !showInstallButton) {
        return null;
    }

    // Show install button based on our state which respects cookies
    return (
        <>
            <div className="fixed bottom-20 right-2 z-50 flex items-end">
                <button
                    onClick={handleInstallClick}
                    className="flex items-center space-x-2  primary_bg_color px-4 py-2 brandBg text-white shadow-lg rounded-l-md"
                    aria-label={`Install ${process.env.NEXT_PUBLIC_APPLICATION_NAME || 'eBroker'}`}
                >
                    <span>{isIOS ? 'Add to Home Screen' : `Install ${process.env.NEXT_PUBLIC_APPLICATION_NAME || 'eBroker'}`}</span>
                </button>

                <button
                    onClick={handleCloseButton}
                    className="brandBg text-white py-2 px-4 w-6 h-full flex items-center justify-center rounded-r-md"
                    aria-label="Dismiss"
                >
                    ✕
                </button>
            </div>

            {/* iOS Installation Guide Modal */}
            {showIOSGuide && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                    <div className="max-w-md rounded-lg bg-white text-black p-6 shadow-xl">
                        <h3 className="mb-4 text-lg font-bold">{t('installOnIOS')}</h3>
                        <p className="mb-4">{t('installInstructions')}</p>
                        <ol className="mb-4 ml-5 list-decimal space-y-2">
                            <li>{t('tapShareButton')}</li>
                            <li>{t('scrollDown')}</li>
                            <li>{t('tapAdd')}</li>
                        </ol>
                        {!isSafari && (
                            <p className="mb-4 text-red-500">
                                ⚠️ {t('safariWarning')}
                            </p>
                        )}
                        <button
                            onClick={handleCloseIOSGuide}
                            className="w-full rounded-md primary_bg_color py-2 text-white"
                        >
                            {t('close')}
                        </button>
                    </div>
                </div>
            )}
        </>
    );
} 