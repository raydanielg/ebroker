"use client";
import React, { useEffect, useState } from "react";
import FirebaseData from "@/utils/Firebase";
import { useSelector } from "react-redux";

const PushNotificationLayout = ({ children, onNotificationReceived }) => {
  const [notification, setNotification] = useState(null);
  const [userToken, setUserToken] = useState(null);
  const [isTokenFound, setTokenFound] = useState(false);
  const [fcmToken, setFcmToken] = useState("");
  const { fetchToken, onMessageListener } = FirebaseData();

  const fcmTokenFromRedux = useSelector((state) => state.WebSetting?.fcmToken);

  const handleFetchToken = async () => {
    await fetchToken(setTokenFound, setFcmToken);
  };

  useEffect(() => {
    handleFetchToken();
  }, [userToken]);

  useEffect(() => {
    if (typeof window !== undefined) {
      setUserToken(fcmTokenFromRedux);
    }
  }, [userToken]);

  useEffect(() => {
    onMessageListener()
      .then((payload) => {
        if (payload && payload.data) {
          setNotification(payload.data);
          onNotificationReceived(payload.data);
        }
      })
      .catch((err) => {
        console.error("Error handling foreground notification:", err);
        // toast.error('Error handling notification.');
      });
  }, [notification, onNotificationReceived]);

  // / service worker
  useEffect(() => {
    if (fcmToken) {
      // Only register the service worker if fcmToken is not null
      if ("serviceWorker" in navigator) {
        navigator.serviceWorker
          .register("/firebase-messaging-sw.js")
          .then((registration) => {
            console.info(
              "Service Worker registration successful with scope: ",
              registration.scope,
            );
          })
          .catch((err) => {
            console.error("Service Worker registration failed: ", err);
          });
      }
    }
  }, [fcmToken]);

  // Simply render children without modification
  return <>{children}</>;
};

export default PushNotificationLayout;
