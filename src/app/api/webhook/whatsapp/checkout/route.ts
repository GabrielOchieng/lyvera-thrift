import { NextResponse } from "next/server";
import prisma from "../../../../../../lib/prisma";

// 1. Add this helper function at the top or bottom of your file
async function sendWhatsAppMessage(to: string, body: string) {
  const url = `https://graph.facebook.com/v21.0/${process.env.WHATSAPP_PHONE_NUMBER_ID}/messages`;

  return await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.WHATSAPP_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      messaging_product: "whatsapp",
      to: to,
      type: "text",
      text: { body },
    }),
  });
}

export async function POST(req: Request) {
  const body = await req.json();
  const message = body.entry?.[0]?.changes?.[0]?.value?.messages?.[0];
  if (!message) return new Response("OK", { status: 200 });

  const text = message.text?.body.toLowerCase() || "";
  const from = message.from;

  // Pattern: "order #..."
  if (text.includes("order #")) {
    const orderId = text.split("order #")[1].trim();

    try {
      // Update DB
      await prisma.order.update({
        where: { id: orderId },
        data: { status: "AWAITING_VERIFICATION" },
      });

      // Now this call works because the function is defined above!
      await sendWhatsAppMessage(
        from,
        `Received! 🏁 Order #${orderId} is now under review. We'll ping you once verified.`,
      );
    } catch (error) {
      console.error("Database update failed:", error);
      await sendWhatsAppMessage(
        from,
        "Sorry, I couldn't find that order ID. Please double-check it.",
      );
    }
  }

  return new Response("OK", { status: 200 });
}
