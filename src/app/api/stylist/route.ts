// // // import { GoogleGenerativeAI } from "@google/generative-ai";
// // // import { NextResponse } from "next/server";
// // // import prisma from "../../../../lib/prisma";
// // // import { safeDbQuery } from "@/lib/db-utils";

// // // const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

// // // export async function POST(req: Request) {
// // //   try {
// // //     const { message } = await req.json();

// // //     const model = genAI.getGenerativeModel({
// // //       model: "gemini-3.1-flash-lite-preview",
// // //     });

// // //     const prompt = `
// // //       You are the Lyvera AI Stylist. Your goal is to help users find clothes in our database.
// // //       User message: "${message}"

// // //       Categories available:new arrivals, outerwear, tops, bottoms, accessories.

// // //       INSTRUCTIONS:
// // //       1. Extract 1 simple keyword for "searchQuery" (e.g., if they say 'corset top', use 'corset').
// // //       2. Identify the closest category from the list above.
// // //       3. Write a trendy, high-fashion expert reply (max 12 words).

// // //       Return ONLY a JSON object:
// // //       {
// // //         "searchQuery": "keyword",
// // //         "category": "category name or null",
// // //         "stylistReply": "reply"
// // //       }
// // //     `;

// // //     const aiResult = await model.generateContent(prompt);
// // //     const responseText = aiResult.response.text();

// // //     const cleanedJson = responseText.replace(/```json|```/g, "").trim();
// // //     const aiData = JSON.parse(cleanedJson);

// // //     // Database Search with improved logic
// // //     // const products = await safeDbQuery(() =>
// // //     //   prisma.product.findMany({
// // //     //     where: {
// // //     //       isSold: false,
// // //     //       AND: [
// // //     //         // 1. Optional Category Filter
// // //     //         aiData.category
// // //     //           ? {
// // //     //               category: {
// // //     //                 name: { contains: aiData.category, mode: "insensitive" },
// // //     //               },
// // //     //             }
// // //     //           : {},
// // //     //         // 2. Keyword Filter (Matches Name OR Description)
// // //     //         {
// // //     //           OR: [
// // //     //             {
// // //     //               name: {
// // //     //                 contains: aiData.searchQuery || "",
// // //     //                 mode: "insensitive",
// // //     //               },
// // //     //             },
// // //     //             {
// // //     //               description: {
// // //     //                 contains: aiData.searchQuery || "",
// // //     //                 mode: "insensitive",
// // //     //               },
// // //     //             },
// // //     //           ],
// // //     //         },
// // //     //       ],
// // //     //     },
// // //     //     include: { category: true },
// // //     //     orderBy: { createdAt: "desc" },
// // //     //     take: 4,
// // //     //   }),
// // //     // );

// // //     const products = await safeDbQuery(() =>
// // //       prisma.product.findMany({
// // //         where: {
// // //           isSold: false,
// // //           OR: [
// // //             // 1. Match the Category Name
// // //             aiData.category
// // //               ? {
// // //                   category: {
// // //                     name: { contains: aiData.category, mode: "insensitive" },
// // //                   },
// // //                 }
// // //               : {},
// // //             // 2. OR Match the Search Query in Name/Description
// // //             {
// // //               name: { contains: aiData.searchQuery || "", mode: "insensitive" },
// // //             },
// // //             {
// // //               description: {
// // //                 contains: aiData.searchQuery || "",
// // //                 mode: "insensitive",
// // //               },
// // //             },
// // //           ],
// // //         },
// // //         include: { category: true },
// // //         orderBy: { createdAt: "desc" },
// // //         take: 4,
// // //       }),
// // //     );

// // //     // 3. Fallback Logic: If no items found, get 4 recent items to show something anyway
// // //     let finalProducts = products;
// // //     let finalReply = aiData.stylistReply;

// // //     if (products.length === 0) {
// // //       finalProducts = await safeDbQuery(() =>
// // //         prisma.product.findMany({
// // //           where: { isSold: false },
// // //           include: { category: true },
// // //           orderBy: { createdAt: "desc" },
// // //           take: 4,
// // //         }),
// // //       );
// // //       finalReply = `I couldn't find exactly that, but check out these fresh arrivals at Lyvera!`;
// // //     }

