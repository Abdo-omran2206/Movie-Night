import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "image.tmdb.org",
      },
    ],
  },
  experimental: {
    optimizePackageImports: ["react-icons/fa", "react-icons/fa6", "react-icons/md", "react-icons/io5"],
  },
};

export default nextConfig;
