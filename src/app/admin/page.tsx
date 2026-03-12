import { Package, Clock, CheckCircle } from "lucide-react";
import prisma from "../../../lib/prisma";
import StatCard from "@/components/dashboard/StatCard";
import RevenueChart from "@/components/dashboard/RevenueChart";
import InventoryPieChart from "@/components/dashboard/InventoryPieChart";

export default async function AdminDashboard() {
  const [totalItems, soldItems, orders] = await Promise.all([
    prisma.product.count(),
    prisma.product.count({ where: { isSold: true } }),
    prisma.order.findMany({
      select: { totalAmount: true, status: true, createdAt: true },
    }),
  ]);

  const verifiedRevenue = orders
    .filter((o) => o.status === "VERIFIED" || o.status === "DISPATCHED")
    .reduce((acc, curr) => acc + curr.totalAmount, 0);

  const pendingRevenue = orders
    .filter((o) => o.status === "PENDING")
    .reduce((acc, curr) => acc + curr.totalAmount, 0);

  return (
    <div className="space-y-8  bg-zinc-50/50 min-h-screen">
      <header className="border-b border-zinc-200 pb-6">
        <h1 className="text-3xl font-serif font-bold text-maroon-primary">
          Store Overview
        </h1>
        <p className="text-zinc-500 text-sm uppercase tracking-widest">
          Performance Metrics
        </p>
      </header>

      {/* 1. Stat Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard
          title="Total Revenue"
          value={verifiedRevenue}
          isCurrency
          icon={CheckCircle}
          color="text-green-600"
        />
        <StatCard
          title="Pending"
          value={pendingRevenue}
          isCurrency
          icon={Clock}
          color="text-amber-500"
        />
        <StatCard
          title="Total Items"
          value={totalItems}
          icon={Package}
          color="text-maroon-primary"
        />
        <StatCard
          title="Sold Items"
          value={soldItems}
          icon={CheckCircle}
          color="text-zinc-600"
        />
      </div>

      {/* 2. Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm">
          <h3 className="font-bold text-zinc-800 mb-6">Revenue Growth</h3>
          <RevenueChart data={orders} />
        </div>
        <div className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm">
          <h3 className="font-bold text-zinc-800 mb-6">Inventory Split</h3>
          <InventoryPieChart active={totalItems - soldItems} sold={soldItems} />
        </div>
      </div>
    </div>
  );
}
