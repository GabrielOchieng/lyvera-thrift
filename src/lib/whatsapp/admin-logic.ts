// // // // import { v2 as cloudinary } from "cloudinary";
// // // // import { GoogleGenerativeAI } from "@google/generative-ai";
// // // // import prisma from "../../../lib/prisma";

// // // // cloudinary.config({
// // // //   cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
// // // //   api_key: process.env.CLOUDINARY_API_KEY,
// // // //   api_secret: process.env.CLOUDINARY_API_SECRET,
// // // // });

// // // // const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

// // // // export async function processAdminImage(message: any) {
// // // //   const imageId = message.image.id;
// // // //   const messageId = message.id; // Unique ID for each incoming message
// // // //   const caption = message.image.caption || "";

// // // //   // 1. DEDUPLICATION: Attempt to record this message ID
// // // //   try {
// // // //     await prisma.processedMessage.create({
// // // //       data: { id: messageId },
// // // //     });
// // // //   } catch (error) {
// // // //     // If this fails, the messageId already exists in DB (Meta retry)
// // // //     console.log(`♻️ Duplicate message detected. Skipping: ${messageId}`);
// // // //     return null;
// // // //   }

// // // //   // 2. Get Media URL from Meta
// // // //   const mediaResponse = await fetch(
// // // //     `https://graph.facebook.com/v21.0/${imageId}`,
// // // //     { headers: { Authorization: `Bearer ${process.env.WHATSAPP_TOKEN}` } },
// // // //   );
// // // //   const mediaData = await mediaResponse.json();
// // // //   if (!mediaData.url) throw new Error("Media URL not found");

// // // //   // 3. Download Image with Timeout & Retries
// // // //   let imageBuffer: Buffer | null = null;
// // // //   for (let i = 0; i <= 2; i++) {
// // // //     const controller = new AbortController();
// // // //     const timeout = setTimeout(() => controller.abort(), 25000); // 25s for heavy images
// // // //     try {
// // // //       const download = await fetch(mediaData.url, {
// // // //         headers: { Authorization: `Bearer ${process.env.WHATSAPP_TOKEN}` },
// // // //         signal: controller.signal,
// // // //       });
// // // //       imageBuffer = Buffer.from(await download.arrayBuffer());
// // // //       clearTimeout(timeout);
// // // //       break;
// // // //     } catch (err) {
// // // //       clearTimeout(timeout);
// // // //       if (i === 2)
// // // //         throw new Error("Could not download image from Meta after 3 attempts.");
// // // //       await new Promise((res) => setTimeout(res, 2000));
// // // //     }
// // // //   }

// // // //   const base64Image = imageBuffer!.toString("base64");

// // // //   // 4. Parallel Tasks: Cloudinary Upload & AI Extraction
// // // //   const uploadPromise = new Promise((resolve, reject) => {
// // // //     cloudinary.uploader
// // // //       .upload_stream(
// // // //         {
// // // //           folder: "lyvera_bot",
// // // //           transformation: [{ width: 1000, crop: "limit" }],
// // // //         },
// // // //         (error, result) => (error ? reject(error) : resolve(result)),
// // // //       )
// // // //       .end(imageBuffer!);
// // // //   });

// // // //   const extractDataWithAI = async () => {
// // // //     const models = [
// // // //       "gemini-1.5-flash",
// // // //       "gemini-2.0-flash",
// // // //       "gemini-3.1-flash-lite-preview",
// // // //       "gemini-2.5-flash",
// // // //     ];
// // // //     let lastError;

// // // //     for (const modelName of models) {
// // // //       try {
// // // //         const model = genAI.getGenerativeModel({ model: modelName });
// // // //         const result = await model.generateContent([
// // // //           {
// // // //             inlineData: { data: base64Image, mimeType: "image/jpeg" },
// // // //           },
// // // //           `TASK: Catalog this product.

// // // //              ADMIN INPUT: "${caption}"
// // // //              (Note: The admin provides shorthand in the format "Size, Price". For example: "L, 2500" or "42, 3000")

// // // //              EXTRACTION RULES:
// // // //              1. Parse the "Size" from the first part of the Admin Input.
// // // //              2. Parse the "Price" from the second part of the Admin Input.
// // // //              3. Use the Image to generate a catchy "name", a relevant "category", and a brief 1-sentence "desc".

