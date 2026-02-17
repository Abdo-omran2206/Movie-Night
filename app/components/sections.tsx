"use client";
import { useEffect, useState } from "react";
import { fetchMovies, Movie } from "../lib/tmdb";
import MovieCard from "./MovieCard";
import Link from "next/link";
import { FaArrowRight } from "react-icons/fa";

interface SectionProps {
  endpoint: string;
  title: string;
}

export default function Section({ endpoint, title }: SectionProps) {
  const [movies, setMovies] = useState<Movie[]>([]);

  useEffect(() => {
    async function loadMovies() {
      const { results } = await fetchMovies(endpoint);
      setMovies(results);
    }
    loadMovies();
  }, [endpoint]);

  if (!movies.length) return null;

  // Extract category from endpoint for the "View all" link
  const category = endpoint.split("/").pop() || "";

  return (
    <section className="py-4 md:py-8 px-2 sm:px-4 relative" id={title}>
      <div className="flex items-center justify-between gap-3 mb-4 md:mb-6">
        <div className="flex items-center gap-2 md:gap-3">
          <div className="w-1 md:w-1.5 h-8 md:h-16 bg-red-700 rounded-full shadow-lg shadow-red-700/50" />

          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white tracking-wide md:tracking-widest drop-shadow-lg">
            {title}
          </h2>
        </div>

        <Link
          href={`/category/${category}`}
          className="flex items-center gap-1 md:gap-2 text-xs md:text-lg text-red-600 hover:text-red-700 hover:gap-2 md:hover:gap-3 transition-all duration-300 group"
        >
          <span className="inline sm:hidden text-xs">More</span>
          <span className="hidden sm:inline">View all</span>
          <FaArrowRight
            size={16}
            className="md:w-5 md:h-5 group-hover:translate-x-1 transition-transform duration-300"
          />
        </Link>
      </div>

      {/* Movies Container */}
      <div
        id={`scroll-${endpoint}`}
        className="flex gap-2 sm:gap-4 overflow-x-auto scroll-smooth pb-6 sm:pb-10 pt-2 sm:pt-5 custom-scrollbar"
      >
        {movies.map((movie) => (
          <MovieCard key={movie.id} movie={movie} size="large"/>
        ))}
      </div>
    </section>
  );
}
