// import "dotenv/config";
// import pg from "pg";
// import { PrismaPg } from "@prisma/adapter-pg";
// // 1. Import from the FOLDER, not the specific client.ts file
// import { PrismaClient } from "@prisma/client";

// const { Pool } = pg;
// const pool = new Pool({ connectionString: process.env.DATABASE_URL });
// const adapter = new PrismaPg(pool);

// // 2. This should now work as a standard constructor
// const prisma = new PrismaClient({ adapter });
// async function main() {
//   console.log("Starting seed...");

//   const products = [
//     {
//       name: "Vintage 90s Varsity Jacket",
//       description: "Authentic leather sleeves, oversized fit.",
//       price: 4500,
//       category: "Outerwear",
//       size: "XL",
//       images: ["https://images.unsplash.com/photo-1551028719-00167b16eac5"],
//       isSold: false,
//     },
//     {
//       name: "Retro Argyle Sweater",
//       description: "Soft wool blend, perfect for layering.",
//       price: 2200,
//       category: "Tops",
//       size: "M",
//       images: ["https://images.unsplash.com/photo-1611312449412-6cefac5c684f"],
//       isSold: false,
//     },
//     {
//       name: "Classic Levi 501s",
//       description: "Straight leg, light wash denim.",
//       price: 3500,
//       category: "Bottoms",
//       size: "32",
//       images: ["https://images.unsplash.com/photo-1542272604-787c3835535d"],
//       isSold: true,
//     },
//   ];

//   for (const p of products) {
//     const product = await prisma.product.create({
//       data: p,
//     });
//     console.log(`Created product with id: ${product.id}`);
//   }

//   console.log("Seed finished successfully!");
// }

// main()
//   .catch((e) => {
//     console.error(e);
//     process.exit(1);
//   })
//   .finally(async () => {
//     await prisma.$disconnect();
//   });
