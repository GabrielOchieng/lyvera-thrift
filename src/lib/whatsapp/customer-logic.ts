// src/lib/whatsapp/customer-logic.ts
import { GoogleGenerativeAI } from "@google/generative-ai";
import prisma from "../../../lib/prisma";
import { getOrCreateSession, addToCart, clearCart } from "./cart";
import { createOrder } from "@/actions/order";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

// export async function handleCustomerChat(message: any) {
//   const { id: messageId, from } = message;
//   const userText = message.text?.body || "";

//   try {
//     // 1. IDEMPOTENCY LOCK
//     if (await prisma.processedMessage.findUnique({ where: { id: messageId } }))
//       return;
//     await prisma.processedMessage.create({ data: { id: messageId } });

//     // 2. SESSION & STATE CHECK
//     const session = await getOrCreateSession(from);

//     // 3. CHECKOUT STATE MACHINE
//     if (session.state !== "browsing") {
//       if (
//         session.state === "awaiting_payment" &&
//         userText.toLowerCase().includes("paid")
//       ) {
//         await clearCart(from);
//         return await sendWhatsApp(
//           from,
//           "🎉 *Hongera!* 🎉\n\nPayment received! Your order is being prepped with love. We'll hit you up with delivery details soon. Thank you for choosing Lyvera! 🚚✨",
//         );
//       }
//       // ---------------------------

//       return await handleCheckoutFlow(from, session, userText);
//     }

//     // 4. CART/NAVIGATION COMMANDS
//     if (userText.toLowerCase() === "cart")
//       return await handleViewCart(from, session);
//     if (userText.toLowerCase() === "checkout")
//       return await handleInitiateCheckout(from, session);

//     // 5. AI BROWSING FLOW
//     const products = await prisma.product.findMany({
//       where: { isSold: false },
//       take: 10,
//     });
//     const productContext = products
//       .map((p) => `- [ID: ${p.id}] ${p.name} | KES ${p.price}`)
//       .join("\n");

//     const WEBSITE_URL =
//       process.env.NEXT_PUBLIC_APP_URL ||
//       "https://lyvera-thrift-ihvf.vercel.app";
//     const CONTACT_PHONE = "+254745046468";

//     const prompt = `
//           You are 'Lyvera Bot', a trend-conscious fashion assistant for Lyvera Store in Nairobi.
//           Your goal is to sell items and provide excellent service.

//           [BUSINESS CONTACT DETAILS]
//       - Website: ${WEBSITE_URL}
//       - Official WhatsApp/Contact: ${CONTACT_PHONE}
//       - Store Location: Nairobi, Kenya

//           [CORE RULES]
//           1. ONLY answer questions related to Lyvera Store, our inventory, fashion advice, or shopping.
//           2. If a user asks about non-fashion topics, decline politely.
//           3. If a user asks for our website or contact, use the links above.

//           CURRENT INVENTORY:
//           ${productContext}

//           [OUTPUT FORMAT - REQUIRED]
//           Return JSON ONLY. No extra text.
//           {
//             "reply": "The friendly message with slang and details.",
//             "productId": "ID_OF_THE_PRODUCT_OR_NULL",
//             "action": "ADD_TO_CART | VIEW_CART | CHECKOUT | NONE"
//           }

//           User Query: "${userText}"
//         `;

//     const modelQueue = [
//       "gemini-3.1-flash-lite-preview",
//       "gemini-2.5-flash",
//       "gemini-2.0-flash",
//     ];

//     let response: any;
//     let lastError: any;

//     for (const modelName of modelQueue) {
//       try {
//         const model = genAI.getGenerativeModel({ model: modelName });
//         response = await model.generateContent(prompt);
//         break; // Success! Exit the loop
//       } catch (err) {
//         lastError = err;
//         console.warn(`⚠️ Model ${modelName} failed. Trying next...`);
//       }
//     }

//     if (!response) {
//       throw new Error(
//         `All AI models failed. Last error: ${lastError?.message}`,
//       );
//     }

//     const { reply, productId, action } = JSON.parse(
//       response.response.text().replace(/```json|```/g, ""),
//     );

//     // Action Router
//     if (action === "ADD_TO_CART" && productId) {
//       const product = products.find((p) => p.id === productId);
//       await addToCart(from, product);
//       return await sendWhatsApp(
//         from,
//         `🛒 Added *${product?.name}*. Type *cart* to view.`,
//       );
//     }

//     // Image/Product Response Logic
//     const selectedProduct = products.find((p) => p.id === productId);
//     if (selectedProduct && selectedProduct.images?.[0]) {
//       return await sendWhatsApp(from, {
//         image: selectedProduct.images[0],
//         caption: `*${selectedProduct.name}*\n💰 KES ${selectedProduct.price}\n\n${reply}`,
//       });
//     }

