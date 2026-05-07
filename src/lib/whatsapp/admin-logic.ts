// import { v2 as cloudinary } from "cloudinary";
// import { GoogleGenerativeAI } from "@google/generative-ai";
// import prisma from "../../../lib/prisma";

// cloudinary.config({
//   cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
//   api_key: process.env.CLOUDINARY_API_KEY,
//   api_secret: process.env.CLOUDINARY_API_SECRET,
// });

// const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

// export async function processAdminImage(message: any) {
//   const imageId = message.image.id;
//   const messageId = message.id; // Unique ID for each incoming message
//   const caption = message.image.caption || "";

//   // 1. DEDUPLICATION: Attempt to record this message ID
//   try {
//     await prisma.processedMessage.create({
//       data: { id: messageId },
//     });
//   } catch (error) {
//     // If this fails, the messageId already exists in DB (Meta retry)
//     console.log(`♻️ Duplicate message detected. Skipping: ${messageId}`);
//     return null;
//   }

//   // 2. Get Media URL from Meta
//   const mediaResponse = await fetch(
//     `https://graph.facebook.com/v21.0/${imageId}`,
//     { headers: { Authorization: `Bearer ${process.env.WHATSAPP_TOKEN}` } },
//   );
//   const mediaData = await mediaResponse.json();
//   if (!mediaData.url) throw new Error("Media URL not found");

//   // 3. Download Image with Timeout & Retries
//   let imageBuffer: Buffer | null = null;
//   for (let i = 0; i <= 2; i++) {
//     const controller = new AbortController();
//     const timeout = setTimeout(() => controller.abort(), 25000); // 25s for heavy images
//     try {
//       const download = await fetch(mediaData.url, {
//         headers: { Authorization: `Bearer ${process.env.WHATSAPP_TOKEN}` },
//         signal: controller.signal,
//       });
//       imageBuffer = Buffer.from(await download.arrayBuffer());
//       clearTimeout(timeout);
//       break;
//     } catch (err) {
//       clearTimeout(timeout);
//       if (i === 2)
//         throw new Error("Could not download image from Meta after 3 attempts.");
//       await new Promise((res) => setTimeout(res, 2000));
//     }
//   }

//   const base64Image = imageBuffer!.toString("base64");

//   // 4. Parallel Tasks: Cloudinary Upload & AI Extraction
//   const uploadPromise = new Promise((resolve, reject) => {
//     cloudinary.uploader
//       .upload_stream(
//         {
//           folder: "lyvera_bot",
//           transformation: [{ width: 1000, crop: "limit" }],
//         },
//         (error, result) => (error ? reject(error) : resolve(result)),
//       )
//       .end(imageBuffer!);
//   });

//   const extractDataWithAI = async () => {
//     const models = [
//       "gemini-1.5-flash",
//       "gemini-2.0-flash",
//       "gemini-3.1-flash-lite-preview",
//       "gemini-2.5-flash",
//     ];
//     let lastError;

//     for (const modelName of models) {
//       try {
//         const model = genAI.getGenerativeModel({ model: modelName });
//         const result = await model.generateContent([
//           {
//             inlineData: { data: base64Image, mimeType: "image/jpeg" },
//           },
//           `TASK: Catalog this product.

//              ADMIN INPUT: "${caption}"
//              (Note: The admin provides shorthand in the format "Size, Price". For example: "L, 2500" or "42, 3000")

//              EXTRACTION RULES:
//              1. Parse the "Size" from the first part of the Admin Input.
//              2. Parse the "Price" from the second part of the Admin Input.
//              3. Use the Image to generate a catchy "name", a relevant "category", and a brief 1-sentence "desc".

//              Respond ONLY with JSON:
//              {
//                "name": "string",
//                "price": "string",
//                "size": "string",
//                "category": "string",
//                "desc": "string"
//              }`,
//         ]);

//         const text = result.response
//           .text()
//           .replace(/```json|```/g, "")
//           .trim();
//         return JSON.parse(text);
//       } catch (err) {
//         console.warn(`⚠️ AI Model ${modelName} failed, trying next...`);
//         lastError = err;
//       }
//     }
//     throw lastError;
//   };

//   const [uploadResponse, data] = await Promise.all([
//     uploadPromise,
//     extractDataWithAI(),
//   ]);

//   // 5. Final Database Save
//   return await prisma.product.create({
//     data: {
//       name: data.name,
//       price: parseInt(data.price.toString().replace(/[^0-9]/g, "")) || 0,
//       size: data.size,
//       description: data.desc,
//       images: [(uploadResponse as any).secure_url],
//       isSold: false,
//       category: {
//         connectOrCreate: {
//           where: { name: (data.category || "General").toLowerCase() },
//           create: { name: (data.category || "General").toLowerCase() },
//         },
//       },
//     },
//   });
// }

