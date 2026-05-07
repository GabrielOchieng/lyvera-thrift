// src/lib/trending.ts

import prisma from "../../lib/prisma";

export async function getTrendingTags() {
  const categories = await prisma.category.findMany({
    take: 4,
    orderBy: {
      products: { _count: "desc" },
    },
    // Remove 'slug: true' since it's not in your schema
    select: { name: true },
  });

  return categories.map((c) => c.name);
}
