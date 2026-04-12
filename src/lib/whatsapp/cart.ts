import prisma from "../../../lib/prisma";

export async function getOrCreateSession(phone: string) {
  return await prisma.chatSession.upsert({
    where: { phone },
    update: {}, // Keep existing data
    create: { phone, cart: [] },
  });
}

// export async function addToCart(phone: string, product: any) {
//   const session = await getOrCreateSession(phone);
//   const cart = (session.cart as any[]) || [];
//   cart.push(product);

//   return await prisma.chatSession.update({
//     where: { phone },
//     data: { cart },
//   });
// }

// src/lib/whatsapp/cart.ts
export async function addToCart(phone: string, product: any) {
  // ADD THIS LOG
  console.log(
    "DEBUG: Adding product to cart:",
    JSON.stringify(product, null, 2),
  );

  const session = await getOrCreateSession(phone);
  const currentCart = (session.cart as any[]) || [];

  const normalizedItem = {
    id: product.id,
    name: product.name,
    price: product.price,
    image: product.images?.[0] || "https://placeholder-url.com/default.jpg",
    size: product.size || "Standard",
  };

  if (currentCart.find((i) => i.id === normalizedItem.id)) return;

  return await prisma.chatSession.update({
    where: { phone },
    data: { cart: [...currentCart, normalizedItem] },
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
