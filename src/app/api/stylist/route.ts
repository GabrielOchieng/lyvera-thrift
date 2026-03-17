import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";
import prisma from "../../../../lib/prisma";
import { safeDbQuery } from "@/lib/db-utils";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(req: Request) {
  try {
    const { message } = await req.json();

    const model = genAI.getGenerativeModel({
      model: "gemini-3.1-flash-lite-preview",
    });

    const prompt = `
      You are the Lyvera AI Stylist. Your goal is to help users find clothes in our database.
      User message: "${message}"
      
      Categories available:new arrivals, outerwear, tops, bottoms, accessories.
      
      INSTRUCTIONS:
      1. Extract 1 simple keyword for "searchQuery" (e.g., if they say 'corset top', use 'corset').
      2. Identify the closest category from the list above.
      3. Write a trendy, high-fashion expert reply (max 12 words).
      
      Return ONLY a JSON object:
      {
        "searchQuery": "keyword",
        "category": "category name or null",
        "stylistReply": "reply"
      }
    `;

    const aiResult = await model.generateContent(prompt);
    const responseText = aiResult.response.text();

    const cleanedJson = responseText.replace(/```json|```/g, "").trim();
    const aiData = JSON.parse(cleanedJson);

    // Database Search with improved logic
    // const products = await safeDbQuery(() =>
    //   prisma.product.findMany({
    //     where: {
    //       isSold: false,
    //       AND: [
    //         // 1. Optional Category Filter
    //         aiData.category
    //           ? {
    //               category: {
    //                 name: { contains: aiData.category, mode: "insensitive" },
    //               },
    //             }
    //           : {},
    //         // 2. Keyword Filter (Matches Name OR Description)
    //         {
    //           OR: [
    //             {
    //               name: {
    //                 contains: aiData.searchQuery || "",
    //                 mode: "insensitive",
    //               },
    //             },
    //             {
    //               description: {
    //                 contains: aiData.searchQuery || "",
    //                 mode: "insensitive",
    //               },
    //             },
    //           ],
    //         },
    //       ],
    //     },
    //     include: { category: true },
    //     orderBy: { createdAt: "desc" },
    //     take: 4,
    //   }),
    // );

    const products = await safeDbQuery(() =>
      prisma.product.findMany({
        where: {
          isSold: false,
          OR: [
            // 1. Match the Category Name
            aiData.category
              ? {
                  category: {
                    name: { contains: aiData.category, mode: "insensitive" },
                  },
                }
              : {},
            // 2. OR Match the Search Query in Name/Description
            {
              name: { contains: aiData.searchQuery || "", mode: "insensitive" },
            },
            {
              description: {
                contains: aiData.searchQuery || "",
                mode: "insensitive",
              },
            },
          ],
        },
        include: { category: true },
        orderBy: { createdAt: "desc" },
        take: 4,
      }),
    );

    // 3. Fallback Logic: If no items found, get 4 recent items to show something anyway
    let finalProducts = products;
    let finalReply = aiData.stylistReply;

    if (products.length === 0) {
      finalProducts = await safeDbQuery(() =>
        prisma.product.findMany({
          where: { isSold: false },
          include: { category: true },
          orderBy: { createdAt: "desc" },
          take: 4,
        }),
      );
      finalReply = `I couldn't find exactly that, but check out these fresh arrivals at Lyvera!`;
    }

    return NextResponse.json({
      reply: finalReply,
      products: finalProducts,
    });
  } catch (error) {
    console.error("Stylist API Error:", error);
    return NextResponse.json(
      {
        reply:
          "Sorry, I hit a snag while looking through the racks. Try again?",
        products: [],
      },
      { status: 500 },
    );
  }
}
