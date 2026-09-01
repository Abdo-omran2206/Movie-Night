"use client";
import { Bookmark, Playlist, Visibility } from "@/constant/types";
import {
  addMovieToWatchlist,
  createPlaylists,
  getMyPlaylists,
} from "@/lib/services/PlaylistManger";
import { useUserStore } from "@/store/useUserStore";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { CgPlayListAdd, CgPlayListCheck } from "react-icons/cg";
import { FaTimes, FaGlobe, FaLock, FaLink } from "react-icons/fa";
import { HiOutlineFilm } from "react-icons/hi2";
import { toast } from "react-toastify";

export default function PlaylistModel({
  movieID,
  title,
  overview,
  backdrop,
  poster,
  type,
}: Bookmark) {
  const [isPlaylist, setIsPlaylist] = useState(false);
  const [isPlaylistModelOpen, setIsPlaylistModelOpen] = useState(false);
  const userID = useUserStore((state) => state.user);

  const handleTooglePlaylist = () => {
    setIsPlaylistModelOpen(true);
  };

    if (!userID?.id) return;
  
  // useEffect(()=>{
  //   const fetchStatus = async ()=>{
  //     const data = await fetch(`/api/dashboard/playlist/${}`)
  //   }


  // },[userID,movieID])

  return (
    <div
      onClick={handleTooglePlaylist}
      className="flex justify-center items-center"
    >
      {isPlaylist ? (
        <CgPlayListCheck
          size={30}
          className="flex hover:scale-125 transition-all duration-100 hover:cursor-pointer text-emerald-500"
          title="Movie is bookmarked in a playlist"
        />
      ) : (
        <CgPlayListAdd
          size={30}
          className="flex hover:scale-125 transition-all duration-100 hover:cursor-pointer hover:text-red-500"
          title="Add to Playlist"
        />
      )}

      {isPlaylistModelOpen ? (
        <PlayListModel
          setIsPlaylistModelOpen={setIsPlaylistModelOpen}
          setIsPlaylist={setIsPlaylist}
          title={title}
          movieID={movieID}
          overview={overview}
          backdrop={backdrop || ""}
          poster={poster}
          type={type}
        />
      ) : null}
    </div>
  );
}




