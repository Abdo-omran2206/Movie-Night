"use client";
import Image from "next/image";
import { Season } from "../lib/tmdb";
import { useState } from "react";
import generateMovieAvatar from "../lib/generateMovieAvatar";
import Link from "next/link";

interface TvSeasonCardProps {
  season: Season;
  seriesId: number | string;
}

export default function TvSeasonCard({ season, seriesId }: TvSeasonCardProps) {
  const [imgError, setImgError] = useState(false);
  const posterUrl = `https://image.tmdb.org/t/p/w500`;

  const title = season.name;
  const date = season.air_date;
  const episodes = season.episode_count;

  const fallbackAvatar = generateMovieAvatar(title || "Unknown");
  const imageSrc =
    !imgError && season.poster_path
      ? posterUrl + season.poster_path
      : fallbackAvatar;

  return (
    <Link
      href={`/tv/season/${seriesId}/${season.season_number}`}
      className="group flex flex-col mx-1 md:mx-0 w-[200px] md:min-w-[200px] transition-all duration-300 hover:scale-105 active:scale-95"
    >
      {/* Poster */}
      <div className="relative aspect-2/3 overflow-hidden rounded-2xl shadow-lg mb-3 ring-1 ring-white/10 transition-all duration-300">
        <Image
          src={imageSrc}
          alt={title || "Poster"}
          fill
          className="object-cover brightness-90 group-hover:brightness-105 transition-all duration-300"
          onError={() => setImgError(true)}
        />
        {/* Episode Badge */}
        <div className="absolute top-2 right-2 bg-black/70 backdrop-blur-md text-white px-3 py-1 rounded-full text-[10px] md:text-xs font-bold border border-white/10 shadow-lg">
          {episodes} {episodes === 1 ? "EPISODE" : "EPISODES"}
        </div>
      </div>

      {/* Details */}
      <div className="flex flex-col gap-1 px-1">
        <h3 className="text-white font-semibold text-sm md:text-base line-clamp-1 group-hover:text-red-500 transition-colors">
          {title}
        </h3>
        <div className="flex items-center gap-2">
          <span className="text-gray-400 text-xs">
            {date ? new Date(date).getFullYear() : "Upcoming"}
          </span>
          {season.vote_average > 0 && (
            <>
              <span className="text-gray-600 text-[10px]">•</span>
              <span className="text-red-500/80 text-xs font-medium">
                ★ {season.vote_average.toFixed(1)}
              </span>
            </>
          )}
        </div>
      </div>
    </Link>
  );
}
