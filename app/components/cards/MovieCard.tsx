"use client";
import Image from "next/image";
import { Movie, MovieCardProps } from "@/app/constant/types";
import { posterUrl } from "@/app/constant/main";
import Link from "next/link";
import { FaRegStar, FaStar, FaStarHalfAlt } from "react-icons/fa";
import { useState } from "react";
import generateMovieAvatar from "../../lib/generateMovieAvatar";
import { slugify } from "../../lib/slugify";
import { encodeId } from "../../lib/hash";

export default function MovieCard({ movie, size = "medium" }: MovieCardProps) {
  const [imgError, setImgError] = useState(false);

  const mediaType = movie.media_type || (movie.first_air_date ? "tv" : movie.known_for_department ? "person" : "movie");

  // Detect Types
  const isTv = mediaType === "tv";
  const isPers = mediaType === "person";

  const title = isPers ? movie.name : (movie.title || movie.name || movie.original_title || "Unknown");

  const date = isTv ? movie.first_air_date : movie.release_date;
  const routes: Record<string, string> = {
    movie: "movie",
    tv: "tv",
    person: "actor",
  };
  const basePath = routes[mediaType] || "movie";

  function getYear(item: Movie) {
    const dateStr = item.release_date || item.first_air_date;
    return dateStr ? dateStr.split("-")[0] : "";
  }
  const year = isPers ? "" : getYear(movie);

  const slug = slugify(`${title}${year ? `-${year}` : ""}`);

  const href = `/${basePath}/${encodeId(movie.id)}/${slug}`;

  const fallbackAvatar = generateMovieAvatar(title || "Unknown");

  let imageSrc: string = fallbackAvatar;

  if (!imgError) {
    if (isPers && movie.profile_path) {
      imageSrc = posterUrl + movie.profile_path;
    } else if (movie.poster_path) {
      imageSrc = posterUrl + movie.poster_path;
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
          sizes="(max-width: 768px) 250px, 250px"
        />
      </div>

      {/* Details */}
      <div className="flex flex-col gap-2 px-1 text-left">
        <h3 className="text-white font-semibold text-sm md:text-lg line-clamp-2 leading-tight group-hover:text-red-500 transition-colors">
          {title}
        </h3>
        <div className="flex flex-col gap-1">
          {isPers ? (
            <span className="text-gray-400 text-xs md:text-sm italic">
              {movie.known_for_department || "Person"}
            </span>
          ) : (
            <>
              <span className="text-gray-400 text-xs md:text-sm">
                {isTv ? "First Air Date" : "Release Date"}: {date || "N/A"}
              </span>
              <div className="scale-75 md:scale-90 origin-left text-xs md:text-sm">
                <StarRating rating={movie.vote_average} />
              </div>
            </>
          )}
        </div>
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
