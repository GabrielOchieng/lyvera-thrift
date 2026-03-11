import { ShoppingBag, ExternalLink, Mail } from "lucide-react";

export default function OrdersPage() {
  // Mock data - replace with prisma.order.findMany() later
  const orders = [
    {
      id: "ORD-7721",
      customer: "Sarah J.",
      amount: 5400,
      status: "Shipped",
      date: "2 mins ago",
    },
    {
      id: "ORD-7722",
      customer: "Mike K.",
      amount: 2500,
      status: "Processing",
      date: "1 hour ago",
    },
  ];

  return (
    <div className="space-y-8">
      <header className="flex justify-between items-end border-b border-maroon-primary/10 pb-6">
        <div>
          <h1 className="text-3xl mb-2 font-serif font-bold text-maroon-primary">
            Orders
          </h1>
          <p className="text-zinc-500 text-sm uppercase tracking-widest">
            Track customer purchases
          </p>
        </div>
      </header>

      <div className="grid gap-4">
        {orders.map((order) => (
          <div
            key={order.id}
            className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-thrift-gold transition-all"
          >
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 bg-zinc-50 rounded-full flex items-center justify-center border border-zinc-100">
                <ShoppingBag className="h-5 w-5 text-maroon-primary" />
              </div>
              <div>
                <h3 className="font-bold text-zinc-900">{order.id}</h3>
                <p className="text-xs text-zinc-500 flex items-center gap-1 uppercase tracking-wider">
                  <Mail className="h-3 w-3" /> {order.customer}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-8">
              <div className="text-right">
                <p className="text-[10px] font-black text-zinc-400 uppercase tracking-tighter">
                  Total
                </p>
                <p className="font-black text-zinc-900 italic">
                  KES {order.amount}
                </p>
              </div>

              <div className="min-w-25 text-center">
                <span
                  className={`text-[10px] font-bold px-3 py-1 rounded-full uppercase ${
                    order.status === "Shipped"
                      ? "bg-green-50 text-green-600"
                      : "bg-thrift-gold/10 text-thrift-gold"
                  }`}
                >
                  {order.status}
                </span>
              </div>

              <button className="p-2 hover:bg-zinc-50 rounded-lg text-zinc-400 transition-colors">
                <ExternalLink className="h-5 w-5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
