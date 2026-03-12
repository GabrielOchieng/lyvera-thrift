"use server";

import { revalidatePath } from "next/cache";
import prisma from "../../lib/prisma";

/**
 * CREATES AN ORDER & MARKS PRODUCTS AS SOLD
 */
export async function createOrder(data: {
  name: string;
  phone: string;
  location: string;
  transCode: string;
  items: any[];
  total: number;
}) {
  try {
    // We use a transaction to ensure both order creation and product update happen together
    const result = await prisma.$transaction(async (tx) => {
      // 1. Create the order
      const order = await tx.order.create({
        data: {
          customerName: data.name,
          customerPhone: data.phone,
          deliveryAddress: data.location,
          mpesaCode: data.transCode,
          totalAmount: data.total,
          status: "PENDING",
          items: {
            create: data.items.map((item) => ({
              productId: item.id,
              name: item.name,
              price: item.price,
              size: item.size,
              image: item.image,
            })),
          },
        },
      });

      // 2. Mark all products in this order as SOLD
      const productIds = data.items.map((item) => item.id);
      await tx.product.updateMany({
        where: { id: { in: productIds } },
        data: { isSold: true },
      });

      return order;
    });

    revalidatePath("/"); // Update the shop gallery
    return { success: true, orderId: result.id };
  } catch (error: any) {
    console.error("Order Error:", error);
    if (error.code === "P2002") {
      return {
        success: false,
        error: "This M-Pesa code has already been used.",
      };
    }
    return { success: false, error: "Database error. Please try again." };
  }
}

/**
 * UPDATES STATUS & RESTOCKS IF CANCELLED
 */
export async function updateOrderStatus(orderId: string, newStatus: string) {
  try {
    await prisma.$transaction(async (tx) => {
      // 1. Update the order status
      const updatedOrder = await tx.order.update({
        where: { id: orderId },
        data: { status: newStatus },
        include: { items: true },
      });

      // 2. Logic: If status is CANCELLED, mark products as NOT SOLD
      if (newStatus === "CANCELLED") {
        const productIds = updatedOrder.items.map((item) => item.productId);
        await tx.product.updateMany({
          where: { id: { in: productIds } },
          data: { isSold: false },
        });
      }

      // 3. Optional: If moving FROM Cancelled BACK TO Pending/Verified, mark as SOLD again
      if (newStatus === "VERIFIED" || newStatus === "PENDING") {
        const productIds = updatedOrder.items.map((item) => item.productId);
        await tx.product.updateMany({
          where: { id: { in: productIds } },
          data: { isSold: true },
        });
      }
    });

    revalidatePath("/admin/orders");
    revalidatePath("/"); // Ensure shop gallery reflects the restock
    return { success: true };
  } catch (error) {
    console.error("Update Status Error:", error);
    return { success: false };
  }
}

export async function deleteOrder(orderId: string) {
  try {
    await prisma.order.delete({
      where: { id: orderId },
    });

    revalidatePath("/admin/orders");
    return { success: true };
  } catch (error) {
    console.error("Delete Error:", error);
    return { success: false };
  }
}

export async function restockOrderItems(orderId: string) {
  try {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { items: true },
    });

    if (!order) return { success: false, error: "Order not found" };

    const productIds = order.items.map((item) => item.productId);

    await prisma.product.updateMany({
      where: { id: { in: productIds } },
      data: { isSold: false },
    });

    revalidatePath("/");
    revalidatePath("/admin/orders");
    return { success: true };
  } catch (error) {
    return { success: false };
  }
}

export async function getPendingOrdersCount() {
  try {
    const count = await prisma.order.count({
      where: { status: "PENDING" },
    });
    return count;
  } catch (error) {
    return 0;
  }
}
