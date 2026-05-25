// import { Package, Filter } from "lucide-react";
// import prisma from "../../../../lib/prisma";
// import Link from "next/link";
// import InventoryActions from "@/components/Inventory/InventoryActions";
// import SearchInput from "@/components/Inventory/searchInput";

// export default async function InventoryPage({
//   searchParams,
// }: {
//   searchParams: Promise<{ category?: string; status?: string; query?: string }>;
// }) {
//   const { category, status, query } = await searchParams;

//   const dbCategories = await prisma.category.findMany({
//     orderBy: { name: "asc" },
//   });

//   // 1. Build the dynamic Prisma 'where' clause
//   const where: any = {};

//   if (category && category !== "all") {
//     where.categoryId = category;
//   }

//   if (status === "sold") where.isSold = true;
//   if (status === "available") where.isSold = false;

//   // 2. Add Search Logic (Searching by Name or Description)
//   if (query) {
//     where.OR = [
//       { name: { contains: query, mode: "insensitive" } },
//       { description: { contains: query, mode: "insensitive" } },
//     ];
//   }

//   const products = await prisma.product.findMany({
//     where,
//     include: { category: true },
//     orderBy: { createdAt: "desc" },
//   });

//   return (
//     <div className="space-y-6 lg:space-y-8">
//       {/* HEADER SECTION */}
//       <header className="flex flex-col sm:flex-row justify-between items-start sm:items-end border-b border-maroon-primary/10 pb-6 gap-4">
//         <div>
//           <h1 className="text-2xl lg:text-3xl mb-1 font-serif font-bold text-maroon-primary">
//             Inventory
//           </h1>
//           <p className="text-zinc-500 text-[10px] lg:text-sm uppercase tracking-widest">
//             Manage your curated collection
//           </p>
//         </div>

//         <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
//           {/* SEARCH COMPONENT */}
//           <SearchInput />

//           <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest bg-zinc-50 px-3 py-1 rounded-full border border-zinc-100 whitespace-nowrap">
//             {products.length} items found
//           </div>
//         </div>
//       </header>

//       {/* FILTER BAR */}
//       <div className="flex flex-col gap-4 bg-white p-4 lg:p-5 rounded-2xl border border-zinc-200 shadow-sm">
//         <div className="flex items-center gap-2 text-zinc-400">
//           <Filter className="h-4 w-4" />
//           <span className="text-[10px] font-black uppercase tracking-widest">
//             Filter By:
//           </span>
//         </div>

//         <div className="flex flex-wrap gap-2">
//           {/* All Categories Link (Preserves query) */}
//           <Link
//             href={`/admin/inventory${query ? `?query=${query}` : ""}`}
//             className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
//               !category || category === "all"
//                 ? "bg-maroon-primary text-white shadow-md shadow-maroon-primary/20"
//                 : "bg-zinc-100 text-zinc-500 hover:bg-zinc-200"
//             }`}
//           >
//             All
//           </Link>

//           {/* Dynamic Categories (Preserves status and query) */}
//           {dbCategories.map((cat) => (
//             <Link
//               key={cat.id}
//               href={`?category=${cat.id}${status ? `&status=${status}` : ""}${query ? `&query=${query}` : ""}`}
//               className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
//                 category === cat.id
//                   ? "bg-maroon-primary text-white shadow-md shadow-maroon-primary/20"
//                   : "bg-zinc-100 text-zinc-500 hover:bg-zinc-200"
//               }`}
//             >
//               {cat.name}
//             </Link>
//           ))}

//           <div className="hidden md:block h-8 w-px bg-zinc-200 mx-2" />

