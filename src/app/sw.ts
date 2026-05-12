// import { defaultCache } from "@serwist/next/worker";
// import type { PrecacheEntry, SerwistGlobalConfig } from "serwist";
// import { Serwist } from "serwist";

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

// serwist.addEventListeners();

// src/app/sw.ts
import { defaultCache } from "@serwist/next/worker";
import type { PrecacheEntry, SerwistGlobalConfig } from "serwist";
import { Serwist } from "serwist";

// 1. Extend the ServiceWorkerGlobalScope interface
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
});

// 1. Listen for the 'push' event from the server
self.addEventListener("push", (event) => {
  if (event.data) {
    const data = event.data.json();
    const options = {
      body: data.body,
      icon: "/icons/manifest-icon-192.maskable.png",
      badge: "/icons/manifest-icon-192.maskable.png", // Status bar icon
      data: { url: data.url || "/" },
    };

    event.waitUntil(self.registration.showNotification(data.title, options));
  }
});

// 2. Handle what happens when a user clicks the notification
self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  event.waitUntil(self.clients.openWindow(event.notification.data.url));
});

serwist.addEventListeners();
