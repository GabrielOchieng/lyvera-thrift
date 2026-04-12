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
  const caption = message.image.caption || "";

  const mediaResponse = await fetch(
    `https://graph.facebook.com/v21.0/${imageId}`,
    {
      headers: { Authorization: `Bearer ${process.env.WHATSAPP_TOKEN}` },
    },
  );
  const mediaData = await mediaResponse.json();
  if (!mediaData.url) throw new Error("Media URL not found");

  const imageDownload = await fetch(mediaData.url, {
    headers: { Authorization: `Bearer ${process.env.WHATSAPP_TOKEN}` },
  });
  const imageBuffer = await imageDownload.arrayBuffer();
  const base64Image = Buffer.from(imageBuffer).toString("base64");

  const [uploadResponse, aiResult] = await Promise.all([
    new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          {
            folder: "lyvera_bot",
            timeout: 60000,
            transformation: [
              { width: 800, height: 800, crop: "fill", gravity: "auto" },
            ],
          },
          (error, result) => (error ? reject(error) : resolve(result)),
        )
        .end(Buffer.from(imageBuffer));
    }),
    genAI
      .getGenerativeModel({ model: "gemini-3.1-flash-lite-preview" })
      .generateContent([
        `Extract details from caption "${caption}" and image. JSON ONLY: {"name": "...", "price": "...", "size": "...", "category": "...", "desc": "..."}`,
        { inlineData: { data: base64Image, mimeType: "image/jpeg" } },
      ]),
  ]);

  const aiText = (aiResult as any).response
    .text()
    .replace(/```json|```/g, "")
    .trim();
  const data = JSON.parse(aiText);

  return await prisma.product.create({
    data: {
      name: data.name,
      price: parseInt(data.price) || 0,
      size: data.size,
      description: data.desc,
      images: [(uploadResponse as any).secure_url],
      isSold: false,
      category: {
        connectOrCreate: {
          where: { name: data.category.toLowerCase() },
          create: { name: data.category.toLowerCase() },
        },
      },
    },
  });
}
