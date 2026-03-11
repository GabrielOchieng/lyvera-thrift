interface ProductProps {
  name: string;
  price: number;
  size: string;
  image: string;
  isSold?: boolean;
  categoryName?: string;
}

export default function ProductCard({
  name,
  price,
  size,
  image,
  isSold,
}: ProductProps) {
  return (
    <div className="group relative flex flex-col gap-3">
      <div className="relative aspect-3/4 overflow-hidden rounded-2xl bg-zinc-900">
        <img
          src={image}
          alt={name}
          className={`h-full w-full object-cover transition-transform duration-500 group-hover:scale-110 ${isSold ? "grayscale opacity-50" : ""}`}
        />
        {isSold && (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="bg-white text-black px-4 py-1 font-bold uppercase -rotate-12 border-2 border-black">
              Sold
            </span>
          </div>
        )}
        <div className="absolute bottom-3 left-3 bg-black/70 px-2 py-1 text-xs rounded-md">
          Size: {size}
        </div>
      </div>
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-bold text-lg leading-tight uppercase">{name}</h3>
          <p className="text-thrift-pink font-mono">KSh {price}</p>
        </div>
        <button
          disabled={isSold}
          className="bg-white text-black text-xs font-bold px-3 py-2 rounded-full hover:bg-thrift-pink hover:text-white transition disabled:opacity-30"
        >
          {isSold ? "N/A" : "ADD"}
        </button>
      </div>
    </div>
  );
}
