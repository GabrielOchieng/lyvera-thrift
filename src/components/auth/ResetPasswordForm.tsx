"use client";

import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { useRouter, useSearchParams } from "next/navigation"; // 1. Added useSearchParams
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye, EyeOff, Loader2 } from "lucide-react";

export function ResetPasswordForm() {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams(); // 2. Initialize searchParams
  const token = searchParams.get("token"); // 3. Get the token from the URL

  const handleReset = async (e: React.BaseSyntheticEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // 4. Validate token presence before making the request
    if (!token) {
      setError("Reset token is missing or invalid.");
      setLoading(false);
      return;
    }

    const { error: resetError } = await authClient.resetPassword({
      newPassword: password,
      token: token, // 5. Pass the token here
    });

    setLoading(false);

    if (resetError) {
      setError(resetError.message || "Failed to reset password.");
    } else {
      // Success! Redirect to login
      router.push("/login");
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto shadow-lg border-zinc-100">
      <CardHeader>
        <CardTitle className="text-2xl font-serif">Set New Password</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleReset} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="password">New Password</Label>
            <div className="relative">
              <Input
                id="password"
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

          {error && <p className="text-sm text-red-500">{error}</p>}

          <Button type="submit" className="w-full mt-2" disabled={loading}>
            {loading ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : null}
            {loading ? "Updating..." : "Reset Password"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
