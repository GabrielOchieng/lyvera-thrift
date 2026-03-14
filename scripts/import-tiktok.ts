import { PrismaClient } from "@prisma/client";
import * as fs from "fs";
import * as dotenv from "dotenv";

// 1. Load the .env file immediately
dotenv.config();
console.log("DATABASE_URL:", process.env.DATABASE_URL);

// 2. Initialize Prisma simply. It will look for DATABASE_URL in the process.env automatically
const prisma = new PrismaClient();

async function main() {
  // Check if the data file exists
  if (!fs.existsSync("./tiktok-data.json")) {
    console.error("❌ Error: tiktok-data.json not found in the root folder.");
    return;
  }

  const data = JSON.parse(fs.readFileSync("./tiktok-data.json", "utf-8"));
  console.log(`🚀 Found ${data.length} items. Starting import...`);

  for (const item of data) {
    // Logic for extraction...
    const priceMatch = item.text.match(/(\d{3,})/);
    const price = priceMatch ? parseFloat(priceMatch[0]) : 0;
    const rawName = item.text.split("\n")[0] || "Lyvera Thrift Piece";
    const cleanName = rawName.replace(/[#@].*$/g, "").trim();

    try {
      await prisma.product.create({
        data: {
          name: cleanName.substring(0, 50) || "New Arrival",
          description: item.text || "Check video for details",
          price: price,
          size: "Check Description",
          images: [item["authorMeta.avatar"]],
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
      console.log(`✅ Imported: ${cleanName}`);
    } catch (e) {
      console.log(`❌ Skipped: ${cleanName}`);
    }
  }
}

main()
  .catch((e) => {
    console.error("❌ Critical Error:");
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    console.log("🏁 Import process finished.");
  });
