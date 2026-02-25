"use client";
import { useParams } from "next/navigation";
import Image from "next/image";
import Navbar from "@/app/components/Navbar";
import { useEffect, useState } from "react";
import { fetchMovieDetails, MovieDetail } from "@/app/lib/tmdb";
import LoadingModel from "@/app/components/LoadingModel";
import Link from "next/link";
import { generateServerAvatar } from "@/app/lib/generateMovieAvatar";
import { supabaseClient } from "@/app/lib/supabase";
import { StreamButtonSkeleton } from "@/app/components/Skeleton";
import { decodeId } from "@/app/lib/hash";

interface StreamSource {
  id?: number;
  name: string;
  full_url: string;
  is_active?: boolean;
  added_at?: string;
}

export default function PlayerClient() {
  const [movie, setMovie] = useState<MovieDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [streamsLoading, setStreamsLoading] = useState(true);
  const [embedUrl, setEmbedUrl] = useState<string | null>(null);
  const [streamApi, setStreamApi] = useState<StreamSource[]>([]);
  const params = useParams();
  const slugArray = params?.slug;
  const encodedId = Array.isArray(slugArray)
    ? slugArray[0]
    : (slugArray as string);
  const id = decodeId(encodedId);

  useEffect(() => {
    async function fetchStreams() {
      if (!id) return;
      setStreamsLoading(true);

      const { data, error } = await supabaseClient
        .from("stream_urls")
        .select("full_url,name")
        .eq("is_active", true)
        .order("added_at", { ascending: true });

      if (error) {
        console.error("Error fetching stream URLs:", error);
        setStreamsLoading(false);
        return;
      }

      if (data && data.length > 0) {
        setStreamApi(data as StreamSource[]);
        setEmbedUrl(data[0].full_url + id);
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
        let data = await fetchMovieDetails(id);

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

  if (loading) {
    return <LoadingModel message="Loading Player" />;
  }

  const title = movie?.title || "Unknown Content";

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
              Watch: <span className="text-gray-300">{title}</span>
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
                    onClick={() => setEmbedUrl(source.full_url + id)}
                    className={`flex items-center gap-2 px-3 md:px-4 py-2 rounded-lg font-medium transition-all hover:cursor-pointer text-sm md:text-base ${
                      embedUrl === source.full_url + id
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
        </div>
      </div>
    </>
  );
}
