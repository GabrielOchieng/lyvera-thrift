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
//     // 1. IDEMPOTENCY LOCK
//     try {
//       await prisma.processedMessage.create({ data: { id: messageId } });
//     } catch (err: any) {
//       if (err.code === "P2002") return;
//       throw err;
//     }

//     await logMessage(from, "user", userText);

//     // 2. SESSION & STATE RETRIEVAL
//     let session = await getOrCreateSession(from);

//     // 3. CHECKOUT STATE MACHINE
//     if (session.state !== "browsing") {
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
//       return await handleCheckoutFlow(from, session, userText);
//     }

//     // 4. DIRECT COMMAND OVERRIDES
//     const cmd = userText.toLowerCase().trim();
//     if (cmd === "cart") return await handleViewCart(from, session);
//     if (cmd === "checkout") return await handleInitiateCheckout(from, session);

//     // 5. AI BROWSING & PRODUCT DISCOVERY
//     const products = await prisma.product.findMany({
//       where: { isSold: false },
//       take: 15,
//     });

//     const productContext = products
//       .map((p) => `- [ID: ${p.id}] ${p.name} | KES ${p.price}`)
//       .join("\n");

//     const history = await prisma.chatHistory.findMany({
//       where: { phone: from },
//       orderBy: { createdAt: "desc" },
//       take: 8,
//     });

//     const historyContext = history
//       .map((h) => `${h.role === "user" ? "User" : "Bot"}: ${h.message}`)
//       .reverse()
//       .join("\n");

//     const prompt = `
//       You are 'Lyvera Bot', the shopping assistant for Lyvera Store in Nairobi.
//       Tone: Helpful, trendy, and slightly Kenyan.

//       [BRAND ASSETS]
//       - Official Website: ${process.env.NEXT_PUBLIC_APP_URL || "https://lyverathrifts.boutique"}
//       - Phone/WhatsApp: +254 745 046 468
//       - Support Email: lyverathrifts@gmail.com
//       - Location: Nairobi, Kenya

//       [IMPORTANT IDENTITY RULE]
//       - Locations mentioned in history (e.g., Donny, Westlands, CBD) are NOT the user's name.
//       - Do NOT address the user by a location name. Use "Customer" or "Sasa" if unknown.

//       [GOAL]
//       Support single or multiple item selections.

//       [INVENTORY]
//       ${productContext}

//       [BEHAVIOR]
//       1. To add items, return "ADD_TO_CART" and a list of IDs.
//       2. To show pictures, return all matching product IDs in the productIds array, and action "NONE".
//       3. If they say "both", "all", "multiple", or ask for selections that match multiple criteria, collect all relevant IDs.

//       [OUTPUT FORMAT - JSON ONLY]
//       {
//         "reply": "your conversation response",
//         "productIds": ["id1", "id2"],
//         "action": "ADD_TO_CART | VIEW_CART | CHECKOUT | NONE"
//       }

//       HISTORY:
//       ${historyContext}

//       User Query: "${userText}"
//     `;

//     // 6. AI GENERATION (Model Queue)
//     let responseText = "";
//     const models = [
//       "gemini-3.1-flash-lite",
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
//         console.warn(`⚠️ ${modelName} failed.`);
//       }
//     }

//     if (!responseText) throw new Error("All AI models failed.");
//     const { reply, productIds, action } = JSON.parse(responseText);

//     // 7. MULTI-ACTION ROUTER: ADD TO CART
//     if (action === "ADD_TO_CART" && Array.isArray(productIds)) {
//       let addedNames = [];
//       for (const id of productIds) {
//         const product = products.find((p) => p.id === id);
//         if (product) {
//           await addToCart(from, product);
//           addedNames.push(product.name);
//         }
//       }

//       if (addedNames.length > 0) {
//         session = await getOrCreateSession(from);
//         const botReply = `🛒 Added *${addedNames.join(", ")}* to your cart! Type *cart* to see it.`;
//         await logMessage(from, "bot", botReply);
//         return await sendWhatsApp(from, botReply);
//       }
//     }

//     // 8. DYNAMIC MULTI-IMAGE RESPONSE
//     if (Array.isArray(productIds) && productIds.length > 0) {
//       await logMessage(from, "bot", reply);
//       await sendWhatsApp(from, reply);