//           {/* Status Filters (Preserves category and query) */}
//           <div className="flex gap-2 w-full md:w-auto mt-2 md:mt-0">
//             <Link
//               href={`?status=available${category ? `&category=${category}` : ""}${query ? `&query=${query}` : ""}`}
//               className={`flex-1 md:flex-none text-center px-4 py-2 rounded-full text-xs font-bold transition-all ${
//                 status === "available"
//                   ? "bg-green-600 text-white"
//                   : "bg-zinc-100 text-zinc-500 hover:bg-zinc-200"
//               }`}
//             >
//               Available
//             </Link>
//             <Link
//               href={`?status=sold${category ? `&category=${category}` : ""}${query ? `&query=${query}` : ""}`}
//               className={`flex-1 md:flex-none text-center px-4 py-2 rounded-full text-xs font-bold transition-all ${
//                 status === "sold"
//                   ? "bg-zinc-800 text-white"
//                   : "bg-zinc-100 text-zinc-500 hover:bg-zinc-200"
//               }`}
//             >
//               Sold
//             </Link>
//           </div>
//         </div>
//       </div>

//       {/* PRODUCTS TABLE / CARD LIST */}
//       <div className="bg-white rounded-2xl border border-zinc-200 shadow-xl overflow-hidden">
//         {products.length === 0 ? (
//           <div className="p-12 lg:p-20 text-center">
//             <Package className="h-12 w-12 text-zinc-200 mx-auto mb-4" />
//             <p className="text-zinc-500 font-serif italic mb-4">
//               {query
//                 ? `No items matching "${query}" found.`
//                 : "No items found matching these filters."}
//             </p>
//             <Link
//               href="/admin/inventory"
//               className="text-maroon-primary text-xs font-bold underline uppercase tracking-widest"
//             >
//               Clear all filters
//             </Link>
//           </div>
//         ) : (
//           <>
//             {/* Desktop View (Table) */}
//             <div className="hidden md:block overflow-x-auto">
//               <table className="w-full text-left border-collapse">
//                 <thead>
//                   <tr className="bg-zinc-50 border-b border-zinc-200">
//                     <th className="p-4 text-[10px] font-black uppercase tracking-widest text-zinc-500">
//                       Item
//                     </th>
//                     <th className="p-4 text-[10px] font-black uppercase tracking-widest text-zinc-500">
//                       Category
//                     </th>
//                     <th className="p-4 text-[10px] font-black uppercase tracking-widest text-zinc-500">
//                       Price
//                     </th>
//                     <th className="p-4 text-[10px] font-black uppercase tracking-widest text-zinc-500">
//                       Status
//                     </th>
//                     <th className="p-4 text-[10px] font-black uppercase tracking-widest text-zinc-500 text-right">
//                       Actions
//                     </th>
//                   </tr>
//                 </thead>
//                 <tbody className="divide-y divide-zinc-100">
//                   {products.map((item) => (
//                     <tr
//                       key={item.id}
//                       className="hover:bg-zinc-50/50 transition-colors"
//                     >
//                       <td className="p-4">
//                         <div className="flex items-center gap-3">
//                           {item.images?.[0] ? (
//                             /* 1. Standard Image Render */
//                             <img
//                               src={item.images[0]}
//                               className="h-12 w-12 rounded-lg object-cover bg-zinc-100"
//                               alt={item.name || "Product"}
//                               onError={(e) => {
//                                 e.currentTarget.src =
//                                   "https://placehold.co/100x100?text=Piece";
//                               }}
//                             />
//                           ) : item.videoUrl ? (
//                             /* 2. Video Thumbnail Fallback (Pinned safely to frame 1) */
//                             <div className="h-12 w-12 rounded-lg overflow-hidden bg-zinc-100 relative">
//                               <video
//                                 src={`${item.videoUrl}#t=0.01`}
//                                 preload="metadata"
//                                 muted
//                                 playsInline
//                                 crossOrigin="anonymous"
//                                 className="h-full w-full object-cover"
//                               />
//                             </div>
//                           ) : (
//                             /* 3. Global Placeholder Fallback if both properties are missing */
//                             <img
//                               src="https://placehold.co/100x100?text=Piece"
//                               className="h-12 w-12 rounded-lg object-cover bg-zinc-100"
//                               alt="Placeholder"
//                             />
//                           )}

