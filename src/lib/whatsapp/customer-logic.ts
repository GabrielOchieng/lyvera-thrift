// // src/lib/whatsapp/customer-logic.ts
// import { GoogleGenerativeAI } from "@google/generative-ai";
// import prisma from "../../../lib/prisma";

// const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

// export async function handleCustomerChat(message: any) {
//   try {
//     const from = message.from;
//     const userText = message.text?.body || "Hello";

//     // 1. Fetch available products with IDs for deep linking
//     const products = await prisma.product.findMany({
//       where: { isSold: false },
//       take: 10,
//       select: { id: true, name: true, price: true, description: true },
//     });

//     const productContext = products
//       .map(
//         (p) =>
//           `- ${p.name} | KES ${p.price} | Link: ${process.env.NEXT_PUBLIC_APP_URL}/shop/${p.id}`,
//       )
//       .join("\n");

//     // 2. Optimized Prompt for Sales
//     const model = genAI.getGenerativeModel({
//       model: "gemini-3.1-flash-lite-preview",
//     });

//     const prompt = `
//       You are 'Lyvera Bot', a trend-conscious fashion assistant for Lyvera Store in Nairobi.
//       Your goal is to sell items and provide excellent service.

//       [CORE RULES - MUST FOLLOW]
//       1. ONLY answer questions related to Lyvera Store, our inventory, fashion advice, or shopping.
//       2. If a user asks about politics, news, celebrities, or any non-fashion topics (like "Who is Gachagua?"),
//       you must politely decline by saying: "I only handle Lyvera Store fashion inquiries. How can I help you find your next fit?"
//       3. DO NOT engage in political or general knowledge discussions.

//       CURRENT INVENTORY:
//       ${productContext}

//       GUIDELINES:
//       - Tone: Friendly, stylish, and use Kenyan urban slang (e.g., "drip", "tuko na", "fit").
//       - Advice: If a user asks for something, match them with items from the inventory.
//       - Deep Links: ALWAYS include the specific product link if recommending an item.
//       - Brevity: Keep responses short (WhatsApp-friendly).
//       - Closing: End by inviting them to order or ask more.

//       User Query: "${userText}"
//     `;

//     const response = await model.generateContent(prompt);
//     const replyBody = response.response.text();

//     // 3. Send response to WhatsApp
//     await fetch(
//       `https://graph.facebook.com/v21.0/${process.env.WHATSAPP_PHONE_NUMBER_ID}/messages`,
//       {
//         method: "POST",
//         headers: {
//           Authorization: `Bearer ${process.env.WHATSAPP_TOKEN}`,
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           messaging_product: "whatsapp",
//           to: from,
//           type: "text",
//           text: { body: replyBody },
//         }),
//       },
//     );
//   } catch (error) {
//     console.error("🛑 Error in handleCustomerChat:", error);
//   }
// }

import { GoogleGenerativeAI } from "@google/generative-ai";
import prisma from "../../../lib/prisma";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function handleCustomerChat(message: any) {
  try {
    const from = message.from;
    const userText = message.text?.body || "Hello";

    const products = await prisma.product.findMany({
      where: { isSold: false },
      take: 10,
      select: {
        id: true,
        name: true,
        price: true,
        description: true,
        images: true,
      },
    });

    const productContext = products
      .map(
        (p) =>
          `- [ID: ${p.id}] ${p.name} | KES ${p.price} | Desc: ${p.description}`,
      )
      .join("\n");

    const model = genAI.getGenerativeModel({
      model: "gemini-3.1-flash-lite-preview",
    });

    const WEBSITE_URL =
      process.env.NEXT_PUBLIC_APP_URL ||
      "https://lyvera-thrift-ihvf.vercel.app";
    const CONTACT_PHONE = "+254745046468";

    const prompt = `
      You are 'Lyvera Bot', a trend-conscious fashion assistant for Lyvera Store in Nairobi.
      Your goal is to sell items and provide excellent service.

      [BUSINESS CONTACT DETAILS - USE EXACTLY AS PROVIDED]
  - Website: ${WEBSITE_URL}
  - Official WhatsApp/Contact: ${CONTACT_PHONE}
  - Store Location: Nairobi, Kenya

      [CORE RULES - MUST FOLLOW]
      1. ONLY answer questions related to Lyvera Store, our inventory, fashion advice, or shopping.
      2. If a user asks about politics, news, celebrities, or any non-fashion topics (like "Who is Gachagua?"),
      you must politely decline by saying: "I only handle Lyvera Store fashion inquiries. How can I help you find your next fit?"
      3. DO NOT engage in political or general knowledge discussions.
      4. If a user asks for our website or contact, you MUST use the links above.

      CURRENT INVENTORY:
      ${productContext}

      GUIDELINES:
      - Tone: Friendly, stylish, and use Kenyan urban slang (e.g., "drip", "tuko na", "fit").
      - Advice: If a user asks for something, match them with items from the inventory.
      - Deep Links: ALWAYS include the specific product link if recommending an item.
      - Brevity: Keep responses short (WhatsApp-friendly).
      - Closing: End by inviting them to order or ask more.


      [OUTPUT FORMAT - REQUIRED]
      Return JSON ONLY. No extra text.
      {
        "reply": "The friendly message with slang and details.",
        "productId": "ID_OF_THE_PRODUCT_OR_NULL"
      }

      User Query: "${userText}"
    `;

    const response = await model.generateContent(prompt);
    const aiText = response.response
      .text()
      .replace(/```json|```/g, "")
      .trim();
    const { reply, productId } = JSON.parse(aiText);

    // Find the selected product
    const selectedProduct = products.find((p) => p.id === productId);

    // 3. Send response (Image if product exists, otherwise Text)
    const payload: any = {
      messaging_product: "whatsapp",
      to: from,
    };

    if (selectedProduct && selectedProduct.images[0]) {
      // 1. Build a rich caption string
      const richCaption = `
*${selectedProduct.name}*
💰 *Price:* KES ${selectedProduct.price}
📝 *Details:* ${selectedProduct.description}

${reply}

🔗 *Order/View here:* ${process.env.NEXT_PUBLIC_APP_URL}/shop/${productId}
      `.trim();

      payload.type = "image";
      payload.image = {
        link: selectedProduct.images[0],
        caption: richCaption, // 2. Send the formatted details in the caption
      };
    } else {
      payload.type = "text";
      payload.text = { body: reply };
    }

    await fetch(
      `https://graph.facebook.com/v21.0/${process.env.WHATSAPP_PHONE_NUMBER_ID}/messages`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.WHATSAPP_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      },
    );
  } catch (error) {
    console.error("🛑 Error:", error);
  }
}
