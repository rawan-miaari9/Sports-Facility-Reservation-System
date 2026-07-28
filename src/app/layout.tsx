import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Arena Hub | Book Sports Courts & Facilities",
    template: "%s | Arena Hub", 
  },
  description:
    "Find, compare, and reserve top-rated sports facilities near you. Book basketball courts, tennis courts, padel arenas, and soccer fields online.",
  keywords: [
    "sports facility booking",
    "court rental",
    "book padel court",
    "rent basketball court",
    "tennis court reservation",
    "sports arena venue",
  ],
  authors: [{ name: "Arena Hub" }],
  creator: "Arena Hub",
  publisher: "Arena Hub",
  
  // Controls how search engines index your site
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  // Open Graph for Facebook, LinkedIn, Discord previews
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    siteName: "Arena Hub",
    title: "Arena Hub | Book Sports Courts & Facilities",
    description:
      "Find, compare, and reserve top-rated sports facilities near you.",
    images: [
      {
        url: "/og-image.jpg", // Add a 1200x630 banner to public/og-image.jpg
        width: 1200,
        height: 630,
        alt: "Arena Hub Sports Venue Reservation",
      },
    ],
  },

  // Twitter/X Cards
  twitter: {
    card: "summary_large_image",
    title: "Arena Hub | Book Sports Courts & Facilities",
    description:
      "Find, compare, and reserve top-rated sports facilities near you.",
    images: ["/og-image.jpg"],
  },

  // Mobile theme color
  themeColor: "#000000",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}