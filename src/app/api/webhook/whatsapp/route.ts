// import { processAdminImage } from "@/lib/whatsapp/admin-logic";
// import { handleCustomerChat } from "@/lib/whatsapp/customer-logic";

// export async function GET(req: Request) {
//   const { searchParams } = new URL(req.url);
//   if (
//     searchParams.get("hub.verify_token") === process.env.WHATSAPP_VERIFY_TOKEN
//   ) {
//     return new Response(searchParams.get("hub.challenge"), { status: 200 });
//   }
//   return new Response("Forbidden", { status: 403 });
// }

// export async function POST(req: Request) {
//   try {
//     const body = await req.json();
//     const value = body.entry?.[0]?.changes?.[0]?.value;
//     const message = value?.messages?.[0];

//     if (!message) return new Response("OK", { status: 200 });

//     const adminPhones = process.env.ADMIN_PHONES?.split(",") || [];
//     const isAdmin = adminPhones.includes(message.from);

//     // 1. GLOBAL ADMIN PROTECTION
//     if (isAdmin) {
//       // Only process if it's an image; otherwise, ignore (so you don't trigger the customer AI)
//       if (message.image) {
//         const product = await processAdminImage(message);

//         if (product) {
//           const appUrl =
//             process.env.NEXT_PUBLIC_APP_URL || "https://lyvera.store";
//           const replyText = `✅ *Item Listed!*\n\n*Name:* ${product.name}\n*Price:* KES ${product.price}\n\n🔗 *View:* ${appUrl}/shop/${product.id}`;

//           await fetch(
//             `https://graph.facebook.com/v21.0/${process.env.WHATSAPP_PHONE_NUMBER_ID}/messages`,
//             {
//               method: "POST",
//               headers: {
//                 Authorization: `Bearer ${process.env.WHATSAPP_TOKEN}`,
//                 "Content-Type": "application/json",
//               },
//               body: JSON.stringify({
//                 messaging_product: "whatsapp",
//                 to: message.from,
//                 type: "text",
//                 text: { body: replyText },
//               }),
//             },
//           );
//         }
//       } else {
//         console.log(
//           "🛠️ Admin sent a text/other message. Ignoring to avoid customer AI trigger.",
//         );
//       }

//       // We return 200 here so the code NEVER reaches the handleCustomerChat block for admins
//       return new Response("OK", { status: 200 });
//     }

//     // 2. CUSTOMER FLOW: AI Chat
//     // This part is now ONLY reachable by non-admins
//     await handleCustomerChat(message).catch(console.error);

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
  if (
    searchParams.get("hub.verify_token") === process.env.WHATSAPP_VERIFY_TOKEN
  ) {
    return new Response(searchParams.get("hub.challenge"), { status: 200 });
  }
  return new Response("Forbidden", { status: 403 });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const value = body.entry?.[0]?.changes?.[0]?.value;

    // 1. HANDLE SYSTEM STATUS RECEIPTS (delivered, read, sent)
    // If a customer makes an order and your system messages you, Meta calls this webhook.
    // We acknowledge it early so Meta doesn't retry, without confusing it for an incoming message.
    if (value?.statuses) {
      console.log(
        "📨 Received WhatsApp system status update. Skipping execution flow.",
      );
      return new Response("OK", { status: 200 });
    }

    const message = value?.messages?.[0];
    if (!message) return new Response("OK", { status: 200 });

    const adminPhones = process.env.ADMIN_PHONES?.split(",") || [];
    const isAdmin = adminPhones.includes(message.from);

    // 2. GLOBAL ADMIN CONFIGURATION
    if (isAdmin) {
      // If the admin uploads a new camera-grade thrift item photo
      if (message.image || message.video) {
        const product = await processAdminImage(message);

        if (product) {
          const appUrl =
            process.env.NEXT_PUBLIC_APP_URL || "https://lyvera.store";
          const replyText = `✅ *Item Listed!*\n\n*Name:* ${product.name}\n*Price:* KES ${product.price}\n\n🔗 *View:* ${appUrl}/shop/${product.id}`;

          await fetch(
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
        }
      } else {
        console.log(
          "🛠️ Admin sent a message text. Ignored to stop looping chatbot loops.",
        );
      }

      // Early break ensures admin text never passes down to Gemini customer handlers
      return new Response("OK", { status: 200 });
    }

    // 3. SECURE CUSTOMER CONVERSATION CHANNEL
    // Safe from system updates, safe from admin uploads.
    await handleCustomerChat(message).catch(console.error);

    return new Response("OK", { status: 200 });
  } catch (error) {
    console.error("🛑 Webhook Critical Error:", error);
    return new Response("OK", { status: 200 });
  }
}
