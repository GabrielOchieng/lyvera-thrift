"use client";
import { useState, useRef, useEffect } from "react";
import {
  Send,
  Sparkles,
  X,
  MessageCircle,
  RotateCcw,
  ArrowRight,
} from "lucide-react";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  products?: any[];
}

export default function AIStylist() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const welcomeMessage: ChatMessage = {
    role: "assistant",
    content:
      "Welcome to Lyvera! 💃 I'm your personal stylist. Tell me what you're shopping for today (e.g., 'A classy brunch outfit').",
  };

  const [messages, setMessages] = useState<ChatMessage[]>([]);

  // Load history from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("lyvera_chat");
    if (saved) {
      setMessages(JSON.parse(saved));
    } else {
      setMessages([welcomeMessage]);
    }
  }, []);

  // Save history to localStorage
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem("lyvera_chat", JSON.stringify(messages));
    }
  }, [messages]);

  // Auto-scroll logic
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading, isOpen]);

  const handleReset = () => {
    if (confirm("Clear our style conversation?")) {
      setMessages([welcomeMessage]);
      localStorage.removeItem("lyvera_chat");
    }
  };

  const sendMessage = async (overrideInput?: string) => {
    const textToSend = overrideInput || input;
    if (!textToSend.trim() || isLoading) return;

    // Fixed: Explicit type for userMsg
    const userMsg: ChatMessage = { role: "user", content: textToSend };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/stylist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: textToSend,
          history: messages.slice(-4),
        }),
      });

      const data = await res.json();

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant" as const,
          content: data.reply,
          products: data.products,
        },
      ]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant" as const,
          content: "I hit a snag while looking through the racks. Try again?",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-24 right-6 p-4 rounded-full shadow-2xl transition-all duration-300 z-50 ${
          isOpen ? "bg-zinc-900" : "bg-maroon-primary hover:scale-105"
        }`}
      >
        {isOpen ? (
          <X className="text-white" size={24} />
        ) : (
          <MessageCircle className="text-white" size={24} />
        )}
      </button>

      {isOpen && (
        <div className="fixed bottom-1 right-6 w-[90vw] md:w-100 h-128 bg-white shadow-2xl rounded-3xl overflow-hidden border border-zinc-200 flex flex-col z-50">
          {/* <div className="bg-zinc-900 text-white p-4 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Sparkles size={16} className="text-thrift-gold" />
              <span className="text-xs font-bold tracking-widest uppercase">
                Lyvera Stylist
              </span>
            </div>
            <button
              onClick={handleReset}
              className="text-zinc-400 hover:text-white transition-colors"
            >
              <RotateCcw size={14} />
            </button>
          </div> */}

          {/* --- Header --- */}
          <div className="bg-zinc-900 text-white p-4 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Sparkles size={16} className="text-thrift-gold" />
              <span className="text-xs font-bold tracking-widest uppercase">
                Lyvera Stylist
              </span>
            </div>
            <div className="flex items-center gap-3">
              {" "}
              {/* Added a wrapper div for buttons */}
              <button
                onClick={handleReset}
                className="text-zinc-400 hover:text-white transition-colors"
                title="Reset Chat"
              >
                <RotateCcw size={14} />
              </button>
              {/* --- ADD THIS CLOSE BUTTON --- */}
              <button
                onClick={() => setIsOpen(false)}
                className="text-zinc-400 hover:text-white transition-colors"
                title="Close Chat"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          <div
            ref={scrollRef}
            className="flex-1 overflow-y-auto p-4 space-y-4 bg-zinc-50 scroll-smooth"
          >
            {messages.map((m, i) => (
              <div
                key={i}
                className={`flex flex-col ${m.role === "user" ? "items-end" : "items-start"}`}
              >
                <div
                  className={`max-w-[85%] p-3 text-sm shadow-sm ${
                    m.role === "user"
                      ? "bg-maroon-primary text-white rounded-2xl rounded-tr-none"
                      : "bg-white border border-zinc-200 text-zinc-800 rounded-2xl rounded-tl-none"
                  }`}
                >
                  {m.content}
                </div>

                {m.products && m.products.length > 0 && (
                  <div className="grid grid-cols-2 gap-2 mt-3 w-full max-w-75">
                    {m.products.map((p) => (
                      <a
                        href={`/shop/${p.id}`}
                        key={p.id}
                        className="bg-white border rounded-xl overflow-hidden hover:border-maroon-primary transition"
                      >
                        <img
                          src={p.images?.[0]}
                          alt={p.name}
                          className="h-24 w-full object-cover"
                        />
                        <div className="p-2">
                          <p className="text-[10px] font-bold truncate">
                            {p.name}
                          </p>
                          <p className="text-[10px] text-maroon-primary font-bold">
                            KES {p.price}
                          </p>
                        </div>
                      </a>
                    ))}
                  </div>
                )}
              </div>
            ))}
            {isLoading && (
              <div className="text-xs text-zinc-400 italic">
                Finding your vibe...
              </div>
            )}
          </div>

          <div className="p-4 bg-white border-t">
            <div className="flex items-center gap-2 bg-zinc-100 rounded-full px-4 py-1">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                placeholder="Style me for..."
                className="flex-1 bg-transparent py-2 text-sm focus:outline-none"
              />
              <button
                onClick={() => sendMessage()}
                disabled={isLoading}
                className="text-maroon-primary disabled:text-zinc-300"
              >
                <ArrowRight size={20} />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
