import { NextRequest, NextResponse } from "next/server";
import prisma from "../../../../../lib/prisma";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }, // Note: Next.js 15+ params are Promises
) {
  try {
    const { id } = await params;

    const product = await prisma.product.findUnique({
      where: { id: id },
      select: {
        videoUrl: true,
      },
    });

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json(product);
  } catch (error) {
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }
}
