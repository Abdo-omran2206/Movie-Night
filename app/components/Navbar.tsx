"use client";
import { FaSearch } from "react-icons/fa";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Navbar() {
  const router = useRouter();
  const [query, setQuery] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!query.trim()) return;

    router.push(`/search?q=${encodeURIComponent(query.trim())}`);
  };

  return (
    <header className="fixed top-0 left-0 w-full z-50">
      <nav className="flex items-center justify-between px-4 py-3 md:px-6 md:py-4 bg-neutral-950/50 backdrop-blur-lg border-b border-neutral-800/50 gap-4">
        {/* Logo */}
        <Link
          href="/"
          className="text-red-600 text-xl md:text-3xl tracking-widest font-bold select-none shrink-0"
        >
          <h1>MOVIE NIGHT</h1>
        </Link>

        {/* Search */}
        <form
          onSubmit={handleSubmit}
          className="flex items-center gap-2 bg-neutral-900/80 border border-neutral-700 rounded-lg px-2 py-1.5 md:px-3 md:py-2 flex-1 max-w-md"
        >
          <input
            type="search"
            placeholder="Search movies..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 bg-transparent outline-none text-white placeholder-neutral-500 text-sm md:text-base min-w-0"
          />
          <button
            type="submit"
            className="text-red-600 hover:text-red-500 transition"
          >
            <FaSearch className="text-sm md:text-base" />
          </button>
        </form>
      </nav>
    </header>
  );
}