//       for (const id of productIds) {
//         const selectedProduct = products.find((p) => p.id === id);
//         if (selectedProduct?.images?.[0]) {
//           await logMessage(
//             from,
//             "bot",
//             `[Sent Image: ${selectedProduct.name}]`,
//           );
//           await sendWhatsApp(from, {
//             image: selectedProduct.images[0],
//             caption: `*${selectedProduct.name}*\n💰 KES ${selectedProduct.price}`,
//           });
//           await new Promise((r) => setTimeout(r, 800));
//         }
//       }
//       return;
//     }

//     // Fallback text response
//     await logMessage(from, "bot", reply);
//     await sendWhatsApp(from, reply);
//   } catch (error) {
//     console.error("🛑 Error:", error);
//     await prisma.processedMessage
//       .delete({ where: { id: messageId } })
//       .catch(() => {});
//   }
// }

// async function handleCheckoutFlow(from: string, session: any, text: string) {
//   switch (session.state) {
//     case "checkout_name":
//       await prisma.chatSession.update({
//         where: { phone: from },
//         data: { name: text, state: "checkout_phone" },
//       });
//       const qPhone = `📱 Great ${text}! Enter your *M-Pesa number*:`;
//       await logMessage(from, "bot", qPhone);
//       return await sendWhatsApp(from, qPhone);

//     case "checkout_phone":
//       await prisma.chatSession.update({
//         where: { phone: from },
//         data: { phoneInput: text, state: "checkout_location" },
//       });
//       const qLoc = "📍 Enter your *Delivery Location*:";
//       await logMessage(from, "bot", qLoc);
//       return await sendWhatsApp(from, qLoc);

//     case "checkout_location":
//       const cart = session.cart as any[];
//       if (!cart?.length)
//         return await sendWhatsApp(from, "🛒 Your cart is empty.");

//       const total = cart.reduce((sum, i) => sum + (Number(i.price) || 0), 0);

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
//           size: item.size || "Standard",
//           image: item.image || item.images?.[0],
//         })),
//         total,
//       });

//       await prisma.chatSession.update({
//         where: { phone: from },
//         data: { state: "awaiting_payment", location: text },
//       });

//       const orderSummary = `✅ *Order Received!*\n\nTotal: KES ${total}\n\nPay to Pochi la Biashara: *0745046468*\n\nReply *PAID* when done.`;
//       await logMessage(from, "bot", orderSummary);
//       return await sendWhatsApp(from, orderSummary);

//     default:
//       return await sendWhatsApp(from, "Please reply *PAID* after paying!");
//   }
// }

// async function handleViewCart(from: string, session: any) {
//   const cart = session.cart as any[];
//   if (!cart?.length) return await sendWhatsApp(from, "🛒 Your cart is empty.");

//   for (const item of cart) {
//     await sendWhatsApp(from, {
//       image:
//         item.image || item.images?.[0] || "https://placeholder.com/item.jpg",
//       caption: `*${item.name}* - KES ${item.price}`,
//     });
//   }

//   const total = cart.reduce((sum, i) => sum + (Number(i.price) || 0), 0);
//   const cartSummary = `💰 *Total: KES ${total}*\n\nType *checkout* to proceed!`;
//   await logMessage(from, "bot", cartSummary);
//   return await sendWhatsApp(from, cartSummary);
// }

// async function handleInitiateCheckout(from: string, session: any) {
//   const cart = session.cart as any[];
//   if (!cart?.length) return await sendWhatsApp(from, "🛒 Cart is empty.");

//   await prisma.chatSession.update({
//     where: { phone: from },
//     data: { state: "checkout_name" },
//   });

//   const checkStart = "🧾 Enter your *Full Name* for delivery:";
//   await logMessage(from, "bot", checkStart);
//   return await sendWhatsApp(from, checkStart);
// }

// // ==========================================================
// // FIXED: sendWhatsApp function body with text wrapper object
// // ==========================================================
// export async function sendWhatsApp(
//   to: string,
//   content: string | { image: string; caption: string },
// ) {
//   const payload: any = { messaging_product: "whatsapp", to };

//   if (typeof content === "string") {
//     payload.type = "text";
//     payload.text = { body: content }; // FIXED: Wrapped correctly so it is never null
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
//     console.error("🛑 Meta Error:", JSON.stringify(err, null, 2));
//   }
// }

