import { google } from "@ai-sdk/google";
import { streamText, Output } from "ai"; // Use streamText + Output
import { productSuggestionSchema } from "@/lib/schema";

export async function POST(req: Request) {
  const { imageUrl } = await req.json();

  try {
    // 1. Fetch the image manually with a custom timeout/retry
    const imageResponse = await fetch(imageUrl);
    if (!imageResponse.ok)
      throw new Error("Failed to fetch image from Cloudinary");

    const imageBuffer = await imageResponse.arrayBuffer();

    const result = await streamText({
      model: google("gemini-3.1-flash-lite-preview"),
      output: Output.object({ schema: productSuggestionSchema }),
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: "Analyze this fashion item for Lyvera thrift store. Provide name, description, size, and price in KES.",
            },
            {
              type: "image",
              // Send the raw data instead of the URL
              image: imageBuffer,
            },
          ],
        },
      ],
    });

    return result.toTextStreamResponse();
  } catch (error) {
    console.error("Image Processing Error:", error);
    return new Response(
      JSON.stringify({ error: "Connection to image server timed out." }),
      { status: 504 },
    );
  }
}
