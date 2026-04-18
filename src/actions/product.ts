//actions.ts

"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import prisma from "../../lib/prisma";

/**
 * CREATE PRODUCT
 */
export async function createProduct(formData: FormData) {
  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  const categoryId = formData.get("category") as string; // Likely an ID like "cm..."
  const size = formData.get("size") as string;
  const imageUrl = formData.get("imageUrl") as string;
  const rawPrice = formData.get("price");

  // 1. Better price parsing (handles "KES 1000" or "1,000")
  const price = parseInt((rawPrice as string).replace(/[^0-9]/g, ""), 10);
  if (isNaN(price)) throw new Error("Price must be a valid number");

  if (!categoryId) throw new Error("Category is required");

  try {
    await prisma.product.create({
      data: {
        name,
        description,
        price,
        size,
        // Ensure this matches your schema (is it 'images' or 'imageUrl'?)
        images: imageUrl ? [imageUrl] : [],
        isSold: false,
        category: {
          connectOrCreate: {
            where: { id: categoryId },
            create: { name: categoryId }, // Fallback if ID isn't found
          },
        },
      },
    });
  } catch (error) {
    console.error("Database Error Detail:", error);
    throw new Error("Failed to create product.");
  }

  revalidatePath("/");
  revalidatePath("/admin/inventory");
  redirect("/admin/inventory");
}
/**
 * UPDATE PRODUCT (For the Modal)
 */
export async function updateProduct(id: string, formData: FormData) {
  // Use "as string" or a fallback to ensure it's never null
  const name = (formData.get("name") as string) || "";
  const description = formData.get("description") as string; // description is likely optional in schema
  const size = formData.get("size") as string;
  const categoryId = formData.get("categoryId") as string;
  const rawPrice = formData.get("price");

  const price = parseInt(rawPrice as string, 10);

  try {
    await prisma.product.update({
      where: { id },
      data: {
        name: name, // Guaranteed string now
        // For optional fields in Prisma, use 'undefined' instead of 'null'
        // if you don't want to overwrite them with nothing.
        description: description || undefined,
        price: isNaN(price) ? undefined : price,
        size: size || undefined,
        category: {
          connect: { id: categoryId.toLowerCase() },
        },
      },
    });

    revalidatePath("/admin/inventory");
  } catch (error) {
    console.error("Update Error:", error);
    throw new Error("Failed to update product.");
  }
}

/**
 * DELETE PRODUCT
 */
export async function deleteProduct(id: string) {
  try {
    await prisma.product.delete({
      where: { id },
    });

    revalidatePath("/admin/inventory");
  } catch (error) {
    console.error("Delete Error:", error);
    throw new Error("Failed to delete product.");
  }
}

export async function searchAdminItems(searchTerm: string) {
  if (!searchTerm || searchTerm.length < 2) return { products: [], orders: [] };

  const [products, orders] = await Promise.all([
    // Search Products
    prisma.product.findMany({
      where: {
        OR: [
          { name: { contains: searchTerm, mode: "insensitive" } },
          { category: { name: { contains: searchTerm, mode: "insensitive" } } },
        ],
      },
      include: { category: true },
      take: 3,
    }),
    // Search Orders
    prisma.order.findMany({
      where: {
        OR: [
          { customerName: { contains: searchTerm, mode: "insensitive" } },
          { mpesaCode: { contains: searchTerm, mode: "insensitive" } },
          { customerPhone: { contains: searchTerm, mode: "insensitive" } },
        ],
      },
      take: 3,
      orderBy: { createdAt: "desc" },
    }),
  ]);

  return { products, orders };
}

export async function searchProducts(query: string) {
  if (!query || query.length < 3) return { products: [] };

  try {
    const products = await prisma.product.findMany({
      where: {
        isSold: false, // Strict filter for the public navbar
        OR: [
          { name: { contains: query, mode: "insensitive" } },
          { description: { contains: query, mode: "insensitive" } },
          { category: { name: { contains: query, mode: "insensitive" } } },
        ],
      },
      select: {
        id: true,
        name: true,
        price: true,
        images: true,
        // Only select what the Navbar actually needs to keep it fast
      },
      take: 6, // Limit results for the dropdown
    });

    return { products };
  } catch (error) {
    console.error("Search Error:", error);
    return { products: [] };
  }
}
