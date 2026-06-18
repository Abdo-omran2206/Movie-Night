"use client";
import { useParams } from "next/navigation";
import Image from "next/image";
import Navbar from "@/components/ui/Navbar";
import { useEffect, useState } from "react";
import { MovieDetail, StreamSource, TvDetail } from "@/constant/types";
import LoadingModel from "@/components/models/LoadingModel";
import Link from "next/link";
import { generateServerAvatar } from "@/lib/generateMovieAvatar";
import { StreamButtonSkeleton } from "@/components/ui/Skeleton";
import { decodeId } from "@/lib/hash";

export default function PlayerClient() {
  const [movie, setMovie] = useState<MovieDetail | TvDetail | null>(null);
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
      try {
        const resp = await fetch(`/api/watch/movie`);
        const data = await resp.json();

        if (Array.isArray(data) && data.length > 0) {
          setStreamApi(data as StreamSource[]);
          const firstUrl = data[0].full_url;
          if (firstUrl && id) {
            setEmbedUrl(firstUrl + id);
          }
        }
      } catch (err) {
        console.error("Error fetching stream URLs:", err);
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
        // Try fetching as a movie first via API route
        const resp = await fetch(`/api/movies/${id}`);
        const data = await resp.json();

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

  const title = (movie && ('title' in movie ? movie.title : (movie as TvDetail).name)) || "Unknown Content";

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
                    onClick={() => {
                      if (source.full_url && id) {
                        setEmbedUrl(source.full_url + id);
                      }
                    }}
                    className={`flex items-center gap-2 px-3 md:px-4 py-2 rounded-lg font-medium transition-all hover:cursor-pointer text-sm md:text-base ${
                      id && embedUrl === source.full_url + id
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
