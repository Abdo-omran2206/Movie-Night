"use client";

import Link from "next/link";
import { FaHome, FaFilm } from "react-icons/fa";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center bg-black px-4">
      <h1 className="text-7xl font-extrabold text-red-600 mb-4">404</h1>

      <p className="text-xl md:text-2xl text-gray-300 mb-2">
        Oops! Page not found
      </p>

      <p className="text-gray-500 mb-8 max-w-md">
        The page you’re looking for doesn’t exist or has been moved.
      </p>

      <div className="flex gap-4">
        <Link
          href="/"
          className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-5 py-3 rounded-lg transition"
        >
          <FaHome />
          Go Home
        </Link>

        <Link
          href="/category/popular"
          className="flex items-center gap-2 bg-neutral-800 hover:bg-neutral-700 text-white px-5 py-3 rounded-lg transition"
        >
          <FaFilm />
          Browse Movies
        </Link>
      </div>
    </div>
  );
}