//                           <span className="font-bold text-zinc-900 truncate max-w-50">
//                             {item.name}
//                           </span>
//                         </div>
//                       </td>
//                       <td className="p-4 text-xs font-bold text-zinc-600 uppercase tracking-tighter">
//                         {item.category?.name}
//                       </td>
//                       <td className="p-4 text-sm font-bold text-zinc-900">
//                         KES {item.price.toLocaleString()}
//                       </td>
//                       <td className="p-4">
//                         <span
//                           className={`text-[9px] font-bold px-2 py-1 rounded-full uppercase border ${
//                             item.isSold
//                               ? "bg-zinc-100 text-zinc-500 border-zinc-200"
//                               : "bg-green-50 text-green-600 border-green-100"
//                           }`}
//                         >
//                           {item.isSold ? "Sold" : "Available"}
//                         </span>
//                       </td>
//                       <td className="p-4 text-right">
//                         <InventoryActions
//                           product={item}
//                           categories={dbCategories}
//                         />
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>

//             {/* Mobile View (Card List) */}
//             <div className="md:hidden divide-y divide-zinc-100">
//               {products.map((item) => (
//                 <div
//                   key={item.id}
//                   className="p-4 flex items-center justify-between gap-4"
//                 >
//                   <div className="flex items-center gap-3 min-w-0">
//                     <img
//                       src={item.images?.[0]}
//                       className="h-14 w-14 rounded-xl object-cover bg-zinc-100 shrink-0"
//                       alt=""
//                     />
//                     <div className="min-w-0">
//                       <p className="font-bold text-zinc-900 text-sm truncate">
//                         {item.name}
//                       </p>
//                       <p className="text-[10px] text-zinc-400 uppercase font-bold tracking-tight mb-1">
//                         {item.category?.name}
//                       </p>
//                       <p className="text-maroon-primary font-black text-xs italic">
//                         KES {item.price.toLocaleString()}
//                       </p>
//                     </div>
//                   </div>
//                   <div className="flex flex-col items-end gap-2">
//                     <InventoryActions
//                       product={item}
//                       categories={dbCategories}
//                     />
//                     <span
//                       className={`text-[8px] font-black px-1.5 py-0.5 rounded uppercase ${
//                         item.isSold
//                           ? "bg-zinc-100 text-zinc-400"
//                           : "bg-green-100 text-green-600"
//                       }`}
//                     >
//                       {item.isSold ? "Sold" : "Live"}
//                     </span>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </>
//         )}
//       </div>
//     </div>
//   );
// }

import { Package, Filter } from "lucide-react";
import prisma from "../../../../lib/prisma";
import Link from "next/link";
import InventoryActions from "@/components/Inventory/InventoryActions";
import SearchInput from "@/components/Inventory/searchInput";

