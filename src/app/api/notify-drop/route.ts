import { sendPushNotification } from "@/lib/pwa/push";
import prisma from "../../../../lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { title, body, category } = await req.json();

  const subscriptions = await prisma.pushSubscription.findMany();

  // Send ONE consolidated message
  const notificationPayload = {
    title: title || "New Items in Stock! 👗",
    body:
      body ||
      "We've just updated our collection with new camera-grade items. Check them out!",
    url: category ? `/category/${category}` : "/shop",
  };

  await Promise.all(
    subscriptions.map((sub) =>
      sendPushNotification(
        sub as any,
        notificationPayload.title,
        notificationPayload.body,
      ),
    ),
  );

  return NextResponse.json({ success: true });
}
