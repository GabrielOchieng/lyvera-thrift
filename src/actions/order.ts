"use server";

import prisma from "../../lib/prisma";

export async function createOrder(data: {
  name: string;
  phone: string;
  location: string;
  transCode: string;
  items: any[];
  total: number;
}) {
  try {
    const order = await prisma.order.create({
      data: {
        customerName: data.name,
        customerPhone: data.phone,
        deliveryAddress: data.location,
        mpesaCode: data.transCode,
        totalAmount: data.total,
        status: "PENDING",
        // This "create" inside "items" creates both the order and items at once!
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

    return { success: true, orderId: order.id };
  } catch (error: any) {
    console.error("Order Error:", error);
    if (error.code === "P2002") {
      return {
        success: false,
        error: "This M-Pesa code has already been used.",
      };
    }
    return { success: false, error: "Something went wrong. Please try again." };
  }
}
