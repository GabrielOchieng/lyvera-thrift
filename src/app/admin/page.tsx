// import { Package, Clock, CheckCircle } from "lucide-react";
// import prisma from "../../../lib/prisma";
// import StatCard from "@/components/dashboard/StatCard";
// import RevenueChart from "@/components/dashboard/RevenueChart";
// import InventoryPieChart from "@/components/dashboard/InventoryPieChart";
// import { safeDbQuery } from "@/lib/db-utils"; // Import your utility

// export default async function AdminDashboard() {
//   // Wrap all initial data fetching in one safe query
//   const data = await safeDbQuery(async () => {
//     const [totalItems, soldItems, orders] = await Promise.all([
//       prisma.product.count(),
//       prisma.product.count({ where: { isSold: true } }),
//       prisma.order.findMany({
//         select: { totalAmount: true, status: true, createdAt: true },
//       }),
//     ]);
//     return { totalItems, soldItems, orders };
//   });

//   // Handle the case where the DB might be totally unreachable
//   if (!data) {
//     return (
//       <div className="p-10 text-center">
//         Failed to load dashboard data. Please refresh.
//       </div>
//     );
//   }

//   const { totalItems, soldItems, orders } = data;

//   const verifiedRevenue = orders
//     .filter((o) => o.status === "VERIFIED" || o.status === "DISPATCHED")
//     .reduce((acc, curr) => acc + curr.totalAmount, 0);

//   const pendingRevenue = orders
//     .filter((o) => o.status === "PENDING")
//     .reduce((acc, curr) => acc + curr.totalAmount, 0);

//   return (
//     <div className="space-y-8  bg-zinc-50/50 min-h-screen">
//       <header className="border-b border-zinc-200 pb-6">
//         <h1 className="text-3xl font-serif font-bold text-maroon-primary">
//           Store Overview
//         </h1>
//         <p className="text-zinc-500 text-sm uppercase tracking-widest">
//           Performance Metrics
//         </p>
//       </header>

//       {/* 1. Stat Cards Row */}
//       <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
//         <StatCard
//           title="Total Revenue"
//           value={verifiedRevenue}
//           isCurrency
//           icon={CheckCircle}
//           color="text-green-600"
//         />
//         <StatCard
//           title="Pending"
//           value={pendingRevenue}
//           isCurrency
//           icon={Clock}
//           color="text-amber-500"
//         />
//         <StatCard
//           title="Total Items"
//           value={totalItems}
//           icon={Package}
//           color="text-maroon-primary"
//         />
//         <StatCard
//           title="Sold Items"
//           value={soldItems}
//           icon={CheckCircle}
//           color="text-zinc-600"
//         />
//       </div>

//       {/* 2. Charts Row */}
//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//         <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm">
//           <h3 className="font-bold text-zinc-800 mb-6">Revenue Growth</h3>
//           <RevenueChart data={orders} />
//         </div>
//         <div className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm">
//           <h3 className="font-bold text-zinc-800 mb-6">Inventory Split</h3>
//           <InventoryPieChart active={totalItems - soldItems} sold={soldItems} />
//         </div>
//       </div>
//     </div>
//   );
// }

import {
  Package,
  Clock,
  CheckCircle,
  ShoppingCart,
  TrendingUp,
  AlertTriangle,
} from "lucide-react";
import prisma from "../../../lib/prisma";
import StatCard from "@/components/dashboard/StatCard";
import RevenueChart from "@/components/dashboard/RevenueChart";
import InventoryPieChart from "@/components/dashboard/InventoryPieChart";
import { safeDbQuery } from "@/lib/db-utils";

export default async function AdminDashboard() {
  const data = await safeDbQuery(async () => {
    const [totalItems, soldItems, orders, lowStockCount] = await Promise.all([
      prisma.product.count(),
      prisma.product.count({ where: { isSold: true } }),
      prisma.order.findMany({
        select: { totalAmount: true, status: true, createdAt: true },
      }),
      // Change 'quantity' to 'stock'
      prisma.product.count({
        where: {
          isSold: false,
          stock: { lt: 5 },
        },
      }),
    ]);
    return { totalItems, soldItems, orders, lowStockCount };
  });

  if (!data) {
    return (
      <div className="p-10 text-center text-zinc-500">
        Failed to load dashboard data. Please check your connection.
      </div>
    );
  }

  const { totalItems, soldItems, orders, lowStockCount } = data;

  // Revenue Calculations
  const verifiedOrders = orders.filter(
    (o) => o.status === "VERIFIED" || o.status === "DISPATCHED",
  );
  const verifiedRevenue = verifiedOrders.reduce(
    (acc, curr) => acc + curr.totalAmount,
    0,
  );
  const pendingRevenue = orders
    .filter((o) => o.status === "PENDING")
    .reduce((acc, curr) => acc + curr.totalAmount, 0);

  // Advanced Insights
  const aov =
    verifiedOrders.length > 0 ? verifiedRevenue / verifiedOrders.length : 0;
  const sellThroughRate = totalItems > 0 ? (soldItems / totalItems) * 100 : 0;

  return (
    <div className="space-y-8 bg-zinc-50/50 min-h-screen">
      <header className="flex flex-col md:flex-row md:items-end justify-between border-b border-zinc-200 pb-6 gap-4">
        <div>
          <h1 className="text-3xl font-serif font-bold text-maroon-primary">
            Store Overview
          </h1>
          <p className="text-zinc-500 text-sm uppercase tracking-widest">
            Performance Metrics
          </p>
        </div>
        <div className="bg-white px-4 py-2 rounded-lg border border-zinc-200 shadow-sm">
          <p className="text-[10px] font-black text-zinc-400 uppercase">
            System Status
          </p>
          <p className="text-xs font-bold text-green-600 flex items-center gap-1">
            <span className="h-2 w-2 bg-green-600 rounded-full animate-pulse" />{" "}
            Live Updates
          </p>
        </div>
      </header>

      {/* 1. Enhanced Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Verified Revenue"
          value={verifiedRevenue}
          isCurrency
          icon={CheckCircle}
          color="text-green-600"
          trend="+12.5%"
        />
        <StatCard
          title="Avg. Order Value"
          value={aov}
          isCurrency
          icon={ShoppingCart}
          color="text-blue-500"
          subtext="Per verified order"
        />
        <StatCard
          title="Inventory Health"
          value={totalItems - soldItems}
          icon={Package}
          color="text-maroon-primary"
          subtext={
            lowStockCount > 0
              ? `${lowStockCount} items low stock`
              : "Stock levels healthy"
          }
          alert={lowStockCount > 0}
        />
        <StatCard
          title="Sell-Through Rate"
          value={sellThroughRate.toFixed(1) + "%"}
          icon={TrendingUp}
          color="text-zinc-600"
        />
      </div>

      {/* 2. Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-zinc-800">Revenue Growth</h3>
            <span className="text-[10px] font-bold bg-zinc-100 text-zinc-500 px-2 py-1 rounded">
              LAST 7 DAYS
            </span>
          </div>
          <RevenueChart data={orders} />
        </div>
        <div className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm">
          <h3 className="font-bold text-zinc-800 mb-6">Inventory Split</h3>
          <InventoryPieChart active={totalItems - soldItems} sold={soldItems} />
          <div className="mt-4 pt-4 border-t border-zinc-100 space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-zinc-500">Pending Revenue</span>
              <span className="font-bold text-amber-600">
                KES {pendingRevenue.toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
