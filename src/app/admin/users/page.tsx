"use client";

import { useEffect, useState } from "react";
import { getAllUsers, updateUserRole } from "@/actions/users";
import {
  Shield,
  User as UserIcon,
  Search,
  MoreVertical,
  Loader2,
  CheckCircle2,
  UserCog,
} from "lucide-react";
import { toast } from "sonner";

export default function UserManagement() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchUsers = async () => {
    try {
      const data = await getAllUsers();
      setUsers(data);
    } catch (error) {
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleRoleChange = async (userId: string, currentRole: string) => {
    const newRole = currentRole === "admin" ? "user" : "admin";
    try {
      await updateUserRole(userId, newRole);
      toast.success(`User updated to ${newRole}`);
      fetchUsers();
    } catch (error) {
      toast.error("Action failed");
    }
  };

  const filteredUsers = users.filter(
    (user) =>
      user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  if (loading)
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="animate-spin text-maroon-primary" />
      </div>
    );

  return (
    <div className="bg-zinc-50 min-h-screen p-4 md:p-0">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-2xl font-serif font-bold text-zinc-900">
              User Management
            </h1>
            <p className="text-sm text-zinc-500">
              Manage permissions and roles for Lyvera Thrifts
            </p>
          </div>

          <div className="relative w-full md:w-72">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-zinc-400" />
            <input
              type="text"
              placeholder="Search by name or email..."
              className="w-full pl-10 pr-4 py-2 bg-white border border-zinc-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-maroon-primary"
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* MOBILE VIEW: Card List (Hidden on Desktop) */}
        <div className="grid grid-cols-1 gap-4 md:hidden">
          {filteredUsers.map((user) => (
            <div
              key={user.id}
              className="bg-white p-4 rounded-xl border border-zinc-200 shadow-sm"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 bg-maroon-primary text-thrift-gold rounded-full flex items-center justify-center font-bold shrink-0">
                    {user.name?.[0].toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-zinc-900 truncate">
                      {user.name}
                    </p>
                    <p className="text-xs text-zinc-500 truncate">
                      {user.email}
                    </p>
                  </div>
                </div>
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-tighter shrink-0 ${
                    user.role === "admin"
                      ? "bg-maroon-primary text-thrift-gold"
                      : "bg-zinc-100 text-zinc-600"
                  }`}
                >
                  {user.role}
                </span>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-zinc-50">
                <span className="flex items-center gap-1 text-[10px] text-green-600 font-bold uppercase tracking-widest">
                  <CheckCircle2 className="h-3 w-3" /> Active
                </span>
                <button
                  onClick={() => handleRoleChange(user.id, user.role)}
                  className="flex items-center gap-2 text-xs font-bold text-maroon-primary uppercase tracking-widest px-3 py-2 bg-maroon-primary/5 rounded-lg active:bg-maroon-primary/10 transition-colors"
                >
                  <UserCog className="h-3.5 w-3.5" />
                  {user.role === "admin" ? "Demote" : "Promote"}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* DESKTOP VIEW: Table (Hidden on Mobile) */}
        <div className="hidden md:block bg-white border border-zinc-200 rounded-xl shadow-sm overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-zinc-50/50 border-b border-zinc-200">
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-zinc-400">
                  User
                </th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-zinc-400">
                  Status
                </th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-zinc-400">
                  Role
                </th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-zinc-400 text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-zinc-50/50 transition">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 bg-maroon-primary text-thrift-gold rounded-full flex items-center justify-center font-bold">
                        {user.name?.[0].toUpperCase()}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-zinc-900">
                          {user.name}
                        </p>
                        <p className="text-xs text-zinc-500">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="flex items-center gap-1 text-xs text-green-600 font-medium">
                      <CheckCircle2 className="h-3 w-3" /> Active
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-tighter ${
                        user.role === "admin"
                          ? "bg-maroon-primary text-thrift-gold"
                          : "bg-zinc-100 text-zinc-600"
                      }`}
                    >
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => handleRoleChange(user.id, user.role)}
                      className="text-xs font-bold text-maroon-primary hover:underline uppercase tracking-widest"
                    >
                      {user.role === "admin" ? "Demote" : "Promote"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredUsers.length === 0 && (
          <div className="p-12 text-center text-zinc-400 text-sm italic bg-white rounded-xl border border-dashed border-zinc-200 mt-4">
            No users found matching your search.
          </div>
        )}
      </div>
    </div>
  );
}
