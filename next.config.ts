import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: ["image.tmdb.org"], // هنا ضيف أي دومين خارجي هتستخدمه
    unoptimized: true, 
  },
};

export default nextConfig;
