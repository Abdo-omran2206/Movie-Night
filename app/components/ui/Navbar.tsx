"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { MdMenu } from "react-icons/md";
import { FaCompass, FaSearch } from "react-icons/fa";
import SideBarMenu from "./SideBarMenu";
import { search } from "@/app/lib/tmdb";
import Image from "next/image";
import { slugify } from "../../lib/slugify";
import generateMovieAvatar from "../../lib/generateMovieAvatar";
import { encodeId } from "../../lib/hash";
import { categories, genres, thumbnailUrl } from "@/app/constant/main";
import { Movie } from "../../constant/types";
export default function Navbar() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [isExploreOpen, setIsExploreOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchResults, setSearchResults] = useState<Movie[]>([]);
  const [isSearchModelOpen, setIsSearchModelOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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
      <nav
        className={`transition-all duration-500 ${
          isScrolled
            ? "bg-neutral-950/60 backdrop-blur-xl py-3 shadow-2xl"
            : "bg-linear-to-b from-black/80 to-transparent py-5"
        }`}
      >
        <div className="container mx-auto px-4 lg:px-20 flex items-center justify-between gap-4">
          {/* Logo & Menu Group */}
          <div className="flex items-center gap-4 md:gap-8 shrink-0">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-white visible lg:hidden hover:text-red-600 transition-colors p-1"
              aria-label="Toggle menu"
            >
              <MdMenu size={28} />
            </button>

            <Link
              href="/"
              className="group/logo flex items-center gap-2 select-none"
            >
              <h1 className="text-red-600 text-shadow-black text-shadow-sm text-2xl md:text-3xl tracking-widest font-black transition-transform group-hover/logo:scale-105">
                MOVIE NIGHT
              </h1>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-6 lg:gap-8 flex-1 justify-center uppercase font-bold tracking-wider text-[13px]">
            <Link
              href="/"
              className="text-neutral-400 hover:text-white transition-all duration-300 hover:scale-105"
            >
              Home
            </Link>

            {/* Explore Dropdown */}
            <div className="relative"
              onMouseEnter={() => setIsExploreOpen(true)}
              onMouseLeave={() => setIsExploreOpen(false)}
            >
              <button
                className="text-neutral-400 hover:text-white flex items-center gap-1.5 py-2 hover:cursor-pointer transition-all outline-none"
                onClick={() => setIsExploreOpen(!isExploreOpen)}
              >
                Explore
                <span className="text-[10px] transition-transform opacity-50">
                  ▼
                </span>
              </button>
              {isExploreOpen && (
                <div className="absolute top-full left-0 pt-2 opacity-100 translate-y-2 pointer-events-auto transition-all duration-300 z-50">
                  <div className="bg-neutral-900/95 backdrop-blur-xl border border-neutral-800 rounded-xl p-2 shadow-[0_20px_50px_rgba(0,0,0,0.5)] w-48">
                    <Link
                      href="/explore"
                      className="flex items-center gap-3 px-3 py-2.5 text-neutral-400 hover:text-white hover:bg-red-600/10 rounded-lg transition-all group/item"
                    >
                      <FaCompass className="text-red-500 group-hover/item:scale-110 transition-transform" />
                      <span className="text-xs font-semibold">Explore</span>
                    </Link>
                    {categories.map((item) => (
                      <Link
                        key={item.name}
                        href={item.href}
                        className="flex items-center gap-3 px-3 py-2.5 text-neutral-400 hover:text-white hover:bg-red-600/10 rounded-lg transition-all group/item"
                      >
                        <item.icon className="text-red-500 group-hover/item:scale-110 transition-transform" />
                        <span className="text-xs font-semibold">
                          {item.name}
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Genres Dropdown */}
            <div className="relative"
              onMouseEnter={() => setIsDropdownOpen(true)}
              onMouseLeave={() => setIsDropdownOpen(false)}
            >
              <button
                className="text-neutral-400 hover:text-white flex items-center gap-1.5 py-2 transition-all outline-none"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              >
                Genres
                <span className="text-[10px] transition-transform opacity-50">
                  ▼
                </span>
              </button>
              {isDropdownOpen && (
                <div className="absolute top-full left-1/2 -translate-x-1/2 pt-2 opacity-100 translate-y-2 pointer-events-auto transition-all duration-300 z-50">
                  <div className="bg-neutral-900/95 backdrop-blur-xl border border-neutral-800 rounded-2xl p-4 shadow-[0_20px_50px_rgba(0,0,0,0.5)] w-120 grid grid-cols-2 gap-1 uppercase">
                    {genres.map((item) => (
                      <Link
                        key={item.name}
                        href={item.href}
                        className="flex items-center gap-3 px-3 py-2.5 text-neutral-400 hover:text-white hover:bg-red-600/10 rounded-lg transition-all group/item"
                      >
                        <item.icon className="text-red-500 shrink-0 group-hover/item:scale-110 transition-transform" />
                        <span className="text-[11px] font-semibold truncate">
                          {item.name}
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <Link
              href="/nightguide"
              className="text-red-600/80 hover:text-red-600 transition-all duration-300 hover:scale-105 flex items-center gap-1.5"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
              </span>
              Night Guide
            </Link>

            <Link
              href="/about"
              className="text-neutral-400 hover:text-white transition-all duration-300 hover:scale-105"
            >
              About
            </Link>
          </div>

          {/* Desktop Search */}
          <div className="hidden lg:flex flex-1 max-w-sm relative group/search">
            <form
              onSubmit={handleSubmit}
              className="flex items-center w-full bg-neutral-900/60 hover:bg-neutral-900/90 border border-neutral-600 focus-within:border-red-600/50 focus-within:ring-2 focus-within:ring-red-600/20 rounded-xl px-4 py-2 transition-all duration-300"
            >
              <input
                type="search"
                placeholder="Search movies, tv shows..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="flex-1 bg-transparent outline-none text-white placeholder-neutral-500 text-sm lg:text-base min-w-0"
              />
              <button
                type="submit"
                className="text-neutral-400 hover:text-red-600 transition-colors px-1"
                aria-label="Submit search"
              >
                <FaSearch size={18} />
              </button>
            </form>
            {query.trim() && (
              <div className="absolute top-full left-0 right-0 mt-2 animate-in fade-in slide-in-from-top-2 duration-300">
                <SearchMiniCards results={searchResults} />
              </div>
            )}
          </div>

          {/* Mobile Search Trigger */}
          <div className="flex lg:hidden items-center">
            <button
              onClick={() => setIsSearchModelOpen(true)}
              className="p-2 text-white hover:text-red-600 transition-colors"
              aria-label="Open mobile search"
            >
              <FaSearch size={22} />
            </button>
          </div>
        </div>
      </nav>
      {isMenuOpen && <SideBarMenu setIsMenuOpen={setIsMenuOpen} />}
      {isSearchModelOpen && (
        <SearchModal setIsSearchModelOpen={setIsSearchModelOpen} />
      )}
    </header>
  );
}

function SearchModal({
  setIsSearchModelOpen,
}: {
  setIsSearchModelOpen: (open: boolean) => void;
}) {
  const router = useRouter();
  const [localQuery, setLocalQuery] = useState("");
  const [localResults, setLocalResults] = useState<Movie[]>([]);

  useEffect(() => {
    async function syncSearch() {
      const results = await search(localQuery, 1);
      setLocalResults(results.results);
    }
    const timer = setTimeout(() => {
      if (localQuery.trim()) {
        syncSearch();
      } else {
        setLocalResults([]);
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [localQuery]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!localQuery.trim()) return;
    router.push(`/search?q=${encodeURIComponent(localQuery.trim())}`);
    setIsSearchModelOpen(false);
  };

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-md flex items-start justify-center z-100 pt-[15vh] px-4">
      <div className="bg-neutral-950 border border-neutral-800 rounded-2xl p-6 w-full max-w-xl shadow-[0_0_50px_-12px_rgba(220,38,38,0.3)] relative animate-in fade-in zoom-in duration-300">
        <button
          onClick={() => setIsSearchModelOpen(false)}
          className="absolute right-6 top-6 text-neutral-400 hover:text-white transition-colors"
          aria-label="Close search modal"
        >
          <span className="text-2xl">✕</span>
        </button>

        <h2 className="text-white text-2xl font-bold mb-6 pr-10 tracking-tight">
          Search Movies & TV
        </h2>

        <form
          onSubmit={handleSubmit}
          className="flex relative items-center gap-3 mb-6"
        >
          <div className="relative flex-1">
            {/* <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500" /> */}
            <input
              type="search"
              placeholder="Search for movies, actors, tv shows..."
              autoFocus
              value={localQuery}
              onChange={(e) => setLocalQuery(e.target.value)}
              className="w-full bg-neutral-900 rounded-xl pr-16 pl-3 py-2 outline-none text-white placeholder-neutral-500 text-md border border-neutral-800 focus:border-red-600 focus:ring-1 focus:ring-red-600 transition-all shadow-inner"
            />
          </div>
          <button
            type="submit"
            className="absolute right-0 bg-red-600 hover:bg-red-700 p-3 px-5 rounded-xl text-white font-semibold transition-all shadow-lg shadow-red-600/20 active:scale-95"
            aria-label="Submit search"
          >
            <FaSearch className="text-white text-lg " />
          </button>
        </form>

        <div className="max-h-[50vh] overflow-y-auto custom-scrollbar rounded-xl bg-neutral-900/50 border border-neutral-800/50">
          {localResults.length > 0 ? (
            <div className="divide-y divide-neutral-800/50">
              {localResults
                .filter(
                  (item) =>
                    item.media_type === "movie" || item.media_type === "tv",
                )
                .slice(0, 8)
                .map((item) => (
                  <div
                    key={`${item.media_type}-${item.id}`}
                    onClick={() => setIsSearchModelOpen(false)}
                  >
                    <SearchItem item={item} />
                  </div>
                ))}
            </div>
          ) : localQuery.trim() ? (
            <div className="flex flex-col items-center justify-center py-12 text-neutral-500">
              <FaSearch size={40} className="mb-4 opacity-20" />
              <p className="text-lg">
                No matches found for &quot;{localQuery}&quot;
              </p>
            </div>
          ) : (
            <div className="py-12 text-center text-neutral-500 italic">
              Try searching for &quot;Inception&quot; or &quot;Breaking
              Bad&quot;
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function SearchMiniCards({ results }: { results: Movie[] }) {
  const filteredResults = results
    .filter((item) => item.media_type === "movie" || item.media_type === "tv")
    .slice(0, 5);

  if (filteredResults.length === 0) return null;

  return (
    <div className="absolute top-full left-0 right-0 bg-neutral-900/95 backdrop-blur-md rounded-lg shadow-2xl w-full border border-neutral-800 overflow-hidden z-50">
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

  const year = date ? date.slice(0, 4) : "";
  const basePath = isTv ? "tv" : "movie";
  const href = `/${basePath}/${encodeId(item.id)}/${slugify(`${title || ""} ${year}`.trim())}`;

  const imageSrc =
    !imgError && item.poster_path
      ? `${thumbnailUrl}${item.poster_path}`
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