import { v2 as cloudinary } from "cloudinary";
import { GoogleGenerativeAI } from "@google/generative-ai";
import prisma from "../../../lib/prisma";

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

  // 1. DEDUPLICATION
  try {
    await prisma.processedMessage.create({
      data: { id: messageId },
    });
  } catch (error) {
    console.log(`♻️ Duplicate message detected. Skipping: ${messageId}`);
    return null;
  }

  // 2. Get Media URL from Meta
  const mediaResponse = await fetch(
    `https://graph.facebook.com/v21.0/${imageId}`,
    { headers: { Authorization: `Bearer ${process.env.WHATSAPP_TOKEN}` } },
  );
  const mediaData = await mediaResponse.json();
  if (!mediaData.url) throw new Error("Media URL not found");

  // 3. Download Image with Timeout & Retries
  let imageBuffer: Buffer | null = null;
  for (let i = 0; i <= 2; i++) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 25000);
    try {
      const download = await fetch(mediaData.url, {
        headers: { Authorization: `Bearer ${process.env.WHATSAPP_TOKEN}` },
        signal: controller.signal,
      });
      imageBuffer = Buffer.from(await download.arrayBuffer());
      clearTimeout(timeout);
      break;
    } catch (err) {
      clearTimeout(timeout);
      if (i === 2) throw new Error("Could not download image from Meta.");
      await new Promise((res) => setTimeout(res, 2000));
    }
  }

  const base64Image = imageBuffer!.toString("base64");

  // 4. Upload to Cloudinary (Stream)
  const uploadPromise = new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(
        {
          folder: "lyvera_bot",
          transformation: [{ width: 1000, crop: "limit" }],
        },
        (error, result) => (error ? reject(error) : resolve(result)),
      )
      .end(imageBuffer!);
  });

  // 5. THE MULTI-IMAGE LOGIC
  // Check if a product was created in the last 15 seconds (Grace Period)
  const gracePeriod = new Date(Date.now() - 15000);
  const recentProduct = await prisma.product.findFirst({
    where: {
      createdAt: { gte: gracePeriod },
    },
    orderBy: { createdAt: "desc" },
  });

  // Decide: Are we adding to an existing product or starting a new one?
  // If there is a recent product AND this message has NO caption, it's an extra photo.
  if (recentProduct && !caption) {
    console.log(`📸 Adding extra photo to: ${recentProduct.name}`);
    const uploadResponse: any = await uploadPromise;
    return await prisma.product.update({
      where: { id: recentProduct.id },
      data: {
        images: {
          push: uploadResponse.secure_url,
        },
      },
    });
  }

  // 6. NEW PRODUCT FLOW: Run AI extraction
  const extractDataWithAI = async () => {
    const models = [
      "gemini-1.5-flash",
      "gemini-1.5-pro",
      "gemini-2.0-flash",
      "gemini-3.1-flash-lite-preview",
      "gemini-2.5-flash",
    ];
    let lastError;

    for (const modelName of models) {
      try {
        const model = genAI.getGenerativeModel({ model: modelName });
        const result = await model.generateContent([
          { inlineData: { data: base64Image, mimeType: "image/jpeg" } },
          `TASK: Catalog this product.
           ADMIN INPUT: "${caption}"
           EXTRACTION RULES:
           1. Parse Size and Price from the Admin Input.
           2. Generate a catchy name, category, and 1-sentence description based on the image.
           Respond ONLY with JSON: 
           { "name": "string", "price": "string", "size": "string", "category": "string", "desc": "string" }`,
        ]);

        const text = result.response
          .text()
          .replace(/```json|```/g, "")
          .trim();
        return JSON.parse(text);
      } catch (err) {
        lastError = err;
        continue;
      }
    }
    throw lastError;
  };

  const [uploadResponse, data] = await Promise.all([
    uploadPromise,
    extractDataWithAI(),
  ]);

  // 7. Final Database Save (Initial Create)
  return await prisma.product.create({
    data: {
      name: data.name,
      price: parseInt(data.price.toString().replace(/[^0-9]/g, "")) || 0,
      size: data.size,
      description: data.desc,
      images: [(uploadResponse as any).secure_url],
      isSold: false,
      category: {
        connectOrCreate: {
          where: { name: (data.category || "General").toLowerCase() },
          create: { name: (data.category || "General").toLowerCase() },
        },
      },
    },
  });
}
