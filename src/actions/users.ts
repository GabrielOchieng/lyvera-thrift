"use server";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import prisma from "../../lib/prisma";

export async function getAllUsers() {
  const session = await auth.api.getSession({ headers: await headers() });

  // Security Check: Only admins can fetch the user list
  if (!session || session.user.role !== "admin") {
    throw new Error("Unauthorized");
  }

  return await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
  });
}

export async function updateUserRole(
  userId: string,
  newRole: "admin" | "user",
) {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session || session.user.role !== "admin") {
    throw new Error("Unauthorized");
  }

  return await prisma.user.update({
    where: { id: userId },
    data: { role: newRole },
  });
}
