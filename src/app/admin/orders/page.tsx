import { ShoppingBag } from "lucide-react";
import prisma from "../../../../lib/prisma";
import OrderListClient from "@/components/order/OrderListClient";

export default async function OrdersPage() {
  let orders: any[] = [];

  try {
    if (prisma && prisma.order) {
      orders = await prisma.order.findMany({
        orderBy: { createdAt: "desc" },
        include: { items: true },
      });
    }
  } catch (error) {
    console.error("Prisma Fetch Error:", error);
  }

  return (
    <div className="space-y-8 ">
      {/* Search is now inside OrderListClient so it can access the state */}
      <OrderListClient initialOrders={orders} />
    </div>
  );
}
