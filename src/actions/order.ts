"use server";

import { revalidatePath } from "next/cache";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import prisma from "../../lib/prisma";
import { sendWhatsApp } from "@/lib/whatsapp/customer-logic";

/**
 * HELPER: SECURE SESSION CHECK
 */
async function getAuthenticatedSession() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) throw new Error("Unauthorized");
  return session;
}

/**
 * CREATES AN ORDER & LINKS TO USER
 */
export async function createOrder(data: any) {
  try {
    const { name, phone, location, transCode, items, total } = data;

    // We use a $transaction to ensure all operations succeed or all fail together
    const result = await prisma.$transaction(async (tx) => {
      // 1. Fetch current status of all items in the cart from the DB
      const productIds = items.map((item: any) => item.id);
      const dbProducts = await tx.product.findMany({
        where: { id: { in: productIds } },
        select: { id: true, name: true, isSold: true },
      });

      // 2. Check if any item was sold while the user was at checkout
      const soldItems = dbProducts.filter((p) => p.isSold);

      if (soldItems.length > 0) {
        const itemNames = soldItems.map((i) => i.name).join(", ");
        throw new Error(
          `Sold Out: The following items were just purchased by someone else: ${itemNames}`,
        );
      }

      // 3. Mark items as sold
      await tx.product.updateMany({
        where: { id: { in: productIds } },
        data: { isSold: true },
      });

      // 4. Create the actual Order
      const newOrder = await tx.order.create({
        data: {
          customerName: name,
          customerPhone: phone,
          deliveryAddress: location,
          mpesaCode: transCode,
          totalAmount: total,
          status: "PENDING",
          items: {
            create: items.map((item: any) => ({
              productId: item.id,
              name: item.name,
              price: item.price,
              size: item.size || "Standard",
              image: item.image,
            })),
          },
        },
      });

      return newOrder;
    });

    // const adminPhones = process.env.ADMIN_PHONES?.split(",") || [];
    // const BASE_URL =
    //   process.env.NEXT_PUBLIC_APP_URL ||
    //   "https://lyvera-thrift-ihvf.vercel.app";

    // const orderLink = `${BASE_URL}/admin/orders`;

    // const previewImage =
    //   items[0]?.image || "https://placeholder-url.com/default.jpg";
    // const adminMessage = `🔔 *New Order Received!*

    // *Order ID:* ${result.id}
    // *Customer:* ${name}
    // *Phone:* ${phone}
    // *Location:* ${location}
    // *Total:* KES ${total}
    // *Items:* ${items.map((i: any) => i.name).join(", ")}

    // *View in Dashboard:* ${orderLink}

    // Check the admin dashboard to confirm.`;

    // console.log("Admin Phones Found:", adminPhones);

    // // for (const phone of adminPhones) {
    // //   try {
    // //     await sendWhatsApp(phone.trim(), {
    // //       image: previewImage,
    // //       caption: adminMessage,
    // //     });
    // //   } catch (error) {
    // //     console.error(`Failed to notify admin ${phone}:`, error);
    // //   }
    // // }

    // await Promise.allSettled(
    //   adminPhones.map(async (rawPhone) => {
    //     const cleanPhone = rawPhone.trim();
    //     if (!cleanPhone) return;

    //     try {
    //       const response = await sendWhatsApp(cleanPhone, {
    //         image: items[0]?.image || "https://placeholder-url.com/default.jpg",
    //         caption: adminMessage,
    //       });

    //       console.log("res", response);
    //       console.log(`✅ Admin notification sent to ${cleanPhone}`);
    //     } catch (error) {
    //       console.error(`❌ Meta API failure for admin ${cleanPhone}:`, error);
    //     }
    //   }),
    // );

    // revalidatePath("/admin/orders");
    // revalidatePath("/shop");
    // return { success: true, orderId: result.id };

    const adminPhones = process.env.ADMIN_PHONES?.split(",") || [];
    const BASE_URL =
      process.env.NEXT_PUBLIC_APP_URL ||
      "https://lyvera-thrift-ihvf.vercel.app";
    const orderLink = `${BASE_URL}/admin/orders`;

    const adminMessage = `🔔 *New Order Received!*
    
*Order ID:* ${result.id}
*Customer:* ${name}
*Phone:* ${phone}
*Location:* ${location}
*Total:* KES ${total}
*Items:* ${items.map((i: any) => i.name).join(", ")}
    
*View in Dashboard:* ${orderLink}`;

    console.log("Admin Phones Found:", adminPhones);

    // 1. Process sequentially using for...of to avoid rate-limiting/drops
    for (const rawPhone of adminPhones) {
      const cleanPhone = rawPhone.trim();
      if (!cleanPhone) continue;

      try {
        const response = await sendWhatsApp(cleanPhone, {
          image: items[0]?.image || "https://placeholder-url.com/default.jpg",
          caption: adminMessage,
        });

        console.log(`✅ Admin notification sent to ${cleanPhone}`, response);

        // 2. Add a tiny 300ms pause to ensure Meta processes the previous message
        // before the next one hits their server.
        await new Promise((resolve) => setTimeout(resolve, 300));
      } catch (error) {
        console.error(`❌ Meta API failure for admin ${cleanPhone}:`, error);
      }
    }

    revalidatePath("/admin/orders");
    revalidatePath("/shop");
    return { success: true, orderId: result.id };
  } catch (error: any) {
    console.error("ORDER_ERROR:", error);
    return {
      success: false,
      error: error.message || "Something went wrong. Please try again.",
    };
  }
}
/**
 * UPDATES STATUS (ADMIN ONLY)
 */
