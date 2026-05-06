// "use client";
// import { useState, useRef, useEffect } from "react";
// import {
//   Send,
//   Sparkles,
//   X,
//   MessageCircle,
//   RotateCcw,
//   ArrowRight,
// } from "lucide-react";

// interface ChatMessage {
//   role: "user" | "assistant";
//   content: string;
//   products?: any[];
// }

// export default function AIStylist() {
//   const [isOpen, setIsOpen] = useState(false);
//   const [input, setInput] = useState("");
//   const [isLoading, setIsLoading] = useState(false);
//   const scrollRef = useRef<HTMLDivElement>(null);

//   const welcomeMessage: ChatMessage = {
//     role: "assistant",
//     content:
//       "Welcome to Lyvera! 💃 I'm your personal stylist. Tell me what you're shopping for today (e.g., 'A classy brunch outfit').",
//   };

//   const [messages, setMessages] = useState<ChatMessage[]>([]);

//   // Load history from localStorage
//   useEffect(() => {
//     const saved = localStorage.getItem("lyvera_chat");
//     if (saved) {
//       setMessages(JSON.parse(saved));
//     } else {
//       setMessages([welcomeMessage]);
//     }
//   }, []);

//   // Save history to localStorage
//   useEffect(() => {
//     if (messages.length > 0) {
//       localStorage.setItem("lyvera_chat", JSON.stringify(messages));
//     }
//   }, [messages]);

//   // Auto-scroll logic
//   useEffect(() => {
//     if (scrollRef.current) {
//       scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
//     }
//   }, [messages, isLoading, isOpen]);

//   const handleReset = () => {
//     if (confirm("Clear our style conversation?")) {
//       setMessages([welcomeMessage]);
//       localStorage.removeItem("lyvera_chat");
//     }
//   };

//   const sendMessage = async (overrideInput?: string) => {
//     const textToSend = overrideInput || input;
//     if (!textToSend.trim() || isLoading) return;

//     // Fixed: Explicit type for userMsg
//     const userMsg: ChatMessage = { role: "user", content: textToSend };
//     setMessages((prev) => [...prev, userMsg]);
//     setInput("");
//     setIsLoading(true);

//     try {
//       const res = await fetch("/api/stylist", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           message: textToSend,
//           history: messages.slice(-4),
//         }),
//       });

//       const data = await res.json();

//       setMessages((prev) => [
//         ...prev,
//         {
//           role: "assistant" as const,
//           content: data.reply,
//           products: data.products,
//         },
//       ]);
//     } catch (error) {
//       setMessages((prev) => [
//         ...prev,
//         {
//           role: "assistant" as const,
//           content: "I hit a snag while looking through the racks. Try again?",
//         },
//       ]);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <>
//       <button
//         onClick={() => setIsOpen(!isOpen)}
//         className={`fixed bottom-24 right-6 p-4 rounded-full shadow-2xl transition-all duration-300 z-50 ${
//           isOpen ? "bg-zinc-900" : "bg-maroon-primary hover:scale-105"
//         }`}
//       >
//         {isOpen ? (
//           <X className="text-white" size={24} />
//         ) : (
//           <MessageCircle className="text-white" size={24} />
//         )}
//       </button>

//       {isOpen && (
//         <div className="fixed bottom-1 right-6 w-[90vw] md:w-100 h-128 bg-white shadow-2xl rounded-3xl overflow-hidden border border-zinc-200 flex flex-col z-50">
//           {/* --- Header --- */}
//           <div className="bg-zinc-900 text-white p-4 flex justify-between items-center">
//             <div className="flex items-center gap-2">
//               <Sparkles size={16} className="text-thrift-gold" />
//               <span className="text-xs font-bold tracking-widest uppercase">
//                 Lyvera Stylist
//               </span>
//             </div>
//             <div className="flex items-center gap-3">
//               {" "}
//               {/* Added a wrapper div for buttons */}
//               <button
//                 onClick={handleReset}
//                 className="text-zinc-400 hover:text-white transition-colors"
//                 title="Reset Chat"
//               >
//                 <RotateCcw size={14} />
//               </button>
//               {/* --- ADD THIS CLOSE BUTTON --- */}
//               <button
//                 onClick={() => setIsOpen(false)}
//                 className="text-zinc-400 hover:text-white transition-colors"
//                 title="Close Chat"
//               >
//                 <X size={18} />
//               </button>
//             </div>
//           </div>

