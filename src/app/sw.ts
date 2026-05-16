// // src/app/sw.ts
// import { defaultCache } from "@serwist/next/worker";
// import type { PrecacheEntry, SerwistGlobalConfig } from "serwist";
// import { Serwist } from "serwist";

// // 1. Extend the ServiceWorkerGlobalScope interface
// declare global {
//   interface ServiceWorkerGlobalScope extends SerwistGlobalConfig {
//     __SW_MANIFEST: (string | PrecacheEntry)[] | undefined;
//   }
// }

// declare const self: ServiceWorkerGlobalScope;

// const serwist = new Serwist({
//   precacheEntries: self.__SW_MANIFEST,
//   skipWaiting: true,
//   clientsClaim: true,
//   navigationPreload: true,
//   runtimeCaching: defaultCache,
//   fallbacks: {
//     entries: [
//       {
//         url: "/~offline",
//         matcher({ request }) {
//           // 'navigate' is the standard for actual page changes
//           return request.mode === "navigate";
//         },
//       },
//     ],
//   },
// });

// // 1. Listen for the 'push' event from the server
// self.addEventListener("push", (event) => {
//   if (event.data) {
//     const data = event.data.json();
//     const options = {
//       body: data.body,
//       icon: "/icons/manifest-icon-192.maskable.png",
//       badge: "/icons/manifest-icon-192.maskable.png", // Status bar icon
//       data: { url: data.url || "/" },
//     };

//     event.waitUntil(self.registration.showNotification(data.title, options));
//   }
// });

// // 2. Handle what happens when a user clicks the notification
// self.addEventListener("notificationclick", (event) => {
//   event.notification.close();
//   event.waitUntil(self.clients.openWindow(event.notification.data.url));
// });

// serwist.addEventListeners();

// src/app/sw.ts
import { defaultCache } from "@serwist/next/worker";
import type { PrecacheEntry, SerwistGlobalConfig } from "serwist";
import { Serwist } from "serwist";

declare global {
  interface ServiceWorkerGlobalScope extends SerwistGlobalConfig {
    __SW_MANIFEST: (string | PrecacheEntry)[] | undefined;
  }
}

declare const self: ServiceWorkerGlobalScope;

const serwist = new Serwist({
  precacheEntries: self.__SW_MANIFEST,
  skipWaiting: true,
  clientsClaim: true,
  navigationPreload: true,
  runtimeCaching: defaultCache,
  fallbacks: {
    entries: [
      {
        url: "/~offline",
        matcher({ request }) {
          return request.mode === "navigate";
        },
      },
    ],
  },
});

// 1. Listen for the 'push' event from the server
self.addEventListener("push", (event) => {
  if (event.data) {
    const payload = event.data.json();

    const options = {
      body: payload.body,
      icon: "/icons/manifest-icon-192.maskable.png",
      badge: "/icons/manifest-icon-192.maskable.png",
      // FIXED: Safely read from payload.data.url matching your backend structure
      data: { url: payload.data?.url || "/shop" },
    };

    event.waitUntil(self.registration.showNotification(payload.title, options));
  }
});

// 2. Handle what happens when a user clicks the notification
self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  // FIXED: Standard practice to check if the window is already open before spawning a brand new tab
  const targetUrl = event.notification.data.url;

  event.waitUntil(
    self.clients
      .matchAll({ type: "window", includeUncontrolled: true })
      .then((clientList) => {
        for (const client of clientList) {
          if (client.url.includes(self.location.origin) && "focus" in client) {
            client.navigate(targetUrl);
            return client.focus();
          }
        }
        if (self.clients.openWindow) {
          return self.clients.openWindow(targetUrl);
        }
      }),
  );
});

serwist.addEventListeners();
