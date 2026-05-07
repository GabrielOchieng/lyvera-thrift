import { AlertCircle } from "lucide-react";

export default function StatCard({
  title,
  value,
  isCurrency,
  icon: Icon,
  color,
  trend,
  subtext,
  alert,
}: any) {
  return (
    <div className="bg-white p-5 rounded-2xl border border-zinc-200 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div
          className={`p-2 rounded-lg bg-zinc-50 ${alert ? "bg-red-50" : ""}`}
        >
          <Icon className={`h-5 w-5 ${alert ? "text-red-600" : color}`} />
        </div>
        {trend && (
          <span className="text-[10px] font-bold text-green-600 bg-green-50 px-2 py-1 rounded-full">
            {trend}
          </span>
        )}
      </div>
      <div>
        <p className="text-zinc-400 text-[10px] font-black uppercase tracking-widest mb-1">
          {title}
        </p>
        <h2 className="text-2xl font-bold text-zinc-900">
          {isCurrency
            ? `KES ${value.toLocaleString()}`
            : value.toLocaleString()}
        </h2>
        {subtext && (
          <p
            className={`text-[10px] mt-1 font-medium ${alert ? "text-red-600" : "text-zinc-500"}`}
          >
            {subtext}
          </p>
        )}
      </div>
    </div>
  );
}