function PlayListModel({
  setIsPlaylistModelOpen,
  setIsPlaylist,
  movieID,
  title,
  overview,
  backdrop,
  poster,
  type,
}: {
  setIsPlaylistModelOpen: Dispatch<SetStateAction<boolean>>;
  setIsPlaylist: Dispatch<SetStateAction<boolean>>;
  title: string;
  movieID: number;
  overview: string;
  backdrop: string;
  poster: string;
  type: "movie" | "tv";
}) {
  const [isClosing, setIsClosing] = useState(false);
  const [myPlaylists, setMyPlaylists] = useState<Playlist[]>([]);
  const [loading, setLoading] = useState(true);

  const handleAddToPlaylist = async (playlistId: string): Promise<boolean> => {
    try {
      const data = await addMovieToWatchlist(
        movieID,
        title,
        overview,
        backdrop,
        poster,
        type,
        playlistId,
      );

      if (!data || data.error) {
        toast.error(data?.error || "Something went wrong");
        return false;
      }

      toast.success("Added to playlist successfully 🎉");
      setIsPlaylist(true);
      return true;
    } catch (err: any) {
      toast.error(err.message || "Unexpected error");
      return false;
    }
  };

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => setIsPlaylistModelOpen(false), 220);
  };

  useEffect(() => {
    const getMyPlaylist = async () => {
      setLoading(true);
      try {
        const playlists = await getMyPlaylists();
        if (Array.isArray(playlists)) {
          setMyPlaylists(playlists);
        } else {
          setMyPlaylists([]);
        }
      } catch (err) {
        console.error("Error fetching playlists:", err);
        setMyPlaylists([]);
      } finally {
        setLoading(false);
      }
    };
    getMyPlaylist();
  }, []);

  const handlePlaylistCreated = (newPlaylist: Playlist) => {
    setMyPlaylists((prev) => [newPlaylist, ...prev]);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      onClick={(e) => {
        e.stopPropagation();
        handleClose();
      }}
      style={{
        background: "rgba(0,0,0,0.75)",
        backdropFilter: "blur(8px)",
        WebkitBackdropFilter: "blur(8px)",
        animation: isClosing
          ? "fadeOut 0.22s ease forwards"
          : "fadeIn 0.22s ease forwards",
      }}
    >
      {/* Modal Panel */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Playlist options"
        onClick={(e) => e.stopPropagation()}
        style={{
          animation: isClosing
            ? "slideDown 0.22s ease forwards"
            : "slideUp 0.22s ease forwards",
        }}
        className="w-full max-w-[420px] mx-4 rounded-2xl overflow-hidden shadow-2xl"
      >
        {/* Glass card */}
        <div
          style={{
            background:
              "linear-gradient(135deg, rgba(18,18,18,0.98) 0%, rgba(10,10,10,0.98) 100%)",
            border: "1px solid rgba(229,9,20,0.18)",
            boxShadow:
              "0 0 0 1px rgba(255,255,255,0.04), 0 32px 64px rgba(0,0,0,0.8), 0 0 40px rgba(229,9,20,0.08)",
          }}
        >
          {/* Header */}
          <div
            className="relative flex items-center justify-between px-6 pt-6 pb-4"
            style={{
              borderBottom: "1px solid rgba(255,255,255,0.06)",
            }}
          >
            {/* Red accent bar */}
            <div
              className="absolute top-0 left-0 right-0 h-0.5 rounded-t-2xl"
              style={{
                background:
                  "linear-gradient(90deg, transparent, #e50914, #ff4d4f, transparent)",
              }}
            />
            <div className="flex items-center gap-3">
              <div
                className="flex items-center justify-center w-9 h-9 rounded-xl"
                style={{
                  background: "rgba(229,9,20,0.12)",
                  border: "1px solid rgba(229,9,20,0.25)",
                }}
              >
                <HiOutlineFilm className="text-red-500" size={18} />
              </div>
              <div className="min-w-0">
                <h2
                  className="text-white font-bold tracking-wider text-lg leading-tight"
                  style={{ fontFamily: "var(--font-bebas)" }}
                >
                  Add to Playlists
                </h2>
                <p className="text-gray-400 text-xs mt-0.5 truncate max-w-[240px]">
                  {title}
                </p>
              </div>
            </div>
            <button
              onClick={handleClose}
              aria-label="Close bookmark modal"
              className="flex items-center justify-center w-8 h-8 rounded-full transition-all duration-200 hover:bg-white/10 hover:cursor-pointer"
              style={{ color: "#888" }}
            >
              <FaTimes size={14} />
            </button>
          </div>

          {/* Body */}
          <PlaylistsUI
            myPlaylists={myPlaylists}
            loading={loading}
            movieID={movieID}
            handleAddToPlaylist={handleAddToPlaylist}
            onPlaylistCreated={handlePlaylistCreated}
          />
        </div>
      </div>
      {/* Keyframe animations */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes fadeOut {
          from { opacity: 1; }
          to { opacity: 0; }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(24px) scale(0.96); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes slideDown {
          from { opacity: 1; transform: translateY(0) scale(1); }
          to { opacity: 0; transform: translateY(24px) scale(0.96); }
        }
      `}</style>
    </div>
  );
}

type Props = {
  myPlaylists: Playlist[];
  loading: boolean;
  movieID: number;
  handleAddToPlaylist: (playlistId: string) => Promise<boolean>;
  onPlaylistCreated: (newPlaylist: Playlist) => void;
};

export function PlaylistsUI({
  myPlaylists,
  loading,
  movieID,
  handleAddToPlaylist,
  onPlaylistCreated,
}: Props) {
  const [showForm, setShowForm] = useState(false);
  const [errormMessage, setErrormMessage] = useState<string | null>(null);
  const [addedPlaylistIds, setAddedPlaylistIds] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState<{
    name: string;
    description: string;
    visibility: Visibility;
  }>({
    name: "",
    description: "",
    visibility: "private",
  });

  useEffect(() => {
    if (Array.isArray(myPlaylists)) {
      const alreadyAdded = myPlaylists
        .filter((list) =>
          list.playlist_items?.some((item: any) => item.movie_id === movieID)
        )
        .map((list) => list.id);
      setAddedPlaylistIds(alreadyAdded);
    }
  }, [myPlaylists, movieID]);

  const handleCreatList = async () => {
    if (!form.name.trim()) {
      setErrormMessage("Playlist name is required");
      return;
    }
    setErrormMessage(null);
    setIsSubmitting(true);
    try {
      const data = await createPlaylists(
        form.name.trim(),
        form.description.trim(),
        form.visibility,
      );
      
      if (!data || data.error) {
        setErrormMessage(data?.error || "Failed to create playlist");
        return;
      }
      
      onPlaylistCreated(data);
      setForm({ name: "", description: "", visibility: "private" });
      setShowForm(false);
      toast.success("Playlist created successfully! 🎉");
    } catch (err: any) {
      setErrormMessage(err.message || "An unexpected error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddClick = async (playlistId: string) => {
    const success = await handleAddToPlaylist(playlistId);
    if (success) {
      setAddedPlaylistIds((prev) => [...prev, playlistId]);
    }
  };

  const getVisibilityIcon = (visibility: Visibility) => {
    switch (visibility) {
      case "public":
        return <FaGlobe className="text-emerald-500 text-[10px]" />;
      case "private":
        return <FaLock className="text-red-500 text-[10px]" />;
      case "unlisted":
        return <FaLink className="text-amber-500 text-[10px]" />;
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col w-full p-5 gap-4">
      {/* Shimmer keyframes */}
      <style>{`
        @keyframes playlist-shimmer {
          0%   { background-position: -500px 0; }
          100% { background-position: 500px 0; }
        }
        .pl-skeleton {
          background: linear-gradient(
            90deg,
            rgba(255,255,255,0.04) 0%,
            rgba(255,255,255,0.09) 45%,
            rgba(255,255,255,0.04) 90%
          );
          background-size: 500px 100%;
          animation: playlist-shimmer 1.5s infinite linear;
        }
        .playlist-item:hover .playlist-count {
          opacity: 1;
        }
      `}</style>

      {/* Subheader Toolbar */}
      <div className="flex w-full justify-between items-center pb-3 border-b border-white/5">
        <div className="flex items-center gap-2">
          <span className="text-xs text-neutral-400 font-medium">
            {showForm ? "Create New Playlist" : "My Playlists"}
          </span>
          {!showForm && !loading && myPlaylists.length > 0 && (
            <span
              className="text-[10px] px-1.5 py-0.5 rounded-full font-bold"
              style={{
                background: "rgba(229,9,20,0.15)",
                color: "#e50914",
                border: "1px solid rgba(229,9,20,0.25)",
              }}
            >
              {myPlaylists.length}
            </span>
          )}
        </div>
        <button
          onClick={() => {
            setShowForm(!showForm);
            setErrormMessage(null);
          }}
          className="px-3 py-1.5 text-xs font-bold rounded-lg transition duration-200 cursor-pointer"
          style={{
            background: showForm ? "rgba(255,255,255,0.06)" : "rgba(229,9,20,0.15)",
            color: showForm ? "#aaa" : "#e50914",
            border: showForm ? "1px solid rgba(255,255,255,0.1)" : "1px solid rgba(229,9,20,0.3)",
          }}
          onMouseEnter={(e) => {
            if (!showForm) {
              (e.currentTarget as HTMLButtonElement).style.background = "#e50914";
              (e.currentTarget as HTMLButtonElement).style.color = "#fff";
            } else {
              (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.1)";
            }
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background = showForm ? "rgba(255,255,255,0.06)" : "rgba(229,9,20,0.15)";
            (e.currentTarget as HTMLButtonElement).style.color = showForm ? "#aaa" : "#e50914";
          }}
        >
          {showForm ? "✕ Cancel" : "+ New List"}
        </button>
      </div>

      {/* Body Area */}
      <div className="relative w-full min-h-[220px] max-h-[320px] flex items-start justify-center">
        {showForm ? (
          <div className="w-full space-y-3">
            <div className="relative">
              <input
                type="text"
                placeholder="Playlist name *"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full rounded-xl p-3 text-sm text-white focus:outline-none transition"
                style={{
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.1)",
                }}
                onFocus={(e) => { e.currentTarget.style.border = "1px solid rgba(229,9,20,0.6)"; e.currentTarget.style.background = "rgba(229,9,20,0.04)"; }}
                onBlur={(e) => { e.currentTarget.style.border = "1px solid rgba(255,255,255,0.1)"; e.currentTarget.style.background = "rgba(255,255,255,0.04)"; }}
                disabled={isSubmitting}
              />
            </div>

            <textarea
              placeholder="Description (optional)"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full rounded-xl p-3 text-sm text-white focus:outline-none transition min-h-[68px] max-h-[90px] resize-none"
              style={{
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.1)",
              }}
              onFocus={(e) => { e.currentTarget.style.border = "1px solid rgba(229,9,20,0.6)"; e.currentTarget.style.background = "rgba(229,9,20,0.04)"; }}
              onBlur={(e) => { e.currentTarget.style.border = "1px solid rgba(255,255,255,0.1)"; e.currentTarget.style.background = "rgba(255,255,255,0.04)"; }}
              disabled={isSubmitting}
            />

            {/* Visibility Selector */}
            <div className="flex gap-2">
              {(["private", "public", "unlisted"] as Visibility[]).map((v) => (
                <button
                  key={v}
                  type="button"
                  onClick={() => !isSubmitting && setForm({ ...form, visibility: v })}
                  className="flex-1 py-2 text-xs font-semibold rounded-lg capitalize transition-all duration-150 cursor-pointer flex items-center justify-center gap-1"
                  style={{
                    background: form.visibility === v
                      ? v === "public" ? "rgba(16,185,129,0.18)" : v === "unlisted" ? "rgba(245,158,11,0.18)" : "rgba(229,9,20,0.18)"
                      : "rgba(255,255,255,0.04)",
                    border: form.visibility === v
                      ? v === "public" ? "1px solid rgba(16,185,129,0.5)" : v === "unlisted" ? "1px solid rgba(245,158,11,0.5)" : "1px solid rgba(229,9,20,0.5)"
                      : "1px solid rgba(255,255,255,0.08)",
                    color: form.visibility === v
                      ? v === "public" ? "#10b981" : v === "unlisted" ? "#f59e0b" : "#e50914"
                      : "#666",
                  }}
                >
                  <span className="mr-1">{v === "public" ? <FaGlobe className="text-emerald-500 text-[10px]" /> : v === "unlisted" ? <FaLink className="text-amber-500 text-[10px]" /> : <FaLock className="text-red-500 text-[10px]" />}</span>
                  {v}
                </button>
              ))}
            </div>

            {errormMessage && (
              <div
                className="text-center p-2.5 text-xs rounded-xl"
                style={{
                  background: "rgba(229,9,20,0.1)",
                  border: "1px solid rgba(229,9,20,0.2)",
                  color: "#f87171",
                }}
              >
                {errormMessage}
              </div>
            )}

            <button
              onClick={handleCreatList}
              disabled={isSubmitting}
              className="w-full py-2.5 rounded-xl text-white font-bold text-sm transition cursor-pointer disabled:opacity-50"
              style={{
                background: "linear-gradient(135deg, #b91c1c, #e50914)",
                boxShadow: "0 4px 16px rgba(229,9,20,0.25)",
              }}
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin inline-block" />
                  Creating...
                </span>
              ) : "Create Playlist"}
            </button>
          </div>
        ) : loading ? (
          /* ── Skeleton Loading Rows ── */
          <div className="w-full space-y-2.5">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="flex items-center justify-between p-3 rounded-xl"
                style={{
                  background: "rgba(255,255,255,0.02)",
                  border: "1px solid rgba(255,255,255,0.05)",
                  opacity: 1 - i * 0.12,
                }}
              >
                <div className="flex flex-col gap-2 flex-1 min-w-0 pr-3">
                  <div className="flex items-center gap-2">
                    {/* Title skeleton */}
                    <div
                      className="h-4 rounded-md pl-skeleton"
                      style={{
                        width: `${55 + (i % 3) * 15}%`,
                        background: "rgba(60,60,60,0.8)",
                        animationDelay: `${i * 0.1}s`,
                      }}
                    />
                    {/* Badge skeleton */}
                    <div
                      className="h-3.5 w-14 rounded-full pl-skeleton shrink-0"
                      style={{ background: "rgba(45,45,45,0.8)", animationDelay: `${i * 0.1 + 0.15}s` }}
                    />
                  </div>
                  {/* Description skeleton */}
                  <div
                    className="h-2.5 rounded pl-skeleton"
                    style={{
                      width: `${35 + (i % 2) * 20}%`,
                      background: "rgba(45,45,45,0.7)",
                      animationDelay: `${i * 0.1 + 0.25}s`,
                    }}
                  />
                </div>
                {/* Button skeleton */}
                <div
                  className="h-7 w-14 rounded-lg pl-skeleton shrink-0"
                  style={{ background: "rgba(60,60,60,0.8)", animationDelay: `${i * 0.1 + 0.3}s` }}
                />
              </div>
            ))}
          </div>
        ) : myPlaylists.length > 0 ? (
          <div className="w-full h-full max-h-[300px] overflow-y-auto pr-0.5 space-y-2"
            style={{ scrollbarWidth: "thin", scrollbarColor: "rgba(229,9,20,0.3) transparent" }}
          >
            {myPlaylists.map((list, idx) => {
              const isAdded = addedPlaylistIds.includes(list.id);
              return (
                <div
                  key={list.id}
                  className="playlist-item group flex items-center justify-between p-3 rounded-xl transition-all duration-200 cursor-default"
                  style={{
                    background: isAdded ? "rgba(16,185,129,0.05)" : "rgba(255,255,255,0.03)",
                    border: isAdded
                      ? "1px solid rgba(16,185,129,0.25)"
                      : "1px solid rgba(255,255,255,0.07)",
                    animationDelay: `${idx * 0.04}s`,
                  }}
                  onMouseEnter={(e) => {
                    if (!isAdded) {
                      (e.currentTarget as HTMLDivElement).style.background = "rgba(229,9,20,0.06)";
                      (e.currentTarget as HTMLDivElement).style.border = "1px solid rgba(229,9,20,0.2)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLDivElement).style.background = isAdded ? "rgba(16,185,129,0.05)" : "rgba(255,255,255,0.03)";
                    (e.currentTarget as HTMLDivElement).style.border = isAdded ? "1px solid rgba(16,185,129,0.25)" : "1px solid rgba(255,255,255,0.07)";
                  }}
                >
                  <div className="flex flex-col min-w-0 pr-3 gap-1">
                    <div className="flex items-center gap-2">
                      <span
                        className="font-semibold text-sm truncate max-w-[170px]"
                        style={{ color: isAdded ? "#10b981" : "#e5e5e5" }}
                        title={list.name}
                      >
                        {list.name}
                      </span>
                      <span
                        className="flex items-center gap-1 text-[9px] px-1.5 py-0.5 rounded-full font-bold uppercase shrink-0"
                        style={{
                          background: list.visibility === "public"
                            ? "rgba(16,185,129,0.12)"
                            : list.visibility === "unlisted"
                            ? "rgba(245,158,11,0.12)"
                            : "rgba(229,9,20,0.10)",
                          border: list.visibility === "public"
                            ? "1px solid rgba(16,185,129,0.25)"
                            : list.visibility === "unlisted"
                            ? "1px solid rgba(245,158,11,0.25)"
                            : "1px solid rgba(229,9,20,0.20)",
                        }}
                      >
                        {getVisibilityIcon(list.visibility)}
                        <span
                          style={{
                            color: list.visibility === "public" ? "#10b981" : list.visibility === "unlisted" ? "#f59e0b" : "#e50914",
                          }}
                        >
                          {list.visibility}
                        </span>
                      </span>
                    </div>
                    {list.description ? (
                      <p className="text-[11px] text-neutral-500 truncate max-w-[200px]" title={list.description}>
                        {list.description}
                      </p>
                    ) : (
                      <p className="text-[11px] text-neutral-600 italic">No description</p>
                    )}
                  </div>
                  <button
                    onClick={() => handleAddClick(list.id)}
                    disabled={isAdded}
                    className="shrink-0 px-3 py-1.5 rounded-lg text-xs font-bold transition-all duration-200 flex items-center gap-1.5 select-none"
                    style={{
                      background: isAdded ? "rgba(16,185,129,0.2)" : "rgba(229,9,20,0.9)",
                      color: isAdded ? "#10b981" : "#fff",
                      border: isAdded ? "1px solid rgba(16,185,129,0.4)" : "1px solid transparent",
                      cursor: isAdded ? "default" : "pointer",
                      boxShadow: isAdded ? "none" : "0 2px 8px rgba(229,9,20,0.3)",
                    }}
                  >
                    {isAdded ? (
                      <><CgPlayListCheck size={14} /> Added</>
                    ) : (
                      <><CgPlayListAdd size={13} /> Add</>
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center text-center gap-3 py-6">
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center"
              style={{
                background: "rgba(229,9,20,0.08)",
                border: "1px solid rgba(229,9,20,0.15)",
              }}
            >
              <CgPlayListAdd size={28} style={{ color: "rgba(229,9,20,0.6)" }} />
            </div>
            <div>
              <p className="text-sm font-semibold text-neutral-300">No playlists yet</p>
              <p className="text-xs text-neutral-500 mt-1">
                Create your first playlist to start organizing.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
