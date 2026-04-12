// src/lib/whatsapp/checkout.ts

import prisma from "../../../lib/prisma";

export async function handleCheckoutFlow(
  from: string,
  session: any,
  text: string,
) {
  switch (session.state) {
    case "checkout_name":
      await prisma.chatSession.update({
        where: { phone: from },
        data: { name: text, state: "checkout_phone" },
      });
      return await sendWhatsApp(from, "📱 Enter your M-Pesa number:");

    case "checkout_phone":
      await prisma.chatSession.update({
        where: { phone: from },
        data: { phoneInput: text, state: "checkout_location" },
      });
      return await sendWhatsApp(from, "📍 Delivery location:");

    case "checkout_location":
      // Finalize order creation logic here
      await clearCart(from);
      return await sendWhatsApp(
        from,
        "✅ Order received! Pay to Till 5293638. Reply PAID when done.",
      );
  }
}

// src/lib/whatsapp/checkout.ts (or bottom of customer-logic.ts)
export async function sendWhatsApp(
  to: string,
  content: string | { image: string; caption: string },
) {
  const payload: any = { messaging_product: "whatsapp", to };

  if (typeof content === "string") {
    payload.type = "text";
    payload.text = { body: content };
  } else {
    payload.type = "image";
    payload.image = { link: content.image, caption: content.caption };
  }

  await fetch(
    `https://graph.facebook.com/v21.0/${process.env.WHATSAPP_PHONE_NUMBER_ID}/messages`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.WHATSAPP_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    },
  );
}

export async function clearCart(phone: string) {
  await prisma.chatSession.update({
    where: { phone },
    data: {
      cart: [],
      state: "browsing",
      name: null,
      phoneInput: null,
      location: null,
    },
  });
}
