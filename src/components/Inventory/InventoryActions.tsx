// "use client";
// import { useState } from "react";
// import { MoreVertical, Edit3, Trash2, X } from "lucide-react";
// import { deleteProduct, updateProduct } from "@/actions/product";

// // 1. Define the props interface to include categories
// interface InventoryActionsProps {
//   product: any;
//   categories: { id: string; name: string }[];
// }

// export default function InventoryActions({
//   product,
//   categories = [],
// }: InventoryActionsProps) {
//   const [isOpen, setIsOpen] = useState(false);
//   const [isEditing, setIsEditing] = useState(false);

//   return (
//     <>
//       <button
//         onClick={() => setIsOpen(true)}
//         className="text-zinc-400 hover:text-maroon-primary transition-colors p-2"
//       >
//         <MoreVertical className="h-5 w-5" />
//       </button>

//       {isOpen && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 text-left">
//           <div className="bg-white w-full max-w-lg rounded-4xl shadow-2xl overflow-hidden border border-zinc-200">
//             {/* Modal Header */}
//             <div className="flex justify-between items-center p-6 border-b border-zinc-100">
//               <h2 className="text-xl font-serif font-bold text-maroon-primary">
//                 {isEditing ? "Edit Item" : "Item Details"}
//               </h2>
//               <button
//                 onClick={() => {
//                   setIsOpen(false);
//                   setIsEditing(false);
//                 }}
//                 className="text-zinc-400 hover:text-zinc-600"
//               >
//                 <X className="h-6 w-6" />
//               </button>
//             </div>

//             <div className="p-8">
//               {!isEditing ? (
//                 <div className="space-y-6">
//                   <div className="flex gap-4">
//                     <img
//                       src={
//                         product.images && product.images[0]
//                           ? product.images[0]
//                           : ""
//                       }
//                       className="w-32 h-32 object-cover rounded-2xl bg-zinc-100"
//                       alt={product.name}
//                     />
//                     <div>
//                       <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400">
//                         Name
//                       </p>
//                       <h3 className="text-lg font-bold text-zinc-900">
//                         {product.name}
//                       </h3>
//                       <p className="text-maroon-primary font-black italic">
//                         KES {product.price?.toLocaleString()}
//                       </p>
//                     </div>
//                   </div>

//                   <div>
//                     <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400">
//                       Description
//                     </p>
//                     <p className="text-sm text-zinc-600 leading-relaxed">
//                       {product.description || "No description provided."}
//                     </p>
//                   </div>

//                   <div className="flex gap-3 pt-4">
//                     <button
//                       onClick={() => setIsEditing(true)}
//                       className="flex-1 flex items-center justify-center gap-2 bg-zinc-100 text-zinc-900 font-bold py-3 rounded-xl hover:bg-zinc-200 transition-all"
//                     >
//                       <Edit3 className="h-4 w-4" /> Edit
//                     </button>
//                     <button
//                       onClick={async () => {
//                         if (confirm("Delete this item?")) {
//                           await deleteProduct(product.id);
//                           setIsOpen(false);
//                         }
//                       }}
//                       className="flex-1 flex items-center justify-center gap-2 bg-red-50 text-red-600 font-bold py-3 rounded-xl hover:bg-red-100 transition-all"
//                     >
//                       <Trash2 className="h-4 w-4" /> Delete
//                     </button>
//                   </div>
//                 </div>
//               ) : (
//                 <form
//                   action={async (fd) => {
//                     await updateProduct(product.id, fd);
//                     setIsEditing(false);
//                     setIsOpen(false);
//                   }}
//                   className="space-y-4"
//                 >
//                   <div className="space-y-1">
//                     <label className="text-[10px] font-bold text-zinc-400 uppercase ml-2">
//                       Name
//                     </label>
//                     <input
//                       name="name"
//                       defaultValue={product.name}
//                       className="w-full bg-zinc-100 p-4 rounded-xl outline-none focus:ring-2 ring-maroon-primary/20"
//                     />
//                   </div>

//                   <div className="space-y-1">
//                     <label className="text-[10px] font-bold text-zinc-400 uppercase ml-2">
//                       Price
//                     </label>
//                     <input
//                       name="price"
//                       type="number"
//                       defaultValue={product.price}
//                       className="w-full bg-zinc-100 p-4 rounded-xl outline-none focus:ring-2 ring-maroon-primary/20"
//                     />
//                   </div>

//                   <div className="space-y-1">
//                     <label className="text-[10px] font-bold text-zinc-400 uppercase ml-2">
//                       Category
//                     </label>
//                     <select
//                       name="categoryId"
//                       defaultValue={product.categoryId}
//                       className="w-full bg-zinc-100 p-4 rounded-xl outline-none focus:ring-2 ring-maroon-primary/20"
//                     >
//                       {/* 2. Dynamically render real categories from your database */}
//                       {categories.map((cat) => (
//                         <option key={cat.id} value={cat.id}>
//                           {cat.name}
//                         </option>
//                       ))}
//                     </select>
//                   </div>

