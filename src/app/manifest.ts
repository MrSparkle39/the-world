import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "The World",
    short_name: "The World",
    description: "A magical universe of curiosity, adventure and kindness.",
    start_url: "/",
    display: "standalone",
    background_color: "#8fb8d8",
    theme_color: "#8fb8d8",
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
  };
}