export async function updateOrderStatus(orderId: string, newStatus: string) {
  try {
    const session = await getAuthenticatedSession();
    if (session.user.role !== "admin")
      return { success: false, error: "Forbidden" };

    await prisma.$transaction(async (tx) => {
      const updatedOrder = await tx.order.update({
        where: { id: orderId },
        data: { status: newStatus },
        include: { items: true },
      });

      // Restock logic
      const productIds = updatedOrder.items.map((item) => item.productId);
      const isRestocking = newStatus === "CANCELLED";

      await tx.product.updateMany({
        where: { id: { in: productIds } },
        data: { isSold: !isRestocking },
      });
    });

    revalidatePath("/admin/orders");
    revalidatePath("/orders");
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    return { success: false };
  }
}

/**
 * DELETE ORDER (ADMIN ONLY)
 */
export async function deleteOrder(orderId: string) {
  try {
    const session = await getAuthenticatedSession();
    if (session.user.role !== "admin")
      return { success: false, error: "Forbidden" };

    await prisma.order.delete({
      where: { id: orderId },
    });

    revalidatePath("/admin/orders");
    return { success: true };
  } catch (error) {
    return { success: false };
  }
}

/**
 * FETCH PENDING COUNT FOR ADMIN DASHBOARD
 */
export async function getPendingOrdersCount() {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session || session.user.role !== "admin") return 0;

    return await prisma.order.count({
      where: { status: "PENDING" },
    });
  } catch (error) {
    return 0;
  }
}

/**
 * FETCHES ORDERS BASED ON ROLE
 */
export async function getOrders() {
  try {
    const session = await auth.api.getSession({ headers: await headers() });

    // 1. If Admin: Fetch every order in the system
    if (session?.user?.role === "admin") {
      return await prisma.order.findMany({
        include: {
          items: true,
          user: { select: { email: true } }, // Get email for the "Customer:" tag
        },
        orderBy: { createdAt: "desc" },
      });
    }

    // 2. If Logged In User: Fetch only their orders
    if (session?.user?.id) {
      return await prisma.order.findMany({
        where: { userId: session.user.id },
        include: { items: true },
        orderBy: { createdAt: "desc" },
      });
    }

    // 3. If Guest: Return empty (Guests can't track history yet)
    return [];
  } catch (error) {
    console.error("Fetch Orders Error:", error);
    return [];
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
      where: {
        id: { in: productIds },
      },
      data: {
        isSold: false, // This matches your schema's 'isSold' field
      },
    });

    revalidatePath("/admin/orders");
    revalidatePath("/shop");

    return { success: true };
  } catch (error) {
    console.error("Restock Error:", error);
    return { success: false, error: "Failed to restock items" };
  }
}

export async function getOrderStatus(orderId: string) {
  try {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      select: { status: true },
    });
    return order?.status || "PENDING";
  } catch (error) {
    return "PENDING";
  }
}

export async function releaseOrderItems(orderId: string) {
  try {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { items: true },
    });

    if (!order) return { success: false };

    const productIds = order.items.map((item) => item.productId);

    await prisma.$transaction([
      // 1. Mark products as NOT sold
      prisma.product.updateMany({
        where: { id: { in: productIds } },
        data: { isSold: false },
      }),
      // 2. Mark order as CANCELLED
      prisma.order.update({
        where: { id: orderId },
        data: { status: "CANCELLED" },
      }),
    ]);

    return { success: true };
  } catch (error) {
    return { success: false };
  }
}