export default async function InventoryPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; status?: string; query?: string }>;
}) {
  const { category, status, query } = await searchParams;

  const dbCategories = await prisma.category.findMany({
    orderBy: { name: "asc" },
  });

  // 1. Build the dynamic Prisma 'where' clause
  const where: any = {};

  if (category && category !== "all") {
    where.categoryId = category;
  }

  if (status === "sold") where.isSold = true;
  if (status === "available") where.isSold = false;

  // 2. Add Search Logic (Searching by Name or Description)
  if (query) {
    where.OR = [
      { name: { contains: query, mode: "insensitive" } },
      { description: { contains: query, mode: "insensitive" } },
    ];
  }

  const products = await prisma.product.findMany({
    where,
    include: { category: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6 lg:space-y-8">
      {/* HEADER SECTION */}
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-end border-b border-maroon-primary/10 pb-6 gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl mb-1 font-serif font-bold text-maroon-primary">
            Inventory
          </h1>
          <p className="text-zinc-500 text-[10px] lg:text-sm uppercase tracking-widest">
            Manage your curated collection
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
          {/* SEARCH COMPONENT */}
          <SearchInput />

          <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest bg-zinc-50 px-3 py-1 rounded-full border border-zinc-100 whitespace-nowrap">
            {products.length} items found
          </div>
        </div>
      </header>

      {/* FILTER BAR */}
      <div className="flex flex-col gap-4 bg-white p-4 lg:p-5 rounded-2xl border border-zinc-200 shadow-sm">
        <div className="flex items-center gap-2 text-zinc-400">
          <Filter className="h-4 w-4" />
          <span className="text-[10px] font-black uppercase tracking-widest">
            Filter By:
          </span>
        </div>

        <div className="flex flex-wrap gap-2">
          {/* All Categories Link (Preserves query) */}
          <Link
            href={`/admin/inventory${query ? `?query=${query}` : ""}`}
            className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
              !category || category === "all"
                ? "bg-maroon-primary text-white shadow-md shadow-maroon-primary/20"
                : "bg-zinc-100 text-zinc-500 hover:bg-zinc-200"
            }`}
          >
            All
          </Link>

          {/* Dynamic Categories (Preserves status and query) */}
          {dbCategories.map((cat) => (
            <Link
              key={cat.id}
              href={`?category=${cat.id}${status ? `&status=${status}` : ""}${query ? `&query=${query}` : ""}`}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
                category === cat.id
                  ? "bg-maroon-primary text-white shadow-md shadow-maroon-primary/20"
                  : "bg-zinc-100 text-zinc-500 hover:bg-zinc-200"
              }`}
            >
              {cat.name}
            </Link>
          ))}

          <div className="hidden md:block h-8 w-px bg-zinc-200 mx-2" />

          {/* Status Filters (Preserves category and query) */}
          <div className="flex gap-2 w-full md:w-auto mt-2 md:mt-0">
            <Link
              href={`?status=available${category ? `&category=${category}` : ""}${query ? `&query=${query}` : ""}`}
              className={`flex-1 md:flex-none text-center px-4 py-2 rounded-full text-xs font-bold transition-all ${
                status === "available"
                  ? "bg-green-600 text-white"
                  : "bg-zinc-100 text-zinc-500 hover:bg-zinc-200"
              }`}
            >
              Available
            </Link>
            <Link
              href={`?status=sold${category ? `&category=${category}` : ""}${query ? `&query=${query}` : ""}`}
              className={`flex-1 md:flex-none text-center px-4 py-2 rounded-full text-xs font-bold transition-all ${
                status === "sold"
                  ? "bg-zinc-800 text-white"
                  : "bg-zinc-100 text-zinc-500 hover:bg-zinc-200"
              }`}
            >
              Sold
            </Link>
          </div>
        </div>
      </div>

      {/* PRODUCTS TABLE / CARD LIST */}
      <div className="bg-white rounded-2xl border border-zinc-200 shadow-xl overflow-hidden">
        {products.length === 0 ? (
          <div className="p-12 lg:p-20 text-center">
            <Package className="h-12 w-12 text-zinc-200 mx-auto mb-4" />
            <p className="text-zinc-500 font-serif italic mb-4">
              {query
                ? `No items matching "${query}" found.`
                : "No items found matching these filters."}
            </p>
            <Link
              href="/admin/inventory"
              className="text-maroon-primary text-xs font-bold underline uppercase tracking-widest"
            >
              Clear all filters
            </Link>
          </div>
        ) : (
          <>
            {/* Desktop View (Table) */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-zinc-50 border-b border-zinc-200">
                    <th className="p-4 text-[10px] font-black uppercase tracking-widest text-zinc-500">
                      Item
                    </th>
                    <th className="p-4 text-[10px] font-black uppercase tracking-widest text-zinc-500">
                      Category
                    </th>
                    <th className="p-4 text-[10px] font-black uppercase tracking-widest text-zinc-500">
                      Price
                    </th>
                    <th className="p-4 text-[10px] font-black uppercase tracking-widest text-zinc-500">
                      Status
                    </th>
                    <th className="p-4 text-[10px] font-black uppercase tracking-widest text-zinc-500 text-right">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100">
                  {products.map((item) => (
                    <tr
                      key={item.id}
                      className="hover:bg-zinc-50/50 transition-colors"
                    >
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          {item.images?.[0] ? (
                            <img
                              src={item.images[0]}
                              className="h-12 w-12 rounded-lg object-cover bg-zinc-100"
                              alt={item.name || "Product"}
                            />
                          ) : item.videoUrl ? (
                            <div className="h-12 w-12 rounded-lg overflow-hidden bg-zinc-100 relative shadow-sm">
                              <video
                                src={`${item.videoUrl}#t=0.01`}
                                preload="metadata"
                                muted
                                playsInline
                                crossOrigin="anonymous"
                                className="h-full w-full object-cover"
                              />
                            </div>
                          ) : (
                            <img
                              src="https://placehold.co/100x100?text=Piece"
                              className="h-12 w-12 rounded-lg object-cover bg-zinc-100"
                              alt="Placeholder"
                            />
                          )}

                          <span className="font-bold text-zinc-900 truncate max-w-50">
                            {item.name}
                          </span>
                        </div>
                      </td>
                      <td className="p-4 text-xs font-bold text-zinc-600 uppercase tracking-tighter">
                        {item.category?.name}
                      </td>
                      <td className="p-4 text-sm font-bold text-zinc-900">
                        KES {item.price.toLocaleString()}
                      </td>
                      <td className="p-4">
                        <span
                          className={`text-[9px] font-bold px-2 py-1 rounded-full uppercase border ${
                            item.isSold
                              ? "bg-zinc-100 text-zinc-500 border-zinc-200"
                              : "bg-green-50 text-green-600 border-green-100"
                          }`}
                        >
                          {item.isSold ? "Sold" : "Available"}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <InventoryActions
                          product={item}
                          categories={dbCategories}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile View (Card List) */}
            <div className="md:hidden divide-y divide-zinc-100">
              {products.map((item) => (
                <div
                  key={item.id}
                  className="p-4 flex items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    {/* Fixed Media Frame Layer for Mobile Layout */}
                    {item.images?.[0] ? (
                      <img
                        src={item.images[0]}
                        className="h-14 w-14 rounded-xl object-cover bg-zinc-100 shrink-0"
                        alt={item.name}
                      />
                    ) : item.videoUrl ? (
                      <div className="h-14 w-14 rounded-xl overflow-hidden bg-zinc-100 border border-zinc-100 shrink-0 relative shadow-sm">
                        <video
                          src={`${item.videoUrl}#t=0.01`}
                          preload="metadata"
                          muted
                          playsInline
                          crossOrigin="anonymous"
                          className="h-full w-full object-cover"
                        />
                      </div>
                    ) : (
                      <img
                        src="https://placehold.co/100x100?text=Piece"
                        className="h-14 w-14 rounded-xl object-cover bg-zinc-100 shrink-0"
                        alt="Placeholder"
                      />
                    )}

                    <div className="min-w-0">
                      <p className="font-bold text-zinc-900 text-sm truncate">
                        {item.name}
                      </p>
                      <p className="text-[10px] text-zinc-400 uppercase font-bold tracking-tight mb-1">
                        {item.category?.name}
                      </p>
                      <p className="text-maroon-primary font-black text-xs italic">
                        KES {item.price.toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <InventoryActions
                      product={item}
                      categories={dbCategories}
                    />
                    <span
                      className={`text-[8px] font-black px-1.5 py-0.5 rounded uppercase ${
                        item.isSold
                          ? "bg-zinc-100 text-zinc-400"
                          : "bg-green-100 text-green-600"
                      }`}
                    >
                      {item.isSold ? "Sold" : "Live"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
