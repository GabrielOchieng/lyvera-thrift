import { NextResponse } from "next/server";
import prisma from "../../../../../lib/prisma";

export async function GET(req: Request) {
  // 1. Security Check: Ensure only authorized requests (like Vercel Cron) can trigger this
  const authHeader = req.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response("Unauthorized", { status: 401 });
  }

  console.log("crn", authHeader);

  try {
    // 2. Define "Expired": Anything older than 60 minutes
    const fifteenMinutesAgo = new Date(Date.now() - 60 * 60 * 1000);

    // 3. Find all PENDING orders older than 15 mins
    const expiredOrders = await prisma.order.findMany({
      where: {
        status: "PENDING",
        createdAt: { lt: fifteenMinutesAgo },
      },
      include: { items: true },
    });

    if (expiredOrders.length === 0) {
      return NextResponse.json({ message: "No expired orders found" });
    }

    // 4. Process each order: Mark items as available and order as CANCELLED
    for (const order of expiredOrders) {
      const productIds = order.items.map((item) => item.productId);

      await prisma.$transaction([
        prisma.product.updateMany({
          where: { id: { in: productIds } },
          data: { isSold: false },
        }),
        prisma.order.update({
          where: { id: order.id },
          data: { status: "CANCELLED" },
        }),
      ]);
    }

    return NextResponse.json({
      message: `Successfully released items for ${expiredOrders.length} orders.`,
    });
  } catch (error) {
    console.error("Cron Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
