import { z } from "zod";

export const productSuggestionSchema = z.object({
  name: z
    .string()
    .describe("A catchy, high-end thrift store name for the item"),
  description: z
    .string()
    .describe("A poetic description of the era, condition, and style"),
  price: z
    .number()
    .describe("Suggested price in KES based on Kenyan thrift market trends"),
  size: z
    .string()
    .describe("The clothing size (e.g., S, M, L, XL, or waist size)"),
  category: z.enum(["outerwear", "tops", "bottoms", "accessories"]),
});
