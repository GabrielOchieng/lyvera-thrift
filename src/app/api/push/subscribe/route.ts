import { NextResponse } from "next/server";
// Matching your existing import pattern
import prisma from "../../../../../lib/prisma";

export async function POST(req: Request) {
  try {
    const sub = await req.json();

    // The browser's PushSubscription object structure:
    // { endpoint: string, keys: { p256dh: string, auth: string } }
    const { endpoint, keys } = sub;

    if (!endpoint || !keys?.p256dh || !keys?.auth) {
      return NextResponse.json(
        { error: "Missing subscription details" },
        { status: 400 },
      );
    }

    // Using your established 'prisma' instance
    await prisma.pushSubscription.upsert({
      where: { endpoint: endpoint },
      update: {
        p256dh: keys.p256dh,
        auth: keys.auth,
        // If you're tracking when they were last active
        // updatedAt: new Date(),
      },
      create: {
        endpoint: endpoint,
        p256dh: keys.p256dh,
        auth: keys.auth,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Push Subscription Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
