import { NextResponse } from "next/server";
import { processAdminImage } from "@/lib/whatsapp/admin-logic";

// 1. GET: Verification for Meta Webhook setup
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const mode = searchParams.get("hub.mode");
  const token = searchParams.get("hub.verify_token");
  const challenge = searchParams.get("hub.challenge");

  if (mode === "subscribe" && token === process.env.WHATSAPP_VERIFY_TOKEN) {
    console.log("✅ Admin Webhook Verified");
    return new Response(challenge, { status: 200 });
  }
  return new Response("Forbidden", { status: 403 });
}

// 2. POST: Handle incoming Admin messages
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const value = body.entry?.[0]?.changes?.[0]?.value;
    const message = value?.messages?.[0];

    if (!message) return new Response("OK", { status: 200 });

    // Security: Only allow specific phone numbers to upload products
    const adminPhones = process.env.ADMIN_PHONES?.split(",") || [];
    if (!adminPhones.includes(message.from)) {
      console.log(`Blocked: ${message.from} is not an authorized admin.`);
      return new Response("Unauthorized", { status: 403 });
    }

    // Process image uploads from Admin
    if (message.image) {
      const product = await processAdminImage(message);

      // Send Success Confirmation to Admin
      const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://lyvera.store";
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

    return new Response("OK", { status: 200 });
  } catch (error) {
    console.error("🛑 Admin Webhook Error:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
