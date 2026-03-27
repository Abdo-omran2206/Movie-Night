"use client";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import { search } from "@/app/lib/tmdb";
import { Movie } from "@/app/constant/types";
import Navbar from "@/app/components/ui/Navbar";
import Footer from "@/app/components/ui/Footer";
import MovieCard from "../components/cards/MovieCard";
import LoadingModel from "@/app/components/models/LoadingModel";
import { siteUrl } from "@/app/constant/main";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa6";

function SearchContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";
  const pageParam = searchParams.get("page");
  const typeParam = searchParams.get("type") || "multi";
  const initialPage = pageParam ? parseInt(pageParam) : 1;

  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(initialPage);
  const [totalPages, setTotalPages] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const [mediaType, setMediaType] = useState(typeParam);

  // Sync state when URL params change
  useEffect(() => {
    if (pageParam) {
      const p = parseInt(pageParam);
      if (p !== page) setPage(p);
    } else {
      setPage(1);
    }
  }, [pageParam, page]);

  useEffect(() => {
    if (typeParam !== mediaType) {
      setMediaType(typeParam);
      setPage(1); // Reset page on type change
    }
  }, [typeParam, mediaType]);

  // Update URL function
  const updateUrl = (newQuery: string, newPage: number, newType: string) => {
    const params = new URLSearchParams();
    if (newQuery) params.set("q", newQuery);
    if (newPage > 1) params.set("page", newPage.toString());
    if (newType !== "multi") params.set("type", newType);
    router.push(`/search?${params.toString()}`);
  };

  useEffect(() => {
    async function fetchResults() {
      if (!query) {
        setMovies([]);
        setTotalPages(1);
        setTotalResults(0);
        return;
      }
      setLoading(true);
      try {
        const results = await search(query, page, mediaType);
        if (results && results.results) {
          setMovies(results.results);
          setTotalPages(results.total_pages || 1);
          setTotalResults(results.total_results || 0);
        }
      } catch (error) {
        console.error("Search failed:", error);
      } finally {
        setLoading(false);
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    }
    fetchResults();
  }, [query, page, mediaType]);

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    updateUrl(query, newPage, mediaType);
  };

  const handleTypeChange = (newType: string) => {
    setMediaType(newType);
    setPage(1);
    updateUrl(query, 1, newType);
  };

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SearchResultsPage",
    mainEntity: {
      "@type": "ItemList",
      name: `Search results for "${query}"`,
      itemListElement: movies.map((movie, index) => ({
        "@type": "ListItem",
        position: index + 1,
        url: `${siteUrl}/${movie.media_type === "tv" ? "tv" : "movie"}/${movie.id}`,
        name: movie.title || movie.name,
      })),
    },
  };

  return (
    <main className="min-h-screen bg-black text-white pt-32 pb-20 px-4 md:px-10 lg:px-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="container mx-auto">
        <div className="mb-8 md:mb-16 flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/5 pb-8">
          <div className="flex-1">
            <h1 className="text-4xl md:text-6xl font-black tracking-wide mb-2 leading-none">
              {query ? (
                <>
                  RESULTS FOR{" "}
                  <span className="text-red-600">
                    &quot;{query.toUpperCase()}&quot;
                  </span>
                </>
              ) : (
                "SEARCH"
              )}
            </h1>
            <div className="h-1 w-50 bg-linear-to-r from-red-700 to-transparent mb-2 rounded-full" />

            <div className="flex items-center gap-4 text-neutral-500 font-bold text-xs md:text-sm uppercase tracking-[0.2em] transition-all">
              <span className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-red-600 rounded-full animate-pulse" />
                FOUND {totalResults.toLocaleString()} ITEMS
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-[10px] font-black text-neutral-600 uppercase tracking-[0.2em] hidden sm:block">
              Filter by Type:
            </span>
            <div className="relative group/filter w-full sm:w-auto">
              <select
                value={mediaType}
                onChange={(e) => handleTypeChange(e.target.value)}
                className="appearance-none bg-neutral-900 border border-neutral-800 rounded-xl px-6 py-3.5 pr-14 text-[11px] font-black uppercase tracking-[0.1em] text-white hover:border-red-600 hover:bg-neutral-800 transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-red-600/50 w-full sm:w-48"
              >
                <option value="multi">All Items</option>
                <option value="movie">Movies</option>
                <option value="tv">TV Shows</option>
                <option value="person">Actors</option>
              </select>
              <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-[8px] opacity-40 group-hover/filter:scale-125 transition-all">
                ▼
              </div>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="min-h-[40vh] flex items-center justify-center">
            <LoadingModel message="Searching the Galaxy..." />
          </div>
        ) : movies.length > 0 ? (
          <>
            <div className="flex flex-wrap gap-4 gap-y-6 md:gap-5 justify-center items-center">
              {movies.map((movie) => (
                <MovieCard key={movie.id} movie={movie} />
              ))}
            </div>

            {/* Pagination Controls */}
            <div className="flex items-center justify-center gap-4 md:gap-8 mt-16 lg:mt-24">
              <button
                disabled={page <= 1}
                onClick={() => handlePageChange(page - 1)}
                className="group flex items-center gap-3 px-6 py-3.5 bg-neutral-900/50 backdrop-blur-md border border-neutral-800 rounded-2xl hover:bg-red-600 hover:border-red-600 transition-all disabled:opacity-20 disabled:hover:bg-neutral-900/50 disabled:cursor-not-allowed text-xs font-black uppercase tracking-widest"
              >
                <FaChevronLeft className="group-hover:-translate-x-1 transition-transform" />
                <span>Previous</span>
              </button>

              <div className="flex items-center gap-2">
                <span className="text-red-600 font-bold text-base md:text-lg">
                  {page}
                </span>
                <span className="text-neutral-700 font-black">/</span>
                <span className="text-neutral-400 font-black text-sm">
                  {totalPages}
                </span>
              </div>

              <button
                disabled={page >= totalPages}
                onClick={() => handlePageChange(page + 1)}
                className="flex items-center gap-2 px-4 py-2 md:px-6 md:py-3 bg-neutral-900 border border-neutral-800 rounded-full hover:bg-red-600 transition-all disabled:opacity-50 disabled:hover:bg-neutral-900 text-sm md:text-base"
              >
                <span>Next</span>
                <FaChevronRight className="group-hover:translate-x-1 transition-transform" />
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
          <div className="text-center py-32">
            <p className="text-2xl font-black tracking-tight text-neutral-700 uppercase">
              Explore your next movie night obsession.
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
