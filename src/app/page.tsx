import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import ProductCard from "@/components/ProductCard";
import prisma from "../../lib/prisma";

export default async function Home() {
  // Fetch real data from PostgreSQL
  const products = await prisma.product.findMany({
    include: {
      category: true, // This is the professional way to handle relations
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <main className="pt-10">
      <Navbar />
      <section className="px-6 py-10">
        <div className="mb-10 text-center">
          <h1 className="text-5xl font-black italic uppercase tracking-tighter mb-2">
            LYVERA PICKS
          </h1>
          <p className="text-zinc-400">Hand-picked curation by Lyvera</p>
        </div>

        {/* The Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-10">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              id={product.id}
              name={product.name}
              price={product.price}
              size={product.size}
              // Accessing the new relation:
              categoryName={product.category.name}
              image={product.images[0]}
              isSold={product.isSold}
            />
          ))}
        </div>

        {/* Empty State */}
        {products.length === 0 && (
          <div className="text-center py-20 border-2 border-dashed border-zinc-800 rounded-3xl">
            <p className="text-zinc-500 italic">
              Our racks are empty... for now.
            </p>
          </div>
        )}
      </section>
      <Footer />
    </main>
  );
}
