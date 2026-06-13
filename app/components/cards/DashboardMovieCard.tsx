import { DashboardMovieCardProps } from "@/app/constant/types";
import Image from "next/image";
import Link from "next/link";
import { posterUrl, backdropUrl } from "@/app/constant/main";
import { slugify } from "@/app/lib/slugify";
import { encodeId } from "@/app/lib/hash";

export default function DashboardMovieCard(movie: DashboardMovieCardProps) {
  const isTv = movie.type === "tv";
  const href = `/${isTv ? "tv" : "movie"}/${encodeId(movie.movie_id)}/${slugify(movie.title)}`;

  return (
    <Link
      href={href}
      className="group relative w-full h-36 md:h-40 rounded-xl overflow-hidden border border-neutral-800 hover:border-red-600/50 bg-neutral-900 transition-all duration-300 flex hover:shadow-[0_0_20px_rgba(220,38,38,0.15)] shadow-xl"
    >
      {/* Blurred Backdrop Background */}
      <div className="absolute inset-0 z-0">
        {movie.backdrop_path ? (
          <Image
            src={backdropUrl + movie.backdrop_path}
            alt={movie.title || "Backdrop"}
            fill
            className="object-cover opacity-100 blur-sm group-hover:opacity-30 group-hover:scale-105 transition-all duration-500"
            sizes="(max-width: 768px) 100vw, 500px"
          />
        ) : (
          <div className="w-full h-full bg-neutral-900" />
        )}
        {/* Gradient Fade from Left to Right */}
        <div className="absolute inset-0 bg-linear-to-r from-neutral-950 via-neutral-950/80 to-transparent z-10" />
      </div>

      {/* Card Content */}
      <div className="relative z-20 flex flex-row items-center w-full h-full p-3 gap-4">
        {/* Movie Poster */}
        {movie.poster_path ? (
          <div className="relative h-full aspect-2/3 shrink-0 rounded-lg overflow-hidden border border-white/10 shadow-lg group-hover:border-red-600/30 transition-colors">
            <Image
              src={posterUrl + movie.poster_path}
              alt={movie.title || "Poster"}
              fill
              className="object-cover"
              sizes="150px"
            />
          </div>
        ) : (
          <div className="relative h-full aspect-2/3 shrink-0 rounded-lg bg-neutral-800 border border-neutral-700 flex flex-col items-center justify-center text-center p-2">
            <span className="text-neutral-500 text-[10px] uppercase font-bold">
              No Image
            </span>
          </div>
        )}

        {/* Text details */}
        <div className="flex flex-col flex-1 min-w-0 pr-2">
          {/* Badges */}
          <div className="flex flex-row gap-2 mb-1">
            <span className="self-start px-2 py-0.5 rounded-sm bg-red-600/20 text-red-500 text-[10px] font-black tracking-widest uppercase border border-red-600/20">
              {movie.type === "tv" ? "TV SHOW" : "MOVIE"}
            </span>
            {(() => {
              const config = {
                Watching: { label: "Watching", color: "#4CAF50" },
                "Watch Later": { label: "Watch Later", color: "#2196F3" },
                Completed: { label: "Completed", color: "#9C27B0" },
                Dropped: { label: "Dropped", color: "#F44336" },
              }[movie.status] || { label: movie.status, color: "#e50914" };

              return (
                <span
                  className="self-start px-2 py-0.5 rounded-sm text-[10px] font-black tracking-widest uppercase border"
                  style={{
                    backgroundColor: `${config.color}20`,
                    color: config.color,
                    borderColor: `${config.color}40`,
                  }}
                >
                  {config.label}
                </span>
              );
            })()}
          </div>

          <h3
            className="text-lg md:text-xl font-bold text-white leading-tight mb-1 truncate group-hover:text-red-500 transition-colors"
            style={{ fontFamily: "var(--font-bebas)" }}
          >
            {movie.title}
          </h3>

          <p className="text-neutral-400 text-xs line-clamp-2 md:line-clamp-3">
            {movie.overview || "No description available."}
          </p>
        </div>
      </div>
    </Link>
  );
}
