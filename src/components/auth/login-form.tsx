// "use client";

// import { useState } from "react";
// import { authClient } from "@/lib/auth-client";
// import { useRouter } from "next/navigation";
// import Link from "next/link"; // Import Link
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Eye, EyeOff, Loader2 } from "lucide-react";

// export function LoginForm() {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [showPassword, setShowPassword] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const router = useRouter();

//   const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault();
//     setLoading(true);

//     const { error } = await authClient.signIn.email({
//       email,
//       password,
//       callbackURL: "/",
//     });

//     setLoading(false);

//     if (error) {
//       alert("Invalid credentials. Please try again.");
//     } else {
//       router.refresh();
//       router.push("/");
//     }
//   };

//   return (
//     <Card className="w-full max-w-md mx-auto shadow-lg border-zinc-100">
//       <CardHeader>
//         <CardTitle className="text-2xl font-serif">Login</CardTitle>
//       </CardHeader>
//       <CardContent>
//         <form onSubmit={handleLogin} className="space-y-4">
//           <div className="space-y-2">
//             <label className="text-sm font-medium text-zinc-600">Email</label>
//             <Input
//               type="email"
//               placeholder="you@example.com"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               required
//             />
//           </div>

//           <div className="space-y-2">
//             <div className="flex items-center justify-between">
//               <label className="text-sm font-medium text-zinc-600">
//                 Password
//               </label>
//               {/* Forgot Password Link */}
//               <Link
//                 href="/forgot-password"
//                 className="text-xs text-maroon-primary hover:underline font-medium"
//               >
//                 Forgot password?
//               </Link>
//             </div>
//             <div className="relative">
//               <Input
//                 type={showPassword ? "text" : "password"}
//                 placeholder="••••••••"
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//                 required
//                 className="pr-10"
//               />
//               <button
//                 type="button"
//                 onClick={() => setShowPassword(!showPassword)}
//                 className="absolute right-3 top-2.5 text-zinc-400 hover:text-zinc-600 transition-colors"
//                 aria-label={showPassword ? "Hide password" : "Show password"}
//               >
//                 {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
//               </button>
//             </div>
//           </div>

//           <Button type="submit" className="w-full mt-2" disabled={loading}>
//             {loading ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : null}
//             {loading ? "Signing in..." : "Login"}
//           </Button>
//         </form>
//       </CardContent>
//     </Card>
//   );
// }

"use client";

import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff, Loader2, Mail, Lock } from "lucide-react";

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await authClient.signIn.email({
      email,
      password,
      callbackURL: "/",
    });

    setLoading(false);

    if (error) {
      alert("Invalid credentials. Please try again.");
    } else {
      router.refresh();
      router.push("/");
    }
  };

  return (
    <div className="w-full max-w-100 mx-auto p-8 bg-white shadow-2xl rounded-sm">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-slate-900 tracking-tight">
          Welcome back
        </h2>
        <p className="text-slate-500 mt-2 text-sm">
          Sign in to your account to continue
        </p>
      </div>

      <form onSubmit={handleLogin} className="space-y-6">
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
            Email Address
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              type="email"
              placeholder="lyverathrift@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="pl-10 bg-slate-50 border-slate-200 focus:bg-white transition-colors h-11"
            />
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Password
            </label>
          </div>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              type={showPassword ? "text" : "password"}
              placeholder="••••••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="pl-10 pr-10 bg-slate-50 border-slate-200 focus:bg-white transition-colors h-11"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        <Button
          type="submit"
          disabled={loading}
          className="w-full h-12 bg-maroon-primary cursor-pointer hover:bg-maroon-dark text-white font-bold rounded-sm text-base transition-transform active:scale-[0.99]"
        >
          {loading ? (
            <Loader2 className="animate-spin mr-2 h-5 w-5" />
          ) : (
            "Sign in to your account"
          )}
        </Button>

        <div className=" space-y-2 pt-2">
          <Link
            href="/forgot-password"
            className="text-sm text-maroon-primary hover:text-maroon-dark font-bold"
          >
            Forgot password?
          </Link>
          <p className="text-sm text-slate-600">
            Don&apos;t have an account?{" "}
            <Link
              href="/signup"
              className="text-maroon-primary font-bold hover:underline"
            >
              Create one now
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
}
