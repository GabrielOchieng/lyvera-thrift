// "use server";

// import { revalidatePath } from "next/cache";
// import prisma from "../../lib/prisma";
// import { safeDbQuery } from "@/lib/db-utils";

// /**
//  * CREATES AN ORDER & MARKS PRODUCTS AS SOLD
//  */
// export async function createOrder(data: {
//   name: string;
//   phone: string;
//   location: string;
//   transCode: string;
//   items: any[];
//   total: number;
// }) {
//   try {
//     // We use a transaction to ensure both order creation and product update happen together
//     const result = await prisma.$transaction(async (tx) => {
//       // 1. Create the order
//       const order = await tx.order.create({
//         data: {
//           customerName: data.name,
//           customerPhone: data.phone,
//           deliveryAddress: data.location,
//           mpesaCode: data.transCode,
//           totalAmount: data.total,
//           status: "PENDING",
//           items: {
//             create: data.items.map((item) => ({
//               productId: item.id,
//               name: item.name,
//               price: item.price,
//               size: item.size,
//               image: item.image,
//             })),
//           },
//         },
//       });

//       // 2. Mark all products in this order as SOLD
//       const productIds = data.items.map((item) => item.id);
//       await tx.product.updateMany({
//         where: { id: { in: productIds } },
//         data: { isSold: true },
//       });

//       return order;
//     });

//     revalidatePath("/"); // Update the shop gallery
//     return { success: true, orderId: result.id };
//   } catch (error: any) {
//     console.error("Order Error:", error);
//     if (error.code === "P2002") {
//       return {
//         success: false,
//         error: "This M-Pesa code has already been used.",
//       };
//     }
//     return { success: false, error: "Database error. Please try again." };
//   }
// }

// /**
//  * UPDATES STATUS & RESTOCKS IF CANCELLED
//  */
// export async function updateOrderStatus(orderId: string, newStatus: string) {
//   try {
//     await prisma.$transaction(async (tx) => {
//       // 1. Update the order status
//       const updatedOrder = await tx.order.update({
//         where: { id: orderId },
//         data: { status: newStatus },
//         include: { items: true },
//       });

//       // 2. Logic: If status is CANCELLED, mark products as NOT SOLD
//       if (newStatus === "CANCELLED") {
//         const productIds = updatedOrder.items.map((item) => item.productId);
//         await tx.product.updateMany({
//           where: { id: { in: productIds } },
//           data: { isSold: false },
//         });
//       }

//       // 3. Optional: If moving FROM Cancelled BACK TO Pending/Verified, mark as SOLD again
//       if (newStatus === "VERIFIED" || newStatus === "PENDING") {
//         const productIds = updatedOrder.items.map((item) => item.productId);
//         await tx.product.updateMany({
//           where: { id: { in: productIds } },
//           data: { isSold: true },
//         });
//       }
//     });

//     revalidatePath("/admin/orders");
//     revalidatePath("/"); // Ensure shop gallery reflects the restock
//     return { success: true };
//   } catch (error) {
//     console.error("Update Status Error:", error);
//     return { success: false };
//   }
// }

// export async function deleteOrder(orderId: string) {
//   try {
//     await prisma.order.delete({
//       where: { id: orderId },
//     });

//     revalidatePath("/admin/orders");
//     return { success: true };
//   } catch (error) {
//     console.error("Delete Error:", error);
//     return { success: false };
//   }
// }

// export async function restockOrderItems(orderId: string) {
//   try {
//     const order = await safeDbQuery(() =>
//       prisma.order.findUnique({
//         where: { id: orderId },
//         include: { items: true },
//       }),
//     );

//     if (!order) return { success: false, error: "Order not found" };

//     const productIds = order.items.map((item) => item.productId);

//     await prisma.product.updateMany({
//       where: { id: { in: productIds } },
//       data: { isSold: false },
//     });

//     revalidatePath("/");
//     revalidatePath("/admin/orders");
//     return { success: true };
//   } catch (error) {
//     return { success: false };
//   }
// }

// export async function getPendingOrdersCount() {
//   try {
//     const count = await prisma.order.count({
//       where: { status: "PENDING" },
//     });
//     return count;
//   } catch (error) {
//     return 0;
//   }
// }

"use server";

import { revalidatePath } from "next/cache";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import prisma from "../../lib/prisma";

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
              size: item.size,
              image: item.image,
            })),
          },
        },
      });

      return newOrder;
    });

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
