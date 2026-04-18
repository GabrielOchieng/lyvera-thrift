// import { GoogleGenerativeAI } from "@google/generative-ai";
// import prisma from "../../../lib/prisma";
// import { getOrCreateSession, addToCart, clearCart } from "./cart";
// import { createOrder } from "@/actions/order";
// import crypto from "crypto";

// const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

// /**
//  * HELPER: Logs every interaction to ChatHistory table for AI context.
//  */
// async function logMessage(
//   phone: string,
//   role: "user" | "bot",
//   message: string,
// ) {
//   try {
//     await prisma.chatHistory.create({
//       data: { phone, role, message },
//     });
//   } catch (err) {
//     console.error("⚠️ History log failed:", err);
//   }
// }

// export async function handleCustomerChat(message: any) {
//   const { id: messageId, from } = message;
//   const userText = message.text?.body || "";

//   try {
//     // 1. IDEMPOTENCY LOCK: Prevent processing the same WhatsApp retry twice
//     try {
//       await prisma.processedMessage.create({ data: { id: messageId } });
//     } catch (err: any) {
//       if (err.code === "P2002") return; // Already processed
//       throw err;
//     }

//     // Immediately log the incoming user message
//     await logMessage(from, "user", userText);

//     // 2. SESSION & STATE RETRIEVAL
//     let session = await getOrCreateSession(from);

//     // 3. CHECKOUT STATE MACHINE (Overrides AI browsing)
//     if (session.state !== "browsing") {
//       // Handle the "PAID" confirmation immediately
//       if (
//         session.state === "awaiting_payment" &&
//         userText.toLowerCase().includes("paid")
//       ) {
//         await clearCart(from);
//         const successMsg =
//           "🎉 *Hongera!* 🎉\n\nPayment received! Your order is being prepped with love. We'll contact you with delivery details soon. Thank you for choosing Lyvera! 🚚✨";
//         await logMessage(from, "bot", successMsg);
//         return await sendWhatsApp(from, successMsg);
//       }
//       // Continue the multi-step checkout (Name -> Phone -> Location)
//       return await handleCheckoutFlow(from, session, userText);
//     }

//     // 4. DIRECT COMMAND OVERRIDES
//     const cmd = userText.toLowerCase().trim();
//     if (cmd === "cart") return await handleViewCart(from, session);
//     if (cmd === "checkout") return await handleInitiateCheckout(from, session);

//     // 5. AI BROWSING & PRODUCT DISCOVERY
//     const products = await prisma.product.findMany({
//       where: { isSold: false },
//       take: 12, // Sufficient variety for the AI to choose from
//     });

//     const productContext = products
//       .map((p) => `- [ID: ${p.id}] ${p.name} | KES ${p.price}`)
//       .join("\n");

//     const history = await prisma.chatHistory.findMany({
//       where: { phone: from },
//       orderBy: { createdAt: "desc" },
//       take: 6,
//     });

//     const historyContext = history
//       .map((h) => `${h.role === "user" ? "User" : "Bot"}: ${h.message}`)
//       .reverse()
//       .join("\n");

//     const prompt = `
//       You are 'Lyvera Bot', the expert shopping assistant for Lyvera Store, Nairobi.
//       Your tone is helpful, trend-conscious, and slightly Kenyan (Sheng-lite is okay).

//       [GOAL]
//       Help users find items, add them to cart, and guide them to checkout.

//       [INVENTORY]
//       ${productContext}

//       [BEHAVIOR]
//       1. If the user wants to buy/add something, set action to "ADD_TO_CART" and provide the productId.
//       2. If the user asks for a photo/picture, provide the productId and set action to "NONE".
//       3. If the user is ready to pay, suggest typing 'checkout' and set action to "CHECKOUT".

//       [OUTPUT FORMAT - JSON ONLY]
//       {
//         "reply": "your response string",
//         "productId": "valid ID or null",
//         "action": "ADD_TO_CART | VIEW_CART | CHECKOUT | NONE"
//       }

//       HISTORY:
//       ${historyContext}

//       User Query: "${userText}"
//     `;

//     // 6. AI GENERATION WITH MODEL QUEUE (Redundancy)
//     let responseText = "";
//     const models = [
//       "gemini-3.1-flash-lite-preview",
//       "gemini-2.5-flash",
//       "gemini-2.0-flash",
//     ];

