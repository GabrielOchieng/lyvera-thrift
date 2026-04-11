// src/components/ForgotPasswordForm.tsx
"use client";

import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";

export function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleForgetPassword = async (e: React.BaseSyntheticEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const { error } = await authClient.requestPasswordReset({
      email,
      redirectTo: "/reset-password", // Ensure this route exists
    });

    setLoading(false);

    if (error) {
      setMessage(`Error: ${error.message}`);
    } else {
      setMessage("Check your email for the reset link!");
    }
  };

  return (
    <form onSubmit={handleForgetPassword} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">Email Address</Label>
        <Input
          id="email"
          type="email"
          placeholder="name@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? (
          <Loader2 className="animate-spin mr-2 h-4 w-4" />
        ) : (
          "Send Reset Link"
        )}
      </Button>
      {message && (
        <p
          className={`text-sm text-center mt-2 ${message.includes("Error") ? "text-red-500" : "text-green-600"}`}
        >
          {message}
        </p>
      )}
    </form>
  );
}
