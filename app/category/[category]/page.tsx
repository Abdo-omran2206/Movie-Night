"use client";

import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { fetchMovies, Movie } from "../../lib/tmdb";
import MovieCard from "../../components/MovieCard";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

import { useRouter } from "next/navigation";
import { Suspense } from "react";

function CategoryContent() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const pageParam = searchParams.get("page");
  const category = params.category as string;
  const currentPage = pageParam ? parseInt(pageParam) : 1;
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);

  // Map category slug to API endpoint and Display Title
  const getCategoryInfo = (cat: string) => {
    switch (cat) {
      case "top_rated":
        return { endpoint: "/movie/top_rated", title: "Top Rated Movies" };
      case "popular":
      case "populer":
        return { endpoint: "/movie/popular", title: "Popular Movies" };
      case "upcoming":
        return { endpoint: "/movie/upcoming", title: "Upcoming Movies" };
      case "now_playing":
        return { endpoint: "/movie/now_playing", title: "Now Playing" };
      default:
        // Generic fallback if user adds more categories
        return {
          endpoint: `/movie/${cat}`,
          title: cat
            ? cat.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())
            : "Movies",
        };
    }
  };

  const { endpoint, title } = getCategoryInfo(category);

  useEffect(() => {
    async function loadMovies() {
      if (!endpoint) return;
      setLoading(true);
      const { results, total_pages } = await fetchMovies(endpoint, currentPage);
      setMovies(results);
      setTotalPages(total_pages);
      setLoading(false);
    }
    loadMovies();
  }, [endpoint, currentPage]);

  useEffect(() => {
    document.title = `${title} - Page ${currentPage} - Movie Night`;
  }, [title, currentPage]);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      router.push(`/category/${category}?page=${newPage}`);
      // Scroll to top is handled by Next.js navigation or browser usually, but can look smoother if we wait for content
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <div className="overflow-x-hidden bg-black min-h-screen flex flex-col">
      <Navbar />

      <main className="grow pt-[10vh] px-4 md:px-8 lg:px-16">
        {/* Header Section */}
        <div className="flex items-center gap-4 mb-8">
          <div className="w-1 md:w-1.5 h-10 md:h-14 bg-red-700 rounded-full shadow-lg shadow-red-700/50" />
          <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold text-white tracking-wide drop-shadow-lg">
            {title}
          </h1>
        </div>

        {/* Movies Grid */}
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 animate-pulse">
            {[...Array(10)].map((_, i) => (
              <div key={i} className="aspect-2/3 bg-neutral-800 rounded-2xl" />
            ))}
          </div>
        ) : movies.length > 0 ? (
          <>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-6 gap-y-10">
              {movies.map((movie) => (
                <MovieCard key={movie.id} movie={movie} />
              ))}
            </div>
            {/* Pagination */}
            <div className="flex items-center justify-center gap-6 mt-12">
              <button
                disabled={currentPage <= 1}
                onClick={() => handlePageChange(currentPage - 1)}
                className="flex items-center gap-2 px-6 py-3 bg-neutral-900 border border-neutral-800 rounded-full hover:bg-red-600 transition-all disabled:opacity-50 disabled:hover:bg-neutral-900"
              >
                <FaChevronLeft />
                <span>Prev</span>
              </button>

              <div className="flex items-center gap-2">
                <span className="text-red-600 font-bold text-lg">
                  {currentPage}
                </span>
                <span className="text-gray-500">/</span>
                <span className="text-gray-400">{totalPages}</span>
              </div>

              <button
                disabled={currentPage >= totalPages}
                onClick={() => handlePageChange(currentPage + 1)}
                className="flex items-center gap-2 px-6 py-3 bg-neutral-900 border border-neutral-800 rounded-full hover:bg-red-600 transition-all disabled:opacity-50 disabled:hover:bg-neutral-900"
              >
                <span>Next</span>
                <FaChevronRight />
              </button>
            </div>
          </>
        ) : (
          <div className="text-white text-center py-20 text-xl">
            No movies found for this category.
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

export default function CategoryPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-black" />}>
      <CategoryContent />
    </Suspense>
  );
}