// // //     return NextResponse.json({
// // //       reply: finalReply,
// // //       products: finalProducts,
// // //     });
// // //   } catch (error) {
// // //     console.error("Stylist API Error:", error);
// // //     return NextResponse.json(
// // //       {
// // //         reply:
// // //           "Sorry, I hit a snag while looking through the racks. Try again?",
// // //         products: [],
// // //       },
// // //       { status: 500 },
// // //     );
// // //   }
// // // }

// // import { GoogleGenerativeAI } from "@google/generative-ai";
// // import { NextResponse } from "next/server";
// // import prisma from "../../../../lib/prisma";

// // const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

// // const SYSTEM_PROMPT = `
// // You are the Lyvera AI Stylist.

// // PERSONALITY:
// // - Professional, chic, and fashion-forward.
// // - STRICT BAN: Never use pet names like "darling", "babe", "dear", or "honey".
// // - Provide helpful style advice before showing products.

// // RULES:
// // - When a user wants to see items or categories, you must provide a "searchQuery".
// // - If they are just chatting, "searchQuery" should be "".
// // - Respond ONLY in JSON format.

// // RESPONSE FORMAT:
// // {
// //   "reply": "Your conversational response",
// //   "searchQuery": "keyword to search in DB"
// // }
// // `;

// // export async function POST(req: Request) {
// //   try {
// //     const { message, history } = await req.json();

// //     // 1. Define models for retry loop
// //     const models = [
// //       "gemini-3.1-flash-lite-preview",
// //       "gemini-2.5-flash",
// //       "gemini-2.0-flash",
// //     ];
// //     let aiData: { reply: string; searchQuery: string } | null = null;
// //     let lastError: any = null;

// //     const context = history
// //       ?.map((h: any) => `${h.role}: ${h.content}`)
// //       .join("\n");

// //     // 2. Retry Loop
// //     for (const modelName of models) {
// //       try {
// //         const model = genAI.getGenerativeModel({ model: modelName });
// //         const result = await model.generateContent([
// //           SYSTEM_PROMPT,
// //           `Conversation History:\n${context}\n\nUser Message: ${message}`,
// //         ]);

// //         const cleanJson = result.response
// //           .text()
// //           .replace(/```json|```/g, "")
// //           .trim();

// //         aiData = JSON.parse(cleanJson);

// //         // If we successfully got and parsed data, break the loop
// //         if (aiData) break;
// //       } catch (err) {
// //         console.warn(`⚠️ Model ${modelName} failed, trying next...`);
// //         lastError = err;
// //       }
// //     }

// //     // 3. Final Error Check
// //     if (!aiData) {
// //       throw lastError || new Error("All AI models failed to respond.");
// //     }

// //     // 4. Database Search
// //     let products: any[] = [];
// //     if (aiData.searchQuery) {
// //       products = await prisma.product.findMany({
// //         where: {
// //           isSold: false,
// //           OR: [
// //             { name: { contains: aiData.searchQuery, mode: "insensitive" } },
// //             {
// //               category: {
// //                 name: { contains: aiData.searchQuery, mode: "insensitive" },
// //               },
// //             },
// //             {
// //               description: {
// //                 contains: aiData.searchQuery,
// //                 mode: "insensitive",
// //               },
// //             },
// //           ],
// //         },
// //         take: 4,
// //       });
// //     }

// //     return NextResponse.json({ reply: aiData.reply, products });
// //   } catch (error) {
// //     console.error("🛑 Stylist Critical Error:", error);
// //     return NextResponse.json({
// //       reply:
// //         "I'm having a bit of a wardrobe malfunction. Try again in a moment?",
// //       products: [],
// //     });
// //   }
// // }

// import { GoogleGenerativeAI } from "@google/generative-ai";
// import { NextResponse } from "next/server";
// import prisma from "../../../../lib/prisma";

// const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

// const SYSTEM_PROMPT = `
// You are the Lyvera AI Stylist.

