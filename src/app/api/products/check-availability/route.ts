// import { NextResponse } from "next/server";
// import prisma from "../../../../../lib/prisma";

// export async function POST(req: Request) {
//   const { ids } = await req.json();
//   const soldProducts = await prisma.product.findMany({
//     where: { id: { in: ids }, isSold: true },
//     select: { id: true },
//   });

//   return NextResponse.json({ soldOutIds: soldProducts.map((p) => p.id) });
// }

import { NextResponse } from "next/server";
import prisma from "../../../../../lib/prisma";

export async function POST(req: Request) {
  try {
    const { ids, orderId } = await req.json();

    const soldProducts = await prisma.product.findMany({
      where: {
        id: { in: ids },
        isSold: true,
        // ✅ We use 'orderItems' because that's the field name in your Product model
        NOT: {
          orderItems: {
            some: {
              order: {
                id: orderId || "none",
              },
            },
          },
        },
      },
      select: { id: true },
    });

    return NextResponse.json({ soldOutIds: soldProducts.map((p) => p.id) });
  } catch (error) {
    console.error("Availability check error:", error);
    return NextResponse.json({ soldOutIds: [] }, { status: 500 });
  }
}
