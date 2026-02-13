import type { Metadata } from "next";
import { Bebas_Neue, Roboto_Slab } from "next/font/google";
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

export const metadata: Metadata = {
  title: {
    default: "Movie Night - Discover Your Next Favorite Film",
    template: "%s | Movie Night",
  },
  description:
    "Your ultimate destination for movie enthusiasts. Discover top-rated, popular, and upcoming movies. Watch trailers, check ratings, and explore cast details.",
  keywords: [
    "movies",
    "movie streaming",
    "cinema",
    "film",
    "movie reviews",
    "top rated movies",
    "upcoming movies",
    "actors",
    "cast",
  ],
  authors: [{ name: "Akira Omran" }, { name: "Movie Night Team" }],
  creator: "Movie Night",
  publisher: "Movie Night",
  icons: {
    icon: "/favicon.png",
    apple: "/favicon.png",
  },
  openGraph: {
    title: "Movie Night - Discover Your Next Favorite Film",
    description:
      "Explore the world of cinema with Movie Night. Find your next favorite movie, watch trailers, and get detailed info on cast and crew.",
    url: "https://movie-night-self.vercel.app/", // Replace with your actual domain if available
    siteName: "Movie Night",
    images: [
      {
        url: "/summary-large-image.png", // Ideally you should have this image in public folder for social sharing
        width: 1200,
        height: 630,
        alt: "Movie Night Preview",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Movie Night - Discover Your Next Favorite Film",
    description:
      "Your ultimate destination for movie enthusiasts. Discover, watch, and enjoy cinema like never before.",
    images: ["/summary-large-image.png"], // Replace with actual image path
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
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${bebasNeue.variable} ${robotoSlab.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
