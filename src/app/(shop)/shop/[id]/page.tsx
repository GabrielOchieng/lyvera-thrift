import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, MessageCircle } from "lucide-react";
import ProductCard from "@/components/ProductCard";
import prisma from "../../../../../lib/prisma";
import ShareButton from "@/components/cart/ShareButton";
import AddToCartButton from "@/components/cart/AddToCartButton";
import WhatsAppShare from "@/components/WhatsAppShare";
import DynamicMedia from "@/components/ai/DynamicMedia";
import { safeDbQuery } from "@/lib/db-utils";

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const product = await safeDbQuery(() =>
    prisma.product.findUnique({
      where: { id: id },
      include: { category: true },
    }),
  );

  if (!product) {
    notFound();
  }

  // WhatsApp Order Logic
  const whatsappNumber = "254745046468";
  const whatsappOrderLink = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
    `Hi Lyvera! I want to order this piece:\n\nItem: ${product.name}\nPrice: KES ${product.price}\nLink: ${process.env.NEXT_PUBLIC_APP_URL || ""}/shop/${product.id}`,
  )}`;

  const relatedProducts =
    (await safeDbQuery(() =>
      prisma.product.findMany({
        where: {
          categoryId: product?.categoryId,
          id: { not: id },
          isSold: false,
        },
        take: 4,
        include: { category: true },
      }),
    )) || [];

  return (
    <div className="max-w-7xl mx-auto px-4 py-20 min-h-screen">
      {/* Navigation Back */}
      <Link
        href={`/shop?category=${encodeURIComponent(product.category.name)}`}
        className="flex items-center gap-2 text-zinc-500 hover:text-maroon-primary transition mb-4 group w-fit"
      >
        <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
        <span className="font-medium">
          Back to {product.category.name} Collection
        </span>
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-12 items-start">
        {/* --- LEFT: DYNAMIC MEDIA SECTION --- */}
        {/* This handles the static image + AI Video Generation logic */}
        {/* <DynamicMedia product={JSON.parse(JSON.stringify(product))} /> */}
        <DynamicMedia
          product={{
            images: product.images,
            name: product.name,
            videoUrl: product.videoUrl,
          }}
        />

        {/* Right: Product Details */}
        <div className="flex flex-col gap-8">
          <div className="space-y-4">
            <div className="flex flex-col md:flex-row gap-2 justify-between items-start">
              <span className="bg-thrift-gold/20 text-maroon-primary px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">
                {product.category.name}
              </span>
              <div className="flex gap-4">
                <WhatsAppShare
                  productName={product.name}
                  productId={product.id}
                />
                <ShareButton />
              </div>
            </div>

            <h1 className="text-xl md:text-2xl font-serif font-bold text-zinc-900 leading-tight uppercase tracking-tighter">
              {product.name}
            </h1>
            <p className="text-xl font-black text-maroon-primary italic tracking-tighter">
              KES {product.price.toLocaleString()}
            </p>
          </div>

          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="bg-zinc-50 border border-zinc-200 px-6 py-3 rounded-2xl">
                <p className="text-[10px] text-zinc-400 uppercase font-bold tracking-widest">
                  Size
                </p>
                <p className="text-md font-black text-zinc-800">
                  {product.size}
                </p>
              </div>
            </div>

            <div className="prose prose-zinc italic text-zinc-600 border-l-4 border-thrift-gold pl-6 py-2 leading-relaxed">
              {product.description ||
                "No description provided for this unique piece."}
            </div>
          </div>

          <div className="flex flex-col md:flex-row  gap-3">
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

            {!product.isSold && (
              <a
                href={whatsappOrderLink}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-[#25D366] text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-[#128C7E] transition-all shadow-lg hover:shadow-green-200"
              >
                <MessageCircle className="w-5 h-5" />
                BUY VIA WHATSAPP
              </a>
            )}
          </div>

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
              <h2 className="text-2xl font-serif font-bold text-zinc-900 mt-2">
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
