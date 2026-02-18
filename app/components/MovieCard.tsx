"use client";
import Image from "next/image";
import { Movie } from "../lib/tmdb";
import Link from "next/link";
import { FaRegStar, FaStar, FaStarHalfAlt } from "react-icons/fa";

interface MovieCardProps {
  movie: Movie;
  size?: "small" | "medium" | "large";
}

export default function MovieCard({ movie, size = "medium" }: MovieCardProps) {
  const posterUrl = `https://image.tmdb.org/t/p/w500`;

  return (
    <Link
      href={`/movie/${movie.id}`}
      className={`group flex flex-col mx-1 md:mx-0 w-[250px] md:min-w-[250px] cursor-pointer transition-all duration-300 hover:scale-105 active:scale-95 ${size === "small" ? "min-w-[130px]" :"min-w-[200px]"}`}
    >
      {/* Poster Image */}
      <div className="relative aspect-2/3 overflow-hidden rounded-2xl shadow-lg mb-3 ring-1 ring-white/10 transition-all duration-300">
        <Image
          src={
            movie.poster_path
              ? posterUrl + movie.poster_path
              : "/placeholder.jpg"
          }
          alt={movie.title}
          fill
          className="object-cover brightness-85 group-hover:brightness-105 transition-all duration-300"
        />
      </div>

      {/* Movie Details */}
      <div className="flex flex-col gap-2 px-1">
        <h3 className="text-white font-semibold text-sm md:text-lg line-clamp-2 leading-tight">
          {movie.title}
        </h3>

        <div className="flex flex-col gap-1">
          <span className="text-gray-300 text-xs md:text-sm">
            Release Date: {movie.release_date || "N/A"}
          </span>
          <div className="scale-75 md:scale-90 origin-left text-xs md:text-sm">
            <StarRating rating={movie.vote_average} />
          </div>
        </div>
      </div>
    </Link>
  );
}
export function StarRating({ rating }: { rating: number }) {
  const stars = [];
  const score = rating / 2; // Convert 0-10 to 0-5

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
