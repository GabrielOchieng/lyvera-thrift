export const revalidate = 0;

import ProductCard from "@/components/ProductCard";
import HeroSlider from "@/components/HeroSlider";
import prisma from "../../../lib/prisma";
import { safeDbQuery } from "@/lib/db-utils"; // Import your helper
import TrustSignals from "@/components/TrustSignals";
import NotificationBanner from "@/components/pwa/NotificationBanner";

async function getTrendingData() {
  // Pulls 4 categories with the most items
  const categories = await prisma.category.findMany({
    take: 4,
    orderBy: {
      products: { _count: "desc" },
    },
  });
  return categories.map((c) => c.name);
}

export default async function Home() {
  // Wrap the fetch in safeDbQuery to handle Neon's cold starts
  const products = await safeDbQuery(() =>
    prisma.product.findMany({
      where: {
        isSold: false,
      },
      include: {
        category: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    }),
  );

  console.log("products", products);

  const trending = await getTrendingData();

  return (
    <main>
      <HeroSlider />
      <NotificationBanner />
      {/* <TrustSignals trendingTags={trending} /> */}

      <section className="px-6 py-8 max-w-7xl mx-auto">
        <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="max-w-xl">
            <div className="flex items-center gap-2 mb-2">
              <h2 className="text-3xl font-black uppercase tracking-tighter text-zinc-900">
                LYVERA PICKS
              </h2>
              {/* Active Pulse Icon */}
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-maroon-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-maroon-primary"></span>
              </span>
            </div>
            <p className="text-zinc-500 font-medium leading-relaxed ">
              Hand-selected treasures, salvaged for the modern stylist. Once
              they're gone, they're gone for good.
            </p>
          </div>

          <div className="h-px flex-1 bg-zinc-100 hidden md:block mb-2 mx-10" />

          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-maroon-primary bg-maroon-primary/10 px-4 py-2 rounded-full">
            {products.length} Items In Stock
          </span>
        </div>

        {/* The Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-12">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              id={product.id}
              name={product.name}
              price={product.price}
              size={product.size}
              categoryName={product.category.name}
              image={product.images[0]}
              videoUrl={product.videoUrl}
              isSold={product.isSold}
            />
          ))}
        </div>

        {/* Empty State */}
        {products.length === 0 && (
          <div className="text-center py-16 md:py-32 border-2 border-dashed border-zinc-200 rounded-[1rem]">
            <p className="text-zinc-400 italic font-serif text-lg">
              Our racks are empty... for now.
            </p>
          </div>
        )}
      </section>
    </main>
  );
}
