importScripts(
  "https://www.gstatic.com/firebasejs/11.6.0/firebase-app-compat.js",
);
importScripts(
  "https://www.gstatic.com/firebasejs/11.6.0/firebase-messaging-compat.js",
);
// // Initialize the Firebase app in the service worker by passing the generated config

const firebaseConfig = {
  apiKey: "xxxxxxxxxxxxxxxxxxxxxxxxxxx",
  authDomain: "xxxxxxxxxxxxxxxxxxxxxxxxxxx",
  projectId: "xxxxxxxxxxxxxxxxxxxxxxxxxx",
  storageBucket: "xxxxxxxxxxxxxxxxxxxxxxxxxx",
  messagingSenderId: "xxxxxxxxxxxxxxxxxxxxxxxxxx",
  appId: "xxxxxxxxxxxxxxxxxxxxxxxxxx",
  measurementId: "xxxxxxxxxxxxxxxxxxxxxxxxxx",
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Retrieve firebase messaging
const messaging = firebase.messaging();

self.addEventListener("install", function (event) {
  console.log("Hello world from the Service Worker");
});

// Handle background messages
self.addEventListener("push", function (event) {

  if (!event.data) {
    return;
  }

  try {
    const payload = event.data.json();

    const notificationTitle = payload.notification?.title;
    let clickAction = "YOUR_WEB_URL_HERE";
    if (payload?.data?.chat_message_type) {
      clickAction = clickAction.concat(
        `user/chat?propertyId=${payload.data?.property_id}&userId=${payload.data?.sender_id}`,
      );
    } else {
      clickAction = clickAction;
    }
    const notificationOptions = {
      body: payload.notification?.body,
      icon: payload.data?.icon || "/favicon.ico",
      requireInteraction: true,
      data: {
        url: clickAction,
      },
    };

    // Send a message to the clients about the notification
    event.waitUntil(
      self.clients.matchAll({ includeUncontrolled: true }).then((clients) => {
        let isClientFocused = false;

        for (const client of clients) {
          if (client.focused || client.visibilityState === "visible") {
            isClientFocused = true;
            break;
          }
        }

        if (!isClientFocused) {
          // Only postMessage if none of the clients are focused (i.e., background)
          clients.forEach((client) => {
            client.postMessage({
              type: "NOTIFICATION_RECEIVED",
              payload,
            });
          });
        }
      }),
    );

    // Show the notification
    event.waitUntil(
      self.registration.showNotification(
        notificationTitle,
        notificationOptions,
      ),
    );
  } catch (error) {
    console.error("Error processing push event:", error);
  }
});

// // Handle notification click events
self.addEventListener("notificationclick", function (event) {

  event.notification.close();

  // Check if a window is already open and focus/redirect it, or open a new one
  event.waitUntil(
    clients
      .matchAll({ type: "window", includeUncontrolled: true })
      .then((clientList) => {
        const targetUrl = event.notification.data.url;
        // If no existing window found, open a new one
        return clients.openWindow(targetUrl);
      })
      .catch((error) => {
        console.error("Error handling notification click:", error);
        // Fallback: just open a new window
        return clients.openWindow(event.notification.data.url);
      }),
  );
});
