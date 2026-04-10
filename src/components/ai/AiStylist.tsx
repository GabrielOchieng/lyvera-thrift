"use client";
import { useState, useRef, useEffect } from "react";
import {
  Send,
  Sparkles,
  X,
  MessageCircle,
  ShoppingBag,
  RotateCcw,
} from "lucide-react";

interface ChatMessage {
  role: string;
  content: string;
  products?: any[]; // The '?' makes it optional
}

export default function AIStylist() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const welcomeMessage = {
    role: "assistant",
    content:
      "Welcome to Lyvera! 💃 I'm your personal stylist. Tell me what you're shopping for today (e.g., 'A classy brunch outfit' or 'Something for a cool evening').",
  };

  const [messages, setMessages] = useState<ChatMessage[]>([welcomeMessage]);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll logic
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading, isOpen]);

  const handleReset = () => {
    if (confirm("Clear our style conversation?")) {
      setMessages([welcomeMessage]);
    }
  };

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg = { role: "user", content: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/stylist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input }),
      });

      const data = await res.json();
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.reply, products: data.products },
      ]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "Sorry, I hit a snag while looking through the racks. Try again?",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* --- FLOATING TOGGLE BUTTON --- */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-24 right-6 p-4 rounded-full shadow-2xl transition-all duration-500 z-50 flex items-center justify-center ${
          isOpen
            ? "bg-zinc-900 rotate-90 scale-90"
            : "bg-[#800000] hover:scale-110 active:scale-95"
        }`}
      >
        {isOpen ? (
          <X className="text-white" size={24} />
        ) : (
          <div className="relative">
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
            </span>
            <MessageCircle className="text-white" size={24} />
          </div>
        )}
      </button>

      {/* --- CHAT WINDOW --- */}
      {isOpen && (
        <div className="fixed bottom-4 2xl:bottom-24 right-6 w-85 md:w-100 bg-white shadow-[0_20px_50px_rgba(0,0,0,0.2)] rounded-3xl overflow-hidden border border-zinc-200 flex flex-col z-50 animate-in fade-in zoom-in-95 slide-in-from-bottom-10 duration-300">
          {/* Header */}
          <div className="bg-zinc-900 text-white p-5 flex justify-between items-center border-b border-[#800000]/30">
            <div className="flex items-center gap-2">
              <div className="bg-[#800000] p-1.5 rounded-lg">
                <Sparkles size={14} className="text-white fill-current" />
              </div>
              <span className="font-bold uppercase text-[10px] tracking-[0.25em]">
                Lyvera Stylist
              </span>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={handleReset}
                title="Reset Chat"
                className="text-zinc-500 hover:text-white transition-colors"
              >
                <RotateCcw size={16} />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="text-zinc-500 hover:text-white transition-colors"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {/* Chat History */}
          <div
            ref={scrollRef}
            className="h-82 2xl:h-112.5 p-4 overflow-y-auto space-y-4 bg-zinc-50/50 scroll-smooth"
          >
            {messages.map((m, i) => (
              <div
                key={i}
                className={`flex flex-col ${m.role === "user" ? "items-end" : "items-start"} animate-in fade-in slide-in-from-bottom-2 duration-500`}
              >
                <div
                  className={`max-w-[85%] text-sm p-3.5 shadow-sm ${
                    m.role === "user"
                      ? "bg-[#800000] text-white rounded-2xl rounded-tr-none"
                      : "bg-white border border-zinc-200 text-zinc-800 rounded-2xl rounded-tl-none"
                  }`}
                >
                  {m.content}
                </div>

                {/* Product Grid */}
                {m.products && m.products.length > 0 && (
                  <div className="grid grid-cols-2 gap-3 mt-4 w-full">
                    {m.products.map((p) => (
                      <a
                        href={`/shop/${p.id}`}
                        key={p.id}
                        className="group bg-white border border-zinc-200 rounded-2xl overflow-hidden hover:border-[#800000] hover:shadow-md transition-all duration-300"
                      >
                        <div className="aspect-4/5 bg-zinc-100 overflow-hidden relative">
                          <img
                            src={p.images?.[0]}
                            alt={p.name}
                            className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-500"
                          />
                          <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors" />
                        </div>
                        <div className="p-2.5">
                          <h4 className="text-[10px] font-bold truncate uppercase tracking-tight text-zinc-900">
                            {p.name}
                          </h4>
                          <p className="text-[11px] text-[#800000] font-black mt-0.5">
                            KES {p.price.toLocaleString()}
                          </p>
                        </div>
                      </a>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {/* Loading Indicator */}
            {isLoading && (
              <div className="flex flex-col items-start animate-in fade-in duration-300">
                <div className="bg-white border border-zinc-200 p-4 rounded-2xl rounded-tl-none shadow-sm">
                  <div className="flex gap-1.5">
                    <div className="w-1.5 h-1.5 bg-red-900/40 rounded-full animate-bounce" />
                    <div className="w-1.5 h-1.5 bg-red-900/60 rounded-full animate-bounce [animation-delay:0.2s]" />
                    <div className="w-1.5 h-1.5 bg-red-900/80 rounded-full animate-bounce [animation-delay:0.4s]" />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Input Area */}
          <div className="p-4 bg-white border-t border-zinc-100">
            <div className="flex items-center gap-2 bg-zinc-100 rounded-2xl px-4 py-3 focus-within:ring-2 focus-within:ring-[#800000]/20 focus-within:bg-white transition-all duration-300">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                className="flex-1 bg-transparent text-sm outline-none text-zinc-800 placeholder:text-zinc-400"
                placeholder="Find my vibe..."
              />
              <button
                onClick={sendMessage}
                disabled={isLoading}
                className="text-[#800000] hover:scale-110 disabled:text-zinc-300 transition-all"
              >
                <Send size={20} strokeWidth={2.5} />
              </button>
            </div>
            <p className="text-[9px] text-center text-zinc-400 mt-3 uppercase tracking-widest font-medium">
              Elevating Thrift with Lyvera AI
            </p>
          </div>
        </div>
      )}
    </>
  );
}
