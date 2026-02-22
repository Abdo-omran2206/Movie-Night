"use client";
import Image from "next/image";
import { Movie } from "../lib/tmdb";
import Link from "next/link";
import { FaRegStar, FaStar, FaStarHalfAlt } from "react-icons/fa";
import { useState } from "react";
import generateMovieAvatar from "../lib/generateMovieAvatar";
import { slugify } from "../lib/slugify";

interface MovieCardProps {
  movie: Movie;
  size?: "small" | "medium" | "large";
}

export default function MovieCard({ movie, size = "medium" }: MovieCardProps) {
  const [imgError, setImgError] = useState(false);
  const posterUrl = `https://image.tmdb.org/t/p/w500`;

  const mediaType = movie.media_type || (movie.first_air_date ? "tv" : "movie");

  const title = movie.title || movie.name || movie.original_title || "Unknown";

  // Detect Types
  const isTv = movie.media_type === "tv" || (!movie.title && !!movie.name);
  const isPers = movie.media_type === "person";

  // FIX: persons use name not title

  const date = isTv ? movie.first_air_date : movie.release_date;
  const routes: Record<string, string> = {
    movie: "movie",
    tv: "tv",
    person: "actor",
  };

  const basePath = routes[mediaType] || "movie";
  const href = `/${basePath}/${slugify(title)}/${movie.id}`;

  const fallbackAvatar = generateMovieAvatar(title || "Unknown");

  // FIX: prevent building invalid URLs after error
  let imageSrc = fallbackAvatar;

  if (!imgError) {
    if (movie.poster_path) {
      imageSrc = posterUrl + movie.poster_path;
    } else if (isPers && movie.profile_path) {
      imageSrc = posterUrl + movie.profile_path;
    }
  }

  return (
    <Link
      href={href}
      className={`group flex flex-col mx-1 md:mx-0 w-[250px] md:min-w-[250px] cursor-pointer transition-all duration-300 hover:scale-105 active:scale-95 ${
        size === "small" ? "min-w-[130px]" : "min-w-[200px]"
      }`}
    >
      {/* Poster */}
      <div className="relative aspect-2/3 overflow-hidden rounded-2xl shadow-lg mb-3 ring-1 ring-white/10 transition-all duration-300">
        <Image
          key={imgError ? "fallback" : "main"} // FIX: force remount after error
          src={imageSrc}
          alt={title || "Poster"}
          fill
          className="object-cover brightness-85 group-hover:brightness-105 transition-all duration-300"
          onError={() => setImgError(true)}
        />
      </div>

      {/* Details */}

      <div className="flex flex-col gap-2 px-1">
        <h3 className="text-white font-semibold text-sm md:text-lg line-clamp-2 leading-tight">
          {title}
        </h3>
        {!isPers && (
          <div className="flex flex-col gap-1">
            <span className="text-gray-300 text-xs md:text-sm">
              {isTv ? "First Air Date" : "Release Date"}: {date || "N/A"}
            </span>

            <div className="scale-75 md:scale-90 origin-left text-xs md:text-sm">
              <StarRating rating={movie.vote_average} />
            </div>
          </div>
        )}
      </div>
    </Link>
  );
}

export function StarRating({ rating }: { rating: number }) {
  const stars = [];
  const score = rating / 2;

  for (let i = 1; i <= 5; i++) {
    if (i <= score) {
      stars.push(<FaStar key={i} size={23} className="text-yellow-400" />);
    } else if (i === Math.ceil(score) && score % 1 >= 0.5) {
      stars.push(
        <FaStarHalfAlt key={i} size={23} className="text-yellow-400" />,
      );
    } else {
      stars.push(<FaRegStar key={i} size={23} className="text-gray-400" />);
    }
  }

  return <div className="flex gap-1 items-center">{stars}</div>;
}
