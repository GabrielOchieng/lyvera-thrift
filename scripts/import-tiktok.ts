// // // // import { PrismaClient } from "@prisma/client";
// // // // import { PrismaPg } from "@prisma/adapter-pg";
// // // // import * as fs from "fs";
// // // // import * as dotenv from "dotenv";

// // // // dotenv.config();

// // // // const adapter = new PrismaPg({
// // // //   connectionString: process.env.DATABASE_URL!,
// // // // });
// // // // const prisma = new PrismaClient({ adapter });

// // // // async function main() {
// // // //   if (!fs.existsSync("./tiktok-data.json")) {
// // // //     console.error("❌ Error: tiktok-data.json not found.");
// // // //     return;
// // // //   }

// // // //   const data = JSON.parse(fs.readFileSync("./tiktok-data.json", "utf-8"));
// // // //   console.log(`🚀 Processing ${data.length} items...`);

// // // //   for (const item of data) {
// // // //     const text = item.text || "";

// // // //     // --- 1. SMART PRICE EXTRACTION ---
// // // //     let price = 0;

// // // //     // Pattern A: Look for numbers following price markers (Ksh, @, price)
// // // //     // Handles ranges by grabbing the first number: "Ksh 450-700" -> 450
// // // //     const priceWithMarker = text.match(/(?:ksh|ksh\.|@|price|at)\s?(\d{3,4})/i);

// // // //     // Pattern B: Look for standalone 3-4 digit numbers that AREN'T phone numbers
// // // //     // This regex ensures the number isn't preceded by '07' or '01' (common KE phone starts)
// // // //     const standalonePrice = text.match(/(?<!(07|01|254))\b(\d{3,4})\b/);

// // // //     if (priceWithMarker) {
// // // //       price = parseFloat(priceWithMarker[1]);
// // // //     } else if (standalonePrice) {
// // // //       price = parseFloat(standalonePrice[2]);
// // // //     }

// // // //     // --- 2. DYNAMIC THUMBNAIL LOGIC ---
// // // //     // Extract video ID to build a reliable thumbnail URL if coverUrl is missing
// // // //     const videoId = item.webVideoUrl?.split("/video/")[1]?.split("?")[0];
// // // //     const itemImage =
// // // //       item.coverUrl ||
// // // //       `https://www.tiktok.com/api/img/?itemId=${videoId}&location=0`;

// // // //     // --- 3. NAME CLEANING ---
// // // //     const rawName = text.split("\n")[0] || "Lyvera Thrift Piece";
// // // //     const cleanName = rawName
// // // //       .replace(/[#@].*$/g, "") // Remove hashtags/mentions
// // // //       .replace(/(07|01)\d{8}/g, "") // Remove 10-digit phone numbers
// // // //       .replace(/\d{2,}\.\d{2,}\.\d{2,}/g, "") // Remove dotted phone numbers like 07.45...
// // // //       .trim();

// // // //     try {
// // // //       // Using upsert so you can run this script repeatedly without duplicates
// // // //       await prisma.product.upsert({
// // // //         where: { id: item.id || videoId },
// // // //         update: {
// // // //           price: price,
// // // //           images: [itemImage],
// // // //         },
// // // //         create: {
// // // //           id: item.id || videoId,
// // // //           name: cleanName.substring(0, 50) || "New Arrival",
// // // //           description: text,
// // // //           price: price,
// // // //           size: "Check Description",
// // // //           images: [itemImage],
// // // //           videoUrl: item.webVideoUrl,
// // // //           isSold: false,
// // // //           category: {
// // // //             connectOrCreate: {
// // // //               where: { name: "New Arrivals" },
// // // //               create: { name: "New Arrivals" },
// // // //             },
// // // //           },
// // // //         },
// // // //       });
// // // //       console.log(
// // // //         `✅ KES ${price.toString().padEnd(4)} | Imported: ${cleanName}`,
// // // //       );
// // // //     } catch (e) {
// // // //       console.log(`❌ Error importing: ${cleanName}`);
// // // //     }
// // // //   }
// // // // }

// // // // main()
// // // //   .catch((e) => console.error(e))
// // // //   .finally(async () => {
// // // //     await prisma.$disconnect();
// // // //     console.log("🏁 Import process finished.");
// // // //   });

