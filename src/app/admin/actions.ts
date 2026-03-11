//actions.ts

"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import prisma from "../../../lib/prisma";

/**
 * CREATE PRODUCT
 */
export async function createProduct(formData: FormData) {
  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  const categoryId = formData.get("category") as string;
  const size = formData.get("size") as string;
  const imageUrl = formData.get("imageUrl") as string;
  const rawPrice = formData.get("price");

  const price = parseInt(rawPrice as string, 10);
  if (isNaN(price)) throw new Error("Price must be a valid number");

  try {
    await prisma.product.create({
      data: {
        name,
        description,
        price,
        size,
        images: imageUrl ? [imageUrl] : [],
        isSold: false,
        // Use the relation field name instead of the ID field
        category: {
          connect: { id: categoryId.toLowerCase() },
        },
      },
    });
  } catch (error) {
    console.error("Database Error:", error);
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
