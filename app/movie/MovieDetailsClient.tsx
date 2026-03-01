"use client";
import Footer from "@/app/components/Footer";
import Navbar from "@/app/components/Navbar";
import Image from "next/image";
import { fetchMovieDetails, MovieDetail } from "@/app/lib/tmdb";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useEffect, useState } from "react";
import { FaCirclePlay, FaPlay } from "react-icons/fa6";
import CastList from "@/app/components/CastCard";
import MovieMiniCard from "@/app/components/MovieMiniCard";
import TrailerModal from "@/app/components/TrailerModel";
import { FaStar, FaRegStar } from "react-icons/fa";
import LoadingModel from "@/app/components/LoadingModel";
import generateMovieAvatar from "@/app/lib/generateMovieAvatar";
import { slugify } from "@/app/lib/slugify";
import { decodeId } from "@/app/lib/hash";

export default function MovieDetailsClient() {
  const [data, setData] = useState<MovieDetail | null>(null);
  const params = useParams();
  const slug = params?.slug;
  const slugArray = Array.isArray(slug) ? slug : [slug as string];
  const encodedId = slugArray[0];
  const idStr = decodeId(encodedId);
  const id = idStr ? idStr : ""; // Use empty string if decoding fails
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [imgError, setImgError] = useState(false);
  const posterUrl = "https://image.tmdb.org/t/p/w500";
  const backdropUrl = "https://image.tmdb.org/t/p/w1280";
  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const res = await fetchMovieDetails(id.toString());
        setData(res);
      } catch (error) {
        console.error("Failed to fetch movie details:", error);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [id]);

  const imageSrc =
    !imgError && data?.poster_path
      ? posterUrl + data?.poster_path
      : data
        ? generateMovieAvatar(data.original_title)
        : "";
  const isAvailable = data?.runtime && data.runtime > 0;
  function formatDate(dateString: string) {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }

  if (loading) {
    return <LoadingModel message="Fetching Movie Details..." />;
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center">
        <p className="text-white text-xl">Movie not found.</p>
        <Link href="/" className="text-red-500 hover:underline mt-4">
          Back to Home
        </Link>
      </div>
    );
  }

  const trailerKey =
    data.videos?.results?.find(
      (v) => v.type === "Trailer" && v.site === "YouTube",
    )?.key || data.videos?.results?.[0]?.key;

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-black text-white">
        <section className="relative min-h-[60vh] md:min-h-screen">
          <div className="absolute inset-0">
            {data.backdrop_path && (
              <Image
                src={backdropUrl + data.backdrop_path}
                alt={data.title || "Movie backdrop"}
                fill
                className="object-cover"
                priority
              />
            )}
            <div className="absolute inset-0 bg-black/65" />
          </div>

          <div className="relative z-10 flex flex-col lg:flex-row container mx-auto px-4 lg:px-20 gap-6 lg:gap-10 min-h-[60vh] lg:min-h-screen items-center py-20 lg:py-0">
            <div className="w-[180px] sm:w-[250px] md:w-[350px] shrink-0">
              <Image
                src={imageSrc}
                alt={data?.title || "Movie poster"}
                width={500}
                height={750}
                className="rounded-2xl shadow-2xl hover:scale-105 transition-all duration-200"
                onError={() => setImgError(true)}
              />
            </div>

            <div className="flex flex-col gap-8 text-center lg:text-left">
              <div className="flex flex-col gap-4">
                <h1 className="text-3xl sm:text-4xl md:text-7xl font-bold text-white text-shadow-lg leading-tight">
                  {data?.title}
                </h1>
                <div className="flex flex-wrap gap-4 justify-center lg:justify-start items-center text-sm md:text-base text-gray-200">
                  <Ships ship={formatDate(data?.release_date)} />
                  <Ships
                    ship={
                      data?.runtime
                        ? `${Math.floor(data.runtime / 60)}h ${data.runtime % 60}m`
                        : "N/A"
                    }
                  />
                  <Ships
                    ship={
                      <span className="flex items-center gap-2">
                        <span>{data?.vote_average.toFixed(1)}/10</span>
                        <RatingStars rating={data?.vote_average} />
                      </span>
                    }
                  />
                </div>

                <div className="flex flex-wrap gap-4 justify-center lg:justify-start items-center text-sm md:text-base text-gray-200">
                  {data?.genres.map((item, idx) => (
                    <GenresShips key={idx} ship={item.name} />
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-6">
                <div>
                  <h2 className="text-red-600 text-2xl md:text-3xl uppercase font-bold tracking-wider mb-2">
                    Overview
                  </h2>
                  <p className="max-w-2xl text-gray-300 leading-relaxed text-sm md:text-lg mx-auto md:mx-0">
                    {data?.overview
                      ? data.overview.length > 250
                        ? data.overview.slice(0, 400) + "..."
                        : data.overview
                      : "No description available."}
                  </p>
                </div>
                <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
                  <Link
                    href={
                      isAvailable
                        ? `/movie/player/${encodedId}/${slugify(data?.title + "-" + (data?.release_date ? data.release_date.split("-")[0] : ""))}`
                        : "#"
                    }
                    className="bg-white hover:bg-neutral-200 text-black px-8 py-3 rounded-full font-bold flex items-center gap-3 transition-all hover:scale-105 active:scale-95 shadow-lg relative overflow-hidden group"
                  >
                    <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-10 transition-opacity" />
                    <FaPlay size={18} />
                    {isAvailable ? "Watch Now" : "Coming Soon"}
                  </Link>

                  {trailerKey && (
                    <button
                      onClick={() => setIsOpen(true)}
                      className="bg-red-700 hover:bg-red-800 text-white px-8 py-3 rounded-full font-bold flex items-center gap-3 transition-all hover:cursor-pointer hover:scale-105 active:scale-95 shadow-lg shadow-red-900/40 relative overflow-hidden group"
                    >
                      <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-20 transition-opacity" />
                      <FaCirclePlay size={20} />
                      Watch Trailer
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        {data.credits && data.credits.cast.length > 0 && (
          <section className="py-10 md:py-16 px-4 md:px-10">
            <div className="container mx-auto px-0 md:px-4">
              <div className="mb-6 md:mb-10">
                <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold mb-2">
                  Cast
                </h2>
                <div className="w-12 md:w-20 h-1.5 bg-red-600 rounded-full" />
              </div>
              <CastList
                limit={11}
                cast={data.credits.cast}
                movieId={id}
                navig="movie"
              />
            </div>
          </section>
        )}

        {data.recommendations && data.recommendations.results.length > 0 && (
          <section className="py-10 md:py-16 px-4 md:px-10 bg-zinc-950/50">
            <div className="container mx-auto px-0 md:px-4">
              <div className="mb-6 md:mb-10">
                <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold mb-2">
                  recommendations Movies
                </h2>
                <div className="w-12 md:w-20 h-1.5 bg-red-600 rounded-full" />
              </div>
              <MovieMiniCard limit={12} movies={data.recommendations.results} />
            </div>
          </section>
        )}

        {data.similar && data.similar.results.length > 0 && (
          <section className="py-10 md:py-16 px-4 md:px-10 bg-zinc-950/50">
            <div className="container mx-auto px-0 md:px-4">
              <div className="mb-6 md:mb-10">
                <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold mb-2">
                  Similar Movies
                </h2>
                <div className="w-12 md:w-20 h-1.5 bg-red-600 rounded-full" />
              </div>
              <MovieMiniCard limit={12} movies={data.similar.results} />
            </div>
          </section>
        )}
      </main>

      {isOpen && trailerKey && (
        <TrailerModal url={trailerKey} onClose={() => setIsOpen(false)} />
      )}
      <Footer />
    </>
  );
}

function Ships({ ship }: { ship: React.ReactNode }) {
  return (
    <div className="px-3 py-2 bg-red-800/20 rounded-full ring-1 ring-red-700">
      <span className="text-sm flex items-center gap-1">{ship}</span>
    </div>
  );
}
function GenresShips({ ship }: { ship: React.ReactNode }) {
  return (
    <div className="px-3 py-2 bg-neutral-200/10 rounded-full ring-1 ring-neutral-200/50">
      <span className="text-sm flex items-center gap-1">{ship}</span>
    </div>
  );
}
interface RatingStarsProps {
  rating: number;
}

function RatingStars({ rating }: RatingStarsProps) {
  const fullStars = Math.round(rating / 2); // 10 → 5

  return (
    <span className="flex items-center gap-1 text-neutral-200">
      {[...Array(5)].map((_, i) =>
        i < fullStars ? <FaStar key={i} /> : <FaRegStar key={i} />,
      )}
    </span>
  );
}
