import { NextResponse } from "next/server";
import prisma from "../../../../lib/prisma";
import { sendPushNotification } from "@/lib/pwa/push";

export async function GET() {
  const sub = await prisma.pushSubscription.findFirst({
    orderBy: { createdAt: "desc" },
  });

  if (!sub) return NextResponse.json({ error: "No subscription found in DB" });

  try {
    await sendPushNotification(
      sub as any,
      "Habari Gabriel! 🇰🇪",
      "Push notifications are officially live for Lyvera Store.",
    );
    return NextResponse.json({ success: "Notification sent!" });
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to send", details: err },
      { status: 500 },
    );
  }
}
