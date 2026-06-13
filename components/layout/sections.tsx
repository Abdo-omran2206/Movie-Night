"use client";
import { useEffect, useState } from "react";
// Use Next API for fetching movies
import MovieCard from "../cards/MovieCard";
import { SectionSkeleton } from "../ui/Skeleton";
import { Movie, SectionProps } from "../../constant/types";


export default function Section({
  endpoint,
  title,
}: SectionProps) {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadMovies() {
      setLoading(true);
      const language =
        typeof window !== "undefined" ? navigator.language : "en-US";
      try {
        const res = await fetch(
          `/api/movies?endpoint=${encodeURIComponent(endpoint)}&page=1&language=${encodeURIComponent(
            language,
          )}`,
        );
        const data = await res.json();
        setMovies(data.results || []);
      } catch (err) {
        console.error("Section API error:", err);
        setMovies([]);
      }
      setLoading(false);
    }
    loadMovies();
  }, [endpoint]);

  if (loading) return <SectionSkeleton />;
  if (!movies.length) return null;

  return (
    <section className="py-4 md:py-8 px-2 sm:px-4 relative" id={title}>
      <div className="flex items-center justify-between gap-3 mb-4 md:mb-6">
        <div className="flex items-center gap-2 md:gap-3">
          <div className="w-1 md:w-1.5 h-8 md:h-16 bg-red-700 rounded-full shadow-lg shadow-red-700/50" />

          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white tracking-wide md:tracking-widest drop-shadow-lg">
            {title}
          </h2>
        </div>
      </div>

      {/* Movies Container */}
      <div
        id={`scroll-${endpoint}`}
        className="flex gap-2 sm:gap-4 overflow-x-auto scroll-smooth pb-6 sm:pb-10 pt-2 sm:pt-5 custom-scrollbar"
      >
        {movies.map((movie) => (
          <MovieCard key={movie.id} movie={movie} size="large" />
        ))}
      </div>
    </section>
  );
}