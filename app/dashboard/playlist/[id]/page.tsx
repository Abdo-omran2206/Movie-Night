"use client";
import { useEffect, useState, use } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  FaGlobe,
  FaLock,
  FaLink,
  FaFilm,
  FaCalendarAlt,
  FaChevronLeft,
} from "react-icons/fa";
import { CgPlayList } from "react-icons/cg";
import { Movie } from "@/constant/types";
import { backdropUrl } from "@/constant/main";
import PlaylistMovieCard from "@/components/cards/PlaylistMovieCard";
import { deleteMovieFromPlaylist } from "@/lib/services/PlaylistManger";
import { toast } from "react-toastify";

type PlaylistDetailProps = {
  playlist: {
    id: string;
    name: string;
    description?: string;
    visibility: "public" | "private" | "unlisted";
    created_at: string;
    playlist_items?: Array<{
      movie_id: number;
      movies: {
        movie_id: number;
        title: string;
        overview: string;
        poster_path: string | null;
        backdrop_path: string | null;
        type: "movie" | "tv";
      } | null;
    }>;
  };
};

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
        <h2
          className="text-2xl font-bold text-red-500 uppercase tracking-widest"
          style={{ fontFamily: "var(--font-bebas)" }}
        >
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

  return playlist ? (
    <PlaylistDetailView playlist={playlist} onPlaylistChange={setPlaylist} />
  ) : null;
}

