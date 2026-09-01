"use client";
import { useEffect, useState, use } from "react";
import PlaylistDetailView from "@/components/ui/PlaylistDetailView";
import Link from "next/link";

export default function PlaylistDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [playlist, setPlaylist] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPlaylist = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/dashboard/playlist/${id}`);
        const json = await res.json();
        if (res.ok) {
          setPlaylist(json);
        } else {
          setError(json.error || "Failed to load playlist.");
        }
      } catch (err) {
        console.error("Error loading playlist:", err);
        setError("An unexpected error occurred while loading the playlist.");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchPlaylist();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-3">
        <div className="w-10 h-10 border-4 border-t-red-600 border-neutral-850 rounded-full animate-spin" />
        <p className="text-sm text-neutral-400">Loading playlist details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center max-w-md mx-auto space-y-4">
        <h2 className="text-2xl font-bold text-red-500 uppercase tracking-widest" style={{ fontFamily: "var(--font-bebas)" }}>
          Access Restricted
        </h2>
        <p className="text-sm text-neutral-400 leading-relaxed">
          {error === "Unauthorized" 
            ? "This is a private playlist. You must be logged in as the owner to view it."
            : error}
        </p>
        <Link
          href="/playlist"
          className="px-5 py-2.5 bg-neutral-900 border border-neutral-800 hover:border-red-600/50 text-white rounded-lg transition cursor-pointer"
        >
          Back to Playlists
        </Link>
      </div>
    );
  }

  return playlist ? <PlaylistDetailView playlist={playlist} /> : null;
}
