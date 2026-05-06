// import { SearchX, Filter, Tag, ChevronDown } from "lucide-react";
// import ProductCard from "@/components/ProductCard";
// import Link from "next/link";
// import prisma from "../../../../lib/prisma";
// import { safeDbQuery } from "@/lib/db-utils";

// export default async function ShopPage({
//   searchParams,
// }: {
//   searchParams: Promise<{
//     search?: string;
//     category?: string;
//     minPrice?: string;
//     maxPrice?: string;
//     sort?: string;
//   }>;
// }) {
//   const {
//     search,
//     category: activeCategory,
//     minPrice,
//     maxPrice,
//     sort,
//   } = await searchParams;

//   const query = search || "";
//   const min = Number(minPrice) || 0;
//   const max = Number(maxPrice) || 1000000;

//   // 1. Handle Sorting Logic
//   let orderBy: any = { createdAt: "desc" };
//   if (sort === "price_asc") orderBy = { price: "asc" };
//   if (sort === "price_desc") orderBy = { price: "desc" };
//   if (sort === "oldest") orderBy = { createdAt: "asc" };

//   // 2. Fetch Data
//   // const categories = await prisma.category.findMany({
//   //   orderBy: { name: "asc" },
//   // });

//   const categories = await safeDbQuery(() =>
//     prisma.category.findMany({ orderBy: { name: "asc" } }),
//   );

//   const products = await prisma.product.findMany({
//     where: {
//       isSold: false,
//       price: { gte: min, lte: max },
//       AND: [
//         query
//           ? {
//               OR: [
//                 { name: { contains: query, mode: "insensitive" } },
//                 { description: { contains: query, mode: "insensitive" } },
//               ],
//             }
//           : {},
//         activeCategory
//           ? { category: { name: { equals: activeCategory } } }
//           : {},
//       ],
//     },
//     include: { category: true },
//     orderBy,
//   });

//   const priceTiers = [
//     { label: "Under KES 1,000", min: 0, max: 1000 },
//     { label: "KES 1,000 - 3,000", min: 1000, max: 3000 },
//     { label: "KES 3,000 - 5,000", min: 3000, max: 5000 },
//     { label: "Over KES 5,000", min: 5000, max: 1000000 },
//   ];

//   const sortOptions = [
//     { label: "Newest Arrivals", value: "newest" },
//     { label: "Price: Low to High", value: "price_asc" },
//     { label: "Price: High to Low", value: "price_desc" },
//     { label: "Oldest First", value: "oldest" },
//   ];

//   return (
//     <div className="max-w-7xl mx-auto px-4 py-24 min-h-screen">
//       <div className="flex flex-col md:flex-row gap-12">
//         {/* SIDEBAR */}
//         <aside className="w-full md:w-64 shrink-0 space-y-10">
//           <div className="sticky top-24 space-y-10">
//             {/* Category Section */}
//             <div>
//               <div className="flex items-center gap-2 mb-4 text-maroon-primary border-b border-zinc-100 pb-2">
//                 <Filter className="h-4 w-4" />
//                 <h2 className="font-black uppercase tracking-widest text-[10px]">
//                   Categories
//                 </h2>
//               </div>
//               <ul className="space-y-2">
//                 <li>
//                   <Link
//                     href="/shop"
//                     className={`text-sm transition ${!activeCategory ? "font-bold text-maroon-primary" : "text-zinc-500 hover:text-zinc-800"}`}
//                   >
//                     All Collection
//                   </Link>
//                 </li>
//                 {categories.map((cat) => (
//                   <li key={cat.id}>
//                     <Link
//                       href={`/shop?category=${encodeURIComponent(cat.name)}${sort ? `&sort=${sort}` : ""}`}
//                       className={`text-sm uppercase transition ${activeCategory === cat.name ? "font-bold text-maroon-primary" : "text-zinc-500 hover:text-zinc-800"}`}
//                     >
//                       {cat.name}
//                     </Link>
//                   </li>
//                 ))}
//               </ul>
//             </div>