// // // import { PrismaClient } from "@prisma/client";
// // // import { PrismaPg } from "@prisma/adapter-pg";
// // // import * as fs from "fs";
// // // import * as dotenv from "dotenv";

// // // dotenv.config();

// // // const adapter = new PrismaPg({
// // //   connectionString: process.env.DATABASE_URL!,
// // // });
// // // const prisma = new PrismaClient({ adapter });

// // // async function main() {
// // //   if (!fs.existsSync("./tiktok-data.json")) {
// // //     console.error("❌ Error: tiktok-data.json not found.");
// // //     return;
// // //   }

// // //   const data = JSON.parse(fs.readFileSync("./tiktok-data.json", "utf-8"));
// // //   console.log(`🚀 Processing ${data.length} items...`);

// // //   let skippedCount = 0;
// // //   let importedCount = 0;

// // //   for (const item of data) {
// // //     const text = item.text || "";

// // //     // --- 1. SMART PRICE EXTRACTION ---
// // //     let price = 0;
// // //     const priceWithMarker = text.match(/(?:ksh|ksh\.|@|price|at)\s?(\d{3,4})/i);
// // //     const standalonePrice = text.match(/(?<!(07|01|254|7|1))\b(\d{3,4})\b/);

// // //     if (priceWithMarker) {
// // //       price = parseFloat(priceWithMarker[1]);
// // //     } else if (standalonePrice) {
// // //       price = parseFloat(standalonePrice[2]);
// // //     }

// // //     // --- 2. FILTER: SKIP ITEMS WITH NO PRICE ---
// // //     if (price === 0) {
// // //       console.log(`⚠️  Skipping (No Price): ${text.substring(0, 30)}...`);
// // //       skippedCount++;
// // //       continue; // Move to the next item, don't send to DB
// // //     }

// // //     // --- 3. FIX IMAGE 403 FORBIDDEN ---
// // //     // We construct a direct CDN link using the video ID.
// // //     // This is generally more stable for external display.
// // //     const videoId = item.webVideoUrl?.split("/video/")[1]?.split("?")[0];
// // //     const itemImage = `https://p16-sign-va.tiktokcdn.com/obj/tos-maliva-p-0068/${videoId}~tplv-tiktok-play.jpeg`;

// // //     // --- 4. NAME CLEANING ---
// // //     const rawName = text.split("\n")[0] || "New Arrival";
// // //     const cleanName =
// // //       rawName
// // //         .replace(/[#@].*$/g, "")
// // //         .replace(/(07|01)\d{8}/g, "")
// // //         .replace(/\d{2,}\.\d{2,}\.\d{2,}/g, "")
// // //         .trim() || "Thrift Piece";

// // //     try {
// // //       await prisma.product.upsert({
// // //         where: { id: item.id || videoId },
// // //         update: {
// // //           price: price,
// // //           images: [itemImage],
// // //           description: text,
// // //         },
// // //         create: {
// // //           id: item.id || videoId,
// // //           name: cleanName.substring(0, 50),
// // //           description: text,
// // //           price: price,
// // //           size: "Check Description",
// // //           images: [itemImage],
// // //           videoUrl: item.webVideoUrl,
// // //           isSold: false,
// // //           category: {
// // //             connectOrCreate: {
// // //               where: { name: "New Arrivals" },
// // //               create: { name: "New Arrivals" },
// // //             },
// // //           },
// // //         },
// // //       });
// // //       console.log(
// // //         `✅ KES ${price.toString().padEnd(4)} | Imported: ${cleanName}`,
// // //       );
// // //       importedCount++;
// // //     } catch (e) {
// // //       console.log(`❌ Error importing: ${cleanName}`);
// // //     }
// // //   }
// // //   console.log(
// // //     `\n📊 Summary: ${importedCount} imported, ${skippedCount} lifestyle posts skipped.`,
// // //   );
// // // }

// // // main()
// // //   .catch((e) => console.error(e))
// // //   .finally(async () => {
// // //     await prisma.$disconnect();
// // //     console.log("🏁 Import process finished.");
// // //   });

// // import { PrismaClient } from "@prisma/client";
// // import { PrismaPg } from "@prisma/adapter-pg";
// // import * as fs from "fs";
// // import * as dotenv from "dotenv";

// // dotenv.config();

// // const adapter = new PrismaPg({
// //   connectionString: process.env.DATABASE_URL!,
// // });
// // const prisma = new PrismaClient({ adapter });

