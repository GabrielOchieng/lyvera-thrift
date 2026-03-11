"use client";

import { useState } from "react";
import { Image as ImageIcon, CheckCircle2, Loader2, X } from "lucide-react";
import { createProduct } from "../actions";

export default function AddProductPage() {
  const [imageUrl, setImageUrl] = useState<string>("");
  const [isUploading, setIsUploading] = useState(false);

  // 💡 IMPORTANT: Replace these with your actual Cloudinary details
  const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Basic check to ensure env variables are loaded
    if (!CLOUD_NAME || !UPLOAD_PRESET) {
      alert("Cloudinary configuration is missing in .env");
      return;
    }

    setIsUploading(true);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", UPLOAD_PRESET);

    try {
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
        {
          method: "POST",
          body: formData,
        },
      );

      const data = await response.json();

      if (data.secure_url) {
        // Cloudinary Transformation: w_600,h_600,c_fill makes it a perfect square
        const optimizedUrl = data.secure_url.replace(
          "/upload/",
          "/upload/w_600,h_600,c_fill,g_auto/",
        );
        setImageUrl(optimizedUrl);
      }
    } catch (error) {
      console.error("Upload error:", error);
      alert("Failed to upload image. Please check your connection.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <main className="max-w-2xl min-h-screen pb-20 mx-auto px-4">
      <h1 className="text-3xl mb-2 font-serif font-bold text-maroon-primary">
        Add New Inventory
      </h1>
      <p className="text-zinc-500 text-sm uppercase tracking-widest mb-6">
        Enter details to list a new curated piece
      </p>

      <form
        action={createProduct}
        className="flex flex-col gap-6 bg-white p-6 md:p-8 rounded-[2.5rem] border border-zinc-200 shadow-xl"
      >
        {/* Item Name */}
        <div className="flex flex-col gap-2">
          <label
            htmlFor="name"
            className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-1"
          >
            Item Name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            className="bg-zinc-100 border-2 border-transparent p-4 rounded-2xl focus:border-maroon-primary/20 focus:bg-white text-zinc-900 transition-all outline-none placeholder:text-zinc-400 font-medium"
            placeholder="e.g. 90s Leather Biker Jacket"
            required
          />
        </div>

        {/* Description */}
        <div className="flex flex-col gap-2">
          <label
            htmlFor="description"
            className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-1"
          >
            Description
          </label>
          <textarea
            id="description"
            name="description"
            rows={3}
            className="bg-zinc-100 border-2 border-transparent p-4 rounded-2xl focus:border-maroon-primary/20 focus:bg-white text-zinc-900 transition-all outline-none placeholder:text-zinc-400 font-medium resize-none"
            placeholder="Describe the condition, era, and unique details..."
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Price */}
          <div className="flex flex-col gap-2">
            <label
              htmlFor="price"
              className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-1"
            >
              Price (KES)
            </label>
            <input
              id="price"
              name="price"
              type="number"
              className="bg-zinc-100 border-2 border-transparent p-4 rounded-2xl focus:border-maroon-primary/20 focus:bg-white text-zinc-900 transition-all outline-none placeholder:text-zinc-400 font-medium"
              placeholder="2500"
              required
            />
          </div>

          {/* Size */}
          <div className="flex flex-col gap-2">
            <label
              htmlFor="size"
              className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-1"
            >
              Size
            </label>
            <input
              id="size"
              name="size"
              className="bg-zinc-100 border-2 border-transparent p-4 rounded-2xl focus:border-maroon-primary/20 focus:bg-white text-zinc-900 transition-all outline-none placeholder:text-zinc-400 font-medium uppercase"
              placeholder="XL"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Category Selector */}
          <div className="flex flex-col gap-2">
            <label
              htmlFor="category"
              className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-1"
            >
              Category
            </label>
            <select
              id="category"
              name="category"
              className="bg-zinc-100 border-2 border-transparent p-4 rounded-2xl focus:border-maroon-primary/20 text-zinc-900 outline-none cursor-pointer hover:bg-zinc-200 transition-all appearance-none"
              required
            >
              <option value="outerwear">Outerwear</option>
              <option value="tops">Tops</option>
              <option value="bottoms">Bottoms</option>
              <option value="accessories">Accessories</option>
            </select>
          </div>

          {/* Stock */}
          <div className="flex flex-col gap-2">
            <label
              htmlFor="stock"
              className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-1"
            >
              Initial Stock
            </label>
            <input
              id="stock"
              name="stock"
              type="number"
              defaultValue="1"
              className="bg-zinc-100 border-2 border-transparent p-4 rounded-2xl focus:border-maroon-primary/20 focus:bg-white text-zinc-900 transition-all outline-none font-medium"
              required
            />
          </div>
        </div>

        {/* --- CLOUDINARY UPLOAD SECTION --- */}
        <div className="flex flex-col gap-2">
          <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-1">
            Product Photo
          </label>

          <div
            className={`relative border-2 border-dashed rounded-3xl p-8 flex flex-col items-center justify-center transition-all ${
              imageUrl
                ? "border-green-200 bg-green-50/30"
                : "border-zinc-200 bg-zinc-50"
            }`}
          >
            {imageUrl ? (
              <div className="flex flex-col items-center gap-4">
                <div className="relative">
                  <img
                    src={imageUrl}
                    alt="Preview"
                    className="h-48 w-48 object-cover rounded-2xl shadow-lg border-4 border-white"
                  />
                  <button
                    type="button"
                    onClick={() => setImageUrl("")}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:scale-110 transition-transform shadow-md"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
                <p className="flex items-center gap-2 text-green-600 font-bold text-[10px] uppercase tracking-widest">
                  <CheckCircle2 className="h-4 w-4" /> Ready to list
                </p>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-4 text-center">
                <div className="p-4 bg-white rounded-2xl shadow-sm">
                  {isUploading ? (
                    <Loader2 className="h-8 w-8 animate-spin text-maroon-primary" />
                  ) : (
                    <ImageIcon className="h-8 w-8 text-zinc-300" />
                  )}
                </div>
                <div className="flex flex-col items-center">
                  <label className="cursor-pointer bg-maroon-primary text-white px-6 py-2 rounded-xl font-bold text-sm hover:scale-105 transition-transform">
                    {isUploading ? "Uploading..." : "Select Photo"}
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={handleImageUpload}
                      disabled={isUploading}
                    />
                  </label>
                  <p className="text-[10px] text-zinc-400 mt-2 uppercase font-bold tracking-tighter">
                    PNG, JPG up to 10MB
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* HIDDEN INPUT: Sends the URL to createProduct action */}
          <input type="hidden" name="imageUrl" value={imageUrl} />
        </div>

        <button
          type="submit"
          disabled={!imageUrl || isUploading}
          className="mt-4 bg-maroon-primary text-white font-black py-5 rounded-2xl hover:brightness-110 active:scale-[0.98] transition-all uppercase italic tracking-tighter text-lg shadow-lg disabled:opacity-50 disabled:grayscale disabled:cursor-not-allowed"
        >
          {isUploading
            ? "Uploading..."
            : imageUrl
              ? "List Item to Store"
              : "Add Image to Continue"}
        </button>
      </form>
    </main>
  );
}
