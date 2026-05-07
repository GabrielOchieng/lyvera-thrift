import prisma from "../../lib/prisma";

export async function getTrendingTags() {
  // Option A: Get categories with the most items
  const categories = await prisma.category.findMany({
    take: 4,
    orderBy: {
      products: { _count: "desc" },
    },
    select: { name: true, slug: true },
  });

  return categories.map((c) => c.name);
}
