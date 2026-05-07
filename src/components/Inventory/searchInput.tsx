"use client";
import { Search, X } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { useDebounce } from "@/hooks/useDebounce";

export default function SearchInput() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [text, setText] = useState(searchParams.get("query") || "");
  const debouncedText = useDebounce(text, 300);

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    if (debouncedText) {
      params.set("query", debouncedText);
    } else {
      params.delete("query");
    }
    router.push(`?${params.toString()}`);
  }, [debouncedText, router, searchParams]);

  return (
    <div className="relative w-full md:w-72">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-400" />
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Search inventory..."
        className="w-full pl-9 pr-8 py-2 bg-zinc-50 border border-zinc-200 rounded-full text-xs focus:ring-2 focus:ring-maroon-primary/20 outline-none transition-all"
      />
      {text && (
        <button
          onClick={() => setText("")}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600"
        >
          <X className="h-3 w-3" />
        </button>
      )}
    </div>
  );
}
