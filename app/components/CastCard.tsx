import Image from "next/image";
import Link from "next/link";

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
};

export default function CastList({ cast, limit, movieId }: Props) {
  if (!cast || cast.length === 0) return <p>No cast available</p>;

  const displayCast = limit ? cast.slice(0, limit) : cast;
  const hasMore = limit && cast.length > limit;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
      {displayCast.map((item) => (
        <Link
          href={`/actor/${item.id}`}
          key={item.id}
          className="bg-neutral-900/40 ring-1 ring-white/10 rounded-2xl overflow-hidden hover:scale-105 transition-all duration-300 group "
        >
          {/* Image */}
          <div className="relative aspect-2/3 w-full">
            <Image
              src={
                item.profile_path
                  ? `https://image.tmdb.org/t/p/w300${item.profile_path}`
                  : "/no-avatar.png"
              }
              alt={item.name}
              fill
              sizes="(max-width:768px) 50vw, (max-width:1200px) 33vw, 16vw"
              className="object-cover"
            />
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
          href={`/movie/cast/${movieId}`}
          className="bg-neutral-900/40 ring-1 ring-white/10 rounded-2xl overflow-hidden hover:scale-105 transition-all duration-300 group flex flex-col items-center justify-center gap-4 min-h-[250px]"
        >
          <div className="w-12 h-12 rounded-full bg-red-600/20 flex items-center justify-center group-hover:bg-red-600 transition-colors">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2.5}
              stroke="currentColor"
              className="w-6 h-6 text-red-600 group-hover:text-white transition-colors"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 4.5v15m7.5-7.5h-15"
              />
            </svg>
          </div>
          <span className="font-bold text-lg">Show More</span>
        </Link>
      )}
    </div>
  );
}
