// import webpush from "web-push";
// import { PushSubscription } from "@prisma/client"; // Use your actual Prisma type

// webpush.setVapidDetails(
//   "mailto:gabrieldev456@gmail.com",
//   process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
//   process.env.VAPID_PRIVATE_KEY!,
// );

// export async function sendPushNotification(
//   subscription: PushSubscription,
//   title: string,
//   body: string,
//   url: string = "/orders",
// ) {
//   const payload = JSON.stringify({ title, body, url });

//   const pushConfig = {
//     endpoint: subscription.endpoint,
//     keys: {
//       auth: subscription.auth,
//       p256dh: subscription.p256dh,
//     },
//   };

//   try {
//     await webpush.sendNotification(pushConfig, payload);
//   } catch (error: any) {
//     // If the notification fails because the subscription expired (Status 410)
//     if (error.statusCode === 410 || error.statusCode === 404) {
//       console.log("Subscription has expired or is no longer valid.");
//       // Logic to delete from DB would go here
//     }
//     console.error("Error sending push notification:", error);
//   }
// }

import webpush from "web-push";
import { PushSubscription } from "@prisma/client";

webpush.setVapidDetails(
  "mailto:gabrieldev456@gmail.com",
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
  process.env.VAPID_PRIVATE_KEY!,
);

export async function sendPushNotification(
  subscription: PushSubscription,
  title: string,
  body: string,
  url: string = "/shop", // Updated default to point directly to shop
) {
  // Wrapping 'url' in a 'data' block is standard practice for service worker event parsing
  const payload = JSON.stringify({
    title,
    body,
    data: { url },
  });

  const pushConfig = {
    endpoint: subscription.endpoint,
    keys: {
      auth: subscription.auth,
      p256dh: subscription.p256dh,
    },
  };

  try {
    await webpush.sendNotification(pushConfig, payload);
  } catch (error: any) {
    if (error.statusCode === 410 || error.statusCode === 404) {
      console.log(
        `Subscription expired (Status ${error.statusCode}). Cleaning up database entries...`,
      );
      // You can add your prisma delete query here later to remove dead tokens
    }
    console.error("Error sending push notification:", error);
  }
}