//     await sendWhatsApp(from, reply);
//   } catch (error) {
//     console.error("🛑 Error:", error);
//     await prisma.processedMessage
//       .delete({ where: { id: messageId } })
//       .catch(() => {});
//   }
// }

export async function handleCustomerChat(message: any) {
  const { id: messageId, from } = message;
  const userText = message.text?.body || "";

  try {
    // 1. IDEMPOTENCY LOCK: Using try-catch to handle race conditions
    try {
      await prisma.processedMessage.create({ data: { id: messageId } });
    } catch (err: any) {
      // P2002 is the Prisma error code for Unique Constraint Violation
      if (err.code === "P2002") return;
      throw err;
    }

    // 2. SESSION & STATE CHECK
    const session = await getOrCreateSession(from);

    // 3. CHECKOUT STATE MACHINE
    if (session.state !== "browsing") {
      if (
        session.state === "awaiting_payment" &&
        userText.toLowerCase().includes("paid")
      ) {
        await clearCart(from);
        return await sendWhatsApp(
          from,
          "🎉 *Hongera!* 🎉\n\nPayment received! Your order is being prepped with love. We'll hit you up with delivery details soon. Thank you for choosing Lyvera! 🚚✨",
        );
      }
      return await handleCheckoutFlow(from, session, userText);
    }

    // 4. CART/NAVIGATION COMMANDS
    const cmd = userText.toLowerCase();
    if (cmd === "cart") return await handleViewCart(from, session);
    if (cmd === "checkout") return await handleInitiateCheckout(from, session);

    // 5. AI BROWSING FLOW
    const products = await prisma.product.findMany({
      where: { isSold: false },
      take: 10,
    });

    const productContext = products
      .map((p) => `- [ID: ${p.id}] ${p.name} | KES ${p.price}`)
      .join("\n");

    const WEBSITE_URL =
      process.env.NEXT_PUBLIC_APP_URL ||
      "https://lyvera-thrift-ihvf.vercel.app";
    const CONTACT_PHONE = "+254745046468";
    const prompt = `
          You are 'Lyvera Bot', a trend-conscious fashion assistant for Lyvera Store in Nairobi.
           Your goal is to sell items and provide excellent service.
           [BUSINESS CONTACT DETAILS]
       - Website: ${WEBSITE_URL}
       - Official WhatsApp/Contact: ${CONTACT_PHONE}
       - Store Location: Nairobi, Kenya

           [CORE RULES]
           1. ONLY answer questions related to Lyvera Store, our inventory, fashion advice, or shopping.
           2. If a user asks about non-fashion topics, decline politely.
           3. If a user asks for our website or contact, use the links above.
      CURRENT INVENTORY:
      ${productContext}
      [OUTPUT FORMAT - REQUIRED]
      Return JSON ONLY.
      { "reply": "string", "productId": "string | null", "action": "ADD_TO_CART | VIEW_CART | CHECKOUT | NONE" }
      User Query: "${userText}"
    `;

    // AI Generation with Model Queue
    let response: any;
    for (const modelName of [
      "gemini-3.1-flash-lite-preview",
      "gemini-2.5-flash",
      "gemini-2.0-flash",
    ]) {
      try {
        response = await genAI
          .getGenerativeModel({ model: modelName })
          .generateContent(prompt);
        break;
      } catch (err) {
        console.warn(`⚠️ Model ${modelName} failed.`);
      }
    }

    if (!response) throw new Error("AI models failed.");

    const { reply, productId, action } = JSON.parse(
      response.response.text().replace(/```json|```/g, ""),
    );

    // Action Router
    if (action === "ADD_TO_CART" && productId) {
      const product = products.find((p) => p.id === productId);
      if (product) {
        await addToCart(from, product);
        return await sendWhatsApp(
          from,
          `🛒 Added *${product.name}*. Type *cart* to view.`,
        );
      }
    }

    // Image/Product Response Logic
    const selectedProduct = products.find((p) => p.id === productId);
    if (selectedProduct?.images?.[0]) {
      return await sendWhatsApp(from, {
        image: selectedProduct.images[0],
        caption: `*${selectedProduct.name}*\n💰 KES ${selectedProduct.price}\n\n${reply}`,
      });
    }

    await sendWhatsApp(from, reply);
  } catch (error) {
    console.error("🛑 Error in handleCustomerChat:", error);
    // Cleanup the lock if the entire flow failed so user can try again
    await prisma.processedMessage
      .delete({ where: { id: messageId } })
      .catch(() => {});
  }
}

