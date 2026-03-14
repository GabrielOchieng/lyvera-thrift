// components/TikTokPlayer.tsx
"use client";
import { useEffect } from "react";

export default function TikTokPlayer({ videoUrl }: { videoUrl: string }) {
  useEffect(() => {
    // Load TikTok embed script
    const script = document.createElement("script");
    script.src = "https://www.tiktok.com/embed.js";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, [videoUrl]);

  // Extract video ID from URL
  const videoId = videoUrl.split("/video/")[1]?.split("?")[0];

  if (!videoId)
    return <p className="text-sm text-gray-500">Video unavailable</p>;

  return (
    <blockquote
      className="tiktok-embed"
      cite={videoUrl}
      data-video-id={videoId}
      style={{ maxWidth: "605px", minWidth: "325px" }}
    >
      <section>
        <a target="_blank" href={videoUrl} rel="noreferrer">
          View on TikTok
        </a>
      </section>
    </blockquote>
  );
}
