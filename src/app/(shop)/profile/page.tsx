"use client";

import { useSession } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import {
  User,
  Mail,
  ShieldCheck,
  Calendar,
  Loader2,
  ShoppingBag,
  Settings,
} from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";

export default function ProfilePage() {
  const { data: session, isPending } = useSession();
  const router = useRouter();

  // Redirect if not logged in after loading
  useEffect(() => {
    if (!isPending && !session) {
      router.push("/login");
    }
  }, [session, isPending, router]);

  if (isPending) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-50">
        <Loader2 className="h-10 w-10 animate-spin text-maroon-primary" />
      </div>
    );
  }

  if (!session) return null;

  const user = session.user;

  return (
    <div className="min-h-screen bg-zinc-50 pt-24 pb-12 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Profile Header Card */}
        <div className="bg-white rounded-sm shadow-sm border border-zinc-200 overflow-hidden">
          <div className="h-32 bg-maroon-primary relative">
            <div className="absolute -bottom-12 left-8">
              <div className="h-24 w-24 rounded-full bg-thrift-gold border-4 border-white flex items-center justify-center text-maroon-primary text-3xl font-black">
                {user.name?.[0].toUpperCase()}
              </div>
            </div>
          </div>

          <div className="pt-16 pb-8 px-8">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-2xl font-serif font-bold text-zinc-900">
                  {user.name}
                </h1>
                <p className="text-zinc-500 text-sm flex items-center gap-1 mt-1">
                  <Mail className="h-3 w-3" /> {user.email}
                </p>
              </div>
              <div className="flex flex-col items-end gap-2">
                <span
                  className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                    user.role === "admin"
                      ? "bg-maroon-primary text-thrift-gold"
                      : "bg-zinc-100 text-zinc-600"
                  }`}
                >
                  {user.role}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          {/* Account Info */}
          <div className="bg-white p-6 rounded-sm border border-zinc-200 shadow-sm">
            <h3 className="text-sm font-bold uppercase tracking-widest text-zinc-400 mb-4">
              Account Details
            </h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-zinc-50 rounded-sm">
                  <User className="h-4 w-4 text-maroon-primary" />
                </div>
                <div>
                  <p className="text-[10px] text-zinc-400 uppercase font-bold">
                    Full Name
                  </p>
                  <p className="text-sm font-medium">{user.name}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="p-2 bg-zinc-50 rounded-sm">
                  <ShieldCheck className="h-4 w-4 text-maroon-primary" />
                </div>
                <div>
                  <p className="text-[10px] text-zinc-400 uppercase font-bold">
                    Account Status
                  </p>
                  <p className="text-sm font-medium">Verified Account</p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white p-6 rounded-sm border border-zinc-200 shadow-sm">
            <h3 className="text-sm font-bold uppercase tracking-widest text-zinc-400 mb-4">
              Quick Links
            </h3>
            <div className="grid grid-cols-1 gap-3">
              <Link
                href="/orders"
                className="flex items-center justify-between p-3 bg-zinc-50 hover:bg-thrift-gold/10 transition group rounded-sm"
              >
                <div className="flex items-center gap-3">
                  <ShoppingBag className="h-4 w-4 text-maroon-primary" />
                  <span className="text-sm font-medium">Order History</span>
                </div>
                <span className="text-xs text-zinc-400 group-hover:text-maroon-primary">
                  →
                </span>
              </Link>

              {user.role === "admin" && (
                <Link
                  href="/admin"
                  className="flex items-center justify-between p-3 bg-maroon-primary/5 hover:bg-maroon-primary/10 transition group rounded-sm border border-maroon-primary/10"
                >
                  <div className="flex items-center gap-3">
                    <Settings className="h-4 w-4 text-maroon-primary" />
                    <span className="text-sm font-bold text-maroon-primary">
                      Admin Dashboard
                    </span>
                  </div>
                  <span className="text-xs text-maroon-primary">→</span>
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="mt-12 pt-6 border-t border-zinc-200">
          <button className="text-xs font-bold text-red-600 hover:underline uppercase tracking-widest">
            Request Data Deletion
          </button>
        </div>
      </div>
    </div>
  );
}
