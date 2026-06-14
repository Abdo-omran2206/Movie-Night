"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { MdMenu } from "react-icons/md";
import { FaCompass, FaSearch } from "react-icons/fa";
import SideBarMenu from "./SideBarMenu";
import Image from "next/image";
import { categories, genres } from "@/constant/main";
import { Movie } from "@/constant/types";
import { generateUserAvatar } from "@/lib/generateMovieAvatar";
import { useUserStore } from "@/store/useUserStore";
import SearchMiniCards from "../cards/SearchCard";
import SearchModal from "../models/SearchModel";

export default function Navbar() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [isExploreOpen, setIsExploreOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchResults, setSearchResults] = useState<Movie[]>([]);
  const [isSearchModelOpen, setIsSearchModelOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const storeUserName = useUserStore((state) => state.user);
  const userName = storeUserName?.name || "user";

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);


  useEffect(() => {
    async function syncSearch() {
      try {
        const res = await fetch(
          `/api/search?query=${encodeURIComponent(query)}&page=1&type=multi`,
        );
        const data = await res.json();
        setSearchResults(data.results || []);
      } catch (err) {
        console.error("Search API error:", err);
        setSearchResults([]);
      }
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

  const handleClick = () => {
    if (storeUserName?.name && storeUserName?.id) {
      router.push("/dashboard");
    }
    if (!storeUserName?.name && !storeUserName?.id) {
      router.push("/account/login");
    }
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
            <div
              className="relative"
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
            <div
              className="relative"
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
          <div className="flex flex-row gap-5">
            <div className="flex lg:hidden items-center">
              <button
                onClick={() => setIsSearchModelOpen(true)}
                className="p-2 text-white hover:text-red-600 transition-colors"
                aria-label="Open mobile search"
              >
                <FaSearch size={22} />
              </button>
            </div>
            <button
              onClick={() => {
                handleClick();
              }}
              className="shrink-0 hover:cursor-pointer rounded-full border-2 border-neutral-800 p-0.5 transition-colors hover:border-red-600"
            >
              {userName ? (
                <Image
                  src={generateUserAvatar(userName)}
                  alt={userName}
                  width={150}
                  height={150}
                  className="w-10 h-10 lg:w-11 lg:h-11 object-cover"
                />
              ) : (
                <Image
                  src={generateUserAvatar("user")}
                  alt="user"
                  width={150}
                  height={150}
                  className="w-10 h-10 lg:w-11 lg:h-11 object-cover"
                />
              )}
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