// --- HELPERS ---

async function handleCheckoutFlow(from: string, session: any, text: string) {
  switch (session.state) {
    case "checkout_name":
      await prisma.chatSession.update({
        where: { phone: from },
        data: { name: text, state: "checkout_phone" },
      });
      return await sendWhatsApp(from, "📱 Enter your M-Pesa number:");
    case "checkout_phone":
      await prisma.chatSession.update({
        where: { phone: from },
        data: { phoneInput: text, state: "checkout_location" },
      });
      return await sendWhatsApp(from, "📍 Delivery location:");

    case "checkout_location":
      const cart = session.cart as any[];
      const total = cart.reduce((sum, i) => sum + (Number(i.price) || 0), 0);

      const formattedItems = cart.map((item) => ({
        // CRITICAL: We provide BOTH 'id' and 'productId' to satisfy
        // the createOrder mapping (which looks for .id)
        // AND your internal logic needs.
        id: item.id || item.productId,
        productId: item.id || item.productId,
        name: item.name || "Unknown Item",
        price: Number(item.price) || 0,
        size: item.size || "Standard",
        image: item.image || "https://placeholder-url.com/default.jpg",
      }));

      await createOrder({
        name: session.name!,
        phone: session.phoneInput!,
        location: text,
        transCode: `WA_${crypto.randomUUID().slice(0, 8)}`,
        items: formattedItems, // This now contains the 'id' property createOrder needs
        total: total,
      });
      // Update state instead of clearing cart
      await prisma.chatSession.update({
        where: { phone: from },
        data: { state: "awaiting_payment", location: text },
      });

      return await sendWhatsApp(
        from,
        "✅ Order received! Pay KES " +
          total +
          " to Till 5293638. Reply *PAID* when done.",
      );

    case "awaiting_payment":
      return await sendWhatsApp(
        from,
        "⏳ I'm waiting for your payment confirmation! Please reply *PAID* once you have paid to Till 5293638.",
      );

    default:
      return await sendWhatsApp(
        from,
        "I'm not sure what you mean. Reply *PAID* if you have completed your payment.",
      );
  }
}

// async function handleViewCart(from: string, session: any) {
//   const cart = session.cart as any[];
//   if (cart.length === 0)
//     return await sendWhatsApp(from, "🛒 Your cart is empty.");
//   const total = cart.reduce((sum, i) => sum + i.price, 0);
//   return await sendWhatsApp(
//     from,
//     `🛍️ *Your Cart*\n\n${cart.map((i) => i.name).join("\n")}\n\n💰 Total: KES ${total}\n\nType *checkout* to proceed.`,
//   );
// }

async function handleViewCart(from: string, session: any) {
  const cart = session.cart as any[];
  if (cart.length === 0)
    return await sendWhatsApp(from, "🛒 Your cart is empty.");

  // 1. Send each item as a separate image message
  for (const item of cart) {
    await sendWhatsApp(from, {
      image: item.image || "https://placeholder-url.com/default.jpg",
      caption: `*${item.name}* - KES ${item.price}`,
    });
  }

  // 2. Send the summary
  const total = cart.reduce((sum, i) => sum + (Number(i.price) || 0), 0);
  return await sendWhatsApp(
    from,
    `💰 *Total: KES ${total}*\n\nType *checkout* to proceed.`,
  );
}

async function handleInitiateCheckout(from: string, session: any) {
  if ((session.cart as any[]).length === 0)
    return await sendWhatsApp(from, "🛒 Cart is empty.");
  await prisma.chatSession.update({
    where: { phone: from },
    data: { state: "checkout_name" },
  });
  return await sendWhatsApp(from, "🧾 Enter your full name:");
}

export async function sendWhatsApp(
  to: string,
  content: string | { image: string; caption: string },
) {
  const payload: any = { messaging_product: "whatsapp", to };

  if (typeof content === "string") {
    payload.type = "text";
    payload.text = { body: content };
  } else {
    payload.type = "image";
    payload.image = { link: content.image, caption: content.caption };
  }

  try {
    const response = await fetch(
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

    // LOG: The status and the body if the request failed
    if (!response.ok) {
      const errorData = await response.json();
      console.error(
        "🛑 Meta API Request Failed:",
        JSON.stringify(errorData, null, 2),
      );
      throw new Error(`Meta API Error: ${response.status}`);
    }

    console.log("✅ Message sent successfully to", to);
  } catch (error) {
    console.error("🛑 Full Error Object in sendWhatsApp:", error);
    throw error; // Re-throw so handleCustomerChat's catch block can log it too
  }
}
