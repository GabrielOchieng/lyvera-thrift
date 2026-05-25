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

//   // 2. SESSION KEY
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

//   // 4. ATOMIC POLLING (Search by the new hidden field)
//   let retries = 0;
//   let masterProduct = null;

//   while (retries < 6) {
//     masterProduct = await prisma.product.findFirst({
//       where: {
//         createdAt: { gte: new Date(Date.now() - 60000) },
//         uploadId: sessionKey, // <--- No more 'contains' search in description
//       },
//       orderBy: { createdAt: "desc" },
//     });

//     if (masterProduct || caption) break;
//     await new Promise((r) => setTimeout(r, 2500));
//     retries++;
//   }

//   // 5. ACTION: APPEND
//   if (masterProduct && !caption) {
//     return await prisma.product.update({
//       where: { id: masterProduct.id },
//       data: { images: { push: imageUrl } },
//     });
//   }

//   // 6. ACTION: CREATE (AI Extraction)
//   const models = [
//     "gemini-1.5-flash",
//     "gemini-1.5-pro",
//     "gemini-2.0-flash",
//     "gemini-3.1-flash-lite",
//     "gemini-2.5-flash",
//   ];

//   let extractionData = null;

//   for (const modelName of models) {
//     try {
//       const model = genAI.getGenerativeModel({ model: modelName });
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
//       continue;
//     }
//   }

//   if (!extractionData) throw new Error("AI extraction failed.");

//   // 7. FINAL SAVE
//   return await prisma.product.create({
//     data: {
//       name: extractionData.name,
//       price:
//         parseInt(extractionData.price.toString().replace(/[^0-9]/g, "")) || 0,
//       size: extractionData.size,
//       description: extractionData.desc, // CLEAN!
//       uploadId: sessionKey, // HIDDEN!
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
  const messageId = message.id;
  const senderPhone = message.from;

  // 1. DETERMINE MEDIA TYPE (Handles both Image and Video properties dynamically)
  const isVideo = !!message.video;
  const mediaObject = message.image || message.video;

  // Exit gracefully if the message content doesn't feature an asset
  if (!mediaObject) return null;

  const mediaId = mediaObject.id;
  const caption = mediaObject.caption?.trim() || "";
  const incomingMimeType =
    mediaObject.mime_type || (isVideo ? "video/mp4" : "image/jpeg");

  // 2. DEDUPLICATION
  try {
    await prisma.processedMessage.create({ data: { id: messageId } });
  } catch (e) {
    return null;
  }

  // 3. SESSION KEY
  const timeBlock = Math.floor(Date.now() / 30000);
  const sessionKey = `lyvera_${senderPhone}_${timeBlock}`;

  // 4. DOWNLOAD MEDIA BUFFER FROM WHATSAPP / META GRAPH API
  const mediaResponse = await fetch(
    `https://graph.facebook.com/v21.0/${mediaId}`,
    {
      headers: { Authorization: `Bearer ${process.env.WHATSAPP_TOKEN}` },
    },
  );
  const mediaData = await mediaResponse.json();

  const download = await fetch(mediaData.url, {
    headers: { Authorization: `Bearer ${process.env.WHATSAPP_TOKEN}` },
  });
  const mediaBuffer = Buffer.from(await download.arrayBuffer());

  // 5. STREAM TO CLOUDINARY (Auto-detect asset resource types)
  const uploadToCloudinary = () =>
    new Promise((res, rej) => {
      cloudinary.uploader
        .upload_stream(
          {
            folder: "lyvera_bot",
            resource_type: "auto", // Handles runtime video file processing
          },
          (err, result) => (err ? rej(err) : res(result)),
        )
        .end(mediaBuffer);
    });

  const uploadRes: any = await uploadToCloudinary();
  const uploadedUrl = uploadRes.secure_url;

  // 6. ATOMIC POLLING LOCK LOOKUP
  let retries = 0;
  let masterProduct = null;

  while (retries < 6) {
    masterProduct = await prisma.product.findFirst({
      where: {
        createdAt: { gte: new Date(Date.now() - 60000) },
        uploadId: sessionKey,
      },
      orderBy: { createdAt: "desc" },
    });

    if (masterProduct || caption) break;
    await new Promise((r) => setTimeout(r, 2500));
    retries++;
  }

  // 7. ACTION: APPEND ASSET TO RECENTLY CAPTURED ITEM CONTEXT
  if (masterProduct && !caption) {
    const updateData = isVideo
      ? { videoUrl: uploadedUrl } // Map directly to your videoUrl schema string field
      : { images: { push: uploadedUrl } };

    return await prisma.product.update({
      where: { id: masterProduct.id },
      data: updateData,
    });
  }

  // 8. ACTION: CONSTRUCT NEW PRODUCT (Multimodal Model Fallback Chain)
  const models = [
    "gemini-2.5-flash",
    "gemini-2.0-flash",
    "gemini-1.5-flash",
    "gemini-1.5-pro",
    "gemini-3.1-flash-lite",
  ];

  let extractionData = null;

  for (const modelName of models) {
    try {
      const model = genAI.getGenerativeModel({ model: modelName });
      const timeoutPromise = new Promise((_, rej) =>
        setTimeout(() => rej(new Error("Timeout")), 12000),
      );

      const aiPromise = model.generateContent([
        {
          inlineData: {
            data: mediaBuffer.toString("base64"),
            mimeType: incomingMimeType,
          },
        },
        `TASK: Catalog product. Input caption context: "${caption}". Respond ONLY with raw structured JSON: {name, price, size, category, desc}`,
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

  // 9. MAP AND COMMIT DIRECTLY TO POSTGRESQL SCHEMA
  return await prisma.product.create({
    data: {
      name: extractionData.name,
      price:
        parseInt(extractionData.price.toString().replace(/[^0-9]/g, "")) || 0,
      size: extractionData.size,
      description: extractionData.desc,
      uploadId: sessionKey,
      source: "WHATSAPP", // Setting WhatsApp origin tracking
      images: isVideo ? [] : [uploadedUrl],
      videoUrl: isVideo ? uploadedUrl : null, // Uses your specific schema field column directly
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
