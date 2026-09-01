"use client";
import Image from "next/image";
import { MovieCardProps } from "@/constant/types";
import { posterUrl } from "@/constant/main";
import Link from "next/link";
import generateMovieAvatar from "../../lib/generateMovieAvatar";
import { slugify } from "../../lib/slugify";
import { encodeId } from "../../lib/hash";
import { FaTrash } from "react-icons/fa";

export default function PlaylistMovieCard({
  movie,
  size = "medium",
  onRemove,
  removing = false,
}: MovieCardProps) {
  const mediaType = movie.media_type || (movie.first_air_date ? "tv" : "movie");

  const title = movie.title || movie.name || movie.original_title || "Unknown";

  const routes: Record<string, string> = {
    movie: "movie",
    tv: "tv",
  };
  const basePath = routes[mediaType] || "movie";

  const slug = slugify(`${title}`);

  const href = `/${basePath}/${encodeId(movie.id)}/${slug}`;

  const fallbackAvatar = generateMovieAvatar(title || "Unknown");

  let imageSrc: string = fallbackAvatar;

  imageSrc = posterUrl + movie.poster_path;

  return (
    <div
      className={`group relative flex flex-col mx-1 md:mx-0 w-[250px] md:min-w-[250px] transition-all duration-300 hover:scale-105 active:scale-95 ${
        size === "small" ? "min-w-[130px]" : "min-w-[200px]"
      }`}
    >
      {onRemove && (
        <button
          type="button"
          title="Remove from playlist"
          disabled={removing}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            if (!removing) onRemove(movie.id);
          }}
          className="absolute top-2 right-2 z-20 flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-neutral-950/90 border border-red-500/40 text-red-400 hover:bg-red-600 hover:text-white hover:border-red-500 text-[11px] font-semibold tracking-wide uppercase shadow-lg cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <FaTrash size={11} />
          {removing ? "Removing" : "Remove"}
        </button>
      )}

      <Link href={href} className="flex flex-col cursor-pointer">
        {/* Poster */}
        <div className="relative aspect-2/3 overflow-hidden rounded-2xl shadow-lg mb-3 ring-1 ring-white/10 transition-all duration-300">
          <Image
            src={imageSrc}
            alt={title || "Poster"}
            fill
            className="object-cover brightness-85 group-hover:brightness-105 transition-all duration-300"
            sizes="(max-width: 768px) 250px, 250px"
          />
        </div>

        {/* Details */}
        <div className="flex flex-col gap-2 px-1 text-left">
          <h3 className="text-white font-semibold text-sm md:text-lg line-clamp-2 leading-tight group-hover:text-red-500 transition-colors">
            {title}
          </h3>
          <p className="text-xs text-neutral-600 group-hover:text-neutral-500 transition-colors">
            {movie.overview
              ? movie.overview.split(" ").slice(0, 20).join(" ") + "..."
              : "No description available"}
          </p>
        </div>
      </Link>
    </div>
  );
}
