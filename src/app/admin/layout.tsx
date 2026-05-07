// src/app/admin/layout.tsx
import AdminPanelClient from "@/components/adminpanel/AdminPanelClient";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // 1. Check session on the server
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  // 2. Redirect if not authenticated or not an admin
  if (!session) {
    redirect("/");
  }

  if (session.user.role !== "admin") {
    redirect("/");
  }

  // 3. If authorized, wrap the children in the client-side UI
  return <AdminPanelClient>{children}</AdminPanelClient>;
}