//             {/* Price Section */}
//             <div>
//               <div className="flex items-center gap-2 mb-4 text-maroon-primary border-b border-zinc-100 pb-2">
//                 <Tag className="h-4 w-4" />
//                 <h2 className="font-black uppercase tracking-widest text-[10px]">
//                   Price Filter
//                 </h2>
//               </div>
//               <ul className="space-y-2">
//                 {priceTiers.map((tier) => (
//                   <li key={tier.label}>
//                     <Link
//                       href={`/shop?${activeCategory ? `category=${activeCategory}&` : ""}minPrice=${tier.min}&maxPrice=${tier.max}${sort ? `&sort=${sort}` : ""}`}
//                       className={`text-sm block py-1 transition ${min === tier.min && max === tier.max ? "font-bold text-maroon-primary" : "text-zinc-500 hover:text-zinc-800"}`}
//                     >
//                       {tier.label}
//                     </Link>
//                   </li>
//                 ))}
//               </ul>
//             </div>
//           </div>
//         </aside>

//         {/* MAIN CONTENT */}
//         <main className="flex-1">
//           <header className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
//             <div>
//               <h1 className="text-4xl font-serif font-bold text-zinc-900 mb-2 uppercase tracking-tighter">
//                 {activeCategory || "The Shop"}
//               </h1>
//               <p className="text-zinc-500 italic text-sm">
//                 Showing {products.length} unique{" "}
//                 {products.length === 1 ? "piece" : "pieces"}
//               </p>
//             </div>

//             {/* SORT DROPDOWN */}
//             <div className="relative group inline-block">
//               <button className="flex items-center gap-2 bg-white border border-zinc-200 px-5 py-2.5 rounded-2xl text-xs font-bold text-zinc-700 hover:border-maroon-primary transition shadow-sm">
//                 SORT BY:{" "}
//                 {sortOptions.find((o) => o.value === sort)?.label || "NEWEST"}
//                 <ChevronDown className="h-4 w-4" />
//               </button>

//               <div className="absolute right-0 mt-2 w-56 bg-white border border-zinc-100 rounded-2xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 overflow-hidden py-2">
//                 {sortOptions.map((option) => (
//                   <Link
//                     key={option.value}
//                     href={`/shop?${activeCategory ? `category=${activeCategory}&` : ""}${minPrice ? `minPrice=${minPrice}&maxPrice=${maxPrice}&` : ""}sort=${option.value}`}
//                     className={`block px-5 py-3 text-xs font-bold transition hover:bg-zinc-50 ${
//                       (sort || "newest") === option.value
//                         ? "text-maroon-primary bg-maroon-primary/5"
//                         : "text-zinc-500"
//                     }`}
//                   >
//                     {option.label}
//                   </Link>
//                 ))}
//               </div>
//             </div>
//           </header>

//           {/* PRODUCT GRID */}
//           {products.length > 0 ? (
//             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
//               {products.map((product) => (
//                 <ProductCard
//                   key={product.id}
//                   {...product}
//                   image={product.images[0]}
//                   categoryName={product.category.name}
//                 />
//               ))}
//             </div>
//           ) : (
//             <div className="py-24 text-center bg-zinc-50 rounded-4xl border-2 border-dashed border-zinc-200">
//               <SearchX className="mx-auto h-16 w-16 text-zinc-200 mb-6" />
//               <h3 className="text-xl font-bold text-zinc-800">
//                 No items match your filters
//               </h3>
//               <p className="text-zinc-500 mt-2 mb-8">
//                 Try adjusting your price range or category.
//               </p>
//               <Link
//                 href="/shop"
//                 className="px-8 py-3 bg-maroon-primary text-white rounded-full text-xs font-black tracking-widest"
//               >
//                 CLEAR ALL FILTERS
//               </Link>
//             </div>
//           )}
//         </main>
//       </div>
//     </div>
//   );
// }

