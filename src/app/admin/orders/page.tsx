// import { ShoppingBag } from "lucide-react";
// import prisma from "../../../../lib/prisma";
// import OrderListClient from "@/components/order/OrderListClient";
// import { Order } from "@prisma/client";

// export default async function OrdersPage() {
//   let orders: Order[] = [];

//   try {
//     if (prisma && prisma.order) {
//       orders = await prisma.order.findMany({
//         orderBy: { createdAt: "desc" },
//         include: { items: true },
//       });
//     }
//   } catch (error) {
//     console.error("Prisma Fetch Error:", error);
//     orders = [];
//   }

//   return (
//     <div className="space-y-8 p-6">
//       <header className="flex justify-between items-end border-b border-maroon-primary/10 pb-6">
//         <div>
//           <h1 className="text-3xl mb-2 font-serif font-bold text-maroon-primary">
//             Live Orders
//           </h1>
//           <p className="text-zinc-500 text-sm uppercase tracking-widest">
//             {orders.length} Purchases Total
//           </p>
//         </div>
//       </header>

//       {orders.length === 0 ? (
//         <div className="py-20 text-center bg-white rounded-3xl border-2 border-dashed border-zinc-100">
//           <ShoppingBag className="h-12 w-12 text-zinc-200 mx-auto mb-4" />
//           <p className="text-zinc-400 font-medium italic">
//             No orders found yet.
//           </p>
//         </div>
//       ) : (
//         <OrderListClient orders={orders} />
//       )}
//     </div>
//   );
// }

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
