// import { GoogleGenerativeAI } from "@google/generative-ai";
// import { NextResponse } from "next/server";
// import prisma from "../../../../lib/prisma";

// const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

// const SYSTEM_PROMPT = `
// You are the Lyvera AI Stylist.

// CRITICAL COMMANDS:
// 1. NEVER use pet names (darling, babe, etc.).
// 2. You operate in JSON ONLY.
// 3. If the user mentions a category (accessories, tops, etc.) or asks to "show" or "see" items, you MUST put that category name in the "searchQuery" field.
// 4. If you are showing the "full collection", set searchQuery to "all".

// JSON STRUCTURE:
// {
//   "reply": "Your fashion advice here",
//   "searchQuery": "keyword"
// }
// `;

// export async function POST(req: Request) {
//   try {
//     const { message, history } = await req.json();
//     const models = [
//       "gemini-3.1-flash-lite-preview",
//       "gemini-2.5-flash",
//       "gemini-2.0-flash",
//     ];
//     let aiData: { reply: string; searchQuery: string } | null = null;

//     // AI Generation Logic
//     const context = history
//       ?.map((h: any) => `${h.role}: ${h.content}`)
//       .join("\n");
//     for (const modelName of models) {
//       try {
//         const model = genAI.getGenerativeModel({ model: modelName });
//         const result = await model.generateContent([
//           SYSTEM_PROMPT,
//           `History:\n${context}\nUser: ${message}`,
//         ]);
//         const cleanJson = result.response
//           .text()
//           .replace(/```json|```/g, "")
//           .trim();
//         aiData = JSON.parse(cleanJson);
//         if (aiData) break;
//       } catch (err) {
//         continue;
//       }
//     }

//     if (!aiData) throw new Error("AI Failed");

//     // Safety Net Keyword Extraction
//     let finalQuery = aiData.searchQuery?.toLowerCase() || "";
//     const lowerMsg = message.toLowerCase();
//     if (!finalQuery) {
//       if (lowerMsg.includes("accessories")) finalQuery = "accessories";
//       else if (lowerMsg.includes("top")) finalQuery = "tops";
//       else if (lowerMsg.includes("dress")) finalQuery = "dresses";
//       else if (lowerMsg.includes("show") || lowerMsg.includes("see"))
//         finalQuery = "all";
//     }

//     let products: any[] = [];
//     let finalReply = aiData.reply;

//     if (finalQuery) {
//       products = await prisma.product.findMany({
//         where: {
//           isSold: false,
//           ...(finalQuery !== "all" && {
//             OR: [
//               { name: { contains: finalQuery, mode: "insensitive" } },
//               {
//                 category: {
//                   name: { contains: finalQuery, mode: "insensitive" },
//                 },
//               },
//             ],
//           }),
//         },
//         take: 6,
//       });

//       // --- NEW LOGIC: OVERRIDE IF EMPTY ---
//       if (products.length === 0 && finalQuery !== "") {
//         finalReply = `I looked through the racks for "${finalQuery}," but it looks like those pieces aren't available right now. Want to try a different category?`;
//       }
//     }

//     return NextResponse.json({ reply: finalReply, products });
//   } catch (error) {
//     return NextResponse.json({
//       reply: "I'm having trouble accessing the showroom.",
//       products: [],
//     });
//   }
// }

import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";
import prisma from "../../../../lib/prisma";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

const SYSTEM_PROMPT = `
You are the Lyvera AI Stylist, a high-end thrift expert in Nairobi. 

YOUR GOAL:
Translate the user's "vibe" or "destination" into a search keyword that matches thrift inventory.

STYLISTIC GUIDELINES:
1. Tone: Professional, chic, and helpful. 
2. NEVER use pet names (darling, babe, etc.).
3. You operate in JSON ONLY.

MAPPING VIBES TO KEYWORDS:
- "Naivasha" or "Beach" -> searchQuery: "breezy" or "summer"
- "Brunch" or "Sunday" -> searchQuery: "chic" or "dress"
- "Office" or "Work" -> searchQuery: "blazer" or "formal"
- "Night out" -> searchQuery: "bold" or "black"
- If they ask for a category (e.g., "tops"), use that category name.
- If showing everything, set searchQuery to "all".

JSON STRUCTURE:
{
  "reply": "Fashion advice reflecting the vibe",
  "searchQuery": "single-keyword-here"
}
`;

