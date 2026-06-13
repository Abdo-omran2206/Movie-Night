import { Movie } from "@/constant/types";
import generateMovieAvatar from "@/lib/generateMovieAvatar";
import { encodeId } from "@/lib/hash";
import { slugify } from "@/lib/slugify";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { thumbnailUrl } from "@/constant/main";

export default function SearchMiniCards({ results }: { results: Movie[] }) {
  const filteredResults = results
    .filter((item) => item.media_type === "movie" || item.media_type === "tv")
    .slice(0, 5);

  if (filteredResults.length === 0) return null;

  return (
    <div className="absolute top-full left-0 right-0 bg-neutral-900/95 backdrop-blur-md rounded-lg shadow-2xl w-full border border-neutral-800 overflow-hidden z-50">
      {filteredResults.map((item) => (
        <SearchItem key={`${item.media_type}-${item.id}`} item={item} />
      ))}
    </div>
  );
}

export function SearchItem({ item }: { item: Movie }) {
  const [imgError, setImgError] = useState(false);
  const isTv = item.media_type === "tv";
  const title = isTv ? item.name : item.title;
  const date = isTv ? item.first_air_date : item.release_date;

  const year = date ? date.slice(0, 4) : "";
  const basePath = isTv ? "tv" : "movie";
  const href = `/${basePath}/${encodeId(item.id)}/${slugify(`${title || ""} ${year}`.trim())}`;

  const imageSrc =
    !imgError && item.poster_path
      ? `${thumbnailUrl}${item.poster_path}`
      : generateMovieAvatar(title || "Unknown");

  return (
    <Link
      href={href}
      className="flex items-center gap-3 px-3 py-2 hover:bg-neutral-800 transition border-b border-neutral-800 last:border-0 group"
    >
      <div className="relative w-12 h-16 shrink-0 rounded overflow-hidden bg-neutral-800">
        <Image
          src={imageSrc}
          alt={title || "Poster"}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
          onError={() => setImgError(true)}
          sizes="48px"
        />
      </div>

      <div className="flex-1 min-w-0">
        <h3 className="text-white text-sm font-medium line-clamp-1 group-hover:text-red-500 transition-colors">
          {title}
        </h3>
        <p className="text-gray-400 text-xs mt-1">
          {isTv ? "TV Show" : "Movie"} • {date ? date.slice(0, 4) : "N/A"}
        </p>
      </div>
    </Link>
  );
}
