"use client";

import Image from "next/image";
import Link from "next/link";
import { FaStar } from "react-icons/fa";
import { useState } from "react";
import { MovieSummary } from "../lib/tmdb";
import generateMovieAvatar from "../lib/generateMovieAvatar";
import { slugify } from "../lib/slugify";

type Props = {
  movies: MovieSummary[];
  limit?: number;
};

const posterUrl = "https://image.tmdb.org/t/p/w500";

function MovieImage({ item }: { item: MovieSummary }) {
  const [imgError, setImgError] = useState(false);

  const isTv = !item.title && !!item.name;
  const title = isTv ? item.name : item.title;
  const originalTitle = isTv ? item.name : item.original_title;

  const fallbackAvatar = generateMovieAvatar(originalTitle || "Unknown");

  const imageSrc =
    !imgError && item.poster_path
      ? posterUrl + item.poster_path
      : fallbackAvatar;

  return (
    <Image
      src={imageSrc}
      alt={originalTitle || "Poster"}
      fill
      sizes="(max-width:768px) 50vw, (max-width:1200px) 33vw, 16vw"
      className="object-cover"
      onError={() => setImgError(true)}
    />
  );
}

export default function MovieMiniCard({ movies, limit }: Props) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 md:gap-6">
      {movies
        .sort((a, b) => {
          const dateA = a.release_date || a.first_air_date || "";
          const dateB = b.release_date || b.first_air_date || "";
          return new Date(dateB).getTime() - new Date(dateA).getTime();
        })
        .slice(0, limit ?? movies.length)
        .map((item) => {
          const isTv = !item.title && !!item.name;
          const title = isTv ? item.name : item.title;
          const originalTitle = isTv ? item.name : item.original_title;
          const href = isTv
            ? `/tv/${slugify(title)}/${item.id}`
            : `/movie/${slugify(title)}/${item.id}`;

          return (
            <Link
              href={href}
              key={item.id}
              className="bg-neutral-900/40 ring-1 ring-white/10 rounded-2xl overflow-hidden hover:scale-105 transition-all duration-300 group"
            >
              {/* Image */}
              <div className="relative aspect-2/3 w-full">
                <MovieImage item={item} />
              </div>

              {/* Content */}
              <div className="p-3 text-left">
                <h3 className="font-semibold text-sm truncate mb-1">
                  {originalTitle}
                </h3>
                <p className="text-sm text-red-700 truncate flex items-center gap-1">
                  <FaStar size={15} />
                  {item.vote_average.toFixed(1)}/10
                </p>
              </div>
            </Link>
          );
        })}
    </div>
  );
}
