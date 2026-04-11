import { GoogleGenerativeAI } from "@google/generative-ai";
import prisma from "../../../lib/prisma";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function handleCustomerChat(message: any) {
  const from = message.from;
  const userText = message.text.body;

  // 1. Fetch recent products for AI context
  const products = await prisma.product.findMany({
    where: { isSold: false },
    take: 10,
    select: { name: true, price: true, description: true },
  });

  const productContext = products
    .map((p) => `- ${p.name} (KES ${p.price}): ${p.description}`)
    .join("\n");

  // 2. Generate AI Response
  const model = genAI.getGenerativeModel({
    model: "gemini-3.1-flash-lite-preview",
  });
  const response = await model.generateContent(`
    You are 'Lyvera Bot', a stylish and helpful assistant for Lyvera Store in Nairobi.
    Keep responses short, friendly, and use Kenyan-appropriate slang where natural.
    
    Current Inventory:
    ${productContext}
    
    User Query: "${userText}"
    
    Instructions:
    - If they ask about items, suggest from the inventory above.
    - Always provide the link: ${process.env.NEXT_PUBLIC_APP_URL}/shop
    - If they want to buy, tell them to reply with the item name and we will assist.
  `);

  // 3. Send back to WhatsApp
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
        text: { body: response.response.text() },
      }),
    },
  );
}
