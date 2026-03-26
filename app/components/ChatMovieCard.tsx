"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { FaStar } from "react-icons/fa";
import generateMovieAvatar from "../lib/generateMovieAvatar";
import { slugify } from "../lib/slugify";
import { encodeId } from "../lib/hash";
import { posterUrl } from "@/app/constant/main";
import { Movie } from "../constant/types";

export default function ChatMovieCard({ movie }: { movie: Movie }) {
  const [imgError, setImgError] = useState(false);

  const isTv = movie.media_type === "tv" || movie.first_air_date;
  const originalTitle = movie.title || movie.name || movie.original_title || "Unknown";
  const dateStr = isTv ? movie.first_air_date : movie.release_date;
  const year = dateStr ? dateStr.split("-")[0] : "";
  const slug = slugify(`${originalTitle}${year ? `-${year}` : ""}`);
  const basePath = isTv ? "tv" : "movie";
  // Fallback to encodeId if no slug is provided, but we built one
  const href = `/${basePath}/${encodeId(movie.id)}/${slug}`;

  const fallbackAvatar = generateMovieAvatar(originalTitle);
  const imageSrc = !imgError && movie.poster_path ? posterUrl + movie.poster_path : fallbackAvatar;

  return (
    <Link 
      href={href}
      className="group relative flex flex-col w-[140px] md:w-[160px] shrink-0 overflow-hidden rounded-xl border border-white/10 bg-[#0a0a0a] transition-all duration-300 hover:-translate-y-1.5 hover:border-red-600/50 hover:shadow-[0_8px_20px_rgba(220,38,38,0.2)]"
    >
      <div className="relative aspect-[2/3] w-full overflow-hidden bg-neutral-900">
        <Image
          src={imageSrc}
          alt={originalTitle}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          onError={() => setImgError(true)}
          sizes="(max-width: 768px) 140px, 160px"
        />
        {/* Gradient Overlay for Text Readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-black/40 to-transparent transition-opacity duration-300 opacity-90 group-hover:opacity-100" />
        
        {/* Rating Badge */}
        {movie.vote_average > 0 && (
          <div className="absolute top-2 right-2 flex items-center gap-1 rounded-md bg-black/60 backdrop-blur-md px-1.5 py-0.5 text-[10px] font-medium text-white ring-1 ring-white/10">
            <FaStar className="text-red-500" size={8} />
            <span>{movie.vote_average.toFixed(1)}</span>
          </div>
        )}

        {/* Bottom Info inside the poster area */}
        <div className="absolute bottom-0 left-0 w-full p-2.5 flex flex-col justify-end transform transition-transform duration-300 translate-y-1 group-hover:translate-y-0">
           <h3 className="line-clamp-2 text-xs md:text-sm font-semibold text-white leading-tight mb-1 group-hover:text-red-400 transition-colors shadow-sm">
              {originalTitle}
           </h3>
           <div className="flex items-center gap-1.5 text-[10px] text-gray-400 font-medium">
             <span>{year}</span>
             <span className="w-1 h-1 rounded-full bg-red-600/60 inline-block" />
             <span className="uppercase tracking-wider">{basePath}</span>
           </div>
        </div>
      </div>
    </Link>
  );
}
