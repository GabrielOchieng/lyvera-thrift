// import { NextResponse } from "next/server";
// import { v2 as cloudinary } from "cloudinary";
// import { GoogleGenerativeAI } from "@google/generative-ai";
// import prisma from "../../../../../lib/prisma";

// // 1. Configure Cloudinary
// cloudinary.config({
//   cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
//   api_key: process.env.CLOUDINARY_API_KEY,
//   api_secret: process.env.CLOUDINARY_API_SECRET,
// });

// const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

// export async function GET(req: Request) {
//   const { searchParams } = new URL(req.url);
//   const mode = searchParams.get("hub.mode");
//   const token = searchParams.get("hub.verify_token");
//   const challenge = searchParams.get("hub.challenge");

//   if (mode === "subscribe" && token === process.env.WHATSAPP_VERIFY_TOKEN) {
//     console.log("✅ WEBHOOK_VERIFIED");
//     return new Response(challenge, { status: 200 });
//   }
//   return new Response("Forbidden", { status: 403 });
// }

// export async function POST(req: Request) {
//   try {
//     const body = await req.json();
//     const value = body.entry?.[0]?.changes?.[0]?.value;
//     const message = value?.messages?.[0];

//     // Early exit if no message
//     if (!message) return new Response("OK", { status: 200 });

//     // 2. Multi-Admin Authorization Check
//     // In your .env, use: ADMIN_PHONES="254792390805,2547XXXXXXXX"
//     const allowedPhones = process.env.ADMIN_PHONES?.split(",") || [];

//     if (!allowedPhones.includes(message.from)) {
//       console.log(`Blocked: ${message.from} is not an authorized admin.`);

//       // Send "Unauthorized" message back using direct fetch
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
//             text: {
//               body: "⚠️ You are not authorized to list products on Lyvera.",
//             },
//           }),
//         },
//       );

//       return new Response("OK", { status: 200 });
//     }

//     // 3. Process Product Image
//     if (message.image) {
//       const imageId = message.image.id;
//       const caption = message.image.caption || "";

//       const mediaResponse = await fetch(
//         `https://graph.facebook.com/v21.0/${imageId}`,
//         { headers: { Authorization: `Bearer ${process.env.WHATSAPP_TOKEN}` } },
//       );
//       const mediaData = await mediaResponse.json();
//       if (!mediaData.url) throw new Error("Media URL not found");

//       const imageDownload = await fetch(mediaData.url, {
//         headers: { Authorization: `Bearer ${process.env.WHATSAPP_TOKEN}` },
//       });
//       const imageBuffer = await imageDownload.arrayBuffer();
//       const base64Image = Buffer.from(imageBuffer).toString("base64");

//       // 4. Parallel Processing
//       const [uploadResponse, aiResult] = await Promise.all([
//         new Promise((resolve, reject) => {
//           cloudinary.uploader
//             .upload_stream(
//               {
//                 folder: "lyvera_bot",
//                 timeout: 60000,
//                 transformation: [
//                   { width: 800, height: 800, crop: "fill", gravity: "auto" },
//                 ],
//               },
//               (error, result) => (error ? reject(error) : resolve(result)),
//             )
//             .end(Buffer.from(imageBuffer));
//         }),
//         // genAI
//         //   .getGenerativeModel({ model: "gemini-3.1-flash-lite-preview" })
//         //   .generateContent([
//         //     `You are a fashion expert for 'Lyvera'. Based on the caption "${caption}" and image, return JSON ONLY:
//         //     {"name": "...", "price": number, "size": "...", "category": "outerwear/tops/bottoms/accessories", "desc": "one sentence hype"}`,
//         //     { inlineData: { data: base64Image, mimeType: "image/jpeg" } },
//         //   ]),

//         // Replace your existing genAI.getGenerativeModel call with this:
//         genAI
//           .getGenerativeModel({ model: "gemini-3.1-flash-lite-preview" })
//           .generateContent([
//             `You are a fashion expert for 'Lyvera'.
//     Extract the following from the user caption: "${caption}" and the image.
//     If price or size are missing in the caption, use "TBD" or "Contact for info".

//     Return JSON ONLY:
//     {
//       "name": "Creative title based on image",
//       "price": "Extract from caption or set 500",
//       "size": "Extract from caption or set 'N/A'",
//       "category": "Choose ONLY ONE: 'outerwear', 'tops', 'bottoms', or 'accessories'. Look closely at the image.",
//       "desc": "One sentence hype"
//     }`,
//             { inlineData: { data: base64Image, mimeType: "image/jpeg" } },
//           ]),
//       ]);

//       const aiText = (aiResult as any).response
//         .text()
//         .replace(/```json|```/g, "")
//         .trim();
//       const data = JSON.parse(aiText);

//       // 5. Save to Prisma
//       const product = await prisma.product.create({
//         data: {
//           name: data.name,
//           price: parseInt(data.price) || 0,
//           size: data.size,
//           description: data.desc,
//           images: [(uploadResponse as any).secure_url],
//           isSold: false,
//           category: {
//             connectOrCreate: {
//               where: { name: data.category.toLowerCase() },
//               create: { name: data.category.toLowerCase() },
//             },
//           },
//         },
//       });

//       // 6. Send Success Confirmation
//       const appUrl =
//         process.env.NEXT_PUBLIC_APP_URL ||
//         "https://your-ngrok-url.ngrok-free.app";
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
//     console.error("🛑 Webhook Error:", error);
//     return new Response("OK", { status: 200 });
//   }
// }

import { processAdminImage } from "@/lib/whatsapp/admin-logic";
import { handleCustomerChat } from "@/lib/whatsapp/customer-logic";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const mode = searchParams.get("hub.mode");
  const token = searchParams.get("hub.verify_token");
  const challenge = searchParams.get("hub.challenge");

  if (mode === "subscribe" && token === process.env.WHATSAPP_VERIFY_TOKEN) {
    return new Response(challenge, { status: 200 });
  }
  return new Response("Forbidden", { status: 403 });
}

// export async function POST(req: Request) {
//   const body = await req.json();
//   const value = body.entry?.[0]?.changes?.[0]?.value;
//   const message = value?.messages?.[0];

//   if (!message) return new Response("OK", { status: 200 });

//   const adminPhones = process.env.ADMIN_PHONES?.split(",") || [];
//   const isAdmin = adminPhones.includes(message.from);

//   // ROUTER LOGIC:
//   // 1. Admin + Image = Admin Uploader
//   if (isAdmin && message.image) {
//     await processAdminImage(message);
//     return new Response("OK", { status: 200 });
//   }

//   // 2. Everything else = Customer Chat Bot
//   await handleCustomerChat(message);
//   return new Response("OK", { status: 200 });
// }

export async function POST(req: Request) {
  const body = await req.json();
  const value = body.entry?.[0]?.changes?.[0]?.value;
  const message = value?.messages?.[0];

  if (!message) return new Response("OK", { status: 200 });

  const adminPhones = process.env.ADMIN_PHONES?.split(",") || [];
  const isAdmin = adminPhones.includes(message.from);

  // LOGGING: Add this to see what's happening in your Vercel logs
  console.log(`Incoming message from ${message.from}. Admin: ${isAdmin}`);

  // Admin Upload Logic
  if (isAdmin && message.image) {
    await processAdminImage(message);
    return new Response("OK", { status: 200 });
  }

  // Customer Chat Logic (This is what you're not seeing)
  // Ensure we are passing the message object here
  await handleCustomerChat(message);
  return new Response("OK", { status: 200 });
}
