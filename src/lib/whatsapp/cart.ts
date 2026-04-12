import prisma from "../../../lib/prisma";

export async function getOrCreateSession(phone: string) {
  return await prisma.chatSession.upsert({
    where: { phone },
    update: {}, // Keep existing data
    create: { phone, cart: [] },
  });
}

// src/lib/whatsapp/cart.ts
// export async function addToCart(phone: string, product: any) {
//   // ADD THIS LOG
//   console.log(
//     "DEBUG: Adding product to cart:",
//     JSON.stringify(product, null, 2),
//   );

//   const session = await getOrCreateSession(phone);
//   const currentCart = (session.cart as any[]) || [];

//   const normalizedItem = {
//     id: product.id,
//     name: product.name,
//     price: product.price,
//     image: product.images?.[0] || "https://placeholder-url.com/default.jpg",
//     size: product.size || "Standard",
//   };

//   if (currentCart.find((i) => i.id === normalizedItem.id)) return;

//   return await prisma.chatSession.update({
//     where: { phone },
//     data: { cart: [...currentCart, normalizedItem] },
//   });
// }

export async function addToCart(phone: string, product: any) {
  if (!product || !product.id) {
    console.error("DEBUG: Cannot add invalid product to cart:", product);
    return;
  }

  const session = await getOrCreateSession(phone);

  // Ensure we are working with an array
  const currentCart = Array.isArray(session.cart)
    ? (session.cart as any[])
    : [];

  // Check if item already exists to prevent duplicates
  if (currentCart.find((i) => i.id === product.id)) {
    console.log("DEBUG: Item already in cart, skipping.");
    return;
  }

  const normalizedItem = {
    id: product.id,
    name: product.name,
    price: Number(product.price) || 0, // Ensure price is a number
    image:
      product.images && product.images[0]
        ? product.images[0]
        : "https://placeholder-url.com/default.jpg",
    size: product.size || "Standard",
  };

  // Explicitly create a new array reference
  const updatedCart = [...currentCart, normalizedItem];

  console.log(
    "DEBUG: Updating cart for",
    phone,
    "with",
    updatedCart.length,
    "items",
  );

  return await prisma.chatSession.update({
    where: { phone },
    data: {
      cart: updatedCart,
    },
  });
}

export async function clearCart(phone: string) {
  return await prisma.chatSession.update({
    where: { phone },
    data: {
      cart: [],
      state: "browsing",
      name: null,
      phoneInput: null,
      location: null,
    },
  });
}