// // async function main() {
// //   if (!fs.existsSync("./tiktok-data.json")) {
// //     console.error("❌ Error: tiktok-data.json not found.");
// //     return;
// //   }

// //   const data = JSON.parse(fs.readFileSync("./tiktok-data.json", "utf-8"));
// //   console.log(`🚀 Processing ${data.length} items...`);

// //   let importedCount = 0;
// //   let skippedCount = 0;

// //   for (const item of data) {
// //     const text = item.text || "";

// //     // --- 1. SMART PRICE EXTRACTION ---
// //     let price = 0;
// //     // Specifically look for 3-4 digit numbers that don't start like KE phone numbers
// //     const priceMatch = text.match(/(?<!(07|01|254|7|1))\b(\d{3,4})\b/);

// //     if (priceMatch) {
// //       price = parseFloat(priceMatch[0]);
// //     }

// //     // --- 2. EXCLUDE KES 0 ITEMS ---
// //     if (price === 0) {
// //       console.log(
// //         `⏩ Skipping lifestyle post (Price 0): ${text.substring(0, 30)}...`,
// //       );
// //       skippedCount++;
// //       continue;
// //     }

// //     // --- 3. RELIABLE IMAGE URL (Embed Proxy) ---
// //     const videoId = item.webVideoUrl?.split("/video/")[1]?.split("?")[0];
// //     // This is the "Gold Standard" for displaying TikTok thumbnails without 403 errors:
// //     const itemImage = `https://www.tiktok.com/api/img/?itemId=${videoId}&location=0`;

// //     // --- 4. NAME CLEANING ---
// //     const rawName = text.split("\n")[0] || "New Arrival";
// //     const cleanName =
// //       rawName
// //         .replace(/[#@].*$/g, "")
// //         .replace(/(07|01)\d{8}/g, "")
// //         .trim() || "Thrift Piece";

// //     try {
// //       await prisma.product.upsert({
// //         where: { id: item.id || videoId },
// //         update: { price, images: [itemImage] },
// //         create: {
// //           id: item.id || videoId,
// //           name: cleanName.substring(0, 50),
// //           description: text,
// //           price: price,
// //           size: "Check Description",
// //           images: [itemImage],
// //           videoUrl: item.webVideoUrl,
// //           isSold: false,
// //           category: {
// //             connectOrCreate: {
// //               where: { name: "New Arrivals" },
// //               create: { name: "New Arrivals" },
// //             },
// //           },
// //         },
// //       });
// //       console.log(
// //         `✅ KES ${price.toString().padEnd(4)} | Imported: ${cleanName}`,
// //       );
// //       importedCount++;
// //     } catch (e) {
// //       console.log(`❌ Error: ${cleanName}`);
// //     }
// //   }
// //   console.log(
// //     `\n🏁 Done! Imported: ${importedCount} | Skipped: ${skippedCount}`,
// //   );
// // }

// // main()
// //   .catch(console.error)
// //   .finally(() => prisma.$disconnect());

// import { PrismaClient } from "@prisma/client";
// import { PrismaPg } from "@prisma/adapter-pg";
// import * as fs from "fs";
// import * as dotenv from "dotenv";

// dotenv.config();

// const adapter = new PrismaPg({
//   connectionString: process.env.DATABASE_URL!,
// });
// const prisma = new PrismaClient({ adapter });

// async function main() {
//   if (!fs.existsSync("./tiktok-data.json")) {
//     console.error("❌ Error: tiktok-data.json not found.");
//     return;
//   }

//   // --- STEP 1: AUTO-DELETE OLD DATA ---
//   console.log("🧹 Cleaning database...");
//   await prisma.product.deleteMany({});

//   const data = JSON.parse(fs.readFileSync("./tiktok-data.json", "utf-8"));
//   console.log(`🚀 Processing ${data.length} items...`);

//   let importedCount = 0;
//   let skippedCount = 0;

//   for (const item of data) {
//     const text = item.text || "";

//     // --- STEP 2: SMART PRICE EXTRACTION ---
//     // Ignores phone numbers (starting 07, 01, 254) and grabs 3-4 digit prices
//     const priceMatch = text.match(/(?<!(07|01|254|7|1))\b(\d{3,4})\b/);
//     let price = priceMatch ? parseFloat(priceMatch[0]) : 0;