//     for (const modelName of models) {
//       try {
//         const model = genAI.getGenerativeModel({ model: modelName });
//         const result = await model.generateContent(prompt);
//         responseText = result.response
//           .text()
//           .replace(/```json|```/g, "")
//           .trim();
//         if (responseText) break;
//       } catch (err) {
//         console.warn(`⚠️ ${modelName} failed, trying next...`);
//       }
//     }

//     if (!responseText) throw new Error("All AI models failed.");

//     const { reply, productId, action } = JSON.parse(responseText);

//     // 7. ACTION ROUTER
//     if (action === "ADD_TO_CART" && productId) {
//       const product = products.find((p) => p.id === productId);
//       if (product) {
//         await addToCart(from, product);
//         // Refresh session to reflect the updated cart in history
//         session = await getOrCreateSession(from);
//         const botReply = `🛒 Added *${product.name}* to your cart. Type *cart* to view or *checkout* to finish!`;
//         await logMessage(from, "bot", botReply);
//         return await sendWhatsApp(from, botReply);
//       }
//     }

//     if (action === "VIEW_CART") return await handleViewCart(from, session);
//     if (action === "CHECKOUT")
//       return await handleInitiateCheckout(from, session);

//     // 8. IMAGE RESPONSE LOGIC
//     const selectedProduct = products.find((p) => p.id === productId);
//     if (selectedProduct?.images?.[0]) {
//       await logMessage(
//         from,
//         "bot",
//         `[Sent Image of ${selectedProduct.name}] ${reply}`,
//       );
//       return await sendWhatsApp(from, {
//         image: selectedProduct.images[0],
//         caption: `*${selectedProduct.name}*\n💰 KES ${selectedProduct.price}\n\n${reply}`,
//       });
//     }

//     // 9. DEFAULT RESPONSE
//     await logMessage(from, "bot", reply);
//     await sendWhatsApp(from, reply);
//   } catch (error) {
//     console.error("🛑 Error in handleCustomerChat:", error);
//     // Cleanup idempotency record so user can retry on failure
//     await prisma.processedMessage
//       .delete({ where: { id: messageId } })
//       .catch(() => {});
//   }
// }

// // --- HELPER FUNCTIONS ---

// async function handleCheckoutFlow(from: string, session: any, text: string) {
//   switch (session.state) {
//     case "checkout_name":
//       await prisma.chatSession.update({
//         where: { phone: from },
//         data: { name: text, state: "checkout_phone" },
//       });
//       const qPhone =
//         "📱 Great, " +
//         text +
//         "! Enter your *M-Pesa number* (e.g., 0712345678):";
//       await logMessage(from, "bot", qPhone);
//       return await sendWhatsApp(from, qPhone);

//     case "checkout_phone":
//       await prisma.chatSession.update({
//         where: { phone: from },
//         data: { phoneInput: text, state: "checkout_location" },
//       });
//       const qLoc =
//         "📍 Almost done! Enter your *Delivery Location* (e.g., CBD, Westlands, Rongai):";
//       await logMessage(from, "bot", qLoc);
//       return await sendWhatsApp(from, qLoc);

//     case "checkout_location":
//       const cart = session.cart as any[];
//       if (!cart || cart.length === 0)
//         return await sendWhatsApp(from, "🛒 Your cart is empty.");

//       const total = cart.reduce((sum, i) => sum + (Number(i.price) || 0), 0);

//       // Save Order to DB
//       await createOrder({
//         name: session.name || "Customer",
//         phone: session.phoneInput || from,
//         location: text,
//         transCode: `WA_${crypto.randomUUID().slice(0, 8)}`,
//         items: cart.map((item) => ({
//           id: item.id || item.productId,
//           productId: item.id || item.productId,
//           name: item.name,
//           price: Number(item.price),
//           image: item.image || item.images?.[0],
//         })),
//         total: total,
//       });

//       await prisma.chatSession.update({
//         where: { phone: from },
//         data: { state: "awaiting_payment", location: text },
//       });

//       const orderSummary = `✅ *Order Received!*\n\nTotal: KES ${total}\n\nPlease pay to Till: *5293638*\n\nReply *PAID* once you receive the M-Pesa confirmation.`;
//       await logMessage(from, "bot", orderSummary);
//       return await sendWhatsApp(from, orderSummary);

//     default:
//       return await sendWhatsApp(
//         from,
//         "I'm waiting for your payment. Reply *PAID* when done!",
//       );
//   }
// }

