"use client";
import Footer from "@/app/components/Footer";
import Navbar from "@/app/components/Navbar";
import Image from "next/image";
import { getActorById } from "@/app/lib/tmdb";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import MovieMiniCard from "@/app/components/MovieMiniCard";
import LoadingModel from "@/app/components/LoadingModel";
import { ActorDetail } from "./page";

export default function ActorDetailsClient() {
  const [data, setData] = useState<ActorDetail | null>(null);
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const res = await getActorById(id);
        setData(res);
      } catch (error) {
        console.error("Failed to fetch actor details:", error);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [id]);

  if (loading) {
    return <LoadingModel message="Loading Actor Profile..." />;
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-white">
        <p className="text-xl">Actor not found.</p>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-black text-white py-20 px-4 md:px-10 lg:px-20">
        <div className="container mx-auto">
          <div className="flex flex-col lg:flex-row gap-12">
            {/* Left Column: Profile Image & Personal Info */}
            <div className="w-full lg:w-1/3 xl:w-1/4">
              <div className="relative aspect-2/3 w-full max-w-[400px] mx-auto lg:mx-0 rounded-2xl overflow-hidden shadow-2xl ring-1 ring-white/10 mb-8">
                <Image
                  src={
                    data.profile_path
                      ? `https://image.tmdb.org/t/p/h632${data.profile_path}`
                      : "/no-avatar.png"
                  }
                  alt={data.name}
                  fill
                  className="object-cover"
                  priority
                />
              </div>

              <div className="bg-neutral-900/40 rounded-2xl p-6 ring-1 ring-white/10">
                <h2 className="text-xl font-bold mb-4 border-b border-red-600/30 pb-2">
                  Personal Info
                </h2>

                <div className="space-y-4">
                  <div>
                    <p className="text-gray-400 text-sm">Known For</p>
                    <p className="font-medium text-white">
                      {data.known_for_department}
                    </p>
                  </div>

                  {data.birthday && (
                    <div>
                      <p className="text-gray-400 text-sm">Birthday</p>
                      <p className="font-medium text-white">{data.birthday}</p>
                    </div>
                  )}

                  {data.place_of_birth && (
                    <div>
                      <p className="text-gray-400 text-sm">Place of Birth</p>
                      <p className="font-medium text-white">
                        {data.place_of_birth}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Right Column: Name, Bio, Movie Credits */}
            <div className="flex-1">
              <h1 className="text-5xl md:text-7xl font-bold text-white mb-8">
                {data.name}
              </h1>

              {data.biography && (
                <div className="mb-12">
                  <h2 className="text-2xl font-bold mb-4 text-red-600 uppercase tracking-widest font-bebas">
                    Biography
                  </h2>
                  <p className="text-gray-300 leading-relaxed text-lg max-w-4xl whitespace-pre-line">
                    {data.biography}
                  </p>
                </div>
              )}
            </div>
          </div>
          <div className="mt-15">
            {data.movie_credits?.cast && data.movie_credits.cast.length > 0 && (
              <div>
                <div className="mb-10 flex justify-center items-center flex-col">
                  <h2 className="text-4xl font-bold mb-2 tracking-widest text-center">
                    Filmography
                  </h2>
                  <div className="w-20 h-1.5 bg-red-600 rounded-full" />
                </div>
                <MovieMiniCard movies={data.movie_credits.cast} />
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