import { GoogleGenerativeAI } from "@google/generative-ai";
import prisma from "../../../lib/prisma";
import {
  getOrCreateSession,
  addToCart,
  removeFromCart,
  clearCart,
} from "./cart";
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

    // Dynamic Context mapping for items currently held inside the user's active cart session
    const userCartItems = (session.cart as any[]) || [];
    const cartContext =
      userCartItems.length > 0
        ? userCartItems
            .map(
              (i) =>
                `- [ID: ${i.id || i.productId}] ${i.name} | KES ${i.price}`,
            )
            .join("\n")
        : "User's cart is currently empty.";

    const history = await prisma.chatHistory.findMany({
      where: { phone: from },
      orderBy: { createdAt: "desc" },
      take: 8,
    });

    const historyContext = history
      .map((h) => `${h.role === "user" ? "User" : "Bot"}: ${h.message}`)
      .reverse()
      .join("\n");

    const prompt = `
      You are 'Lyvera Bot', the shopping assistant for Lyvera Store in Nairobi. 
      Tone: Helpful, trendy, and slightly Kenyan.

      [BRAND ASSETS]
      - Official Website: ${process.env.NEXT_PUBLIC_APP_URL || "https://lyverathrifts.boutique"}
      - Phone/WhatsApp: +254 745 046 468
      - Support Email: lyverathrifts@gmail.com
      - Location: Nairobi, Kenya

      [IMPORTANT IDENTITY RULE]
      - Locations mentioned in history (e.g., Donny, Westlands, CBD) are NOT the user's name. 
      - Do NOT address the user by a location name. Use "Customer" or "Sasa" if unknown.

      [INVENTORY]
      ${productContext}

      [USER'S CURRENT CART CONTENT]
      ${cartContext}

      [BEHAVIOR & ACTIONS]
      1. To add items, return action "ADD_TO_CART" and a list of matching product IDs.
      2. To remove items (e.g., "remove the jacket", "take out item 2", "punguza id1"), identify the product ID from the [USER'S CURRENT CART CONTENT], set action to "REMOVE_FROM_CART", and supply the matching IDs inside productIds.
      3. To show pictures, return all matching product IDs in the productIds array, and action "NONE".
      4. If they say "both", "all", "multiple", or ask for selections that match multiple criteria, collect all relevant IDs.

      [OUTPUT FORMAT - JSON ONLY]
      { 
        "reply": "your conversation response explaining what you changed or found", 
        "productIds": ["id1", "id2"], 
        "action": "ADD_TO_CART | REMOVE_FROM_CART | VIEW_CART | CHECKOUT | NONE" 
      }

      HISTORY:
      ${historyContext}

      User Query: "${userText}"
    `;

    // 6. AI GENERATION (Model Queue)
    let responseText = "";
    const models = [
      "gemini-3.1-flash-lite",
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

    // 7. MULTI-ACTION ROUTER: ADD TO CART
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
        const botReply = `🛒 Added *${addedNames.join(", ")}* to your cart! Type *cart* to see it.`;
        await logMessage(from, "bot", botReply);
        return await sendWhatsApp(from, botReply);
      }
    }

    // MULTI-ACTION ROUTER: REMOVE FROM CART
    if (action === "REMOVE_FROM_CART" && Array.isArray(productIds)) {
      let removedNames = [];
      for (const id of productIds) {
        const itemInCart = userCartItems.find(
          (item) => item.id === id || item.productId === id,
        );
        if (itemInCart) {
          await removeFromCart(from, id);
          removedNames.push(itemInCart.name);
        }
      }

      if (removedNames.length > 0) {
        const botReply = `🗑️ Removed *${removedNames.join(", ")}* from your cart.\n\n${reply}`;
        await logMessage(from, "bot", botReply);
        return await sendWhatsApp(from, botReply);
      }
    }

    // 8. DYNAMIC MULTI-IMAGE RESPONSE
    if (
      action === "NONE" &&
      Array.isArray(productIds) &&
      productIds.length > 0
    ) {
      await logMessage(from, "bot", reply);
      await sendWhatsApp(from, reply);

      for (const id of productIds) {
        const selectedProduct = products.find((p) => p.id === id);
        if (selectedProduct?.images?.[0]) {
          await logMessage(
            from,
            "bot",
            `[Sent Image: ${selectedProduct.name}]`,
          );
          await sendWhatsApp(from, {
            image: selectedProduct.images[0],
            caption: `*${selectedProduct.name}*\n💰 KES ${selectedProduct.price}`,
          });
          await new Promise((r) => setTimeout(r, 800));
        }
      }
      return;
    }

    // Fallback text response
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
          size: item.size || "Standard",
          image: item.image || item.images?.[0],
        })),
        total,
      });

      await prisma.chatSession.update({
        where: { phone: from },
        data: { state: "awaiting_payment", location: text },
      });

      const orderSummary = `✅ *Order Received!*\n\nTotal: KES ${total}\n\nPay to Pochi la Biashara: *0745046468*\n\nReply *PAID* when done.`;
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
