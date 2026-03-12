import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import ProductCard from "@/components/ProductCard";
import prisma from "../../../../../lib/prisma";
import ShareButton from "@/components/cart/ShareButton";
import AddToCartButton from "@/components/cart/AddToCartButton";

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  // 1. Await params and fetch the main product
  const { id } = await params;

  const product = await prisma.product.findUnique({
    where: { id: id },
    include: { category: true },
  });

  if (!product) {
    notFound();
  }

  // 2. Fetch "You Might Also Like" (Same category, excluding current item)
  const relatedProducts = await prisma.product.findMany({
    where: {
      categoryId: product.categoryId,
      id: { not: id },
      isSold: false,
    },
    take: 4,
    include: { category: true },
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-24 min-h-screen">
      {/* Navigation Back */}
      <Link
        href={`/shop?category=${encodeURIComponent(product.category.name)}`}
        className="flex items-center gap-2 text-zinc-500 hover:text-maroon-primary transition mb-8 group w-fit"
      >
        <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
        <span className="font-medium">
          Back to {product.category.name} Collection
        </span>
      </Link>

      {/* Main Product Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
        {/* Left: Product Image */}
        <div className="aspect-3/4 bg-zinc-100 rounded-3xl overflow-hidden border border-zinc-200 shadow-inner">
          <img
            src={
              product.images[0] ||
              "https://placehold.co/600x800/png?text=No+Image"
            }
            alt={product.name}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Right: Product Details */}
        <div className="flex flex-col gap-8">
          <div className="space-y-4">
            <div className="flex justify-between items-start">
              <span className="bg-thrift-gold/20 text-maroon-primary px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">
                {product.category.name}
              </span>
              {/* Share Feature */}
              <ShareButton />
            </div>

            <h1 className="text-5xl font-serif font-bold text-zinc-900 leading-tight uppercase tracking-tighter">
              {product.name}
            </h1>
            <p className="text-3xl font-black text-maroon-primary italic tracking-tighter">
              KES {product.price.toLocaleString()}
            </p>
          </div>

          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="bg-zinc-50 border border-zinc-200 px-6 py-3 rounded-2xl">
                <p className="text-[10px] text-zinc-400 uppercase font-bold tracking-widest">
                  Size
                </p>
                <p className="text-lg font-black text-zinc-800">
                  {product.size}
                </p>
              </div>
            </div>

            <div className="prose prose-zinc italic text-zinc-600 border-l-4 border-thrift-gold pl-6 py-2 leading-relaxed">
              {product.description ||
                "No description provided for this unique piece."}
            </div>
          </div>

          {/* Client-side Interaction Button */}
          <AddToCartButton
            product={{
              id: product.id,
              name: product.name,
              price: product.price,
              image: product.images[0],
              size: product.size,
              isSold: product.isSold,
            }}
          />

          <p className="text-center text-[10px] text-zinc-400 uppercase tracking-widest font-bold">
            Unique item • One piece available
          </p>
        </div>
      </div>

      {/* Related Products Section */}
      {relatedProducts.length > 0 && (
        <div className="mt-32 border-t border-zinc-100 pt-16">
          <div className="flex items-end justify-between mb-10">
            <div>
              <span className="text-maroon-primary font-bold text-xs uppercase tracking-[0.2em]">
                Recommendations
              </span>
              <h2 className="text-3xl font-serif font-bold text-zinc-900 mt-2">
                You Might Also Like
              </h2>
            </div>
            <Link
              href="/shop"
              className="text-sm font-bold border-b-2 border-thrift-gold pb-1 hover:text-maroon-primary transition"
            >
              View All
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {relatedProducts.map((item) => (
              <ProductCard
                key={item.id}
                id={item.id}
                name={item.name}
                price={item.price}
                size={item.size}
                image={item.images[0]}
                categoryName={item.category.name}
                isSold={item.isSold}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
