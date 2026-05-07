// // import { v2 as cloudinary } from "cloudinary";
// // import { GoogleGenerativeAI } from "@google/generative-ai";
// // import prisma from "../../../lib/prisma";

// // cloudinary.config({
// //   cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
// //   api_key: process.env.CLOUDINARY_API_KEY,
// //   api_secret: process.env.CLOUDINARY_API_SECRET,
// // });

// // const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

// // export async function processAdminImage(message: any) {
// //   const imageId = message.image.id;
// //   const messageId = message.id; // Unique ID for each incoming message
// //   const caption = message.image.caption || "";

// //   // 1. DEDUPLICATION: Attempt to record this message ID
// //   try {
// //     await prisma.processedMessage.create({
// //       data: { id: messageId },
// //     });
// //   } catch (error) {
// //     // If this fails, the messageId already exists in DB (Meta retry)
// //     console.log(`♻️ Duplicate message detected. Skipping: ${messageId}`);
// //     return null;
// //   }

// //   // 2. Get Media URL from Meta
// //   const mediaResponse = await fetch(
// //     `https://graph.facebook.com/v21.0/${imageId}`,
// //     { headers: { Authorization: `Bearer ${process.env.WHATSAPP_TOKEN}` } },
// //   );
// //   const mediaData = await mediaResponse.json();
// //   if (!mediaData.url) throw new Error("Media URL not found");

// //   // 3. Download Image with Timeout & Retries
// //   let imageBuffer: Buffer | null = null;
// //   for (let i = 0; i <= 2; i++) {
// //     const controller = new AbortController();
// //     const timeout = setTimeout(() => controller.abort(), 25000); // 25s for heavy images
// //     try {
// //       const download = await fetch(mediaData.url, {
// //         headers: { Authorization: `Bearer ${process.env.WHATSAPP_TOKEN}` },
// //         signal: controller.signal,
// //       });
// //       imageBuffer = Buffer.from(await download.arrayBuffer());
// //       clearTimeout(timeout);
// //       break;
// //     } catch (err) {
// //       clearTimeout(timeout);
// //       if (i === 2)
// //         throw new Error("Could not download image from Meta after 3 attempts.");
// //       await new Promise((res) => setTimeout(res, 2000));
// //     }
// //   }

// //   const base64Image = imageBuffer!.toString("base64");

// //   // 4. Parallel Tasks: Cloudinary Upload & AI Extraction
// //   const uploadPromise = new Promise((resolve, reject) => {
// //     cloudinary.uploader
// //       .upload_stream(
// //         {
// //           folder: "lyvera_bot",
// //           transformation: [{ width: 1000, crop: "limit" }],
// //         },
// //         (error, result) => (error ? reject(error) : resolve(result)),
// //       )
// //       .end(imageBuffer!);
// //   });

// //   const extractDataWithAI = async () => {
// //     const models = [
// //       "gemini-1.5-flash",
// //       "gemini-2.0-flash",
// //       "gemini-3.1-flash-lite-preview",
// //       "gemini-2.5-flash",
// //     ];
// //     let lastError;

// //     for (const modelName of models) {
// //       try {
// //         const model = genAI.getGenerativeModel({ model: modelName });
// //         const result = await model.generateContent([
// //           {
// //             inlineData: { data: base64Image, mimeType: "image/jpeg" },
// //           },
// //           `TASK: Catalog this product.

// //              ADMIN INPUT: "${caption}"
// //              (Note: The admin provides shorthand in the format "Size, Price". For example: "L, 2500" or "42, 3000")

// //              EXTRACTION RULES:
// //              1. Parse the "Size" from the first part of the Admin Input.
// //              2. Parse the "Price" from the second part of the Admin Input.
// //              3. Use the Image to generate a catchy "name", a relevant "category", and a brief 1-sentence "desc".

// //              Respond ONLY with JSON:
// //              {
// //                "name": "string",
// //                "price": "string",
// //                "size": "string",
// //                "category": "string",
// //                "desc": "string"
// //              }`,
// //         ]);

// //         const text = result.response
// //           .text()
// //           .replace(/```json|```/g, "")
// //           .trim();
// //         return JSON.parse(text);
// //       } catch (err) {
// //         console.warn(`⚠️ AI Model ${modelName} failed, trying next...`);
// //         lastError = err;
// //       }
// //     }
// //     throw lastError;
// //   };

// //   const [uploadResponse, data] = await Promise.all([
// //     uploadPromise,
// //     extractDataWithAI(),
// //   ]);

