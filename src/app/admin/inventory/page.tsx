// import { Package, Filter } from "lucide-react";
// import prisma from "../../../../lib/prisma";
// import Link from "next/link";
// import InventoryActions from "@/components/Inventory/InventoryActions";

// export default async function InventoryPage({
//   searchParams,
// }: {
//   searchParams: Promise<{ category?: string; status?: string }>;
// }) {
//   const { category, status } = await searchParams;

//   // 1. Fetch real categories from your DB to populate the filter bar
//   const dbCategories = await prisma.category.findMany({
//     orderBy: { name: "asc" },
//   });

//   const where: any = {};

//   // 2. Filter using the exact ID passed in the URL (no lowercase needed for CUIDs)
//   if (category && category !== "all") {
//     where.categoryId = category;
//   }

//   if (status === "sold") where.isSold = true;
//   if (status === "available") where.isSold = false;

//   // 3. Include the category object so we can show the name in the table
//   const products = await prisma.product.findMany({
//     where,
//     include: {
//       category: true,
//     },
//     orderBy: { createdAt: "desc" },
//   });

//   return (
//     <div className="space-y-8">
//       <header className="flex justify-between items-end border-b border-maroon-primary/10 pb-6">
//         <div>
//           <h1 className="text-3xl mb-2 font-serif font-bold text-maroon-primary">
//             Inventory
//           </h1>
//           <p className="text-zinc-500 text-sm uppercase tracking-widest">
//             Manage your curated collection
//           </p>
//         </div>
//         <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
//           Showing {products.length} items
//         </div>
//       </header>

//       {/* Filter Bar */}
//       <div className="flex flex-wrap items-center gap-4 bg-white p-4 rounded-2xl border border-zinc-200 shadow-sm">
//         <div className="flex items-center gap-2 text-zinc-400 px-2">
//           <Filter className="h-4 w-4" />
//           <span className="text-[10px] font-black uppercase tracking-tighter">
//             Filter By:
//           </span>
//         </div>

//         <div className="flex gap-2 flex-wrap">
//           <Link
//             href="/admin/inventory"
//             className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
//               !category || category === "all"
//                 ? "bg-maroon-primary text-white"
//                 : "bg-zinc-100 text-zinc-500 hover:bg-zinc-200"
//             }`}
//           >
//             All
//           </Link>

//           {/* 4. Map through DB categories instead of hardcoded strings */}
//           {dbCategories.map((cat) => (
//             <Link
//               key={cat.id}
//               href={`?category=${cat.id}${status ? `&status=${status}` : ""}`}
//               className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
//                 category === cat.id
//                   ? "bg-maroon-primary text-white"
//                   : "bg-zinc-100 text-zinc-500 hover:bg-zinc-200"
//               }`}
//             >
//               {cat.name}
//             </Link>
//           ))}
//         </div>

//         <div className="h-6 w-px bg-zinc-200 mx-2 hidden md:block" />

//         <div className="flex gap-2">
//           <Link
//             href={`?status=available${category ? `&category=${category}` : ""}`}
//             className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
//               status === "available"
//                 ? "bg-green-600 text-white"
//                 : "bg-zinc-100 text-zinc-500 hover:bg-zinc-200"
//             }`}
//           >
//             Available
//           </Link>
//           <Link
//             href={`?status=sold${category ? `&category=${category}` : ""}`}
//             className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
//               status === "sold"
//                 ? "bg-zinc-800 text-white"
//                 : "bg-zinc-100 text-zinc-500 hover:bg-zinc-200"
//             }`}
//           >
//             Sold
//           </Link>
//         </div>
//       </div>

//       {/* Products Table */}
//       <div className="bg-white rounded-2xl border border-zinc-200 shadow-xl overflow-hidden">
//         {products.length === 0 ? (
//           <div className="p-20 text-center">
//             <Package className="h-12 w-12 text-zinc-200 mx-auto mb-4" />
//             <p className="text-zinc-500 font-serif italic">
//               No items found matching these filters.
//             </p>
//             <Link
//               href="/admin/inventory"
//               className="text-maroon-primary text-xs font-bold underline mt-4 block uppercase"
//             >
//               Clear all filters
//             </Link>
//           </div>
//         ) : (
//           <table className="w-full text-left border-collapse">
//             <thead>
//               <tr className="bg-zinc-50 border-b border-zinc-200">
//                 <th className="p-4 text-[10px] font-black uppercase tracking-widest text-zinc-500">
//                   Item
//                 </th>
//                 <th className="p-4 text-[10px] font-black uppercase tracking-widest text-zinc-500">
//                   Category
//                 </th>
//                 <th className="p-4 text-[10px] font-black uppercase tracking-widest text-zinc-500">
//                   Price
//                 </th>
//                 <th className="p-4 text-[10px] font-black uppercase tracking-widest text-zinc-500">
//                   Status
//                 </th>
//                 <th className="p-4 text-[10px] font-black uppercase tracking-widest text-zinc-500 text-right">
//                   Actions
//                 </th>
//               </tr>
//             </thead>
//             <tbody className="divide-y divide-zinc-100">
//               {products.map((item) => (
//                 <tr
//                   key={item.id}
//                   className="hover:bg-zinc-50/50 transition-colors"
//                 >
//                   <td className="p-4">
//                     <div className="flex items-center gap-3">
//                       <div className="h-12 w-12 rounded-lg bg-zinc-100 overflow-hidden shrink-0">
//                         {item.images && item.images[0] ? (
//                           <img
//                             src={item.images[0]}
//                             alt={item.name}
//                             className="h-full w-full object-cover"
//                           />
//                         ) : (
//                           <Package className="h-full w-full p-3 text-zinc-300" />
//                         )}
//                       </div>
//                       <span className="font-bold text-zinc-900 truncate max-w-50">
//                         {item.name}
//                       </span>
//                     </div>
//                   </td>
//                   <td className="p-4 text-sm text-zinc-600 font-bold uppercase tracking-tighter">
//                     {/* 5. Show Category Name instead of ID string */}
//                     {item.category?.name || "Uncategorized"}
//                   </td>
//                   <td className="p-4 text-sm font-bold text-zinc-900">
//                     KES {item.price.toLocaleString()}
//                   </td>
//                   <td className="p-4">
//                     {item.isSold ? (
//                       <span className="text-[9px] font-bold bg-zinc-100 text-zinc-500 px-2 py-1 rounded-full uppercase">
//                         Sold
//                       </span>
//                     ) : (
//                       <span className="text-[9px] font-bold bg-green-50 text-green-600 px-2 py-1 rounded-full border border-green-100 uppercase">
//                         Available
//                       </span>
//                     )}
//                   </td>
//                   <td className="p-4 text-right">
//                     <InventoryActions
//                       product={item}
//                       categories={dbCategories} // Pass the categories here
//                     />{" "}
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         )}
//       </div>
//     </div>
//   );
// }

