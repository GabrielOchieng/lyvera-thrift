import prisma from "../../../lib/prisma";

export async function getOrCreateSession(phone: string) {
  return await prisma.chatSession.upsert({
    where: { phone },
    update: {}, // Keep existing data
    create: { phone, cart: [] },
  });
}

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

export async function removeFromCart(phone: string, productId: string) {
  const session = await prisma.chatSession.findUnique({ where: { phone } });
  if (!session || !Array.isArray(session.cart)) return null;

  // Filter out the item matching the ID
  const currentCart = session.cart as any[];
  const updatedCart = currentCart.filter(
    (item) => item.id !== productId && item.productId !== productId,
  );

  return await prisma.chatSession.update({
    where: { phone },
    data: { cart: updatedCart },
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