// async function handleViewCart(from: string, session: any) {
//   const cart = session.cart as any[];
//   if (!cart || cart.length === 0)
//     return await sendWhatsApp(from, "🛒 Your cart is empty.");

//   // Send product images in the cart
//   for (const item of cart) {
//     await sendWhatsApp(from, {
//       image:
//         item.image || item.images?.[0] || "https://placeholder.com/item.jpg",
//       caption: `*${item.name}* - KES ${item.price}`,
//     });
//   }

//   const total = cart.reduce((sum, i) => sum + (Number(i.price) || 0), 0);
//   const cartSummary = `💰 *Total: KES ${total}*\n\nType *checkout* to proceed to delivery details!`;
//   await logMessage(from, "bot", cartSummary);
//   return await sendWhatsApp(from, cartSummary);
// }

// async function handleInitiateCheckout(from: string, session: any) {
//   const cart = session.cart as any[];
//   if (!cart || cart.length === 0)
//     return await sendWhatsApp(from, "🛒 Cart is empty.");

//   await prisma.chatSession.update({
//     where: { phone: from },
//     data: { state: "checkout_name" },
//   });

//   const checkStart =
//     "🧾 *Checkout Initiation*\n\nPlease enter your *Full Name* for delivery:";
//   await logMessage(from, "bot", checkStart);
//   return await sendWhatsApp(from, checkStart);
// }

// export async function sendWhatsApp(
//   to: string,
//   content: string | { image: string; caption: string },
// ) {
//   const payload: any = { messaging_product: "whatsapp", to };

//   if (typeof content === "string") {
//     payload.type = "text";
//     payload.text = { body: content };
//   } else {
//     payload.type = "image";
//     payload.image = { link: content.image, caption: content.caption };
//   }

//   const response = await fetch(
//     `https://graph.facebook.com/v21.0/${process.env.WHATSAPP_PHONE_NUMBER_ID}/messages`,
//     {
//       method: "POST",
//       headers: {
//         Authorization: `Bearer ${process.env.WHATSAPP_TOKEN}`,
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify(payload),
//     },
//   );

//   if (!response.ok) {
//     const err = await response.json();
//     console.error("🛑 Meta API Error:", JSON.stringify(err, null, 2));
//   }
// }

import { GoogleGenerativeAI } from "@google/generative-ai";
import prisma from "../../../lib/prisma";
import { getOrCreateSession, addToCart, clearCart } from "./cart";
import { createOrder } from "@/actions/order";
import crypto from "crypto";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

/**
 * HELPER: Logs every interaction to ChatHistory table for AI context.
 */
async function logMessage(
  phone: string,
  role: "user" | "bot",
  message: string,
) {
  try {
    await prisma.chatHistory.create({
      data: { phone, role, message },
    });
  } catch (err) {
    console.error("⚠️ History log failed:", err);
  }
}

