"use client";
import Footer from "@/components/ui/Footer";
import Navbar from "@/components/ui/Navbar";
import Image from "next/image";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useEffect, useState } from "react";
import { FaPlay } from "react-icons/fa6";
import CastList from "@/components/cards/CastCard";
import MovieMiniCard from "@/components/cards/MovieMiniCard";
import LoadingModel from "@/components/models/LoadingModel";
import generateMovieAvatar from "@/lib/generateMovieAvatar";
import { slugify } from "@/lib/slugify";
import { decodeId } from "@/lib/hash";
import { posterUrl, backdropUrl } from "@/constant/main";
import { Collection, MovieDetail, MovieSummary } from "@/constant/types";
import BookMarkModel from "@/components/models/BookMarkModel";
import TrailerButtonModel from "@/components/models/TrailerButtonModel";
import formatDate from "@/lib/formatDate";
import { GenresShips, RatingStars, Ships } from "@/components/ships";
import ReviewsModel from "@/components/models/ReviewsModel";

export default function MovieDetailsClient() {
  const params = useParams();
  const slug = params?.slug;
  const slugArray = Array.isArray(slug) ? slug : [slug as string];
  const encodedId = slugArray[0];
  const idStr = decodeId(encodedId);
  const id = idStr ? idStr : ""; // Use empty string if decoding fails

  const [data, setData] = useState<MovieDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [imgError, setImgError] = useState(false);
  const [collection, setCollection] = useState<Collection | null>(null);

  useEffect(() => {
    async function loadData() {
      if (!id) return;
      setLoading(true);
      try {
        const resData = await fetch(`/api/movies/${id.toString()}`);
        const res = await resData.json();
        setData(res);
        if (res?.belongs_to_collection) {
          const collData = await fetch(
            `/api/movies/collection/${res.belongs_to_collection.id.toString()}`,
          );
          const coll = await collData.json();
          setCollection(coll);
        }
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
        ? generateMovieAvatar(data.title || data.original_title || "Unknown")
        : "";

  const isAvailable = data?.runtime && data.runtime > 0;

  const trailerKey =
    data?.videos?.results?.find(
      (v) => v.type === "Trailer" && v.site === "YouTube",
    )?.key || data?.videos?.results?.[0]?.key;

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
                className="object-cover opacity-90"
                priority
              />
            )}
            {/* Main bottom-up gradient for blending */}
            <div className="absolute inset-0 bg-linear-to-b from-transparent via-black/40 to-black" />
            {/* Top-down gradient for better navbar contrast */}
            <div className="absolute inset-0 bg-linear-to-b from-black/60 via-transparent to-transparent h-1/3" />
            {/* Subtle solid-ish bottom layer to hide image edges */}
            <div className="absolute inset-0 bottom-0 left-0 right-0 backdrop-blur-xs" />
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
                  {data?.title
                    ? data.title.length > 30
                      ? data.title.slice(0, 30) + "..."
                      : data.title
                    : "Untitled title"}
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
                <div className="flex justify-center items-center lg:justify-start lg:items-center gap-5">
                  <ReviewsModel id={id} type="movie" />
                  <BookMarkModel
                    movieID={data.id}
                    title={data.title}
                    overview={data.overview}
                    backdrop={data.backdrop_path || ""}
                    poster={data.poster_path || ""}
                    type="movie"
                  />
                </div>
                <div className="flex flex-wrap gap-4 justify-center flex-col items-center lg:flex-row lg:justify-start">
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

                  <TrailerButtonModel trailerKey={trailerKey} />
                </div>
              </div>
            </div>
          </div>
        </section>

        {data.videos?.results &&
          data.videos?.results.length > 2 &&
          data.videos.results.some(
            (v) =>
              v.site === "YouTube" &&
              (v.type === "Trailer" || v.type === "Teaser"),
          ) && (
            <section className="py-10 md:py-16 px-4 md:px-10 bg-zinc-950/30">
              <div className="container mx-auto px-0 md:px-4">
                <div className="mb-6 md:mb-10">
                  <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold mb-2">
                    Trailers & Clips
                  </h2>
                  <div className="w-12 md:w-20 h-1.5 bg-red-600 rounded-full" />
                </div>

                <div className="flex overflow-x-auto gap-4 md:gap-6 pb-6 custom-scrollbar scroll-smooth">
                  {data.videos.results
                    .filter(
                      (v) =>
                        v.site === "YouTube" &&
                        (v.type === "Trailer" || v.type === "Teaser"),
                    )
                    .map((video) => (
                      <div
                        key={video.id}
                        className="min-w-[240px] md:min-w-[450px] flex flex-col gap-3 group"
                      >
                        <div className="relative aspect-video rounded-xl overflow-hidden border border-white/10 bg-zinc-900 shadow-xl transition-all duration-300 group-hover:border-red-600/30 group-hover:scale-[1.02]">
                          <iframe
                            src={`https://www.youtube.com/embed/${video.key}?rel=0&modestbranding=1`}
                            title={video.name}
                            className="w-full h-full border-0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                            loading="lazy"
                          />
                        </div>
                        <div className="px-1">
                          <h3 className="text-sm md:text-base font-bold text-white line-clamp-1 group-hover:text-red-500 transition-colors duration-300">
                            {video.name}
                          </h3>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-[9px] font-black uppercase tracking-wider text-red-600 bg-red-600/10 px-1.5 py-0.5 rounded">
                              {video.type}
                            </span>
                            <span className="text-[11px] text-gray-500 font-medium">
                              YouTube
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </section>
          )}
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

        {collection && collection.parts.length > 0 && (
          <section className="py-10 md:py-16 px-4 md:px-10 bg-zinc-950/50">
            <div className="container mx-auto px-0 md:px-4">
              <div className="mb-6 md:mb-10">
                <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold mb-2">
                  {collection.name}
                </h2>
                <div className="w-12 md:w-20 h-1.5 bg-red-600 rounded-full" />
              </div>
              <MovieMiniCard
                limit={30}
                movies={[...(collection.parts || [])].sort(
                  (a: MovieSummary, b: MovieSummary) =>
                    new Date(a.release_date || 0).getTime() -
                    new Date(b.release_date || 0).getTime(),
                )}
              />
            </div>
          </section>
        )}

        {data.recommendations && data.recommendations.results.length > 0 && (
          <section className="py-10 md:py-16 px-4 md:px-10 bg-zinc-950/50">
            <div className="container mx-auto px-0 md:px-4">
              <div className="mb-6 md:mb-10">
                <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold mb-2">
                  Recommended Movies
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
      <Footer />
    </>
  );
}
