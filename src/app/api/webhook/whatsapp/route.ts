// import { processAdminImage } from "@/lib/whatsapp/admin-logic";
// import { handleCustomerChat } from "@/lib/whatsapp/customer-logic";

// export async function GET(req: Request) {
//   const { searchParams } = new URL(req.url);
//   const mode = searchParams.get("hub.mode");
//   const token = searchParams.get("hub.verify_token");
//   const challenge = searchParams.get("hub.challenge");

//   if (mode === "subscribe" && token === process.env.WHATSAPP_VERIFY_TOKEN) {
//     return new Response(challenge, { status: 200 });
//   }
//   return new Response("Forbidden", { status: 403 });
// }

// export async function POST(req: Request) {
//   const body = await req.json();
//   const value = body.entry?.[0]?.changes?.[0]?.value;
//   const message = value?.messages?.[0];

//   if (!message) return new Response("OK", { status: 200 });

//   const adminPhones = process.env.ADMIN_PHONES?.split(",") || [];
//   const isAdmin = adminPhones.includes(message.from);

//   // LOGGING: Add this to see what's happening in your Vercel logs
//   console.log(`Incoming message from ${message.from}. Admin: ${isAdmin}`);

//   // Admin Upload Logic
//   if (isAdmin && message.image) {
//     await processAdminImage(message);
//     return new Response("OK", { status: 200 });
//   }

//   // Customer Chat Logic (This is what you're not seeing)
//   // Ensure we are passing the message object here
//   await handleCustomerChat(message);
//   return new Response("OK", { status: 200 });
// }

import { processAdminImage } from "@/lib/whatsapp/admin-logic";
import { handleCheckoutConfirmation } from "@/lib/whatsapp/checkout-logic";
import { handleCustomerChat } from "@/lib/whatsapp/customer-logic";

export async function POST(req: Request) {
  const body = await req.json();
  const value = body.entry?.[0]?.changes?.[0]?.value;
  const message = value?.messages?.[0];

  if (!message) return new Response("OK", { status: 200 });

  const text = message.text?.body?.toLowerCase() || "";
  const from = message.from;

  // 1. ADMIN UPLOAD LOGIC
  const adminPhones = process.env.ADMIN_PHONES?.split(",") || [];
  if (adminPhones.includes(from) && message.image) {
    await processAdminImage(message);
    return new Response("OK", { status: 200 });
  }

  // 2. CHECKOUT FLOW LOGIC ("Traffic Cop" for order commands)
  if (text.includes("order #")) {
    await handleCheckoutConfirmation(message);
    return new Response("OK", { status: 200 });
  }

  // 3. DEFAULT AI SALES CHAT
  await handleCustomerChat(message);
  return new Response("OK", { status: 200 });
}