//                   <button
//                     type="submit"
//                     className="w-full bg-maroon-primary text-white font-black py-4 rounded-xl shadow-lg shadow-maroon-primary/20"
//                   >
//                     Save Changes
//                   </button>
//                 </form>
//               )}
//             </div>
//           </div>
//         </div>
//       )}
//     </>
//   );
// }

"use client";
import { useState } from "react";
import { MoreVertical, Edit3, Trash2, X } from "lucide-react";
import { deleteProduct, updateProduct } from "@/actions/product";

interface InventoryActionsProps {
  product: any;
  categories: { id: string; name: string }[];
}

export default function InventoryActions({
  product,
  categories = [],
}: InventoryActionsProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="text-zinc-400 hover:text-maroon-primary transition-colors p-2"
      >
        <MoreVertical className="h-5 w-5" />
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 text-left">
          <div className="bg-white w-full max-w-lg rounded-4xl shadow-2xl overflow-hidden border border-zinc-200">
            {/* Modal Header */}
            <div className="flex justify-between items-center p-6 border-b border-zinc-100">
              <h2 className="text-xl font-serif font-bold text-maroon-primary">
                {isEditing ? "Edit Item" : "Item Details"}
              </h2>
              <button
                onClick={() => {
                  setIsOpen(false);
                  setIsEditing(false);
                }}
                className="text-zinc-400 hover:text-zinc-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="p-8 max-h-[80vh] overflow-y-auto">
              {!isEditing ? (
                <div className="space-y-6">
                  <div className="flex gap-4">
                    <img
                      src={product.images?.[0] || ""}
                      className="w-32 h-32 object-cover rounded-2xl bg-zinc-100"
                      alt={product.name}
                    />
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400">
                        Name
                      </p>
                      <h3 className="text-lg font-bold text-zinc-900">
                        {product.name}
                      </h3>
                      <p className="text-maroon-primary font-black italic">
                        KES {product.price?.toLocaleString()}
                      </p>
                      {product.size && (
                        <span className="text-xs bg-zinc-100 px-2 py-1 rounded text-zinc-600 font-bold">
                          Size: {product.size}
                        </span>
                      )}
                    </div>
                  </div>

                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400">
                      Description
                    </p>
                    <p className="text-sm text-zinc-600 leading-relaxed">
                      {product.description || "No description provided."}
                    </p>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <button
                      onClick={() => setIsEditing(true)}
                      className="flex-1 flex items-center justify-center gap-2 bg-zinc-100 text-zinc-900 font-bold py-3 rounded-xl hover:bg-zinc-200 transition-all"
                    >
                      <Edit3 className="h-4 w-4" /> Edit
                    </button>
                    <button
                      onClick={async () => {
                        if (confirm("Delete this item?")) {
                          await deleteProduct(product.id);
                          setIsOpen(false);
                        }
                      }}
                      className="flex-1 flex items-center justify-center gap-2 bg-red-50 text-red-600 font-bold py-3 rounded-xl hover:bg-red-100 transition-all"
                    >
                      <Trash2 className="h-4 w-4" /> Delete
                    </button>
                  </div>
                </div>
              ) : (
                <form
                  action={async (fd) => {
                    await updateProduct(product.id, fd);
                    setIsEditing(false);
                    setIsOpen(false);
                  }}
                  className="space-y-4"
                >
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-zinc-400 uppercase ml-2">
                        Name
                      </label>
                      <input
                        name="name"
                        defaultValue={product.name}
                        className="w-full bg-zinc-100 p-4 rounded-xl outline-none focus:ring-2 ring-maroon-primary/20"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-zinc-400 uppercase ml-2">
                        Price
                      </label>
                      <input
                        name="price"
                        type="number"
                        defaultValue={product.price}
                        className="w-full bg-zinc-100 p-4 rounded-xl outline-none focus:ring-2 ring-maroon-primary/20"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-zinc-400 uppercase ml-2">
                        Size
                      </label>
                      <input
                        name="size"
                        defaultValue={product.size}
                        placeholder="e.g. S, M, L, 4, 6"
                        className="w-full bg-zinc-100 p-4 rounded-xl outline-none focus:ring-2 ring-maroon-primary/20"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-zinc-400 uppercase ml-2">
                        Category
                      </label>
                      <select
                        name="categoryId"
                        defaultValue={product.categoryId}
                        className="w-full bg-zinc-100 p-4 rounded-xl outline-none focus:ring-2 ring-maroon-primary/20"
                      >
                        {categories.map((cat) => (
                          <option key={cat.id} value={cat.id}>
                            {cat.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-zinc-400 uppercase ml-2">
                      Description
                    </label>
                    <textarea
                      name="description"
                      rows={4}
                      defaultValue={product.description}
                      className="w-full bg-zinc-100 p-4 rounded-xl outline-none focus:ring-2 ring-maroon-primary/20 resize-none"
                    />
                  </div>

                  <div className="flex gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setIsEditing(false)}
                      className="flex-1 bg-zinc-100 text-zinc-900 font-bold py-4 rounded-xl"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-1 bg-maroon-primary text-white font-black py-4 rounded-xl shadow-lg shadow-maroon-primary/20"
                    >
                      Save Changes
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