import { SearchX, Filter, Tag, ChevronDown } from "lucide-react";
import ProductCard from "@/components/ProductCard";
import Link from "next/link";
import prisma from "../../../../lib/prisma";
import { safeDbQuery } from "@/lib/db-utils";

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<{
    search?: string;
    category?: string;
    minPrice?: string;
    maxPrice?: string;
    sort?: string;
  }>;
}) {
  const {
    search,
    category: activeCategory,
    minPrice,
    maxPrice,
    sort,
  } = await searchParams;

  const query = search || "";
  const min = Number(minPrice) || 0;
  const max = Number(maxPrice) || 1000000;

  // 1. Handle Sorting Logic
  let orderBy: any = { createdAt: "desc" };
  if (sort === "price_asc") orderBy = { price: "asc" };
  if (sort === "price_desc") orderBy = { price: "desc" };
  if (sort === "oldest") orderBy = { createdAt: "asc" };

  // 2. Fetch Data
  const categories = await safeDbQuery(() =>
    prisma.category.findMany({ orderBy: { name: "asc" } }),
  );

  const products = await prisma.product.findMany({
    where: {
      isSold: false,
      price: { gte: min, lte: max },
      AND: [
        query
          ? {
              OR: [
                { name: { contains: query, mode: "insensitive" } },
                { description: { contains: query, mode: "insensitive" } },
              ],
            }
          : {},
        activeCategory
          ? { category: { name: { equals: activeCategory } } }
          : {},
      ],
    },
    include: { category: true },
    orderBy,
  });

  const priceTiers = [
    { label: "Under 1k", min: 0, max: 1000 },
    { label: "1k - 3k", min: 1000, max: 3000 },
    { label: "3k - 5k", min: 3000, max: 5000 },
    { label: "5k+", min: 5000, max: 1000000 },
  ];

  const sortOptions = [
    { label: "Newest", value: "newest" },
    { label: "Price: Low-High", value: "price_asc" },
    { label: "Price: High-Low", value: "price_desc" },
    { label: "Oldest", value: "oldest" },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-20 md:py-24 min-h-screen">
      {/* MOBILE CATEGORY SCROLL (Hidden on Desktop) */}
      <div className="md:hidden overflow-x-auto py-3 -mx-4 px-4 no-scrollbar flex gap-2 sticky top-16 bg-white/80 backdrop-blur-md z-30 border-b border-zinc-100">
        <Link
          href="/shop"
          className={`whitespace-nowrap px-5 py-2 rounded-full text-[10px] font-black tracking-widest border transition-all ${
            !activeCategory
              ? "bg-maroon-primary text-white border-maroon-primary shadow-lg shadow-maroon-primary/20"
              : "bg-white text-zinc-500 border-zinc-200"
          }`}
        >
          ALL COLLECTIONS
        </Link>
        {categories.map((cat) => (
          <Link
            key={cat.id}
            href={`/shop?category=${encodeURIComponent(cat.name)}${sort ? `&sort=${sort}` : ""}`}
            className={`whitespace-nowrap px-5 py-2 rounded-full text-[10px] font-black tracking-widest border transition-all ${
              activeCategory === cat.name
                ? "bg-maroon-primary text-white border-maroon-primary shadow-lg shadow-maroon-primary/20"
                : "bg-white text-zinc-500 border-zinc-200"
            }`}
          >
            {cat.name.toUpperCase()}
          </Link>
        ))}
      </div>

      <div className="flex flex-col md:flex-row gap-8 lg:gap-16">
        {/* DESKTOP SIDEBAR (Hidden on Mobile) */}
        <aside className="hidden md:block w-64 shrink-0 space-y-10">
          <div className="sticky top-32 space-y-10">
            {/* Category Section */}
            <div>
              <div className="flex items-center gap-2 mb-4 text-maroon-primary border-b border-zinc-100 pb-2">
                <Filter className="h-4 w-4" />
                <h2 className="font-black uppercase tracking-widest text-[10px]">
                  Categories
                </h2>
              </div>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/shop"
                    className={`text-sm transition ${!activeCategory ? "font-bold text-maroon-primary" : "text-zinc-500 hover:text-zinc-800"}`}
                  >
                    All Collection
                  </Link>
                </li>
                {categories.map((cat) => (
                  <li key={cat.id}>
                    <Link
                      href={`/shop?category=${encodeURIComponent(cat.name)}${sort ? `&sort=${sort}` : ""}`}
                      className={`text-sm uppercase transition ${activeCategory === cat.name ? "font-bold text-maroon-primary" : "text-zinc-500 hover:text-zinc-800"}`}
                    >
                      {cat.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Price Section */}
            <div>
              <div className="flex items-center gap-2 mb-4 text-maroon-primary border-b border-zinc-100 pb-2">
                <Tag className="h-4 w-4" />
                <h2 className="font-black uppercase tracking-widest text-[10px]">
                  Price Filter
                </h2>
              </div>
              <ul className="space-y-2">
                {priceTiers.map((tier) => (
                  <li key={tier.label}>
                    <Link
                      href={`/shop?${activeCategory ? `category=${activeCategory}&` : ""}minPrice=${tier.min}&maxPrice=${tier.max}${sort ? `&sort=${sort}` : ""}`}
                      className={`text-sm block py-1 transition ${min === tier.min && max === tier.max ? "font-bold text-maroon-primary" : "text-zinc-500 hover:text-zinc-800"}`}
                    >
                      {tier.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </aside>

        {/* MAIN CONTENT */}
        <main className="flex-1">
          <header className="mb-8 md:mb-12 flex flex-col sm:flex-row sm:items-end justify-between gap-6">
            <div>
              <h1 className="text-3xl md:text-5xl font-serif font-bold text-zinc-900 mb-2 uppercase tracking-tighter">
                {activeCategory || "The Shop"}
              </h1>
              <p className="text-zinc-500 italic text-xs md:text-sm">
                Found {products.length}{" "}
                {products.length === 1 ? "piece" : "pieces"} camera ready for
                you.
              </p>
            </div>

            {/* SORT DROPDOWN */}
            <div className="relative group inline-block sm:self-end">
              <button className="flex items-center gap-3 bg-white border border-zinc-200 px-6 py-3 rounded-full text-[10px] font-black tracking-widest text-zinc-700 hover:border-maroon-primary transition shadow-sm">
                SORT:{" "}
                {sortOptions
                  .find((o) => o.value === sort)
                  ?.label.toUpperCase() || "NEWEST"}
                <ChevronDown className="h-3 w-3" />
              </button>

              <div className="absolute right-0 mt-2 w-56 bg-white border border-zinc-100 rounded-2xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 overflow-hidden py-2">
                {sortOptions.map((option) => (
                  <Link
                    key={option.value}
                    href={`/shop?${activeCategory ? `category=${activeCategory}&` : ""}${minPrice ? `minPrice=${minPrice}&maxPrice=${maxPrice}&` : ""}sort=${option.value}`}
                    className={`block px-5 py-3 text-[10px] font-black tracking-widest transition hover:bg-zinc-50 ${
                      (sort || "newest") === option.value
                        ? "text-maroon-primary bg-maroon-primary/5"
                        : "text-zinc-500"
                    }`}
                  >
                    {option.label.toUpperCase()}
                  </Link>
                ))}
              </div>
            </div>
          </header>

          {/* PRODUCT GRID */}
          {products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-10">
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  {...product}
                  image={product.images[0]}
                  categoryName={product.category.name}
                />
              ))}
            </div>
          ) : (
            <div className="py-24 text-center bg-zinc-50 rounded-[40px] border-2 border-dashed border-zinc-200">
              <SearchX className="mx-auto h-12 w-12 text-zinc-300 mb-4" />
              <h3 className="text-lg font-bold text-zinc-800">
                No items found
              </h3>
              <p className="text-zinc-500 text-sm mt-1 mb-8">
                Try picking another category or price.
              </p>
              <Link
                href="/shop"
                className="px-10 py-4 bg-maroon-primary text-white rounded-full text-[10px] font-black tracking-widest shadow-xl shadow-maroon-primary/30"
              >
                CLEAR ALL
              </Link>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
