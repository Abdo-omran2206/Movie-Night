"use client";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import generateMovieAvatar from "../lib/generateMovieAvatar";
import { slugify } from "../lib/slugify";
import { encodeId } from "../lib/hash";

interface Cast {
  id: number;
  name: string;
  character: string;
  profile_path: string | null;
}

type Props = {
  cast: Cast[];
  limit?: number;
  movieId?: string;
  navig: string;
};

const posterUrl = "https://image.tmdb.org/t/p/w500";

// 👇 كل ممثل ليه حالته الخاصة
function CastImage({ item }: { item: Cast }) {
  const [imgError, setImgError] = useState(false);

  const fallbackAvatar = generateMovieAvatar(item.name);

  const imageSrc =
    !imgError && item.profile_path
      ? posterUrl + item.profile_path
      : fallbackAvatar;

  return (
    <Image
      src={imageSrc}
      alt={item.name}
      fill
      sizes="(max-width:768px) 50vw, (max-width:1200px) 33vw, 16vw"
      className="object-cover"
      onError={() => setImgError(true)}
    />
  );
}

export default function CastList({ cast, limit, movieId, navig }: Props) {
  if (!cast || cast.length === 0) return <p>No cast available</p>;

  const displayCast = limit ? cast.slice(0, limit) : cast;
  const hasMore = limit && cast.length > limit;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 md:gap-6">
      {displayCast.map((item) => (
        <Link
          href={`/actor/${encodeId(item.id)}/${slugify(item.name)}`}
          key={item.id}
          className="bg-neutral-900/40 ring-1 ring-white/10 rounded-2xl overflow-hidden hover:scale-105 transition-all duration-300 group"
        >
          {/* Image */}
          <div className="relative aspect-2/3 w-full">
            <CastImage item={item} />
          </div>

          {/* Content */}
          <div className="p-3 text-center">
            <h3 className="font-semibold text-sm truncate">{item.name}</h3>
            <p className="text-xs text-gray-400 truncate">{item.character}</p>
          </div>
        </Link>
      ))}

      {hasMore && movieId && (
        <Link
          href={`/${navig}/cast/${encodeId(movieId)}`}
          className="bg-neutral-900/40 ring-1 ring-white/10 rounded-2xl overflow-hidden hover:scale-105 transition-all duration-300 group flex flex-col items-center justify-center gap-4 min-h-[250px]"
        >
          <div className="w-12 h-12 rounded-full bg-red-600/20 flex items-center justify-center group-hover:bg-red-600 transition-colors">
            +
          </div>
          <span className="font-bold text-lg">Show More</span>
        </Link>
      )}
    </div>
  );
}
