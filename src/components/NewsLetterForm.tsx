"use client";

import { useState } from "react";
import { Loader2, CheckCircle2 } from "lucide-react";
import { subscribeToNewsletter } from "@/actions/newsletter";

export default function NewsletterForm() {
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(formData: FormData) {
    setStatus("loading");

    try {
      const result = await subscribeToNewsletter(formData);
      if (result?.success) {
        setStatus("success");
        setMessage("You're in! Check your inbox.");
      } else {
        setStatus("error");
        setMessage(result?.error || "Subscription failed.");
      }
    } catch (err) {
      setStatus("error");
      setMessage("Something went wrong.");
    }
  }

  if (status === "success") {
    return (
      <div className="flex items-center gap-2 text-thrift-gold font-bold text-sm bg-white/5 p-3 rounded-sm border border-thrift-gold/20 animate-in fade-in zoom-in duration-300">
        <CheckCircle2 className="h-4 w-4" />
        <span>{message}</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      <form action={handleSubmit} className="flex gap-2">
        <input
          name="email"
          type="email"
          required
          placeholder="Email address"
          disabled={status === "loading"}
          className="bg-[#6b143d] border border-white/10 px-3 py-2 rounded-sm text-sm flex-1 focus:outline-none focus:border-thrift-gold transition-colors placeholder:text-white/40 disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={status === "loading"}
          className="bg-thrift-gold text-maroon-primary cursor-pointer font-bold px-5 py-2 rounded-sm text-xs uppercase hover:bg-white transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center min-w-17.5"
        >
          {status === "loading" ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            "Join"
          )}
        </button>
      </form>

      {status === "error" && (
        <p className="text-[10px] text-red-400 font-bold uppercase tracking-wider animate-in slide-in-from-top-1">
          {message}
        </p>
      )}
    </div>
  );
}
