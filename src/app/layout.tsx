import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Great_Vibes, Source_Serif_4 } from "next/font/google";
import "./globals.css";
import { WorldProvider } from "@/components/providers/WorldProvider";
import { TravelBar } from "@/components/nav/TravelBar";

const display = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-display",
});

const serif = Source_Serif_4({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-serif",
});

const script = Great_Vibes({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-script",
});

export const metadata: Metadata = {
  title: "The World — A Place of Wonder",
  description:
    "A vast magical universe for curiosity, adventure and kindness. Visit briefly, or stay for an adventure.",
  applicationName: "The World",
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    title: "The World",
    statusBarStyle: "default",
  },
  icons: {
    icon: [
      { url: "/icons/icon-192.png", sizes: "192x192" },
      { url: "/icons/icon-512.png", sizes: "512x512" },
    ],
  },
};

export const viewport: Viewport = {
  themeColor: "#8fb8d8",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${display.variable} ${serif.variable} ${script.variable} antialiased`}>
        <WorldProvider>
          <TravelBar />
          {children}
        </WorldProvider>
      </body>
    </html>
  );
}