export async function handleCustomerChat(message: any) {
  const { id: messageId, from } = message;
  const userText = message.text?.body || "";

  try {
    // 1. IDEMPOTENCY LOCK
    try {
      await prisma.processedMessage.create({ data: { id: messageId } });
    } catch (err: any) {
      if (err.code === "P2002") return;
      throw err;
    }

    await logMessage(from, "user", userText);

    // 2. SESSION & STATE RETRIEVAL
    let session = await getOrCreateSession(from);

    // 3. CHECKOUT STATE MACHINE
    if (session.state !== "browsing") {
      if (
        session.state === "awaiting_payment" &&
        userText.toLowerCase().includes("paid")
      ) {
        await clearCart(from);
        const successMsg =
          "🎉 *Hongera!* 🎉\n\nPayment received! Your order is being prepped with love. We'll contact you with delivery details soon. Thank you for choosing Lyvera! 🚚✨";
        await logMessage(from, "bot", successMsg);
        return await sendWhatsApp(from, successMsg);
      }
      return await handleCheckoutFlow(from, session, userText);
    }

    // 4. DIRECT COMMAND OVERRIDES
    const cmd = userText.toLowerCase().trim();
    if (cmd === "cart") return await handleViewCart(from, session);
    if (cmd === "checkout") return await handleInitiateCheckout(from, session);

    // 5. AI BROWSING & PRODUCT DISCOVERY
    const products = await prisma.product.findMany({
      where: { isSold: false },
      take: 15,
    });

    const productContext = products
      .map((p) => `- [ID: ${p.id}] ${p.name} | KES ${p.price}`)
      .join("\n");

    const history = await prisma.chatHistory.findMany({
      where: { phone: from },
      orderBy: { createdAt: "desc" },
      take: 8, // Increased history to help AI distinguish location vs name
    });

    const historyContext = history
      .map((h) => `${h.role === "user" ? "User" : "Bot"}: ${h.message}`)
      .reverse()
      .join("\n");

    const prompt = `
      You are 'Lyvera Bot', the shopping assistant for Lyvera Store in Nairobi. 
      Tone: Helpful, trendy, and slightly Kenyan.

      [IMPORTANT IDENTITY RULE]
      - Locations mentioned in history (e.g., Donny, Westlands, CBD) are NOT the user's name. 
      - Do NOT address the user by a location name. Use "Customer" or "Sasa" if unknown.

      [GOAL]
      Support single or multiple item selections.

      [INVENTORY]
      ${productContext}

      [BEHAVIOR]
      1. To add items, return "ADD_TO_CART" and a list of IDs.
      2. To show pictures, return the first ID and "NONE".
      3. If they say "both" or "all", identify all relevant IDs from inventory.

      [OUTPUT FORMAT - JSON ONLY]
      { 
        "reply": "your response", 
        "productIds": ["id1", "id2"], 
        "action": "ADD_TO_CART | VIEW_CART | CHECKOUT | NONE" 
      }

      HISTORY:
      ${historyContext}

      User Query: "${userText}"
    `;

    // 6. AI GENERATION (Model Queue)
    let responseText = "";
    const models = [
      "gemini-3.1-flash-lite-preview",
      "gemini-2.5-flash",
      "gemini-2.0-flash",
    ];

    for (const modelName of models) {
      try {
        const model = genAI.getGenerativeModel({ model: modelName });
        const result = await model.generateContent(prompt);
        responseText = result.response
          .text()
          .replace(/```json|```/g, "")
          .trim();
        if (responseText) break;
      } catch (err) {
        console.warn(`⚠️ ${modelName} failed.`);
      }
    }

    if (!responseText) throw new Error("All AI models failed.");
    const { reply, productIds, action } = JSON.parse(responseText);

    // 7. MULTI-ACTION ROUTER
    if (action === "ADD_TO_CART" && Array.isArray(productIds)) {
      let addedNames = [];
      for (const id of productIds) {
        const product = products.find((p) => p.id === id);
        if (product) {
          await addToCart(from, product);
          addedNames.push(product.name);
        }
      }

      if (addedNames.length > 0) {
        session = await getOrCreateSession(from); // Refresh session to update cart
        const botReply = `🛒 Added *${addedNames.join(", ")}* to your cart! Type *cart* to see it.`;
        await logMessage(from, "bot", botReply);
        return await sendWhatsApp(from, botReply);
      }
    }

    // 8. IMAGE RESPONSE (For the first ID in the list)
    const displayId = Array.isArray(productIds) ? productIds[0] : productIds;
    const selectedProduct = products.find((p) => p.id === displayId);
    if (selectedProduct?.images?.[0]) {
      await logMessage(
        from,
        "bot",
        `[Sent Image: ${selectedProduct.name}] ${reply}`,
      );
      return await sendWhatsApp(from, {
        image: selectedProduct.images[0],
        caption: `*${selectedProduct.name}*\n💰 KES ${selectedProduct.price}\n\n${reply}`,
      });
    }

    await logMessage(from, "bot", reply);
    await sendWhatsApp(from, reply);
  } catch (error) {
    console.error("🛑 Error:", error);
    await prisma.processedMessage
      .delete({ where: { id: messageId } })
      .catch(() => {});
  }
}

