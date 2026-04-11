// src/lib/whatsapp/checkout-logic.ts

import prisma from "../../../lib/prisma";
import { sendWhatsAppMessage } from "./utils";

export async function handleCheckoutFlow(message: any, session: any) {
  const text = message.text?.body;

  // Step 1: Collect Name
  if (!session.userName) {
    await prisma.userSession.update({
      where: { phone: session.phone },
      data: { userName: text },
    });
    return await sendWhatsAppMessage(
      session.phone,
      "Thanks! Finally, where should we deliver it?",
    );
  }

  // Step 2: Collect Location & Finish
  await prisma.userSession.update({
    where: { phone: session.phone },
    data: { location: text, state: "IDLE" },
  });

  await sendWhatsAppMessage(
    session.phone,
    "Order placed! Please pay KES to Till 5293638 and send the confirmation here.",
  );
}
