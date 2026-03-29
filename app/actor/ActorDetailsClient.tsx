"use client";
import Footer from "@/app/components/ui/Footer";
import Navbar from "@/app/components/ui/Navbar";
import Image from "next/image";
import { getActorById } from "@/app/lib/tmdb";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import MovieMiniCard from "@/app/components/cards/MovieMiniCard";
import LoadingModel from "@/app/components/models/LoadingModel";
import Link from "next/link";
import { decodeId } from "../lib/hash";
import { profileUrl } from "@/app/constant/main";
import { ActorDetail } from "../constant/types";

import {
  FaFacebook,
  FaInstagram,
  FaTwitter,
  FaYoutube,
  FaTiktok,
  FaImdb,
} from "react-icons/fa6";
import { SiWikidata } from "react-icons/si";

export default function ActorDetailsClient() {
  const [data, setData] = useState<ActorDetail | null>(null);
  const params = useParams();
  const slug = params?.slug;
  const slugArray = Array.isArray(slug) ? slug : [slug as string];
  const encodedId = slugArray[0];
  const idStr = decodeId(encodedId);
  const id = idStr ? idStr : ""; // Use empty string if decoding fails
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const res = await getActorById(id.toString());
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
      <div className="min-h-screen bg-black flex flex-col items-center justify-center text-white">
        <p className="text-xl">Actor not found.</p>
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
          <div className="flex flex-col lg:flex-row gap-12">
            {/* Left Column: Profile Image & Personal Info */}
            <div className="w-full lg:w-1/3 xl:w-1/4">
              <div className="relative aspect-2/3 w-full max-w-[400px] mx-auto lg:mx-0 rounded-2xl overflow-hidden shadow-2xl ring-1 ring-white/10 mb-8">
                <Image
                  src={
                    data.profile_path
                      ? `${profileUrl}${data.profile_path}`
                      : "/no-avatar.png"
                  }
                  alt={data.name}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
              <h1 className="text-center justify-center flex md:hidden text-5xl md:text-7xl font-bold text-white mb-8">
                {data.name}
              </h1>
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

                {data.external_ids && (
                  <div className="mt-8 pt-6 border-t border-white/5">
                    <div className="flex flex-wrap gap-3 mb-6">
                      {data.external_ids.imdb_id && (
                        <a
                          href={`https://www.imdb.com/name/${data.external_ids.imdb_id}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-10 h-10 flex items-center justify-center bg-white/5 hover:bg-yellow-500 rounded-xl hover:text-black transition-all cursor-pointer group"
                          title="IMDb"
                        >
                          <FaImdb
                            size={20}
                            className="group-hover:scale-110 transition-transform"
                          />
                        </a>
                      )}
                      {data.external_ids.instagram_id && (
                        <a
                          href={`https://www.instagram.com/${data.external_ids.instagram_id}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-10 h-10 flex items-center justify-center bg-white/5 hover:bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600 rounded-xl hover:text-white transition-all cursor-pointer group shadow-lg"
                          title="Instagram"
                        >
                          <FaInstagram
                            size={20}
                            className="group-hover:scale-110 transition-transform"
                          />
                        </a>
                      )}
                      {data.external_ids.facebook_id && (
                        <a
                          href={`https://www.facebook.com/${data.external_ids.facebook_id}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-10 h-10 flex items-center justify-center bg-white/5 hover:bg-blue-600 rounded-xl hover:text-white transition-all cursor-pointer group"
                          title="Facebook"
                        >
                          <FaFacebook
                            size={20}
                            className="group-hover:scale-110 transition-transform"
                          />
                        </a>
                      )}
                      {data.external_ids.twitter_id && (
                        <a
                          href={`https://twitter.com/${data.external_ids.twitter_id}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-10 h-10 flex items-center justify-center bg-white/5 hover:bg-sky-500 rounded-xl hover:text-white transition-all cursor-pointer group"
                          title="Twitter"
                        >
                          <FaTwitter
                            size={20}
                            className="group-hover:scale-110 transition-transform"
                          />
                        </a>
                      )}
                      {data.external_ids.tiktok_id && (
                        <a
                          href={`https://www.tiktok.com/@${data.external_ids.tiktok_id}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-10 h-10 flex items-center justify-center bg-white/5 hover:bg-black hover:ring-1 hover:ring-white rounded-xl hover:text-white transition-all cursor-pointer group"
                          title="TikTok"
                        >
                          <FaTiktok
                            size={20}
                            className="group-hover:scale-110 transition-transform"
                          />
                        </a>
                      )}
                      {data.external_ids.youtube_id && (
                        <a
                          href={`https://www.youtube.com/${data.external_ids.youtube_id}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-10 h-10 flex items-center justify-center bg-white/5 hover:bg-red-600 rounded-xl hover:text-white transition-all cursor-pointer group"
                          title="YouTube"
                        >
                          <FaYoutube
                            size={20}
                            className="group-hover:scale-110 transition-transform"
                          />
                        </a>
                      )}
                      {data.external_ids.wikidata_id && (
                        <a
                          href={`https://www.wikidata.org/wiki/${data.external_ids.wikidata_id}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-10 h-10 flex items-center justify-center bg-white/5 hover:bg-[#003399] rounded-xl hover:text-white transition-all cursor-pointer group"
                          title="Wikidata"
                        >
                          <SiWikidata
                            size={20}
                            className="group-hover:scale-110 transition-transform"
                          />
                        </a>
                      )}
                    </div>
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-white/5 rounded-lg border border-white/5 w-fit">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-600 animate-pulse" />
                      <span className="text-[9px] font-black uppercase tracking-widest text-neutral-500">
                        Official Socials
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Right Column: Name, Bio, Movie Credits */}
            <div className="flex-1">
              <h1 className="hidden md:flex text-5xl md:text-7xl font-bold text-white mb-8">
                {data.name}
              </h1>

              {data.biography ? (
                <div className="mb-12">
                  <h2 className="text-2xl font-bold mb-4 text-red-600 uppercase tracking-widest font-bebas">
                    Biography
                  </h2>
                  <p className="text-gray-300 leading-relaxed text-lg max-w-4xl whitespace-pre-line">
                    {data.biography}
                  </p>
                </div>
              ) : (
                <div className="mb-12">
                  <h2 className="text-2xl font-bold mb-4 text-red-600 uppercase tracking-widest font-bebas">
                    Biography
                  </h2>
                  <p className="text-gray-300 leading-relaxed text-lg max-w-4xl whitespace-pre-line">
                    Oops! We couldn’t find a biography for this actor at the
                    moment.{" "}
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="mt-15">
            {data.movie_credits?.cast && data.tv_credits?.cast && (
              <div>
                <div className="mb-10 flex justify-center items-center flex-col">
                  <h2 className="text-4xl font-bold mb-2 tracking-widest text-center">
                    Filmography
                  </h2>
                  <div className="w-20 h-1.5 bg-red-600 rounded-full" />
                </div>
                <MovieMiniCard
                  movies={[
                    ...data.movie_credits.cast,
                    ...data.tv_credits.cast,
                  ].sort((a: any, b: any) =>
                    (b.release_date || b.first_air_date || "").localeCompare(
                      a.release_date || a.first_air_date || "",
                    ),
                  )}
                />
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
