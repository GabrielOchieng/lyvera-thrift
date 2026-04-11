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

// src/app/api/webhook/whatsapp/route.ts
import { handleCustomerChat } from "@/lib/whatsapp/customer-logic";

import { handleCheckoutFlow } from "@/lib/whatsapp/checkout-logic";
import prisma from "../../../../../lib/prisma";
import { handleOrderSelection } from "@/lib/whatsapp/order-logic";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const message = body.entry?.[0]?.changes?.[0]?.value?.messages?.[0];

    // 1. ALWAYS return 200 immediately for empty messages
    if (!message) return new Response("OK", { status: 200 });

    const from = message.from;
    const session = await prisma.userSession.findUnique({
      where: { phone: from },
    });

    // 2. Wrap your logic in logic branches that ALL have returns
    if (session?.state === "ORDERING") {
      await handleOrderSelection(message, session);
      return new Response("OK", { status: 200 }); // RETURN HERE
    }

    if (session?.state === "PROVIDING_DETAILS") {
      await handleCheckoutFlow(message, session);
      return new Response("OK", { status: 200 }); // RETURN HERE
    }

    // Default case
    await handleCustomerChat(message);
    return new Response("OK", { status: 200 }); // RETURN HERE
  } catch (error) {
    console.error("Webhook Error:", error);
    // 3. Even if the code crashes, return 200 so WhatsApp stops retrying
    return new Response("OK", { status: 200 });
  }
}
