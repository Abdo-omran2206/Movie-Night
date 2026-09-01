"use client";
import { useEffect, useState } from "react";
import DashboardMovieCard from "@/components/cards/DashboardMovieCard";
import {
  FaHeart,
  FaHistory,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";
import { STATUS } from "@/constant/main";

export default function BookmarkPage() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [bookmarks, setBookmarks] = useState<any[]>([]);
  const [filter, setFilter] = useState<string>("All");
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchWatchlist = async () => {
      setLoading(true);
      try {
        const url = "/api/dashboard/bookmark";
        const res = await fetch(url, {
          method: "GET",
          credentials: "include",
        });
        const json = await res.json();
        if (!res.ok) {
          console.error("Error fetching watchlist:", json);
          setBookmarks([]);
        } else {
          setBookmarks(json || []);
        }
      } catch (err) {
        console.error("Error fetching watchlist:", err);
        setBookmarks([]);
      } finally {
        setLoading(false);
      }
    };

    fetchWatchlist();
  }, []);

  // Reset page when filter or bookmark list changes
  useEffect(() => {
    setCurrentPage(1);
  }, [filter, bookmarks.length]);

  const filteredBookmarks = bookmarks.filter(
    (bookmark) => filter === "All" || bookmark.status === filter,
  );

  const totalPages = Math.ceil(filteredBookmarks.length / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedBookmarks = filteredBookmarks.slice(
    startIndex,
    startIndex + itemsPerPage,
  );

  return (
    <div className="bg-neutral-900/40 backdrop-blur-xl border border-neutral-800 rounded-3xl px-3 py-8 lg:p-8 min-h-[400px]">
      <div className="flex items-center gap-3 mb-6 px-5 lg:p-0">
        <FaHeart className="text-red-500 text-2xl animate-pulse" />
        <h2
          className="text-2xl font-bold tracking-widest"
          style={{ fontFamily: "var(--font-bebas)" }}
        >
          Your Bookmarks
        </h2>
        <div>
          <p className="text-sm text-neutral-500">
            {filteredBookmarks.length}{" "}
            {filteredBookmarks.length === 1 ? "item" : "items"}
          </p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2 mb-6 px-3 lg:p-0">
        {STATUS.length > 0 &&
          STATUS.map((status) => {
            const Icon = status.icon;
            return (
              <button
                key={status.name}
                onClick={() => setFilter(status.name)}
                className={`text-xs flex items-center gap-2 py-1.5 px-3 lg:py-3 lg:px-6 lg:text-md lg:justify-around hover:cursor-pointer rounded-lg transition-colors border ${
                  filter === status.name
                    ? "bg-red-600 border-red-600 text-white shadow-lg shadow-red-600/20"
                    : "bg-neutral-800/50 border-neutral-700/50 text-neutral-400 hover:border-red-600/30 hover:text-white"
                }`}
              >
                <Icon className="text-sm" />
                {status.name}
              </button>
            );
          })}
      </div>

      {loading ? (
        <>
          <style>{`
            @keyframes shimmer {
              0%   { background-position: -700px 0; }
              100% { background-position: 700px 0; }
            }
            .skeleton-shimmer {
              background: linear-gradient(
                90deg,
                rgba(255,255,255,0.03) 0%,
                rgba(255,255,255,0.08) 40%,
                rgba(255,255,255,0.03) 80%
              );
              background-size: 700px 100%;
              animation: shimmer 1.6s infinite linear;
            }
          `}</style>
          <div className="w-full flex flex-col gap-4">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="relative w-full h-36 md:h-40 rounded-2xl overflow-hidden border border-neutral-800/60 flex p-3 gap-4"
                style={{
                  background: "rgba(14,14,14,0.7)",
                  animationDelay: `${i * 0.08}s`,
                }}
              >
                {/* Poster placeholder */}
                <div
                  className="relative h-full aspect-[2/3] shrink-0 rounded-xl skeleton-shimmer"
                  style={{ background: "rgba(40,40,40,0.9)" }}
                />
                {/* Text placeholders */}
                <div className="flex flex-col flex-1 justify-center gap-3 py-1">
                  {/* Badge */}
                  <div
                    className="w-14 h-3 rounded-full skeleton-shimmer"
                    style={{ background: "rgba(40,40,40,0.9)" }}
                  />
                  {/* Title */}
                  <div
                    className="w-2/3 h-5 rounded-lg skeleton-shimmer"
                    style={{ background: "rgba(40,40,40,0.9)", animationDelay: `${i * 0.08 + 0.1}s` }}
                  />
                  {/* Description lines */}
                  <div className="space-y-2 mt-1">
                    <div
                      className="w-full h-2.5 rounded skeleton-shimmer"
                      style={{ background: "rgba(30,30,30,0.9)", animationDelay: `${i * 0.08 + 0.2}s` }}
                    />
                    <div
                      className="w-5/6 h-2.5 rounded skeleton-shimmer"
                      style={{ background: "rgba(30,30,30,0.9)", animationDelay: `${i * 0.08 + 0.3}s` }}
                    />
                    <div
                      className="w-3/4 h-2.5 rounded skeleton-shimmer"
                      style={{ background: "rgba(30,30,30,0.9)", animationDelay: `${i * 0.08 + 0.4}s` }}
                    />
                  </div>
                  {/* Status pill */}
                  <div
                    className="w-20 h-5 rounded-full mt-1 skeleton-shimmer"
                    style={{ background: "rgba(40,40,40,0.9)", animationDelay: `${i * 0.08 + 0.5}s` }}
                  />
                </div>
                {/* Action icons area */}
                <div className="flex flex-col justify-center gap-3 pr-1">
                  <div
                    className="w-7 h-7 rounded-full skeleton-shimmer"
                    style={{ background: "rgba(40,40,40,0.9)" }}
                  />
                  <div
                    className="w-7 h-7 rounded-full skeleton-shimmer"
                    style={{ background: "rgba(40,40,40,0.9)", animationDelay: "0.15s" }}
                  />
                </div>
              </div>
            ))}
          </div>
        </>
      ) : bookmarks.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-neutral-600 border-2 border-dashed border-neutral-800 rounded-xl">
          <FaHistory className="text-4xl mb-4 opacity-50" />
          <p>Your watchlist is currently empty.</p>
          <p className="text-sm mt-2 text-neutral-500">
            Save movies and shows to watch them later.
          </p>
        </div>
      ) : filteredBookmarks.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-neutral-600 border-2 border-dashed border-neutral-800 rounded-xl">
          <p>No results for &quot;{filter}&quot;</p>
          <p className="text-sm mt-2 text-neutral-500">
            Try another filter or add more items.
          </p>
        </div>
      ) : (
        <div className="space-y-8">
          <div className="w-full flex flex-wrap gap-6">
            {paginatedBookmarks.map((bookmark) => (
              <div key={bookmark.created_at} className="w-full md:w-auto">
                <DashboardMovieCard
                  {...bookmark.movies}
                  status={bookmark.status}
                />
              </div>
            ))}
          </div>

          {/* Pagination Controls */}
          {filteredBookmarks.length > itemsPerPage && (
            <div className="flex justify-center items-center gap-4 mt-8 pt-6 border-t border-neutral-800/60">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-white hover:border-red-600 disabled:opacity-30 disabled:hover:border-neutral-800 disabled:hover:text-neutral-400 disabled:cursor-not-allowed transition-all duration-300 font-medium flex items-center gap-2 text-sm shadow-md"
              >
                <FaChevronLeft className="text-xs" /> Prev
              </button>
              <span className="text-neutral-400 text-sm font-medium tracking-wide">
                Page{" "}
                <span className="text-red-500 font-bold">{currentPage}</span> of{" "}
                {totalPages}
              </span>
              <button
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
                className="px-4 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-white hover:border-red-600 disabled:opacity-30 disabled:hover:border-neutral-800 disabled:hover:text-neutral-400 disabled:cursor-not-allowed transition-all duration-300 font-medium flex items-center gap-2 text-sm shadow-md"
              >
                Next <FaChevronRight className="text-xs" />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
