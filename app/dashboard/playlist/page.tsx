"use client";
import { useEffect, useState } from "react";
import { FaClock, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { useRouter } from "next/navigation";
import DashboardPlaylistCard from "@/components/cards/DashboardPlaylistCard";
import { toast } from "react-toastify";

export default function PlaylistPage() {
  const router = useRouter();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [playlist, setPlaylist] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchPlaylist = async () => {
      setLoading(true);
      try {
        const url = "/api/dashboard/playlist";
        const res = await fetch(url, { credentials: "include" });
        const json = await res.json();
        if (!res.ok) {
          console.error("Error fetching playlist:", json);
          setPlaylist([]);
        } else {
          setPlaylist(json || []);
        }
      } catch (err) {
        console.error("Error fetching playlist:", err);
        setPlaylist([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPlaylist();
  }, []);

  const handleDelete = async (e: React.MouseEvent , id: string) => {
    e.preventDefault();
    e.stopPropagation();
    const confirmDelete = confirm(
      "Are you sure you want to delete this playlist?",
    );

    if (!confirmDelete) return;

    try {
      const res = await fetch(`/api/dashboard/playlist/${id}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error);

      setPlaylist((prev) => prev.filter((item) => item.id !== id));
      toast.success("Playlist deleted successfully");
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete playlist");
    }
  };

  const totalPages = Math.ceil(playlist.length / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedWatchlist = playlist.slice(
    startIndex,
    startIndex + itemsPerPage,
  );

  return (
    <div className="bg-neutral-900/40 backdrop-blur-xl border border-neutral-800 rounded-3xl px-3 py-8 lg:p-8 min-h-[400px]">
      <div className="flex items-center gap-3 mb-6 px-5 lg:p-0">
        <FaClock className="text-red-500 text-2xl animate-pulse" />
        <h2
          className="text-2xl font-bold tracking-widest"
          style={{ fontFamily: "var(--font-bebas)" }}
        >
          Your Playlist
        </h2>
        <div>
          <p className="text-sm text-neutral-500">
            {playlist.length} {playlist.length === 1 ? "item" : "items"}
          </p>
        </div>
      </div>

      {loading ? (
        <div className="w-full flex flex-wrap gap-6">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="relative w-full h-36 md:h-40 rounded-xl overflow-hidden bg-neutral-900/50 border border-neutral-800 animate-pulse flex p-3 gap-4"
            >
              <div className="relative h-full aspect-2/3 shrink-0 rounded-lg bg-neutral-800/80" />
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
      ) : playlist.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-neutral-600 border-2 border-dashed border-neutral-800 rounded-xl">
          <FaClock className="text-4xl mb-4 opacity-50" />
          <p>Your playlist is currently empty.</p>
          <p className="text-sm mt-2 text-neutral-500">
            Save movies and shows to watch them later.
          </p>
          <button
            onClick={() => router.push("/explore")}
            className="mt-6 px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-all duration-300 shadow-lg hover:shadow-red-600/20 active:scale-95 cursor-pointer"
          >
            Explore Movies
          </button>
        </div>
      ) : (
        <div className="space-y-8">
          <div className="w-full flex flex-wrap gap-6">
            {paginatedWatchlist.map((playlist) => (
              <div key={playlist.created_at} className="w-full">
                <DashboardPlaylistCard {...playlist} handleDelete={handleDelete} />
              </div>
            ))}
          </div>

          {/* Pagination Controls */}
          {playlist.length > itemsPerPage && (
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