export async function POST(req: Request) {
  try {
    const { message, history } = await req.json();

    // Updated to use currently available Gemini models
    const models = [
      "gemini-3.1-flash-lite",
      "gemini-2.5-flash",
      "gemini-2.0-flash",
    ];

    // const models = [
    //   "gemini-1.5-flash", // Fast & most reliable for JSON
    //   "gemini-1.5-flash-8b", // Even faster, great for simple tasks
    //   "gemini-1.5-pro", // Smartest, but slowest (use as last resort)
    // ];
    let aiData: { reply: string; searchQuery: string } | null = null;

    const context = history
      ?.map((h: any) => `${h.role}: ${h.content}`)
      .join("\n");

    // for (const modelName of models) {
    //   try {
    //     const model = genAI.getGenerativeModel({ model: modelName });
    //     const result = await model.generateContent([
    //       SYSTEM_PROMPT,
    //       `History:\n${context}\nUser: ${message}`,
    //     ]);

    //     const textResponse = result.response.text();
    //     const cleanJson = textResponse.replace(/```json|```/g, "").trim();
    //     aiData = JSON.parse(cleanJson);
    //     if (aiData) break;
    //   } catch (err) {
    //     console.error(`Model ${modelName} failed, trying next...`);
    //     continue;
    //   }
    // }

    for (const modelName of models) {
      try {
        console.log(`Trying model: ${modelName}...`); // Debug log
        const model = genAI.getGenerativeModel({ model: modelName });

        const result = await model.generateContent([
          SYSTEM_PROMPT,
          `History:\n${context}\nUser: ${message}`,
        ]);

        const textResponse = result.response.text();
        if (!textResponse) continue;

        // Robust JSON extraction
        const jsonMatch = textResponse.match(/\{[\s\S]*\}/);
        const cleanJson = jsonMatch ? jsonMatch[0] : textResponse;

        aiData = JSON.parse(cleanJson);
        if (aiData) {
          console.log(`Success with ${modelName}`);
          break;
        }
      } catch (err: any) {
        // THIS IS THE CRITICAL LOG:
        console.error(`Error with ${modelName}:`, err.message || err);
        continue;
      }
    }

    if (!aiData) throw new Error("AI Generation Failed");

    let finalQuery = aiData.searchQuery?.toLowerCase() || "";
    let products: any[] = [];
    let finalReply = aiData.reply;

    if (finalQuery) {
      products = await prisma.product.findMany({
        where: {
          isSold: false,
          ...(finalQuery !== "all" && {
            OR: [
              { name: { contains: finalQuery, mode: "insensitive" } },
              { description: { contains: finalQuery, mode: "insensitive" } },
              {
                category: {
                  name: { contains: finalQuery, mode: "insensitive" },
                },
              },
            ],
          }),
        },
        include: { category: true },
        take: 6,
      });

      // Handle empty results with a "Stylist" personality
      if (products.length === 0 && finalQuery !== "all") {
        finalReply = `I love that vibe! I don't have any "${finalQuery}" pieces in the showroom right now, but stay tuned—I'm always sourcing new gems. How about we look at some other chic arrivals?`;

        // Fallback: Show newest arrivals instead of nothing
        products = await prisma.product.findMany({
          where: { isSold: false },
          orderBy: { createdAt: "desc" },
          include: { category: true },
          take: 4,
        });
      }
    }

    return NextResponse.json({ reply: finalReply, products });
  } catch (error) {
    console.error("Stylist API Error:", error);
    return NextResponse.json({
      reply:
        "I'm having trouble accessing the showroom folders right now. Give me a moment?",
      products: [],
    });
  }
}
