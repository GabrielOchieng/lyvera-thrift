// src/lib/whatsapp/order-logic.ts

import prisma from "../../../lib/prisma";
import { sendWhatsAppMessage } from "./utils";

export async function handleOrderSelection(message: any, session: any) {
  const text = message.text?.body.toLowerCase();

  if (text.includes("checkout")) {
    await prisma.userSession.update({
      where: { phone: session.phone },
      data: { state: "PROVIDING_DETAILS" },
    });
    return await sendWhatsAppMessage(
      session.phone,
      "Got it! Let's wrap this up. What is your full name?",
    );
  }

  // Display Products
  const products = await prisma.product.findMany({
    where: { isSold: false },
    take: 5,
  });
  const catalog = products
    .map((p) => `ID ${p.id}: ${p.name} - KES ${p.price}`)
    .join("\n");

  await sendWhatsAppMessage(
    session.phone,
    `Here's what's available:\n\n${catalog}\n\nReply with "Buy ID" to pick one, or "Checkout" to pay.`,
  );
}
