"use client";
import { PlaylistData } from "@/constant/types";
import Link from "next/link";
import { useState } from "react";
import { CgPlayList } from "react-icons/cg";
import {
  FaShareAlt,
  FaGlobe,
  FaLock,
  FaLink,
  FaEye,
  FaTrash,
  // FaEdit,
} from "react-icons/fa";
import { toast } from "react-toastify";
type Props = PlaylistData & {
  handleDelete: (e: React.MouseEvent, id: string) => void;
};

export default function DashboardPlaylistCard({
  id,
  name,
  description,
  visibility,
  share_token,
  created_at,
  handleDelete,
}: Props) {
  const [visibilityModel, setVisibilityModel] = useState(false);
  const [Visibility, setVisibility] = useState(visibility);
  const handleCopyLink = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!id && !share_token) {
      toast.error("No share token available for this playlist.");
      return;
    }
    const base = window.location.origin;

    const urls = {
      public: `${base}/playlist/${id}`,
      unlisted: share_token ? `${base}/playlist/share/${share_token}` : null,
      private: "",
    };

    const shareUrl = urls[Visibility];

    if (!shareUrl) {
      toast.error("This playlist cannot be shared.");
      return;
    }
    navigator.clipboard
      .writeText(shareUrl)
      .then(() => {
        toast.success("Share link copied to clipboard!");
      })
      .catch(() => {
        toast.error("Failed to copy link.");
      });
  };

  const getVisibilityIcon = () => {
    switch (Visibility) {
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

  const getVisibilityBadgeClass = () => {
    switch (Visibility) {
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

  const handleChangeVisibility = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setVisibilityModel(!visibilityModel);
  };

  const handleSetVisibility = async (
    value: "public" | "private" | "unlisted",
  ) => {
    try {
      // ✅ optimistic UI
      setVisibilityModel(false);

      const res = await fetch(`/api/dashboard/playlist/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ visibility: value }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Something went wrong");
      }

      setVisibility(value);
      toast.success(`Visibility changed to ${value}`);
    } catch (err) {
      console.error(err);

      // ❗ rollback لو حصل error
      setVisibility((prev) => prev); // أو رجع القيمة القديمة لو مخزنها

      toast.error("Failed to update visibility");
    }
  };

  // Link to playlist dashboard page or detail route if implemented.
  const href = `/dashboard/playlist/${id}`;

  return (
    <Link
      href={href}
      className="group w-full h-40 rounded-xl border border-neutral-800 hover:border-red-600/50 bg-neutral-900/40 backdrop-blur-md transition-all duration-300 flex hover:shadow-[0_0_20px_rgba(220,38,38,0.15)] shadow-xl"
    >
      {/* Decorative Red Accent Background Hover */}
      <div className="absolute inset-0 bg-liner-to-r from-red-600/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none z-0" />

      {/* Card Content Wrapper */}
      <div className="relative z-10 flex flex-row items-center w-full h-full p-3 gap-4">
        {/* Thumbnail Stack Layout (Left) */}
        <div className="relative h-full aspect-9/16 md:aspect-2/3 shrink-0 rounded-lg overflow-hidden border border-white/5 bg-neutral-950/85 flex flex-col items-center justify-center shadow-inner group-hover:border-red-600/30 transition-colors duration-300">
          {/* Layered Cards Effect to represent a playlist/collection */}
          <div className="absolute top-1.5 w-4/5 h-1 bg-neutral-800/80 rounded-t" />
          <div className="absolute top-3 w-11/12 h-1 bg-neutral-700/60 rounded-t" />

          {/* Main Icon Container */}
          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-red-600/10 border border-red-600/20 group-hover:bg-red-600/20 group-hover:scale-110 transition-all duration-300 shadow-[0_0_15px_rgba(220,38,38,0.1)]">
            <CgPlayList className="text-red-500" size={24} />
          </div>
        </div>

        {/* Text details (Right) */}
        <div className="flex flex-col flex-1 min-w-0 h-full justify-between py-1 gap-1">
          <div>
            {/* Badges / Header */}
            <div className="flex items-center gap-2 mb-1.5 flex-wrap">
              <span className="px-2 py-0.5 rounded-sm bg-neutral-800 text-neutral-400 text-[9px] font-black tracking-widest uppercase border border-neutral-700">
                PLAYLIST
              </span>
              <span
                className={`flex items-center gap-1.5 px-2 py-0.5 rounded-sm text-[9px] font-black tracking-widest uppercase border ${getVisibilityBadgeClass()}`}
              >
                {getVisibilityIcon()}
                {Visibility}
              </span>
            </div>

            {/* Title */}
            <h3
              className="text-lg md:text-xl font-bold text-white leading-tight mb-1 truncate group-hover:text-red-500 transition-colors"
              style={{ fontFamily: "var(--font-bebas)" }}
            >
              {name}
            </h3>

            {/* Description */}
            <p className="text-neutral-400 text-xs line-clamp-2 pr-4 leading-relaxed">
              {description || "No description available."}
            </p>
          </div>

          {/* Footer Metadata & Share Action */}
          <div className="flex items-center justify-between mt-auto">
            {created_at ? (
              <span className="text-[10px] text-neutral-500">
                Created: {created_at}
              </span>
            ) : (
              <div />
            )}

            <div className="flex gap-3">
              {/* Copy button */}

              <button
                onClick={(e) => handleDelete(e, id)}
                title="Delete playlist"
                className="flex items-center justify-center w-8 h-8 rounded-full bg-neutral-800/80 border border-neutral-700/60 hover:bg-red-600 hover:border-red-500 text-neutral-400 hover:text-white transition-all duration-200 cursor-pointer shadow-md hover:scale-105 active:scale-95"
              >
                <FaTrash size={12} />
              </button>

              {Visibility !== "private" ? (
                <button
                  onClick={handleCopyLink}
                  title="Copy share link"
                  className="flex items-center justify-center w-8 h-8 rounded-full bg-neutral-800/80 border border-neutral-700/60 hover:bg-red-600 hover:border-red-500 text-neutral-400 hover:text-white transition-all duration-200 cursor-pointer shadow-md hover:scale-105 active:scale-95"
                >
                  <FaShareAlt size={12} />
                </button>
              ) : null}
              {/* Visibility */}
              <div className="relative">
                <button
                  onClick={handleChangeVisibility}
                  title="Change visibility"
                  className="flex items-center justify-center w-8 h-8 rounded-full bg-neutral-800/80 border border-neutral-700/60 hover:bg-red-600 hover:border-red-500 text-neutral-400 hover:text-white transition-all duration-200 cursor-pointer shadow-md hover:scale-105 active:scale-95"
                >
                  <FaEye size={12} />
                </button>

                {visibilityModel && (
                  <div className="absolute right-0 mt-2 w-40 bg-neutral-900 border border-neutral-700 rounded-xl shadow-lg z-50 overflow-hidden">
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleSetVisibility("public");
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-neutral-800 text-sm flex gap-2 items-center"
                    >
                      <FaGlobe className="text-emerald-500 text-md" /> Public
                    </button>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleSetVisibility("unlisted");
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-neutral-800 text-sm flex gap-2 items-center"
                    >
                      <FaLink className="text-amber-500 text-md" /> Unlisted
                    </button>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleSetVisibility("private");
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-neutral-800 text-sm flex gap-2 items-center"
                    >
                      <FaLock className="text-red-500 text-md" /> Private
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
