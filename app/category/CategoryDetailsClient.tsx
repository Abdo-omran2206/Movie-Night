"use client";
import { useEffect, useState } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import { fetchMovies, getCategoryInfo } from "@/app/lib/tmdb";
import { Movie, CategoryDetailsClientProps } from "@/app/constant/types";
import MovieCard from "@/app/components/MovieCard";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import Link from "next/link";
import LoadingModel from "@/app/components/LoadingModel";
import NightGuide from "../components/NightGuide";

export default function CategoryDetailsClient({ 
  initialMovies = [], 
  initialTotalPages = 1 
}: CategoryDetailsClientProps) {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  
  const categoryRaw = params?.category;
  const category = (Array.isArray(categoryRaw) ? categoryRaw[0] : categoryRaw) as string;
  
  const pageParam = searchParams.get("page");
  const typeParam = searchParams.get("type") || "movie";
  const currentPage = pageParam ? parseInt(pageParam) : 1;

  const [movies, setMovies] = useState<Movie[]>(initialMovies);
  const [loading, setLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(initialTotalPages);
  const [mediaType, setMediaType] = useState(typeParam);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (typeParam !== mediaType) {
      setMediaType(typeParam);
    }
  }, [typeParam, mediaType]);

  const categoryInfo = getCategoryInfo(category, mediaType);
  const { endpoint, title: displayTitle } = categoryInfo;

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams();
    if (newPage > 1) params.set("page", newPage.toString());
    if (mediaType !== "movie") params.set("type", mediaType);
    router.push(`/category/${category}?${params.toString()}`);
  };

  const handleTypeChange = (newType: string) => {
    setMediaType(newType);
    const params = new URLSearchParams();
    if (newType !== "movie") params.set("type", newType);
    router.push(`/category/${category}?${params.toString()}`);
  };

  useEffect(() => {
    if (!mounted && initialMovies.length > 0 && typeParam === "movie") return;

    async function loadMovies() {
      if (!endpoint) return;
      setLoading(true);
      try {
        const { results, total_pages } = await fetchMovies(endpoint, currentPage);
        setMovies(results);
        setTotalPages(total_pages);
      } catch (error) {
        console.error("Failed to fetch movies:", error);
      } finally {
        setLoading(true);
        setTimeout(() => setLoading(false), 200);
      }
    }
    loadMovies();
    if (mounted) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [endpoint, currentPage, mediaType, mounted, initialMovies.length, typeParam]);

  const safeTitle = displayTitle || "Movies";

  if (loading && movies.length === 0) {
    return <LoadingModel message={`Fetching ${safeTitle}...`} />;
  }

  return (
    <>
      <Navbar />
      <main className="grow pt-[14vh] px-4 md:px-8 lg:px-16 mb-12">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 border-b border-white/5 pb-8">
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2 md:gap-4 group">
              <div className="w-1 md:w-1.5 h-8 md:h-14 bg-red-700 rounded-full shadow-[0_0_15px_rgba(185,28,28,0.7)] group-hover:h-16 transition-all duration-300" />
              <div className="flex flex-col">
                <h1 className="text-2xl md:text-5xl lg:text-6xl font-black text-white tracking-tighter uppercase leading-none">
                  {safeTitle}
                </h1>
                <div className="h-1 w-24 bg-linear-to-r from-red-700 to-transparent mt-3 rounded-full" />
              </div>
            </div>
            <p className="text-gray-400 text-sm md:text-lg max-w-2xl ml-4 md:ml-8">
              Explore our curated selection of top cinema and television.
            </p>
          </div>

          {/* Filter Dropdown */}
          <div className="flex items-center gap-3">
            <span className="text-[10px] font-black text-neutral-600 uppercase tracking-[0.2em] hidden sm:block">Media Type:</span>
            <div className="relative group/filter w-full sm:w-auto">
              <select
                value={mediaType}
                onChange={(e) => handleTypeChange(e.target.value)}
                className="appearance-none bg-neutral-900 border border-neutral-800 rounded-xl px-6 py-3.5 pr-14 text-[11px] font-black uppercase tracking-widest text-white hover:border-red-600 hover:bg-neutral-800 transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-red-600/50 w-full sm:w-48 shadow-xl"
              >
                <option value="movie">Movies</option>
                <option value="tv">TV Shows</option>
              </select>
              <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-[8px] opacity-40 group-hover/filter:scale-125 transition-all">▼</div>
            </div>
          </div>
        </div>

        {/* Movies Grid */}
        {loading ? (
             <div className="min-h-[40vh] flex items-center justify-center">
                <LoadingModel message={`Searching for ${safeTitle}...`} />
             </div>
        ) : movies.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 text-center">
            <div className="bg-neutral-900/50 p-8 rounded-3xl border border-neutral-800">
              <p className="text-white text-2xl font-semibold mb-4">No content found</p>
              <p className="text-gray-500 max-w-xs">
                We couldn&apos;t find any {mediaType === "movie" ? "movies" : "tv shows"} for this category right now.
              </p>
              <Link href="/" className="inline-block mt-8 px-8 py-3 bg-red-600 hover:bg-red-700 text-white rounded-full font-bold transition-all transform hover:scale-105 active:scale-95 shadow-lg shadow-red-900/20 uppercase tracking-widest text-xs">
                Back to Explore
              </Link>
            </div>
          </div>
        ) : (
          <div>
            <div className="flex flex-wrap gap-4 gap-y-10 md:gap-8 justify-center items-center">
              {movies.map((movie) => (
                <MovieCard key={movie.id} movie={movie} size="medium" />
              ))}
            </div>

            {/* Pagination Controls */}
            <div className="flex items-center justify-center gap-4 md:gap-8 mt-16 md:mt-24 mb-6">
              <button
                disabled={currentPage <= 1}
                onClick={() => handlePageChange(currentPage - 1)}
                className="group flex items-center gap-3 px-6 py-3.5 bg-neutral-900/50 backdrop-blur-md border border-neutral-800 rounded-2xl hover:bg-red-600 hover:border-red-600 transition-all disabled:opacity-20 disabled:hover:bg-neutral-900/50 disabled:cursor-not-allowed text-xs font-black uppercase tracking-widest"
              >
                <FaChevronLeft className="group-hover:-translate-x-1 transition-transform" />
                <span>Prev</span>
              </button>

              <div className="flex items-center gap-4 px-6 py-3.5 bg-neutral-900/30 rounded-2xl border border-white/5">
                <span className="text-red-600 font-black text-lg min-w-6 text-center">
                  {currentPage}
                </span>
                <span className="text-neutral-700 font-black">/</span>
                <span className="text-neutral-400 font-black text-sm">
                  {totalPages}
                </span>
              </div>

              <button
                disabled={currentPage >= totalPages}
                onClick={() => handlePageChange(currentPage + 1)}
                className="group flex items-center gap-3 px-6 py-3.5 bg-neutral-900/50 backdrop-blur-md border border-neutral-800 rounded-2xl hover:bg-red-600 hover:border-red-600 transition-all disabled:opacity-20 disabled:hover:bg-neutral-900/50 disabled:cursor-not-allowed text-xs font-black uppercase tracking-widest"
              >
                <span>Next</span>
                <FaChevronRight className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        )}
      </main>
            <NightGuide/>
      
      <Footer />
    </>
  );
}
