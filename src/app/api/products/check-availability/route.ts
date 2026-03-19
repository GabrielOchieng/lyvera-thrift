import { NextResponse } from "next/server";
import prisma from "../../../../../lib/prisma";

export async function POST(req: Request) {
  const { ids } = await req.json();
  const soldProducts = await prisma.product.findMany({
    where: { id: { in: ids }, isSold: true },
    select: { id: true },
  });

  return NextResponse.json({ soldOutIds: soldProducts.map((p) => p.id) });
}
