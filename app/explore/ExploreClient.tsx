"use client";
import { useState, useEffect } from "react";
import { discover } from "@/app/lib/tmdb";
import { DiscoverParams, Movie } from "@/app/constant/types";
import MovieCard from "@/app/components/cards/MovieCard";
import { GENRE_MAP, LANGUAGES, REGIONS, SORT_OPTIONS } from "@/app/constant/main";
import { FaChevronLeft, FaChevronRight, FaXmark } from "react-icons/fa6";
import {
  HiOutlineChevronDown,
  HiOutlineAdjustmentsHorizontal,
} from "react-icons/hi2";

export default function ExploreClient() {
  const currentYear = new Date().getFullYear();
  const [mediaType, setMediaType] = useState<"movie" | "tv">("movie");
  const [year, setYear] = useState<number>(currentYear);
  const [minRating, setMinRating] = useState<number>(0);
  const [selectedGenres, setSelectedGenres] = useState<number[]>([]);
  const [region, setRegion] = useState("");
  const [contentLang, setContentLang] = useState("");
  const [sortBy, setSortBy] = useState("popularity.desc");
  const [page, setPage] = useState(1);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const [results, setResults] = useState<Movie[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [totalResults, setTotalResults] = useState(0);

  const toggleGenre = (id: number) => {
    setSelectedGenres((prev) =>
      prev.includes(id) ? prev.filter((g) => g !== id) : [...prev, id],
    );
    setPage(1);
  };

  const resetFilters = () => {
    setYear(currentYear);
    setMinRating(0);
    setSelectedGenres([]);
    setRegion("");
    setContentLang("");
    setSortBy("popularity.desc");
    setPage(1);
  };

  useEffect(() => {
    async function fetchResults() {
      const params: DiscoverParams = {
        page,
        sort_by: sortBy,
      };

      if (region) params.region = region;
      if (contentLang) params.with_original_language = contentLang;

      if (selectedGenres.length > 0) {
        params.with_genres = selectedGenres.join(",");
      }

      if (minRating > 0) {
        params["vote_average.gte"] = minRating;
      }

      if (year < currentYear) {
        if (mediaType === "movie") {
          params.primary_release_year = String(year);
        } else {
          params.first_air_date_year = String(year);
        }
      }

      const data = await discover(mediaType, params as any);
      setResults(data.results || []);
      setTotalPages(Math.min(data.total_pages || 1, 500));
      setTotalResults(data.total_results || 0);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
    fetchResults();
  }, [
    mediaType,
    year,
    minRating,
    selectedGenres,
    region,
    contentLang,
    sortBy,
    page,
    currentYear,
  ]);

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-red-600/30 overflow-x-hidden relative">
      {/* Ambient Background Effects */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-red-900/10 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[30%] h-[30%] bg-blue-900/10 blur-[100px] rounded-full animate-pulse delay-700" />
      </div>

      {/* Mobile Floating Filter Button */}
      <button 
        onClick={() => setIsFilterOpen(true)}
        className="fixed bottom-5 left-5 z-45 md:hidden bg-red-600 text-white p-4 rounded-full shadow-[0_0_25px_rgba(220,38,38,0.5)] active:scale-90 transition-all"
      >
        <HiOutlineAdjustmentsHorizontal size={24} />
      </button>

      <div className="relative z-10 max-w-[1700px] mx-auto p-6 md:p-8 lg:p-12 flex flex-col md:flex-row gap-8 lg:gap-14">
        <style
          dangerouslySetInnerHTML={{
            __html: `
          .custom-slider {
            -webkit-appearance: none;
            width: 100%;
            height: 6px;
            border-radius: 12px;
            outline: none;
            cursor: pointer;
            transition: all 0.3s ease;
          }
          .custom-slider::-webkit-slider-thumb {
            -webkit-appearance: none;
            appearance: none;
            width: 20px;
            height: 20px;
            border-radius: 50%;
            border: 3px solid #050505;
            background: #ffffff;
            box-shadow: 0 0 15px rgba(255,255,255,0.3);
            transition: transform 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          }
          .custom-slider::-webkit-slider-thumb:hover {
            transform: scale(1.2);
          }
          .custom-slider::-moz-range-thumb {
            width: 20px;
            height: 20px;
            border-radius: 50%;
            border: 3px solid #050505;
            background: #ffffff;
            box-shadow: 0 0 15px rgba(255,255,255,0.3);
            transition: transform 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          }
          .custom-slider::-moz-range-thumb:hover {
            transform: scale(1.2);
          }
          .custom-scrollbar::-webkit-scrollbar {
            width: 4px;
          }
          .custom-scrollbar::-webkit-scrollbar-track {
            background: transparent;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb {
            background: #2a2a2a;
            border-radius: 10px;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb:hover {
            background: #444;
          }
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .animate-fade-in {
            animation: fadeIn 0.5s ease forwards;
          }
          @keyframes slideInRight {
            from { transform: translateX(100%); }
            to { transform: translateX(0); }
          }
          .animate-slide-in {
            animation: slideInRight 0.4s cubic-bezier(0.05, 0.7, 0.1, 1);
          }
        `,
          }}
        />

        {/* Filters Sidebar/Drawer */}
        <aside className={`
          fixed inset-0 z-[100] md:relative md:inset-auto md:z-10 bg-black md:bg-transparent
          w-full md:w-[260px] lg:w-[320px] shrink-0
          transition-all duration-500 overflow-y-auto custom-scrollbar md:overflow-visible
          ${isFilterOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none md:opacity-100 md:pointer-events-auto'}
        `}>
          {/* Mobile Overlay Background (Tap to close) */}

          <div className={`
             relative z-10  md:bg-white/[0.03] backdrop-blur-3xl md:backdrop-blur-xl 
             border-l border-white/10 md:border border-white/[0.05] md:rounded-[32px] 
             px-8 py-15 lg:p-8 shadow-2xl h-full md:h-auto md:sticky md:top-8
             transition-transform duration-500
             ${isFilterOpen ? 'translate-x-0' : 'translate-x-full md:translate-x-0'}
          `}>
            {/* Header for Mobile Drawer */}
            <div className="flex items-center justify-between mb-8 md:hidden">
              <span className="text-xl font-black uppercase tracking-widest italic tracking-tighter">Filters</span>
              <button 
                onClick={() => setIsFilterOpen(false)}
                className="w-12 h-12 flex items-center justify-center bg-white/5 rounded-2xl text-white"
              >
                <FaXmark size={20} />
              </button>
            </div>

            <div className="flex items-center gap-2 mb-8 text-neutral-400 hidden md:flex">
              <HiOutlineAdjustmentsHorizontal
                size={20}
                className="text-red-500"
              />
              <span className="text-[10px] font-black uppercase tracking-[0.3em]">
                Refine Catalog
              </span>
            </div>

            {/* Media Toggle */}
            <div className="mb-10 flex bg-black/40 border border-white/10 rounded-2xl p-1.5 p-relative">
              <button
                onClick={() => {
                  setMediaType("movie");
                  setPage(1);
                  if (typeof window !== "undefined" && window.innerWidth < 768) setIsFilterOpen(false);
                }}
                className={`flex-1 py-3 text-[11px] font-black uppercase tracking-wider rounded-xl transition-all duration-300 ${mediaType === "movie" ? "bg-white text-black shadow-lg" : "text-neutral-500 hover:text-white"}`}
              >
                Movies
              </button>
              <button
                onClick={() => {
                  setMediaType("tv");
                  setPage(1);
                  if (typeof window !== "undefined" && window.innerWidth < 768) setIsFilterOpen(false);
                }}
                className={`flex-1 py-3 text-[11px] font-black uppercase tracking-wider rounded-xl transition-all duration-300 ${mediaType === "tv" ? "bg-white text-black shadow-lg" : "text-neutral-500 hover:text-white"}`}
              >
                TV Shows
              </button>
            </div>

            {/* Release Year */}
            <div className="mb-10 group">
              <div className="flex items-center justify-between mb-4">
                <label className="text-[11px] font-black uppercase tracking-widest text-neutral-400 group-hover:text-white transition-colors">
                  Release Year
                </label>
                <span className="text-xs font-bold text-red-500">{year}</span>
              </div>
              <input
                type="range"
                min="1900"
                max={currentYear}
                value={year}
                onChange={(e) => {
                  setYear(Number(e.target.value));
                  setPage(1);
                }}
                className="custom-slider"
                style={{
                  background: `linear-gradient(to right, #ff3333 ${((year - 1900) / (currentYear - 1900)) * 100}%, #1a1a1a ${((year - 1900) / (currentYear - 1900)) * 100}%)`,
                }}
              />
              <div className="flex justify-between text-[10px] text-neutral-600 mt-3 font-black tracking-tighter">
                <span>1900</span>
                <span>{currentYear}</span>
              </div>
            </div>

            {/* Minimum Rating */}
            <div className="mb-12 group">
              <div className="flex items-center justify-between mb-4">
                <label className="text-[11px] font-black uppercase tracking-widest text-neutral-400 group-hover:text-white transition-colors">
                  Min Rating
                </label>
                <span className="text-xs font-bold text-red-500">
                  {minRating} ★
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="10"
                step="0.5"
                value={minRating}
                onChange={(e) => {
                  setMinRating(Number(e.target.value));
                  setPage(1);
                }}
                className="custom-slider"
                style={{
                  background: `linear-gradient(to right, #ffffff ${(minRating / 10) * 100}%, #1a1a1a ${(minRating / 10) * 100}%)`,
                }}
              />
            </div>

            {/* Genres */}
            <div className="mb-12">
              <label className="block text-[11px] font-black uppercase tracking-widest text-neutral-400 mb-6">
                Genres
              </label>
              <div className="flex flex-col gap-4 max-h-[300px] overflow-y-auto pr-3 custom-scrollbar">
                {Object.entries(GENRE_MAP).map(([name, id]) => (
                  <label
                    key={id}
                    className="flex items-center gap-4 cursor-pointer group"
                  >
                    <div className="relative">
                      <input
                        type="checkbox"
                        className="peer hidden"
                        checked={selectedGenres.includes(id)}
                        onChange={() => toggleGenre(id)}
                      />
                      <div className="w-5 h-5 rounded-lg border-2 border-white/10 flex items-center justify-center transition-all duration-300 peer-checked:bg-white peer-checked:border-white peer-checked:shadow-[0_0_15px_rgba(255,255,255,0.4)] group-hover:border-white/40">
                        <div
                          className={`w-2 h-2 bg-black rounded-sm transition-transform duration-300 ${selectedGenres.includes(id) ? "scale-100" : "scale-0"}`}
                        />
                      </div>
                    </div>
                    <span
                      className={`text-[13px] font-bold tracking-tight transition-all duration-300 ${selectedGenres.includes(id) ? "text-white translate-x-1" : "text-neutral-500 group-hover:text-neutral-300"}`}
                    >
                      {name.replace(/_/g, " ")}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Region */}
            <div className="mb-10">
              <label className="block text-[11px] font-black uppercase tracking-widest text-neutral-400 mb-4">
                Region
              </label>
              <div className="relative group/select">
                <select
                  value={region}
                  onChange={(e) => {
                    setRegion(e.target.value);
                    setPage(1);
                  }}
                  className="w-full bg-black/40 border border-white/10 text-white text-xs font-bold rounded-2xl py-4 px-5 appearance-none outline-none focus:border-white/40 transition-all cursor-pointer hover:bg-black/60"
                >
                  {REGIONS.map((opt) => (
                    <option
                      key={opt.value}
                      value={opt.value}
                      className="bg-[#050505] text-white py-4"
                    >
                      {opt.label}
                    </option>
                  ))}
                </select>
                <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-neutral-600 group-hover/select:text-white transition-colors">
                  <HiOutlineChevronDown size={14} />
                </div>
              </div>
            </div>

            {/* Content Language */}
            <div className="mb-10">
              <label className="block text-[11px] font-black uppercase tracking-widest text-neutral-400 mb-4">
                Content Language
              </label>
              <div className="relative group/select">
                <select
                  value={contentLang}
                  onChange={(e) => {
                    setContentLang(e.target.value);
                    setPage(1);
                  }}
                  className="w-full bg-black/40 border border-white/10 text-white text-xs font-bold rounded-2xl py-4 px-5 appearance-none outline-none focus:border-white/40 transition-all cursor-pointer hover:bg-black/60"
                >
                  {LANGUAGES.map((opt) => (
                    <option
                      key={opt.value}
                      value={opt.value}
                      className="bg-[#050505] text-white py-4"
                    >
                      {opt.label}
                    </option>
                  ))}
                </select>
                <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-neutral-600 group-hover/select:text-white transition-colors">
                  <HiOutlineChevronDown size={14} />
                </div>
              </div>
            </div>

            {/* Sort By */}
            <div className="mb-10">
              <label className="block text-[11px] font-black uppercase tracking-widest text-neutral-400 mb-4">
                Sort Criteria
              </label>
              <div className="relative group/select">
                <select
                  value={sortBy}
                  onChange={(e) => {
                    setSortBy(e.target.value);
                    setPage(1);
                  }}
                  className="w-full bg-black/40 border border-white/10 text-white text-xs font-bold rounded-2xl py-4 px-5 appearance-none outline-none focus:border-white/40 transition-all cursor-pointer hover:bg-black/60"
                >
                  {SORT_OPTIONS.map((opt) => (
                    <option
                      key={opt.value}
                      value={opt.value}
                      className="bg-[#050505] text-white py-4"
                    >
                      {opt.label}
                    </option>
                  ))}
                </select>
                <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-neutral-600 group-hover/select:text-white transition-colors">
                  <HiOutlineChevronDown size={14} />
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                resetFilters();
                if (typeof window !== "undefined" && window.innerWidth < 768) setIsFilterOpen(false);
              }}
              className="w-full py-5 bg-white/[0.05] border border-white/5 hover:bg-red-600 hover:border-red-600 text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-2xl transition-all duration-500 active:scale-95 shadow-lg"
            >
              Reset Filters
            </button>
          </div>
        </aside>

        {/* Main Content Areas */}
        <main className="flex-1 min-w-0">
          <div className="flex flex-col sm:flex-row items-baseline justify-between mb-8 md:mb-12 gap-4">
            <div className="flex items-center gap-4">
              <div className="w-1.5 h-10 bg-red-600 rounded-full shadow-[0_0_15px_rgba(220,38,38,0.5)]" />
              <div>
                <h1 className="text-4xl lg:text-5xl font-black uppercase tracking-wide leading-none italic italic">
                  Explore
                </h1>
                <p className="text-[10px] font-black uppercase tracking-[0.4em] text-neutral-600 mt-1">
                  Discovering {totalResults.toLocaleString()} Titles
                </p>
              </div>
            </div>

            <div className="hidden sm:flex items-center gap-2 bg-white/[0.03] backdrop-blur-md px-4 py-2 rounded-full border border-white/5">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-widest text-neutral-400">
                Live Database
              </span>
            </div>
          </div>

          {/* Results Container */}
          {results.length > 0 ? (
            <div className="space-y-10 md:space-y-16">
              <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-8 md:gap-x-4 md:gap-y-12 animate-fade-in">
                {results.map((movie) => (
                  <div key={movie.id}>
                    <MovieCard movie={{ ...movie, media_type: mediaType }} />
                  </div>
                ))}
              </div>

              {/* Pagination Controls */}
              <div className="pb-20 flex items-center justify-center border-t border-white/5 pt-12">
                <div className="flex flex-col sm:flex-row gap-5 items-center">
                  <div className="flex gap-x-3">
                    <button
                      disabled={page <= 1}
                      onClick={() => setPage(page - 1)}
                      className="group flex items-center gap-3 px-6 py-3.5 bg-neutral-900/50 backdrop-blur-md border border-neutral-800 rounded-2xl hover:bg-red-600 hover:border-red-600 transition-all disabled:opacity-20 disabled:hover:bg-neutral-900/50 disabled:cursor-not-allowed text-xs font-black uppercase tracking-widest"
                    >
                      <FaChevronLeft className="group-hover:-translate-x-1 transition-transform" />
                      <span>Prev</span>
                    </button>

                    <button
                      disabled={page >= totalPages}
                      onClick={() => setPage(page + 1)}
                      className="group flex items-center gap-3 px-6 py-3.5 bg-neutral-900/50 backdrop-blur-md border border-neutral-800 rounded-2xl hover:bg-red-600 hover:border-red-600 transition-all disabled:opacity-20 disabled:hover:bg-neutral-900/50 disabled:cursor-not-allowed text-xs font-black uppercase tracking-widest"
                    >
                      <span>Next</span>
                      <FaChevronRight className="group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>

                  <div className="flex items-center gap-4 px-6 py-3.5 bg-neutral-900/30 rounded-2xl border border-white/5 order-first sm:order-none">
                    <span className="text-red-600 font-black text-lg min-w-6 text-center">
                      {page}
                    </span>
                    <span className="text-neutral-700 font-black">/</span>
                    <span className="text-neutral-400 font-black text-sm">
                      {totalPages}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-40 border-2 border-dashed border-white/5 rounded-[40px] bg-white/[0.01]">
              <div className="w-20 h-20 bg-neutral-900 rounded-full flex items-center justify-center mb-6">
                <HiOutlineAdjustmentsHorizontal
                  size={32}
                  className="text-neutral-700"
                />
              </div>
              <h3 className="text-xl font-bold text-white uppercase tracking-tighter mb-2">
                No Matches Found
              </h3>
              <p className="text-neutral-500 text-[10px] font-black uppercase tracking-[0.2em] mb-10">
                Try adjusting your filters for better results
              </p>
              <button
                onClick={resetFilters}
                className="px-8 py-4 bg-white text-black text-[10px] font-black uppercase tracking-widest rounded-full hover:bg-red-600 hover:text-white transition-all active:scale-95"
              >
                Clear All Criteria
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
