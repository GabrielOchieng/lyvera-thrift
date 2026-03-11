import { Package, CheckCircle, Clock, TrendingUp } from "lucide-react";
import prisma from "../../../lib/prisma";

export default async function AdminDashboard() {
  const totalItems = await prisma.product.count();
  const soldItems = await prisma.product.count({ where: { isSold: true } });
  const activeItems = totalItems - soldItems;

  return (
    <div className="space-y-8">
      {/* Dashboard Title Section */}
      <header className="flex justify-between items-end border-b border-maroon-primary/10 pb-6">
        <div>
          <h1 className="text-3xl mb-2 font-serif font-bold text-maroon-primary ">
            Dashboard
          </h1>
          <p className="text-zinc-500 text-sm uppercase tracking-widest">
            Store Insights
          </p>
        </div>
        <div className="text-[10px] font-bold bg-green-50 text-green-600 px-3 py-1 rounded-full border border-green-100 uppercase tracking-tighter">
          ● Live Production
        </div>
      </header>

      {/* Summary Cards with Brand Palette */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Total Inventory - Neutral/Brand Mix */}
        <div className="bg-white p-6 rounded-xl border-l-4 border-maroon-primary shadow-sm hover:shadow-md transition-shadow">
          {" "}
          <div className="flex justify-between items-start">
            <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest">
              Total Inventory
            </p>
            <Package className="h-4 w-4 text-maroon-primary opacity-50" />
          </div>
          <h2 className="text-4xl font-bold mt-2 text-zinc-900">
            {totalItems}
          </h2>
          <p className="text-[10px] text-zinc-400 mt-2 uppercase">
            Curated unique pieces
          </p>
        </div>

        {/* Active Listings - Gold Accent */}
        <div className="bg-white p-6 rounded-xl border-l-4 border-thrift-gold shadow-sm hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start">
            <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest">
              Active Listings
            </p>
            <Clock className="h-4 w-4 text-thrift-gold" />
          </div>
          <h2 className="text-4xl font-bold mt-2 text-zinc-900">
            {activeItems}
          </h2>
          <p className="text-[10px] text-zinc-400 mt-2 uppercase">
            Available in shop
          </p>
        </div>

        {/* Items Sold - Pink Accent */}
        <div className="bg-white p-6 rounded-xl border-l-4 border-thrift-pink shadow-sm hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start">
            <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest">
              Items Sold
            </p>
            <CheckCircle className="h-4 w-4 text-thrift-pink" />
          </div>
          <h2 className="text-4xl font-bold mt-2 text-thrift-pink">
            {soldItems}
          </h2>
          <p className="text-[10px] text-zinc-400 mt-2 uppercase">
            Successful thrifts
          </p>
        </div>
      </div>

      {/* Visualization Section with Brand Colors */}
      <div className="bg-white p-8 rounded-2xl border border-zinc-100 shadow-sm overflow-hidden relative">
        <div className="flex items-center gap-2 mb-6">
          <TrendingUp className="h-5 w-5 text-maroon-primary" />
          <h3 className="font-bold text-maroon-primary uppercase text-sm tracking-widest">
            Revenue Insights
          </h3>
        </div>
        <div className="h-64 flex flex-col items-center justify-center border-2 border-dashed border-zinc-100 rounded-xl">
          <div className="w-12 h-12 bg-thrift-gold/10 rounded-full flex items-center justify-center mb-3">
            <div className="w-6 h-6 bg-thrift-gold rounded-full animate-pulse" />{" "}
          </div>
          <p className="text-zinc-400 text-sm font-serif italic">
            Analyzing your weekly drops...
          </p>
        </div>
      </div>
    </div>
  );
}
