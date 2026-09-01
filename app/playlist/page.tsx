"use client";
import { useEffect, useState } from "react";
import { FaGlobe, FaClock } from "react-icons/fa";
import PlaylistCard from "@/components/cards/PlaylistCard";

export default function PublicPlaylistsPage() {
  const [playlists, setPlaylists] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPublicPlaylists = async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/dashboard/playlist/public");
        const json = await res.json();
        if (res.ok) {
          setPlaylists(json || []);
        } else {
          console.error("Failed to fetch public playlists:", json);
        }
      } catch (err) {
        console.error("Error fetching public playlists:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPublicPlaylists();
  }, []);

  return (
    <div className="space-y-8 min-h-screen">
      {/* Page Header */}
      <div className="flex items-center gap-3 border-b border-neutral-800 pb-4">
        <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-emerald-605/10 border border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.1)]">
          <FaGlobe className="text-emerald-500 text-xl" />
        </div>
        <div>
          <h1
            className="text-3xl font-bold tracking-widest uppercase"
            style={{ fontFamily: "var(--font-bebas)" }}
          >
            Public Playlists
          </h1>
          <p className="text-sm text-neutral-400">
            Browse collection lists created by movie enthusiasts
          </p>
        </div>
      </div>

      {/* Grid of Playlists */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
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
      ) : playlists.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-neutral-500 border border-dashed border-neutral-800 rounded-2xl">
          <FaClock className="text-4xl mb-3 opacity-50" />
          <p className="font-semibold">No public playlists found.</p>
          <p className="text-xs text-neutral-500 mt-1">Check back later or create one!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {playlists.map((playlist) => (
            <PlaylistCard key={playlist.id} {...playlist} />
          ))}
        </div>
      )}
    </div>
  );
}