// // // //              Respond ONLY with JSON:
// // // //              {
// // // //                "name": "string",
// // // //                "price": "string",
// // // //                "size": "string",
// // // //                "category": "string",
// // // //                "desc": "string"
// // // //              }`,
// // // //         ]);

// // // //         const text = result.response
// // // //           .text()
// // // //           .replace(/```json|```/g, "")
// // // //           .trim();
// // // //         return JSON.parse(text);
// // // //       } catch (err) {
// // // //         console.warn(`⚠️ AI Model ${modelName} failed, trying next...`);
// // // //         lastError = err;
// // // //       }
// // // //     }
// // // //     throw lastError;
// // // //   };

// // // //   const [uploadResponse, data] = await Promise.all([
// // // //     uploadPromise,
// // // //     extractDataWithAI(),
// // // //   ]);

// // // //   // 5. Final Database Save
// // // //   return await prisma.product.create({
// // // //     data: {
// // // //       name: data.name,
// // // //       price: parseInt(data.price.toString().replace(/[^0-9]/g, "")) || 0,
// // // //       size: data.size,
// // // //       description: data.desc,
// // // //       images: [(uploadResponse as any).secure_url],
// // // //       isSold: false,
// // // //       category: {
// // // //         connectOrCreate: {
// // // //           where: { name: (data.category || "General").toLowerCase() },
// // // //           create: { name: (data.category || "General").toLowerCase() },
// // // //         },
// // // //       },
// // // //     },
// // // //   });
// // // // }

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
//   const messageId = message.id;
//   const caption = message.image.caption?.trim() || "";
//   const senderPhone = message.from;

//   // 1. DEDUPLICATION
//   try {
//     await prisma.processedMessage.create({ data: { id: messageId } });
//   } catch (e) {
//     return null;
//   }

//   // 2. SESSION KEY (Groups images sent within the same 30s window)
//   const timeBlock = Math.floor(Date.now() / 30000);
//   const sessionKey = `lyvera_${senderPhone}_${timeBlock}`;

//   // 3. MEDIA PROCESSING
//   const mediaResponse = await fetch(
//     `https://graph.facebook.com/v21.0/${imageId}`,
//     {
//       headers: { Authorization: `Bearer ${process.env.WHATSAPP_TOKEN}` },
//     },
//   );
//   const mediaData = await mediaResponse.json();
//   const download = await fetch(mediaData.url, {
//     headers: { Authorization: `Bearer ${process.env.WHATSAPP_TOKEN}` },
//   });
//   const imageBuffer = Buffer.from(await download.arrayBuffer());

//   const uploadToCloudinary = () =>
//     new Promise((res, rej) => {
//       cloudinary.uploader
//         .upload_stream({ folder: "lyvera_bot" }, (err, result) =>
//           err ? rej(err) : res(result),
//         )
//         .end(imageBuffer);
//     });

//   const uploadRes: any = await uploadToCloudinary();
//   const imageUrl = uploadRes.secure_url;

//   // 4. ATOMIC POLLING (Wait for the 'Creator' to finish)
//   let retries = 0;
//   let masterProduct = null;

//   while (retries < 6) {
//     masterProduct = await prisma.product.findFirst({
//       where: {
//         createdAt: { gte: new Date(Date.now() - 60000) },
//         description: { contains: sessionKey },
//       },
//       orderBy: { createdAt: "desc" },
//     });

//     if (masterProduct || caption) break;
//     await new Promise((r) => setTimeout(r, 2500)); // Poll every 2.5s
//     retries++;
//   }

//   // 5. ACTION: APPEND
//   if (masterProduct && !caption) {
//     return await prisma.product.update({
//       where: { id: masterProduct.id },
//       data: { images: { push: imageUrl } },
//     });
//   }

//   // 6. ACTION: CREATE (Multi-Model Loop)
//   const models = [
//     "gemini-1.5-flash",
//     "gemini-1.5-pro",
//     "gemini-2.0-flash",
//     "gemini-3.1-flash-lite-preview",
//     "gemini-2.5-flash",
//   ];
//   let extractionData = null;

//   for (const modelName of models) {
//     try {
//       const model = genAI.getGenerativeModel({ model: modelName });

