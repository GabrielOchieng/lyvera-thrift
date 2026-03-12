export default function StatCard({
  title,
  value,
  isCurrency,
  icon: Icon,
  color,
}: any) {
  return (
    <div className="bg-white p-5 rounded-2xl border border-zinc-200 shadow-sm">
      <div className="flex justify-between items-center mb-2">
        <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">
          {title}
        </span>
        <Icon className={`h-4 w-4 ${color} opacity-70`} />
      </div>
      <p className="text-2xl font-bold text-zinc-900">
        {isCurrency ? `KES ${value.toLocaleString()}` : value.toLocaleString()}
      </p>
    </div>
  );
}