// //   // 5. Final Database Save
// //   return await prisma.product.create({
// //     data: {
// //       name: data.name,
// //       price: parseInt(data.price.toString().replace(/[^0-9]/g, "")) || 0,
// //       size: data.size,
// //       description: data.desc,
// //       images: [(uploadResponse as any).secure_url],
// //       isSold: false,
// //       category: {
// //         connectOrCreate: {
// //           where: { name: (data.category || "General").toLowerCase() },
// //           create: { name: (data.category || "General").toLowerCase() },
// //         },
// //       },
// //     },
// //   });
// // }

import { v2 as cloudinary } from "cloudinary";
import { GoogleGenerativeAI } from "@google/generative-ai";
import prisma from "../../../lib/prisma";

// 1. Setup
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function processAdminImage(message: any) {
  const imageId = message.image.id;
  const messageId = message.id;
  const caption = message.image.caption?.trim() || "";
  const senderPhone = message.from;

  // 2. STAGE 1: DEDUPLICATION (Prevent Meta Retries)
  try {
    await prisma.processedMessage.create({ data: { id: messageId } });
  } catch (e) {
    return null;
  }

  // 3. STAGE 2: THE LOCKING KEY
  // We create a "Session ID" based on the sender + timestamp rounded to the nearest 30s.
  // This groups all images sent in the same "burst" into one logical unit.
  const timeBlock = Math.floor(Date.now() / 30000);
  const sessionKey = `upload_${senderPhone}_${timeBlock}`;

  // 4. Download and Upload immediately (Do this in parallel to save time)
  const mediaResponse = await fetch(
    `https://graph.facebook.com/v21.0/${imageId}`,
    {
      headers: { Authorization: `Bearer ${process.env.WHATSAPP_TOKEN}` },
    },
  );
  const mediaData = await mediaResponse.json();
  const download = await fetch(mediaData.url, {
    headers: { Authorization: `Bearer ${process.env.WHATSAPP_TOKEN}` },
  });
  const imageBuffer = Buffer.from(await download.arrayBuffer());

  const uploadToCloudinary = () =>
    new Promise((res, rej) => {
      cloudinary.uploader
        .upload_stream({ folder: "lyvera_bot" }, (err, result) =>
          err ? rej(err) : res(result),
        )
        .end(imageBuffer);
    });

  const uploadRes: any = await uploadToCloudinary();
  const imageUrl = uploadRes.secure_url;

  // 5. STAGE 3: ATOMIC DETERMINATION
  // We try to find a product created in this session window.
  // We use a transaction with 'Serializable' isolation or a simple find-first with a retry loop.

  let retries = 0;
  let masterProduct = null;

  while (retries < 5) {
    masterProduct = await prisma.product.findFirst({
      where: {
        createdAt: { gte: new Date(Date.now() - 40000) },
        // We use a specific marker in the description to find our "Session"
        description: { contains: sessionKey },
      },
      orderBy: { createdAt: "desc" },
    });

    if (masterProduct || caption) break; // If found, or if WE are the one with the caption (The Creator)

    // If no product found and we have no caption, wait 2 seconds for the "Creator" to finish
    await new Promise((r) => setTimeout(r, 2000));
    retries++;
  }

  // 6. ACTION: APPEND OR CREATE
  if (masterProduct && !caption) {
    console.log("📎 Atomic Append Triggered");
    return await prisma.product.update({
      where: { id: masterProduct.id },
      data: { images: { push: imageUrl } },
    });
  }

  // 7. WE ARE THE CREATOR (We have the caption or no master was found)
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  const aiResult = await model.generateContent([
    {
      inlineData: {
        data: imageBuffer.toString("base64"),
        mimeType: "image/jpeg",
      },
    },
    `Parse this caption: "${caption}". Return JSON: {name, price, size, category, desc}`,
  ]);

  const data = JSON.parse(aiResult.response.text().replace(/```json|```/g, ""));

  return await prisma.product.create({
    data: {
      name: data.name,
      price: parseInt(data.price.toString().replace(/[^0-9]/g, "")) || 0,
      size: data.size,
      // We embed the sessionKey so follow-up requests can find this record
      description: `${data.desc} \n\nID: ${sessionKey}`,
      images: [imageUrl],
      category: {
        connectOrCreate: {
          where: { name: (data.category || "General").toLowerCase() },
          create: { name: (data.category || "General").toLowerCase() },
        },
      },
    },
  });
}
