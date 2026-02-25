"use client";
import Footer from "@/app/components/Footer";
import Navbar from "@/app/components/Navbar";
import { fetchTvDetails } from "@/app/lib/tmdb";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import CastList from "@/app/components/CastCard";
import LoadingModel from "@/app/components/LoadingModel";
import Link from "next/link";
import { decodeId } from "@/app/lib/hash";

export default function TvCastPage() {
  const [data, setData] = useState<any>(null);
  const { id: encodedId } = useParams<{ id: string }>();
  const id = decodeId(encodedId);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      if (!id) {
        setLoading(false);
        return;
      }
      setLoading(true);
      try {
        const res = await fetchTvDetails(id);
        setData(res);
        if (res) {
          document.title = `Full Cast - ${res.name} - Movie Night`;
        }
      } catch (error) {
        console.error("Failed to fetch tv details:", error);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [id]);
  if (loading) {
    return <LoadingModel message="Loading Cast Information..." />;
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center">
        <p className="text-white text-xl">TV Show not found.</p>
        <Link href="/" className="text-red-500 hover:underline mt-4">
          Back to Home
        </Link>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-black text-white py-20 px-4 md:px-10 lg:px-20">
        <div className="container mx-auto">
          <div className="mb-12">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">Full Cast</h1>
            <div className="flex items-center gap-4 text-gray-400">
              <h2 className="text-2xl font-semibold text-red-600">
                {data.name}
              </h2>
              <span>
                (
                {data.first_air_date
                  ? data.first_air_date.split("-")[0]
                  : "N/A"}
                )
              </span>
            </div>
            <div className="w-32 h-1.5 bg-red-600 rounded-full mt-6" />
          </div>

          <div className="bg-neutral-900/20 p-8 rounded-3xl ring-1 ring-white/5">
            <CastList cast={data.credits.cast} navig="tv" />
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
