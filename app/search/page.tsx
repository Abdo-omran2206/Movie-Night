"use client";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import { search, Movie } from "@/app/lib/tmdb";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import MovieCard from "../components/MovieCard";
import LoadingModel from "@/app/components/LoadingModel";

import { FaChevronLeft, FaChevronRight } from "react-icons/fa6";

function SearchContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";
  const pageParam = searchParams.get("page");
  const initialPage = pageParam ? parseInt(pageParam) : 1;

  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(initialPage);
  const [totalPages, setTotalPages] = useState(1);

  // Sync page state when URL page param changes (e.g. back button)
  useEffect(() => {
    if (pageParam) {
      const p = parseInt(pageParam);
      if (p !== page) setPage(p);
    } else {
      setPage(1);
    }
  }, [pageParam, page]);

  // Update URL function
  const updateUrl = (newQuery: string, newPage: number) => {
    const params = new URLSearchParams();
    if (newQuery) params.set("q", newQuery);
    if (newPage > 1) params.set("page", newPage.toString());
    router.push(`/search?${params.toString()}`);
  };

  useEffect(() => {
    async function fetchResults() {
      if (!query) {
        setMovies([]);
        setTotalPages(1);
        setPage(1);
        return;
      }
      setLoading(true);
      try {
        const results = await search(query, page);
        if (results && results.results) {
          setMovies(results.results);
          setTotalPages(results.total_pages || 1);
        }
      } catch (error) {
        console.error("Search failed:", error);
      } finally {
        setLoading(false);
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    }
    fetchResults();
  }, [query, page]);

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    updateUrl(query, newPage);
  };

  return (
    <main className="min-h-screen bg-black text-white pt-32 pb-20 px-4 md:px-10 lg:px-20">
      <div className="container mx-auto">
        <div className="mb-6 md:mb-12">
          <h1 className="text-2xl md:text-5xl font-bold mb-4">
            {query ? `Search results for "${query}"` : "Search"}
          </h1>
          <div className="w-12 md:w-20 h-1.5 bg-red-600 rounded-full" />
        </div>

        {loading ? (
          <LoadingModel message="Searching the Galaxy..." />
        ) : movies.length > 0 ? (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-6 mb-10 md:mb-16">
              {movies.map((movie) => (
                <MovieCard key={movie.id} movie={movie} />
              ))}
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-center gap-4 md:gap-6 mt-8 md:mt-12">
              <button
                disabled={page <= 1}
                onClick={() => handlePageChange(page - 1)}
                className="flex items-center gap-2 px-4 py-2 md:px-6 md:py-3 bg-neutral-900 border border-neutral-800 rounded-full hover:bg-red-600 transition-all disabled:opacity-50 disabled:hover:bg-neutral-900 text-sm md:text-base"
              >
                <FaChevronLeft />
                <span>Prev</span>
              </button>

              <div className="flex items-center gap-2">
                <span className="text-red-600 font-bold text-base md:text-lg">
                  {page}
                </span>
                <span className="text-gray-500">/</span>
                <span className="text-gray-400 text-sm md:text-base">
                  {totalPages}
                </span>
              </div>

              <button
                disabled={page >= totalPages}
                onClick={() => handlePageChange(page + 1)}
                className="flex items-center gap-2 px-4 py-2 md:px-6 md:py-3 bg-neutral-900 border border-neutral-800 rounded-full hover:bg-red-600 transition-all disabled:opacity-50 disabled:hover:bg-neutral-900 text-sm md:text-base"
              >
                <span>Next</span>
                <FaChevronRight />
              </button>
            </div>
          </>
        ) : query ? (
          <div className="text-center py-20">
            <p className="text-xl text-gray-400">
              No movies found matching your search.
            </p>
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-xl text-gray-400">
              Start typing to search for movies.
            </p>
          </div>
        )}
      </div>
    </main>
  );
}

export default function SearchPage() {
  return (
    <>
      <Navbar />
      <Suspense fallback={<LoadingModel />}>
        <SearchContent />
      </Suspense>
      <Footer />
    </>
  );
}