function PlaylistDetailView({
  playlist,
  onPlaylistChange,
}: PlaylistDetailProps & {
  onPlaylistChange: (playlist: PlaylistDetailProps["playlist"]) => void;
}) {
  const [removingId, setRemovingId] = useState<number | null>(null);

  const handleRemoveMovie = async (movieId: number) => {
    const confirmed = confirm("Remove this title from the playlist?");
    if (!confirmed) return;

    setRemovingId(movieId);
    try {
      const data = await deleteMovieFromPlaylist(playlist.id, movieId);
      if (!data?.success) {
        throw new Error(data?.error || "Failed to remove movie");
      }

      onPlaylistChange({
        ...playlist,
        playlist_items: (playlist.playlist_items || []).filter(
          (item) =>
            item.movie_id !== movieId && item.movies?.movie_id !== movieId,
        ),
      });
      toast.success("Removed from playlist");
    } catch (err) {
      console.error(err);
      toast.error("Failed to remove movie from playlist");
    } finally {
      setRemovingId(null);
    }
  };

  const getVisibilityIcon = () => {
    switch (playlist.visibility) {
      case "public":
        return <FaGlobe className="text-emerald-500 text-xs" />;
      case "private":
        return <FaLock className="text-red-500 text-xs" />;
      case "unlisted":
        return <FaLink className="text-amber-500 text-xs" />;
      default:
        return null;
    }
  };

  const getVisibilityClass = () => {
    switch (playlist.visibility) {
      case "public":
        return "bg-emerald-950/40 text-emerald-400 border-emerald-500/20";
      case "private":
        return "bg-red-950/40 text-red-400 border-red-500/20";
      case "unlisted":
        return "bg-amber-950/40 text-amber-400 border-amber-500/20";
      default:
        return "bg-neutral-800 text-neutral-400 border-neutral-700/20";
    }
  };

  const formattedDate = playlist.created_at
    ? new Date(playlist.created_at).toLocaleDateString(undefined, {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : null;

  // Extract first backdrop from movie list to use as custom header cover
  const playlistItems = playlist.playlist_items || [];
  const firstBackdrop = playlistItems.find((item) => item.movies?.backdrop_path)
    ?.movies?.backdrop_path;
  const headerCoverSrc = firstBackdrop ? backdropUrl + firstBackdrop : null;

  return (
    <div className="space-y-10">
      {/* Back Button */}
      <Link
        href={"/dashboard/playlist"}
        className="inline-flex items-center gap-2 text-sm text-neutral-400 hover:text-white transition duration-200"
      >
        <FaChevronLeft size={10} /> Back to Playlists
      </Link>
      {/* Hero Banner Header */}
      <div className="relative w-full rounded-3xl overflow-hidden border border-neutral-800/80 bg-neutral-950 shadow-2xl p-6 md:p-10 flex flex-col justify-end min-h-[220px] md:min-h-[280px]">
        {/* Cover Background */}
        <div className="absolute inset-0 z-0">
          {headerCoverSrc ? (
            <Image
              src={headerCoverSrc}
              alt={playlist.name}
              fill
              className="object-cover opacity-25 blur-xs"
              priority
              sizes="100vw"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-tr from-neutral-950 via-neutral-900 to-red-950/20" />
          )}
          {/* Bottom & Left Gradient Cover Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/70 to-transparent" />
        </div>

        {/* Content Overlay */}
        <div className="relative z-10 space-y-4 max-w-4xl">
          {/* Header Metadata Rows */}
          <div className="flex items-center gap-3 flex-wrap">
            <span className="px-2.5 py-0.5 text-[10px] font-black tracking-widest uppercase rounded bg-red-600/10 border border-red-500/20 text-red-500 shadow-[0_0_15px_rgba(220,38,38,0.15)]">
              COLLECTION
            </span>
            <span
              className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 text-[10px] font-black tracking-widest uppercase rounded border ${getVisibilityClass()}`}
            >
              {getVisibilityIcon()}
              {playlist.visibility}
            </span>
          </div>

          {/* Playlist Title */}
          <h1
            className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white tracking-wider uppercase leading-none drop-shadow-md"
            style={{ fontFamily: "var(--font-bebas)" }}
          >
            {playlist.name}
          </h1>

          {/* Description */}
          <p className="text-neutral-300 text-sm md:text-base max-w-2xl leading-relaxed">
            {playlist.description ||
              "No description available for this playlist."}
          </p>

          {/* Footer stats */}
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-neutral-400 pt-2 border-t border-neutral-800/40">
            <span className="flex items-center gap-2">
              <FaFilm className="text-red-500" />
              {playlistItems.length}{" "}
              {playlistItems.length === 1 ? "Title" : "Titles"}
            </span>
            {formattedDate && (
              <span className="flex items-center gap-2">
                <FaCalendarAlt className="text-red-500" />
                Created {formattedDate}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Movie Items Section */}
      <div className="space-y-6">
        <h2
          className="text-2xl font-bold tracking-widest uppercase pb-2 border-b border-neutral-800"
          style={{ fontFamily: "var(--font-bebas)" }}
        >
          Movies & Shows ({playlistItems.length})
        </h2>

        {playlistItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-neutral-500 border border-dashed border-neutral-850 rounded-2xl bg-neutral-900/10">
            <CgPlayList
              size={48}
              className="text-neutral-700 mb-3 opacity-60"
            />
            <p className="font-semibold text-lg">No titles added yet</p>
            <p className="text-xs text-neutral-500 mt-1 max-w-xs text-center">
              Explore the database to add your favorite movies and TV shows to
              this collection!
            </p>
            <Link
              href="/explore"
              className="mt-6 px-5 py-2.5 bg-red-600 hover:bg-red-500 text-white font-bold text-sm rounded-lg transition"
            >
              Explore Titles
            </Link>
          </div>
        ) : (
          <div className="flex flex-wrap justify-start gap-x-6 gap-y-8">
            {playlistItems
              .filter((item) => item.movies !== null)
              .map((item) => {
                const m = item.movies!;
                // Map the api data to the shape expected by MovieCard
                const movieCardProp: Movie = {
                  id: m.movie_id,
                  title: m.title,
                  name: m.title,
                  poster_path: m.poster_path,
                  backdrop_path: m.backdrop_path,
                  overview: m.overview || "",
                  vote_average: 0,
                  media_type: m.type || "movie",
                  adult: false,
                  genre_ids: [],
                  original_language: "en",
                  popularity: 0,
                  video: false,
                  vote_count: 0,
                  profile_path: "",
                };

                return (
                  <div
                    key={m.movie_id}
                    className="w-[200px] sm:w-[220px] md:w-[250px]"
                  >
                    <PlaylistMovieCard
                      movie={movieCardProp}
                      onRemove={handleRemoveMovie}
                      removing={removingId === m.movie_id}
                    />
                  </div>
                );
              })}
          </div>
        )}
      </div>
    </div>
  );
}
