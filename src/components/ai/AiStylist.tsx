"use client";
import { useState, useRef, useEffect } from "react";
import {
  Send,
  Sparkles,
  X,
  MessageCircle,
  RotateCcw,
  ArrowRight,
  MapPin,
  Coffee,
  PartyPopper,
  ShoppingBag,
} from "lucide-react";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  products?: any[];
}

export default function AIStylist() {
  const [isOpen, setIsOpen] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const welcomeMessage: ChatMessage = {
    role: "assistant",
    content:
      " ✨ I'm your Lyvera Stylist. Not sure what to wear? Tell me your vibe or where you're headed (e.g., 'A trip to Naivasha' or 'Sunday Brunch').",
  };

  const quickActions = [
    {
      label: "Vasha Weekend",
      icon: <MapPin size={12} />,
      prompt:
        "I need something breezy and 'rich kid' for a weekend trip to Naivasha.",
    },
    {
      label: "Kula Lunch",
      icon: <Coffee size={12} />,
      prompt:
        "Style me for a classy Sunday brunch or 'Kula Lunch' with the girls in Nairobi.",
    },
    {
      label: "Nairobi Nightlife",
      icon: <PartyPopper size={12} />,
      prompt:
        "I want a baddie look for a night out—something bold and stylish.",
    },
    {
      label: "Corporate Baddie",
      icon: <ShoppingBag size={12} />,
      prompt:
        "Show me some 'Corporate Baddie' fits—professional but still very stylish for the office.",
    },
  ];

  const [messages, setMessages] = useState<ChatMessage[]>([]);

  // Initialize Chat & Tooltip Timer
  useEffect(() => {
    const saved = localStorage.getItem("lyvera_chat");
    if (saved) {
      setMessages(JSON.parse(saved));
    } else {
      setMessages([welcomeMessage]);
    }

    // Show tooltip after 5 seconds if chat hasn't been opened
    const timer = setTimeout(() => {
      setShowTooltip(true);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  // Handle Tooltip visibility on open
  useEffect(() => {
    if (isOpen) setShowTooltip(false);
  }, [isOpen]);

  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem("lyvera_chat", JSON.stringify(messages));
    }
  }, [messages]);

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
          role: "assistant",
          content: data.reply,
          products: data.products,
        },
      ]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "I hit a snag while looking through the racks. Try again?",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* 1. AUTO-TOOLTIP */}
      {/* {!isOpen && showTooltip && (
        <div className="fixed bottom-24 right-6 bg-white px-4 py-2 rounded-2xl shadow-xl border border-zinc-100 z-50 animate-in fade-in slide-in-from-bottom-2 duration-500">
          <div className="flex items-center gap-2">
            <Sparkles size={12} className="text-maroon-primary" />
            <p className="text-[10px] font-black text-zinc-800 uppercase tracking-widest">
              Need style advice?
            </p>
          </div>
        </div>
      )} */}

      {/* 2. TRIGGER BUTTON WITH PING */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed cursor-pointer bottom-6 right-6 p-4 rounded-full shadow-2xl transition-all duration-300 z-50 ${
          isOpen ? "bg-zinc-900 rotate-90" : "bg-maroon-primary hover:scale-110"
        }`}
      >
        {!isOpen && (
          <span className="absolute -top-1 -right-1 flex h-4 w-4">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-thrift-gold opacity-75"></span>
            <span className="relative inline-flex rounded-full h-4 w-4 bg-thrift-gold border-2 border-white"></span>
          </span>
        )}
        {isOpen ? (
          <X className="text-white" size={24} />
        ) : (
          <Sparkles className="text-white" size={24} />
        )}
      </button>

      {/* 3. CHAT WINDOW */}
      {isOpen && (
        <div className="fixed bottom-1 right-6 w-[95vw] md:w-100 h-[70vh] md:h-128 bg-white shadow-2xl rounded-3xl overflow-hidden border border-zinc-200 flex flex-col z-50 animate-in zoom-in-95 slide-in-from-bottom-10 duration-300">
          {/* HEADER */}
          <div className="bg-zinc-900 text-white p-5 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="bg-maroon-primary p-1.5 rounded-lg">
                <Sparkles size={14} className="text-white" />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-black tracking-[0.2em] uppercase text-zinc-400 leading-none">
                  AI Assistant
                </span>
                <span className="text-sm text-thrift-gold font-bold font-serif italic">
                  Lyvera Stylist
                </span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={handleReset}
                className="text-zinc-400 hover:text-white transition-colors"
              >
                <RotateCcw size={16} />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="text-zinc-400 hover:text-white transition-colors"
              >
                <X size={20} />
              </button>
            </div>
          </div>

          {/* CHAT AREA */}
          <div
            ref={scrollRef}
            className="flex-1 overflow-y-auto p-4 space-y-6 bg-zinc-50/50 scroll-smooth no-scrollbar"
          >
            {messages.map((m, i) => (
              <div
                key={i}
                className={`flex flex-col ${m.role === "user" ? "items-end" : "items-start"}`}
              >
                <div
                  className={`max-w-[85%] p-4 text-sm leading-relaxed shadow-sm ${
                    m.role === "user"
                      ? "bg-maroon-primary text-white rounded-[20px] rounded-tr-none"
                      : "bg-white border border-zinc-100 text-zinc-800 rounded-[20px] rounded-tl-none"
                  }`}
                >
                  {m.content}
                </div>

                {/* PRODUCT RESULTS */}
                {m.products && m.products.length > 0 && (
                  <div className="flex gap-3 overflow-x-auto w-full py-2 no-scrollbar">
                    {m.products.map((p) => (
                      <a
                        href={`/shop/${p.id}`}
                        key={p.id}
                        className="min-w-40 bg-white border border-zinc-100 rounded-2xl overflow-hidden hover:border-maroon-primary transition group shadow-sm flex flex-col"
                      >
                        <div className="relative h-32 w-full overflow-hidden">
                          <img
                            src={p.images?.[0]}
                            alt={p.name}
                            className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                          <div className="absolute top-2 right-2 bg-white/90 backdrop-blur px-2 py-1 rounded-md text-[8px] font-black text-maroon-primary uppercase">
                            KES {p.price}
                          </div>
                        </div>
                        <div className="p-3 bg-white flex-1 flex flex-col justify-between">
                          <p className="text-[10px] font-bold text-zinc-800 truncate uppercase tracking-tight">
                            {p.name}
                          </p>
                          <button className="mt-2 w-full py-2 bg-maroon-primary text-[9px] text-white font-bold rounded-lg uppercase tracking-wider hover:bg-zinc-900 transition-colors">
                            View Piece
                          </button>
                        </div>
                      </a>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {/* QUICK ACTIONS */}
            {messages.length === 1 && !isLoading && (
              <div className="grid grid-cols-2 gap-2 pt-2">
                {quickActions.map((action) => (
                  <button
                    key={action.label}
                    onClick={() => sendMessage(action.prompt)}
                    className="flex items-center gap-2 bg-white border border-zinc-200 p-2.5 rounded-xl text-[10px] font-bold text-zinc-600 hover:border-maroon-primary hover:text-maroon-primary transition shadow-sm text-left"
                  >
                    <span className="text-maroon-primary bg-maroon-primary/5 p-1 rounded-md">
                      {action.icon}
                    </span>
                    {action.label}
                  </button>
                ))}
              </div>
            )}

            {isLoading && (
              <div className="flex items-center gap-2 text-[10px] font-bold text-zinc-400 uppercase tracking-widest animate-pulse">
                <Sparkles size={12} className="text-maroon-primary" /> Digging
                through the racks...
              </div>
            )}
          </div>

          {/* INPUT AREA */}
          <div className="p-4 bg-white border-t border-zinc-100">
            <div className="flex items-center gap-2 bg-zinc-100 rounded-2xl px-4 py-1 border border-transparent focus-within:border-maroon-primary/20 focus-within:bg-white transition-all shadow-inner">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                placeholder="Where are you headed?..."
                className="flex-1 bg-transparent py-3 text-xs font-medium focus:outline-none"
              />
              <button
                onClick={() => sendMessage()}
                disabled={isLoading || !input.trim()}
                className="w-8 h-8 flex items-center justify-center bg-maroon-primary text-white rounded-xl disabled:bg-zinc-200 disabled:text-zinc-400 transition-all shadow-lg shadow-maroon-primary/20"
              >
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
