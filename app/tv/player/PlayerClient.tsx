"use client";
import { useParams } from "next/navigation";
import Image from "next/image";
import Navbar from "@/app/components/Navbar";
import { useEffect, useState } from "react";
import { fetchTvDetails, TvDetail } from "@/app/lib/tmdb";
import LoadingModel from "@/app/components/LoadingModel";
import Link from "next/link";
import { generateServerAvatar } from "@/app/lib/generateMovieAvatar";
import { supabaseClient } from "@/app/lib/supabase";
import { StreamButtonSkeleton } from "@/app/components/Skeleton";
import { slugify } from "@/app/lib/slugify";

interface StreamSource {
  id?: number;
  name: string;
  full_url_tv: string;
  is_active?: boolean;
  added_at?: string;
}

const getStreamUrl = (
  templateUrl: string,
  id: string,
  season: string,
  episode: string,
) => {
  if (!templateUrl) return "";
  if (templateUrl.includes("{id}")) {
    return templateUrl
      .replace(/{id}/g, id)
      .replace(/{s}/g, season)
      .replace(/{e}/g, episode);
  }
  return `${templateUrl}${id}/${season}/${episode}`;
};

export default function PlayerClient() {
  const [movie, setMovie] = useState<TvDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [streamsLoading, setStreamsLoading] = useState(true);
  const [activeSource, setActiveSource] = useState<string | null>(null);
  const [streamApi, setStreamApi] = useState<StreamSource[]>([]);
  const params = useParams();
  const slugArray = (params?.slug as string[]) || [];

  // For TV: slug should be [slug, id, season, episode] or [id, season, episode]
  // Fallbacks just in case
  const initialEpisode =
    slugArray.length >= 3 ? slugArray[slugArray.length - 1] : "1";
  const initialSeason =
    slugArray.length >= 3 ? slugArray[slugArray.length - 2] : "1";
  const id =
    slugArray.length >= 3
      ? slugArray[slugArray.length - 3]
      : slugArray[slugArray.length - 1];

  const [currentSeason, setCurrentSeason] = useState(initialSeason);
  const [currentEpisode, setCurrentEpisode] = useState(initialEpisode);

  const embedUrl = activeSource
    ? getStreamUrl(activeSource, id, currentSeason, currentEpisode)
    : null;

  useEffect(() => {
    async function fetchStreams() {
      if (!id) return;
      setStreamsLoading(true);

      const { data, error } = await supabaseClient
        .from("stream_urls")
        .select("full_url_tv,name")
        .eq("is_active", true)
        .order("added_at", { ascending: true });

      if (error) {
        console.error("Error fetching stream URLs:", error);
        setStreamsLoading(false);
        return;
      }

      if (data && data.length > 0) {
        setStreamApi(data as StreamSource[]);
        setActiveSource(data[0].full_url_tv);
      }
      setStreamsLoading(false);
    }
    fetchStreams();
  }, [id]);

  useEffect(() => {
    async function loadContent() {
      if (!id) return;
      setLoading(true);
      try {
        // Try fetching as a movie first
        let data = await fetchTvDetails(id);

        // If no movie found, try fetching as a TV show
        if (!data || (!data.title && !data.name)) {
          // Check for both title and name
          const { fetchTvDetails } = await import("@/app/lib/tmdb");
          data = await fetchTvDetails(id);
        }

        setMovie(data);
      } catch (err) {
        console.error("Failed to fetch content details:", err);
      } finally {
        setLoading(false);
      }
    }
    loadContent();
  }, [id]);

  const handleSeasonChange = (newSeason: string) => {
    setCurrentSeason(newSeason);
    setCurrentEpisode("1");
    window.history.replaceState(
      null,
      "",
      `/tv/player/${slugify(title)}/${id}/${newSeason}/1`,
    );
  };

  const handleEpisodeChange = (newEpisode: string) => {
    setCurrentEpisode(newEpisode);
    window.history.replaceState(
      null,
      "",
      `/tv/player/${slugify(title)}/${id}/${currentSeason}/${newEpisode}`,
    );
  };

  if (loading) {
    return <LoadingModel message="Loading Player" />;
  }

  const title = movie?.name || "Unknown Content";

  if (!movie) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-white">
        Content not found
        <Link href="/" className="text-red-500 hover:underline mt-4">
          Back to Home
        </Link>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <div className="bg-black min-h-screen flex flex-col items-center justify-center pt-24 pb-10 px-4">
        <div className="w-full max-w-6xl space-y-4">
          {/* Title Section */}
          <div className="flex border-l-4 border-red-600 pl-4">
            <h1 className="text-2xl md:text-4xl font-bold text-white">
              Watch:{" "}
              <span className="text-gray-300">
                {title} S{currentSeason} E{currentEpisode}
              </span>
            </h1>
          </div>
          <div>
            <p className="text-gray-400 mt-2 text-sm md:text-base">
              Having trouble? Try switching between different stream sources
              below for the best playback experience.
            </p>
            <div className="flex flex-wrap gap-2 md:gap-4 mt-4">
              {streamsLoading ? (
                <>
                  {[...Array(4)].map((_, i) => (
                    <StreamButtonSkeleton key={i} />
                  ))}
                </>
              ) : (
                streamApi.map((source, index) => (
                  <button
                    key={source.id || index}
                    onClick={() => setActiveSource(source.full_url_tv)}
                    className={`flex items-center gap-2 px-3 md:px-4 py-2 rounded-lg font-medium transition-all hover:cursor-pointer text-sm md:text-base ${
                      activeSource === source.full_url_tv
                        ? "bg-red-600 text-white shadow-lg"
                        : "bg-neutral-800 text-gray-300 hover:bg-neutral-700"
                    }`}
                  >
                    <Image
                      src={generateServerAvatar(
                        source.name || `Stream ${index + 1}`,
                      )}
                      alt={`Avatar for ${source.name || `Stream ${index + 1}`}`}
                      width={24}
                      height={24}
                      className="rounded-full"
                    />
                    {source.name || `Stream ${index + 1}`}
                  </button>
                ))
              )}
            </div>
          </div>

          {/* Player Container */}
          <div className="relative w-full aspect-video bg-neutral-900 rounded-xl shadow-2xl overflow-hidden ring-1 ring-white/10 group">
            {embedUrl ? (
              <iframe
                src={embedUrl}
                className="w-full h-full"
                frameBorder="0"
                allowFullScreen
                title={`Watch ${title}`}
              ></iframe>
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-500">
                <p>Initializing Player...</p>
              </div>
            )}
          </div>
          {/* Episode Controller - Horizontal Scroll Style */}
          {movie?.seasons && movie.seasons.length > 0 && (
            <div className="mt-8 bg-neutral-900 rounded-2xl p-6 md:p-8 shadow-2xl ring-1 ring-white/10">
              {/* Header: Title + Season Selector */}
              <div className="flex flex-col md:flex-row gap-4 md:items-center justify-between mb-4">
                <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-wide">
                  Episodes
                </h2>

                <select
                  aria-label="Select Season"
                  value={currentSeason}
                  onChange={(e) => handleSeasonChange(e.target.value)}
                  className="bg-neutral-800 text-white px-4 py-2 rounded-lg border border-neutral-700 outline-none focus:ring-2 focus:ring-red-600 min-w-[160px] hover:cursor-pointer transition duration-200 ease-in-out"
                >
                  {movie.seasons
                    .filter((s) => s.season_number > 0)
                    .map((s) => (
                      <option key={s.id} value={s.season_number}>
                        {s.name || `Season ${s.season_number}`}
                      </option>
                    ))}
                </select>
              </div>

              {/* Horizontal Scroll Episodes */}
              <div className="flex flex-wrap gap-y-3 space-x-3 md:space-x-4 py-2 px-3.5 scrollbar-hide">
                {Array.from({
                  length:
                    movie.seasons.find(
                      (s) => s.season_number.toString() === currentSeason,
                    )?.episode_count || 0,
                }).map((_, i) => {
                  const epNum = (i + 1).toString();
                  const isCurrentEp = epNum === currentEpisode;

                  return (
                    <button
                      key={i}
                      onClick={() => handleEpisodeChange(epNum)}
                      className={`flex-shrink-0 flex flex-col items-center justify-center w-16 md:w-20 p-3 rounded-lg text-sm md:text-base font-semibold transition-all duration-200 ease-in-out cursor-pointer ${
                        isCurrentEp
                          ? "bg-red-600 text-white shadow-lg ring-2 ring-red-400 scale-105"
                          : "bg-neutral-800 text-gray-400 hover:bg-neutral-700 hover:text-white ring-1 ring-white/10"
                      }`}
                    >
                      <span className="text-[10px] md:text-xs font-normal text-white/60 mb-1">
                        EP
                      </span>
                      {epNum}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
