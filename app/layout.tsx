import type { Metadata } from "next";
import { Bebas_Neue, Roboto_Slab } from "next/font/google";
import { SkeletonTheme } from "react-loading-skeleton";
import "./globals.css";

const bebasNeue = Bebas_Neue({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-bebas",
});

const robotoSlab = Roboto_Slab({
  subsets: ["latin"],
  variable: "--font-roboto",
});

const siteUrl = "https://movie-night-self.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Movie Night - Discover Your Next Favorite Film",
    template: "%s | Movie Night",
  },
  description:
    "Your ultimate destination for movie enthusiasts. Stream and watch movies and TV shows online. Discover top-rated, popular, and upcoming content, explore cast details, and enjoy a fast, cinematic experience with our installable web app.",
  keywords: [
    "movies",
    "TV shows",
    "streaming",
    "film reviews",
    "top rated movies",
    "upcoming releases",
    "actor database",
    "filmography",
    "movie trailers",
    "watch highlights",
    "movie night",
    "trending content",
    "popular movies",
    "افلام",
    "مسلسلات",
    "سينما",
    "مشاهدة افلام",
    "نقد سينمائي",
  ],
  category: "entertainment",
  classification: "Entertainment/Movies",
  authors: [{ name: "Akira Omran" }, { name: "Movie Night Team" }],
  creator: "Movie Night",
  publisher: "Movie Night",
  formatDetection: {
    email: false,
    telephone: false,
  },
  icons: {
    icon: [
      { url: "/favicon.png", sizes: "any" },
      { url: "/favicon.png", sizes: "192x192", type: "image/png" },
    ],
    apple: "/favicon.png",
    shortcut: "/favicon.png",
  },
  manifest: "/manifest.json",
  themeColor: "#000000",
  colorScheme: "dark",
  applicationName: "Movie Night",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Movie Night",
    startupImage: [
      {
        url: "/favicon.png",
        media:
          "(device-width: 430px) and (device-height: 932px) and (-webkit-device-pixel-ratio: 3)",
      },
      {
        url: "/favicon.png",
        media:
          "(device-width: 393px) and (device-height: 852px) and (-webkit-device-pixel-ratio: 3)",
      },
      {
        url: "/favicon.png",
        media:
          "(device-width: 428px) and (device-height: 926px) and (-webkit-device-pixel-ratio: 3)",
      },
      {
        url: "/favicon.png",
        media:
          "(device-width: 390px) and (device-height: 844px) and (-webkit-device-pixel-ratio: 3)",
      },
    ],
  },
  openGraph: {
    title: "Movie Night - Discover Your Next Favorite Film",
    description:
      "Explore the world of cinema with Movie Night. Find your next favorite movie, watch trailers, get detailed info on cast and crew, and install the app-like experience on your device.",
    url: siteUrl,
    siteName: "Movie Night",
    images: [
      {
        url: "/favicon.png",
        width: 1200,
        height: 630,
        alt: "Movie Night - Your Ultimate Movie Destination",
        type: "image/png",
      },
      {
        url: "/favicon.png",
        width: 192,
        height: 192,
        alt: "Movie Night Logo",
        type: "image/png",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Movie Night - Discover Your Next Favorite Film",
    description:
      "Your ultimate destination for movie enthusiasts. Discover, watch, and enjoy cinema like never before — now installable as a fast, app-like web experience.",
    images: ["/favicon.png"],
    creator: "@MovieNight",
    site: "@MovieNight",
  },
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
  verification: {
    google: "hlHSbQJzQ4VDUcjMonNN_7QiWcxdSefIYRkBV96LT4w",
  },
  alternates: {
    canonical: siteUrl,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Movie Night",
    description:
      "Your ultimate destination for movie enthusiasts. Stream and watch movies and TV shows online, with an installable web app experience.",
    url: siteUrl,
    image: "/favicon.png",
    logo: {
      "@type": "ImageObject",
      url: "/favicon.png",
      width: 192,
      height: 192,
    },
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${siteUrl}/search?q={search_term_string}`,
      },
      query_input: "required name=search_term_string",
    },
  };

  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
          suppressHydrationWarning
        />
      </head>
      <body
        className={`${bebasNeue.variable} ${robotoSlab.variable} antialiased`}
      >
        <SkeletonTheme baseColor="#1a1a1a" highlightColor="#333">
          {children}
        </SkeletonTheme>
      </body>
    </html>
  );
}
