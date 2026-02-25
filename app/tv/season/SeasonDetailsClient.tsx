"use client";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { FaPlay, FaStar, FaClock } from "react-icons/fa";
import { FaCirclePlay } from "react-icons/fa6";
import { IoArrowBack } from "react-icons/io5";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import { TvDetail, SeasonDetail, Episode } from "@/app/lib/tmdb";
import generateMovieAvatar from "@/app/lib/generateMovieAvatar";
import { slugify } from "@/app/lib/slugify";
import { Ships, RatingStars } from "@/app/tv/TvDetailsClient";
import TrailerModal from "@/app/components/TrailerModel";
import CastList from "@/app/components/CastCard";
import { encodeId } from "@/app/lib/hash";
interface SeasonDetailsClientProps {
  series: TvDetail;
  season: SeasonDetail;
}

export default function SeasonDetailsClient({
  series,
  season,
}: SeasonDetailsClientProps) {
  const [imgError, setImgError] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const posterUrl = "https://image.tmdb.org/t/p/w500";
  const backdropUrl = "https://image.tmdb.org/t/p/w1280";

  const imageSrc =
    !imgError && season.poster_path
      ? posterUrl + season.poster_path
      : generateMovieAvatar(season.name || series.name);

  // Extract Trailer Key
  const trailerKey =
    season.videos?.results?.find(
      (v) => v.type === "Trailer" && v.site === "YouTube",
    )?.key || season.videos?.results?.[0]?.key;

  function formatDate(dateString: string) {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-black text-white">
        {/* Hero Section */}
        <section className="relative pt-24 pb-12 lg:pt-32 lg:pb-20 overflow-hidden">
          {/* Backdrop */}
          <div className="absolute inset-0 z-0">
            {series.backdrop_path && (
              <Image
                src={backdropUrl + series.backdrop_path}
                alt={series.name}
                fill
                className="object-cover opacity-60 blur-sm"
                priority
              />
            )}
            <div className="absolute inset-0 bg-linear-to-t from-black/65  to-transparent" />
          </div>

          <div className="container mx-auto px-4 lg:px-20 relative z-10">
            <Link
              href={`/tv/${encodeId(series.id)}/${slugify(series.name + "-" + (series.first_air_date ? series.first_air_date.split("-")[0] : ""))}`}
              className="inline-flex items-center gap-2 text-gray-400 hover:text-red-500 transition-colors mb-8 group"
            >
              <IoArrowBack className="group-hover:-translate-x-1 transition-transform" />
              Back to {series.name}
            </Link>

            <div className="flex flex-col lg:flex-row gap-10 items-start">
              {/* Season Poster */}
              <div className="w-full max-w-[300px] shrink-0 mx-auto lg:mx-0">
                <div className="relative aspect-2/3 rounded-2xl overflow-hidden shadow-2xl ring-1 ring-white/10">
                  <Image
                    src={imageSrc}
                    alt={season.name}
                    fill
                    className="object-cover"
                    onError={() => setImgError(true)}
                  />
                </div>
              </div>

              {/* Season Info */}
              <div className="flex-1 text-center lg:text-left">
                <h1 className="text-4xl lg:text-6xl font-bold mb-4 bg-linear-to-r from-white to-gray-400 bg-clip-text text-transparent italic">
                  {series.name}
                </h1>
                <h2 className="text-2xl lg:text-3xl font-semibold text-red-600 mb-6 uppercase tracking-wider">
                  {season.name}
                </h2>

                <div className="flex flex-wrap gap-6 justify-center lg:justify-start items-center mb-8 text-gray-300">
                  <Ships ship={formatDate(season.air_date)} />
                  <Ships ship={`${season.episodes.length} Episodes`} />
                  <Ships
                    ship={
                      <span className="flex items-center gap-2">
                        <span>{season?.vote_average.toFixed(1)}/10</span>
                        <RatingStars rating={season?.vote_average} />
                      </span>
                    }
                  />{" "}
                </div>

                <div className="max-w-3xl mb-8">
                  <h3 className="text-xl font-bold mb-3 text-white">
                    Overview
                  </h3>
                  <p className="text-gray-400 leading-relaxed text-lg">
                    {season.overview ||
                      `Season ${season.season_number} of ${series.name} premiered on ${season.air_date ? new Date(season.air_date).toLocaleDateString() : "an unknown date"}.`}
                  </p>
                </div>

                <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
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

        {/* Episodes List */}
        <section className="py-12 lg:py-20 bg-zinc-950/50">
          <div className="container mx-auto px-4 lg:px-20">
            <div className="mb-12">
              <h2 className="text-3xl lg:text-4xl font-bold mb-2">Episodes</h2>
              <div className="w-20 h-1.5 bg-red-600 rounded-full" />
            </div>

            <div className="grid grid-cols-1 gap-6">
              {season.episodes.map((episode: Episode) => (
                <Link
                  href={`/tv/player/${encodeId(series.id)}/${slugify(series.name  + "-s" + season.season_number + "-e" + episode.episode_number)}/${season.season_number}/${episode.episode_number}`}
                  key={episode.id}
                  className="group bg-neutral-900/40 border border-white/5 rounded-2xl overflow-hidden hover:bg-neutral-900/60 transition-all duration-300 flex flex-col md:flex-row cursor-pointer"
                >
                  {/* Episode Still */}
                  <div className="relative w-full md:w-64 lg:w-80 aspect-video shrink-0 bg-neutral-800">
                    {episode.still_path ? (
                      <Image
                        src={`https://image.tmdb.org/t/p/w500${episode.still_path}`}
                        alt={episode.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center text-gray-500">
                        <FaPlay size={30} className="opacity-20" />
                      </div>
                    )}
                    <div className="absolute top-3 left-3 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded">
                      EP {episode.episode_number}
                    </div>
                  </div>

                  {/* Episode Content */}
                  <div className="p-6 flex-1 flex flex-col justify-center">
                    <div className="flex justify-between items-start mb-2 flex-wrap gap-2">
                      <h3 className="text-xl font-bold group-hover:text-red-500 transition-colors">
                        {episode.name}
                      </h3>
                      <div className="flex items-center gap-4 text-sm text-gray-400">
                        <span className="flex items-center gap-1">
                          <FaClock className="text-red-500/50" />
                          {episode.runtime || "?"} min
                        </span>
                        <span>{episode.air_date}</span>
                      </div>
                    </div>
                    <p className="text-gray-400 line-clamp-2 md:line-clamp-3 text-sm md:text-base">
                      {episode.overview ||
                        "No overview available for this episode."}
                    </p>
                    {episode.vote_average > 0 && (
                      <div className="mt-4 flex items-center gap-1 text-sm text-yellow-500/80">
                        <FaStar size={12} />
                        <span>{episode.vote_average.toFixed(1)}</span>
                      </div>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {season.credits &&
          season.credits.cast &&
          season.credits.cast.length > 0 && (
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
                  cast={season.credits.cast}
                  movieId={undefined}
                  navig="tv"
                />
              </div>
            </section>
          )}

        {/* {season.credits &&
          season.credits.crew &&
          season.credits.crew.length > 0 && (
            <section className="py-10 md:py-16 px-4 md:px-10 bg-zinc-950/50">
              <div className="container mx-auto px-0 md:px-4">
                <div className="mb-6 md:mb-10">
                  <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold mb-2">
                    Crew
                  </h2>
                  <div className="w-12 md:w-20 h-1.5 bg-red-600 rounded-full" />
                </div>
                <CastList
                  limit={11}
                  cast={season.credits.crew.map((c) => ({
                    id: c.id,
                    name: c.name,
                    character: c.job,
                    profile_path: c.profile_path,
                  }))}
                  movieId={undefined}
                />
              </div>
            </section>
          )} */}
      </main>

      {isOpen && trailerKey && (
        <TrailerModal url={trailerKey} onClose={() => setIsOpen(false)} />
      )}
      <Footer />
    </>
  );
}
