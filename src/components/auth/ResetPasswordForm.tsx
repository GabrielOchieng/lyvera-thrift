// "use client";

// import { useState } from "react";
// import { authClient } from "@/lib/auth-client";
// import { useRouter, useSearchParams } from "next/navigation"; // 1. Added useSearchParams
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Eye, EyeOff, Loader2 } from "lucide-react";

// export function ResetPasswordForm() {
//   const [password, setPassword] = useState("");
//   const [showPassword, setShowPassword] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const router = useRouter();
//   const searchParams = useSearchParams(); // 2. Initialize searchParams
//   const token = searchParams.get("token"); // 3. Get the token from the URL

//   const handleReset = async (e: React.BaseSyntheticEvent) => {
//     e.preventDefault();
//     setLoading(true);
//     setError(null);

//     // 4. Validate token presence before making the request
//     if (!token) {
//       setError("Reset token is missing or invalid.");
//       setLoading(false);
//       return;
//     }

//     const { error: resetError } = await authClient.resetPassword({
//       newPassword: password,
//       token: token, // 5. Pass the token here
//     });

//     setLoading(false);

//     if (resetError) {
//       setError(resetError.message || "Failed to reset password.");
//     } else {
//       // Success! Redirect to login
//       router.push("/login");
//     }
//   };

//   return (
//     <Card className="w-full max-w-md mx-auto shadow-lg border-zinc-100">
//       <CardHeader>
//         <CardTitle className="text-2xl font-serif">Set New Password</CardTitle>
//       </CardHeader>
//       <CardContent>
//         <form onSubmit={handleReset} className="space-y-4">
//           <div className="space-y-2">
//             <Label htmlFor="password">New Password</Label>
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

//           {error && <p className="text-sm text-red-500">{error}</p>}

//           <Button type="submit" className="w-full mt-2" disabled={loading}>
//             {loading ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : null}
//             {loading ? "Updating..." : "Reset Password"}
//           </Button>
//         </form>
//       </CardContent>
//     </Card>
//   );
// }

"use client";

import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Loader2, Lock } from "lucide-react";

export function ResetPasswordForm() {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const handleReset = async (e: React.BaseSyntheticEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!token) {
      setError("Reset token is missing or invalid.");
      setLoading(false);
      return;
    }

    const { error: resetError } = await authClient.resetPassword({
      newPassword: password,
      token: token,
    });

    setLoading(false);

    if (resetError) {
      setError(resetError.message || "Failed to reset password.");
    } else {
      router.push("/login");
    }
  };

  return (
    <div className="w-full max-w-100 mx-auto p-8 bg-white shadow-2xl rounded-sm">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-slate-900 tracking-tight">
          New Password
        </h2>
        <p className="text-slate-500 mt-2 text-sm">
          Please enter your new secure password
        </p>
      </div>

      <form onSubmit={handleReset} className="space-y-6">
        <div className="space-y-2">
          <Label
            htmlFor="password"
            className="text-xs font-bold text-slate-700 uppercase tracking-wider"
          >
            New Password
          </Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="pl-10 pr-10 bg-slate-50 border-slate-200 h-11"
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

        {error && (
          <p className="text-sm text-center font-medium text-red-500">
            {error}
          </p>
        )}

        <Button
          type="submit"
          className="w-full h-12 bg-maroon-primary hover:bg-maroon-dark text-white font-bold rounded-sm transition-transform active:scale-[0.99]"
          disabled={loading}
        >
          {loading ? (
            <Loader2 className="animate-spin mr-2 h-5 w-5" />
          ) : (
            "Reset Password"
          )}
        </Button>
      </form>
    </div>
  );
}
