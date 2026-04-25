// "use client";

// import { useState } from "react";
// import { authClient } from "@/lib/auth-client";
// import { useRouter } from "next/navigation";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import { Eye, EyeOff, Loader2 } from "lucide-react";

// export function SignUpForm() {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [name, setName] = useState("");
//   const [showPassword, setShowPassword] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const router = useRouter();

//   // Using BaseSyntheticEvent for maximum compatibility with React 19
//   const handleSignUp = async (e: React.BaseSyntheticEvent) => {
//     e.preventDefault();
//     setLoading(true);

//     const { error } = await authClient.signUp.email({
//       email,
//       password,
//       name,
//       callbackURL: "/",
//     });

//     setLoading(false);

//     if (error) {
//       alert(error.message);
//     } else {
//       router.push("/");
//     }
//   };

//   return (
//     <Card className="w-full max-w-md mx-auto shadow-lg border-zinc-100">
//       <CardHeader>
//         <CardTitle className="text-2xl font-serif">Create an Account</CardTitle>
//         <CardDescription>
//           Enter your details to join Lyvera Store
//         </CardDescription>
//       </CardHeader>
//       <CardContent>
//         <form onSubmit={handleSignUp} className="space-y-4">
//           <div className="space-y-2">
//             <Label htmlFor="name">Full Name</Label>
//             <Input
//               id="name"
//               placeholder="Gabriel Ochieng"
//               value={name}
//               onChange={(e) => setName(e.target.value)}
//               required
//             />
//           </div>

//           <div className="space-y-2">
//             <Label htmlFor="email">Email</Label>
//             <Input
//               id="email"
//               type="email"
//               placeholder="name@example.com"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               required
//             />
//           </div>

//           <div className="space-y-2">
//             <Label htmlFor="password">Password</Label>
//             <div className="relative">
//               <Input
//                 id="password"
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
//             {loading ? "Creating Account..." : "Sign Up"}
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
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Loader2, User, Mail, Lock } from "lucide-react";

export function SignUpForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSignUp = async (e: React.BaseSyntheticEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await authClient.signUp.email({
      email,
      password,
      name,
      callbackURL: "/",
    });

    setLoading(false);

    if (error) {
      alert(error.message);
    } else {
      router.push("/");
    }
  };

  return (
    <div className="w-full max-w-100 mx-auto p-8 bg-white shadow-2xl rounded-sm">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-slate-900 tracking-tight">
          Create your account
        </h2>
        <p className="text-slate-500 mt-2 text-sm">
          Get started with Lyvera Store today
        </p>
      </div>

      <form onSubmit={handleSignUp} className="space-y-5">
        <div className="space-y-2">
          <Label
            htmlFor="name"
            className="text-xs font-bold text-slate-700 uppercase tracking-wider"
          >
            Full Name
          </Label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              id="name"
              placeholder="Gabriel Ochieng"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="pl-10 bg-slate-50 border-slate-200 h-11"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label
            htmlFor="email"
            className="text-xs font-bold text-slate-700 uppercase tracking-wider"
          >
            Email Address
          </Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              id="email"
              type="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="pl-10 bg-slate-50 border-slate-200 h-11"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label
            htmlFor="password"
            className="text-xs font-bold text-slate-700 uppercase tracking-wider"
          >
            Password
          </Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="Create a strong password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="pl-10 pr-10 bg-slate-50 border-slate-200 h-11"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-zinc-600"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        <Button
          type="submit"
          disabled={loading}
          className="w-full h-12 cursor-pointer bg-maroon-primary hover:bg-maroon-dark text-white font-bold rounded-sm mt-4 transition-transform active:scale-[0.99]"
        >
          {loading ? (
            <Loader2 className="animate-spin mr-2 h-5 w-5" />
          ) : (
            "Create your account"
          )}
        </Button>

        <p className="text-center text-sm text-slate-600 pt-4">
          Already have an account?{" "}
          <Link
            href="/login"
            className="text-maroon-primary font-bold hover:underline"
          >
            Sign in
          </Link>
        </p>
      </form>
    </div>
  );
}
