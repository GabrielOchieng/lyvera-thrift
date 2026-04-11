// // "use client";

// // import { useState } from "react";
// // import { authClient } from "@/lib/auth-client";
// // import { useRouter } from "next/navigation";
// // import { Button } from "@/components/ui/button";
// // import { Input } from "@/components/ui/input";
// // import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// // export function LoginForm() {
// //   const [email, setEmail] = useState("");
// //   const [password, setPassword] = useState("");
// //   const router = useRouter();

// //   const handleLogin = async (e: React.FormEvent) => {
// //     e.preventDefault();
// //     const { data, error } = await authClient.signIn.email({
// //       email,
// //       password,
// //       callbackURL: "/",
// //     });

// //     if (error) {
// //       alert("Invalid credentials");
// //     } else {
// //       router.refresh(); // Refresh to update the session in the navbar
// //       router.push("/");
// //     }
// //   };

// //   return (
// //     <Card className="w-full max-w-md mx-auto">
// //       <CardHeader>
// //         <CardTitle>Login</CardTitle>
// //       </CardHeader>
// //       <CardContent>
// //         <form onSubmit={handleLogin} className="space-y-4">
// //           <Input
// //             type="email"
// //             placeholder="Email"
// //             value={email}
// //             onChange={(e) => setEmail(e.target.value)}
// //             required
// //           />
// //           <Input
// //             type="password"
// //             placeholder="Password"
// //             value={password}
// //             onChange={(e) => setPassword(e.target.value)}
// //             required
// //           />
// //           <Button type="submit" className="w-full">
// //             Login
// //           </Button>
// //         </form>
// //       </CardContent>
// //     </Card>
// //   );
// // }

// "use client";

// import { useState } from "react";
// import { authClient } from "@/lib/auth-client";
// import { useRouter } from "next/navigation";
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

//   // Using React.FormEvent<HTMLFormElement> ensures TypeScript
//   // understands that this is a form submission event.
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
//             <label className="text-sm font-medium text-zinc-600">
//               Password
//             </label>
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
import Link from "next/link"; // Import Link
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye, EyeOff, Loader2 } from "lucide-react";

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
    <Card className="w-full max-w-md mx-auto shadow-lg border-zinc-100">
      <CardHeader>
        <CardTitle className="text-2xl font-serif">Login</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-600">Email</label>
            <Input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-zinc-600">
                Password
              </label>
              {/* Forgot Password Link */}
              <Link
                href="/forgot-password"
                className="text-xs text-maroon-primary hover:underline font-medium"
              >
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2.5 text-zinc-400 hover:text-zinc-600 transition-colors"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <Button type="submit" className="w-full mt-2" disabled={loading}>
            {loading ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : null}
            {loading ? "Signing in..." : "Login"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