// STRICT RULES:
// 1. NEVER use pet names like "darling", "babe", etc.
// 2. If the user asks to "see" anything, "show" anything, or "what is available", you MUST set the "searchQuery" to the category mentioned or "all" if they want everything.
// 3. You are a search-triggering assistant. Your reply is secondary; the "searchQuery" is the priority.

// RESPONSE FORMAT (JSON ONLY):
// {
//   "reply": "Your conversational response",
//   "searchQuery": "category_name_or_keyword"
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

//     // FALLBACK LOGIC: If the user wants to see items but searchQuery is empty
//     const userWantsToSee = [
//       "show",
//       "see",
//       "available",
//       "look",
//       "collections",
//     ].some((word) => message.toLowerCase().includes(word));

//     let products: any[] = [];

//     // Determine the search term (prioritize AI, then fallback to user input)
//     const finalQuery = aiData.searchQuery || (userWantsToSee ? "all" : "");

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
//         orderBy: { createdAt: "desc" },
//       });
//     }

//     return NextResponse.json({ reply: aiData.reply, products });
//   } catch (error) {
//     return NextResponse.json({
//       reply: "I'm having trouble syncing with the showroom.",
//       products: [],
//     });
//   }
// }

import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";
import prisma from "../../../../lib/prisma";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

const SYSTEM_PROMPT = `
You are the Lyvera AI Stylist. 

CRITICAL COMMANDS:
1. NEVER use pet names (darling, babe, etc.).
2. You operate in JSON ONLY.
3. If the user mentions a category (accessories, tops, etc.) or asks to "show" or "see" items, you MUST put that category name in the "searchQuery" field. 
4. If you are showing the "full collection", set searchQuery to "all".

JSON STRUCTURE:
{
  "reply": "Your fashion advice here",
  "searchQuery": "keyword"
}
`;

export async function POST(req: Request) {
  try {
    const { message, history } = await req.json();
    const models = [
      "gemini-3.1-flash-lite-preview",
      "gemini-2.5-flash",
      "gemini-2.0-flash",
    ];
    let aiData: { reply: string; searchQuery: string } | null = null;

    const context = history
      ?.map((h: any) => `${h.role}: ${h.content}`)
      .join("\n");

    for (const modelName of models) {
      try {
        const model = genAI.getGenerativeModel({ model: modelName });
        const result = await model.generateContent([
          SYSTEM_PROMPT,
          `History:\n${context}\nUser: ${message}`,
        ]);
        const cleanJson = result.response
          .text()
          .replace(/```json|```/g, "")
          .trim();
        aiData = JSON.parse(cleanJson);
        if (aiData) break;
      } catch (err) {
        continue;
      }
    }

    if (!aiData) throw new Error("AI Failed");

    // --- SAFETY NET: MANUAL KEYWORD EXTRACTION ---
    let finalQuery = aiData.searchQuery?.toLowerCase() || "";
    const lowerMsg = message.toLowerCase();

    // If AI failed to provide a query but the user is clearly asking for something:
    if (!finalQuery) {
      if (lowerMsg.includes("accessories")) finalQuery = "accessories";
      else if (lowerMsg.includes("top")) finalQuery = "tops";
      else if (lowerMsg.includes("dress")) finalQuery = "dresses";
      else if (lowerMsg.includes("show") || lowerMsg.includes("see"))
        finalQuery = "all";
    }

    let products: any[] = [];

    if (finalQuery) {
      products = await prisma.product.findMany({
        where: {
          isSold: false,
          ...(finalQuery !== "all" && {
            OR: [
              { name: { contains: finalQuery, mode: "insensitive" } },
              {
                category: {
                  name: { contains: finalQuery, mode: "insensitive" },
                },
              },
              { description: { contains: finalQuery, mode: "insensitive" } },
            ],
          }),
        },
        take: 6,
        orderBy: { createdAt: "desc" },
      });
    }

    return NextResponse.json({ reply: aiData.reply, products });
  } catch (error) {
    return NextResponse.json({
      reply: "Snag in the racks! Try again?",
      products: [],
    });
  }
}
