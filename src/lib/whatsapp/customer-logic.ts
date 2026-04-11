// src/lib/whatsapp/customer-logic.ts
import { GoogleGenerativeAI } from "@google/generative-ai";
import prisma from "../../../lib/prisma";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function handleCustomerChat(message: any) {
  try {
    const from = message.from;
    const userText = message.text?.body || "Hello";

    // 1. Fetch available products with IDs for deep linking
    const products = await prisma.product.findMany({
      where: { isSold: false },
      take: 10,
      select: { id: true, name: true, price: true, description: true },
    });

    const productContext = products
      .map(
        (p) =>
          `- ${p.name} | KES ${p.price} | Link: ${process.env.NEXT_PUBLIC_APP_URL}/shop/${p.id}`,
      )
      .join("\n");

    // 2. Optimized Prompt for Sales
    const model = genAI.getGenerativeModel({
      model: "gemini-3.1-flash-lite-preview",
    });

    const prompt = `
      You are 'Lyvera Bot', a trend-conscious fashion assistant for Lyvera Store in Nairobi.
      Your goal is to sell items and provide excellent service.
      
      [CORE RULES - MUST FOLLOW]
      1. ONLY answer questions related to Lyvera Store, our inventory, fashion advice, or shopping.
      2. If a user asks about politics, news, celebrities, or any non-fashion topics (like "Who is Gachagua?"), 
      you must politely decline by saying: "I only handle Lyvera Store fashion inquiries. How can I help you find your next fit?"
      3. DO NOT engage in political or general knowledge discussions.

      CURRENT INVENTORY:
      ${productContext}

      GUIDELINES:
      - Tone: Friendly, stylish, and use Kenyan urban slang (e.g., "drip", "tuko na", "fit").
      - Advice: If a user asks for something, match them with items from the inventory.
      - Deep Links: ALWAYS include the specific product link if recommending an item.
      - Brevity: Keep responses short (WhatsApp-friendly).
      - Closing: End by inviting them to order or ask more.
      
      User Query: "${userText}"
    `;

    const response = await model.generateContent(prompt);
    const replyBody = response.response.text();

    // 3. Send response to WhatsApp
    await fetch(
      `https://graph.facebook.com/v21.0/${process.env.WHATSAPP_PHONE_NUMBER_ID}/messages`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.WHATSAPP_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messaging_product: "whatsapp",
          to: from,
          type: "text",
          text: { body: replyBody },
        }),
      },
    );
  } catch (error) {
    console.error("🛑 Error in handleCustomerChat:", error);
  }
}
