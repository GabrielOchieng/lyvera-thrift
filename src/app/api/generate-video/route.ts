import { GoogleGenerativeAI } from "@google/generative-ai";
import { v2 as cloudinary } from "cloudinary";
import prisma from "../../../../lib/prisma";

// Ensure Cloudinary is configured (Add this if not already in a separate lib)
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(req: Request) {
  try {
    const { productId, imageUrl, productName } = await req.json();

    // 1. Check if video already exists (Prevent double-spending AI credits)
    const existing = await prisma.product.findUnique({
      where: { id: productId },
    });
    if (existing?.videoUrl)
      return Response.json({ videoUrl: existing.videoUrl });

    // 2. Fetch image with a high-resilient timeout
    const imageResp = await fetch(imageUrl);
    if (!imageResp.ok) throw new Error("Cloudinary image unreachable");

    const arrayBuffer = await imageResp.arrayBuffer();
    const base64Image = Buffer.from(arrayBuffer).toString("base64");

    // const model = genAI.getGenerativeModel({ model: "veo-3.1" });
    // Inside src/app/api/generate-video/route.ts
    // const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
    // In src/app/api/generate-video/route.ts
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
    });

    // 3. Generate Video
    const result = await model.generateContent([
      `High-end 8s fashion video. Model wearing: ${productName}. Vertical 9:16.`,
      { inlineData: { data: base64Image, mimeType: "image/jpeg" } },
    ]);

    const videoSource =
      result.response?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!videoSource) throw new Error("AI failed to produce video source");

    // 4. Upload and Update DB
    const upload = await cloudinary.uploader.upload(videoSource, {
      resource_type: "video",
    });
    await prisma.product.update({
      where: { id: productId },
      data: { videoUrl: upload.secure_url },
    });

    return Response.json({ videoUrl: upload.secure_url });
  } catch (error: any) {
    console.error("API Error:", error.message);
    return Response.json({ error: error.message }, { status: 500 });
  }
}

// import { GoogleGenAI } from "@google/genai";
// import { v2 as cloudinary } from "cloudinary";
// import prisma from "../../../../lib/prisma";

// cloudinary.config({
//   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//   api_key: process.env.CLOUDINARY_API_KEY,
//   api_secret: process.env.CLOUDINARY_API_SECRET,
// });

// const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

// export async function POST(req: Request) {
//   try {
//     const { productId, imageUrl, productName } = await req.json();

//     const existing = await prisma.product.findUnique({
//       where: { id: productId },
//     });
//     if (existing?.videoUrl)
//       return Response.json({ videoUrl: existing.videoUrl });

//     // 1. Process Image
//     const imageResp = await fetch(imageUrl);
//     const arrayBuffer = await imageResp.arrayBuffer();
//     const base64Image = Buffer.from(arrayBuffer).toString("base64");

//     try {
//       // 2. Start Video Generation (Veo 3.1)
//       // Note: 'durationSeconds' is moved directly into the config object
//       // 1. Start Video Generation
//       let operation = await ai.models.generateVideos({
//         model: "veo-3.1-generate-preview",
//         prompt: `Vertical fashion video (9:16). Model wearing: ${productName}.`,
//         config: {
//           aspectRatio: "9:16",
//         },
//       });

//       // 2. Poll until complete
//       while (!operation.done) {
//         console.log("Video still processing... checking again in 15s");

//         // Wait for 15 seconds (Video takes time!)
//         await new Promise((resolve) => setTimeout(resolve, 15000));

//         // FIX: Pass the name property specifically to satisfy the type requirement
//         operation = await ai.operations.get({
//           operation: operation,
//         });
//       }

//       // 3. Extract the result with safe checks
//       const response = operation.response;

//       // Type-safe check for the generated video URI
//       if (response?.generatedVideos?.[0]?.video?.uri) {
//         const videoUri = response.generatedVideos[0].video.uri;

//         const upload = await cloudinary.uploader.upload(videoUri, {
//           resource_type: "video",
//           folder: "lyvera_videos",
//         });

//         await prisma.product.update({
//           where: { id: productId },
//           data: { videoUrl: upload.secure_url },
//         });

//         return Response.json({ videoUrl: upload.secure_url });
//       }

//       throw new Error("Video generation completed but no file was found.");
//     } catch (modelError: any) {
//       if (
//         modelError.message.includes("429") ||
//         modelError.message.includes("quota")
//       ) {
//         return Response.json(
//           {
//             status: "rate_limited",
//             message: "AI Stylist is busy. Retrying in a moment...",
//           },
//           { status: 429 },
//         );
//       }
//       console.error("Veo Error (likely access/404):", modelError.message);

//       // FALLBACK: Generate a Stylist Description using Flash
//       const fallback = await ai.models.generateContent({
//         model: "gemini-2.0-flash",
//         contents: [
//           {
//             role: "user",
//             parts: [
//               {
//                 text: "Describe this item's fit and movement in one elegant sentence.",
//               },
//               { inlineData: { data: base64Image, mimeType: "image/jpeg" } },
//             ],
//           },
//         ],
//       });

//       return Response.json({
//         message: "Video preview unavailable. Stylist note generated.",
//         description: fallback.text,
//       });
//     }
//   } catch (error: any) {
//     console.error("Critical Route Error:", error.message);
//     return Response.json({ error: "Server Error" }, { status: 500 });
//   }
// }