//       // 10s timeout per model to prevent blocking the appenders
//       const timeoutPromise = new Promise((_, rej) =>
//         setTimeout(() => rej(new Error("Timeout")), 10000),
//       );
//       const aiPromise = model.generateContent([
//         {
//           inlineData: {
//             data: imageBuffer.toString("base64"),
//             mimeType: "image/jpeg",
//           },
//         },
//         `TASK: Catalog product. Input: "${caption}". Respond ONLY JSON: {name, price, size, category, desc}`,
//       ]);

//       const result: any = await Promise.race([aiPromise, timeoutPromise]);
//       const text = result.response
//         .text()
//         .replace(/```json|```/g, "")
//         .trim();
//       extractionData = JSON.parse(text);
//       if (extractionData) break;
//     } catch (err) {
//       console.warn(`⚠️ ${modelName} failed, moving to next...`);
//       continue;
//     }
//   }

//   if (!extractionData) throw new Error("All AI models failed to extract data.");

//   // 7. FINAL SAVE
//   return await prisma.product.create({
//     data: {
//       name: extractionData.name,
//       price:
//         parseInt(extractionData.price.toString().replace(/[^0-9]/g, "")) || 0,
//       size: extractionData.size,
//       description: `${extractionData.desc} \n\nREF: ${sessionKey}`,
//       images: [imageUrl],
//       category: {
//         connectOrCreate: {
//           where: { name: (extractionData.category || "General").toLowerCase() },
//           create: {
//             name: (extractionData.category || "General").toLowerCase(),
//           },
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
  const senderPhone = message.from;

  // 1. DEDUPLICATION
  try {
    await prisma.processedMessage.create({ data: { id: messageId } });
  } catch (e) {
    return null;
  }

  // 2. SESSION KEY
  const timeBlock = Math.floor(Date.now() / 30000);
  const sessionKey = `lyvera_${senderPhone}_${timeBlock}`;

  // 3. MEDIA PROCESSING
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

  // 4. ATOMIC POLLING (Search by the new hidden field)
  let retries = 0;
  let masterProduct = null;

  while (retries < 6) {
    masterProduct = await prisma.product.findFirst({
      where: {
        createdAt: { gte: new Date(Date.now() - 60000) },
        uploadId: sessionKey, // <--- No more 'contains' search in description
      },
      orderBy: { createdAt: "desc" },
    });

    if (masterProduct || caption) break;
    await new Promise((r) => setTimeout(r, 2500));
    retries++;
  }

  // 5. ACTION: APPEND
  if (masterProduct && !caption) {
    return await prisma.product.update({
      where: { id: masterProduct.id },
      data: { images: { push: imageUrl } },
    });
  }

  // 6. ACTION: CREATE (AI Extraction)
  const models = [
    "gemini-1.5-flash",
    "gemini-1.5-pro",
    "gemini-2.0-flash",
    "gemini-3.1-flash-lite-preview",
    "gemini-2.5-flash",
  ];

  let extractionData = null;

  for (const modelName of models) {
    try {
      const model = genAI.getGenerativeModel({ model: modelName });
      const timeoutPromise = new Promise((_, rej) =>
        setTimeout(() => rej(new Error("Timeout")), 10000),
      );

      const aiPromise = model.generateContent([
        {
          inlineData: {
            data: imageBuffer.toString("base64"),
            mimeType: "image/jpeg",
          },
        },
        `TASK: Catalog product. Input: "${caption}". Respond ONLY JSON: {name, price, size, category, desc}`,
      ]);

      const result: any = await Promise.race([aiPromise, timeoutPromise]);
      const text = result.response
        .text()
        .replace(/```json|```/g, "")
        .trim();
      extractionData = JSON.parse(text);
      if (extractionData) break;
    } catch (err) {
      continue;
    }
  }

  if (!extractionData) throw new Error("AI extraction failed.");

  // 7. FINAL SAVE
  return await prisma.product.create({
    data: {
      name: extractionData.name,
      price:
        parseInt(extractionData.price.toString().replace(/[^0-9]/g, "")) || 0,
      size: extractionData.size,
      description: extractionData.desc, // CLEAN!
      uploadId: sessionKey, // HIDDEN!
      images: [imageUrl],
      category: {
        connectOrCreate: {
          where: { name: (extractionData.category || "General").toLowerCase() },
          create: {
            name: (extractionData.category || "General").toLowerCase(),
          },
        },
      },
    },
  });
}
