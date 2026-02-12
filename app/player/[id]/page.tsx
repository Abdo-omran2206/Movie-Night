"use client";

import { useParams } from "next/navigation";
import Navbar from "@/app/components/Navbar";
import { useEffect, useState } from "react";
import { fetchMovieDetails } from "@/app/lib/tmdb";
import LoadingModel from "@/app/components/LoadingModel";

export default function PlayerPage() {
  const params = useParams();
  const id = params.id as string;
  const [movie, setMovie] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const streamApi =
    process.env.NEXT_PUBLIC_STREAM_API ;
  const embedUrl = `${streamApi}?video_id=${id}&tmdb=1`;

  useEffect(() => {
    async function loadMovie() {
      if (!id) return;
      setLoading(true);
      const data = await fetchMovieDetails(id);
      setMovie(data);
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