async function handleCheckoutFlow(from: string, session: any, text: string) {
  switch (session.state) {
    case "checkout_name":
      await prisma.chatSession.update({
        where: { phone: from },
        data: { name: text, state: "checkout_phone" },
      });
      const qPhone = `📱 Great ${text}! Enter your *M-Pesa number*:`;
      await logMessage(from, "bot", qPhone);
      return await sendWhatsApp(from, qPhone);

    case "checkout_phone":
      await prisma.chatSession.update({
        where: { phone: from },
        data: { phoneInput: text, state: "checkout_location" },
      });
      const qLoc = "📍 Enter your *Delivery Location*:";
      await logMessage(from, "bot", qLoc);
      return await sendWhatsApp(from, qLoc);

    case "checkout_location":
      const cart = session.cart as any[];
      if (!cart?.length)
        return await sendWhatsApp(from, "🛒 Your cart is empty.");

      const total = cart.reduce((sum, i) => sum + (Number(i.price) || 0), 0);

      await createOrder({
        name: session.name || "Customer",
        phone: session.phoneInput || from,
        location: text,
        transCode: `WA_${crypto.randomUUID().slice(0, 8)}`,
        items: cart.map((item) => ({
          id: item.id || item.productId,
          productId: item.id || item.productId,
          name: item.name,
          price: Number(item.price),
          size: item.size || "Standard", // FIX: Prevents Prisma error
          image: item.image || item.images?.[0],
        })),
        total,
      });

      await prisma.chatSession.update({
        where: { phone: from },
        data: { state: "awaiting_payment", location: text },
      });

      const orderSummary = `✅ *Order Received!*\n\nTotal: KES ${total}\n\nPay Till: *5293638*\n\nReply *PAID* when done.`;
      await logMessage(from, "bot", orderSummary);
      return await sendWhatsApp(from, orderSummary);

    default:
      return await sendWhatsApp(from, "Please reply *PAID* after paying!");
  }
}

async function handleViewCart(from: string, session: any) {
  const cart = session.cart as any[];
  if (!cart?.length) return await sendWhatsApp(from, "🛒 Your cart is empty.");

  for (const item of cart) {
    await sendWhatsApp(from, {
      image:
        item.image || item.images?.[0] || "https://placeholder.com/item.jpg",
      caption: `*${item.name}* - KES ${item.price}`,
    });
  }

  const total = cart.reduce((sum, i) => sum + (Number(i.price) || 0), 0);
  const cartSummary = `💰 *Total: KES ${total}*\n\nType *checkout* to proceed!`;
  await logMessage(from, "bot", cartSummary);
  return await sendWhatsApp(from, cartSummary);
}

async function handleInitiateCheckout(from: string, session: any) {
  const cart = session.cart as any[];
  if (!cart?.length) return await sendWhatsApp(from, "🛒 Cart is empty.");

  await prisma.chatSession.update({
    where: { phone: from },
    data: { state: "checkout_name" },
  });

  const checkStart = "🧾 Enter your *Full Name* for delivery:";
  await logMessage(from, "bot", checkStart);
  return await sendWhatsApp(from, checkStart);
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

  if (!response.ok) {
    const err = await response.json();
    console.error("🛑 Meta Error:", JSON.stringify(err, null, 2));
  }
}

// export async function sendWhatsApp(
//   to: string,
//   content: string | { image: string; caption: string },
//   retries = 2, // Attempt twice if it fails
// ) {
//   const payload: any = { messaging_product: "whatsapp", to };

//   if (typeof content === "string") {
//     payload.type = "text";
//     payload.text = { body: content };
//   } else {
//     payload.type = "image";
//     payload.image = { link: content.image, caption: content.caption };
//   }

//   for (let i = 0; i <= retries; i++) {
//     const controller = new AbortController();
//     const timeoutId = setTimeout(() => controller.abort(), 15000); // 15s timeout per attempt

//     try {
//       const response = await fetch(
//         `https://graph.facebook.com/v21.0/${process.env.WHATSAPP_PHONE_NUMBER_ID}/messages`,
//         {
//           method: "POST",
//           signal: controller.signal,
//           headers: {
//             Authorization: `Bearer ${process.env.WHATSAPP_TOKEN}`,
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify(payload),
//         },
//       );

//       clearTimeout(timeoutId);

//       if (response.ok) {
//         return await response.json();
//       }

//       // If we get here, Meta responded but with an error (e.g., 400, 401)
//       const err = await response.json();
//       console.error(`🛑 Meta API Error (${to}):`, JSON.stringify(err, null, 2));
//       break; // Don't retry if the error is a logic/auth error (4xx)
//     } catch (error: any) {
//       clearTimeout(timeoutId);

//       const isTimeout =
//         error.name === "AbortError" || error.code === "UND_ERR_CONNECT_TIMEOUT";

//       if (isTimeout && i < retries) {
//         console.warn(
//           `⚠️ Connection timeout to ${to}. Retrying (${i + 1}/${retries})...`,
//         );
//         // Wait 1 second before retrying
//         await new Promise((res) => setTimeout(res, 1000));
//         continue;
//       }

//       console.error(`❌ Network Failure for ${to}:`, error.message);
//       throw error; // Re-throw if all retries fail
//     }
//   }
// }
