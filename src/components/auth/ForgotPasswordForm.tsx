// "use client";

// import { useState } from "react";
// import { authClient } from "@/lib/auth-client";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Loader2, Mail, ArrowLeft } from "lucide-react";
// import Link from "next/link";

// export function ForgotPasswordForm() {
//   const [email, setEmail] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [message, setMessage] = useState("");

//   const handleForgetPassword = async (e: React.BaseSyntheticEvent) => {
//     e.preventDefault();
//     setLoading(true);
//     setMessage("");

//     const { error } = await authClient.requestPasswordReset({
//       email,
//       redirectTo: "/reset-password",
//     });

//     setLoading(false);

//     if (error) {
//       setMessage(`Error: ${error.message}`);
//     } else {
//       setMessage("Check your email for the reset link!");
//     }
//   };

//   return (
//     <div className="w-full max-w-100 mx-auto p-8 bg-white shadow-2xl rounded-sm">
//       <div className="text-center mb-8">
//         <h2 className="text-3xl font-bold text-slate-900 tracking-tight">
//           Reset Password
//         </h2>
//         <p className="text-slate-500 mt-2 text-sm">
//           Enter your email to receive a reset link
//         </p>
//       </div>

//       <form onSubmit={handleForgetPassword} className="space-y-6">
//         <div className="space-y-2">
//           <Label
//             htmlFor="email"
//             className="text-xs font-bold text-slate-700 uppercase tracking-wider"
//           >
//             Email Address
//           </Label>
//           <div className="relative">
//             <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
//             <Input
//               id="email"
//               type="email"
//               placeholder="name@example.com"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               required
//               className="pl-10 bg-slate-50 border-slate-200 h-11"
//             />
//           </div>
//         </div>

//         <Button
//           type="submit"
//           className="w-full h-12 cursor-pointer bg-maroon-primary hover:bg-maroon-dark text-white font-bold rounded-sm transition-transform active:scale-[0.99]"
//           disabled={loading}
//         >
//           {loading ? (
//             <Loader2 className="animate-spin mr-2 h-5 w-5" />
//           ) : (
//             "Send Reset Link"
//           )}
//         </Button>

//         {message && (
//           <p
//             className={`text-sm text-center font-medium ${message.includes("Error") ? "text-red-500" : "text-green-600"}`}
//           >
//             {message}
//           </p>
//         )}

//         <div className="text-center pt-2">
//           <Link
//             href="/login"
//             className="inline-flex items-center text-sm font-bold text-slate-600 hover:text-maroon-primary transition-colors"
//           >
//             <ArrowLeft className="mr-2 h-4 w-4" />
//             Back to Login
//           </Link>
//         </div>
//       </form>
//     </div>
//   );
// }

"use client";

import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Mail, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner"; // Ensure this is imported

export function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleForgetPassword = async (e: React.BaseSyntheticEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      // Reverted to requestPasswordReset to fix the TypeScript error
      const { error } = await authClient.requestPasswordReset({
        email,
        redirectTo: "/reset-password",
      });

      if (error) {
        const errorMsg = error.message || "Failed to send reset link.";
        setMessage(`Error: ${errorMsg}`);
        toast.error(errorMsg);
      } else {
        const successMsg = "Check your email for the reset link!";
        setMessage(successMsg);
        toast.success(successMsg);
        setEmail("");
      }
    } catch (err) {
      // Handles the network refusal/server offline errors seen in your logs
      const connectionError =
        "Server unreachable. Please check your connection.";
      setMessage(`Error: ${connectionError}`);
      toast.error(connectionError);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-100 mx-auto p-8 bg-white shadow-2xl rounded-sm">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-slate-900 tracking-tight">
          Reset Password
        </h2>
        <p className="text-slate-500 mt-2 text-sm">
          Enter your email to receive a reset link
        </p>
      </div>

      <form onSubmit={handleForgetPassword} className="space-y-6">
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

        <Button
          type="submit"
          className="w-full h-12 cursor-pointer bg-maroon-primary hover:bg-maroon-dark text-white font-bold rounded-sm transition-transform active:scale-[0.99]"
          disabled={loading}
        >
          {loading ? (
            <Loader2 className="animate-spin mr-2 h-5 w-5" />
          ) : (
            "Send Reset Link"
          )}
        </Button>

        {message && (
          <p
            className={`text-sm text-center font-medium ${message.includes("Error") ? "text-red-500" : "text-green-600"}`}
          >
            {message}
          </p>
        )}

        <div className="text-center pt-2">
          <Link
            href="/login"
            className="inline-flex items-center text-sm font-bold text-slate-600 hover:text-maroon-primary transition-colors"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Login
          </Link>
        </div>
      </form>
    </div>
  );
}
