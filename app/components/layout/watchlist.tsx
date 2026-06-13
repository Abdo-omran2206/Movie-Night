"use client";
import { useEffect, useState } from "react";
import { supabaseClient } from "@/app/lib/supabase";
import DashboardMovieCard from "../cards/DashboardMovieCard";
import { FaHeart, FaHistory } from "react-icons/fa";
import  { STATUS } from "@/app/constant/main";

export default function Watchlist({ userId }: { userId: string }) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [bookmarks, setBookmarks] = useState<any[]>([]);
  const [filter, setFilter] = useState<string>("All");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWatchlist = async () => {
      setLoading(true);
      const { data, error } = await supabaseClient
        .from("bookmark")
        .select(
          `
          status,
          created_at,
          movies (
            movie_id,
            title,
            overview,
            poster_path,
            backdrop_path,
            type
          )
        `,
        )
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching watchlist:", error);
      } else {
        setBookmarks(data || []);
      }
      setLoading(false);
    };

    fetchWatchlist();
  }, [userId]);

  return (
    <div className="bg-neutral-900/40 backdrop-blur-xl border border-neutral-800 rounded-3xl p-8 min-h-[400px]">
      <div className="flex items-center gap-3 mb-6">
        <FaHeart className="text-red-500 text-2xl" />
        <h2
          className="text-2xl font-bold tracking-widest"
          style={{ fontFamily: "var(--font-bebas)" }}
        >
          Your Watchlist
        </h2>
        <div>
          <p className="text-sm text-neutral-500">
            {bookmarks.length} {bookmarks.length === 1 ? "item" : "items"}
          </p>
        </div>
      </div>
      <div className="flex flex-wrap gap-2 mb-5">
        {STATUS.length > 0 &&
          STATUS.map((status) => {
        const Icon = status.icon;
        return (
          <button
            key={status.name}
            onClick={() => setFilter(status.name)}
            className={`text-xs flex items-center gap-2 py-2 px-4 lg:py-3 lg:px-6 lg:text-md lg:justify-around hover:cursor-pointer rounded-lg transition-colors ${
          filter === status.name
            ? "bg-red-600 text-white"
            : "bg-neutral-800 text-neutral-400 hover:bg-red-600 hover:text-white"
            }`}
          >
            <Icon className="text-sm" />
            {status.name}
          </button>
        );
          })}
      </div>

      {loading ? (
        <div className="w-full flex flex-wrap gap-6">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="relative w-full h-36 md:h-40 rounded-xl overflow-hidden bg-neutral-900/50 border border-neutral-800 animate-pulse flex p-3 gap-4"
            >
              {/* Poster Skeleton */}
              <div className="relative h-full aspect-2/3 shrink-0 rounded-lg bg-neutral-800/80" />
              {/* Text Skeletons */}
              <div className="flex flex-col flex-1 justify-center gap-3">
                <div className="w-12 h-3 bg-neutral-800/80 rounded" />
                <div className="w-2/3 h-5 bg-neutral-800/80 rounded" />
                <div className="space-y-2 mt-2">
                  <div className="w-full h-2 bg-neutral-800/50 rounded" />
                  <div className="w-5/6 h-2 bg-neutral-800/50 rounded" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : bookmarks.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-neutral-600 border-2 border-dashed border-neutral-800 rounded-xl">
          <FaHistory className="text-4xl mb-4 opacity-50" />
          <p>Your watchlist is currently empty.</p>
          <p className="text-sm mt-2 text-neutral-500">
            Save movies and shows to watch them later.
          </p>
        </div>
      ) : (
        <div className="w-full flex flex-wrap gap-6">
          {bookmarks
            .filter((bookmark) => filter === "All" || bookmark.status === filter)
            .map((bookmark) => (
              <div key={bookmark.created_at} className="w-full md:w-auto">
                <DashboardMovieCard
                  {...bookmark.movies}
                  status={bookmark.status}
                />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
