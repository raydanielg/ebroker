"use client";
import { initializeApp, getApps, getApp } from "firebase/app";
import {
  getMessaging,
  getToken,
  onMessage,
  isSupported,
} from "firebase/messaging";
import firebase from "firebase/compat/app";
import { getAuth } from "firebase/auth";
import { setFCMToken } from "@/redux/slices/webSettingSlice";
import { createStickyNote } from "./helperFunction";

const FirebaseData = () => {
  const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_APP_ID,
    measurementId: process.env.NEXT_PUBLIC_MEASUREMENT_ID,
  };

  if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
  }

  const app = initializeApp(firebaseConfig);
  const authentication = getAuth(app);
  const firebaseApp = !getApps().length
    ? initializeApp(firebaseConfig)
    : getApp();

  // Register service worker
  const registerServiceWorker = async () => {
    if (typeof window !== "undefined" && "serviceWorker" in navigator) {
      try {
        const registration = await navigator.serviceWorker.register(
          "/firebase-messaging-sw.js",
        );
        console.info("Service Worker registered:", registration.scope);
        return registration;
      } catch (err) {
        console.error("Service Worker registration failed:", err);
        return null;
      }
    }
    return null;
  };

  // Check if messaging is supported in this browser
  const messagingInstance = async () => {
    try {
      const isSupportedBrowser = await isSupported();
      if (isSupportedBrowser) {
        return getMessaging(firebaseApp);
      } else {
        console.error("Firebase messaging is not supported in this browser");
        createStickyNote();
        return null;
      }
    } catch (err) {
      console.error("Error checking messaging support:", err);
      return null;
    }
  };

  // Fetch FCM token
  const fetchToken = async (setTokenFound, setFcmToken) => {
    try {
      // Ensure service worker is registered first
      await registerServiceWorker();

      // Get messaging instance
      const messaging = await messagingInstance();
      if (!messaging) {
        console.error("Messaging not supported in this browser");
        setTokenFound?.(false);
        setFcmToken?.(null);
        return;
      }

      // Request permission
      const permission = await Notification.requestPermission();
      if (permission !== "granted") {
        console.error("Notification permission denied");
        setTokenFound?.(false);
        setFcmToken?.(null);
        return;
      }

      // Get token
      const currentToken = await getToken(messaging, {
        vapidKey: process.env.NEXT_PUBLIC_VAPID_KEY,
      });

      if (currentToken) {
        setFcmToken?.(currentToken);
        // Dispatch to Redux
        setFCMToken(currentToken);
        setTokenFound?.(true);
      } else {
        console.error("No token available");
        setTokenFound?.(false);
        setFcmToken?.(null);
      }
    } catch (err) {
      console.error("Error fetching token:", err);
      setTokenFound?.(false);
      setFcmToken?.(null);
    }
  };

  // Setup foreground message listener - using callback pattern
  const onMessageListener = async () => {
    const messaging = await messagingInstance();
    if (messaging) {
      return new Promise((resolve) => {
        onMessage(messaging, (payload) => {
          resolve(payload);
        });
      });
    } else {
      console.error("Messaging not supported.");
      return null;
    }
  };

  const signOut = () => {
    return authentication.signOut();
  };

  return {
    firebaseApp,
    authentication,
    fetchToken,
    onMessageListener,
    signOut,
  };
};

export default FirebaseData;
