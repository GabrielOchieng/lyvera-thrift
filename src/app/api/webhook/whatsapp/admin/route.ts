// import { NextResponse } from "next/server";
// import { processAdminImage } from "@/lib/whatsapp/admin-logic";

// // 1. GET: Verification for Meta Webhook setup
// export async function GET(req: Request) {
//   const { searchParams } = new URL(req.url);
//   const mode = searchParams.get("hub.mode");
//   const token = searchParams.get("hub.verify_token");
//   const challenge = searchParams.get("hub.challenge");

//   if (mode === "subscribe" && token === process.env.WHATSAPP_VERIFY_TOKEN) {
//     console.log("✅ Admin Webhook Verified");
//     return new Response(challenge, { status: 200 });
//   }
//   return new Response("Forbidden", { status: 403 });
// }

// // 2. POST: Handle incoming Admin messages
// export async function POST(req: Request) {
//   try {
//     const body = await req.json();
//     const value = body.entry?.[0]?.changes?.[0]?.value;
//     const message = value?.messages?.[0];

//     if (!message) return new Response("OK", { status: 200 });

//     // Security: Only allow specific phone numbers to upload products
//     const adminPhones = process.env.ADMIN_PHONES?.split(",") || [];
//     if (!adminPhones.includes(message.from)) {
//       console.log(`Blocked: ${message.from} is not an authorized admin.`);
//       return new Response("Unauthorized", { status: 403 });
//     }

//     // Process image uploads from Admin
//     if (message.image) {
//       const product = await processAdminImage(message);

//       // Send Success Confirmation to Admin
//       const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://lyvera.store";
//       const replyText = `✅ *Item Listed!*\n\n*Name:* ${product.name}\n*Price:* KES ${product.price}\n\n🔗 *View:* ${appUrl}/shop/${product.id}`;

//       await fetch(
//         `https://graph.facebook.com/v21.0/${process.env.WHATSAPP_PHONE_NUMBER_ID}/messages`,
//         {
//           method: "POST",
//           headers: {
//             Authorization: `Bearer ${process.env.WHATSAPP_TOKEN}`,
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify({
//             messaging_product: "whatsapp",
//             to: message.from,
//             type: "text",
//             text: { body: replyText },
//           }),
//         },
//       );
//     }

//     return new Response("OK", { status: 200 });
//   } catch (error) {
//     console.error("🛑 Admin Webhook Error:", error);
//     return new Response("Internal Server Error", { status: 500 });
//   }
// }

import { processAdminImage } from "@/lib/whatsapp/admin-logic";
export async function POST(req: Request) {
  try {
    const body = await req.json();
    // Log the full body to ensure the structure matches what you expect
    console.log("[DEBUG] Webhook Payload:", JSON.stringify(body, null, 2));

    const value = body.entry?.[0]?.changes?.[0]?.value;
    const message = value?.messages?.[0];

    if (!message) {
      console.log("[DEBUG] No message found in payload");
      return new Response("OK", { status: 200 });
    }

    console.log(`[DEBUG] Received message from: ${message.from}`);

    // Security Check
    const adminPhones = process.env.ADMIN_PHONES?.split(",") || [];
    if (!adminPhones.includes(message.from)) {
      console.log(
        `[BLOCKED] ${message.from} is not in ADMIN_PHONES: ${process.env.ADMIN_PHONES}`,
      );
      return new Response("Unauthorized", { status: 403 });
    }

    // Process image uploads
    if (message.image) {
      console.log(
        `[DEBUG] Image detected. Image ID: ${message.image.id}. Processing...`,
      );

      const product = await processAdminImage(message);
      console.log(`[DEBUG] Product saved to DB: ${product.id}`);

      // Send Success Confirmation
      const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://lyvera.store";
      const replyText = `✅ *Item Listed!*\n\n*Name:* ${product.name}\n*Price:* KES ${product.price}\n\n🔗 *View:* ${appUrl}/shop/${product.id}`;

      console.log("[DEBUG] Sending WhatsApp confirmation...");
      const whatsappResponse = await fetch(
        `https://graph.facebook.com/v21.0/${process.env.WHATSAPP_PHONE_NUMBER_ID}/messages`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${process.env.WHATSAPP_TOKEN}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            messaging_product: "whatsapp",
            to: message.from,
            type: "text",
            text: { body: replyText },
          }),
        },
      );

      const responseData = await whatsappResponse.json();
      console.log(
        "[DEBUG] WhatsApp API Response:",
        JSON.stringify(responseData),
      );
    } else {
      console.log("[DEBUG] Message received, but no image found.");
    }

    return new Response("OK", { status: 200 });
  } catch (error) {
    console.error("🛑 Admin Webhook Error:", error);
    // Returning 200 prevents Meta from spamming retries
    return new Response("OK", { status: 200 });
  }
}