//     // --- STEP 3: STRICT FILTER (SKIP KES 0) ---
//     if (price === 0 || price > 10000) {
//       // Also skips accidentally grabbing long IDs
//       skippedCount++;
//       continue;
//     }

//     // --- STEP 4: THE IMAGE PROXY FIX ---
//     const videoId = item.webVideoUrl?.split("/video/")[1]?.split("?")[0];
//     const rawImage = `https://www.tiktok.com/api/img/?itemId=${videoId}&location=0`;
//     // We use weserv.nl to bypass the "Access Denied" block
//     const proxiedImage = `https://images.weserv.nl/?url=${encodeURIComponent(rawImage)}`;

//     // --- STEP 5: NAME CLEANING ---
//     const rawName = text.split("\n")[0] || "New Arrival";
//     const cleanName =
//       rawName
//         .replace(/[#@].*$/g, "")
//         .replace(/(07|01)\d{8}/g, "")
//         .trim() || "Thrift Piece";

//     try {
//       await prisma.product.create({
//         data: {
//           id: item.id || videoId,
//           name: cleanName.substring(0, 50),
//           description: text,
//           price: price,
//           size: "Check Description",
//           images: [proxiedImage],
//           videoUrl: item.webVideoUrl,
//           isSold: false,
//           category: {
//             connectOrCreate: {
//               where: { name: "New Arrivals" },
//               create: { name: "New Arrivals" },
//             },
//           },
//         },
//       });
//       console.log(`✅ KES ${price.toString().padEnd(4)} | ${cleanName}`);
//       importedCount++;
//     } catch (e) {
//       // If ID already exists, we skip
//     }
//   }
//   console.log(
//     `\n🏁 Done! Imported: ${importedCount} | Skipped: ${skippedCount}`,
//   );
// }

// main()
//   .catch(console.error)
//   .finally(() => prisma.$disconnect());

import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import * as fs from "fs";
import * as dotenv from "dotenv";

dotenv.config();

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});
const prisma = new PrismaClient({ adapter });

async function main() {
  if (!fs.existsSync("./tiktok-data.json")) {
    console.error("❌ Error: tiktok-data.json not found.");
    return;
  }

  try {
    console.log("🧹 Wiping old products...");
    // The previous error happened here; this is now wrapped in a try/catch
    await prisma.product.deleteMany({});
  } catch (err) {
    console.error(
      "⚠️ Could not clear DB (likely a timeout). Continuing to import...",
    );
  }

  const data = JSON.parse(fs.readFileSync("./tiktok-data.json", "utf-8"));
  console.log(`🚀 Processing ${data.length} items...`);

  for (const item of data) {
    const text = item.text || "";

    // --- IMPROVED PRICE LOGIC ---
    // Look for 3-4 digit numbers specifically.
    // This regex excludes numbers that start with phone prefixes (07, 01, 254).
    const priceMatch = text.match(/(?<!(07|01|254|7|1))\b(\d{3,4})\b/);
    let price = priceMatch ? parseFloat(priceMatch[0]) : 0;

    // --- STRICTER FILTERS ---
    // 1. Skip if price is 0
    // 2. Skip if price is > 3000 (blocks phone numbers like 745046468)
    if (price === 0 || price > 3000) {
      continue;
    }

    const videoId = item.webVideoUrl?.split("/video/")[1]?.split("?")[0];

    // --- IMAGE FIX ---
    // We'll store the direct URL. The 'no-referrer' fix happens in your Frontend.
    const itemImage = `https://www.tiktok.com/api/img/?itemId=${videoId}&location=0`;

    const rawName = text.split("\n")[0] || "New Arrival";
    const cleanName = rawName
      .replace(/[#@].*$/g, "")
      .replace(/(07|01)\d{8}/g, "")
      .trim();

    try {
      await prisma.product.create({
        data: {
          id: item.id || videoId,
          name: cleanName.substring(0, 50),
          description: text,
          price: price,
          size: "Check Description",
          images: [itemImage],
          videoUrl: item.webVideoUrl,
          isSold: false,
          category: {
            connectOrCreate: {
              where: { name: "New Arrivals" },
              create: { name: "New Arrivals" },
            },
          },
        },
      });
      console.log(`✅ KES ${price} | ${cleanName}`);
    } catch (e) {
      // Skip duplicates if deleteMany failed earlier
    }
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
