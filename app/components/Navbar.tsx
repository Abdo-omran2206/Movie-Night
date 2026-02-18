"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import { MdMenu } from "react-icons/md";
import { FaSearch } from "react-icons/fa";
import SideBarMenu from "./SideBarMenu";
export default function Navbar() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!query.trim()) return;

    router.push(`/search?q=${encodeURIComponent(query.trim())}`);
  };

  return (
    <header className="fixed top-0 left-0 w-full z-50">
      <nav className="flex items-center justify-between px-2 py-3 md:px-6 md:py-4 bg-neutral-950/80 backdrop-blur-lg border-b border-neutral-800/50 gap-2 md:gap-4">
        <div className="flex items-center gap-2 md:gap-4">
          <MdMenu
            className="text-red-600 text-xl cursor-pointer"
            size={30}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          />
          {/* Logo */}
          <Link
            href="/"
            className="text-red-600 text-lg md:text-3xl tracking-widest font-bold select-none shrink-0"
          >
            <h1>MOVIE NIGHT</h1>
          </Link>
        </div>

        {/* Search */}
        <form
          onSubmit={handleSubmit}
          className="flex items-center gap-2 bg-neutral-900/80 border border-neutral-700 rounded-lg px-2 py-1.5 md:px-3 md:py-2 flex-1 max-w-[180px] md:max-w-md"
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
      {isMenuOpen && <SideBarMenu setIsMenuOpen={setIsMenuOpen} />}
    </header>
  );
}
