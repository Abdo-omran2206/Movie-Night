"use client";

import { useEffect, useState } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import { fetchMovies, Movie, getCategoryInfo } from "@/app/lib/tmdb";
import MovieCard from "@/app/components/MovieCard";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import Link from "next/link";
import LoadingModel from "@/app/components/LoadingModel";
import NightGuide from "../components/NightGuide";

interface CategoryDetailsClientProps {
  initialMovies?: Movie[];
  initialTotalPages?: number;
}

export default function CategoryDetailsClient({ 
  initialMovies = [], 
  initialTotalPages = 1 
}: CategoryDetailsClientProps) {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  
  // Extract category from params, handling both string and string[]
  const categoryRaw = params?.category;
  const category = (Array.isArray(categoryRaw) ? categoryRaw[0] : categoryRaw) as string;
  
  const pageParam = searchParams.get("page");
  const currentPage = pageParam ? parseInt(pageParam) : 1;

  const handlePageChange = (newPage: number) => {
    router.push(`/category/${category}?page=${newPage}`);
  };

  const [movies, setMovies] = useState<Movie[]>(initialMovies);
  const [loading, setLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(initialTotalPages);
  const [mounted, setMounted] = useState(false);

  const categoryInfo = getCategoryInfo(category);
  const { endpoint, title: displayTitle } = categoryInfo;

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    // Skip initial fetch if we have movies from SSR for the current page
    // but only on the very first mount of the component to avoid double fetching page 1
    if (!mounted && initialMovies.length > 0) return;

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
        setLoading(false);
      }
    }
    loadMovies();
    // Smooth scroll to top when page changes
    if (mounted) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [endpoint, currentPage, mounted, initialMovies.length]);

  // Prevent hydration error by ensuring displayTitle existence
  const safeTitle = displayTitle || "Movies";

  if (loading && movies.length === 0) {
    return <LoadingModel message={`Fetching ${safeTitle}...`} />;
  }

  return (
    <>
      <Navbar />
      <main className="grow pt-[10vh] px-4 md:px-8 lg:px-16 mb-12">
        {/* Header Section */}
        <div className="flex flex-col gap-4 mb-8 md:mb-12">
          <div className="flex items-center gap-2 md:gap-4 group">
            <div className="w-1 md:w-1.5 h-8 md:h-14 bg-red-700 rounded-full shadow-[0_0_15px_rgba(185,28,28,0.7)] group-hover:h-16 transition-all duration-300" />
            <div className="flex flex-col">
              <h1 className="text-2xl md:text-5xl lg:text-6xl font-extrabold text-white tracking-tight drop-shadow-2xl">
                {safeTitle}
              </h1>
              <div className="h-1 w-24 bg-linear-to-r from-red-700 to-transparent mt-2 rounded-full" />
            </div>
          </div>
          <p className="text-gray-400 text-sm md:text-lg max-w-2xl ml-4 md:ml-8 translate-y-[-4px]">
            Discover the highest-rated and most popular movies in {(safeTitle).toLowerCase()}. 
            Stay updated with the latest in cinema.
          </p>
        </div>

        {/* Movies Grid */}
        {movies.length === 0 && !loading ? (
          <div className="flex flex-col items-center justify-center py-32 text-center">
            <div className="bg-neutral-900/50 p-8 rounded-3xl border border-neutral-800">
              <p className="text-white text-2xl font-semibold mb-4">No movies found</p>
              <p className="text-gray-500 max-w-xs">
                We couldn&apos;t find any movies for this category right now. Please try again later.
              </p>
              <Link href="/" className="inline-block mt-8 px-8 py-3 bg-red-600 hover:bg-red-700 text-white rounded-full font-bold transition-all transform hover:scale-105 active:scale-95 shadow-lg shadow-red-900/20">
                Back to Explore
              </Link>
            </div>
          </div>
        ) : (
          <div>
            <div className="flex flex-wrap gap-4 gap-y-10 md:gap-8 justify-center items-center">
              {movies.map((movie) => (
                <MovieCard key={movie.id} movie={movie} size="small" />
              ))}
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-center gap-4 md:gap-6 mt-16 md:mt-24 mb-6">
              <button
                disabled={currentPage <= 1}
                onClick={() => handlePageChange(currentPage - 1)}
                className="flex items-center gap-2 px-4 py-2 md:px-6 md:py-3 bg-neutral-900 border border-neutral-800 rounded-full hover:bg-red-600 transition-all disabled:opacity-50 disabled:hover:bg-neutral-900 text-sm md:text-base"
              >
                <FaChevronLeft />
                <span>Prev</span>
              </button>

              <div className="flex items-center gap-2">
                <span className="text-red-600 font-bold text-base md:text-lg">
                  {currentPage}
                </span>
                <span className="text-gray-500">/</span>
                <span className="text-gray-400 text-sm md:text-base">
                  {totalPages}
                </span>
              </div>

              <button
                disabled={currentPage >= totalPages}
                onClick={() => handlePageChange(currentPage + 1)}
                className="flex items-center gap-2 px-4 py-2 md:px-6 md:py-3 bg-neutral-900 border border-neutral-800 rounded-full hover:bg-red-600 transition-all disabled:opacity-50 disabled:hover:bg-neutral-900 text-sm md:text-base"
              >
                <span>Next</span>
                <FaChevronRight />
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