import { Package, Filter } from "lucide-react";
import prisma from "../../../../lib/prisma";
import Link from "next/link";
import InventoryActions from "@/components/Inventory/InventoryActions";

export default async function InventoryPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; status?: string }>;
}) {
  const { category, status } = await searchParams;

  const dbCategories = await prisma.category.findMany({
    orderBy: { name: "asc" },
  });

  const where: any = {};
  if (category && category !== "all") {
    where.categoryId = category;
  }
  if (status === "sold") where.isSold = true;
  if (status === "available") where.isSold = false;

  const products = await prisma.product.findMany({
    where,
    include: { category: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6 lg:space-y-8">
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-end border-b border-maroon-primary/10 pb-6 gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl mb-1 font-serif font-bold text-maroon-primary">
            Inventory
          </h1>
          <p className="text-zinc-500 text-[10px] lg:text-sm uppercase tracking-widest">
            Manage your curated collection
          </p>
        </div>
        <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest bg-zinc-50 px-3 py-1 rounded-full border border-zinc-100">
          {products.length} items found
        </div>
      </header>

      {/* Filter Bar - Responsive Wrap */}
      <div className="flex flex-col gap-4 bg-white p-4 lg:p-5 rounded-2xl border border-zinc-200 shadow-sm">
        <div className="flex items-center gap-2 text-zinc-400">
          <Filter className="h-4 w-4" />
          <span className="text-[10px] font-black uppercase tracking-widest">
            Filter By:
          </span>
        </div>

        <div className="flex flex-wrap gap-2">
          <Link
            href="/admin/inventory"
            className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
              !category || category === "all"
                ? "bg-maroon-primary text-white shadow-md shadow-maroon-primary/20"
                : "bg-zinc-100 text-zinc-500 hover:bg-zinc-200"
            }`}
          >
            All
          </Link>

          {dbCategories.map((cat) => (
            <Link
              key={cat.id}
              href={`?category=${cat.id}${status ? `&status=${status}` : ""}`}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
                category === cat.id
                  ? "bg-maroon-primary text-white shadow-md shadow-maroon-primary/20"
                  : "bg-zinc-100 text-zinc-500 hover:bg-zinc-200"
              }`}
            >
              {cat.name}
            </Link>
          ))}

          {/* Vertical Divider for Desktop */}
          <div className="hidden md:block h-8 w-px bg-zinc-200 mx-2" />

          <div className="flex gap-2 w-full md:w-auto mt-2 md:mt-0">
            <Link
              href={`?status=available${category ? `&category=${category}` : ""}`}
              className={`flex-1 md:flex-none text-center px-4 py-2 rounded-full text-xs font-bold transition-all ${
                status === "available"
                  ? "bg-green-600 text-white"
                  : "bg-zinc-100 text-zinc-500 hover:bg-zinc-200"
              }`}
            >
              Available
            </Link>
            <Link
              href={`?status=sold${category ? `&category=${category}` : ""}`}
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

      {/* Products Table - Responsive Transformation */}
      <div className="bg-white rounded-2xl border border-zinc-200 shadow-xl overflow-hidden">
        {products.length === 0 ? (
          <div className="p-12 lg:p-20 text-center">
            <Package className="h-12 w-12 text-zinc-200 mx-auto mb-4" />
            <p className="text-zinc-500 font-serif italic mb-4">
              No items found matching these filters.
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
                          <img
                            src={item.images?.[0]}
                            className="h-12 w-12 rounded-lg object-cover bg-zinc-100"
                            alt=""
                          />
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
                          className={`text-[9px] font-bold px-2 py-1 rounded-full uppercase border ${item.isSold ? "bg-zinc-100 text-zinc-500 border-zinc-200" : "bg-green-50 text-green-600 border-green-100"}`}
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
                    <img
                      src={item.images?.[0]}
                      className="h-14 w-14 rounded-xl object-cover bg-zinc-100 shrink-0"
                      alt=""
                    />
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
                      className={`text-[8px] font-black px-1.5 py-0.5 rounded uppercase ${item.isSold ? "bg-zinc-100 text-zinc-400" : "bg-green-100 text-green-600"}`}
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
