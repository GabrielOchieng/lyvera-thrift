// src/lib/whatsapp/checkout-logic.ts

import prisma from "../../../lib/prisma";

export async function handleCheckoutConfirmation(message: any) {
  try {
    const text = message.text?.body.toLowerCase();
    const from = message.from;

    // Extract Order ID (Assumes format: "Order #12345")
    const orderId = text.split("order #")[1]?.trim();

    if (!orderId) {
      return await sendWhatsAppMessage(
        from,
        "I couldn't find an order ID in your message. Please reply with 'Order #YOUR_ID'.",
      );
    }

    // 1. Find the order in your database
    const order = await prisma.order.findUnique({
      where: { id: orderId },
    });

    if (!order) {
      return await sendWhatsAppMessage(
        from,
        "I couldn't find that order in our system. Please check the ID and try again.",
      );
    }

    // 2. Update status to 'AWAITING_VERIFICATION'
    await prisma.order.update({
      where: { id: orderId },
      data: { status: "AWAITING_VERIFICATION" },
    });

    // 3. Confirm to the user
    const responseText = `Received! 🏁 Order #${orderId} is now marked as 'Awaiting Verification'. Our team is matching your M-Pesa payment and will notify you soon!`;
    await sendWhatsAppMessage(from, responseText);
  } catch (error) {
    console.error("🛑 Checkout Logic Error:", error);
  }
}

// Helper to send message back to WhatsApp
async function sendWhatsAppMessage(to: string, body: string) {
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
        to: to,
        type: "text",
        text: { body },
      }),
    },
  );
}
