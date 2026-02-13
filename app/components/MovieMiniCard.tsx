import Image from "next/image";
import Link from "next/link";
import { FaStar } from "react-icons/fa";
import { Movie } from "../lib/tmdb";

type Props = {
  movies: Movie[];
  limit?: number;
};

export default function MovieMiniCard({ movies, limit }: Props) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 md:gap-6">
      {movies
        .sort(
          (a, b) =>
            new Date(b.release_date).getTime() -
            new Date(a.release_date).getTime(),
        )
        .slice(0, limit ?? movies.length)
        .map((item) => (
          <Link
            href={`/movie/${item.id}`}
            key={item.id}
            className="bg-neutral-900/40 ring-1 ring-white/10 rounded-2xl overflow-hidden hover:scale-105 transition-all duration-300 group "
          >
            {/* Image */}
            <div className="relative aspect-2/3 w-full">
              <Image
                src={
                  item.poster_path
                    ? `https://image.tmdb.org/t/p/w500${item.poster_path}`
                    : "/no-avatar.png"
                }
                alt={item.original_title}
                fill
                sizes="(max-width:768px) 50vw, (max-width:1200px) 33vw, 16vw"
                className="object-cover"
              />
            </div>

            {/* Content */}
            <div className="p-3 text-left">
              <h3 className="font-semibold text-sm truncate mb-1">
                {item.original_title}
              </h3>
              <p className="text-sm text-red-700 truncate flex items-center gap-1">
                <FaStar size={15} />
                {item.vote_average.toFixed(1)}/10
              </p>
            </div>
          </Link>
        ))}
    </div>
  );
}