//           <div
//             ref={scrollRef}
//             className="flex-1 overflow-y-auto p-4 space-y-4 bg-zinc-50 scroll-smooth"
//           >
//             {messages.map((m, i) => (
//               <div
//                 key={i}
//                 className={`flex flex-col ${m.role === "user" ? "items-end" : "items-start"}`}
//               >
//                 <div
//                   className={`max-w-[85%] p-3 text-sm shadow-sm ${
//                     m.role === "user"
//                       ? "bg-maroon-primary text-white rounded-2xl rounded-tr-none"
//                       : "bg-white border border-zinc-200 text-zinc-800 rounded-2xl rounded-tl-none"
//                   }`}
//                 >
//                   {m.content}
//                 </div>

//                 {m.products && m.products.length > 0 && (
//                   <div className="grid grid-cols-2 gap-2 mt-3 w-full max-w-75">
//                     {m.products.map((p) => (
//                       <a
//                         href={`/shop/${p.id}`}
//                         key={p.id}
//                         className="bg-white border rounded-xl overflow-hidden hover:border-maroon-primary transition"
//                       >
//                         <img
//                           src={p.images?.[0]}
//                           alt={p.name}
//                           className="h-24 w-full object-cover"
//                         />
//                         <div className="p-2">
//                           <p className="text-[10px] font-bold truncate">
//                             {p.name}
//                           </p>
//                           <p className="text-[10px] text-maroon-primary font-bold">
//                             KES {p.price}
//                           </p>
//                         </div>
//                       </a>
//                     ))}
//                   </div>
//                 )}
//               </div>
//             ))}
//             {isLoading && (
//               <div className="text-xs text-zinc-400 italic">
//                 Finding your vibe...
//               </div>
//             )}
//           </div>

//           <div className="p-4 bg-white border-t">
//             <div className="flex items-center gap-2 bg-zinc-100 rounded-full px-4 py-1">
//               <input
//                 value={input}
//                 onChange={(e) => setInput(e.target.value)}
//                 onKeyDown={(e) => e.key === "Enter" && sendMessage()}
//                 placeholder="Style me for..."
//                 className="flex-1 bg-transparent py-2 text-sm focus:outline-none"
//               />
//               <button
//                 onClick={() => sendMessage()}
//                 disabled={isLoading}
//                 className="text-maroon-primary disabled:text-zinc-300"
//               >
//                 <ArrowRight size={20} />
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </>
//   );
// }

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
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const welcomeMessage: ChatMessage = {
    role: "assistant",
    content:
      " ✨ I'm your Lyvera Stylist. Not sure what to wear? Tell me your vibe or where you're headed (e.g., 'A trip to Naivasha' or 'Sunday Brunch').",
  };

  // VIBE SUGGESTIONS (Quick Actions)
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
    {
      label: "Dunda/Gig Look",
      icon: <Sparkles size={12} />,
      prompt:
        "Style me for a gig or an outdoor event—something trendy and comfortable.",
    },
  ];

  const [messages, setMessages] = useState<ChatMessage[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem("lyvera_chat");
    if (saved) {
      setMessages(JSON.parse(saved));
    } else {
      setMessages([welcomeMessage]);
    }
  }, []);

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
      {/* TRIGGER BUTTON */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-6 right-6 p-4 rounded-full shadow-2xl transition-all duration-300 z-50 ${
          isOpen ? "bg-zinc-900 rotate-90" : "bg-maroon-primary hover:scale-110"
        }`}
      >
        {isOpen ? (
          <X className="text-white" size={24} />
        ) : (
          <Sparkles className="text-white" size={24} />
        )}
      </button>

      {isOpen && (
        <div className="fixed bottom-1 right-6 w-[90vw] md:w-100 h-128 bg-white shadow-2xl rounded-3xl overflow-hidden border border-zinc-200 flex flex-col z-50">
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
                        className="min-w-35 bg-white border border-zinc-100 rounded-2xl overflow-hidden hover:border-maroon-primary transition group shadow-sm"
                      >
                        <div className="relative h-32 w-full overflow-hidden">
                          <img
                            src={p.images?.[0]}
                            alt={p.name}
                            className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                          <div className="absolute top-2 right-2 bg-white/90 backdrop-blur px-2 py-1 rounded-md text-[8px] font-black text-maroon-primary uppercase tracking-tighter">
                            KES {p.price}
                          </div>
                        </div>
                        <div className="p-2 bg-white">
                          <p className="text-[9px] font-bold text-zinc-800 truncate uppercase tracking-tight">
                            {p.name}
                          </p>
                          <p className="text-[8px] text-zinc-400 font-medium">
                            Click to view piece →
                          </p>
                        </div>
                      </a>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {/* QUICK ACTIONS (VIBES) */}
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
                <Sparkles size={12} /> Digging through the racks...
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
