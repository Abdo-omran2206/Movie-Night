"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { MdMenu } from "react-icons/md";
import { FaSearch } from "react-icons/fa";
import SideBarMenu from "./SideBarMenu";
import { search, Movie } from "@/app/lib/tmdb";
import Image from "next/image";
import { slugify } from "../lib/slugify";
import generateMovieAvatar from "../lib/generateMovieAvatar";

export default function Navbar() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchResults, setSearchResults] = useState<Movie[]>([]);

  useEffect(() => {
    async function syncSearch() {
      const results = await search(query, 1);
      setSearchResults(results.results);
    }
    setTimeout(() => {
      if (query.trim()) {
        syncSearch();
      } else {
        setSearchResults([]);
      }
    }, 500);
  }, [query]);

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
        <div className="flex-1 max-w-[180px] md:max-w-md gap-2 md:gap-4 relative">
          <form
            onSubmit={handleSubmit}
            className="flex relative items-center gap-2 bg-neutral-900/80 border border-neutral-700 rounded-lg px-2 py-1.5 md:px-3 md:py-2 flex-1 max-w-[180px] md:max-w-md"
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
          {query.trim() && <SearchMiniCards results={searchResults} />}
        </div>
      </nav>
      {isMenuOpen && <SideBarMenu setIsMenuOpen={setIsMenuOpen} />}
    </header>
  );
}

function SearchMiniCards({ results }: { results: Movie[] }) {
  const filteredResults = results
    .filter((item) => item.media_type === "movie" || item.media_type === "tv")
    .slice(0, 5);

  if (filteredResults.length === 0) return null;

  return (
    <div className="absolute top-full left-0 right-0 mt-2 bg-neutral-900/95 backdrop-blur-md rounded-lg shadow-2xl w-full border border-neutral-800 overflow-hidden z-50">
      {filteredResults.map((item) => (
        <SearchItem key={`${item.media_type}-${item.id}`} item={item} />
      ))}
    </div>
  );
}

function SearchItem({ item }: { item: Movie }) {
  const [imgError, setImgError] = useState(false);
  const isTv = item.media_type === "tv";
  const title = isTv ? item.name : item.title;
  const date = isTv ? item.first_air_date : item.release_date;
  const basePath = isTv ? "tv" : "movie";
  const href = `/${basePath}/${slugify(title || "")}/${item.id}`;

  const posterUrl = "https://image.tmdb.org/t/p/w92";
  const imageSrc =
    !imgError && item.poster_path
      ? `${posterUrl}${item.poster_path}`
      : generateMovieAvatar(title || "Unknown");

  return (
    <Link
      href={href}
      className="flex items-center gap-3 px-3 py-2 hover:bg-neutral-800 transition border-b border-neutral-800 last:border-0 group"
    >
      <div className="relative w-12 h-16 shrink-0 rounded overflow-hidden bg-neutral-800">
        <Image
          src={imageSrc}
          alt={title || "Poster"}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
          onError={() => setImgError(true)}
          sizes="48px"
        />
      </div>

      <div className="flex-1 min-w-0">
        <h3 className="text-white text-sm font-medium line-clamp-1 group-hover:text-red-500 transition-colors">
          {title}
        </h3>
        <p className="text-gray-400 text-xs mt-1">
          {isTv ? "TV Show" : "Movie"} • {date ? date.slice(0, 4) : "N/A"}
        </p>
      </div>
    </Link>
  );
}
