"use client";

import { useParams } from "next/navigation";
import Navbar from "@/app/components/Navbar";
import { useEffect, useState } from "react";
import { fetchMovieDetails } from "@/app/lib/tmdb";
import LoadingModel from "@/app/components/LoadingModel";
import Link from "next/link";

export default function PlayerPage() {
  const params = useParams();
  const id = params.id as string;
  const [movie, setMovie] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [embedUrl, setEmbedUrl] = useState<string>("");

  const streamApi = [
    {
      Domain: process.env.NEXT_PUBLIC_STREAM_API,
      slug: `?video_id=${id}&tmdb=1`,
    },
    {
      Domain: process.env.NEXT_PUBLIC_STREAM2_API,
      slug: `embed/movie/${id}`,
    },
    {
      Domain: process.env.NEXT_PUBLIC_STREAM3_API,
      slug: `embed/${id}`,
    },
    {
      Domain: process.env.NEXT_PUBLIC_STREAM4_API,
      slug: `player/${id}`,
    },
    {
      Domain: process.env.NEXT_PUBLIC_STREAM5_API,
      slug: `embed/movie/${id}`,
    },
  ];
  
  useEffect(() => {
    async function loadMovie() {
      if (!id) return;
      setLoading(true);
      const data = await fetchMovieDetails(id);
      setMovie(data);
      setEmbedUrl(`${process.env.NEXT_PUBLIC_STREAM_API}?video_id=${id}&tmdb=1`);
      setLoading(false);

      if (data) {
        document.title = `Watch ${data.title} - Movie Night`;
      }
    }
    loadMovie();
  }, [id]);

  if (loading) {
    return <LoadingModel message="Loading Player" />;
  }

  if (!movie) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-white">
        Movie not found
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
              Watch: <span className="text-gray-300">{movie.title}</span>
            </h1>
          </div>
            <div>
            <p className="text-gray-400 mt-2 text-sm md:text-base">
              Having trouble? Try switching between different stream sources below for the best playback experience.
            </p>
            <div className="flex flex-wrap gap-2 md:gap-4 mt-4">
              {streamApi.map((source, index) => (
              <button
                key={index}
                onClick={() => setEmbedUrl(`${source.Domain}${source.slug}`)}
                className={`flex items-center gap-2 px-3 md:px-4 py-2 rounded-lg font-medium transition-all text-sm md:text-base ${
                embedUrl === `${source.Domain}${source.slug}`
                  ? "bg-red-600 text-white shadow-lg"
                  : "bg-neutral-800 text-gray-300 hover:bg-neutral-700"
                }`}
              >
                <span className="text-lg">▶</span>
                Stream {index + 1}
              </button>
              ))}
            </div>
            </div>

          {/* Player Container */}
          <div className="relative w-full aspect-video bg-neutral-900 rounded-xl shadow-2xl overflow-hidden ring-1 ring-white/10 group">
            <iframe
              src={embedUrl}
              className="w-full h-full"
              frameBorder="0"
              allowFullScreen
              title={`Watch ${movie.title}`}
            ></iframe>
          </div>
        </div>
      </div>
    </>
  );
}
